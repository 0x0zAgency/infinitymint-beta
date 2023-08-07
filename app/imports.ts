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

type ipfsType = { cid: string; fileName?: string; gateway: string };
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

export const addImport = (fileName: string) => {
    let imports = readImportCache();
    let checksum = createHash('sha256').update(fileName).digest('hex');
    let parsedPath = path.parse(fileName);
    imports.database[checksum] = {
        extension: parsedPath.ext,
        name: parsedPath.name,
        base: parsedPath.base,
        checksum: checksum,
        dir: parsedPath.dir,
        settings: [],
    };
    let routeLess = fileName.replace(cwd(), '');
    imports.keys[fileName] = checksum;
    imports.keys[routeLess] = checksum;
    imports.keys[routeLess.replace(/\\/g, '/')] = checksum;
    if (routeLess[0] === '/') imports.keys[routeLess.substring(1)] = checksum;
    imports.keys[routeLess.split('.')[0]] = checksum;

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
 * @param useFresh
 * @param infinityConsole
 * @returns
 */
export const getImports = async (
    useFresh?: boolean,
    infinityConsole?: InfinityConsole
) => {
    if (
        useFresh ||
        (!importCache && !fs.existsSync(cwd() + '/temp/import_cache.json'))
    ) {
        importCache = await buildImports([], infinityConsole);
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
    infinityConsole?: InfinityConsole
): Promise<ImportCache> => {
    supportedExtensions = supportedExtensions || [];

    let config = getConfigFile();
    supportedExtensions = [
        ...(supportedExtensions as string[]),
        ...(config.settings?.compile?.supportedExtensions || []),
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

    log(
        'found ' + supportedExtensions.length + ' supported extensions',
        'imports'
    );

    let finalLocations = [];

    [
        ...(config.imports || []).map(
            (root: string) =>
                cwd() +
                '/' +
                (root.indexOf('imports') === -1
                    ? root +
                      (root[root.length - 1] !== '/' ? '/imports/' : 'imports/')
                    : root)
        ),
        cwd() + '/imports/',
        ...(config.roots || []).map(
            (root: string) =>
                cwd() +
                '/' +
                (root.indexOf('imports') === -1
                    ? root +
                      (root[root.length - 1] !== '/' ? '/imports/' : 'imports/')
                    : root)
        ),
    ]
        .map((location) => {
            return location + '**/*';
        })
        .map((location) => {
            //removes broken double directory slash
            return location.replace(/\/\//g, '');
        })
        .forEach((location) => {
            supportedExtensions.forEach((ext) => {
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
        files.forEach((result) => {
            if (infinityConsole && infinityConsole.isDrawing())
                infinityConsole.loadingBox.setContent('Loading => ' + result);
            results.push(result);
        });
    }

    let parsedFiles = results.map((filePath) => path.parse(filePath));
    let infinityImports = parsedFiles.filter(
        (file) => file.base.indexOf('.settings.') === -1
    );
    let importSettings = parsedFiles.filter(
        (file) => file.base.indexOf('.settings.') !== -1
    );

    let imports: ImportCache = {
        updated: Date.now(),
        database: {},
        keys: {},
    };
    for (let i = 0; i < infinityImports.length; i++) {
        let normalImport = infinityImports[i];
        let name = normalImport.dir + '/' + normalImport.base;

        if (imports.database[name]) throw new Error('conflict: ' + name);

        let root: string | string[] = normalImport.dir.split('imports');
        if (root.length > 2) root.slice(1).join('imports');
        else root = root[1];

        log(`[${i}] found file => ${name}`, 'imports');
        log(`\t -> calculating checksum`, 'imports');

        if (infinityConsole && infinityConsole.isDrawing())
            infinityConsole.loadingBox.setContent(
                'Calculating Checksum => ' + name
            );

        let checksum = createHash('md5')
            .update(
                await promises.readFile(name, {
                    encoding: 'utf-8',
                })
            )
            .digest('hex');
        log(`\t -> checksum calculated: ${checksum}`, 'imports');
        imports.database[name] = {
            extension: normalImport.ext,
            name: normalImport.name,
            dir: normalImport.dir,
            base: normalImport.base,
            checksum: checksum,
            settings: importSettings.filter(
                (thatSetting) =>
                    thatSetting.base.indexOf(
                        normalImport.name + normalImport.ext + '.settings.'
                    ) !== -1
            ),
        };

        let newKeys = {};

        //adds settings to the keys
        if (
            imports.database[name].settings &&
            imports.database[name].settings.length > 0
        )
            imports.database[name].settings.forEach((setting) => {
                newKeys[setting.dir + '/' + setting.base] = name;
                newKeys['/' + setting.base] = name;
                let root = setting.dir + '/' + setting.base;
                root = root.replace(cwd(), '');
                //remove the slash from the start of root if it exists
                if (root[0] === '/') root = root.substring(1);
                newKeys[root] = name;
                newKeys['/' + root] = name;
            });

        newKeys[normalImport.dir + '/' + normalImport.base] = name;
        newKeys[normalImport.dir + '/' + normalImport.name] = name;
        newKeys[cwd() + '/imports' + root + '/' + normalImport.name] = name;
        newKeys[cwd() + '/imports' + root + '/' + normalImport.base] = name;
        newKeys[
            'imports/' + normalImport.name + normalImport.ext.toLowerCase()
        ] = name;
        newKeys[
            '/imports/' + normalImport.name + normalImport.ext.toLowerCase()
        ] = name;
        newKeys[
            'imports/' + normalImport.name + normalImport.ext.toUpperCase()
        ] = name;
        newKeys[
            '/imports/' + normalImport.name + normalImport.ext.toUpperCase()
        ] = name;
        newKeys['imports/' + normalImport.name] = name;
        newKeys['/imports/' + normalImport.name] = name;
        newKeys['imports/' + normalImport.base] = name;
        newKeys['/imports/' + normalImport.base] = name;
        newKeys[('/imports/' + normalImport.name).toLowerCase()] = name;
        newKeys[('imports/' + normalImport.base).toLowerCase()] = name;
        newKeys[('imports/' + normalImport.name).toLowerCase()] = name;
        newKeys['imports' + root + '/' + normalImport.name] = name;
        newKeys['/imports' + root + '/' + normalImport.name] = name;
        newKeys['imports' + root + '/' + normalImport.base] = name;
        newKeys['/imports' + root + '/' + normalImport.base] = name;
        newKeys[('/imports' + root + '/' + normalImport.name).toLowerCase()] =
            name;
        newKeys[('imports' + root + '/' + normalImport.base).toLowerCase()] =
            name;
        newKeys[root + '/' + normalImport.name] = name;
        newKeys[root + '/' + normalImport.name] = name;
        newKeys[
            root + '/' + normalImport.name + normalImport.ext.toLowerCase()
        ] = name;
        newKeys[
            root + '/' + normalImport.name + normalImport.ext.toUpperCase()
        ] = name;
        newKeys[(root + '/' + normalImport.name).toLowerCase()] = name;
        newKeys[(root + '/' + normalImport.base).toLowerCase()] = name;
        newKeys[root + '/' + normalImport.base] = name;
        newKeys[root + '/' + normalImport.base] = name;

        let nss = root[0] === '/' ? (root as string).substring(1) : root;
        newKeys[nss + '/' + normalImport.name] = name;
        newKeys[
            nss + '/' + normalImport.name + normalImport.ext.toLowerCase()
        ] = name;
        newKeys[
            nss + '/' + normalImport.name + normalImport.ext.toUpperCase()
        ] = name;
        newKeys[(nss + '/' + normalImport.base).toLowerCase()] = name;
        newKeys[(nss + '/' + normalImport.name).toLowerCase()] = name;
        newKeys[nss + '/' + normalImport.name] = name;
        newKeys[nss + '/' + normalImport.base] = name;
        newKeys[nss + '/' + normalImport.base] = name;
        newKeys[normalImport.base] = name;
        newKeys[normalImport.name] = name;
        newKeys[normalImport.name.toLowerCase()] = name;
        newKeys[normalImport.base.toLowerCase()] = name;

        //for windows support
        Object.keys(newKeys).forEach((key) => {
            newKeys['C:' + replaceSeperators(key, true)] = newKeys[key];
        });

        //update the keys
        imports.keys = { ...imports.keys, ...newKeys };

        if (infinityConsole && infinityConsole.isDrawing())
            infinityConsole.loadingBox.setContent('Imported => ' + name);
    }

    return imports as ImportCache;
};
