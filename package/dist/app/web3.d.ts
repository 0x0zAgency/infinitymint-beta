import { Dictionary } from './helpers';
import { BaseContract, BigNumber } from 'ethers';
import { PipeFactory } from './pipes';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider, JsonRpcProvider, TransactionReceipt, Provider } from '@ethersproject/providers';
import { ContractFactory, ContractTransaction } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { InfinityMintDeploymentLive, InfinityMintConsoleOptions, InfinityMintEventEmitter, InfinityMintDeploymentLocal, KeyValue, InfinityMintTempProject, InfinityMintCompiledProject, InfinityMintScriptParameters, InfinityMintScript, InfinityMintGemScript, InfinityMintScriptArguments } from './interfaces';
import { EthereumProvider } from 'ganache';
import InfinityConsole from './console';
import { TelnetServer } from './telnet';
import { Receipt } from 'hardhat-deploy/dist/types';
import { Project } from './projects';
import { TokenMintedEvent } from '@typechain-types/InfinityMint';
import { InfinityMintDeployedProject } from '../app/interfaces';
/**
 * Returns event
 * @param eventName
 * @param tx
 * @returns
 */
export declare const findEvent: <T extends TokenMintedEvent>(eventName: string, tx: Receipt) => T;
/**
 * Creates Json RPC Providers for each network in the config file
 */
export declare const createProviders: (dontOverwrite?: boolean) => Dictionary<Provider>;
/**
 *
 * @param network
 * @param provider
 */
export declare const setProvider: (network: string, provider: Provider | JsonRpcProvider) => void;
/**
 *
 * @param network
 * @param rpc
 * @returns
 */
export declare const createJsonProvider: (network?: string, rpc?: string) => any;
/**
 * used by the prepare function to set the action project. You should not use this function.
 * @param project
 */
export declare const setActionProject: (project: InfinityMintTempProject) => void;
/**
 *
 * @param script
 * @param eventEmitter
 * @param gems
 * @param args
 * @param infinityConsole
 */
export declare const executeScript: (script: InfinityMintScript, eventEmitter: InfinityMintEventEmitter, gems?: Dictionary<InfinityMintGemScript>, args?: Dictionary<InfinityMintScriptArguments>, infinityConsole?: InfinityConsole, useInfinityConsoleLogger?: boolean, disableDebugLog?: boolean, project?: Project) => Promise<void>;
/**
 * allows you to use action instead of having to use stage
 * @param _stage
 * @param call
 * @param cleanup
 */
export declare const prepare: (project: InfinityMintTempProject, script: InfinityMintScriptParameters, type: 'deploy' | 'compile' | 'deployed' | 'compiled') => Promise<void>;
/**
 * must be called after prepare. Allows you to run a stage. A stage is a block of code that can be skipped or the execution can retry from the point this stage is at. This can be used to run a stage always. You may use the action function to run a stage once
 * @param _stage
 * @param call
 * @param cleanup
 */
export declare const always: (_stage: string, call: (isFirstTime?: boolean) => Promise<void>, cleanup?: (isFirstTime?: boolean) => Promise<void>, action?: 'deploy' | 'compile') => Promise<boolean | Error | Error[]>;
/**
 * you must call prepare before using this function. Allows you to run a stage. A stage is a block of code that can be skipped or the execution can retry from the point this stage is at. This can be used with the always function to run a stage always.
 * @param _stage
 * @param call
 * @param cleanup
 * @param action
 * @returns
 */
export declare const action: (_stage: string, call: (isFirstTime?: boolean) => Promise<void>, cleanup?: (isFirstTime?: boolean) => Promise<void>, action?: 'deploy' | 'compile' | 'deployed' | 'compiled') => Promise<boolean | Error | Error[]>;
/**
 * runs a stage, a stage is a block of code that can be skipped if the stage has already been run or ran always if alwaysRun is set to true. A simpler way to use this is to use the action function. This requires you to call prepare before using this function. Prepare is a function that sets the project, script, and type for the action function as well as the always function.
 * @param stage
 * @param project
 * @param call
 * @param type
 * @param infinityConsole
 * @param alwaysRun
 * @returns
 */
