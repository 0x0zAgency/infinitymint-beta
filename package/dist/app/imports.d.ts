/// <reference types="node" />
/// <reference types="node" />
import { InfinityMintSVGSettings } from './content';
import { PathLike } from 'fs';
import { Dictionary } from './helpers';
import path from 'path';
import InfinityConsole from './console';
import { InfinityMintCompiledProject, InfinityMintDeployedProject, InfinityMintProject, InfinityMintProjectAsset, InfinityMintProjectPath } from './interfaces';
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
export type ipfsType = {
    cid: string;
    fileName?: string;
    gateway: string;
};
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
export declare const hasImportCache: () => boolean;
/**
 * counts the amount of assets we've found
 * @param imports
 * @returns
 */
export declare const importCount: (imports?: ImportCache) => number;
/**
 * Searches the import cache for that particular import, can search by full path or just the name of the asset.
 * @param fileNameOrPath
 * @returns
 */
export declare const hasImport: (fileNameOrPath: string) => Promise<boolean>;
/**
 * returns the parsedPath to a given fileNameOrPath in the imports cache. You can pass in the full path or just the name of the asset. It can have the extension or not. It can be any case.
 * @param fileNameOrPath
 * @returns
 */
export declare const getImport: (fileNameOrPath: string) => Promise<ImportType>;
/**
 * Returns a checksum based on the contents of the file
 * @param filePath
 * @returns
 */
export declare const getFileChecksum: (filePath: string) => string;
/**
 * Will correctly setup an paths import in a project. Also does the path content too. Uploads it to IPFS and fills in the required data for the projectp path interface. used in the compile script
 * @param project
 * @param path
 * @param infinityConsole
 * @param _log
 * @returns
 */
export declare const setupProjectImport: (project: InfinityMintProject | InfinityMintDeployedProject | InfinityMintCompiledProject, path: InfinityMintProjectPath | InfinityMintProjectAsset, infinityConsole?: InfinityConsole, _log?: (message: string, pipe?: string) => void) => Promise<{}>;
/**
 * Takes a project and a path, returns an array of errors if any else will return true if everything is okay
 * @param project
 * @param path
 * @param type
 * @param _log
 * @returns
 */
export declare const verifyImport: (path: InfinityMintProjectPath | InfinityMintProjectAsset, type?: 'asset' | 'path' | 'content', project?: InfinityMintProject | InfinityMintDeployedProject | InfinityMintCompiledProject, _log?: (message: string, pipe?: string) => void) => true | any[];
export declare const getImportKeys: (newImport: ImportType, key: string) => {};
/**
 * Adds an import to the import cache, the filePath must be the direct location of the path
 * @param filePath
 * @returns
 */
export declare const addImport: (filePath: string) => ImportCache;
/**
 * saves the import cache to disk
 * @param cache
 */
export declare const saveImportCache: (cache: ImportCache) => void;
/**
 * reads the import cache from disk
 * @returns
 */
export declare const readImportCache: () => ImportCache;
/**
 * returns the current import cache. if useFresh is true, it will recompile the cache. if the cache does not exist, it will create it. It will also save the cache to disk.
 * @param dontUseCache
 * @param infinityConsole
 * @returns
 */
export declare const getImports: (dontUseCache?: boolean, infinityConsole?: InfinityConsole) => Promise<ImportCache>;
/**
 * creates the import cache to be then saved to disk. Can pass in more supported extensions to add to the default ones. More extensions can also be added to the config file.
 * @param supportedExtensions
 * @param infinityConsole
 * @returns
 */
export declare const buildImports: (supportedExtensions?: string[], infinityConsole?: InfinityConsole, roots?: PathLike[]) => Promise<ImportCache>;
//# sourceMappingURL=imports.d.ts.map