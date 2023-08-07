(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./helpers", "path", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findGems = exports.loadGems = exports.includeGems = exports.getGem = exports.hasGem = exports.reloadGem = exports.requireGems = exports.getLoadedGems = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("./helpers");
    const path_1 = tslib_1.__importDefault(require("path"));
    const fs_1 = tslib_1.__importDefault(require("fs"));
    let requiredGems = [];
    let loadedGems = {};
    const getLoadedGems = () => {
        return loadedGems;
    };
    exports.getLoadedGems = getLoadedGems;
    /**
     * Loads all gems from the config file which are NPM packages
     */
    const requireGems = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let config = (0, helpers_1.getConfigFile)();
        if (config.gems)
            yield Promise.all(config.gems.map((gem) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                try {
                    requiredGems[gem] = require(gem);
                }
                catch (error) {
                    (0, helpers_1.log)(`{red-fg}Error requiring gem ${gem}{/red-fg}`, 'gems');
                    (0, helpers_1.log)(error, 'gems');
                }
            })));
    });
    exports.requireGems = requireGems;
    /**
     * Completely reloads a gem, deleting the cache and reloading it
     * @param name
     * @returns
     */
    const reloadGem = (name, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!(0, exports.hasGem)(name))
            return;
        if (loadedGems[name].modules) {
            Object.values(loadedGems[name].modules).forEach((module) => {
                if (require.cache[module])
                    delete require.cache[module];
            });
        }
        if (((_b = (_a = loadedGems[name]) === null || _a === void 0 ? void 0 : _a.script) === null || _b === void 0 ? void 0 : _b.events) && infinityConsole) {
            Object.keys(loadedGems[name].script.events).forEach((event) => {
                infinityConsole
                    .getEventEmitter()
                    .off(event, loadedGems[name].script.events[event]);
                (0, helpers_1.log)(`{red-fg}Removed event ${event}{/red-fg}`, 'gems');
            });
        }
        delete loadedGems[name];
        if (requiredGems[name]) {
            if (require.cache[requiredGems[name]])
                delete require.cache[requiredGems[name]];
            delete requiredGems[name];
            yield (0, exports.requireGems)();
        }
        yield (0, exports.includeGems)(name);
        return loadedGems[name];
    });
    exports.reloadGem = reloadGem;
    /**
     *
     * @param name
     * @returns
     */
    const hasGem = (name) => {
        return loadedGems[name] !== undefined;
    };
    exports.hasGem = hasGem;
    /**
     *
     * @param name
     * @returns
     */
    const getGem = (name) => {
        return loadedGems[name];
    };
    exports.getGem = getGem;
    /**
     *
     * @returns
     */
    const includeGems = (reload) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let gems = [...(yield (0, exports.findGems)()), ...Object.values(requiredGems)];
        let includedGems = Object.assign({}, loadedGems);
        (0, helpers_1.debugLog)(`{yellow-fg}Including ${gems.length} gems{/yellow-fg}`);
        yield Promise.all(gems.map((gem) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            if (reload && reload !== gem)
                return;
            let parsed = path_1.default.parse(gem);
            let sources = yield new Promise((resolve, reject) => {
                (0, helpers_1.safeGlobCB)(parsed.dir + '/**/*', (err, files) => {
                    if (err)
                        reject(err);
                    (0, helpers_1.debugLog)(`\tFound ${files.length} files in ${gem}`);
                    resolve(files);
                });
            });
            let pages = sources.filter((source) => source.includes('/pages/') || source.includes('/Pages/'));
            let components = sources.filter((source) => source.includes('/components/') ||
                source.includes('/components/'));
            let scripts = sources.filter((source) => source.includes('/scripts/') || source.includes('/Scripts/'));
            let modals = sources.filter((source) => source.includes('/modals/') || source.includes('/Modals/'));
            let deployScripts = sources.filter((source) => source.includes('/deploy/') || source.includes('/Deploy/'));
            let windows = sources.filter((source) => source.includes('/windows/') || source.includes('/Windows/'));
            let windowComponents = sources.filter((source) => source.includes('/windows/') ||
                source.includes('/Windows/Components/'));
            let contracts = sources.filter((source) => source.includes('/contracts/') ||
                source.includes('/Contracts/'));
            let routes = sources.filter((source) => source.includes('/routes/') || source.includes('/Routes/'));
            (0, helpers_1.debugLog)('\tAttempting to parse => ' + gem);
            let metadata = JSON.parse(fs_1.default.readFileSync(gem, 'utf8'));
            let allowFileExtensions = [
                '.ts',
                '.js',
                '.tsx',
                '.jsx',
                '.mjs',
                '.cjs',
            ];
            let modules = {};
            ['main', 'setup', 'deploy', 'client'].forEach((_module) => {
                let modulePath = parsed.dir + '/' + _module;
                let moduleFile = allowFileExtensions
                    .map((ext) => modulePath + ext)
                    .find((file) => fs_1.default.existsSync(file));
                if (moduleFile)
                    modules[_module] = moduleFile;
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
            (0, helpers_1.debugLog)(`{green-fg}Parsed Gem => ${parsed.name}{/}`);
            (0, helpers_1.log)(`{cyan-fg}Found Gem => ${parsed.name}{/}`, 'gems');
            (0, helpers_1.log)(`\tPages: ${pages.length}`, 'gems');
            (0, helpers_1.log)(`\tComponents: ${components.length}`, 'gems');
            (0, helpers_1.log)(`\tScripts: ${scripts.length}`, 'gems');
            (0, helpers_1.log)(`\tModals: ${modals.length}`, 'gems');
            (0, helpers_1.log)(`\tDeploy Scripts: ${deployScripts.length}`, 'gems');
            (0, helpers_1.log)(`\tContracts: ${contracts.length}`, 'gems');
            if (modules.main) {
                (0, helpers_1.log)(`\tMain Script: ${modules.main}`, 'gems');
            }
            if (modules.setup) {
                (0, helpers_1.log)(`\tSetup Script: ${modules.setup}`, 'gems');
            }
            if (modules.deploy) {
                (0, helpers_1.log)(`\tDeploy Script: ${modules.deploy}`, 'gems');
            }
            if (modules.client) {
                (0, helpers_1.log)(`\tClient Script: ${modules.client}`, 'gems');
            }
        })));
        loadedGems = includedGems;
        return includedGems;
    });
    exports.includeGems = includeGems;
    const loadGems = (infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let unloadedGems = Object.values(loadedGems).filter((gem) => {
            return !gem.hasLoaded;
        });
        yield Promise.all(unloadedGems.map((gem) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            try {
                if (gem.modules.main && !gem.isOldGem) {
                    let result = yield require(gem.modules.main);
                    result = result.default || result;
                    if (!result)
                        (0, helpers_1.warning)(`Gem ${gem.name} main script has no default export`);
                    else {
                        gem.script = result;
                        loadedGems[gem.name] = gem;
                        if (result.init) {
                            (0, helpers_1.log)(`\tRunning Gem Init => ${gem.name}`, 'gems');
                            yield gem.script.init({
                                infinityConsole,
                                gem,
                                eventEmitter: infinityConsole.getEventEmitter(),
                                script: gem.script,
                                log: (message) => (0, helpers_1.log)(message, 'gems'),
                                debugLog: (message) => (0, helpers_1.debugLog)(message),
                            });
                        }
                        if (gem.script.events) {
                            Object.keys(gem.script.events).forEach((event) => {
                                infinityConsole
                                    .getEventEmitter()
                                    .on(event, gem.script.events[event]);
                                (0, helpers_1.log)(`\tRegistered Event => ${event}`, 'gems');
                            });
                        }
                    }
                }
                gem.hasLoaded = true;
            }
            catch (error) {
                (0, helpers_1.log)(`{red-fg}Error loading Gem => ${gem.name}{/}`, 'gems');
                (0, helpers_1.log)(`\t${error.message}`, 'gems');
                (0, helpers_1.log)(`\t${error.stack}`, 'gems');
            }
        })));
    });
    exports.loadGems = loadGems;
    /**
     *
     * @returns
     */
    const findGems = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let locations = [(0, helpers_1.cwd)() + '/gems/**/*.json'];
        let config = (0, helpers_1.getConfigFile)();
        if (!(0, helpers_1.isInfinityMint)())
            locations.push((0, helpers_1.cwd)() + '/node_modules/infinitymint/gems/**/*.json');
        if (config.roots)
            config.roots.forEach((root) => {
                if (root.startsWith('../') ||
                    root.startsWith('./') ||
                    root.startsWith('/../'))
                    root =
                        (0, helpers_1.cwd)() +
                            '/' +
                            (root.startsWith('/') ? root.substring(1) : root);
                if (!root.endsWith('/'))
                    root += '/';
                locations.push(root + 'gems/**/*.json');
                locations.push(root + 'mods/**/*.json');
            });
        let roots = [];
        yield Promise.all(locations.map((location) => new Promise((resolve, reject) => {
            (0, helpers_1.safeGlobCB)(location, (err, files) => {
                if (err)
                    reject(err);
                //check that the folder before the file name in the location is not called 'resources'
                files = files.filter((location) => {
                    let parsed = path_1.default.parse(location);
                    let folder = parsed.dir.split('/').pop();
                    return folder !== 'resources';
                });
                files.forEach((file) => {
                    roots.push(file);
                });
                resolve(true);
            });
        })));
        return roots;
    });
    exports.findGems = findGems;
});
//# sourceMappingURL=gems.js.map