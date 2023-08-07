/// <reference types="node" />
/// <reference types="node" />
import events, { EventEmitter } from 'events';
import { InfinityMintDeploymentScript, InfinityMintDeploymentLive, InfinityMintDeploymentLocal, InfinityMintEventKeys, InfinityMintCompiledProject, InfinityMintDeployedProject, InfinityMintEventEmitter, KeyValue, InfinityMintTempProject, InfinityMintDeploymentLink, InfinityMintDeployments } from './interfaces';
import { Dictionary } from './helpers';
import fs from 'fs';
import { Contract } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import InfinityConsole from './console';
/**
 * Deployment class for InfinityMint deployments
 */
export declare class InfinityMintDeployment {
    /**
     * the event emitter for this deployment. Will be the event emitter of the infinity console if available or a new one.
     */
    protected emitter: EventEmitter;
    /**
     * the deployment script which was used to create this InfinityMintDeployment. See {@link app/interfaces.InfinityMintDeploymentScript}
     */
    protected deploymentScript: InfinityMintDeploymentScript;
    /**
     * the live infinity mint deployment interface containing the abi, address, deployer approved and more, See {@link app/interfaces.InfinityMintDeploymentLive}
     */
    protected tempLiveDeployment: InfinityMintDeploymentLive[];
    /**
     * the live infinity mint deployment interface containing the abi, address, deployer approved and more, See {@link app/interfaces.InfinityMintDeploymentLive}
     */
    protected liveDeployment: InfinityMintDeploymentLive[];
    /**
     * the location of the deployment script file
     */
    protected deploymentScriptLocation: string;
    /**
     * the key this deployment will take in the contract property of the InfinityMintDeployedProject. See {@link app/interfaces.InfinityMintDeployedProject}
     */
    protected key: string;
    readonly isGem: boolean;
    /**
     * the project this deployment is for. See {@link app/interfaces.InfinityMintProject}
     */
    protected project: InfinityMintCompiledProject | InfinityMintDeployedProject | InfinityMintTempProject;
    /**
     * the network name this deployment is for
     */
    protected network: string;
    /**
     * returns true if the deployment has been deployed to a blockchain
     */
    protected hasDeployedAll: boolean;
    /**
     * returns true if the deployment has been set up
     */
    protected hasSetupDeployments: boolean;
    /**
     * creates a new InfinityMintDeployment. See {@link app/interfaces.InfinityMintDeploymentScript} for more information on the deployment script. The property key of the deployment script much match the key parameter.
     * @param deploymentScriptLocation
     * @param key
     * @param network
     * @param project
     * @param console
     */
    constructor(deploymentScriptLocation: string, key: string, network: string, project: InfinityMintCompiledProject | InfinityMintTempProject | InfinityMintDeployedProject, console?: InfinityConsole);
    readLiveDeployment(index?: number): any;
    setLink(link: InfinityMintDeploymentLink): void;
    getFilePath(index?: number): string;
    get values(): Dictionary<number | boolean | import("@app/interfaces").ValuesReturnType>;
    /**
     * reloads the source file script
     */
    reloadScript(): void;
    /**
     * Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple  calls passing the same combination of eventNameand listener will result in the listener being added, and called, multiple times.
     *
     * Returns a reference to the EventEmitter, so that calls can be chained.
     * @param event
     * @param callback
     * @returns
     */
    on(event: InfinityMintEventKeys, callback: (...args: any[]) => void): events;
    /**
     * unregisters a listener
     * @param event
     * @param callback
     * @returns
     */
    off(event: InfinityMintEventKeys, callback: (...args: any[]) => void): events;
    /**
     * returns the index of this deployment. the index is used to determine the order in which the deployments are deployed. The default index is 10.
     * @returns
     */
    getIndex(): number;
    /**
     * returns the current solidity folder. The default solidity folder is 'alpha'. The solidity folder is the folder solc will use to compile the contracts.
     * @returns
     */
    getSolidityFolder(): fs.PathLike;
    get read(): Contract;
    write(): Promise<Contract>;
    /**
     * returns the key of this deployment. The key is the same key in the property contracts in the InfinityMintDeployedProject. See {@link app/interfaces.InfinityMintDeployedProject}
     * @returns
     */
    getKey(): string;
    /**
     * Defines which InfinityMintProjectModules this deployment satities. A module is a type of contract that is used by other contracts or by the frontend. See {@link app/interfaces.InfinityMintProjectModules}. Some possible modules include 'erc721', 'assets', 'random' and 'minter'.
     * @returns
     */
    getModuleKey(): keyof import("@app/interfaces").InfinityMintProjectModules;
    /**
     * gets the name of the live deployment at the specified index. If no index is specified, the name of the first live deployment is returned.
     * @param index
     * @returns
     */
    getContractName(index?: number): any;
    /**
     *
     * @param index
     * @returns
     */
    getArtifact(index?: number): Promise<import("hardhat/types").Artifact>;
    /**
     *
     * @param index
     * @returns
     */
    hasLiveDeployment(index?: number): boolean;
    /**
     * gets a live deployment, only accessible once deployment has succeeded a deploy script
     * @param index
     * @returns
     */
    getLiveDeployment<T extends InfinityMintDeploymentLive>(index?: number): T;
    /**
     * returns the permissions of this deployment. The permissions are used to determine which contracts can call this contract.
     */
    getPermissions(): string[];
    /**
     * gets the temporary deployment file path
     * @returns
     */
    getTemporaryFilePath(): string;
    setApproved(addresses: string[], index?: number): void;
    multiApprove(addresses: string[]): Promise<import("@ethersproject/abstract-provider").TransactionReceipt>;
    isAuthenticated(addressToCheck: string): Promise<boolean>;
    /**
     *
     * @param addresses
     */
    multiRevoke(addresses: string[]): Promise<import("@ethersproject/abstract-provider").TransactionReceipt>;
    /**
     * TODO: needs an interface
     * returns a parsed temporary deployment
     * @returns
     */
    private readTemporaryDeployment;
    /**
     * returns a live deployment by its artifact name
     * @param name
     * @returns
     */
    getDeploymentByArtifactName(name: string): InfinityMintDeploymentLive;
    /**
     * gets the deployer of the live deployment at the specified index. If no index is specified, the deployer of the first live deployment is returned.
     * @param index
     * @returns
     */
    getDeployer(index?: number): string;
    /**
     * gets the approved addresses of the live deployment at the specified index. If no index is specified, the approved addresses of the first live deployment is returned.
     * @param index
     * @returns
     */
    getApproved(index?: number): string[];
    /**
     * gets the address of the live deployment at the specified index. If no index is specified, the address of the first live deployment is returned.
     * @param index
     * @returns
     */
    getAddress(index?: number): string;
    isLink(): boolean;
    getLinkKey(): any;
    getLink(): InfinityMintDeploymentLink;
    /**
     * returns true if this deployment is a library
     * @returns
     */
    isLibrary(): boolean;
    /**
     * returns the abi of the live deployment at the specified index. If no index is specified, the abi of the first live deployment is returned.
     * @param index
     * @returns
     */
    getAbi(index?: number): any[];
    /**
     * returns all of the deployed contracts for this deployment
     * @returns
     */
    getDeployments(): InfinityMintDeploymentLive[];
    reset(): void;
    /**
     * returns true if this deployment is important. An important deployment is a deployment that is required for the project to function. If an important deployment fails to deploy, the project will not be deployed. Import contracts will also be deployed first.
     * @returns
     */
    isImportant(): boolean;
    /**
     * returns true if this deployment is unique. A unique deployment is a deployment that can only be deployed once. If a unique deployment has already been deployed, it will not be deployed again.
     * @returns
     */
    isUnique(): boolean;
    /**
     * returns true if this deployment has been deployed
     * @returns
     */
    hasDeployed(): boolean;
    /**
     * returns true if the deployment has been setup
     * @returns
     */
    hasSetup(): boolean;
    /**
     * saves the live deployments to the temporary deployment file
     */
    saveTemporaryDeployments(): void;
    /**
     * Will read temporary deployment and then write it to the real deployment location
     */
    saveFinalDeployment(): void;
    /**
     * Returns an ethers contract instance of this deployment for you to connect signers too.
     * @param index
     * @returns
     */
    getContract<T extends Contract>(index?: number, provider?: any): T;
    /**
     * Returns a signed contract with the current account.
     * @param index
     * @returns
     */
    getSignedContract<T extends Contract>(index?: number, signer?: SignerWithAddress, provider?: any): Promise<T>;
    /**
     * used after deploy to set the the live deployments for this deployment. See {@link app/interfaces.InfinityMintDeploymentLive}, Will check if each member has the same network and project name as the one this deployment class is attached too
     * @param liveDeployments
     */
    updateLiveDeployments(liveDeployments: InfinityMintDeploymentLive | InfinityMintDeploymentLive[]): void;
    /**
     * returns true if we have a local deployment for this current network
     * @param index
     * @returns
     */
    hasLocalDeployment(index?: number): boolean;
    /**
     * gets a deployment inside of the current /deployments/ folder
     * @param index
     * @returns
     */
    getLocalDeployment(index?: number): InfinityMintDeploymentLocal;
    /**
     * returns the deployment script for this deployment
     * @returns
     */
    getDeploymentScript<T extends InfinityMintDeploymentScript>(): T;
    getValues<T>(): T;
    setDefaultValues(values: KeyValue, save?: boolean): void;
    /**
     * returns the location the deployment script is located at
     * @returns
     */
    getDeploymentScriptLocation(): string;
    /**
     * Deploys this ssmart contract
     * @param args
     * @returns
     */
    deploy(...args: any): Promise<InfinityMintDeploymentLive[]>;
    /**
     * used internally to turn an InfinityMintDeploymentLocal into an InfinityMintDeploymentLive
     * @param localDeployment
     * @returns
     */
    private populateLiveDeployment;
    /**
     * approves wallets passed in to be able to run admin methods on the contract
     * @param addresses
     * @param log
     * @returns
     */
    setPermissions(addresses: string[]): Promise<import("@ethersproject/abstract-provider").TransactionReceipt>;
    /**
     * calls the setup method on the deployment script
     * @param args
     */
    setup(...args: any): Promise<void>;
    getLibaries(): Promise<any>;
    /**
     * Executes a method on the deploy script and immediately returns the value. Setup will return ethers contracts.
     * @param method
     * @param args
     * @returns
     */
    execute(method: 'setup' | 'deploy' | 'update' | 'switch' | 'cleanup' | 'post', args: KeyValue, infinityConsole?: InfinityConsole, eventEmitter?: InfinityMintEventEmitter, deployments?: InfinityMintDeployments, contracts?: any): Promise<void | string[] | {
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
}
/**
 * loads all deployment classes for a project
 * @param project
 * @param console
 * @returns
 */
export declare const loadDeploymentClasses: (project: InfinityMintDeployedProject | InfinityMintCompiledProject, console?: InfinityConsole) => Promise<InfinityMintDeployment[]>;
export declare const toKeyValues: (loadDeploymentClasses: InfinityMintDeployment[]) => Dictionary<InfinityMintDeployment>;
export declare const filterLinkDeployments: (projectOrPath: string | InfinityMintCompiledProject | InfinityMintDeployedProject, loadedDeploymentClasses: InfinityMintDeployment[], includeAll?: boolean) => InfinityMintDeployment[];
/**
 * Returns a list of deployment classes which are InfinityLinks
 * @param projectOrPath
 * @param loadedDeploymentClasses
 * @returns
 */
export declare const loadProjectDeploymentLinks: (projectOrPath: string | InfinityMintCompiledProject | InfinityMintDeployedProject, console?: InfinityConsole, loadedDeploymentClasses?: InfinityMintDeployment[], includeAll?: boolean) => Promise<InfinityMintDeployment[]>;
export declare const filterUsedDeploymentClasses: (projectOrPath: string | InfinityMintCompiledProject | InfinityMintDeployedProject, loadedDeploymentClasses: InfinityMintDeployment[]) => InfinityMintDeployment[];
/**
 * Returns a list of deployment classes relating to a project in order to deploy it ready to be steped through
 * @param projectOrPath
 * @param loadedDeploymentClasses
 * @returns
 */
export declare const loadProjectDeploymentClasses: (projectOrPath: string | InfinityMintCompiledProject | InfinityMintDeployedProject, console?: InfinityConsole, loadedDeploymentClasses?: InfinityMintDeployment[]) => Promise<InfinityMintDeployment[]>;
/**
 * gets a deployment in the /deployments/network/ folder and turns it into an InfinityMintDeploymentLive
 */
export declare const getLocalDeployment: (contractName: string, network: string) => InfinityMintDeploymentLocal;
/**
 * Returns the raw .json file in the /deployments/network/ folder
 * @param contractName
 * @returns
 */
export declare const readLocalDeployment: (contractName: string, network: string) => InfinityMintDeploymentLocal;
/**
 * Returns true if a deployment manifest for this key/contractName is found
 * @param contractName - can be a key (erc721, assets) or a fully qualified contract name
 * @param project
 * @param network
 * @returns
 */
export declare const hasDeploymentManifest: (contractName: string, project: InfinityMintDeployedProject | InfinityMintCompiledProject, network?: string) => boolean;
export declare const getDeploymentClass: (contractName: string, project: InfinityMintDeployedProject, network?: string) => InfinityMintDeployment;
export declare const getLiveDeployments: (contractName: string, project: InfinityMintCompiledProject | InfinityMintDeployedProject, network: string) => InfinityMintDeploymentLive[];
/**
 * Returns a new deployment class from a live deployment file
 * @param liveDeployment
 * @returns
 */
export declare const create: (liveDeployment: InfinityMintDeploymentLive, deploymentScript?: string, project?: InfinityMintCompiledProject | InfinityMintTempProject) => InfinityMintDeployment;
/**
 * Returns a list of InfinityMintDeployment classes for the network and project based on the deployment typescripts which are found.
 * @returns
 */
export declare const getDeploymentClasses: (project: InfinityMintDeployedProject | InfinityMintCompiledProject | InfinityMintDeployedProject, console?: InfinityConsole, network?: string, roots?: string[]) => Promise<InfinityMintDeployment[]>;
//# sourceMappingURL=deployments.d.ts.map