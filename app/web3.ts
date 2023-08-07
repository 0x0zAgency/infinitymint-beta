import hre, { ethers, artifacts } from 'hardhat';
import {
    debugLog,
    getConfigFile,
    isEnvTrue,
    log,
    readGlobalSession,
    logDirect,
    saveGlobalSessionFile,
    getSolidityFolder,
    warning,
    registerNetworkLogs,
    cwd,
    setScriptMode,
    Dictionary,
    hasChangedGlobalUserId,
    setAllowExpress,
    isDebugLogDisabled,
    isAllowPiping,
    directlyOutputLogs,
    exposeLocalHostMessage,
} from './helpers';
import { BaseContract, BigNumber, utils } from 'ethers';
import fs from 'fs';
import { defaultFactory, Pipe, PipeFactory } from './pipes';
import { Contract } from '@ethersproject/contracts';
import {
    Web3Provider,
    JsonRpcProvider,
    TransactionReceipt,
    Provider,
} from '@ethersproject/providers';
import { ContractFactory, ContractTransaction } from '@ethersproject/contracts';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getLocalDeployment, create } from './deployments';
import {
    InfinityMintConfigSettingsNetwork,
    InfinityMintDeploymentLive,
    InfinityMintConsoleOptions,
    InfinityMintConfig,
    InfinityMintEventEmitter,
    InfinityMintDeploymentLocal,
    KeyValue,
    InfinityMintTempProject,
    InfinityMintCompiledProject,
} from './interfaces';
import { EthereumProvider } from 'ganache';
import InfinityConsole from './console';
import { TelnetServer } from './telnet';
import { Receipt } from 'hardhat-deploy/dist/types';
import { getProjectName, getTempDeployedProject } from './projects';
import GanacheServerInstance from './ganache';
import { closeExpressServer, hasExpress, startExpressServer } from './express';

//stores listeners for the providers
const ProviderListeners = {} as any;

export const exit = async () => {
    let ganache = GanacheServerInstance;

    if (ganache) await ganache.stop();
    if (hasExpress) closeExpressServer();
    process.exit(0);
};

/**
 * initializes infinityMint by creating the IPFS node and starting the network pipe for the defined networks in the config file. Will also allow piping to occur which will begin piping the calls from console.log to the console.
 * @param config
 * @param startGanache
 * @returns
 */
export const initializeInfinityMint = async (
    config?: InfinityMintConfig,
    startGanache?: boolean
) => {
    config = config || getConfigFile();
    registerNetworkLogs(hre.config.networks);

    //
    logDirect('🪐 Starting InfinityConsole');

    try {
        //create IPFS node
    } catch (error) {
        warning(`could not start IPFS: ` + error?.message);
    }

    //start a network pipe if we aren't ganache as we do something different if we are
    if (!startGanache) startNetworkPipe();

    //initialize console
    return config;
};

/**
 * Gets all the accounts associated with a mnemonic
 * @param mnemonic
 * @param length
 * @returns
 */
export const getAccounts = (mnemonic: string, length = 10) => {
    let accounts = [];
    let node = utils.HDNode.fromMnemonic(mnemonic);

    for (let i = 0; i < length; i++) {
        accounts.push(node.derivePath(`m/44'/60'/0'/0/` + i).address);
    }

    return accounts;
};

/**
 * used in the index.ts file to initialize and begin the InfinityConsole session. This is the main entry point for the application if you are using the CLI.
 * @param options
 * @param pipeFactory
 * @param telnetServer
 * @param eventEmitter
 * @returns
 */
export const startInfinityConsole = async (
    options?: InfinityMintConsoleOptions,
    pipeFactory?: PipeFactory,
    telnetServer?: TelnetServer,
    eventEmitter?: InfinityMintEventEmitter
) => {
    //set the script mode if applicable
    setScriptMode(options.scriptMode || false);

    debugLog(
        'starting InfinityConsole with solidity root of ' + getSolidityFolder()
    );

    if (options.startExpress) {
        //allow express logs to be emitted
        setAllowExpress(true);
        await startExpressServer();
    }

    let infinityConsole = new InfinityConsole(
        options,
        pipeFactory,
        telnetServer,
        eventEmitter
    );

    if (options.scriptMode) {
        log(
            '💭 Registering console log emitter for InfinityConsole{cyan-fg}<' +
                infinityConsole.getSessionId() +
                '>{/cyan-fg}'
        );
        //pipe the output of the infinity console to the terminal window
        infinityConsole.getConsoleLogs().emitter.on('log', (log, pipe) => {
            if (pipe === 'debug' && isDebugLogDisabled) return;
            if (pipe === 'localhost' && !exposeLocalHostMessage) return;
            if (
                pipe !== 'default' &&
                pipe !== 'debug' &&
                pipe !== 'express' &&
                !directlyOutputLogs &&
                isAllowPiping
            )
                return;

            logDirect(log);
        });
    }

    log(
        '💭 Initializing InfinityConsole{cyan-fg}<' +
            infinityConsole.getSessionId() +
            '>{/cyan-fg}'
    );
    await infinityConsole.initialize();
    log(
        '{green-fg}{bold}InfinityMint Online{/green-fg}{/bold} => InfinityConsole<' +
            infinityConsole.getSessionId() +
            '>'
    );

    if (hasChangedGlobalUserId)
        warning(
            'GlobalUserUUID has changed, database will need to be migrated to new uuid'
        );

    return infinityConsole;
};

