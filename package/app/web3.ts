import hre, { ethers, artifacts } from 'hardhat';
import {
    debugLog,
    getConfigFile,
    isEnvTrue,
    log,
    readGlobalSession,
    saveGlobalSessionFile,
    getSolidityFolder,
    warning,
    cwd,
    setScriptMode,
    Dictionary,
    hasChangedGlobalUserId,
    isDebugLogDisabled,
    isAllowPiping,
    exposeLocalHostMessage,
    setAllowEmojis,
    getConsoleOptions,
    blockedGanacheMessages,
    allowExpress,
    blockGanacheMessage,
    addGanacheMessage,
    directlyLog,
    setAllowPiping,
    setIgnorePipeFactory,
} from './helpers';
import { BaseContract, BigNumber, utils } from 'ethers';
import fs from 'fs';
import { Pipe, PipeFactory, setDefaultFactory } from './pipes';
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
    InfinityMintEventEmitter,
    InfinityMintDeploymentLocal,
    KeyValue,
    InfinityMintTempProject,
    InfinityMintCompiledProject,
    InfinityMintScriptParameters,
    InfinityMintScript,
    InfinityMintGemScript,
    InfinityMintScriptArguments,
} from './interfaces';
import { EthereumProvider } from 'ganache';
import InfinityConsole from './console';
import { TelnetServer, register } from './telnet';
import { Receipt } from 'hardhat-deploy/dist/types';
import {
    Project,
    getProjectName,
    getTempDeployedProject,
    saveTempCompiledProject,
    saveTempDeployedProject,
} from './projects';
import { InfinityMint, TokenMintedEvent } from '@typechain-types/InfinityMint';
import { InfinityMintDeployedProject } from '../app/interfaces';
import { InfinityMintObject } from '@typechain-types/InfinityMintStorage';

//stores listeners for the providers
const providerEventListeners = {} as any;
//current providers
const providers: Dictionary<Provider> = {};
/**
 *
 */
const providerReceipts: Dictionary<TransactionReceipt[]> = {};
const providerTransactions: Dictionary<ContractTransaction[]> = {};

let actionProject: InfinityMintTempProject | undefined;
let actionScript: InfinityMintScriptParameters | undefined;
let actionType: 'deploy' | 'compile' | 'deployed' | 'compiled';

/**
 * Returns event
 * @param eventName
 * @param tx
 * @returns
 */
export const findEvent = <T extends TokenMintedEvent>(
    eventName: string,
    tx: Receipt
) => {
    if (!tx.events) return null;

    for (let eventIndex in tx.events) {
        let event = tx.events[eventIndex];
        if (event.event.toLowerCase() === eventName.toLowerCase())
            return event as T;
    }
    return null;
};

/**
 * Creates Json RPC Providers for each network in the config file
 */
export const createProviders = (dontOverwrite: boolean = true) => {
    let config = getConfigFile();
    let networks = Object.keys(config.hardhat.networks);
    if (config.settings?.networks?.onlyCreateDefaultProvider) {
        networks = Object.keys(config.settings.networks).filter((network) => {
            return (
                config.settings.networks?.[network]?.alwaysCreateProvider ===
                true
            );
        });
    }

    networks.forEach((network) => {
        let rpc = (config.hardhat.networks[network] as any)?.url;
        if (!rpc) return;

        //if we already have a provider for this network, then skip
        if (dontOverwrite && providers[network]) return;
        debugLog('🌐 creating provider for ' + network + ' => ' + rpc);
        createJsonProvider(network, rpc);
    });

    return providers;
};

/**
 *
 * @param network
 * @param provider
 */
export const setProvider = (
    network: string,
    provider: Provider | JsonRpcProvider
) => {
    if (providers[network])
        warning('overwriting provider for network ' + network);

    providers[network] = provider;
};

/**
 *
 * @param network
 * @param rpc
 * @returns
 */
export const createJsonProvider = (network?: string, rpc?: string) => {
    if (network[network]) return network[network];
    providers[network] = new JsonRpcProvider(rpc);
    return providers[network];
};

/**
 * used by the prepare function to set the action project. You should not use this function.
 * @param project
 */
export const setActionProject = (project: InfinityMintTempProject) => {
    actionProject = project;
};

/**
 *
 * @param script
 * @param eventEmitter
 * @param gems
 * @param args
 * @param infinityConsole
 */