export declare const stage: (stage: string, project: InfinityMintTempProject, call: (isFirstTime?: boolean) => Promise<void>, type?: 'compile' | 'deploy' | 'deployed' | 'compiled', script?: InfinityMintScriptParameters, alwaysRun?: boolean, cleanup?: (isFirstTime?: boolean) => Promise<void>) => Promise<Error | Error[] | boolean>;
/**
 * Gets all the accounts associated with a mnemonic
 * @param mnemonic
 * @param length
 * @returns
 */
export declare const getAccounts: (mnemonic: string, length?: number) => any[];
/**
 * used in the index.ts file to initialize and begin the InfinityConsole session. This is the main entry point for the application if you are using the CLI.
 * @param options
 * @param pipeFactory
 * @param telnetServer
 * @param eventEmitter
 * @returns
 */
export declare const startInfinityConsole: (options?: InfinityMintConsoleOptions, pipeFactory?: PipeFactory, telnetServer?: TelnetServer, eventEmitter?: InfinityMintEventEmitter) => Promise<InfinityConsole>;
/**
 * reads from the config file to retrieve the default account index and then gets all of the signers for the current provider and returns the default account
 * @returns
 */
export declare const getDefaultSigner: () => Promise<SignerWithAddress>;
/**
 * returns the path to the deployment folder for the project and network
 * @param project
 * @returns
 */
export declare const getDeploymentProjectPath: (project: InfinityMintCompiledProject | InfinityMintTempProject) => string;
/**
 *
 * @param artifactName
 * @returns
 */
export declare const getContractArtifact: (artifactName: string) => Promise<import("hardhat/types").Artifact>;
/**
 * deploys a web3 contract and stores the deployment in the deployments folder relative to the project and network. Will use the previous deployment if it exists and usePreviousDeployment is true. Artifacts are read from the artifacts folder relative to the project. If you cannot find the artifact you are looking for, make sure you have run npx hardhat compile and relaunch the console.
 * @param artifactName
 * @param project
 * @param signer
 * @param args
 * @param libraries
 * @param save
 * @param logDeployment
 * @param usePreviousDeployment
 * @returns
 */
export declare const deploy: (artifactName: string, project: InfinityMintCompiledProject | InfinityMintTempProject, args?: any[], libraries?: Dictionary<string>, signer?: SignerWithAddress, save?: boolean, usePreviousDeployment?: boolean, logTx?: boolean) => Promise<{
    localDeployment: InfinityMintDeploymentLocal;
    contract: Contract | Contract[];
}>;
/**
 * writes the deployment to the /deployments folder based on the network and project
 * @param deployment
 * @param project
 */
export declare const writeDeployment: (deployment: InfinityMintDeploymentLocal, project?: InfinityMintCompiledProject | InfinityMintTempProject) => void;
/**
 * uses in the deploy function to specify gas price and other overrides for the transaction
 */
export interface Overrides extends KeyValue {
    gasPrice?: BigNumber;
}
/**
 * Deploys a contract, takes an ethers factory. Does not save the deployment.
 * @param factory
 * @param args
 * @returns
 */
export declare const deployViaFactory: (factory: ContractFactory, args?: any[], overrides?: Overrides) => Promise<Contract>;
/**
 * Deploys a contract via its bytecode. Does not save the deployment
 * @param abi
 * @param bytecode
 * @param args
 * @param signer
 * @returns
 */
export declare const deployBytecode: (abi: string[], bytecode: string, args?: [], signer?: SignerWithAddress) => Promise<Contract>;
/**
 * Deploys a contract using hardhat deploy
 * @param contractName
 * @param signer
 * @param gasPrice
 * @param confirmations
 * @param usePreviousDeployment
 * @returns
 */
