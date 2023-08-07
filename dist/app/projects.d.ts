/// <reference types="node" />
import { Contract, ContractTransaction } from '@ethersproject/contracts';
import { InfinityMintProject, InfinityMintDeployedProject, InfinityMintCompiledProject, InfinityMintTempProject, InfinityMintScriptParameters, InfinityMintDeployments, InfinityMintProjectAsset, InfinityMintProjectPath } from './interfaces';
import path from 'path';
import { Dictionary } from './helpers';
import { PathLike } from 'fs';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import InfinityConsole from './console';
import { InfinityMint } from '@typechain-types/InfinityMint';
import { InfinityMintObject, InfinityMintStorage } from '@typechain-types/InfinityMintStorage';
import { InfinityMintValues } from '@typechain-types/InfinityMintValues';
import { InfinityMintApi } from '@typechain-types/InfinityMintApi';
import { InfinityMintFlags } from '@typechain-types/InfinityMintFlags';
import { InfinityMintLinker } from '@typechain-types/InfinityMintLinker';
import { Token } from './token';
import { PromiseOrValue } from '@typechain-types/common';
import { BigNumberish } from 'ethers';
import { InfinityMintAsset } from '@typechain-types/InfinityMintAsset';
/**
 * The default InfinityMint project class
 */
export declare class Project {
    version: string;
    compiledProject: InfinityMintCompiledProject;
    source: InfinityMintProject;
    deployments: InfinityMintDeployments;
    network: string;
    protected deployed: Dictionary<InfinityMintDeployedProject>;
    protected temp: InfinityMintTempProject;
    private infinityConsole;
    constructor(projectNameOrProject: string | InfinityMintProject | InfinityMintDeployedProject, console: InfinityConsole, version?: string, network?: string);
    /**
     *
     * @param network
     */
    setNetwork(network: string): Promise<void>;
    get name(): string;
    get deployedProject(): InfinityMintDeployedProject;
    loadDeployments(network: string): Promise<void>;
    getAsset(assetId: number): InfinityMintProjectAsset;
    getPath(pathId: number): InfinityMintProjectPath;
    getFullyQualifiedName(network?: string): string;
    getNameAndVersion(includeVersion?: boolean): string;
    private readDeployedProject;
    hasDeployed(network?: string): boolean;
    hasCompiled(): boolean;
    getDeployedProject(network?: string): InfinityMintDeployedProject;
    /**
     * Mints multiple tokens to the current address
     * @param count
     * @param projectNameOrProject
     * @param options
     * @returns
     */
    mintMultiple(tokens: InfinityMintObject.InfinityObjectStructOutput[]): Promise<import("@ethersproject/abstract-provider").TransactionReceipt>;
    erc721(): Promise<InfinityMint>;
    storage(): Promise<InfinityMintStorage>;
    values(): Promise<InfinityMintValues>;
    api(): Promise<InfinityMintApi>;
    assets(): Promise<InfinityMintAsset>;
    flags(): Promise<InfinityMintFlags>;
    linker(): Promise<InfinityMintLinker>;
    setFlag(tokenId: PromiseOrValue<BigNumberish>, flag: PromiseOrValue<string>, value: boolean | Promise<boolean>): Promise<void>;
    setGlobalFlag(flag: string, value: boolean): Promise<void>;
    setOnChainOption(option: string, value: string): Promise<void>;
    hasOnChainOption(option: string): Promise<boolean>;
    getOnChainOption(option: string): Promise<string>;
    setOnChainOptions(options: {
        [key: string]: string;
    }): Promise<ContractTransaction>;
    /**
     * Will return a non signed contract related to the project for you to use. contractName can be the full name of the contract or the module key it might use.
     *
     * eg (all are the same):
     *  - InfinityMint
     *  - InfinityMint:InfinityMint
     *  - erc721
     *
     *
     * @param contractNameOrModuleKey
     * @param signer
     * @param contractIndex
     * @returns
     */
    getContract<T extends Contract>(contractNameOrModuleKey: string, provider?: any, contractIndex?: number): Promise<T>;
    /**
     * Will return a signed contract related to the project for you to use. contractName can be the full name of the contract or the module key it might use.
     *
     * eg (all are the same):
     *  - InfinityMint
     *  - InfinityMint:InfinityMint
     *  - erc721
     *
     *
     * @param contractNameOrModuleKey
     * @param signer
     * @param contractIndex
     * @returns
     */
    getSignedContract<T extends Contract>(contractNameOrModuleKey: string, signer?: SignerWithAddress, provider?: any, contractIndex?: number): Promise<T>;
    /**
     * Creates a random token
     * @param pathId
     * @returns
     */
    createRandomToken(pathId?: number): Token;
    /**
     * Gets a token from the project
     * @param tokenId
     * @returns
     */
    getToken(tokenId: number): Promise<Token>;
    /**
     *
     * @param projectNameOrProject
     * @param options
     * @returns
     */
    mint(options?: {
        to?: string;
        pathId: number;
        pathSize: number;
        mintData: string;
        assets?: string[];
        colours?: string[];
        names?: string[];
    }, gasLimit?: number, useImplicitMint?: boolean): Promise<Token>;
}
/**
 *
 * @returns
 */
export declare const getCurrentProject: (cleanCache?: boolean) => InfinityMintProject;
/**
 * Returns a parsed path the current project source file
 * @returns
 */
export declare const getCurrentProjectPath: () => path.ParsedPath;
/**
 * Returns a deployed project for the current project, takes a network.
 * @param network
 * @returns
 */
export declare const getCurrentDeployedProject: (network?: string) => InfinityMintDeployedProject;
export declare const hasCompiledProject: (project: InfinityMintProject | InfinityMintTempProject, version?: string) => boolean;
/**
 * Will use temporary compiled project if it exists, otherwise will use the compiled project.
 * @param projectOrPath
 * @returns
 */