export const executeScript = async (
    script: InfinityMintScript,
    eventEmitter: InfinityMintEventEmitter,
    gems?: Dictionary<InfinityMintGemScript>,
    args?: Dictionary<InfinityMintScriptArguments>,
    infinityConsole?: InfinityConsole,
    useInfinityConsoleLogger: boolean = true,
    disableDebugLog: boolean = false,
    project?: Project
) => {
    try {
        let currentProject = {
            project: null,
            network: null,
            version: null,
        };

        let checkCurrentProject = (arg: InfinityMintScriptArguments) => {
            if (arg.name === 'project' && arg.value)
                currentProject.project = arg.value;

            if (arg.name === 'network' && arg.value)
                currentProject.network = arg.value;

            if (arg.name === 'target' && arg.value)
                currentProject.version = arg.value;
        };

        if (args) {
            Object.keys(args).forEach((key) => {
                checkCurrentProject(args[key]);
            });
        }

        if (script.arguments) {
            await Promise.all(
                script.arguments.map(async (arg) => {
                    checkCurrentProject(arg);

                    if (arg.optional === false && args[arg.name] === undefined)
                        throw new Error('Missing parameter: ' + arg.name);

                    if (arg.validator && !(await arg.validator(args[arg.name])))
                        throw new Error(
                            'Invalid Parameter: ' +
                                arg.name +
                                ' [' +
                                (args[arg.name] || 'undefined') +
                                ']'
                        );
                })
            );
        }

        Object.keys(script.arguments).forEach((key) => {
            let arg = script.arguments[key];
            if (args[arg.name] === undefined && arg.value !== undefined)
                args[arg.name] = {
                    ...arg,
                };
            else
                args[arg.name] = {
                    ...arg,
                    ...args[arg.name],
                };

            if (args[arg.name].type === 'boolean')
                args[arg.name].value =
                    args[arg.name].value === 'true' ||
                    args[arg.name].value === true;
        });

        if (currentProject.project)
            project = await infinityConsole.getProject(
                currentProject.project,
                currentProject.network,
                currentProject.version
            );

        let session = readGlobalSession();

        if (!session.environment.defaultProject)
            session.environment.defaultProject = project.name;

        await script.execute({
            script: script,
            eventEmitter: eventEmitter,
            gems: gems,
            args: args,
            log: (msg: string) => {
                useInfinityConsoleLogger && infinityConsole
                    ? infinityConsole.log(msg, 'default')
                    : console.log(msg);
            },
            debugLog: (msg: string) => {
                if (disableDebugLog) return;

                if (useInfinityConsoleLogger && infinityConsole)
                    infinityConsole.debugLog(msg);
                else debugLog(msg);
            },
            infinityConsole: infinityConsole,
            project: project
                ? project
                : await infinityConsole.getCurrentProject(),
        });
    } catch (error) {
        throw error;
    }
};

/**
 * allows you to use action instead of having to use stage
 * @param _stage
 * @param call
 * @param cleanup
 */
export const prepare = async (
    project: InfinityMintTempProject,
    script: InfinityMintScriptParameters,
    type: 'deploy' | 'compile' | 'deployed' | 'compiled'
) => {
    actionScript = script;
    actionType = type;

    if (actionType === 'compiled') actionType = 'compile';
    if (actionType === 'deployed') actionType = 'deploy';

    if (!project.stages) project.stages = {};
    setActionProject(project);
};

/**
 * must be called after prepare. Allows you to run a stage. A stage is a block of code that can be skipped or the execution can retry from the point this stage is at. This can be used to run a stage always. You may use the action function to run a stage once
 * @param _stage
 * @param call
 * @param cleanup
 */
export const always = async (
    _stage: string,
    call: (isFirstTime?: boolean) => Promise<void>,
    cleanup?: (isFirstTime?: boolean) => Promise<void>,
    action?: 'deploy' | 'compile'
) => {
    return await stage(
        _stage,
        actionProject!,
        call,
        action || actionType,
        actionScript,
        true,
        cleanup
    );
};

/**
 * you must call prepare before using this function. Allows you to run a stage. A stage is a block of code that can be skipped or the execution can retry from the point this stage is at. This can be used with the always function to run a stage always.
 * @param _stage
 * @param call
 * @param cleanup
 * @param action
 * @returns
 */