/**
 * reads from the config file to retrieve the default account index and then gets all of the signers for the current provider and returns the default account
 * @returns
 */
export const getDefaultSigner = async () => {
    let defaultAccount = getDefaultAccountIndex();
    let signers = await ethers.getSigners();

    if (!signers[defaultAccount])
        throw new Error(
            'bad default account for network ' +
                hre.network.name +
                ' index ' +
                defaultAccount +
                'does not exist'
        );

    return signers[defaultAccount];
};

/**
 * returns the path to the deployment folder for the project and network
 * @param project
 * @returns
 */
export const getDeploymentProjectPath = (
    project: InfinityMintCompiledProject | InfinityMintTempProject
) => {
    return (
        cwd() +
        `/deployments/${hre.network.name}/` +
        project.name +
        '@' +
        project.version.version +
        '/'
    );
};

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
export const deploy = async (
    artifactName: string,
    project: InfinityMintCompiledProject | InfinityMintTempProject,
    args?: any[],
    libraries?: Dictionary<string>,
    signer?: SignerWithAddress,
    save?: boolean,
    usePreviousDeployment?: boolean,
    logTx?: boolean
): Promise<{
    localDeployment: InfinityMintDeploymentLocal;
    contract: Contract | Contract[];
}> => {
    signer = signer || (await getDefaultSigner());
    let artifact = await artifacts.readArtifact(artifactName);
    let fileName =
        getDeploymentProjectPath(project) + `${artifact.contractName}.json`;
    let buildInfo = await artifacts.getBuildInfo(
        artifact.sourceName.replace('.sol', '') + ':' + artifact.contractName
    );

    if (usePreviousDeployment && fs.existsSync(fileName)) {
        let deployment = JSON.parse(
            fs.readFileSync(fileName, {
                encoding: 'utf-8',
            })
        ) as InfinityMintDeploymentLocal;

        log(
            `🔖 using previous deployment at (${deployment.address}) for ${artifact.contractName}`
        );

        if (save) writeDeployment(deployment);

        return {
            localDeployment: deployment,
            contract: new Contract(deployment.contractName, deployment.abi),
        };
    }

    let factory = await ethers.getContractFactory(artifact.contractName, {
        signer: signer,
        libraries: libraries,
    });

    let contract = await deployViaFactory(factory, args);
    let localDeployment = {
        ...artifact,
        ...buildInfo,
        project: getProjectName(project as any),
        args: args,
        key: artifact.contractName,
        network: project.network,
        newlyDeployed: true,
        contractName: artifact.contractName,
        address: contract.address,
        transactionHash: contract.deployTransaction.hash,
        deployer: contract.deployTransaction.from,
        receipt: contract.deployTransaction as any,
    };

    if (logTx)
        log(`⭐ deployed ${artifact.contractName} => [${contract.address}]`);

    if (!save) return { contract, localDeployment };

    writeDeployment(localDeployment);
    return { contract, localDeployment };
};

/**
 * writes the deployment to the /deployments folder based on the network and project
 * @param deployment
 * @param project
 */
export const writeDeployment = (
    deployment: InfinityMintDeploymentLocal,
    project?: InfinityMintCompiledProject | InfinityMintTempProject
) => {
    let session = readGlobalSession();
    project = project || getTempDeployedProject(deployment.project);
    let fileName =
        getDeploymentProjectPath(project) + `${deployment.contractName}.json`;

    if (!session.environment.deployments) session.environment.deployments = {};
    if (!session.environment?.deployments[deployment.address]) {
        session.environment.deployments[deployment.address] = deployment;
        debugLog(`saving deployment of ${deployment.contractName} to session`);
        saveGlobalSessionFile(session);
    }

    if (!fs.existsSync(getDeploymentProjectPath(project)))
        fs.mkdirSync(getDeploymentProjectPath(project));

    debugLog(`saving ${fileName}`);
    fs.writeFileSync(fileName, JSON.stringify(deployment, null, 2));
};

/**
 * uses in the deploy function to specify gas price and other overrides for the transaction
 */
interface Overrides extends KeyValue {
    gasPrice?: BigNumber;
}

