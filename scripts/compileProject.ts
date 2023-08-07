import {
    getCompiledProject,
    getProject,
    getProjectFullName,
    getProjectSource,
    getScriptTemporaryProject,
    hasCompiledProject,
} from '../app/projects';
import {
    InfinityMintProject,
    InfinityMintProjectAsset,
    InfinityMintProjectContent,
    InfinityMintProjectJavascript,
    InfinityMintProjectPath,
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';
import {
    getInfinityMintVersion,
    prepare,
    action,
    always,
    cwd,
    getConfigFile,
    warning,
    replaceSeperators,
} from '../app/helpers';
import { createHash } from 'node:crypto';
import { addImport, getImports } from '../app/imports';
import fs from 'fs';
import { InfinityMintSVGSettings } from '../app/content';
import { InfinityMintCompiledProject } from '../app/interfaces';
import JSZip from 'jszip';
import { getIPFSConfig, ipfs, isAllowingIPFS } from '../app/ipfs';

const compile: InfinityMintScript = {
    name: 'Compile',
    description:
        'Compile an InfinityMint project ready for deployment. The compiled file will garuntee that all the assets used in the minter are uploaded to IPFS and accessible at all times.',
    execute: async (script: InfinityMintScriptParameters) => {
        let project = getScriptTemporaryProject(script, 'compiled'); //gets a temporary project file if there is one for a compilation, if not will just return the source project aka the .ts file or .js file
        let continueWith = script.args.continue ? script.args.continue : false;
        let recompile = script.args.recompile ? script.args.recompile : true;

        if (!continueWith) {
            script.log(
                `{red-fg}Not continuing with previous compilation will make a new one{/}`
            );
            project = getScriptTemporaryProject(script, 'source');
        }

        if (recompile && hasCompiledProject(project)) {
            let compiledProject = getCompiledProject(project);
            script.log(
                `Removing compiled project: ${getProjectFullName(
                    project,
                    compiledProject.version.version
                )}`
            );
            fs.unlinkSync(
                cwd() +
                    '/projects/compiled/' +
                    getProjectFullName(
                        project,
                        compiledProject.version.version
                    ) +
                    '.json'
            );
            //reset the project back to the source
            project = getScriptTemporaryProject(script, 'source');
        }

        if (!project.version)
            project.version = {
                version: '1.0.0',
                tag: 'initial',
            };

        //sets the project and script to be the one used by the action method. Must be called before any action is called or any always is called
        prepare(project, script, 'compile');

        //rechange the modules over if they have changed
        if (script.project.modules)
            Object.keys(script.project.modules).map((key) => {
                project.modules[key] = script.project.modules[key];
            });

        if (
            (project as any).javascript &&
            (project as any).newStandard !== true
        ) {
            let upgrade = await action('upgrade', async () => {
                script.log(
                    `{cyan-fg}{bold}Upgrading ${project.name}@${
                        project.version.version
                    } with InfinityMint@${getInfinityMintVersion()}{/}`
                );
                project.information = {
                    ...((project as any)?.description || {}),
                    ...(project.information || {}),
                };

                let javaScriptProject =
                    project as any as InfinityMintProjectJavascript;
                project.information.tokenSingular =
                    javaScriptProject.description.token;
                project.information.tokenMultiple =
                    javaScriptProject.description.tokenPlural;

                project.price =
                    project.price ||
                    javaScriptProject.deployment.startingPrice.toString() ||
                    0;

                if ((project as any).description)
                    delete (project as any).description;

                project.modules = {
                    ...javaScriptProject.modules,
                    assets: javaScriptProject.modules.controller,
                } as any;

                if (project.settings === undefined) project.settings = {};

                //move deployment variables to the settings
                if (javaScriptProject.deployment) {
                    project.settings.values = javaScriptProject.deployment;

                    if ((project as any).deployment)
                        delete (project as any).deployment;
                }

                if (javaScriptProject.royalties) {
                    project.settings.royalty =
                        javaScriptProject.royalties as any;

                    if ((project as any).royalties)
                        delete (project as any).royalties;
                }

                if (javaScriptProject.approved)
                    project.permissions = {
                        ...(project.permissions || {}),
                        all: javaScriptProject.approved,
                    };
                if (javaScriptProject.mods) {
                    (project as any).gems = javaScriptProject.mods;
                    if ((project as any).mods) delete (project as any).mods;
                }
            });
            if (upgrade !== true) throw upgrade;
        }

        let importCache = await getImports();
        let result = await always('compile', async () => {
            if (hasCompiledProject(project) && !recompile) {
                script.log(
                    `{yellow-fg}Project has already been compiled, please delete the project manually or set recompile to true in arguments{/}`
                );
                return;
            }
            script.log(
                `{cyan-fg}{bold}Compiling Project ${project.name}@${
                    project.version.version
                } with InfinityMint@${getInfinityMintVersion()}{/}`
            );
            //sets where this project is stored locally
            project.source = getProjectSource(project);

            let verify = await always('verify', async () => {
                let errors: string[] = [];
                let files: string[] = [];
                let hasErrors = false;
                let tempPaths =
                    (project as InfinityMintProject).javascript &&
                    !(project as any).newStandard
                        ? (project as any)?.paths?.indexes ||
                          (project as any)?.paths ||
                          []
                        : project.paths;
                tempPaths = Object.values(tempPaths || {});

                let basePath =
                    (project as InfinityMintProject).javascript &&
                    !(project as any).newStandard
                        ? (project as any)?.paths?.default ||
                          (script.project as InfinityMintProject)?.basePath ||
                          {}
                        : (script.project as InfinityMintProject)?.basePath ||
                          ({} as InfinityMintProjectPath);

                let tempAssets: InfinityMintProjectAsset[] = [];

                //unpack the assets array adding the section key
                if (project.assets instanceof Array) {
                    tempAssets = project.assets || [];
                } else {
                    Object.keys(project.assets || {}).forEach((section) => {
                        Object.values(
                            project.assets
                                ? (project.assets[
                                      section
                                  ] as InfinityMintProjectAsset[])
                                : {}
                        ).forEach((asset: InfinityMintProjectAsset) => {
                            tempAssets.push({ ...asset, section: section });
                        });
                    });
                }

                let baseAsset =
                    (script.project as InfinityMintProject)?.baseAsset ||
                    ({} as InfinityMintProjectAsset);

                let verifyImport = (
                    path: InfinityMintProjectPath | InfinityMintProjectAsset,
                    i: number,
                    type?: 'asset' | 'path' | 'content'
                ) => {
                    type = type || 'path';
                    let fileName = path.fileName.toString().toLowerCase();
                    script.debugLog('checking import => ' + fileName);
                    script.log('\t{cyan-fg}Verifying ' + fileName + '{/}');
                    //now lets check if the path exists in the import database

                    if (
                        !importCache.keys[fileName] ||
                        !importCache.database[importCache.keys[fileName]]
                    ) {
                        if (fileName[0] !== '/') fileName = '/' + fileName;

                        if (
                            !fs.existsSync(cwd() + fileName) &&
                            !fs.existsSync(
                                replaceSeperators(
                                    project.source.dir + '/../' + fileName
                                )
                            ) &&
                            !!fs.existsSync(
                                replaceSeperators(
                                    project.source.dir +
                                        '/../imports/' +
                                        fileName
                                )
                            )
                        ) {
                            hasErrors = true;
                            errors.push(
                                `${type} (${i}) content error: File not found in ${
                                    project.source.dir
                                } or ${project.source.dir + '/imports/'}=> ` +
                                    fileName
                            );
                            return;
                        } else {
                            let filePath;

                            if (fs.existsSync(cwd() + fileName))
                                filePath = cwd() + fileName;
                            else if (
                                fs.existsSync(
                                    replaceSeperators(
                                        project.source.dir + '/../' + fileName
                                    )
                                )
                            )
                                filePath = replaceSeperators(
                                    project.source.dir + '/../' + fileName
                                );
                            else
                                filePath = replaceSeperators(
                                    project.source.dir +
                                        '/../imports/' +
                                        fileName
                                );

                            script.log(
                                '\t{yellow-fg}Adding ' +
                                    filePath +
                                    ' to import cache{/}'
                            );
                            //add it to the import base
                            importCache = addImport(filePath);
                        }
                    }

                    let file = importCache.database[importCache.keys[fileName]];

                    if (!file?.checksum || file?.checksum?.length === 0) {
                        hasErrors = true;
                        errors.push(
                            `${type} (${i}) content error: Checksum not found! Try refreshing import cache => ` +
                                fileName
                        );
                        return;
                    }
                    let stats = fs.statSync(file.dir + '/' + file.base);

                    if (stats.size === 0) {
                        hasErrors = true;
                        errors.push(
                            `${type} (${i}) content error: File size is zero (means file is empty) => ` +
                                fileName
                        );
                        return;
                    }

                    files.push(fileName);

                    if (path.content) {
                        script.log('\t{cyan-fg}Verifying content...{/}');
                        Object.keys(path.content).forEach((contentKey) => {
                            let content = path.content[contentKey];

                            if (
                                content !== null &&
                                typeof content === 'object' &&
                                !content?.fileName
                            ) {
                                script.log(
                                    '\t{yellow-fg}no filename assuming none import => {/}' +
                                        contentKey
                                );
                                content.fileName = 'none';
                            } else if (typeof content === 'string') {
                                content = {
                                    fileName: content,
                                    name: contentKey,
                                };
                            } else {
                                script.log(
                                    '\t{yellow-fg}weird type assuming none => {/}' +
                                        contentKey
                                );
                                content = {
                                    fileName: 'none',
                                    name: 'none',
                                };
                            }

                            fileName = content.fileName
                                .toString()
                                .toLowerCase();

                            script.log(
                                '\t{cyan-fg}Checking Content: ' +
                                    fileName +
                                    '{/}'
                            );

                            if (
                                fileName === 'undefined' ||
                                fileName === 'null' ||
                                fileName === 'NaN' ||
                                fileName === 'none' ||
                                fileName.length === 0
                            ) {
                                script.log(
                                    '\t{red-fg}Unable to verify content => ' +
                                        fileName +
                                        '{/}'
                                );
                            } else {
                                if (!importCache.keys[fileName]) {
                                    if (fileName[0] !== '/')
                                        fileName = '/' + fileName;

                                    if (
                                        !fs.existsSync(cwd() + fileName) &&
                                        !fs.existsSync(
                                            project.source.base +
                                                '../' +
                                                fileName
                                        )
                                    ) {
                                        hasErrors = true;
                                        errors.push(
                                            `${type} (${i}) content error: File not found => ` +
                                                fileName
                                        );
                                        return;
                                    } else {
                                        let filePath = fs.existsSync(
                                            cwd() + fileName
                                        )
                                            ? cwd() + fileName
                                            : project.source.base +
                                              '../' +
                                              fileName;
                                        script.log(
                                            '\t{yellow-fg}Adding ' +
                                                filePath +
                                                ' to import cache{/}'
                                        );
                                        //add it to the import base
                                        importCache = addImport(filePath);
                                    }
                                }
                                files.push(fileName);
                            }

                            script.log('\t\t{green-fg}Success{/}');
                        });
                    }

                    if (
                        typeof path.settings === 'string' &&
                        !importCache.database[importCache.keys[path.settings]]
                    ) {
                        hasErrors = true;
                        errors.push(
                            `${type} (${i}) settings reference error: Settings file not found => ` +
                                path.settings
                        );
                    }

                    //now lets check the imports database for settings files and if the locaiton actually exists
                    files.forEach((file: string) => {
                        let thatImport =
                            importCache.database[
                                importCache.keys[file.toLowerCase()]
                            ];

                        if (
                            !fs.existsSync(
                                thatImport.dir + '/' + thatImport.base
                            )
                        ) {
                            hasErrors = true;
                            errors.push(
                                `${type} (${i}) reference error: File does not exist locally => ` +
                                    thatImport.dir +
                                    '/' +
                                    thatImport.base
                            );
                            return;
                        }

                        if (
                            thatImport.settings &&
                            thatImport.settings.length !== 0
                        ) {
                            thatImport.settings.forEach((setting) => {
                                let settingLocation =
                                    setting.dir + '/' + setting.base;
                                if (!fs.existsSync(settingLocation)) {
                                    hasErrors = true;
                                    errors.push(
                                        `${type} (${i}) settings error: Settings file not found => ` +
                                            settingLocation
                                    );
                                } else
                                    script.log(
                                        '\t{cyan-fg}Verified Settings: ' +
                                            settingLocation +
                                            '{/}'
                                    );
                            });
                        }
                    });
                };

                for (let i = 0; i < tempPaths.length; i++) {
                    let path = tempPaths[i];

                    path = {
                        ...basePath,
                        ...path,
                    };
                    path.content = {
                        ...(basePath.content || {}),
                        ...(path.content || {}),
                    };
                    path.valid = false;
                    script.log(
                        `{yellow-fg}[Path ${i}] Verifying...{/yellow-fg}`
                    );
                    script.infinityConsole.emit('preVerify', path, typeof path);
                    verifyImport(path, i);
                    if (hasErrors) {
                        script.log(`{red-fg}[Path ${i}] ERROR OCCURED{/}`);
                    } else {
                        path.valid = true;
                        script.log(`{green-fg}[Path ${i}] VERIFIED{/}`);
                    }
                    script.infinityConsole.emit(
                        'postVerify',
                        path,
                        typeof path
                    );
                    hasErrors = false;
                    tempPaths[i] = path as InfinityMintProjectPath;
                }

                for (let i = 0; i < tempAssets.length; i++) {
                    let asset = tempAssets[i];
                    asset = {
                        ...baseAsset,
                        ...asset,
                    };

                    asset.content = {
                        ...(baseAsset.content || {}),
                        ...(asset.content || {}),
                    };
                    asset.valid = false;
                    script.log(
                        `{yellow-fg}[Asset ${i}] Verifying...{/yellow-fg}`
                    );
                    script.infinityConsole.emit(
                        'preVerify',
                        asset,
                        typeof asset
                    );
                    verifyImport(asset, i, 'asset');
                    if (hasErrors) {
                        script.log(`{red-fg}[Asset ${i}] ERROR OCCURED{/}`);
                    } else {
                        asset.valid = true;
                        script.log(`{green-fg}[Asset ${i}] VERIFIED{/}`);
                    }
                    script.infinityConsole.emit(
                        'postVerify',
                        asset,
                        typeof asset
                    );
                    hasErrors = false;
                    tempAssets[i] = asset as InfinityMintProjectAsset;
                }

                //if errors are not length of zero then throw them!
                if (errors.length !== 0) throw errors;

                //set it
                project.paths = tempPaths;
                project.assets = tempAssets;
            });

            if (verify !== true) {
                if (verify instanceof Array !== true) throw verify as Error;
                (verify as Error[]).forEach((error) => {
                    script.infinityConsole.log(`{red-fg}${error}{/red-fg}`);
                });

                throw new Error(
                    'failed verification of assets/paths. please check errors above.'
                );
            }

            let setup = await always('setup', async () => {
                let imports = project.imports || {};
                let config = getConfigFile();
                let setupImport = async (
                    path: InfinityMintProjectPath | InfinityMintProjectAsset
                ) => {
                    script.log(`\t{cyan-fg}Setting Up{/} => ${path.fileName}`);
                    let fileName = path.fileName.toString().toLowerCase(); //because of issue with uppercase/lowercase filenames we lowercase it first
                    let pathImport = importCache.database[
                        importCache.keys[fileName]
                    ] || {
                        extension: 'none',
                        name: 'none',
                        dir: 'none',
                        checksum: 'none',
                        base: 'none',
                        settings: [],
                    };
                    path.source = pathImport;

                    //if its a string then grab that file and add it to pathImports
                    if (typeof path.settings === 'string') {
                        let settings =
                            importCache.database[
                                importCache.keys[path.settings]
                            ];
                        pathImport.settings = [
                            ...pathImport.settings,
                            settings as any,
                        ];
                        path.settings = {};
                    }

                    //puts the settings for the import into the path
                    if (pathImport?.settings) {
                        pathImport.settings.map((setting) => {
                            if (!path.settings) path.settings = {};
                            else if (typeof path.settings === 'object')
                                path.settings = {
                                    '@project': path.settings,
                                };
                            else path.settings = {};
                            script.log(
                                `\t{cyan-fg}Found Settings{/} => ${
                                    setting.dir + '/' + setting.base
                                } (${setting.ext})`
                            );
                            if (setting.ext === '.json') {
                                path.settings[
                                    setting.dir + '/' + setting.base
                                ] = {
                                    ...JSON.parse(
                                        fs.readFileSync(
                                            setting.dir + '/' + setting.base,
                                            {
                                                encoding: 'utf-8',
                                            }
                                        )
                                    ),
                                    source: setting,
                                } as InfinityMintSVGSettings;
                            } else if (
                                setting.ext === '.js' ||
                                setting.ext === '.ts'
                            ) {
                                let result = require(setting.dir +
                                    '/' +
                                    setting.base);
                                result = result.default;

                                path.settings[
                                    setting.dir + '/' + setting.base
                                ] = {
                                    ...(typeof result === 'function'
                                        ? result()
                                        : result),
                                    source: setting,
                                } as InfinityMintSVGSettings;
                            } else {
                                throw new Error(
                                    'unknown settings file extension: ' +
                                        setting.dir +
                                        '/' +
                                        setting.base
                                );
                            }

                            imports[setting.dir + '/' + setting.base] =
                                setting.dir + '/' + setting.base;
                        });

                        Object.values(path.settings || {}).forEach(
                            (svgSetting: InfinityMintSVGSettings) => {
                                if (!svgSetting?.style?.css) return;
                                let path: string = svgSetting!.style!
                                    .css as string;
                                path = path[0] === '/' ? '' : '/' + path;
                                if (svgSetting!.style!.css instanceof Array)
                                    svgSetting!.style!.css.forEach((style) => {
                                        style =
                                            (style[0] === '/' ? '' : '/') +
                                            style;
                                        if (!importCache.keys[style])
                                            throw new Error(
                                                `${
                                                    svgSetting!.source!.dir +
                                                    '/' +
                                                    svgSetting!.source!.base
                                                } bad css reference: ${style}`
                                            );
                                        else {
                                            script.log(
                                                `\t{cyan-fg}Included CSS reference{/} => ${style}`
                                            );
                                            let truePath =
                                                svgSetting.source.dir.split(
                                                    'imports'
                                                )[0] + style;
                                            imports[style] = truePath;
                                            imports[
                                                project.name + '@' + style
                                            ] = truePath;
                                            imports[
                                                getProjectFullName(project) +
                                                    style
                                            ] = truePath;
                                            imports[cwd() + style] = truePath;
                                            imports[
                                                (
                                                    svgSetting.source.dir +
                                                    style
                                                ).replace(/\/\//g, '/')
                                            ] = truePath;
                                            imports[truePath] = truePath;
                                        }
                                    });
                                else if (!importCache.keys[path])
                                    throw new Error(
                                        `${
                                            svgSetting!.source!.dir +
                                            '/' +
                                            svgSetting!.source!.base
                                        } has a bad css reference: ${path}`
                                    );
                                else {
                                    script.log(
                                        `\t{cyan-fg}Included CSS reference{/} => ${path}`
                                    );
                                    let truePath =
                                        svgSetting.source.dir.split(
                                            'imports'
                                        )[0] + path;
                                    imports[path] = truePath;
                                    imports[svgSetting.source.dir + path] =
                                        truePath;
                                    imports[cwd() + path] = truePath;
                                    imports[project.name + '@' + path] =
                                        truePath;
                                    imports[
                                        getProjectFullName(project) + path
                                    ] = truePath;
                                    imports[truePath] = truePath;
                                }
                            }
                        );

                        if (path.content) {
                            script.log(
                                '\t{yellow-fg}Setting Up Path Content...{/}'
                            );
                            let keys = Object.keys(path.content);
                            for (let i = 0; i < keys.length; i++) {
                                let content = keys[i];
                                let newImport = {
                                    fileName:
                                        path.content[content].fileName ||
                                        path.content[content],
                                    name: content,
                                    ...(typeof path.content[content] ===
                                    'object'
                                        ? path.content[content]
                                        : {}),
                                } as InfinityMintProjectContent;

                                script.infinityConsole.emit(
                                    'preCompileSetup',
                                    newImport,
                                    typeof newImport
                                );
                                await setupImport(newImport);
                                newImport.compiled = true;
                                script.infinityConsole.emit(
                                    'postCompileSetup',
                                    newImport,
                                    typeof newImport
                                );
                                path.content![content] = newImport;
                            }
                        }

                        script.log('\t\t{green-fg}Success{/}');
                    }

                    //create basic exports object to fill in later
                    path.export = {
                        key: `${project.name}@${fileName}`,
                        checksum: path?.source?.checksum,
                        project: project.name,
                        version: project.version || {
                            version: '1.0.0',
                            tag: 'initial',
                        },
                        stats:
                            path?.source && path.source.base !== 'none'
                                ? fs.statSync(
                                      `${path.source.dir}/${path.source.base}`
                                  )
                                : ({} as any),
                        exported: Date.now(),
                    };

                    if (isAllowingIPFS()) {
                        try {
                            script.log(`\t{cyan-fg}Uploading to IPFS{/}`);
                            let cid = await ipfs.add(
                                fs.readFileSync(
                                    path.source.dir + '/' + path.source.base
                                ),
                                path.source.base
                            );
                            let ipfsConfig = getIPFSConfig();
                            let endpoint =
                                ipfsConfig.endpoint ||
                                'https://dweb.link/ipfs/';

                            if (!path.export.external)
                                path.export.external = {};

                            path.export.external.ipfs = {
                                hash: cid,
                                url: `${endpoint}${cid}/${path.source.base}`,
                                fileName: path.source.base,
                            };
                            script.log(
                                `\t\t{green-fg}Successly uploaded to IPFS{/} => ${path.export.external.ipfs.url}`
                            );
                        } catch (error) {
                            script.log(`{red-fg}Failed to upload to IPFS{/}`);
                            script.log(error);
                        }
                    }

                    if (path.export.key)
                        imports[path.export.key] =
                            path.source.dir + '/' + path.source.base;

                    if (path.source)
                        imports[path.source.dir + '/' + path.source.base] =
                            path.source.dir + '/' + path.source.base;

                    imports[project.name + '@' + fileName] =
                        path.source.dir + '/' + path.source.base;

                    let fileNameWithSlash =
                        (fileName[0] === '/' ? '' : '/') + fileName;

                    imports[fileName] =
                        path.source.dir + '/' + path.source.base;
                    imports[fileNameWithSlash] =
                        path.source.dir + '/' + path.source.base;
                    imports[cwd() + fileNameWithSlash] =
                        path.source.dir + '/' + path.source.base;
                    imports[getProjectFullName(project) + fileNameWithSlash] =
                        path.source.dir + '/' + path.source.base;

                    path.checksum = createHash('md5')
                        .update(JSON.stringify(JSON.stringify(path)))
                        .digest('hex');
                    script.log(
                        `\t{cyan-fg}Object checksum{/cyan-fg} => ${path.checksum}`
                    );
                };

                //here we need to loop through paths and see if we find settings
                for (let i = 0; i < project.paths.length; i++) {
                    script.infinityConsole.emit(
                        'preCompileSetup',
                        project.paths[i],
                        typeof project.paths[i]
                    );
                    script.log(`[Path ${i}] {yellow-fg}Setting up...{/}`);
                    await setupImport(project.paths[i]);
                    script.log(`{green-fg}[Path ${i}] VERIFIED{/}`);
                    project.paths[i].pathId = i;
                    project.paths[i].compiled = true;
                    script.infinityConsole.emit(
                        'postCompileSetup',
                        project.paths[i],
                        typeof project.paths[i]
                    );
                }

                //here we need to loop through assets as well
                if (project.assets) {
                    if (project.assets instanceof Array) {
                        for (let i = 0; i < project.assets.length; i++) {
                            script.infinityConsole.emit(
                                'preCompileSetup',
                                project.assets[i],
                                typeof project.assets[i]
                            );
                            script.log(
                                `[Asset ${i}] {yellow-fg}Setting up...{/}`
                            );
                            await setupImport(project.assets[i]);
                            script.log(`{green-fg}[Asset ${i}] VERIFIED{/}`);
                            project.assets[i].assetId = i + 1; //asset ids start counting from 1 as asset id 0 is null asset
                            project.assets[i].compiled = true; //asset ids start counting from 1 as asset id 0 is null asset
                            script.infinityConsole.emit(
                                'postCompileSetup',
                                project.assets[i],
                                typeof project.assets[i]
                            );
                        }
                    } else {
                        throw new Error('assets should be flat by this point');
                    }
                }

                //replace double slashes with single slashes in each member of imports
                Object.keys(imports).forEach((key) => {
                    imports[key] = imports[key].replace(/\/\//g, '/');
                });

                project.imports = imports;
                project.compiled = true;
            });

            if (setup !== true) throw setup;

            let buildImports = await action('buildImports', async () => {
                let imports =
                    (project as InfinityMintCompiledProject).imports || {};
                let keys = Object.keys(imports);
                let importCache = await getImports();

                if (keys.length === 0)
                    throw new Error('project has no imports this is weird!');
                //this is where we need to go over every file reference in the project and include all of them

                let files = {};
                Object.keys(imports).forEach((key) => {
                    if (!files[imports[key]])
                        files[imports[key]] = imports[key];
                });

                script.log(
                    `{yellow-fg}Packing ${
                        Object.keys(files).length
                    } imports...{/}`
                );

                project.bundles = {
                    version: getInfinityMintVersion(),
                    imports: {},
                };

                let rawBundle = {};
                //pack all the files
                await Promise.all(
                    Object.keys(files).map(async (file: string) => {
                        let path = importCache.database[importCache.keys[file]];
                        let location = (path.dir + '/' + path.base).split(
                            'imports'
                        )[1];
                        if (path === undefined || path.dir === undefined)
                            return;

                        project.bundles.imports[importCache.keys[file]] = path;
                        rawBundle[location] = await fs.promises.readFile(
                            path.dir + '/' + path.base
                        );
                        project.bundles.imports[importCache.keys[file]].bundle =
                            location;
                        script.log(`\t{cyan-fg}Read => ${location}{/}`);
                    })
                );

                //build a zip file out of each member of the raw bundle
                let zip = new JSZip();
                Object.keys(rawBundle).forEach((key) => {
                    script.log(`\t\t{green-fg}Zipping => ${key}{/}`);
                    zip.file(key, rawBundle[key]);
                });

                zip.file('project.json', JSON.stringify(project));

                let zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

                script.log(`\t{cyan-fg}Saving Bundle...{/}`);
                if (!fs.existsSync(cwd() + '/projects/bundles/'))
                    fs.mkdirSync(cwd() + '/projects/bundles/');

                await fs.promises.writeFile(
                    `${cwd()}/projects/bundles/${getProjectFullName(
                        project
                    )}.bundle`,
                    zipBuffer
                );
                let zippedSize = zipBuffer.length / 1024;
                script.log('{green-fg}Bundle Wrote Successfully{/}');
                script.log(
                    `\t{cyan-fg}Bundle Size  => ${(zippedSize / 1024).toFixed(
                        2
                    )}mb {/}`
                );
            });

            if (buildImports !== true) throw buildImports;
        });
        if (result !== true) throw result;

        //copy the project from the temp projects folder to the projects folder, will always run regardless of it calling action and not always
        let copy = await action('copyProject', async () => {
            script.log('{cyan-fg}Copying Project...{/}');

            let projectLocation = `${cwd()}/projects/compiled/${getProjectFullName(
                project
            )}.json`;
            let tempLocation = `${cwd()}/temp/projects/${getProjectFullName(
                project
            )}.compiled.temp.json`;
            fs.copyFileSync(tempLocation, projectLocation);
        });

        //everything changed in the project past the copy action will not be saved to disk
        if (copy !== true) throw copy;

        script.log('{green-fg}{bold}Compilation Successful{/}');
        script.log(`\tProject: ${project.name}`);
        script.log(
            `\tVersion: ${project.version.version} (${project.version.tag})`
        );
        script.log(
            '{gray-fg}{bold}You can now go ahead and {cyan-fg}deploy this project!{/}'
        );

        //check if the temporary compiled project exists and delete it
        if (
            fs.existsSync(
                `${cwd()}/temp/projects/${getProjectFullName(
                    project
                )}.compiled.temp.json`
            )
        )
            fs.unlinkSync(
                `${cwd()}/temp/projects/${getProjectFullName(
                    project
                )}.compiled.temp.json`
            );

        return true;
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
        {
            name: 'continue',
            type: 'boolean',
            value: false,
            optional: true,
        },
        {
            name: 'recompile',
            type: 'boolean',
            value: true,
            optional: true,
        },
    ],
};
export default compile;
