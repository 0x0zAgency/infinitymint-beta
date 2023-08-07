import { InfinityMintSVGSettings } from './content';
import { PathLike } from 'fs';
import {
    cwd,
    debugLog,
    findFiles,
    getConfigFile,
    log,
    replaceSeperators,
    warning,
} from './helpers';
import { Dictionary } from './helpers';
import path from 'path';
import fs, { promises } from 'fs';
import { createHash } from 'node:crypto';
import InfinityConsole from './console';
import {
    InfinityMintCompiledProject,
    InfinityMintDeployedProject,
    InfinityMintProject,
    InfinityMintProjectAsset,
    InfinityMintProjectContent,
    InfinityMintProjectPath,
} from './interfaces';
import { getIPFSConfig, isAllowingIPFS } from './ipfs';
import { getFullyQualifiedName } from './projects';

export interface ImportInterface {
    name?: string;
    path?: PathLike;
    extension?: string;
    settings?: InfinityMintSVGSettings;
    settingsFilepath?: PathLike;
    settingsChecksum?: string;
    checksum?: string;
    id?: string;
}

export type ipfsType = { cid: string; fileName?: string; gateway: string };
export interface CompiledImportInterface extends ImportInterface {
    paths: {
        ipfs?: Array<ipfsType>;
        public?: string;
        web2?: string;
        settings?: {
            ipfs?: Array<ipfsType>;
            public: string;
            web2?: string;
        };
    };
    compiled?: number;
    project?: string;
    network?: {
        name?: string;
        chainId?: number;
    };
}

export interface ImportType {
    extension: string;
    name: string;
    base: string;
    checksum: string;
    dir: string;
    settings: Array<path.ParsedPath>;
    cid?: string;
}
export interface ImportCache {
    updated: number;
    database: Dictionary<ImportType>;
    keys: Dictionary<string>;
}

/**
 * returns true if the import cache exists. does not check if its valid.
 * @returns
 */
export const hasImportCache = () => {
    return fs.existsSync(cwd() + '/temp/import_cache.json');
};

/**
 * counts the amount of assets we've found
 * @param imports
 * @returns
 */
export const importCount = (imports?: ImportCache) => {
    imports = imports || importCache || readImportCache();
    return Object.values(imports.database).length;
};

/**
 * Searches the import cache for that particular import, can search by full path or just the name of the asset.
 * @param fileNameOrPath
 * @returns
 */
export const hasImport = async (fileNameOrPath: string) => {
    let imports = await getImports();
    if (
        !imports.keys[fileNameOrPath] ||
        !imports.database[imports.keys[fileNameOrPath]]
    )
        return false;

    return true;
};

/**
 * returns the parsedPath to a given fileNameOrPath in the imports cache. You can pass in the full path or just the name of the asset. It can have the extension or not. It can be any case.
 * @param fileNameOrPath
 * @returns
 */
export const getImport = async (fileNameOrPath: string) => {
    let imports = await getImports();

    if (!hasImport(fileNameOrPath))
        throw new Error('import not found: ' + fileNameOrPath);

    return imports.database[imports.keys[fileNameOrPath]];
};

/**
 * Returns a checksum based on the contents of the file
 * @param filePath
 * @returns
 */
export const getFileChecksum = (filePath: string) => {
    return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
};

/**
 * Checks that a project import exists and is valid. If it isnt valid but does exist it will add it to the import cache
 * @param project
 * @param fileName
 * @param type
 * @param _log
 * @returns
 */