export const action = async (
    _stage: string,
    call: (isFirstTime?: boolean) => Promise<void>,
    cleanup?: (isFirstTime?: boolean) => Promise<void>,
    action?: 'deploy' | 'compile' | 'deployed' | 'compiled'
) => {
    return await stage(
        _stage,
        actionProject,
        call,
        action || actionType,
        actionScript,
        false,
        cleanup
    );
};

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
export const stage = async (
    stage: string,
    project: InfinityMintTempProject,
    call: (isFirstTime?: boolean) => Promise<void>,
    type?: 'compile' | 'deploy' | 'deployed' | 'compiled',
    script?: InfinityMintScriptParameters,
    alwaysRun?: boolean,
    cleanup?: (isFirstTime?: boolean) => Promise<void>
): Promise<Error | Error[] | boolean> => {
    type = type || 'compile';

    if (type === 'compiled') type = 'compile';
    if (type === 'deployed') type = 'deploy';
    if (!project.stages) project.stages = {};
    let eventName = 'stage' + (stage[0].toUpperCase() + stage.substring(1));
    if (script?.infinityConsole)
        script?.infinityConsole.debugLog('executing stage => ' + stage);
    else debugLog('executing stage => ' + stage);

    if (script?.infinityConsole) script.infinityConsole.emit(eventName as any);

    if (project?.stages[stage] === true && !alwaysRun) {
        if (script?.infinityConsole)
            script.infinityConsole.debugLog(
                '\t{cyan-fg}Skipped{/cyan-fg} => ' + stage
            );
        else debugLog('\t{cyan-fg}Skipped{/cyan-fg} => ' + stage);

        if (script?.infinityConsole)
            script.infinityConsole.emit((eventName + 'Skipped') as any);
        return true;
    }

    let isFirstTime = typeof project.stages[stage] !== 'object';
    project.stages[stage] = false;

    if (type === 'compile') saveTempCompiledProject(project);
    else saveTempDeployedProject(project);

    try {
        if (script?.infinityConsole)
            script?.infinityConsole.emit(
                (eventName + 'Pre') as any,
                isFirstTime
            );

        await new Promise((resolve, reject) => {
            setTimeout(async () => {
                await call(isFirstTime).catch(reject);
                resolve(true);
            }, 100);
        });

        project.stages[stage] = true;

        if (script?.infinityConsole)
            script.infinityConsole.emit(
                (eventName + 'Post') as any,
                isFirstTime
            );
        if (type === 'compile') saveTempCompiledProject(project);
        else saveTempDeployedProject(project);

        if (script?.infinityConsole)
            script?.infinityConsole.debugLog(
                '\t{green-fg}Success{/green-fg} => ' + stage
            );
        else debugLog('\t{green-fg}Success{/green-fg} => ' + stage);
        if (script?.infinityConsole)
            script?.infinityConsole.emit((eventName + 'Success') as any);
        return true;
    } catch (error) {
        project.stages[stage] = error;

        try {
            if (type === 'compile') saveTempCompiledProject(project);
            else saveTempDeployedProject(project);
        } catch (_error) {
            warning('could not save project');
        }

        if (script?.infinityConsole)
            script?.infinityConsole.debugLog('\t{red-fg}Failure{/red-fg}');
        else debugLog('\t{red-fg}Failure{/red-fg} => ' + stage);
        if (script?.infinityConsole)
            script?.infinityConsole.emit(
                (eventName + 'Failure') as any,
                isFirstTime
            );

        if (cleanup) await cleanup();

        return error;
    }
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
    let config = getConfigFile();

    if (options.scriptMode) setScriptMode(true);
    else setScriptMode(false);

    console.log('🪐 {green-fg}{bold}Starting InfinityConsole{/}');

    if (!options.test)
        //sets the log level to not directly output logs if this is not a tst
        setIgnorePipeFactory(false);
    else
        console.log(
            '🪐 {green-fg}{bold}Running in test mode{/} => all logs are being outputted...\n'
        );

    if (config?.logging?.ganache?.blockedMessages)
        config.logging.ganache.blockedMessages.forEach((string) =>
            blockGanacheMessage(string)
        );

    if (config?.logging?.ganache?.ethereumMessages)
        config.logging.ganache.ethereumMessages.forEach((string) =>
            addGanacheMessage(string)
        );

    if (
        options?.blessed?.fullUnicode ||
        getConsoleOptions()?.blessed?.fullUnicode ||
        options.scriptMode
    )
        setAllowEmojis(true);
    else setAllowEmojis(false);

    if (
        !isEnvTrue('PIPE_IGNORE_CONSOLE') &&
        !config?.telnet &&
        !options?.test &&
        !options?.dontPipe
    ) {
        setAllowPiping(true);
    }

    let infinityConsole = new InfinityConsole(
        options,
        pipeFactory,
        telnetServer,
        eventEmitter
    );

    if ((options.scriptMode || options.test) && isAllowPiping) {
        //pipe the output of the infinity console to the terminal window
        infinityConsole.PipeFactory.emitter.on('log', (log, pipe) => {
            if (pipe === 'debug' && isDebugLogDisabled) return;
            if (pipe === 'localhost' && !exposeLocalHostMessage) return;
            else if (
                pipe === 'localhost' &&
                blockedGanacheMessages.filter((val) => val === log).length !== 0
            ) {
                return;
            }
            if (pipe === 'express' && !allowExpress) return;

            directlyLog(log);
        });

        log(
            '💭 Registered console log emitter for InfinityConsole{cyan-fg}<' +
                infinityConsole.getSessionId() +
                '>{/cyan-fg}'
        );
    }

    setDefaultFactory(infinityConsole.PipeFactory);

    //register events on providers
    if (!options.disableNetworkEvents)
        Object.keys(providers).forEach((network) => {
            if (
                options.onlyCurrentNetworkEvents &&
                network !== hre.network.name
            ) {
                debugLog(
                    `skipping network events on ${network} as only registering current network (${hre.network.name})`
                );
                return;
            }

            registerNetworkEvents(
                infinityConsole.PipeFactory,
                providers[network],
                network,
                infinityConsole.getEventEmitter()
            );
        });

    //register events on the default provider if we are
    if (
        hre.network.name === 'hardhat' ||
        (!options.dontInitialize &&
            hre.network.name === 'ganache' &&
            options.startGanache)
    )
        registerNetworkEvents(
            infinityConsole.PipeFactory,
            ethers.provider,
            hre.network.name,
            infinityConsole.getEventEmitter()
        );

    if (!options.dontInitialize) {
        log(
            '💭 Initializing InfinityConsole{cyan-fg}<' +
                infinityConsole.getSessionId() +
                '>{/cyan-fg}'
        );
        await infinityConsole.initialize();
    } else
        warning(
            `InfinityMinnt is not initialized, the InfinityConsole needs to be initialized before use!`
        );

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
        (project?.name || (project as any)?.project) +
        '@' +
        project.version.version +
        '/'
    );
};