export declare const findCompiledProject: (projectOrPath: any) => InfinityMintDeployedProject | InfinityMintCompiledProject;
/**
 * Returns a compiled InfinityMintProject ready to be deployed, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 * @throws
 */
export declare const getCompiledProject: (project: InfinityMintProject | InfinityMintTempProject | string, version?: string) => InfinityMintCompiledProject;
/**
 *
 * @param project
 * @param version
 * @param network
 * @returns
 */
export declare const getNameWithNetwork: (project: InfinityMintProject | InfinityMintTempProject | InfinityMintDeployedProject, version?: string, network?: string) => string;
/**
 * Must specify a network if you want it to be included
 * @param project
 * @param version
 * @param network
 * @returns
 */
export declare const getFullyQualifiedName: (project: InfinityMintProject | InfinityMintTempProject | InfinityMintDeployedProject, version?: string, network?: string) => string;
export declare const getProjectName: (project: InfinityMintProject | InfinityMintTempProject, version?: string) => string;
export declare const getProjectVersion: (projectFullName: string) => string;
export declare const hasTempCompiledProject: (project: InfinityMintProject | InfinityMintTempProject, version?: string) => boolean;
export declare const hasTempDeployedProject: (project: InfinityMintProject | InfinityMintTempProject, version?: string) => boolean;
export declare const saveTempDeployedProject: (project: InfinityMintTempProject, network?: string) => void;
export declare const removeTempDeployedProject: (project: InfinityMintTempProject, version?: string, network?: string) => void;
export declare const removeTempCompliledProject: (project: InfinityMintTempProject, version?: string) => void;
export declare const saveTempCompiledProject: (project: InfinityMintTempProject) => void;
/**
 * Returns a temporary deployed InfinityMintProject which can be picked up and completed.
 * @param projectName
 * @returns
 * @throws
 */
export declare const getTempDeployedProject: (project: InfinityMintProject | string | InfinityMintCompiledProject, version?: string, network?: string) => InfinityMintTempProject;
/**
 * Returns a temporary compiled InfinityMintProject which can be picked up and completed.
 * @param projectName
 * @returns
 * @throws
 */
export declare const getTempCompiledProject: (project: InfinityMintProject | string | InfinityMintCompiledProject, version?: string) => InfinityMintTempProject;
export declare const deleteDeployedProject: (project: InfinityMintCompiledProject | InfinityMintProject | InfinityMintDeployedProject, network: string, version?: string) => void;
export declare const getProjectCompiledPath: (projectName: string, version?: string) => string;
export declare const deleteCompiledProject: (project: InfinityMintCompiledProject | InfinityMintProject, version?: string) => void;
/**
 *
 * @param project
 * @param version
 * @returns
 */
export declare const hasDeployedProject: (project: InfinityMintProject | InfinityMintCompiledProject | InfinityMintDeployedProject, network: string, version?: string) => boolean;
export declare const getProjectDeploymentPath: (projectName: string, network: string, version?: any) => string;
/**
 * Returns a deployed InfinityMintProject, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 */
export declare const getDeployedProject: (project: InfinityMintProject | InfinityMintCompiledProject | InfinityMintDeployedProject, network: string, version?: any) => InfinityMintDeployedProject;
export interface ProjectCache {
    updated: number;
    database: Dictionary<path.ParsedPath>;
    keys: Dictionary<string>;
    projects?: string[];
}
/**
 *
 * @returns
 */
export declare const readProjectCache: () => ProjectCache;
export declare const formatCacheEntry: (project: InfinityMintProject, path: path.ParsedPath, name?: string) => {};
export declare const parseProject: (path: path.ParsedPath, cache?: ProjectCache) => ProjectCache;
/**
 *
 * @param projects
 */
export declare const writeParsedProjects: (projects: path.ParsedPath[]) => ProjectCache;
export declare const getProjectCache: (useFresh?: boolean) => ProjectCache;
/**
 *
 * @param roots
 * @returns
 */
export declare const findProjects: (roots?: PathLike[]) => Promise<path.ParsedPath[]>;
/**
 *
 * @param script
 * @param type
 * @returns
 */
export declare const createTemporaryProject: (script: InfinityMintScriptParameters, type?: 'deployed' | 'compiled' | 'source', network?: string, version?: any, newVersion?: any) => InfinityMintCompiledProject;
/**
 *
 * @param projectOrPathName
 * @returns
 */
export declare const getProjectSource: (projectOrPathName: string | InfinityMintProject | InfinityMintTempProject | InfinityMintCompiledProject | InfinityMintDeployedProject) => path.ParsedPath;
/**
 * Returns a project class, see {@link app/projects.Project}
 * @param projectOrPathName
 * @param infinityConsole
 * @returns
 */
export declare const getProject: (projectOrPathName: string, network: string, infinityConsole: InfinityConsole, version?: string) => Promise<Project>;
/**
 * Gets a project
 * @param projectNameOrPath
 * @returns
 */
export declare const findProject: (projectNameOrPath: string) => InfinityMintProject | InfinityMintDeployedProject;
/**
 * Returns an InfinityMintProject file relative to the /projects/ folder, see {@link app/interfaces.InfinityMintProject}. Will return type of InfinityMintProjectClassic if second param is true.
 * @param projectName
 * @param isJavaScript
 * @throws
 */
export declare const requireProject: (projectPath: PathLike, isJavaScript: boolean, clearCache?: boolean) => InfinityMintProject;
/**
 *
 * @returns
 */
export declare const getCurrentCompiledProject: () => InfinityMintCompiledProject | InfinityMintProject;
//# sourceMappingURL=projects.d.ts.map