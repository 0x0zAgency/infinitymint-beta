(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "hardhat", "./helpers", "ethers", "fs", "./pipes", "@ethersproject/contracts", "@ethersproject/providers", "./deployments", "./console", "./projects"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerNetworkEvents = exports.getPrivateKeys = exports.mint = exports.unregisterNetworkEvents = exports.stopReceiptMonitor = exports.startReceiptMonitor = exports.getDefaultAccountIndex = exports.getNetworkSettings = exports.getDeployment = exports.get = exports.waitForTx = exports.getSignedContract = exports.getContractFromAbi = exports.getContract = exports.deployAnonContract = exports.setWalletNetwork = exports.deployHardhat = exports.deployBytecode = exports.deployViaFactory = exports.writeDeployment = exports.deploy = exports.getContractArtifact = exports.getDeploymentProjectPath = exports.getDefaultSigner = exports.startInfinityConsole = exports.getAccounts = exports.stage = exports.action = exports.always = exports.prepare = exports.executeScript = exports.setActionProject = exports.createJsonProvider = exports.setProvider = exports.createProviders = exports.findEvent = void 0;
    const tslib_1 = require("tslib");
    const hardhat_1 = tslib_1.__importStar(require("hardhat"));
    const helpers_1 = require("./helpers");
    const ethers_1 = require("ethers");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const pipes_1 = require("./pipes");
    const contracts_1 = require("@ethersproject/contracts");
    const providers_1 = require("@ethersproject/providers");
    const deployments_1 = require("./deployments");
    const console_1 = tslib_1.__importDefault(require("./console"));
    const projects_1 = require("./projects");
    //stores listeners for the providers
    const providerEventListeners = {};
    //current providers
    const providers = {};
    /**
     *
     */
    const providerReceipts = {};
    const providerTransactions = {};
    let actionProject;
    let actionScript;
    let actionType;
    /**
     * Returns event
     * @param eventName
     * @param tx
     * @returns
     */
    const findEvent = (eventName, tx) => {
        if (!tx.events)
            return null;
        for (let eventIndex in tx.events) {
            let event = tx.events[eventIndex];
            if (event.event.toLowerCase() === eventName.toLowerCase())
                return event;
        }
        return null;
    };
    exports.findEvent = findEvent;
    /**
     * Creates Json RPC Providers for each network in the config file
     */
    const createProviders = (dontOverwrite = true) => {
        var _a, _b;
        let config = (0, helpers_1.getConfigFile)();
        let networks = Object.keys(config.hardhat.networks);
        if ((_b = (_a = config.settings) === null || _a === void 0 ? void 0 : _a.networks) === null || _b === void 0 ? void 0 : _b.onlyCreateDefaultProvider) {
            networks = Object.keys(config.settings.networks).filter((network) => {
                var _a, _b;
                return (((_b = (_a = config.settings.networks) === null || _a === void 0 ? void 0 : _a[network]) === null || _b === void 0 ? void 0 : _b.alwaysCreateProvider) ===
                    true);
            });
        }
        networks.forEach((network) => {
            var _a;
            let rpc = (_a = config.hardhat.networks[network]) === null || _a === void 0 ? void 0 : _a.url;
            if (!rpc)
                return;
            //if we already have a provider for this network, then skip
            if (dontOverwrite && providers[network])
                return;
            (0, helpers_1.debugLog)('🌐 creating provider for ' + network + ' => ' + rpc);
            (0, exports.createJsonProvider)(network, rpc);
        });
        return providers;
    };
    exports.createProviders = createProviders;
    /**
     *
     * @param network
     * @param provider
     */
    const setProvider = (network, provider) => {
        if (providers[network])
            (0, helpers_1.warning)('overwriting provider for network ' + network);
        providers[network] = provider;
    };
    exports.setProvider = setProvider;
    /**
     *
     * @param network
     * @param rpc
     * @returns
     */
    const createJsonProvider = (network, rpc) => {
        if (network[network])
            return network[network];
        providers[network] = new providers_1.JsonRpcProvider(rpc);
        return providers[network];
    };
    exports.createJsonProvider = createJsonProvider;
    /**
     * used by the prepare function to set the action project. You should not use this function.
     * @param project
     */
    const setActionProject = (project) => {
        actionProject = project;
    };
    exports.setActionProject = setActionProject;
    /**
     *
     * @param script
     * @param eventEmitter
     * @param gems
     * @param args
     * @param infinityConsole
     */
    const executeScript = (script, eventEmitter, gems, args, infinityConsole, useInfinityConsoleLogger = true, disableDebugLog = false, project) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            let currentProject = {
                project: null,
                network: null,
                version: null,
            };
            let checkCurrentProject = (arg) => {
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
                yield Promise.all(script.arguments.map((arg) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    checkCurrentProject(arg);
                    if (arg.optional === false && args[arg.name] === undefined)
                        throw new Error('Missing parameter: ' + arg.name);
                    if (arg.validator && !(yield arg.validator(args[arg.name])))
                        throw new Error('Invalid Parameter: ' +
                            arg.name +
                            ' [' +
                            (args[arg.name] || 'undefined') +
                            ']');
                })));
            }
            Object.keys(script.arguments).forEach((key) => {
                let arg = script.arguments[key];
                if (args[arg.name] === undefined && arg.value !== undefined)
                    args[arg.name] = Object.assign({}, arg);
                else
                    args[arg.name] = Object.assign(Object.assign({}, arg), args[arg.name]);
                if (args[arg.name].type === 'boolean')
                    args[arg.name].value =
                        args[arg.name].value === 'true' ||
                            args[arg.name].value === true;
            });
            if (currentProject.project)
                project = yield infinityConsole.getProject(currentProject.project, currentProject.network, currentProject.version);
            let session = (0, helpers_1.readGlobalSession)();
            if (!session.environment.defaultProject)
                session.environment.defaultProject = project.name;
            yield script.execute({
                script: script,
                eventEmitter: eventEmitter,
                gems: gems,
                args: args,
                log: (msg) => {
                    useInfinityConsoleLogger && infinityConsole
                        ? infinityConsole.log(msg, 'default')
                        : console.log(msg);
                },
                debugLog: (msg) => {
                    if (disableDebugLog)
                        return;
                    if (useInfinityConsoleLogger && infinityConsole)
                        infinityConsole.debugLog(msg);
                    else
                        (0, helpers_1.debugLog)(msg);
                },
                infinityConsole: infinityConsole,
                project: project
                    ? project
                    : yield infinityConsole.getCurrentProject(),
            });
        }
        catch (error) {
            throw error;
        }
    });
    exports.executeScript = executeScript;
    /**
     * allows you to use action instead of having to use stage
     * @param _stage
     * @param call
     * @param cleanup
     */
    const prepare = (project, script, type) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        actionScript = script;
        actionType = type;
        if (actionType === 'compiled')
            actionType = 'compile';
        if (actionType === 'deployed')
            actionType = 'deploy';
        if (!project.stages)
            project.stages = {};
        (0, exports.setActionProject)(project);
    });
    exports.prepare = prepare;
    /**
     * must be called after prepare. Allows you to run a stage. A stage is a block of code that can be skipped or the execution can retry from the point this stage is at. This can be used to run a stage always. You may use the action function to run a stage once
     * @param _stage
     * @param call
     * @param cleanup
     */
    const always = (_stage, call, cleanup, action) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield (0, exports.stage)(_stage, actionProject, call, action || actionType, actionScript, true, cleanup);
    });
    exports.always = always;
    /**
     * you must call prepare before using this function. Allows you to run a stage. A stage is a block of code that can be skipped or the execution can retry from the point this stage is at. This can be used with the always function to run a stage always.
     * @param _stage
     * @param call
     * @param cleanup
     * @param action
     * @returns
     */
    const action = (_stage, call, cleanup, action) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield (0, exports.stage)(_stage, actionProject, call, action || actionType, actionScript, false, cleanup);
    });
    exports.action = action;
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
    const stage = (stage, project, call, type, script, alwaysRun, cleanup) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        type = type || 'compile';
        if (type === 'compiled')
            type = 'compile';
        if (type === 'deployed')
            type = 'deploy';
        if (!project.stages)
            project.stages = {};
        let eventName = 'stage' + (stage[0].toUpperCase() + stage.substring(1));
        if (script === null || script === void 0 ? void 0 : script.infinityConsole)
            script === null || script === void 0 ? void 0 : script.infinityConsole.debugLog('executing stage => ' + stage);
        else
            (0, helpers_1.debugLog)('executing stage => ' + stage);
        if (script === null || script === void 0 ? void 0 : script.infinityConsole)
            script.infinityConsole.emit(eventName);
        if ((project === null || project === void 0 ? void 0 : project.stages[stage]) === true && !alwaysRun) {
            if (script === null || script === void 0 ? void 0 : script.infinityConsole)
                script.infinityConsole.debugLog('\t{cyan-fg}Skipped{/cyan-fg} => ' + stage);
            else
                (0, helpers_1.debugLog)('\t{cyan-fg}Skipped{/cyan-fg} => ' + stage);
            if (script === null || script === void 0 ? void 0 : script.infinityConsole)
                script.infinityConsole.emit((eventName + 'Skipped'));
            return true;
        }
        let isFirstTime = typeof project.stages[stage] !== 'object';
        project.stages[stage] = false;
        if (type === 'compile')
            (0, projects_1.saveTempCompiledProject)(project);
        else
            (0, projects_1.saveTempDeployedProject)(project);
        try {
            if (script === null || script === void 0 ? void 0 : script.infinityConsole)
                script === null || script === void 0 ? void 0 : script.infinityConsole.emit((eventName + 'Pre'), isFirstTime);
            yield new Promise((resolve, reject) => {
                setTimeout(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    yield call(isFirstTime).catch(reject);
                    resolve(true);
                }), 100);
            });
            project.stages[stage] = true;
            if (script === null || script === void 0 ? void 0 : script.infinityConsole)
                script.infinityConsole.emit((eventName + 'Post'), isFirstTime);
            if (type === 'compile')
                (0, projects_1.saveTempCompiledProject)(project);
            else
                (0, projects_1.saveTempDeployedProject)(project);
            if (script === null || script === void 0 ? void 0 : script.infinityConsole)
                script === null || script === void 0 ? void 0 : script.infinityConsole.debugLog('\t{green-fg}Success{/green-fg} => ' + stage);
            else
                (0, helpers_1.debugLog)('\t{green-fg}Success{/green-fg} => ' + stage);
            if (script === null || script === void 0 ? void 0 : script.infinityConsole)
                script === null || script === void 0 ? void 0 : script.infinityConsole.emit((eventName + 'Success'));
            return true;
        }
        catch (error) {
            project.stages[stage] = error;
            try {
                if (type === 'compile')
                    (0, projects_1.saveTempCompiledProject)(project);
                else
                    (0, projects_1.saveTempDeployedProject)(project);
            }
            catch (_error) {
                (0, helpers_1.warning)('could not save project');
            }
            if (script === null || script === void 0 ? void 0 : script.infinityConsole)
                script === null || script === void 0 ? void 0 : script.infinityConsole.debugLog('\t{red-fg}Failure{/red-fg}');
            else
                (0, helpers_1.debugLog)('\t{red-fg}Failure{/red-fg} => ' + stage);
            if (script === null || script === void 0 ? void 0 : script.infinityConsole)
                script === null || script === void 0 ? void 0 : script.infinityConsole.emit((eventName + 'Failure'), isFirstTime);
            if (cleanup)
                yield cleanup();
            return error;
        }
    });
    exports.stage = stage;
    /**
     * Gets all the accounts associated with a mnemonic
     * @param mnemonic
     * @param length
     * @returns
     */
    const getAccounts = (mnemonic, length = 10) => {
        let accounts = [];
        let node = ethers_1.utils.HDNode.fromMnemonic(mnemonic);
        for (let i = 0; i < length; i++) {
            accounts.push(node.derivePath(`m/44'/60'/0'/0/` + i).address);
        }
        return accounts;
    };
    exports.getAccounts = getAccounts;
    /**
     * used in the index.ts file to initialize and begin the InfinityConsole session. This is the main entry point for the application if you are using the CLI.
     * @param options
     * @param pipeFactory
     * @param telnetServer
     * @param eventEmitter
     * @returns
     */
    const startInfinityConsole = (options, pipeFactory, telnetServer, eventEmitter) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        let config = (0, helpers_1.getConfigFile)();
        if (options.scriptMode)
            (0, helpers_1.setScriptMode)(true);
        else
            (0, helpers_1.setScriptMode)(false);
        console.log('🪐 {green-fg}{bold}Starting InfinityConsole{/}');
        if (!options.test)
            //sets the log level to not directly output logs if this is not a tst
            (0, helpers_1.setIgnorePipeFactory)(false);
        else
            console.log('🪐 {green-fg}{bold}Running in test mode{/} => all logs are being outputted...\n');
        if ((_b = (_a = config === null || config === void 0 ? void 0 : config.logging) === null || _a === void 0 ? void 0 : _a.ganache) === null || _b === void 0 ? void 0 : _b.blockedMessages)
            config.logging.ganache.blockedMessages.forEach((string) => (0, helpers_1.blockGanacheMessage)(string));
        if ((_d = (_c = config === null || config === void 0 ? void 0 : config.logging) === null || _c === void 0 ? void 0 : _c.ganache) === null || _d === void 0 ? void 0 : _d.ethereumMessages)
            config.logging.ganache.ethereumMessages.forEach((string) => (0, helpers_1.addGanacheMessage)(string));
        if (((_e = options === null || options === void 0 ? void 0 : options.blessed) === null || _e === void 0 ? void 0 : _e.fullUnicode) ||
            ((_g = (_f = (0, helpers_1.getConsoleOptions)()) === null || _f === void 0 ? void 0 : _f.blessed) === null || _g === void 0 ? void 0 : _g.fullUnicode) ||
            options.scriptMode)
            (0, helpers_1.setAllowEmojis)(true);
        else
            (0, helpers_1.setAllowEmojis)(false);
        if (!(0, helpers_1.isEnvTrue)('PIPE_IGNORE_CONSOLE') &&
            !(config === null || config === void 0 ? void 0 : config.telnet) &&
            !(options === null || options === void 0 ? void 0 : options.test) &&
            !(options === null || options === void 0 ? void 0 : options.dontPipe)) {
            (0, helpers_1.setAllowPiping)(true);
        }
        let infinityConsole = new console_1.default(options, pipeFactory, telnetServer, eventEmitter);
        if ((options.scriptMode || options.test) && helpers_1.isAllowPiping) {
            //pipe the output of the infinity console to the terminal window
            infinityConsole.PipeFactory.emitter.on('log', (log, pipe) => {
                if (pipe === 'debug' && helpers_1.isDebugLogDisabled)
                    return;
                if (pipe === 'localhost' && !helpers_1.exposeLocalHostMessage)
                    return;
                else if (pipe === 'localhost' &&
                    helpers_1.blockedGanacheMessages.filter((val) => val === log).length !== 0) {
                    return;
                }
                if (pipe === 'express' && !helpers_1.allowExpress)
                    return;
                (0, helpers_1.directlyLog)(log);
            });
            (0, helpers_1.log)('💭 Registered console log emitter for InfinityConsole{cyan-fg}<' +
                infinityConsole.getSessionId() +
                '>{/cyan-fg}');
        }
        (0, pipes_1.setDefaultFactory)(infinityConsole.PipeFactory);
        //register events on providers
        if (!options.disableNetworkEvents)
            Object.keys(providers).forEach((network) => {
                if (options.onlyCurrentNetworkEvents &&
                    network !== hardhat_1.default.network.name) {
                    (0, helpers_1.debugLog)(`skipping network events on ${network} as only registering current network (${hardhat_1.default.network.name})`);
                    return;
                }
                (0, exports.registerNetworkEvents)(infinityConsole.PipeFactory, providers[network], network, infinityConsole.getEventEmitter());
            });
        //register events on the default provider if we are
        if (hardhat_1.default.network.name === 'hardhat' ||
            (!options.dontInitialize &&
                hardhat_1.default.network.name === 'ganache' &&
                options.startGanache))
            (0, exports.registerNetworkEvents)(infinityConsole.PipeFactory, hardhat_1.ethers.provider, hardhat_1.default.network.name, infinityConsole.getEventEmitter());
        if (!options.dontInitialize) {
            (0, helpers_1.log)('💭 Initializing InfinityConsole{cyan-fg}<' +
                infinityConsole.getSessionId() +
                '>{/cyan-fg}');
            yield infinityConsole.initialize();
        }
        else
            (0, helpers_1.warning)(`InfinityMinnt is not initialized, the InfinityConsole needs to be initialized before use!`);
        (0, helpers_1.log)('{green-fg}{bold}InfinityMint Online{/green-fg}{/bold} => InfinityConsole<' +
            infinityConsole.getSessionId() +
            '>');
        if (helpers_1.hasChangedGlobalUserId)
            (0, helpers_1.warning)('GlobalUserUUID has changed, database will need to be migrated to new uuid');
        return infinityConsole;
    });
    exports.startInfinityConsole = startInfinityConsole;
    /**
     * reads from the config file to retrieve the default account index and then gets all of the signers for the current provider and returns the default account
     * @returns
     */
    const getDefaultSigner = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let defaultAccount = (0, exports.getDefaultAccountIndex)();
        let signers = yield hardhat_1.ethers.getSigners();
        if (!signers[defaultAccount])
            throw new Error('bad default account for network ' +
                hardhat_1.default.network.name +
                ' index ' +
                defaultAccount +
                'does not exist');
        return signers[defaultAccount];
    });
    exports.getDefaultSigner = getDefaultSigner;
    /**
     * returns the path to the deployment folder for the project and network
     * @param project
     * @returns
     */
    const getDeploymentProjectPath = (project) => {
        return ((0, helpers_1.cwd)() +
            `/deployments/${hardhat_1.default.network.name}/` +
            ((project === null || project === void 0 ? void 0 : project.name) || (project === null || project === void 0 ? void 0 : project.project)) +
            '@' +
            project.version.version +
            '/');
    };
    exports.getDeploymentProjectPath = getDeploymentProjectPath;
    /**
     *
     * @param artifactName
     * @returns
     */
    const getContractArtifact = (artifactName) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let artifact = yield hardhat_1.default.artifacts.readArtifact(artifactName);
        return artifact;
    });
    exports.getContractArtifact = getContractArtifact;
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
    const deploy = (artifactName, project, args, libraries, signer, save, usePreviousDeployment, logTx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        signer = signer || (yield (0, exports.getDefaultSigner)());
        save === undefined ? (save = true) : save;
        let artifact = yield hardhat_1.artifacts.readArtifact(artifactName);
        let fileName = (0, exports.getDeploymentProjectPath)(project) + `${artifact.contractName}.json`;
        let buildInfo = yield hardhat_1.artifacts.getBuildInfo(artifact.sourceName.replace('.sol', '') + ':' + artifact.contractName);
        if (usePreviousDeployment && fs_1.default.existsSync(fileName)) {
            let deployment = JSON.parse(fs_1.default.readFileSync(fileName, {
                encoding: 'utf-8',
            }));
            (0, helpers_1.log)(`🔖 using previous deployment at (${deployment.address}) for ${artifact.contractName}`);
            if (save)
                (0, exports.writeDeployment)(deployment);
            return {
                localDeployment: deployment,
                contract: new contracts_1.Contract(deployment.contractName, deployment.abi),
            };
        }
        let factory = yield hardhat_1.ethers.getContractFactory(artifact.contractName, {
            signer: signer,
            libraries: libraries,
        });
        let contract = yield (0, exports.deployViaFactory)(factory, args);
        let localDeployment = Object.assign(Object.assign(Object.assign({}, artifact), buildInfo), { project: (0, projects_1.getProjectName)(project), args: args, key: artifact.contractName, network: project.network, newlyDeployed: true, abi: artifact.abi, contractName: artifact.contractName, address: contract.address, transactionHash: contract.deployTransaction.hash, deployer: contract.deployTransaction.from, receipt: contract.deployTransaction });
        if (logTx)
            (0, helpers_1.log)(`⭐ deployed ${artifact.contractName} => [${contract.address}]`);
        if (!save)
            return { contract, localDeployment };
        (0, exports.writeDeployment)(localDeployment, project);
        return { contract, localDeployment };
    });
    exports.deploy = deploy;
    /**
     * writes the deployment to the /deployments folder based on the network and project
     * @param deployment
     * @param project
     */
    const writeDeployment = (deployment, project) => {
        var _a, _b;
        let session = (0, helpers_1.readGlobalSession)();
        project =
            project ||
                (0, projects_1.getTempDeployedProject)(deployment.project, (_a = project === null || project === void 0 ? void 0 : project.version) === null || _a === void 0 ? void 0 : _a.version);
        let fileName = (0, exports.getDeploymentProjectPath)(project) + `${deployment.contractName}.json`;
        if (!session.environment.deployments)
            session.environment.deployments = {};
        if (!((_b = session.environment) === null || _b === void 0 ? void 0 : _b.deployments[deployment.address])) {
            session.environment.deployments[deployment.address] = deployment;
            (0, helpers_1.debugLog)(`saving deployment of ${deployment.contractName} to session`);
            (0, helpers_1.saveGlobalSessionFile)(session);
        }
        if (!fs_1.default.existsSync((0, exports.getDeploymentProjectPath)(project)))
            fs_1.default.mkdirSync((0, exports.getDeploymentProjectPath)(project));
        (0, helpers_1.debugLog)(`saving ${fileName}`);
        fs_1.default.writeFileSync(fileName, JSON.stringify(deployment, null, 2));
    };
    exports.writeDeployment = writeDeployment;
    /**
     * Deploys a contract, takes an ethers factory. Does not save the deployment.
     * @param factory
     * @param args
     * @returns
     */
    const deployViaFactory = (factory, args, overrides) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (overrides)
            args.push(overrides);
        let contract = yield factory.deploy(...args);
        contract = yield contract.deployed();
        (0, helpers_1.log)(`⭐ {magenta-fg}new contract{/} =>\n\tDestination: ${contract.address}\n\tHash: ${contract.deployTransaction.hash}`);
        return contract;
    });
    exports.deployViaFactory = deployViaFactory;
    /**
     * Deploys a contract via its bytecode. Does not save the deployment
     * @param abi
     * @param bytecode
     * @param args
     * @param signer
     * @returns
     */
    const deployBytecode = (abi, bytecode, args, signer) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        signer = signer || (yield (0, exports.getDefaultSigner)());
        let factory = yield hardhat_1.ethers.getContractFactory(abi, bytecode, signer);
        return yield (0, exports.deployViaFactory)(factory, args);
    });
    exports.deployBytecode = deployBytecode;
    /**
     * Deploys a contract using hardhat deploy
     * @param contractName
     * @param signer
     * @param gasPrice
     * @param confirmations
     * @param usePreviousDeployment
     * @returns
     */
    const deployHardhat = (contractName, project, signer, libraries, gasPrice, confirmations, usePreviousDeployment) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        signer = signer || (yield (0, exports.getDefaultSigner)());
        let result = Object.assign(Object.assign({}, (yield hardhat_1.default.deployments.deploy(contractName, {
            from: signer.address,
            gasPrice: gasPrice,
            libraries: libraries,
            log: true,
            skipIfAlreadyDeployed: usePreviousDeployment,
            waitConfirmations: confirmations || 1,
        }))), { key: contractName, network: project.network, contractName, project: (0, projects_1.getProjectName)(project), deployer: signer.address });
        (0, exports.writeDeployment)(result, project);
        return result;
    });
    exports.deployHardhat = deployHardhat;
    /**
     * uses hardhat to change the network to the specified network, will stop the network pipe and start it again if the network is not ganache
     * @param network
     */
    const setWalletNetwork = (network, networkPipe) => {
        if (network === hardhat_1.default.network.name)
            return;
        hardhat_1.default.changeNetwork(network);
    };
    exports.setWalletNetwork = setWalletNetwork;
    /**
     * Easly deploys a contract unassociated with any infinity mint project through its artifcact name and saves it to the deployments folder under the "__" folder
     * @param contractName
     * @param libraries
     * @param gasPrice
     * @returns
     */
    const deployAnonContract = (contractName, libraries, gasPrice) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield (0, exports.deployHardhat)(contractName, {
            name: '__',
            version: {
                version: 'any',
                tag: 'any',
            },
            network: {
                chainId: hardhat_1.default.network.config.chainId,
                name: hardhat_1.default.network.name,
            },
        }, yield (0, exports.getDefaultSigner)(), libraries, gasPrice, undefined, false);
    });
    exports.deployAnonContract = deployAnonContract;
    /**
     * Returns an ethers contract instance but takes an InfinityMintDeployment directly
     * @param deployment
     * @param provider
     * @returns
     */
    const getContract = (deployment, provider) => {
        provider =
            provider || (providers === null || providers === void 0 ? void 0 : providers[deployment.network.name]) || hardhat_1.ethers.provider;
        return new hardhat_1.ethers.Contract(deployment.address, deployment.abi, provider);
    };
    exports.getContract = getContract;
    /**
     *
     * @param abi
     * @param address
     * @param provider
     * @returns
     */
    const getContractFromAbi = (abi, address, provider) => {
        provider = provider || hardhat_1.ethers.provider;
        return new hardhat_1.ethers.Contract(address, abi, provider);
    };
    exports.getContractFromAbi = getContractFromAbi;
    /**
     * Returns an instance of a contract which is signed
     * @param artifactOrDeployment
     * @param signer
     * @returns
     */
    const getSignedContract = (deployment, signer) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        signer = signer || (yield (0, exports.getDefaultSigner)());
        let factory = yield hardhat_1.ethers.getContractFactory(deployment.contractName);
        return factory.connect(signer).attach(deployment.address);
    });
    exports.getSignedContract = getSignedContract;
    /**
     * logs a transaction storing the receipt in the session and printing the gas usage
     * @param contractTransaction
     * @param logMessage
     * @param printHash
     * @returns
     */
    const waitForTx = (contractTransaction, logMessage, printHash = true) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (typeof contractTransaction === typeof Promise)
            contractTransaction =
                yield contractTransaction;
        let tx = contractTransaction;
        let hash = tx.hash || tx.transactionHash;
        if (logMessage && (logMessage === null || logMessage === void 0 ? void 0 : logMessage.length) !== 0) {
            (0, helpers_1.log)(`\n🏳️‍🌈 {magenta-fg}waiting for =>{/magenta-fg} ${logMessage}`);
        }
        if (printHash && hash)
            (0, helpers_1.log)(`🏷️  {magenta-fg}transaction hash =>{/magenta-fg} ${hash}`);
        let receipt;
        if (tx.wait) {
            receipt = yield tx.wait();
        }
        else
            receipt = yield hardhat_1.ethers.provider.getTransactionReceipt(hash);
        //print the gas usage
        if (logMessage)
            (0, helpers_1.log)(`🔥 {magenta-fg}gas used =>{/magenta-fg} ${receipt.gasUsed.toString()}`);
        return receipt;
    });
    exports.waitForTx = waitForTx;
    /**
     * Returns an ethers contract which you can use to execute methods on a smart contraact.
     * @param contractName
     * @param network
     * @param provider
     * @returns
     */
    const get = (contractName, network, provider) => {
        provider = provider || hardhat_1.ethers.provider;
        return (0, exports.getContract)((0, deployments_1.getLocalDeployment)(contractName, network), provider);
    };
    exports.get = get;
    /**
     * Returns an InfinityMintLiveDeployment with that contract name
     * @param contractName
     * @param network
     * @returns
     */
    const getDeployment = (contractName, network) => {
        return (0, deployments_1.create)((0, deployments_1.getLocalDeployment)(contractName, network || hardhat_1.default.network.name));
    };
    exports.getDeployment = getDeployment;
    /**
     * reads the config file and returns the network settings for the given network
     * @param network
     * @returns
     */
    const getNetworkSettings = (network) => {
        var _a, _b;
        let config = (0, helpers_1.getConfigFile)();
        return (((_b = (_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.networks) === null || _b === void 0 ? void 0 : _b[network]) ||
            {});
    };
    exports.getNetworkSettings = getNetworkSettings;
    /**
     * reads from the config file and returns the default account index to use
     * @returns
     */
    const getDefaultAccountIndex = () => {
        var _a, _b, _c;
        let config = (0, helpers_1.getConfigFile)();
        return ((_c = (_b = (_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.networks) === null || _b === void 0 ? void 0 : _b[hardhat_1.default.network.name]) === null || _c === void 0 ? void 0 : _c.defaultAccount) || 0;
    };
    exports.getDefaultAccountIndex = getDefaultAccountIndex;
    const startReceiptMonitor = (network) => {
        network = network || hardhat_1.default.network.name;
        if (!providerEventListeners[network]) {
            (0, helpers_1.warning)('unable to start gas reporter for ' + network);
            return;
        }
        providerTransactions[network] = [];
        providerReceipts[network] = [];
    };
    exports.startReceiptMonitor = startReceiptMonitor;
    const stopReceiptMonitor = (network, trys = 5) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        network = network || hardhat_1.default.network.name;
        if (!providerReceipts[network]) {
            (0, helpers_1.warning)('no provider receipts for ' + network);
            return;
        }
        if (providerTransactions[network].length !== 0) {
            (0, helpers_1.log)(`waiting for ${providerTransactions[network].length} transactions to be mined... (${trys--} trys left)`);
            //wait each second ad wait for length to be zero
            yield new Promise((resolve) => {
                let interval = setInterval(() => {
                    if (providerTransactions[network].length === 0 || trys <= 0) {
                        if (trys <= 0)
                            (0, helpers_1.warning)('failed to wait for transactions to be mined to get receipt!\nThe gas values reported on this run might be faulty! Consider a redeploy.');
                        clearInterval(interval);
                        resolve(true);
                    }
                    else
                        (0, helpers_1.log)(`waiting for ${providerTransactions[network].length} transactions to be mined... (${trys--} trys left)`);
                }, 2000);
            });
        }
        let receipts = [...providerReceipts[network]];
        delete providerReceipts[network];
        delete providerTransactions[network];
        return receipts;
    });
    exports.stopReceiptMonitor = stopReceiptMonitor;
    /**
     * unregisters all events on the provider and deletes the listener from the ProviderListeners object
     * @param provider
     * @param network
     */
    const unregisterNetworkEvents = (pipeFactory, provider, network) => {
        if (!network)
            network = hardhat_1.default.network.name;
        let settings = (0, exports.getNetworkSettings)(network);
        //register events
        try {
            Object.keys(providerEventListeners[network]).forEach((key) => {
                provider.off(key, providerEventListeners[network][key]);
            });
        }
        catch (error) {
            if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS'))
                throw error;
            (0, helpers_1.warning)('failed to stop pipe: ' + network);
        }
        pipeFactory
            .getPipe(settings.useDefaultPipe ? 'default' : network)
            .log('{red-fg}stopped pipe{/red-fg}');
        delete providerEventListeners[network];
    };
    exports.unregisterNetworkEvents = unregisterNetworkEvents;
    /**
     *
     * @param project
     * @param to
     * @param options
     * @returns
     */
    const mint = (project, to, options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let contract = (yield (0, exports.getSignedContract)(project.deployments.erc721));
        let colour = options.colour || [];
        let pathId = options.pathId || 0;
        let name = options.name || '';
        let mintData = options.mintData;
        if (!pathId)
            pathId = Math.floor(Math.random() * project.paths.length);
        let tx = yield contract.implicitMint(to.address, pathId, colour, name, [], mintData);
        return yield (0, exports.waitForTx)(tx, 'minted token', true);
    });
    exports.mint = mint;
    /**
     * gets the private keys from a mnemonic
     * @param mnemonic
     * @param walletLength
     * @returns
     */
    const getPrivateKeys = (mnemonic, walletLength) => {
        let keys = [];
        walletLength = walletLength || 20;
        for (let i = 0; i < walletLength; i++) {
            keys.push(hardhat_1.ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/` + i)
                .privateKey);
        }
        return keys;
    };
    exports.getPrivateKeys = getPrivateKeys;
    /**
     * listens to events on the provider and logs them
     * @param provider
     * @param network
     * @returns
     */
    const registerNetworkEvents = (pipeFactory, provider, network, eventEmitter) => {
        var _a;
        if (!network)
            network = (_a = provider === null || provider === void 0 ? void 0 : provider.network) === null || _a === void 0 ? void 0 : _a.name;
        if (!network)
            throw new Error('could not automatically detect netowrk to register network events tos');
        if (!provider)
            provider = hardhat_1.ethers === null || hardhat_1.ethers === void 0 ? void 0 : hardhat_1.ethers.provider;
        if (!provider)
            throw new Error('coudl not automatically detect provider from hardhat to register network events too');
        if (pipeFactory.pipes[network] === undefined) {
            (0, helpers_1.warning)('undefined network pipe: ' + network + ' creating one...');
            pipeFactory.pipes[network] = new pipes_1.Pipe(network);
        }
        let settings = (0, exports.getNetworkSettings)(network);
        if (providerEventListeners[network]) {
            (0, exports.unregisterNetworkEvents)(pipeFactory, provider, network);
            pipeFactory.getPipe(network).logs = [];
            delete providerEventListeners[network];
        }
        providerEventListeners[network] = providerEventListeners[network] || {};
        providerEventListeners[network].block = (blockNumber) => {
            (0, helpers_1.log)('{magenta-fg}new block{/magenta-fg} => [' + blockNumber + ']', settings.useDefaultPipe ? 'default' : network);
            if (eventEmitter)
                eventEmitter.emit('onBlock', blockNumber);
        };
        providerEventListeners[network].pending = (tx) => {
            (0, helpers_1.log)('{yellow-fg}new transaction pending{/yellow-fg} => ' +
                JSON.stringify(Object.assign(Object.assign({}, tx), { data: tx.data ? true : false }), null, 2), settings.useDefaultPipe ? 'default' : network);
            if (providerTransactions[network])
                providerTransactions[network].push(tx);
            if (eventEmitter)
                eventEmitter.emit('onTransactionPending', tx);
            provider.once(tx.hash, (tx) => {
                (0, helpers_1.log)('{green-fg}transaction successful{/green-fg} => ' +
                    tx.transactionHash, settings.useDefaultPipe ? 'default' : network);
                if (providerReceipts[network])
                    providerReceipts[network].push(tx);
                if (providerTransactions[network])
                    //remove the transaction from the pending transactions
                    providerTransactions[network] = providerTransactions[network].filter((val) => val.hash !== tx.transactionHash &&
                        val.transactionHash !== tx.transactionHash);
                if (eventEmitter)
                    eventEmitter.emit('onTransactionSuccess', tx);
            });
        };
        providerEventListeners[network].error = (tx) => {
            if (providerTransactions[network])
                //remove the transaction from the pending transactions
                providerTransactions[network] = providerTransactions[network].filter((val) => val.hash !== tx.transactionHash &&
                    val.transactionHash !== tx.transactionHash);
            (0, helpers_1.log)('{red-fg}transaction failed{/yellow-fg} => ' +
                JSON.stringify(tx, null, 2), settings.useDefaultPipe ? 'default' : network);
            pipeFactory
                .getPipe(settings.useDefaultPipe ? 'default' : network)
                .error('{red-fg}tx error{/reg-fg} => ' + JSON.stringify(tx, null, 2));
            if (eventEmitter)
                eventEmitter.emit('onTransactionFailure', tx);
        };
        Object.keys(providerEventListeners[network]).forEach((key) => {
            provider.on(key, providerEventListeners[network][key]);
        });
        (0, helpers_1.debugLog)('💭 registered provider event hooks for => ' + network);
    };
    exports.registerNetworkEvents = registerNetworkEvents;
});
//# sourceMappingURL=web3.js.map