/**
 *
 * @param artifactName
 * @returns
 */
export const getContractArtifact = async (artifactName: string) => {
    let artifact = await hre.artifacts.readArtifact(artifactName);
    return artifact;
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
    save === undefined ? (save = true) : save;
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
        abi: artifact.abi,
        contractName: artifact.contractName,
        address: contract.address,
        transactionHash: contract.deployTransaction.hash,
        deployer: contract.deployTransaction.from,
        receipt: contract.deployTransaction as any,
    };

    if (logTx)
        log(`⭐ deployed ${artifact.contractName} => [${contract.address}]`);

    if (!save) return { contract, localDeployment };

    writeDeployment(localDeployment, project);

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
    project =
        project ||
        getTempDeployedProject(deployment.project, project?.version?.version);
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
export interface Overrides extends KeyValue {
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
    log(
        `⭐ {magenta-fg}new contract{/} =>\n\tDestination: ${contract.address}\n\tHash: ${contract.deployTransaction.hash}`
    );
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
    writeDeployment(result, project);
    return result;
};

/**
 * uses hardhat to change the network to the specified network, will stop the network pipe and start it again if the network is not ganache
 * @param network
 */
export const setWalletNetwork = (network: string, networkPipe?: boolean) => {
    if (network === hre.network.name) return;
    hre.changeNetwork(network);
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
            version: {
                version: 'any',
                tag: 'any',
            },
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
export const getContract = <T extends Contract>(
    deployment: InfinityMintDeploymentLive | InfinityMintDeploymentLocal,
    provider?: Provider | JsonRpcProvider
) => {
    provider =
        provider || providers?.[deployment.network.name] || ethers.provider;
    return new ethers.Contract(
        deployment.address,
        deployment.abi,
        provider
    ) as T;
};

/**
 *
 * @param abi
 * @param address
 * @param provider
 * @returns
 */
export const getContractFromAbi = (
    abi: string[],
    address: string,
    provider?: Provider | JsonRpcProvider
) => {
    provider = provider || ethers.provider;
    return new ethers.Contract(address, abi, provider);
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
 * @param contractTransaction
 * @param logMessage
 * @param printHash
 * @returns
 */
export const waitForTx = async (
    contractTransaction:
        | Promise<ContractTransaction>
        | ContractTransaction
        | Receipt,
    logMessage?: string,
    printHash: boolean = true
) => {
    if (typeof contractTransaction === typeof Promise)
        contractTransaction =
            await (contractTransaction as Promise<ContractTransaction>);

    let tx = contractTransaction as any;
    let hash = tx.hash || tx.transactionHash;

    if (logMessage && logMessage?.length !== 0) {
        log(`\n🏳️‍🌈 {magenta-fg}waiting for =>{/magenta-fg} ${logMessage}`);
    }
    if (printHash && hash)
        log(`🏷️  {magenta-fg}transaction hash =>{/magenta-fg} ${hash}`);

    let receipt: TransactionReceipt;
    if (tx.wait) {
        receipt = await tx.wait();
    } else receipt = await ethers.provider.getTransactionReceipt(hash);

    //print the gas usage
    if (logMessage)
        log(
            `🔥 {magenta-fg}gas used =>{/magenta-fg} ${receipt.gasUsed.toString()}`
        );

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

export const startReceiptMonitor = (network?: string) => {
    network = network || hre.network.name;

    if (!providerEventListeners[network]) {
        warning('unable to start gas reporter for ' + network);
        return;
    }

    providerTransactions[network] = [];
    providerReceipts[network] = [];
};

export const stopReceiptMonitor = async (network?: string, trys = 5) => {
    network = network || hre.network.name;
    if (!providerReceipts[network]) {
        warning('no provider receipts for ' + network);
        return;
    }

    if (providerTransactions[network].length !== 0) {
        log(
            `waiting for ${
                providerTransactions[network].length
            } transactions to be mined... (${trys--} trys left)`
        );
        //wait each second ad wait for length to be zero
        await new Promise((resolve) => {
            let interval = setInterval(() => {
                if (providerTransactions[network].length === 0 || trys <= 0) {
                    if (trys <= 0)
                        warning(
                            'failed to wait for transactions to be mined to get receipt!\nThe gas values reported on this run might be faulty! Consider a redeploy.'
                        );

                    clearInterval(interval);
                    resolve(true);
                } else
                    log(
                        `waiting for ${
                            providerTransactions[network].length
                        } transactions to be mined... (${trys--} trys left)`
                    );
            }, 2000);
        });
    }

    let receipts = [...providerReceipts[network]];

    delete providerReceipts[network];
    delete providerTransactions[network];

    return receipts;
};

/**
 * unregisters all events on the provider and deletes the listener from the ProviderListeners object
 * @param provider
 * @param network
 */
export const unregisterNetworkEvents = (
    pipeFactory: PipeFactory,
    provider?: Web3Provider | JsonRpcProvider | EthereumProvider | Provider,
    network?: any
) => {
    if (!network) network = hre.network.name;
    let settings = getNetworkSettings(network);
    //register events
    try {
        Object.keys(providerEventListeners[network]).forEach((key) => {
            provider.off(key as any, providerEventListeners[network][key]);
        });
    } catch (error) {
        if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
        warning('failed to stop pipe: ' + network);
    }
    pipeFactory
        .getPipe(settings.useDefaultPipe ? 'default' : network)
        .log('{red-fg}stopped pipe{/red-fg}');
    delete providerEventListeners[network];
};

/**
 *
 * @param project
 * @param to
 * @param options
 * @returns
 */
export const mint = async (
    project: InfinityMintDeployedProject,
    to: SignerWithAddress,
    options: {
        colour?: number[];
        pathId?: number;
        name?: string;
        mintData: any;
    }
) => {
    let contract = (await getSignedContract(
        project.deployments.erc721
    )) as InfinityMint;
    let colour = options.colour || [];
    let pathId = options.pathId || 0;
    let name = options.name || '';
    let mintData = options.mintData;

    if (!pathId) pathId = Math.floor(Math.random() * project.paths.length);

    let tx = await contract.implicitMint(
        to.address,
        pathId,
        colour,
        name,
        [],
        mintData
    );

    return await waitForTx(tx, 'minted token', true);
};

/**
 * gets the private keys from a mnemonic
 * @param mnemonic
 * @param walletLength
 * @returns
 */
export const getPrivateKeys = (mnemonic: any, walletLength?: number) => {
    let keys = [];
    walletLength = walletLength || 20;
    for (let i = 0; i < walletLength; i++) {
        keys.push(
            ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/` + i)
                .privateKey
        );
    }
    return keys;
};

/**
 * listens to events on the provider and logs them
 * @param provider
 * @param network
 * @returns
 */
export const registerNetworkEvents = (
    pipeFactory: PipeFactory,
    provider?: Web3Provider | JsonRpcProvider | EthereumProvider | Provider,
    network?: any,
    eventEmitter?: InfinityMintEventEmitter
) => {
    if (!network) network = (provider as JsonRpcProvider)?.network?.name;
    if (!network)
        throw new Error(
            'could not automatically detect netowrk to register network events tos'
        );

    if (!provider) provider = ethers?.provider;
    if (!provider)
        throw new Error(
            'coudl not automatically detect provider from hardhat to register network events too'
        );

    if (pipeFactory.pipes[network] === undefined) {
        warning('undefined network pipe: ' + network + ' creating one...');
        pipeFactory.pipes[network] = new Pipe(network);
    }

    let settings = getNetworkSettings(network);

    if (providerEventListeners[network]) {
        unregisterNetworkEvents(pipeFactory, provider, network);
        pipeFactory.getPipe(network).logs = [];
        delete providerEventListeners[network];
    }

    providerEventListeners[network] = providerEventListeners[network] || {};
    providerEventListeners[network].block = (blockNumber: any) => {
        log(
            '{magenta-fg}new block{/magenta-fg} => [' + blockNumber + ']',
            settings.useDefaultPipe ? 'default' : network
        );

        if (eventEmitter) eventEmitter.emit('onBlock', blockNumber);
    };

    providerEventListeners[network].pending = (tx: any) => {
        log(
            '{yellow-fg}new transaction pending{/yellow-fg} => ' +
                JSON.stringify(
                    { ...tx, data: tx.data ? true : false },
                    null,
                    2
                ),
            settings.useDefaultPipe ? 'default' : network
        );

        if (providerTransactions[network])
            providerTransactions[network].push(tx);
        if (eventEmitter) eventEmitter.emit('onTransactionPending', tx);
        provider.once(tx.hash, (tx) => {
            log(
                '{green-fg}transaction successful{/green-fg} => ' +
                    tx.transactionHash,
                settings.useDefaultPipe ? 'default' : network
            );
            if (providerReceipts[network]) providerReceipts[network].push(tx);
            if (providerTransactions[network])
                //remove the transaction from the pending transactions
                providerTransactions[network] = providerTransactions[
                    network
                ].filter(
                    (val) =>
                        val.hash !== tx.transactionHash &&
                        (val as any).transactionHash !== tx.transactionHash
                );
            if (eventEmitter) eventEmitter.emit('onTransactionSuccess', tx);
        });
    };

    providerEventListeners[network].error = (tx: ContractTransaction) => {
        if (providerTransactions[network])
            //remove the transaction from the pending transactions
            providerTransactions[network] = providerTransactions[
                network
            ].filter(
                (val) =>
                    val.hash !== (tx as any).transactionHash &&
                    (val as any).transactionHash !== (tx as any).transactionHash
            );

        log(
            '{red-fg}transaction failed{/yellow-fg} => ' +
                JSON.stringify(tx, null, 2),
            settings.useDefaultPipe ? 'default' : network
        );
        pipeFactory
            .getPipe(settings.useDefaultPipe ? 'default' : network)
            .error(
                '{red-fg}tx error{/reg-fg} => ' + JSON.stringify(tx, null, 2)
            );
        if (eventEmitter) eventEmitter.emit('onTransactionFailure', tx);
    };

    Object.keys(providerEventListeners[network]).forEach((key) => {
        provider.on(key as any, providerEventListeners[network][key]);
    });

    debugLog('💭 registered provider event hooks for => ' + network);
};
