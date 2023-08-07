(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "events", "./helpers", "./projects", "fs", "path", "./web3", "hardhat", "./gems"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDeploymentClasses = exports.create = exports.getLiveDeployments = exports.getDeploymentClass = exports.hasDeploymentManifest = exports.readLocalDeployment = exports.getLocalDeployment = exports.loadProjectDeploymentClasses = exports.filterUsedDeploymentClasses = exports.loadProjectDeploymentLinks = exports.filterLinkDeployments = exports.toKeyValues = exports.loadDeploymentClasses = exports.InfinityMintDeployment = void 0;
    const tslib_1 = require("tslib");
    const events_1 = tslib_1.__importDefault(require("events"));
    const helpers_1 = require("./helpers");
    const projects_1 = require("./projects");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const path_1 = tslib_1.__importDefault(require("path"));
    const web3_1 = require("./web3");
    const hardhat_1 = tslib_1.__importDefault(require("hardhat"));
    const gems_1 = require("./gems");
    /**
     * Deployment class for InfinityMint deployments
     */
    class InfinityMintDeployment {
        /**
         * creates a new InfinityMintDeployment. See {@link app/interfaces.InfinityMintDeploymentScript} for more information on the deployment script. The property key of the deployment script much match the key parameter.
         * @param deploymentScriptLocation
         * @param key
         * @param network
         * @param project
         * @param console
         */
        constructor(deploymentScriptLocation = null, key, network, project, console) {
            /**
             * the deployment script which was used to create this InfinityMintDeployment. See {@link app/interfaces.InfinityMintDeploymentScript}
             */
            this.deploymentScript = {};
            /**
             * returns true if the deployment has been deployed to a blockchain
             */
            this.hasDeployedAll = false;
            /**
             * returns true if the deployment has been set up
             */
            this.hasSetupDeployments = false;
            this.emitter = (console === null || console === void 0 ? void 0 : console.getEventEmitter()) || new events_1.default.EventEmitter();
            this.deploymentScriptLocation = deploymentScriptLocation;
            this.key = key;
            if (this.deploymentScriptLocation &&
                fs_1.default.existsSync(this.deploymentScriptLocation))
                this.reloadScript();
            else
                (0, helpers_1.debugLog)(`\tdeploy script for [${this.key}]<${this.project}> not found`);
            if (this.deploymentScriptLocation &&
                this.deploymentScript.key !== this.key)
                throw new Error('key mismatch: ' +
                    this.deploymentScript.key +
                    ' in ' +
                    deploymentScriptLocation +
                    'should equal ' +
                    this.key);
            this.network = network;
            this.project = project;
            this.tempLiveDeployment = [];
            this.liveDeployment = [];
            if (fs_1.default.existsSync(this.getFilePath())) {
                (0, helpers_1.debugLog)(`previous deployment for [${this.key}]<${this.project.name}> exists`);
                this.liveDeployment = this.readLiveDeployment().liveDeployments || [
                    this.readLiveDeployment(),
                ];
                this.hasSetupDeployments = this.readLiveDeployment().setup;
                if (this.tempLiveDeployment.length === 0) {
                    this.tempLiveDeployment = this.liveDeployment;
                }
                if (this.liveDeployment.length === this.tempLiveDeployment.length) {
                    this.hasDeployedAll = true;
                }
            }
            if (fs_1.default.existsSync(this.getTemporaryFilePath())) {
                (0, helpers_1.debugLog)(`previous temp deployment for [${this.key}]<${this.project.name}> exists`);
                this.tempLiveDeployment =
                    this.readTemporaryDeployment().liveDeployments ||
                        this.tempLiveDeployment ||
                        [];
                this.hasDeployedAll = this.tempLiveDeployment.length !== 0;
                this.hasSetupDeployments = this.readTemporaryDeployment().setup;
            }
        }
        readLiveDeployment(index = 0) {
            return JSON.parse(fs_1.default.readFileSync(this.getFilePath(index), { encoding: 'utf8' }));
        }
        setLink(link) {
            this.deploymentScript.link = link;
        }
        getFilePath(index = 0) {
            var _a, _b;
            return path_1.default.join((0, helpers_1.cwd)(), 'deployments', this.network, (0, projects_1.getProjectName)(this.project, ((_b = (_a = this.project) === null || _a === void 0 ? void 0 : _a.version) === null || _b === void 0 ? void 0 : _b.version) || '1.0.0'), this.getContractName(index) + '.json');
        }
        get values() {
            return this.deploymentScript.values;
        }
        /**
         * reloads the source file script
         */
        reloadScript() {
            let location = this.deploymentScriptLocation;
            if (require.cache[location]) {
                (0, helpers_1.debugLog)('\tdeleting old cache of ' + location);
                delete require.cache[location];
                (0, helpers_1.debugLog)(`\treloading <${location}>`);
            }
            else
                (0, helpers_1.debugLog)(`\tloading <${location}>`);
            let requirement = require(location);
            this.deploymentScript = requirement.default || requirement;
            if (!this.deploymentScript.key)
                this.deploymentScript.key = this.key;
        }
        /**
         * Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple  calls passing the same combination of eventNameand listener will result in the listener being added, and called, multiple times.
         *
         * Returns a reference to the EventEmitter, so that calls can be chained.
         * @param event
         * @param callback
         * @returns
         */
        on(event, callback) {
            return this.emitter.on(event, callback);
        }
        /**
         * unregisters a listener
         * @param event
         * @param callback
         * @returns
         */
        off(event, callback) {
            return this.emitter.off(event, callback);
        }
        /**
         * returns the index of this deployment. the index is used to determine the order in which the deployments are deployed. The default index is 10.
         * @returns
         */
        getIndex() {
            return this.deploymentScript.index || 10;
        }
        /**
         * returns the current solidity folder. The default solidity folder is 'alpha'. The solidity folder is the folder solc will use to compile the contracts.
         * @returns
         */
        getSolidityFolder() {
            return this.deploymentScript.solidityFolder || 'alpha';
        }
        get read() {
            return this.getContract();
        }
        write() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return this.getSignedContract();
            });
        }
        /**
         * returns the key of this deployment. The key is the same key in the property contracts in the InfinityMintDeployedProject. See {@link app/interfaces.InfinityMintDeployedProject}
         * @returns
         */
        getKey() {
            return this.key;
        }
        /**
         * Defines which InfinityMintProjectModules this deployment satities. A module is a type of contract that is used by other contracts or by the frontend. See {@link app/interfaces.InfinityMintProjectModules}. Some possible modules include 'erc721', 'assets', 'random' and 'minter'.
         * @returns
         */
        getModuleKey() {
            return this.deploymentScript.module;
        }
        /**
         * gets the name of the live deployment at the specified index. If no index is specified, the name of the first live deployment is returned.
         * @param index
         * @returns
         */
        getContractName(index = 0) {
            var _a, _b, _c;
            return this.tempLiveDeployment.length !== 0 &&
                this.tempLiveDeployment[index]
                ? ((_a = this.tempLiveDeployment[index]) === null || _a === void 0 ? void 0 : _a.name) ||
                    ((_b = this.tempLiveDeployment[index]) === null || _b === void 0 ? void 0 : _b.contractName)
                : ((_c = this === null || this === void 0 ? void 0 : this.deploymentScript) === null || _c === void 0 ? void 0 : _c.contract) || this.key;
        }
        /**
         *
         * @param index
         * @returns
         */
        getArtifact(index = 0) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let contractName = this.getContractName(index);
                return yield hardhat_1.default.artifacts.readArtifact(contractName);
            });
        }
        /**
         *
         * @param index
         * @returns
         */
        hasLiveDeployment(index = 0) {
            return this.liveDeployment[index] !== undefined;
        }
        /**
         * gets a live deployment, only accessible once deployment has succeeded a deploy script
         * @param index
         * @returns
         */
        getLiveDeployment(index = 0) {
            let deployment = this.liveDeployment[index];
            return deployment;
        }
        /**
         * returns the permissions of this deployment. The permissions are used to determine which contracts can call this contract.
         */
        getPermissions() {
            return this.deploymentScript.permissions;
        }
        /**
         * gets the temporary deployment file path
         * @returns
         */
        getTemporaryFilePath() {
            var _a;
            return path_1.default.join((0, helpers_1.cwd)(), `/temp/deployments/${this.project.name}@${((_a = this.project.version) === null || _a === void 0 ? void 0 : _a.version) || '1.0.0'}/`, `${this.key}_${this.network}.json`);
        }
        setApproved(addresses, index = 0) {
            this.tempLiveDeployment[index].approved = addresses;
        }
        multiApprove(addresses) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!this.hasDeployed)
                    throw new Error('please deploy contract first');
                let contract = (yield this.getSignedContract());
                return yield (0, web3_1.waitForTx)(yield contract.multiApprove(addresses), 'multi approve');
            });
        }
        isAuthenticated(addressToCheck) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!this.hasDeployed)
                    throw new Error('please deploy contract first');
                let contract = (yield this.getSignedContract());
                return yield contract.isAuthenticated(addressToCheck);
            });
        }
        /**
         *
         * @param addresses
         */
        multiRevoke(addresses) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!this.hasDeployed)
                    throw new Error('please deploy contract first');
                let contract = (yield this.getSignedContract());
                return yield (0, web3_1.waitForTx)(yield contract.multiRevoke(addresses), 'multi revoke');
            });
        }
        /**
         * TODO: needs an interface
         * returns a parsed temporary deployment
         * @returns
         */
        readTemporaryDeployment() {
            if (!fs_1.default.existsSync(this.getTemporaryFilePath()))
                return {
                    liveDeployments: {},
                };
            let result = JSON.parse(fs_1.default.readFileSync(this.getTemporaryFilePath(), {
                encoding: 'utf-8',
            }));
            if ((result.project && result.project !== this.project.name) ||
                (result.network && result.network !== this.network))
                throw new Error('bad file: ' +
                    this.getTemporaryFilePath() +
                    ' is from another network/project');
            return result;
        }
        /**
         * returns a live deployment by its artifact name
         * @param name
         * @returns
         */
        getDeploymentByArtifactName(name) {
            return this.tempLiveDeployment.filter((deployment) => (deployment.name = name))[0];
        }
        /**
         * gets the deployer of the live deployment at the specified index. If no index is specified, the deployer of the first live deployment is returned.
         * @param index
         * @returns
         */
        getDeployer(index) {
            return this.tempLiveDeployment[index || 0].deployer;
        }
        /**
         * gets the approved addresses of the live deployment at the specified index. If no index is specified, the approved addresses of the first live deployment is returned.
         * @param index
         * @returns
         */
        getApproved(index) {
            return this.tempLiveDeployment[index || 0].approved || [];
        }
        /**
         * gets the address of the live deployment at the specified index. If no index is specified, the address of the first live deployment is returned.
         * @param index
         * @returns
         */
        getAddress(index) {
            return this.tempLiveDeployment[index || 0].address;
        }
        isLink() {
            return this.deploymentScript.link !== undefined;
        }
        getLinkKey() {
            var _a;
            return ((_a = this.deploymentScript) === null || _a === void 0 ? void 0 : _a.link.key) || this.getContractName();
        }
        getLink() {
            return this.deploymentScript.link;
        }
        /**
         * returns true if this deployment is a library
         * @returns
         */
        isLibrary() {
            return this.deploymentScript.library;
        }
        /**
         * returns the abi of the live deployment at the specified index. If no index is specified, the abi of the first live deployment is returned.
         * @param index
         * @returns
         */
        getAbi(index) {
            return this.tempLiveDeployment[index || 0].abi;
        }
        /**
         * returns all of the deployed contracts for this deployment
         * @returns
         */
        getDeployments() {
            return this.tempLiveDeployment;
        }
        reset() {
            this.tempLiveDeployment = [];
            this.liveDeployment = [];
            this.hasDeployedAll = false;
            this.hasSetupDeployments = false;
            this.saveTemporaryDeployments();
        }
        /**
         * returns true if this deployment is important. An important deployment is a deployment that is required for the project to function. If an important deployment fails to deploy, the project will not be deployed. Import contracts will also be deployed first.
         * @returns
         */
        isImportant() {
            var _a;
            return (_a = this.deploymentScript) === null || _a === void 0 ? void 0 : _a.important;
        }
        /**
         * returns true if this deployment is unique. A unique deployment is a deployment that can only be deployed once. If a unique deployment has already been deployed, it will not be deployed again.
         * @returns
         */
        isUnique() {
            var _a;
            return (_a = this.deploymentScript) === null || _a === void 0 ? void 0 : _a.unique;
        }
        /**
         * returns true if this deployment has been deployed
         * @returns
         */
        hasDeployed() {
            return this.hasDeployedAll;
        }
        /**
         * returns true if the deployment has been setup
         * @returns
         */
        hasSetup() {
            return this.hasSetupDeployments;
        }
        /**
         * saves the live deployments to the temporary deployment file
         */
        saveTemporaryDeployments() {
            var _a;
            let deployments = this.readTemporaryDeployment();
            deployments.liveDeployments = this.tempLiveDeployment;
            deployments.updated = Date.now();
            deployments.network = this.network;
            deployments.name = this.getContractName();
            deployments.project = this.project.name;
            deployments.setup = this.hasSetupDeployments;
            //make the directory
            (0, helpers_1.makeDirectories)((0, helpers_1.cwd)() +
                `/temp/deployments/${this.project.name}@${((_a = this.project.version) === null || _a === void 0 ? void 0 : _a.version) || '1.0.0'}/`);
            fs_1.default.writeFileSync(this.getTemporaryFilePath(), JSON.stringify(deployments));
        }
        /**
         * Will read temporary deployment and then write it to the real deployment location
         */
        saveFinalDeployment() {
            let deployments = this.readTemporaryDeployment();
            deployments.liveDeployments = this.tempLiveDeployment;
            deployments = Object.assign(Object.assign({}, deployments), deployments.liveDeployments[0]);
            deployments.updated = Date.now();
            deployments.network = this.network;
            deployments.name = this.getContractName();
            deployments.project = this.project.name;
            deployments.setup = this.hasSetupDeployments;
            fs_1.default.writeFileSync(this.getFilePath(), JSON.stringify(deployments));
        }
        /**
         * Returns an ethers contract instance of this deployment for you to connect signers too.
         * @param index
         * @returns
         */
        getContract(index, provider) {
            return (0, web3_1.getContract)(this.tempLiveDeployment[index || 0] ||
                this.tempLiveDeployment[index || 0], provider);
        }
        /**
         * Returns a signed contract with the current account.
         * @param index
         * @returns
         */
        getSignedContract(index, signer, provider) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let contract = this.getContract(index, provider);
                signer = signer || (yield (0, web3_1.getDefaultSigner)());
                return contract.connect(signer);
            });
        }
        /**
         * used after deploy to set the the live deployments for this deployment. See {@link app/interfaces.InfinityMintDeploymentLive}, Will check if each member has the same network and project name as the one this deployment class is attached too
         * @param liveDeployments
         */
        updateLiveDeployments(liveDeployments) {
            if (liveDeployments instanceof Array)
                liveDeployments = [
                    ...liveDeployments,
                ];
            let mismatchNetworkAndProject = liveDeployments.filter((deployment) => deployment.network.name !== this.network ||
                deployment.project !== this.project.name);
            //throw error if we found any
            if (mismatchNetworkAndProject.length !== 0)
                throw new Error('one or more deployments are from a different network or project, check: ' +
                    mismatchNetworkAndProject.map((deployment) => `<${deployment.key}>(${deployment.name}), `));
            this.tempLiveDeployment =
                liveDeployments;
            this.saveTemporaryDeployments();
        }
        /**
         * returns true if we have a local deployment for this current network
         * @param index
         * @returns
         */
        hasLocalDeployment(index) {
            let deployment = this.tempLiveDeployment[index || 0];
            let path = (0, helpers_1.cwd)() +
                '/deployments/' +
                this.network +
                '/' +
                deployment.name +
                '.json';
            return fs_1.default.existsSync(path);
        }
        /**
         * gets a deployment inside of the current /deployments/ folder
         * @param index
         * @returns
         */
        getLocalDeployment(index) {
            let deployment = this.tempLiveDeployment[index || 0];
            let path = (0, helpers_1.cwd)() +
                '/deployments/' +
                this.network +
                '/' +
                deployment.name +
                '.json';
            if (!fs_1.default.existsSync(path))
                throw new Error('local deployment not found: ' + path);
            return JSON.parse(fs_1.default.readFileSync(path, {
                encoding: 'utf-8',
            }));
        }
        /**
         * returns the deployment script for this deployment
         * @returns
         */
        getDeploymentScript() {
            return this.deploymentScript;
        }
        getValues() {
            return this.deploymentScript.values;
        }
        setDefaultValues(values, save = false) {
            this.liveDeployment.forEach((deployment) => {
                deployment.values = Object.assign(Object.assign({}, deployment.values), values);
            });
            this.tempLiveDeployment.forEach((deployment) => {
                deployment.values = Object.assign(Object.assign({}, deployment.values), values);
            });
            if (save) {
                this.saveTemporaryDeployments();
                this.saveFinalDeployment();
            }
        }
        /**
         * returns the location the deployment script is located at
         * @returns
         */
        getDeploymentScriptLocation() {
            return this.deploymentScriptLocation;
        }
        /**
         * Deploys this ssmart contract
         * @param args
         * @returns
         */
        deploy(...args) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.reloadScript();
                let result = (yield this.execute('deploy', args));
                if (!result)
                    throw new Error('deploy function did not return a contract');
                if (result instanceof Array) {
                    result.forEach((result) => {
                        this.tempLiveDeployment.push(this.populateLiveDeployment(result.localDeployment));
                    });
                }
                else
                    this.tempLiveDeployment.push(this.populateLiveDeployment(result.localDeployment));
                return this.tempLiveDeployment;
            });
        }
        /**
         * used internally to turn an InfinityMintDeploymentLocal into an InfinityMintDeploymentLive
         * @param localDeployment
         * @returns
         */
        populateLiveDeployment(localDeployment) {
            let deployment = localDeployment;
            deployment.key = this.deploymentScript.key;
            deployment.javascript =
                this.project.source.ext === '.js';
            deployment.project = (0, projects_1.getProjectName)(this.project);
            deployment.network = {
                name: hardhat_1.default.network.name,
                chainId: hardhat_1.default.network.config.chainId,
            };
            deployment.name = deployment.contractName;
            deployment.source = path_1.default.parse(this.deploymentScriptLocation);
            deployment.permissions = [];
            return deployment;
        }
        /**
         * approves wallets passed in to be able to run admin methods on the contract
         * @param addresses
         * @param log
         * @returns
         */
        setPermissions(addresses) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let contract = yield this.getSignedContract();
                let authenticator = contract;
                if (!(authenticator === null || authenticator === void 0 ? void 0 : authenticator.multiApprove)) {
                    if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS'))
                        throw new Error(`${this.key} does not have an approve method`);
                    else
                        (0, helpers_1.warning)(`${this.key} does not have an approve method`);
                    return;
                }
                let tx = yield authenticator.multiApprove(addresses);
                return yield (0, web3_1.waitForTx)(tx, `setting ${addresses} permissions inside of ${this.key}`);
            });
        }
        /**
         * calls the setup method on the deployment script
         * @param args
         */
        setup(...args) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.reloadScript();
                yield this.execute('setup', args);
                this.hasSetupDeployments = true;
            });
        }
        getLibaries() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let libs = {};
                Object.keys(this.deploymentScript.libraries || {}).forEach((key) => {
                    let lib = this.deploymentScript.libraries[key];
                    if (lib === true)
                        libs[key] =
                            typeof this.project.libraries[key] === 'string'
                                ? this.project.libraries[key]
                                : this.project.libraries[key].address;
                    else
                        libs[key] = this.deploymentScript.libraries[key];
                });
                return libs;
            });
        }
        /**
         * Executes a method on the deploy script and immediately returns the value. Setup will return ethers contracts.
         * @param method
         * @param args
         * @returns
         */
        execute(method, args, infinityConsole, eventEmitter, deployments, contracts) {
            var _a;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let params = {
                    debugLog: helpers_1.debugLog,
                    deployment: this,
                    deployments: deployments,
                    contracts: contracts,
                    log: helpers_1.log,
                    infinityConsole: infinityConsole,
                    eventEmitter: eventEmitter || this.emitter,
                };
                params = Object.assign(Object.assign({}, params), (args[0] || args));
                if (params.project === undefined)
                    params.project = this.project;
                (0, helpers_1.debugLog)('executing deployment method => ' + method + ' <' + this.key + '>');
                switch (method) {
                    case 'deploy':
                        if (this.deploymentScript.deploy) {
                            let result = yield this.deploymentScript.deploy(params);
                            this.hasDeployedAll = true;
                            return result;
                        }
                        else if (this.getContractName()) {
                            let replacables = {
                                '%token_name%': this.project.information.tokenSingular,
                                '%token_name_multiple%': this.project.information.tokenMultiple,
                                '%token_symbol%': this.project.information.tokenSymbol,
                            };
                            let _args = [];
                            if (this.deploymentScript.deployArgs instanceof Array)
                                _args = this.deploymentScript.deployArgs;
                            else if (this.deploymentScript.deployArgs instanceof Function ||
                                typeof this.deploymentScript.deployArgs === 'function')
                                _args = yield ((_a = this.deploymentScript) === null || _a === void 0 ? void 0 : _a.deployArgs)(params);
                            _args = Object.values(_args);
                            _args = _args.map((arg) => {
                                if (!isNaN(arg))
                                    return parseFloat(arg);
                                let deployments = this.project.deployments;
                                if (deployments[arg])
                                    return deployments[arg].address;
                                Object.keys(replacables).forEach((key) => {
                                    arg = arg.replace(key, replacables[key]);
                                });
                                return arg;
                            });
                            (0, helpers_1.debugLog)('args => [' + _args.join(',') + ']');
                            let libs = {};
                            Object.keys(this.deploymentScript.libraries || {}).forEach((key) => {
                                let lib = this.deploymentScript.libraries[key];
                                if (lib === true)
                                    libs[key] =
                                        typeof this.project.libraries[key] ===
                                            'string'
                                            ? this.project.libraries[key]
                                            : this.project.libraries[key].address;
                                else
                                    libs[key] =
                                        this.deploymentScript.libraries[key];
                            });
                            let result = yield (0, web3_1.deploy)(this.getContractName(), this.project, _args, libs, undefined, (args === null || args === void 0 ? void 0 : args.save) || true, (args === null || args === void 0 ? void 0 : args.usePreviousDeployment) || false);
                            this.hasDeployedAll = true;
                            return result;
                        }
                        else
                            throw new Error('no deploy method found on ' +
                                this.key +
                                ' and no contractName specified so cannot automatically deploy');
                    case 'setup':
                        if (this.deploymentScript.setup)
                            yield this.deploymentScript.setup(params);
                        return;
                    case 'update':
                        if (this.deploymentScript.update)
                            yield this.deploymentScript.update(params);
                        return;
                    case 'post':
                        if (this.deploymentScript.post)
                            yield this.deploymentScript.post(params);
                        return;
                    case 'cleanup':
                        try {
                            if (this.deploymentScript.cleanup)
                                return yield this.deploymentScript.cleanup(params);
                            else {
                                this.tempLiveDeployment = [];
                                this.hasDeployedAll = false;
                                this.hasSetupDeployments = false;
                                this.saveTemporaryDeployments();
                            }
                        }
                        catch (error) {
                            (0, helpers_1.warning)('Failed to run cleanup on => ' + this.getContractName());
                            (0, helpers_1.warning)(error.message);
                        }
                        return;
                    case 'switch':
                        if (this.deploymentScript.switch)
                            yield this.deploymentScript.switch(params);
                        return;
                    default:
                        throw new Error('unknown method:' + this.execute);
                }
            });
        }
    }
    exports.InfinityMintDeployment = InfinityMintDeployment;
    /**
     * loads all deployment classes for a project
     * @param project
     * @param console
     * @returns
     */
    const loadDeploymentClasses = (project, console) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let deployments = [...(yield (0, exports.getDeploymentClasses)(project, console))];
        //add stuff to config by default
        let config = (0, helpers_1.getConfigFile)();
        //add default settings to config file if they dont exist
        deployments.forEach((deployment) => {
            if (deployment.getDeploymentScript().config) {
                if (!config.settings)
                    config.settings;
                if (!config.settings.deploy)
                    config.settings.deploy = {};
                //loop each key in the config and add a default value
                let scrape = (obj, self) => {
                    Object.keys(obj).forEach((key) => {
                        if (typeof obj[key] === 'object') {
                            if (!self[key])
                                self[key] = {};
                            scrape(obj[key], self[key]);
                        }
                        else {
                            if (self[key] === undefined)
                                self[key] = obj[key];
                        }
                    });
                };
                scrape(deployment.getDeploymentScript().config, config.settings.deploy);
            }
        });
        return deployments;
    });
    exports.loadDeploymentClasses = loadDeploymentClasses;
    const toKeyValues = (loadDeploymentClasses) => {
        let keys = {};
        loadDeploymentClasses.forEach((deployment) => {
            keys[deployment.getModuleKey() || deployment.getContractName()] =
                deployment;
        });
        return keys;
    };
    exports.toKeyValues = toKeyValues;
    const filterLinkDeployments = (projectOrPath, loadedDeploymentClasses, includeAll = false) => {
        let compiledProject = (0, projects_1.findCompiledProject)(projectOrPath);
        let currentKeys = {};
        let links = loadedDeploymentClasses.filter((deployment) => {
            var _a;
            if (!deployment.isLink())
                return false;
            let key = deployment.getLinkKey();
            if (!includeAll &&
                !((_a = compiledProject.settings.defaultLinks) === null || _a === void 0 ? void 0 : _a[key]) &&
                !deployment.isImportant()) {
                (0, helpers_1.debugLog)('skipping link ' +
                    key +
                    ' as it is not in the project settings links and is not important');
                return false;
            }
            if (currentKeys[key])
                return false;
            currentKeys[key] = true;
            return true;
        });
        //sort the deployments based on getIndex
        links.sort((a, b) => {
            if (a.getIndex() > b.getIndex())
                return 1;
            if (a.getIndex() < b.getIndex())
                return -1;
            return 0;
        });
        return links;
    };
    exports.filterLinkDeployments = filterLinkDeployments;
    /**
     * Returns a list of deployment classes which are InfinityLinks
     * @param projectOrPath
     * @param loadedDeploymentClasses
     * @returns
     */
    const loadProjectDeploymentLinks = (projectOrPath, console, loadedDeploymentClasses, includeAll) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let compiledProject = (0, projects_1.findCompiledProject)(projectOrPath);
        loadedDeploymentClasses =
            loadedDeploymentClasses ||
                (yield (0, exports.loadDeploymentClasses)(compiledProject, console));
        return (0, exports.filterLinkDeployments)(compiledProject, loadedDeploymentClasses, includeAll);
    });
    exports.loadProjectDeploymentLinks = loadProjectDeploymentLinks;
    const filterUsedDeploymentClasses = (projectOrPath, loadedDeploymentClasses) => {
        let compiledProject = (0, projects_1.findCompiledProject)(projectOrPath);
        let currentModules = {};
        let deployments = loadedDeploymentClasses.filter((deployment) => {
            if (deployment.isLink())
                return false;
            if (deployment.isLibrary())
                return true;
            if (compiledProject.modules[deployment.getModuleKey()] === undefined &&
                currentModules[deployment.getModuleKey()] === undefined) {
                currentModules[deployment.getModuleKey()] = true;
                return true;
            }
            if (compiledProject.modules[deployment.getModuleKey()] !== undefined &&
                deployment.getContractName() ===
                    compiledProject.modules[deployment.getModuleKey()]) {
                currentModules[deployment.getModuleKey()] = true;
                return true;
            }
        });
        //sort the deployments based on getIndex
        deployments.sort((a, b) => {
            if (a.getIndex() > b.getIndex())
                return 1;
            if (a.getIndex() < b.getIndex())
                return -1;
            return 0;
        });
        return deployments;
    };
    exports.filterUsedDeploymentClasses = filterUsedDeploymentClasses;
    /**
     * Returns a list of deployment classes relating to a project in order to deploy it ready to be steped through
     * @param projectOrPath
     * @param loadedDeploymentClasses
     * @returns
     */
    const loadProjectDeploymentClasses = (projectOrPath, console, loadedDeploymentClasses) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let compiledProject = (0, projects_1.findCompiledProject)(projectOrPath);
        loadedDeploymentClasses =
            loadedDeploymentClasses ||
                (yield (0, exports.loadDeploymentClasses)(compiledProject, console));
        if (!compiledProject.compiled)
            throw new Error('please compile ' +
                compiledProject.name +
                ' before trying to get deployment classes');
        return (0, exports.filterUsedDeploymentClasses)(compiledProject, loadedDeploymentClasses);
    });
    exports.loadProjectDeploymentClasses = loadProjectDeploymentClasses;
    /**
     * gets a deployment in the /deployments/network/ folder and turns it into an InfinityMintDeploymentLive
     */
    const getLocalDeployment = (contractName, network) => {
        return (0, exports.readLocalDeployment)(contractName, network);
    };
    exports.getLocalDeployment = getLocalDeployment;
    /**
     * Returns the raw .json file in the /deployments/network/ folder
     * @param contractName
     * @returns
     */
    const readLocalDeployment = (contractName, network) => {
        let path = (0, helpers_1.cwd)() + '/deployments/' + network + '/' + contractName + '.json';
        if (!fs_1.default.existsSync(path))
            throw new Error(`${path} not found`);
        return JSON.parse(fs_1.default.readFileSync(path, { encoding: 'utf-8' }));
    };
    exports.readLocalDeployment = readLocalDeployment;
    /**
     * Returns true if a deployment manifest for this key/contractName is found
     * @param contractName - can be a key (erc721, assets) or a fully qualified contract name
     * @param project
     * @param network
     * @returns
     */
    const hasDeploymentManifest = (contractName, project, network) => {
        var _a, _b;
        network = network || ((_a = project === null || project === void 0 ? void 0 : project.network) === null || _a === void 0 ? void 0 : _a.name);
        if (!network)
            throw new Error('unable to automatically determain network');
        let path = (0, helpers_1.cwd)() +
            `/temp/deployments/${project.name}@${((_b = project.version) === null || _b === void 0 ? void 0 : _b.version) || '1.0.0'}/${contractName}_${network}.json`;
        return fs_1.default.existsSync(path);
    };
    exports.hasDeploymentManifest = hasDeploymentManifest;
    const getDeploymentClass = (contractName, project, network) => {
        var _a;
        network = network || ((_a = project === null || project === void 0 ? void 0 : project.network) === null || _a === void 0 ? void 0 : _a.name);
        if (!network)
            throw new Error('unable to automatically determin network');
        let liveDeployments = (0, exports.getLiveDeployments)(contractName, project, network);
        return (0, exports.create)(liveDeployments[0]);
    };
    exports.getDeploymentClass = getDeploymentClass;
    const getLiveDeployments = (contractName, project, network) => {
        var _a;
        let path = (0, helpers_1.cwd)() +
            `/temp/deployments/${project.name}@${((_a = project.version) === null || _a === void 0 ? void 0 : _a.version) || '1.0.0'}/${contractName}_${network}.json`;
        if (!(0, exports.hasDeploymentManifest)(contractName, project, network))
            return [];
        let result = JSON.parse(fs_1.default.readFileSync(path, {
            encoding: 'utf-8',
        }));
        return (result.liveDeployments || []);
    };
    exports.getLiveDeployments = getLiveDeployments;
    /**
     * Returns a new deployment class from a live deployment file
     * @param liveDeployment
     * @returns
     */
    const create = (liveDeployment, deploymentScript, project) => {
        return new InfinityMintDeployment(deploymentScript || (liveDeployment === null || liveDeployment === void 0 ? void 0 : liveDeployment.contractName), liveDeployment.key, liveDeployment.network.name, project || (0, projects_1.getCompiledProject)(liveDeployment.project));
    };
    exports.create = create;
    /**
     * Returns a list of InfinityMintDeployment classes for the network and project based on the deployment typescripts which are found.
     * @returns
     */
    const getDeploymentClasses = (project, console, network, roots) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!project)
            throw new Error('project is undefined');
        network = network || ((_a = project.network) === null || _a === void 0 ? void 0 : _a.name) || hardhat_1.default.network.name;
        let session = (0, helpers_1.readGlobalSession)();
        let config = (0, helpers_1.getConfigFile)();
        if (!network)
            throw new Error('unable to automatically find network');
        let searchLocations = [
            ...(roots || []),
            ...(config.roots || []).map((root) => {
                if (root.startsWith('../') ||
                    root.startsWith('./') ||
                    root.startsWith('/../'))
                    root =
                        (0, helpers_1.cwd)() +
                            '/' +
                            (root.startsWith('/') ? root.substring(1) : root);
                if (!root.endsWith('/'))
                    root += '/';
                return root + 'deploy/**/*.js';
            }),
        ];
        searchLocations.push((0, helpers_1.cwd)() + '/deploy/**/*.js');
        if ((0, helpers_1.isTypescript)() || !((_c = (_b = config.settings) === null || _b === void 0 ? void 0 : _b.compile) === null || _c === void 0 ? void 0 : _c.disallowTypescript)) {
            searchLocations.push((0, helpers_1.cwd)() + '/deploy/**/*.ts');
            searchLocations.push(...(config.roots || []).map((root) => {
                if (root.startsWith('../') ||
                    root.startsWith('./') ||
                    root.startsWith('/../'))
                    root =
                        (0, helpers_1.cwd)() +
                            '/' +
                            (root.startsWith('/') ? root.substring(1) : root);
                if (!root.endsWith('/'))
                    root += '/';
                return root + 'deploy/**/*.ts';
            }));
        }
        if (!(0, helpers_1.isInfinityMint)() && !(0, helpers_1.isEnvTrue)('INFINITYMINT_UNINCLUDE_DEPLOY'))
            searchLocations.push((0, helpers_1.cwd)() + '/node_modules/infinitymint/dist/deploy/**/*.js');
        //remove duplicates
        searchLocations = searchLocations.filter((value, index, self) => self.indexOf(value) === index);
        let deployments = [];
        for (let i = 0; i < searchLocations.length; i++) {
            let isSkipping = false;
            if ((_e = (_d = config.settings) === null || _d === void 0 ? void 0 : _d.scripts) === null || _e === void 0 ? void 0 : _e.classicScripts)
                config.settings.scripts.classicScripts.forEach((script) => {
                    if (searchLocations[i].includes(script))
                        isSkipping = true;
                });
            if ((_g = (_f = config.settings) === null || _f === void 0 ? void 0 : _f.scripts) === null || _g === void 0 ? void 0 : _g.disableDeployScripts)
                config.settings.scripts.disableDeployScripts.forEach((script) => {
                    if (searchLocations[i].includes(script))
                        isSkipping = true;
                });
            if (isSkipping) {
                (0, helpers_1.debugLog)('skipping (since disabled in config) => ' + searchLocations[i]);
                continue;
            }
            (0, helpers_1.debugLog)('scanning for deployment scripts in => ' + searchLocations[i]);
            let files = yield (0, helpers_1.findFiles)(searchLocations[i]);
            files = files.filter((file) => !file.endsWith('.d.ts') && !file.endsWith('.type-extension.ts'));
            files.map((file, index) => {
                var _a;
                let key = path_1.default.parse(file).name;
                (0, helpers_1.debugLog)(`[${index}] => ${key}`);
                let result = new InfinityMintDeployment(file, key, network, project, console);
                if (((_a = result.getDeploymentScript()) === null || _a === void 0 ? void 0 : _a.solidityFolder) !==
                    session.environment.solidityFolder)
                    (0, helpers_1.debugLog)('\tskipping (since wrong solidity folder) => ' +
                        searchLocations[i]);
                else
                    deployments.push(result);
            });
        }
        //also do gems
        let gems = (0, gems_1.getLoadedGems)();
        Object.values(gems).map((gem) => {
            var _a;
            //get deployment scripts
            let deploymentScripts = gem.deployScripts;
            if (!deploymentScripts)
                return;
            //require the deployment scripts
            for (let i = 0; i < deploymentScripts.length; i++) {
                let deploymentScript = require(deploymentScripts[i]);
                deploymentScript =
                    deploymentScript.default || deploymentScript;
                let result = new InfinityMintDeployment(deploymentScripts[i], deploymentScript.key, network, project, console);
                if (((_a = result.getDeploymentScript()) === null || _a === void 0 ? void 0 : _a.solidityFolder) !==
                    session.environment.solidityFolder)
                    (0, helpers_1.debugLog)('\tskipping (since wrong solidity folder) => ' +
                        searchLocations[i]);
                else
                    deployments.push(result);
            }
        });
        return deployments;
    });
    exports.getDeploymentClasses = getDeploymentClasses;
});
//# sourceMappingURL=deployments.js.map