import {
    getConfigFile,
    cwd,
    isInfinityMint,
    log,
    Dictionary,
    debugLog,
    logDirect,
    warning,
    safeGlobCB,
} from './helpers';
import { Gem, InfinityMintGemConfig } from './interfaces';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import InfinityConsole from './console';

let requiredGems: string[] = [];
let loadedGems: Dictionary<Gem> = {};

export const getLoadedGems = () => {
    return loadedGems;
};

/**
 * Loads all gems from the config file which are NPM packages
 */
export const requireGems = async () => {
    let config = getConfigFile();
    if (config.gems)
        await Promise.all(
            config.gems.map(async (gem: string) => {
                try {
                    requiredGems[gem] = require(gem);
                } catch (error) {
                    log(`{red-fg}Error requiring gem ${gem}{/red-fg}`, 'gems');
                    log(error, 'gems');
                }
            })
        );
};

/**
 * Completely reloads a gem, deleting the cache and reloading it
 * @param name
 * @returns
 */
export const reloadGem = async (
    name: string,
    infinityConsole?: InfinityConsole
) => {
    if (!hasGem(name)) return;

    if (loadedGems[name].modules) {
        Object.values(loadedGems[name].modules).forEach((module) => {
            if (require.cache[module]) delete require.cache[module];
        });
    }
    if (loadedGems[name]?.script?.events && infinityConsole) {
        Object.keys(loadedGems[name].script.events).forEach((event) => {
            infinityConsole
                .getEventEmitter()
                .off(event, loadedGems[name].script.events[event]);
            log(`{red-fg}Removed event ${event}{/red-fg}`, 'gems');
        });
    }
    delete loadedGems[name];
    if (requiredGems[name]) {
        if (require.cache[requiredGems[name]])
            delete require.cache[requiredGems[name]];
        delete requiredGems[name];
        await requireGems();
    }
    await includeGems(name);
    return loadedGems[name];
};

/**
 *
 * @param name
 * @returns
 */
export const hasGem = (name: string) => {
    return loadedGems[name] !== undefined;
};

/**
 *
 * @param name
 * @returns
 */
export const getGem = (name: string) => {
    return loadedGems[name];
};

/**
 *
 * @returns
 */
export const includeGems = async (reload?: string) => {
    let gems = [...(await findGems()), ...Object.values(requiredGems)];
    let includedGems: Dictionary<Gem> = { ...loadedGems };
    debugLog(`{yellow-fg}Including ${gems.length} gems{/yellow-fg}`);
    await Promise.all(
        gems.map(async (gem) => {
            if (reload && reload !== gem) return;
            let parsed = path.parse(gem);
            let sources: string[] = await new Promise((resolve, reject) => {
                safeGlobCB(parsed.dir + '/**/*', (err, files) => {
                    if (err) reject(err);

                    debugLog(`\tFound ${files.length} files in ${gem}`);
                    resolve(files);
                });
            });

            let pages = sources.filter(
                (source) =>
                    source.includes('/pages/') || source.includes('/Pages/')
            );
            let components = sources.filter(
                (source) =>
                    source.includes('/components/') ||
                    source.includes('/components/')
            );
            let scripts = sources.filter(
                (source) =>
                    source.includes('/scripts/') || source.includes('/Scripts/')
            );
            let modals = sources.filter(
                (source) =>
                    source.includes('/modals/') || source.includes('/Modals/')
            );
            let deployScripts = sources.filter(
                (source) =>
                    source.includes('/deploy/') || source.includes('/Deploy/')
            );
            let windows = sources.filter(
                (source) =>
                    source.includes('/windows/') || source.includes('/Windows/')
            );
            let windowComponents = sources.filter(
                (source) =>
                    source.includes('/windows/') ||
                    source.includes('/Windows/Components/')
            );
            let contracts = sources.filter(
                (source) =>
                    source.includes('/contracts/') ||
                    source.includes('/Contracts/')
            );
            let routes = sources.filter(
                (source) =>
                    source.includes('/routes/') || source.includes('/Routes/')
            );

            debugLog('\tAttempting to parse => ' + gem);

            let metadata = JSON.parse(
                fs.readFileSync(gem, 'utf8')
            ) as InfinityMintGemConfig;

            let allowFileExtensions = [
                '.ts',
                '.js',
                '.tsx',
                '.jsx',
                '.mjs',
                '.cjs',
            ];
            let modules: any = {};
            ['main', 'setup', 'deploy', 'client'].forEach((_module) => {
                let modulePath = parsed.dir + '/' + _module;
                let moduleFile = allowFileExtensions
                    .map((ext) => modulePath + ext)
                    .find((file) => fs.existsSync(file));
                if (moduleFile) modules[_module] = moduleFile;
            });

            includedGems[parsed.name] = {
                name: parsed.name,
                metadata,
                pages,
                modules,
                routes,
                scripts,
                windowComponents,
                components,
                deployScripts,
                hasLoaded: false,
                contracts,
                isOldGem: metadata.infinitymint === undefined,
                hasDeployScript: modules.deploy !== undefined,
                hasClientScript: modules.client !== undefined,
                hasSetupScript: modules.setup !== undefined,
                hasMainScript: modules.main !== undefined,
                modals,
                windows,
                sources,
            };
            debugLog(`{green-fg}Parsed Gem => ${parsed.name}{/}`);

            log(`{cyan-fg}Found Gem => ${parsed.name}{/}`, 'gems');
            log(`\tPages: ${pages.length}`, 'gems');
            log(`\tComponents: ${components.length}`, 'gems');
            log(`\tScripts: ${scripts.length}`, 'gems');
            log(`\tModals: ${modals.length}`, 'gems');
            log(`\tDeploy Scripts: ${deployScripts.length}`, 'gems');
            log(`\tContracts: ${contracts.length}`, 'gems');

            if (modules.main) {
                log(`\tMain Script: ${modules.main}`, 'gems');
            }
            if (modules.setup) {
                log(`\tSetup Script: ${modules.setup}`, 'gems');
            }
            if (modules.deploy) {
                log(`\tDeploy Script: ${modules.deploy}`, 'gems');
            }
            if (modules.client) {
                log(`\tClient Script: ${modules.client}`, 'gems');
            }
        })
    );
    loadedGems = includedGems;
    return includedGems;
};