/**
 * Deploys a contract, takes an ethers factory. Does not save the deployment.
 * @param factory
 * @param args
 * @returns
 */
export const deployViaFactory = async (
    factory: ContractFactory,
    args?: any[],
    overrides?: Overrides
) => {
    if (overrides) args.push(overrides);

    let contract = await factory.deploy(...args);
    contract = await contract.deployed();
    await logTransaction(contract.deployTransaction);
    return contract;
};

/**
 * Deploys a contract via its bytecode. Does not save the deployment
 * @param abi
 * @param bytecode
 * @param args
 * @param signer
 * @returns
 */
export const deployBytecode = async (
    abi: string[],
    bytecode: string,
    args?: [],
    signer?: SignerWithAddress
) => {
    signer = signer || (await getDefaultSigner());
    let factory = await ethers.getContractFactory(abi, bytecode, signer);
    return await deployViaFactory(factory, args);
};

/**
 * Deploys a contract using hardhat deploy
 * @param contractName
 * @param signer
 * @param gasPrice
 * @param confirmations
 * @param usePreviousDeployment
 * @returns
 */
export const deployHardhat = async (
    contractName: string,
    project: InfinityMintCompiledProject | InfinityMintTempProject,
    signer?: SignerWithAddress,
    libraries?: KeyValue,
    gasPrice?: string | BigNumber,
    confirmations?: number,
    usePreviousDeployment?: boolean
) => {
    signer = signer || (await getDefaultSigner());
    let result: InfinityMintDeploymentLocal = {
        ...(await hre.deployments.deploy(contractName, {
            from: signer.address,
            gasPrice: gasPrice,
            libraries: libraries,
            log: true,
            skipIfAlreadyDeployed: usePreviousDeployment,
            waitConfirmations: confirmations || 1,
        })),
        key: contractName,
        network: project.network,
        contractName,
        project: getProjectName(project as any),
        deployer: signer.address,
    };
    await logTransaction(result.receipt);
    writeDeployment(result, project);
    return result;
};

/**
 * uses hardhat to change the network to the specified network, will stop the network pipe and start it again if the network is not ganache
 * @param network
 */
export const changeNetwork = (network: string) => {
    stopNetworkPipe(ethers.provider, hre.network.name);

    hre.changeNetwork(network);
    if (network !== 'ganache') startNetworkPipe(ethers.provider, network);
};

/**
 * Easly deploys a contract unassociated with any infinity mint project through its artifcact name and saves it to the deployments folder under the "__" folder
 * @param contractName
 * @param libraries
 * @param gasPrice
 * @returns
 */
export const deployAnonContract = async (
    contractName: string,
    libraries?: any[],
    gasPrice?: string | BigNumber
) => {
    return await deployHardhat(
        contractName,
        {
            name: '__',
            version: 'any',
            network: {
                chainId: hre.network.config.chainId,
                name: hre.network.name,
            },
        } as any,
        await getDefaultSigner(),
        libraries,
        gasPrice,
        undefined,
        false
    );
};

/**
 * Returns an ethers contract instance but takes an InfinityMintDeployment directly
 * @param deployment
 * @param provider
 * @returns
 */
export const getContract = (
    deployment: InfinityMintDeploymentLive | InfinityMintDeploymentLocal,
    provider?: Provider | JsonRpcProvider
) => {
    provider = provider || ethers.provider;
    return new ethers.Contract(deployment.address, deployment.abi, provider);
};

/**
 * Returns an instance of a contract which is signed
 * @param artifactOrDeployment
 * @param signer
 * @returns
 */
export const getSignedContract = async (
    deployment: InfinityMintDeploymentLive | InfinityMintDeploymentLocal,
    signer?: SignerWithAddress
): Promise<BaseContract> => {
    signer = signer || (await getDefaultSigner());
    let factory = await ethers.getContractFactory(deployment.contractName);
    return factory.connect(signer).attach(deployment.address);
};

/**
 * logs a transaction storing the receipt in the session and printing the gas usage
 * @param execution
 * @param logMessage
 * @param printGasUsage
 * @returns
 */
