/// <reference types="node" />
import InfinityConsole from './console';
import { Dictionary } from './helpers';
import { InfinityMintCompiledProject, InfinityMintDeployedProject, InfinityMintProjectUpdate, InfinityMintProjectUpdateKey } from './interfaces';
import path from 'path';
export interface UpdateCache {
    database: Dictionary<path.ParsedPath>;
    keys?: Dictionary<string>;
    updates: string[];
    projects?: Dictionary<string[]>;
}
declare const UpdateCache: UpdateCache;
/**
 *
 * @param project
 * @returns
 */
export declare const getTemporaryUpdates: (project: InfinityMintDeployedProject) => Dictionary<InfinityMintProjectUpdate>;
/**
 *
 * @param project
 * @param update
 */
export declare const saveTemporaryUpdate: (project: InfinityMintDeployedProject, update: InfinityMintProjectUpdate) => void;
/**
 * Creates an update
 * @param project
 * @param version
 * @returns
 */
export declare const createTemporaryUpdate: (project: InfinityMintDeployedProject, version?: string, data?: InfinityMintProjectUpdate) => InfinityMintProjectUpdate;
export declare const getProjectVersions: (projectOrName: string | InfinityMintDeployedProject | InfinityMintCompiledProject) => string[];
export declare const formatCacheEntry: (update: InfinityMintProjectUpdate, newPath: path.ParsedPath, name?: string) => Dictionary<string>;
export declare const writeUpdateCache: (cache: UpdateCache) => void;
export declare const readUpdateCache: () => void;
export declare const loadUpdates: (roots?: any[], useFresh?: boolean) => Promise<UpdateCache>;
export declare const rebuildUpdateCache: (roots?: any[]) => Promise<UpdateCache>;
/**
 *
 * @param updateOrVersion
 * @returns
 */
export declare const removeUpdate: (updateOrVersion: string | InfinityMintProjectUpdate) => void;
/**
 *
 * @param projectOrName
 * @param version
 * @returns
 */
export declare const hasUpdate: (projectOrName: string | InfinityMintCompiledProject | InfinityMintDeployedProject, version?: string, network?: string) => boolean;
export declare const getUpdate: (projectOrName: string | InfinityMintCompiledProject | InfinityMintDeployedProject, version?: string, network?: string) => Promise<InfinityMintProjectUpdate>;
/**
 * Creates a new update
 * @param project
 * @param newVersion
 * @param newTag
 * @param save
 * @returns
 */
export declare const createUpdate: (project: InfinityMintCompiledProject | InfinityMintDeployedProject, newVersion: string, newTag?: string, network?: string, save?: boolean, createTypeScriptFile?: boolean) => InfinityMintProjectUpdate;
/**
 *
 * @param roots
 * @returns
 */
export declare const findUpdates: (roots?: any[]) => Promise<path.ParsedPath[]>;
export declare const updateProjectContent: (project: InfinityMintDeployedProject, update: InfinityMintProjectUpdateKey, infinityConsole?: InfinityConsole, debugLog?: (message: string, pipe?: string) => void) => Promise<void>;
export declare const updateProjectProcedure: (project: InfinityMintDeployedProject, projectUpdate: InfinityMintProjectUpdate, infinityConsole?: InfinityConsole, debugLog?: (message: string, pipe?: string) => void) => Promise<void>;
export declare const createProjectContent: (project: InfinityMintDeployedProject | InfinityMintCompiledProject, update: InfinityMintProjectUpdateKey, infinityConsole?: InfinityConsole, debugLog?: (message: string, pipe?: string) => void, oldVersion?: string) => Promise<void>;
export declare const createProjectProcedure: (project: InfinityMintDeployedProject | InfinityMintCompiledProject, projectUpdate: InfinityMintProjectUpdate, infinityConsole?: InfinityConsole, debugLog?: (message: string, pipe?: string) => void, oldVersion?: string) => Promise<void>;
export declare const updateProcedures: {
    update: (project: InfinityMintDeployedProject, projectUpdate: InfinityMintProjectUpdate, infinityConsole?: InfinityConsole, debugLog?: (message: string, pipe?: string) => void) => Promise<void>;
    create: (project: InfinityMintDeployedProject | InfinityMintCompiledProject, projectUpdate: InfinityMintProjectUpdate, infinityConsole?: InfinityConsole, debugLog?: (message: string, pipe?: string) => void, oldVersion?: string) => Promise<void>;
    remove: (project: InfinityMintDeployedProject | InfinityMintCompiledProject, projectUpdate: InfinityMintProjectUpdate, infinityConsole?: InfinityConsole, debugLog?: (message: string, pipe?: string) => void) => Promise<void>;
};
export declare const applyUpdate: (update: InfinityMintProjectUpdate, project: InfinityMintDeployedProject | InfinityMintCompiledProject, infinityConsole?: InfinityConsole, debugLog?: (message: string, pipe?: string) => void) => Promise<InfinityMintDeployedProject>;
export {};
//# sourceMappingURL=updates.d.ts.map