export declare const deployHardhat: (contractName: string, project: InfinityMintCompiledProject | InfinityMintTempProject, signer?: SignerWithAddress, libraries?: KeyValue, gasPrice?: string | BigNumber, confirmations?: number, usePreviousDeployment?: boolean) => Promise<InfinityMintDeploymentLocal>;
/**
 * uses hardhat to change the network to the specified network, will stop the network pipe and start it again if the network is not ganache
 * @param network
 */
export declare const setWalletNetwork: (network: string, networkPipe?: boolean) => void;
/**
 * Easly deploys a contract unassociated with any infinity mint project through its artifcact name and saves it to the deployments folder under the "__" folder
 * @param contractName
 * @param libraries
 * @param gasPrice
 * @returns
 */
export declare const deployAnonContract: (contractName: string, libraries?: any[], gasPrice?: string | BigNumber) => Promise<InfinityMintDeploymentLocal>;
/**
 * Returns an ethers contract instance but takes an InfinityMintDeployment directly
 * @param deployment
 * @param provider
 * @returns
 */
export declare const getContract: <T extends Contract>(deployment: InfinityMintDeploymentLive | InfinityMintDeploymentLocal, provider?: Provider | JsonRpcProvider) => T;
/**
 *
 * @param abi
 * @param address
 * @param provider
 * @returns
 */
export declare const getContractFromAbi: (abi: string[], address: string, provider?: Provider | JsonRpcProvider) => Contract;
/**
 * Returns an instance of a contract which is signed
 * @param artifactOrDeployment
 * @param signer
 * @returns
 */
export declare const getSignedContract: (deployment: InfinityMintDeploymentLive | InfinityMintDeploymentLocal, signer?: SignerWithAddress) => Promise<BaseContract>;
/**
 * logs a transaction storing the receipt in the session and printing the gas usage
 * @param contractTransaction
 * @param logMessage
 * @param printHash
 * @returns
 */
export declare const waitForTx: (contractTransaction: Promise<ContractTransaction> | ContractTransaction | Receipt, logMessage?: string, printHash?: boolean) => Promise<TransactionReceipt>;
/**
 * Returns an ethers contract which you can use to execute methods on a smart contraact.
 * @param contractName
 * @param network
 * @param provider
 * @returns
 */
export declare const get: (contractName: string, network?: string, provider?: any) => Contract;
/**
 * Returns an InfinityMintLiveDeployment with that contract name
 * @param contractName
 * @param network
 * @returns
 */
export declare const getDeployment: (contractName: string, network?: string) => import("./deployments").InfinityMintDeployment;
/**
 * reads the config file and returns the network settings for the given network
 * @param network
 * @returns
 */
export declare const getNetworkSettings: (network: string) => any;
/**
 * reads from the config file and returns the default account index to use
 * @returns
 */
export declare const getDefaultAccountIndex: () => any;
export declare const startReceiptMonitor: (network?: string) => void;
export declare const stopReceiptMonitor: (network?: string, trys?: number) => Promise<TransactionReceipt[]>;
/**
 * unregisters all events on the provider and deletes the listener from the ProviderListeners object
 * @param provider
 * @param network
 */
export declare const unregisterNetworkEvents: (pipeFactory: PipeFactory, provider?: Web3Provider | JsonRpcProvider | EthereumProvider | Provider, network?: any) => void;
/**
 *
 * @param project
 * @param to
 * @param options
 * @returns
 */
export declare const mint: (project: InfinityMintDeployedProject, to: SignerWithAddress, options: {
    colour?: number[];
    pathId?: number;
    name?: string;
    mintData: any;
}) => Promise<TransactionReceipt>;
/**
 * gets the private keys from a mnemonic
 * @param mnemonic
 * @param walletLength
 * @returns
 */
export declare const getPrivateKeys: (mnemonic: any, walletLength?: number) => any[];
/**
 * listens to events on the provider and logs them
 * @param provider
 * @param network
 * @returns
 */
export declare const registerNetworkEvents: (pipeFactory: PipeFactory, provider?: Web3Provider | JsonRpcProvider | EthereumProvider | Provider, network?: any, eventEmitter?: InfinityMintEventEmitter) => void;
//# sourceMappingURL=web3.d.ts.map