const upsertImport = (
    fileName: string,
    type: 'path' | 'asset' | 'content',
    project?:
        | InfinityMintProject
        | InfinityMintDeployedProject
        | InfinityMintCompiledProject,
    _log: (message: string, pipe?: string) => void = log
) => {
    let errors = [];
    if (
        !importCache.keys[fileName] ||
        !importCache.database[importCache.keys[fileName]]
    ) {
        if (fileName[0] !== '/') fileName = '/' + fileName;

        if (
            !fs.existsSync(cwd() + fileName) &&
            project &&
            !fs.existsSync(
                replaceSeperators(project?.source?.dir + '/../' + fileName)
            ) &&
            !fs.existsSync(
                cwd().split('/').slice(0, -1).join('/') + fileName
            ) &&
            project &&
            !fs.existsSync(
                replaceSeperators(
                    project?.source?.dir + '/../imports/' + fileName
                )
            )
        ) {
            errors.push(
                `${type} content error: File not found in ${
                    project?.source?.dir + '.../'
                } or ${project?.source?.dir + '.../imports/'} or ${
                    cwd().split('/').slice(0, -1).join('/') + fileName
                } => ` + fileName
            );
            return errors;
        } else {
            let filePath;

            if (fs.existsSync(cwd() + fileName)) filePath = cwd() + fileName;
            else if (
                fs.existsSync(
                    replaceSeperators(project.source.dir + '/../' + fileName)
                )
            )
                filePath = replaceSeperators(
                    project.source.dir + '/../' + fileName
                );
            else if (
                fs.existsSync(
                    cwd().split('/').slice(0, -1).join('/') + fileName
                )
            )
                filePath = cwd().split('/').slice(0, -1).join('/') + fileName;
            else
                filePath = replaceSeperators(
                    project.source.dir + '/../imports' + fileName
                );

            _log('\t{yellow-fg}Adding ' + filePath + ' to import cache{/}');
            //add it to the import base
            importCache = addImport(filePath);
        }
    } else {
        let newChecksum = getFileChecksum(
            importCache.database[importCache.keys[fileName]].dir +
                '/' +
                importCache.database[importCache.keys[fileName]].base
        );

        if (
            importCache.database[importCache.keys[fileName]].checksum !==
            newChecksum
        ) {
            _log(
                `\t{yellow-fg}Checksum Changed{/} ${
                    importCache.database[importCache.keys[fileName]].checksum
                } => ${newChecksum}`
            );
            importCache.database[importCache.keys[fileName]].cid = undefined;
            importCache.database[importCache.keys[fileName]].checksum =
                newChecksum;

            saveImportCache(importCache);
        }
    }

    return true;
};

/**
 * Will correctly setup an paths import in a project. Also does the path content too. Uploads it to IPFS and fills in the required data for the projectp path interface. used in the compile script
 * @param project
 * @param path
 * @param infinityConsole
 * @param _log
 * @returns
 */