export const logTransaction = async (
    execution: Promise<ContractTransaction> | ContractTransaction | Receipt,
    logMessage?: string,
    printGasUsage: boolean = true,
    saveReceiptToGlobalSession: boolean = false
) => {
    if (logMessage && logMessage?.length !== 0) {
        log(`🏳️‍🌈 ${logMessage}`);
    }

    if (typeof execution === typeof Promise)
        execution = await (execution as Promise<ContractTransaction>);

    let tx = execution as any;
    let hash = tx.hash || tx.transactionHash;
    log(`🏷️ {magenta-fg}transaction hash{/magenta-fg} => <${hash}>`);

    let receipt: TransactionReceipt;
    if (tx.wait) {
        receipt = await tx.wait();
    } else receipt = await ethers.provider.getTransactionReceipt(hash);

    let session = readGlobalSession();

    if (!session.environment.temporaryGasReceipts)
        session.environment.temporaryGasReceipts = [];

    let savedReceipt = {
        ...receipt,
        gasUsedEther: ethers.utils.formatEther(
            (
                receipt.gasUsed.toNumber() *
                receipt.effectiveGasPrice.toNumber()
            ).toString()
        ),
        gasUsedNumerical: parseInt(receipt.gasUsed.toString()),
    };
    session.environment.temporaryGasReceipts.push({ savedReceipt });

    if (printGasUsage)
        log(
            '⛽ {magenta-fg}gas => {/magenta-fg}{underline}{yellow-fg}' +
                savedReceipt.gasUsedEther +
                '{/} {underline}' +
                savedReceipt.gasUsedNumerical.toLocaleString('en-US') +
                ' gas{/} {gray-fg}' +
                savedReceipt.effectiveGasPrice +
                ' wei{/}'
        );

    if (saveReceiptToGlobalSession) saveGlobalSessionFile(session);
    return receipt;
};

/**
 * Returns an ethers contract which you can use to execute methods on a smart contraact.
 * @param contractName
 * @param network
 * @param provider
 * @returns
 */
export const get = (contractName: string, network?: string, provider?: any) => {
    provider = provider || ethers.provider;
    return getContract(
        getLocalDeployment(contractName, network) as any,
        provider
    );
};

/**
 * Returns an InfinityMintLiveDeployment with that contract name
 * @param contractName
 * @param network
 * @returns
 */
export const getDeployment = (contractName: string, network?: string) => {
    return create(
        getLocalDeployment(contractName, network || hre.network.name) as any
    );
};

/**
 * reads the config file and returns the network settings for the given network
 * @param network
 * @returns
 */
export const getNetworkSettings = (network: string) => {
    let config = getConfigFile();
    return (
        config?.settings?.networks?.[network] ||
        ({} as InfinityMintConfigSettingsNetwork)
    );
};

/**
 * reads from the config file and returns the default account index to use
 * @returns
 */
export const getDefaultAccountIndex = () => {
    let config = getConfigFile();
    return config?.settings?.networks?.[hre.network.name]?.defaultAccount || 0;
};

/**
 * unregisters all events on the provider and deletes the listener from the ProviderListeners object
 * @param provider
 * @param network
 */
export const stopNetworkPipe = (
    provider?: Web3Provider | JsonRpcProvider | EthereumProvider,
    network?: any
) => {
    if (!network) network = hre.network.name;
    let settings = getNetworkSettings(network);
    //register events
    try {
        Object.keys(ProviderListeners[network]).forEach((key) => {
            provider.off(key as any, ProviderListeners[network][key]);
        });
    } catch (error) {
        if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
        warning('failed to stop pipe: ' + network);
    }
    defaultFactory
        .getPipe(settings.useDefaultPipe ? 'default' : network)
        .log('{red-fg}stopped pipe{/red-fg}');
    delete ProviderListeners[network];
};

/**
 * listens to events on the provider and logs them
 * @param provider
 * @param network
 * @returns
 */
export const startNetworkPipe = (
    provider?: Web3Provider | JsonRpcProvider | EthereumProvider,
    network?: any
) => {
    if (defaultFactory.pipes[network] === undefined) {
        warning('undefined network pipe: ' + network + ' creating one...');
        defaultFactory.pipes[network] = new Pipe(network);
    }
    if (!network) network = hre.network.name;
    let settings = getNetworkSettings(network);

    if (!provider) provider = ethers.provider;
    if (ProviderListeners[network]) stopNetworkPipe(provider, network);

    ProviderListeners[network] = ProviderListeners[network] || {};
    ProviderListeners[network].block = (blockNumber: any) => {
        log(
            '{green-fg}new block{/green-fg} => [' + blockNumber + ']',
            settings.useDefaultPipe ? 'default' : network
        );
    };

    ProviderListeners[network].pending = (tx: any) => {
        log(
            '{yellow-fg}new transaction pending{/yellow-fg} => ' +
                JSON.stringify(tx, null, 2),
            settings.useDefaultPipe ? 'default' : network
        );
    };

    ProviderListeners[network].error = (tx: any) => {
        defaultFactory
            .getPipe(settings.useDefaultPipe ? 'default' : network)
            .error(
                '{red-fg}tx error{/reg-fg} => ' + JSON.stringify(tx, null, 2)
            );
    };

    defaultFactory
        .getPipe(settings.useDefaultPipe ? 'default' : network)
        .log('{cyan-fg}started pipe{/cyan-fg}');

    Object.keys(ProviderListeners[network]).forEach((key) => {
        provider.on(key as any, ProviderListeners[network][key]);
    });

    debugLog('💭 registered provider event hooks for ' + network);
};