export const loadGems = async (infinityConsole: InfinityConsole) => {
    let unloadedGems = Object.values(loadedGems).filter((gem) => {
        return !gem.hasLoaded;
    }) as Gem[];

    await Promise.all(
        unloadedGems.map(async (gem) => {
            try {
                if (gem.modules.main && !gem.isOldGem) {
                    let result = await require(gem.modules.main);
                    result = result.default || result;
                    if (!result)
                        warning(
                            `Gem ${gem.name} main script has no default export`
                        );
                    else {
                        gem.script = result;

                        loadedGems[gem.name] = gem;

                        if (result.init) {
                            log(`\tRunning Gem Init => ${gem.name}`, 'gems');
                            await gem.script.init({
                                infinityConsole,
                                gem,
                                eventEmitter: infinityConsole.getEventEmitter(),
                                script: gem.script,
                                log: (message: string) => log(message, 'gems'),
                                debugLog: (message: string) =>
                                    debugLog(message),
                            });
                        }

                        if (gem.script.events) {
                            Object.keys(gem.script.events).forEach((event) => {
                                infinityConsole
                                    .getEventEmitter()
                                    .on(event, gem.script.events[event]);
                                log(`\tRegistered Event => ${event}`, 'gems');
                            });
                        }
                    }
                }

                gem.hasLoaded = true;
            } catch (error) {
                log(`{red-fg}Error loading Gem => ${gem.name}{/}`, 'gems');
                log(`\t${error.message}`, 'gems');
                log(`\t${error.stack}`, 'gems');
            }
        })
    );
};

/**
 *
 * @returns
 */
export const findGems = async () => {
    let locations = [cwd() + '/gems/**/*.json'];
    let config = getConfigFile();

    if (!isInfinityMint())
        locations.push(cwd() + '/node_modules/infinitymint/gems/**/*.json');

    if (config.roots)
        config.roots.forEach((root) => {
            if (root[root.toString().length - 1] !== '/') root = root + '/';
            locations.push(cwd() + '/' + root + 'gems/**/*.json');
            locations.push(cwd() + '/' + root + 'mods/**/*.json');
        });

    let roots = [];

    await Promise.all(
        locations.map(
            (location) =>
                new Promise((resolve, reject) => {
                    safeGlobCB(location, (err, files) => {
                        if (err) reject(err);

                        //check that the folder before the file name in the location is not called 'resources'
                        files = files.filter((location) => {
                            let parsed = path.parse(location);
                            let folder = parsed.dir.split('/').pop();
                            return folder !== 'resources';
                        });

                        files.forEach((file) => {
                            roots.push(file);
                        });
                        resolve(true);
                    });
                })
        )
    );

    return roots;
};