export const setupProjectImport = async (
    project:
        | InfinityMintProject
        | InfinityMintDeployedProject
        | InfinityMintCompiledProject,
    path: InfinityMintProjectPath | InfinityMintProjectAsset,
    infinityConsole?: InfinityConsole,
    _log: (message: string, pipe?: string) => void = log
) => {
    _log(`\t{cyan-fg}Setting Up{/} => ${path.fileName}`);
    let imports = {};
    let fileName = path.fileName.toString().toLowerCase(); //because of issue with uppercase/lowercase filenames we lowercase it first
    let pathImport = importCache.database[importCache.keys[fileName]] || {
        extension: 'none',
        name: 'none',
        dir: 'none',
        checksum: 'none',
        base: 'none',
        settings: [],
    };
    path.source = pathImport;

    //puts the settings for the import into the path
    if (pathImport?.settings) {
        pathImport.settings.map((setting) => {
            if (!path.settings) path.settings = {};
            else if (typeof path.settings === 'object')
                path.settings = {
                    '@project': path.settings,
                };
            else path.settings = {};
            _log(
                `\t{cyan-fg}Found Settings{/} => ${
                    setting.dir + '/' + setting.base
                } (${setting.ext})`
            );
            if (setting.ext === '.json') {
                path.settings[setting.dir + '/' + setting.base] = {
                    ...JSON.parse(
                        fs.readFileSync(setting.dir + '/' + setting.base, {
                            encoding: 'utf-8',
                        })
                    ),
                    source: setting,
                } as InfinityMintSVGSettings;
            } else if (setting.ext === '.js' || setting.ext === '.ts') {
                let result = require(setting.dir + '/' + setting.base);
                result = result.default;

                path.settings[setting.dir + '/' + setting.base] = {
                    ...(typeof result === 'function' ? result() : result),
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
                let path: string = svgSetting!.style!.css as string;
                path = path[0] === '/' ? '' : '/' + path;
                if (svgSetting!.style!.css instanceof Array)
                    svgSetting!.style!.css.forEach((style) => {
                        style = (style[0] === '/' ? '' : '/') + style;
                        if (!importCache.keys[style])
                            throw new Error(
                                `${
                                    svgSetting!.source!.dir +
                                    '/' +
                                    svgSetting!.source!.base
                                } bad css reference: ${style}`
                            );
                        else {
                            _log(
                                `\t{cyan-fg}Included CSS reference{/} => ${style}`
                            );
                            let truePath =
                                svgSetting.source.dir.split('imports')[0] +
                                style;
                            imports[style] = truePath;
                            imports[project.name + '@' + style] = truePath;
                            imports[getFullyQualifiedName(project) + style] =
                                truePath;
                            imports[cwd() + style] = truePath;
                            imports[
                                (svgSetting.source.dir + style).replace(
                                    /\/\//g,
                                    '/'
                                )
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
                    _log(`\t{cyan-fg}Included CSS reference{/} => ${path}`);
                    let truePath =
                        svgSetting.source.dir.split('imports')[0] + path;
                    imports[path] = truePath;
                    imports[svgSetting.source.dir + path] = truePath;
                    imports[cwd() + path] = truePath;
                    imports[project.name + '@' + path] = truePath;
                    imports[getFullyQualifiedName(project) + path] = truePath;
                    imports[truePath] = truePath;
                }
            }
        );

        if (path.content) {
            _log('\t{cyan-fg}Setting Up Path Content...{/}');
            let keys = Object.keys(path.content);
            for (let i = 0; i < keys.length; i++) {
                let content = keys[i];
                let newImport = {
                    fileName:
                        path.content[content].fileName || path.content[content],
                    name: content,
                    ...(typeof path.content[content] === 'object'
                        ? path.content[content]
                        : {}),
                } as InfinityMintProjectContent;

                if (infinityConsole)
                    infinityConsole.emit('preCompileSetup', path, typeof path);
                await setupProjectImport(
                    project,
                    newImport,
                    infinityConsole,
                    _log
                );
                newImport.compiled = true;
                path.content[content] = newImport;

                if (infinityConsole)
                    infinityConsole.emit('postCompileSetup', path, typeof path);
            }
        }

        _log('\t\t{green-fg}Success{/}');
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
                ? fs.statSync(`${path.source.dir}/${path.source.base}`)
                : ({} as any),
        exported: Date.now(),
    };

    if (isAllowingIPFS() && infinityConsole) {
        try {
            let cid = pathImport.cid;

            if (!cid) {
                _log(`\t{cyan-fg}Uploading to IPFS{/}`);
                cid = await infinityConsole.IPFS.add(
                    fs.readFileSync(path.source.dir + '/' + path.source.base),
                    path.source.base
                );
                _log(`\t\t{green-fg}Successly uploaded to IPFS{/} => ${cid}`);

                importCache.database[importCache.keys[fileName]].cid = cid;
                saveImportCache(importCache);
            } else _log(`\t{cyan-fg}Reusing IPFS cid => ${cid}{/}`);

            let ipfsConfig = getIPFSConfig();
            let endpoint = ipfsConfig.endpoint || 'https://ipfs.io/ipfs/';

            if (!path.export.external) path.export.external = {};

            path.export.external.ipfs = {
                hash: cid,
                url: `${endpoint}${cid}/${path.source.base}`,
                fileName: path.source.base,
            };
        } catch (error) {
            _log(`{red-fg}Failed to upload to IPFS{/}`);
            _log(error);
        }
    } else _log('\t{red-fg}Not uploading to IPFS!{/}');

    if (path.export.key)
        imports[path.export.key] = path.source.dir + '/' + path.source.base;

    if (path.source)
        imports[path.source.dir + '/' + path.source.base] =
            path.source.dir + '/' + path.source.base;

    imports[project.name + '@' + fileName] =
        path.source.dir + '/' + path.source.base;

    let fileNameWithSlash = (fileName[0] === '/' ? '' : '/') + fileName;

    imports[fileName] = path.source.dir + '/' + path.source.base;
    imports[fileNameWithSlash] = path.source.dir + '/' + path.source.base;
    imports[cwd() + fileNameWithSlash] =
        path.source.dir + '/' + path.source.base;
    imports[getFullyQualifiedName(project) + fileNameWithSlash] =
        path.source.dir + '/' + path.source.base;

    path.checksum = createHash('md5')
        .update(JSON.stringify(path))
        .digest('hex');
    _log(`\t{cyan-fg}Path checksum{/cyan-fg} => ${path.checksum}`);

    return imports;
};

/**
 * Takes a project and a path, returns an array of errors if any else will return true if everything is okay
 * @param project
 * @param path
 * @param type
 * @param _log
 * @returns
 */
export const verifyImport = (
    path: InfinityMintProjectPath | InfinityMintProjectAsset,
    type?: 'asset' | 'path' | 'content',
    project?:
        | InfinityMintProject
        | InfinityMintDeployedProject
        | InfinityMintCompiledProject,
    _log: (message: string, pipe?: string) => void = log
) => {
    let files = [];
    let errors = [];
    type = type || 'path';

    if (!path.fileName) {
        errors.push(`${type} content error: File name not found!`);
        return errors;
    }
    let fileName = path.fileName.toString().toLowerCase();
    _log('\t{cyan-fg}Verifying ' + fileName + '{/}');

    upsertImport(fileName, type, project, _log);

    let file = importCache.database[importCache.keys[fileName]];

    if (!file) {
        errors.push(
            `${type} content error (${
                path?.pathId ||
                (path as InfinityMintProjectAsset).assetId ||
                'content'
            }): File not found in import cache => ` + fileName
        );
    } else if (!file?.checksum || file?.checksum?.length === 0) {
        errors.push(
            `${type} content error (${
                path?.pathId ||
                (path as InfinityMintProjectAsset).assetId ||
                'content'
            }): Checksum not found! Try refreshing import cache => ` +
                fileName +
                ' <' +
                (importCache.keys[fileName] || 'BAD KEY') +
                '>'
        );
    }

    if (errors.length !== 0) return errors;

    let stats = fs.statSync(file.dir + '/' + file.base);

    if (stats.size === 0) {
        errors.push(
            `${type} content error (${
                path?.pathId ||
                (path as InfinityMintProjectAsset).assetId ||
                'content'
            }): File size is zero (means file is empty) => ` + fileName
        );
    }

    if (errors.length !== 0) files.push(fileName);

    if (path.content && Object.keys(path.content).length > 0) {
        _log('\t{cyan-fg}Verifying content...{/}');
        Object.keys(path.content).forEach((contentKey) => {
            let content = path.content[contentKey];

            if (
                content !== null &&
                typeof content === 'object' &&
                !content?.fileName
            ) {
                _log(
                    '\t{yellow-fg}no filename assuming none import => {/}' +
                        contentKey
                );
                content.fileName = 'none';
            } else if (typeof content === 'string') {
                content = {
                    fileName: content,
                    name: contentKey,
                };
            } else if (typeof content !== 'object') {
                _log(
                    '\t{yellow-fg}weird type assuming none => {/}' + contentKey
                );
                content = {
                    fileName: 'none',
                    name: 'none',
                };
            }

            fileName = content.fileName.toString().toLowerCase();

            _log('\t{cyan-fg}Checking Content: ' + fileName + '{/}');

            if (
                fileName === 'undefined' ||
                fileName === 'null' ||
                fileName === 'NaN' ||
                fileName === 'none' ||
                fileName.length === 0
            ) {
                _log(
                    '\t{red-fg}Unable to verify content => ' + fileName + '{/}'
                );
            } else {
                if (!importCache.keys[fileName]) {
                    if (fileName[0] !== '/') fileName = '/' + fileName;

                    let result = upsertImport(
                        fileName,
                        'content',
                        project,
                        _log
                    );

                    if (!result) errors = [...errors, ...(result as any[])];
                    else _log('\t\t{green-fg}Success{/}');
                }
                files.push(fileName);
            }
        });
    }

    if (
        typeof path.settings === 'string' &&
        !importCache.database[importCache.keys[path.settings]]
    ) {
        errors.push(
            `${type} settings reference error (${
                path?.pathId ||
                (path as InfinityMintProjectAsset).assetId ||
                'content'
            }): Settings file not found => ` + path.settings
        );
    }

    //now lets check the imports database for settings files and if the locaiton actually exists
    files.forEach((file: string) => {
        let thatImport =
            importCache.database[importCache.keys[file.toLowerCase()]];

        if (!fs.existsSync(thatImport.dir + '/' + thatImport.base)) {
            errors.push(
                `${type} reference error (${
                    path?.pathId ||
                    (path as InfinityMintProjectAsset).assetId ||
                    'content'
                }): File does not exist locally => ` +
                    thatImport.dir +
                    '/' +
                    thatImport.base
            );
            return;
        }

        if (thatImport.settings && thatImport.settings.length !== 0) {
            thatImport.settings.forEach((setting) => {
                let settingLocation = setting.dir + '/' + setting.base;
                if (!fs.existsSync(settingLocation)) {
                    errors.push(
                        `${type} settings error (${
                            path?.pathId ||
                            (path as InfinityMintProjectAsset).assetId ||
                            'content'
                        }): Settings file not found => ` + settingLocation
                    );
                } else
                    _log(
                        '\t{cyan-fg}Verified Settings ' +
                            settingLocation +
                            '{/}'
                    );
            });
        }
    });

    if (errors.length === 0) return true;
    return errors;
};

export const getImportKeys = (newImport: ImportType, key: string) => {
    let root: string | string[] = newImport.dir.split('imports');
    if (root.length > 2) root.slice(1).join('imports');
    else root = root[1];

    let rootFolder = newImport.dir.split('/imports')[0].split('/').pop();
    let nss = root[0] === '/' ? (root as string).substring(1) : root;
    let newKeys = {};
    newKeys[path.join(rootFolder, 'imports', root.toString(), newImport.base)] =
        key;
    newKeys[
        '/' + path.join(rootFolder, 'imports', root.toString(), newImport.base)
    ] = key;
    newKeys[
        '/' +
            path
                .join(rootFolder, 'imports', root.toString(), newImport.base)
                .toLowerCase()
    ] = key;
    newKeys[
        path
            .join(rootFolder, 'imports', root.toString(), newImport.base)
            .toLowerCase()
    ] = key;
    newKeys[
        path.resolve(
            path.join(
                cwd(),
                rootFolder,
                'imports',
                root.toString(),
                newImport.base
            )
        )
    ] = key;
    newKeys[
        path
            .resolve(
                path.join(
                    cwd(),
                    'imports',
                    rootFolder,
                    root.toString(),
                    newImport.base
                )
            )
            .toLowerCase()
    ] = key;
    newKeys[cwd().split('/').pop() + root + '/' + newImport.base] = key;
    newKeys[
        path.resolve(cwd().split('/').pop() + root + '/' + newImport.base)
    ] = key;
    newKeys[cwd().split('/').pop() + root + '/' + newImport.name] = key;
    newKeys[
        path.resolve(cwd().split('/').pop() + root + '/' + newImport.name)
    ] = key;
    newKeys[cwd().split('/').pop() + '/imports' + root + '/' + newImport.base] =
        key;
    newKeys[
        path.resolve(
            cwd().split('/').pop() + '/imports' + root + '/' + newImport.base
        )
    ] = key;
    newKeys[
        path.resolve(
            cwd().split('/').pop() +
                '/imports' +
                root +
                '/' +
                newImport.base.toLowerCase()
        )
    ] = key;
    newKeys[cwd().split('/').pop() + '/imports' + root + '/' + newImport.name] =
        key;
    newKeys[
        path.resolve(
            cwd().split('/').pop() + '/imports' + root + '/' + newImport.name
        )
    ] = key;
    newKeys[newImport.dir + '/' + newImport.base] = key;
    newKeys[newImport.dir + '/' + newImport.name] = key;
    newKeys[cwd() + '/imports' + root + '/' + newImport.name] = key;
    newKeys[path.resolve(cwd() + '/imports' + root + '/' + newImport.name)] =
        key;
    newKeys[cwd() + '/imports' + root + '/' + newImport.base] = key;
    newKeys[path.resolve(cwd() + '/imports' + root + '/' + newImport.base)] =
        key;
    newKeys['imports/' + newImport.name + newImport.extension.toLowerCase()] =
        key;
    newKeys['/imports/' + newImport.name + newImport.extension.toLowerCase()] =
        key;
    newKeys['imports/' + newImport.name + newImport.extension.toUpperCase()] =
        key;
    newKeys['/imports/' + newImport.name + newImport.extension.toUpperCase()] =
        key;
    newKeys['imports/' + newImport.name] = key;
    newKeys['/imports/' + newImport.name] = key;
    newKeys['imports/' + newImport.base] = key;
    newKeys['/imports/' + newImport.base] = key;
    newKeys[('/imports/' + newImport.name).toLowerCase()] = key;
    newKeys[('/imports/' + newImport.base).toLowerCase()] = key;
    newKeys[('imports/' + newImport.base).toLowerCase()] = key;
    newKeys[('imports/' + newImport.name).toLowerCase()] = key;
    newKeys['imports' + root + '/' + newImport.name] = key;
    newKeys['/imports' + root + '/' + newImport.name] = key;
    newKeys['imports' + root + '/' + newImport.base] = key;
    newKeys['/imports' + root + '/' + newImport.base] = key;
    newKeys[('/imports' + root + '/' + newImport.name).toLowerCase()] = key;
    newKeys[('imports' + root + '/' + newImport.base).toLowerCase()] = key;
    newKeys[root + '/' + newImport.name] = key;
    newKeys[root + '/' + newImport.name] = key;
    newKeys[(root + '/' + newImport.name).toLowerCase()] = key;
    newKeys[(root + '/' + newImport.base).toLowerCase()] = key;
    newKeys[root + '/' + newImport.name + newImport.extension.toLowerCase()] =
        key;
    newKeys[root + '/' + newImport.name + newImport.extension.toUpperCase()] =
        key;
    newKeys[(root + '/' + newImport.name).toLowerCase()] = key;
    newKeys[(root + '/' + newImport.base).toLowerCase()] = key;
    newKeys[root + '/' + newImport.base] = key;
    newKeys[root + '/' + newImport.base] = key;
    newKeys[nss + '/' + newImport.name] = key;
    newKeys[nss + '/' + newImport.name + newImport.extension.toLowerCase()] =
        key;
    newKeys[nss + '/' + newImport.name + newImport.extension.toUpperCase()] =
        key;
    newKeys[(nss + '/' + newImport.base).toLowerCase()] = key;
    newKeys[(nss + '/' + newImport.name).toLowerCase()] = key;
    newKeys[nss + '/' + newImport.name] = key;
    newKeys[nss + '/' + newImport.base] = key;
    newKeys[nss + '/' + newImport.base] = key;
    newKeys[newImport.base] = key;
    newKeys[newImport.name] = key;
    newKeys[newImport.name.toLowerCase()] = key;
    newKeys[newImport.base.toLowerCase()] = key;

    Object.keys(newKeys).forEach((key) => {
        //TODO: Fix this
        if (key.indexOf('//') !== -1) {
            newKeys[key.replace(/\/\//g, '/')] = newKeys[key];
            delete newKeys[key];
        }
        //TODO: Fix this too
        if (key.indexOf('\\\\') !== -1) {
            newKeys[key.replace(/\\\\/g, '\\')] = newKeys[key];
            delete newKeys[key];
        }
        //for windows support
        newKeys['C:' + replaceSeperators(key, true)] = newKeys[key];
        //lowercase variants
        newKeys[key.toLowerCase()] = newKeys[key];
        newKeys[key.toUpperCase()] = newKeys[key];
    });

    return newKeys;
};

/**
 * Adds an import to the import cache, the filePath must be the direct location of the path
 * @param filePath
 * @returns
 */
export const addImport = (filePath: string) => {
    if (!fs.existsSync(filePath))
        throw new Error(
            'tried to add non existent file to import cache: ' + filePath
        );

    let imports = readImportCache();
    let checksum = getFileChecksum(filePath);
    let parsedPath = path.parse(filePath);
    let newImport = {
        extension: parsedPath.ext,
        name: parsedPath.name,
        base: parsedPath.base,
        checksum: checksum,
        dir: parsedPath.dir,
        settings: [],
    };

    imports.database[filePath] = newImport;
    imports.keys = { ...imports.keys, ...getImportKeys(newImport, filePath) };

    saveImportCache(imports);
    return imports;
};
/**
 * saves the import cache to disk
 * @param cache
 */
export const saveImportCache = (cache: ImportCache) => {
    log(`saving <${importCount(cache)}> imports to cache file`, 'imports');
    log('saving imports to /temp/import_cache.json', 'fs');
    fs.writeFileSync(
        cwd() + '/temp/import_cache.json',
        JSON.stringify(cache, null, 2)
    );
};

/**
 * reads the import cache from disk
 * @returns
 */
export const readImportCache = (): ImportCache => {
    if (!fs.existsSync(cwd() + '/temp/import_cache.json'))
        return { keys: {}, database: {}, updated: Date.now() } as ImportCache;

    return JSON.parse(
        fs.readFileSync(cwd() + '/temp/import_cache.json', {
            encoding: 'utf-8',
        })
    ) as ImportCache;
};

let importCache: ImportCache;
/**
 * returns the current import cache. if useFresh is true, it will recompile the cache. if the cache does not exist, it will create it. It will also save the cache to disk.
 * @param dontUseCache
 * @param infinityConsole
 * @returns
 */
export const getImports = async (
    dontUseCache?: boolean,
    infinityConsole?: InfinityConsole
) => {
    let config = getConfigFile();
    if (
        dontUseCache ||
        (!importCache && !fs.existsSync(cwd() + '/temp/import_cache.json'))
    ) {
        let oldCache;
        if (fs.existsSync(cwd() + '/temp/import_cache.json'))
            oldCache = readImportCache();

        importCache = await buildImports(
            config.settings?.imports?.supportedExtensions || [],
            infinityConsole
        );

        // we want to keep the old cid's if they exist
        if (oldCache) {
            Object.keys(oldCache.database).forEach((key) => {
                if (oldCache?.database[key]?.cid && importCache.database[key])
                    importCache.database[key].cid = oldCache.database[key].cid;
            });
        }
        saveImportCache(importCache);
    } else importCache = readImportCache();
    return importCache;
};

/**
 * creates the import cache to be then saved to disk. Can pass in more supported extensions to add to the default ones. More extensions can also be added to the config file.
 * @param supportedExtensions
 * @param infinityConsole
 * @returns
 */
export const buildImports = async (
    supportedExtensions?: string[],
    infinityConsole?: InfinityConsole,
    roots: PathLike[] = []
): Promise<ImportCache> => {
    supportedExtensions = supportedExtensions || [];

    let config = getConfigFile();
    supportedExtensions = [
        ...(supportedExtensions as string[]),
        ,
        ...[
            '.png',
            '.svg',
            '.jpg',
            '.jpeg',
            '.gif',
            '.glb',
            '.mp3',
            '.obj',
            '.wav',
            '.css',
        ],
    ];

    if (config.settings?.imports?.disabledExtensions)
        supportedExtensions = supportedExtensions.filter(
            (val) =>
                config.settings.imports.disabledExtensions.indexOf(val) === -1
        );

    log(
        'found ' + supportedExtensions.length + ' supported extensions',
        'imports'
    );
    supportedExtensions.forEach((ext) => log(`\t${ext}`, 'imports'));

    let finalLocations = [];

    [
        ...roots,
        cwd() + '/imports/',
        ...(config.imports || []).map((root: string) => {
            if (
                root.startsWith('../') ||
                root.startsWith('./') ||
                root.startsWith('/../')
            )
                root =
                    cwd() +
                    '/' +
                    (root.startsWith('/') ? root.substring(1) : root);

            if (!root.endsWith('/')) root += '/';
            return root + 'imports/';
        }),
        ...(config.roots || []).map((root: string) => {
            if (
                root.startsWith('../') ||
                root.startsWith('./') ||
                root.startsWith('/../')
            )
                root =
                    cwd() +
                    '/' +
                    (root.startsWith('/') ? root.substring(1) : root);
            return (
                root +
                (root[root.length - 1] !== '/' ? '/imports/' : 'imports/')
            );
        }),
    ]
        .map((location) => {
            return location + '**/*';
        })
        .map((location) => {
            //removes broken double directory slash
            return location.replace(/\/\//g, '');
        })
        //then add the glob extensions
        .forEach((location) => {
            supportedExtensions.forEach((ext) => {
                if (!ext || ext.length === 0) return;
                if (ext[0] === '.') ext = ext.substring(1);
                finalLocations.push(location + '.' + ext);
                finalLocations.push(location + '.' + ext.toUpperCase());
                finalLocations.push(location + '.' + ext + '.settings.*');
                finalLocations.push(
                    location + '.' + ext.toUpperCase() + '.settings.*'
                );
            });
        });

    let results = [];
    for (let i = 0; i < finalLocations.length; i++) {
        let files = await findFiles(finalLocations[i]);

        //remove disabled roots
        if (config.settings?.imports?.disabledRoots)
            files = files.filter(
                (file) =>
                    config.settings.imports.disabledRoots.filter(
                        (root) => file.indexOf(root) !== -1
                    ).length === 0
            );

        files.forEach((result) => {
            if (infinityConsole && infinityConsole.isDrawing())
                infinityConsole
                    .getLoadingBox()
                    .setContent('Loading => ' + result);
            results.push(result);
        });
    }

    let parsedFiles = results.map((filePath) => path.parse(filePath));

    let foundImports = parsedFiles.filter(
        (file) => file.base.indexOf('.settings.') === -1
    );
    let foundSettings = parsedFiles.filter(
        (file) => file.base.indexOf('.settings.') !== -1
    );

    let newImports: ImportCache = {
        updated: Date.now(),
        database: {},
        keys: {},
    };

    let c = [...foundImports, ...foundSettings];
    for (let i = 0; i < c.length; i++) {
        let currentImport = c[i];
        let filePath = currentImport.dir + '/' + currentImport.base;

        if (newImports.database[filePath])
            throw new Error('conflict: ' + filePath);

        log(`[${i}] found file => ${filePath}`, 'imports');
        log(`\t => calculating checksum`, 'imports');

        if (infinityConsole && infinityConsole.isDrawing())
            infinityConsole
                .getLoadingBox()
                .setContent('Calculating Checksum => ' + filePath);

        let checksum = createHash('md5')
            .update(
                await promises.readFile(filePath, {
                    encoding: 'utf-8',
                })
            )
            .digest('hex');

        log(`\t => checksum calculated: ${checksum}`, 'imports');
        newImports.database[filePath] = {
            extension: currentImport.ext,
            name: currentImport.name,
            dir: currentImport.dir,
            base: currentImport.base,
            checksum: checksum,
            settings: foundSettings.filter(
                (thatSetting) =>
                    thatSetting.base.indexOf(
                        currentImport.name + currentImport.ext + '.settings.'
                    ) !== -1
            ),
        };

        //update the keys
        newImports.keys = {
            ...newImports.keys,
            ...getImportKeys(newImports.database[filePath], filePath),
        };

        if (infinityConsole && infinityConsole.isDrawing())
            infinityConsole
                .getLoadingBox()
                .setContent('Imported => ' + filePath);
        else if (infinityConsole && !infinityConsole.isDrawing())
            infinityConsole.log('Imported => ' + filePath);
    }

    return newImports as ImportCache;
};
