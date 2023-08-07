(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./helpers", "hardhat", "path", "fs", "./deployments", "./web3", "./token"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCurrentCompiledProject = exports.requireProject = exports.findProject = exports.getProject = exports.getProjectSource = exports.createTemporaryProject = exports.findProjects = exports.getProjectCache = exports.writeParsedProjects = exports.parseProject = exports.formatCacheEntry = exports.readProjectCache = exports.getDeployedProject = exports.getProjectDeploymentPath = exports.hasDeployedProject = exports.deleteCompiledProject = exports.getProjectCompiledPath = exports.deleteDeployedProject = exports.getTempCompiledProject = exports.getTempDeployedProject = exports.saveTempCompiledProject = exports.removeTempCompliledProject = exports.removeTempDeployedProject = exports.saveTempDeployedProject = exports.hasTempDeployedProject = exports.hasTempCompiledProject = exports.getProjectVersion = exports.getProjectName = exports.getFullyQualifiedName = exports.getNameWithNetwork = exports.getCompiledProject = exports.findCompiledProject = exports.hasCompiledProject = exports.getCurrentDeployedProject = exports.getCurrentProjectPath = exports.getCurrentProject = exports.Project = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("./helpers");
    const hardhat_1 = tslib_1.__importDefault(require("hardhat"));
    const path_1 = tslib_1.__importDefault(require("path"));
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const deployments_1 = require("./deployments");
    const web3_1 = require("./web3");
    const token_1 = require("./token");
    /**
     * The default InfinityMint project class
     */
    class Project {
        constructor(projectNameOrProject, console, version, network) {
            this.version = '1.0.0';
            this.network = 'ganache';
            if (typeof projectNameOrProject === 'string')
                this.source = (0, exports.findProject)(projectNameOrProject);
            else
                this.source = projectNameOrProject;
            if ((0, exports.hasCompiledProject)(this.source, version))
                this.compiledProject = (0, exports.getCompiledProject)(this.source, version);
            else
                this.compiledProject = null;
            this.infinityConsole = console;
            this.version = version || this.version;
            this.network = network || hardhat_1.default.network.name;
        }
        /**
         *
         * @param network
         */
        setNetwork(network) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.network = network || hardhat_1.default.network.name;
                yield this.loadDeployments(network);
            });
        }
        get name() {
            var _a, _b;
            return ((_a = this.source) === null || _a === void 0 ? void 0 : _a.name) || ((_b = this.deployedProject) === null || _b === void 0 ? void 0 : _b.name);
        }
        get deployedProject() {
            var _a;
            return (_a = this.deployed) === null || _a === void 0 ? void 0 : _a[this.network];
        }
        loadDeployments(network) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                network = this.network || hardhat_1.default.network.name;
                if (this.hasDeployed(network))
                    this.readDeployedProject(network);
                else
                    (0, helpers_1.log)(`No deployed project found for ${this.source.name} on ${network}.`, 'yellow');
                let deployments = yield (0, deployments_1.loadProjectDeploymentClasses)(this.compiledProject || this.deployed[network], this.infinityConsole);
                this.deployments = (0, deployments_1.toKeyValues)(deployments);
                if (!this.network)
                    this.network = network;
            });
        }
        getAsset(assetId) {
            var _a;
            if (assetId <= 0)
                assetId = 1;
            return (((_a = this.deployed) === null || _a === void 0 ? void 0 : _a[this.network].assets) ||
                this.compiledProject.assets ||
                this.source.assets)[assetId - 1];
        }
        getPath(pathId) {
            var _a;
            return (((_a = this.deployed) === null || _a === void 0 ? void 0 : _a[this.network].paths) ||
                this.compiledProject.paths ||
                this.source.paths)[pathId - 1];
        }
        getFullyQualifiedName(network) {
            var _a, _b;
            let src = ((_a = this.deployed) === null || _a === void 0 ? void 0 : _a[network || this.network]) || this.source;
            return (0, exports.getFullyQualifiedName)(src, this.version, network || ((_b = src === null || src === void 0 ? void 0 : src.network) === null || _b === void 0 ? void 0 : _b.name) || this.network);
        }
        getNameAndVersion(includeVersion = true) {
            return `${this.name}${includeVersion ? `@${this.version}` : ''}`;
        }
        readDeployedProject(network) {
            network = network || this.network || hardhat_1.default.network.name;
            this.deployed = this.deployed || {};
            this.deployed[network] = (0, exports.getDeployedProject)(this.source, network, this.version);
        }
        hasDeployed(network) {
            network = network || this.network;
            return (0, exports.hasDeployedProject)(this.source, network, this.version);
        }
        hasCompiled() {
            return (0, exports.hasCompiledProject)(this.source, this.version);
        }
        getDeployedProject(network) {
            network = network || this.network || hardhat_1.default.network.name;
            this.readDeployedProject(network);
            return this.deployed[network];
        }
        /**
         * Mints multiple tokens to the current address
         * @param count
         * @param projectNameOrProject
         * @param options
         * @returns
         */
        mintMultiple(tokens) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let pathIds = tokens.map((token) => token.pathId);
                let colours = tokens.map((token) => token.colours);
                let mintData = tokens.map((token) => token.mintData);
                let assets = tokens.map((token) => token.assets);
                let names = tokens.map((token) => token.names);
                let erc721 = yield this.erc721();
                let tx = yield erc721.implicitBatch(pathIds, colours, mintData, assets, names);
                let receipt = yield (0, web3_1.waitForTx)(tx, 'mint multiple ' + tokens.length + 'x tokens');
                return receipt;
            });
        }
        erc721() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield this.getSignedContract('erc721');
            });
        }
        storage() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield this.getSignedContract('storage');
            });
        }
        values() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield this.getSignedContract('values');
            });
        }
        api() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield this.getSignedContract('api');
            });
        }
        assets() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield this.getSignedContract('api');
            });
        }
        flags() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield this.getSignedContract('flags');
            });
        }
        linker() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield this.getSignedContract('linker');
            });
        }
        setFlag(tokenId, flag, value) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let flags = yield this.flags();
                let tx = yield flags.setFlag(tokenId, flag, value);
                yield (0, web3_1.waitForTx)(tx, `set flag ${flag} to ${value}`);
            });
        }
        setGlobalFlag(flag, value) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let flags = yield this.flags();
                let tx = yield flags.setGlobalFlag(flag, value);
                yield (0, web3_1.waitForTx)(tx, `set global flag ${flag} to ${value}`);
            });
        }
        setOnChainOption(option, value) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let flags = yield this.flags();
                let tx = yield flags.setOption(option, value);
                yield (0, web3_1.waitForTx)(tx, `set option ${option} to ${value}`);
            });
        }
        hasOnChainOption(option) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let flags = yield this.flags();
                return yield flags.hasOption(option);
            });
        }
        getOnChainOption(option) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let flags = yield this.flags();
                return yield flags.getOption(option);
            });
        }
        setOnChainOptions(options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let flags = yield this.flags();
                let tx = yield flags.setOptions(Object.keys(options), Object.values(options));
                yield (0, web3_1.waitForTx)(tx, `set options ${JSON.stringify(options)}`);
                return tx;
            });
        }
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
        getContract(contractNameOrModuleKey, provider, contractIndex) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let result = (0, deployments_1.filterUsedDeploymentClasses)(this.getDeployedProject(), Object.values(this.deployments));
                let deployments = (0, deployments_1.toKeyValues)(result);
                if (!deployments[contractNameOrModuleKey])
                    throw new Error('no contract/model key found: ' + contractNameOrModuleKey);
                if (!deployments[contractNameOrModuleKey].hasDeployed())
                    throw new Error('contract/model has not been deployed: ' +
                        contractNameOrModuleKey);
                return deployments[contractNameOrModuleKey].getContract(contractIndex, provider);
            });
        }
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
        getSignedContract(contractNameOrModuleKey, signer, provider, contractIndex) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!this.deployments)
                    throw new Error('no deployments found, please load deployments first');
                let result = (0, deployments_1.filterUsedDeploymentClasses)(this.getDeployedProject(), Object.values(this.deployments));
                let deployments = (0, deployments_1.toKeyValues)(result);
                if (!deployments[contractNameOrModuleKey])
                    throw new Error('no contract/model key found: ' + contractNameOrModuleKey);
                if (!deployments[contractNameOrModuleKey].hasDeployed())
                    throw new Error('contract/model has not been deployed: ' +
                        contractNameOrModuleKey);
                return deployments[contractNameOrModuleKey].getSignedContract(contractIndex, signer, provider);
            });
        }
        /**
         * Creates a random token
         * @param pathId
         * @returns
         */
        createRandomToken(pathId) {
            let newToken = (0, token_1.generateToken)(this.deployedProject, pathId);
            return new token_1.Token(this, parseInt(newToken.currentTokenId.toString()), newToken);
        }
        /**
         * Gets a token from the project
         * @param tokenId
         * @returns
         */
        getToken(tokenId) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let token = new token_1.Token(this, tokenId);
                yield token.load();
                return token;
            });
        }
        /**
         *
         * @param projectNameOrProject
         * @param options
         * @returns
         */
        mint(options, gasLimit, useImplicitMint = false) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let account = (options === null || options === void 0 ? void 0 : options.to) || this.infinityConsole.getCurrentAccount().address;
                let erc721 = yield this.erc721();
                let tx;
                if (useImplicitMint)
                    tx = yield erc721.implicitMint(account, options === null || options === void 0 ? void 0 : options.pathId, options.colours || [], options === null || options === void 0 ? void 0 : options.mintData, (options === null || options === void 0 ? void 0 : options.assets) || [], (options === null || options === void 0 ? void 0 : options.names) || [], {
                        gasLimit: gasLimit || 1000000,
                    });
                else
                    tx = yield erc721.mint();
                let receipt = yield (0, web3_1.waitForTx)(tx, 'minted token');
                let event = (0, web3_1.findEvent)('TokenMinted', receipt);
                let token = new token_1.Token(this, event.args[0], null, receipt);
                yield token.load();
                return token;
            });
        }
    }
    exports.Project = Project;
    /**
     *
     * @returns
     */
    const getCurrentProject = (cleanCache) => {
        if (!(0, exports.getCurrentProjectPath)())
            return null;
        return (0, exports.requireProject)((0, exports.getCurrentProjectPath)().dir + '/' + (0, exports.getCurrentProjectPath)().base, (0, exports.getCurrentProjectPath)().ext !== '.ts', cleanCache);
    };
    exports.getCurrentProject = getCurrentProject;
    /**
     * Returns a parsed path the current project source file
     * @returns
     */
    const getCurrentProjectPath = () => {
        let session = (0, helpers_1.readGlobalSession)();
        if (!session.environment.project)
            return undefined;
        return session.environment.project;
    };
    exports.getCurrentProjectPath = getCurrentProjectPath;
    /**
     * Returns a deployed project for the current project, takes a network.
     * @param network
     * @returns
     */
    const getCurrentDeployedProject = (network) => {
        var _a, _b;
        if (!(0, exports.getCurrentProject)())
            return null;
        network = network || ((_b = (_a = require('hardhat')) === null || _a === void 0 ? void 0 : _a.network) === null || _b === void 0 ? void 0 : _b.name) || 'hardhat';
        return (0, exports.getDeployedProject)((0, exports.getCurrentProject)(), network);
    };
    exports.getCurrentDeployedProject = getCurrentDeployedProject;
    const hasCompiledProject = (project, version) => {
        version = version || '1.0.0';
        let projectName = (0, exports.getProjectName)(project);
        let filename = (0, exports.getProjectCompiledPath)(projectName, version);
        return fs_1.default.existsSync((0, helpers_1.cwd)() + filename);
    };
    exports.hasCompiledProject = hasCompiledProject;
    /**
     * Will use temporary compiled project if it exists, otherwise will use the compiled project.
     * @param projectOrPath
     * @returns
     */
    const findCompiledProject = (projectOrPath) => {
        let compiledProject;
        if (typeof projectOrPath === 'string') {
            let project = (0, exports.findProject)(projectOrPath);
            if ((0, exports.hasTempDeployedProject)(project))
                compiledProject = (0, exports.getTempDeployedProject)(project);
            else if ((0, exports.hasCompiledProject)(project))
                compiledProject = (0, exports.getCompiledProject)(project);
            else
                throw new Error('no valid project found to get deployment classes for: ' +
                    projectOrPath);
        }
        else
            compiledProject = projectOrPath;
        return compiledProject;
    };
    exports.findCompiledProject = findCompiledProject;
    /**
     * Returns a compiled InfinityMintProject ready to be deployed, see {@link app/interfaces.InfinityMintProject}.
     * @param projectName
     * @throws
     */
    const getCompiledProject = (project, version) => {
        version =
            version ||
                (typeof project === 'string' && project.indexOf('@') !== -1
                    ? project.split('@')[1] || undefined
                    : undefined) ||
                '1.0.0';
        let projectName = (0, exports.getProjectName)(typeof project === 'string'
            ? {
                name: project,
            }
            : project);
        let filename = (0, exports.getProjectCompiledPath)(projectName, version);
        let res = (0, helpers_1.readJson)((0, helpers_1.cwd)() + filename);
        if (!res.compiled)
            throw new Error(`project ${projectName} has not been compiled`);
        return res;
    };
    exports.getCompiledProject = getCompiledProject;
    /**
     *
     * @param project
     * @param version
     * @param network
     * @returns
     */
    const getNameWithNetwork = (project, version, network) => {
        network = network || hardhat_1.default.network.name;
        return (0, exports.getFullyQualifiedName)(project, version, network);
    };
    exports.getNameWithNetwork = getNameWithNetwork;
    /**
     * Must specify a network if you want it to be included
     * @param project
     * @param version
     * @param network
     * @returns
     */
    const getFullyQualifiedName = (project, version, network) => {
        var _a, _b, _c;
        return ((0, exports.getProjectName)(project) +
            '@' +
            (version ? version : ((_a = project === null || project === void 0 ? void 0 : project.version) === null || _a === void 0 ? void 0 : _a.version) || '1.0.0') +
            (((_b = project === null || project === void 0 ? void 0 : project.network) === null || _b === void 0 ? void 0 : _b.name) || network
                ? `_${((_c = project === null || project === void 0 ? void 0 : project.network) === null || _c === void 0 ? void 0 : _c.name) || network}`
                : ''));
    };
    exports.getFullyQualifiedName = getFullyQualifiedName;
    const getProjectName = (project, version) => {
        var _a, _b;
        return (((project === null || project === void 0 ? void 0 : project.name) ||
            ((_a = project === null || project === void 0 ? void 0 : project.description) === null || _a === void 0 ? void 0 : _a.name) ||
            ((_b = project.source) === null || _b === void 0 ? void 0 : _b.name)).split('@')[0] + (version ? `@${version}` : ''));
    };
    exports.getProjectName = getProjectName;
    const getProjectVersion = (projectFullName) => {
        var _a;
        return (_a = projectFullName === null || projectFullName === void 0 ? void 0 : projectFullName.split('@')[1]) === null || _a === void 0 ? void 0 : _a.split('_')[0];
    };
    exports.getProjectVersion = getProjectVersion;
    const hasTempCompiledProject = (project, version) => {
        let projectName = (0, exports.getProjectName)(project);
        if (!projectName)
            return false;
        version = version || '1.0.0';
        let filename = `/temp/projects/${projectName}@${version}.compiled.temp.json`;
        return fs_1.default.existsSync((0, helpers_1.cwd)() + filename);
    };
    exports.hasTempCompiledProject = hasTempCompiledProject;
    const hasTempDeployedProject = (project, version) => {
        let projectName = (0, exports.getProjectName)(project);
        if (!projectName)
            return false;
        version = version || '1.0.0';
        let filename = `/temp/projects/${projectName}@${version}.deployed.temp.json`;
        return fs_1.default.existsSync((0, helpers_1.cwd)() + filename);
    };
    exports.hasTempDeployedProject = hasTempDeployedProject;
    const saveTempDeployedProject = (project, network) => {
        var _a;
        let filename = `/temp/projects/${project.name}@${((_a = project.version) === null || _a === void 0 ? void 0 : _a.version) || '1.0.0'}_${network || hardhat_1.default.network.name}.deployed.temp.json`;
        (0, helpers_1.write)(filename, project);
    };
    exports.saveTempDeployedProject = saveTempDeployedProject;
    const removeTempDeployedProject = (project, version, network) => {
        var _a, _b;
        let filename = `/temp/projects/${project.name}@${version || ((_a = project.version) === null || _a === void 0 ? void 0 : _a.version) || '1.0.0'}_${network || ((_b = project === null || project === void 0 ? void 0 : project.network) === null || _b === void 0 ? void 0 : _b.name) || hardhat_1.default.network.name}.deployed.temp.json`;
        fs_1.default.unlinkSync((0, helpers_1.cwd)() + filename);
    };
    exports.removeTempDeployedProject = removeTempDeployedProject;
    const removeTempCompliledProject = (project, version) => {
        var _a;
        let filename = `/temp/projects/${project.name}@${version || ((_a = project.version) === null || _a === void 0 ? void 0 : _a.version) || '1.0.0'}.compiled.temp.json`;
        fs_1.default.unlinkSync((0, helpers_1.cwd)() + filename);
    };
    exports.removeTempCompliledProject = removeTempCompliledProject;
    const saveTempCompiledProject = (project) => {
        var _a;
        let filename = `/temp/projects/${project.name}@${((_a = project.version) === null || _a === void 0 ? void 0 : _a.version) || '1.0.0'}.compiled.temp.json`;
        (0, helpers_1.write)(filename, project);
    };
    exports.saveTempCompiledProject = saveTempCompiledProject;
    /**
     * Returns a temporary deployed InfinityMintProject which can be picked up and completed.
     * @param projectName
     * @returns
     * @throws
     */
    const getTempDeployedProject = (project, version, network) => {
        var _a, _b;
        version =
            version ||
                (typeof project === 'string' && project.indexOf('@') !== -1
                    ? project.split('@')[1] || undefined
                    : undefined) ||
                ((_a = project === null || project === void 0 ? void 0 : project.version) === null || _a === void 0 ? void 0 : _a.version) ||
                '1.0.0';
        let projectName = (0, exports.getProjectName)(typeof project === 'string'
            ? {
                name: project,
            }
            : project);
        network = network || ((_b = project === null || project === void 0 ? void 0 : project.network) === null || _b === void 0 ? void 0 : _b.name) || hardhat_1.default.network.name;
        let filename = `/temp/projects/${projectName}@${version}_${network}.deployed.temp.json`;
        try {
            let res = (0, helpers_1.readJson)((0, helpers_1.cwd)() + filename);
            return res;
        }
        catch (error) {
            throw new Error('could not load temp deployed project: ' + error.message);
        }
    };
    exports.getTempDeployedProject = getTempDeployedProject;
    /**
     * Returns a temporary compiled InfinityMintProject which can be picked up and completed.
     * @param projectName
     * @returns
     * @throws
     */
    const getTempCompiledProject = (project, version) => {
        version =
            version ||
                (typeof project === 'string' && project.indexOf('@') !== -1
                    ? project.split('@')[1] || undefined
                    : undefined) ||
                '1.0.0';
        let projectName = (0, exports.getProjectName)(typeof project === 'string'
            ? {
                name: project,
            }
            : project);
        let filename = `/temp/projects/${projectName}@${version}.compiled.temp.json`;
        try {
            let res = (0, helpers_1.readJson)((0, helpers_1.cwd)() + filename);
            return res;
        }
        catch (error) {
            throw new Error('could not load temp compiled project: ' + error.message);
        }
    };
    exports.getTempCompiledProject = getTempCompiledProject;
    const deleteDeployedProject = (project, network, version) => {
        fs_1.default.unlinkSync((0, helpers_1.cwd)() +
            (0, exports.getProjectDeploymentPath)((0, exports.getProjectName)(project), network, version));
    };
    exports.deleteDeployedProject = deleteDeployedProject;
    const getProjectCompiledPath = (projectName, version) => {
        projectName = projectName.split('@')[0];
        return `/projects/compiled/${projectName}@${version || '1.0.0'}.json`;
    };
    exports.getProjectCompiledPath = getProjectCompiledPath;
    const deleteCompiledProject = (project, version) => {
        fs_1.default.unlinkSync((0, helpers_1.cwd)() +
            (0, exports.getProjectCompiledPath)((0, exports.getProjectName)(project), version || project.version.version));
    };
    exports.deleteCompiledProject = deleteCompiledProject;
    /**
     *
     * @param project
     * @param version
     * @returns
     */
    const hasDeployedProject = (project, network, version) => {
        var _a;
        version = version || ((_a = project === null || project === void 0 ? void 0 : project.version) === null || _a === void 0 ? void 0 : _a.version) || '1.0.0';
        let projectName = (0, exports.getFullyQualifiedName)(project, version);
        let filename = (0, exports.getProjectDeploymentPath)(projectName, network, version);
        return fs_1.default.existsSync((0, helpers_1.cwd)() + filename);
    };
    exports.hasDeployedProject = hasDeployedProject;
    const getProjectDeploymentPath = (projectName, network, version) => {
        projectName = projectName.split('@')[0];
        return `/projects/deployed/${network}/${projectName}@${version || '1.0.0'}_${network}.json`;
    };
    exports.getProjectDeploymentPath = getProjectDeploymentPath;
    /**
     * Returns a deployed InfinityMintProject, see {@link app/interfaces.InfinityMintProject}.
     * @param projectName
     */
    const getDeployedProject = (project, network, version) => {
        version = version || '1.0.0';
        let projectName = (0, exports.getProjectName)(project);
        let filename = (0, exports.getProjectDeploymentPath)(projectName, network, version);
        if (!fs_1.default.existsSync((0, helpers_1.cwd)() + filename))
            return null;
        let res = (0, helpers_1.readJson)((0, helpers_1.cwd)() + filename);
        //
        if (!res.deployed)
            throw new Error(`project ${projectName}@${version} has not been deployed to ${network}`);
        return res;
    };
    exports.getDeployedProject = getDeployedProject;
    /**
     *
     * @returns
     */
    const readProjectCache = () => {
        if (!fs_1.default.existsSync((0, helpers_1.cwd)() + '/temp/projects_cache.json'))
            return {
                updated: Date.now(),
                database: {},
                keys: {},
                projects: [],
            };
        return JSON.parse(fs_1.default.readFileSync((0, helpers_1.cwd)() + '/temp/projects_cache.json', {
            encoding: 'utf-8',
        }));
    };
    exports.readProjectCache = readProjectCache;
    const formatCacheEntry = (project, path, name) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        name =
            name || (project.name || path.name) + '@' + path.dir + '/' + path.base;
        let newKeys = {};
        let root = path.dir.split('projects');
        if (root.length > 2)
            root.slice(1).join('projects');
        else
            root = root[1];
        let nss = root[0] === '/' ? root.substring(1) : root;
        let projectName = project.name || ((_a = project === null || project === void 0 ? void 0 : project.description) === null || _a === void 0 ? void 0 : _a.name) || path.name;
        newKeys[path.dir + '/' + path.base] = name;
        newKeys[path.dir + '/' + path.name] = name;
        newKeys['/' + path.name] = name;
        newKeys['/' + path.base] = name;
        newKeys['/projects/' + path.name] = name;
        newKeys['/projects/' + path.base] = name;
        newKeys['projects/' + path.base] = name;
        newKeys[(0, helpers_1.cwd)() + '/' + path.name] = name;
        newKeys[(0, helpers_1.cwd)() + '/' + path.base] = name;
        newKeys[(0, helpers_1.cwd)() + '/projects/' + path.name] = name;
        newKeys[(0, helpers_1.cwd)() + '/projects/' + path.base] = name;
        newKeys[root + '/' + path.name] = name;
        newKeys[root + '/' + path.base] = name;
        newKeys[nss + '/' + path.name] = name;
        newKeys[nss + '/' + path.base] = name;
        newKeys[path.name] = name;
        newKeys[path.name + '@' + (((_b = project.version) === null || _b === void 0 ? void 0 : _b.tag) || '1.0.0')] = name;
        newKeys[path.name + '@' + (((_c = project.version) === null || _c === void 0 ? void 0 : _c.tag) || '1.0.0') + path.ext] =
            name;
        newKeys[path.name +
            '@' +
            (((_d = project === null || project === void 0 ? void 0 : project.version) === null || _d === void 0 ? void 0 : _d.version) === '1.0.0' ||
                ((_e = project === null || project === void 0 ? void 0 : project.version) === null || _e === void 0 ? void 0 : _e.tag) === 'initial'
                ? 'initial'
                : ((_f = project === null || project === void 0 ? void 0 : project.version) === null || _f === void 0 ? void 0 : _f.tag) || 'initial')] = name;
        newKeys[path.name + '@source'] = name;
        newKeys[path.base] = name;
        newKeys[projectName] = name;
        newKeys[projectName + '@' + (((_g = project.version) === null || _g === void 0 ? void 0 : _g.tag) || '1.0.0')] = name;
        newKeys[projectName +
            '@' +
            (((_h = project === null || project === void 0 ? void 0 : project.version) === null || _h === void 0 ? void 0 : _h.version) === '1.0.0' ||
                ((_j = project === null || project === void 0 ? void 0 : project.version) === null || _j === void 0 ? void 0 : _j.tag) === 'initial'
                ? 'initial'
                : ((_k = project === null || project === void 0 ? void 0 : project.version) === null || _k === void 0 ? void 0 : _k.tag) || 'initial')] = name;
        newKeys[projectName + '@source'] = name;
        newKeys[projectName + path.ext] = name;
        Object.keys(newKeys).forEach((key) => {
            newKeys['C:' + (0, helpers_1.replaceSeperators)(key, true)] = newKeys[key];
        });
        return newKeys;
    };
    exports.formatCacheEntry = formatCacheEntry;
    const parseProject = (path, cache) => {
        var _a;
        cache = cache || {
            updated: Date.now(),
            database: {},
            keys: {},
            projects: [],
        };
        let project = (0, exports.requireProject)(path.dir + '/' + path.base, path.ext !== '.ts');
        let name = (project.name || path.name) + '@' + path.dir + '/' + path.base;
        let version = ((_a = project === null || project === void 0 ? void 0 : project.version) === null || _a === void 0 ? void 0 : _a.version) || project.version || `1.0.0`;
        if (!cache.projects.includes(project.name + '@' + version))
            cache.projects.push(project.name + '@' + version);
        if (cache.database[name]) {
            name =
                name +
                    '_' +
                    Object.keys(cache.database).filter((key) => key === name).length;
            cache.database[name];
        }
        else
            cache.database[name] = path;
        cache.keys = Object.assign(Object.assign({}, cache.keys), (0, exports.formatCacheEntry)(project, path, name));
        return cache;
    };
    exports.parseProject = parseProject;
    /**
     *
     * @param projects
     */
    const writeParsedProjects = (projects) => {
        let cache = {
            updated: Date.now(),
            database: {},
            keys: {},
            projects: [],
        };
        projects.forEach((path) => {
            (0, exports.parseProject)(path, cache);
        });
        fs_1.default.writeFileSync((0, helpers_1.cwd)() + '/temp/projects_cache.json', JSON.stringify(cache));
        return cache;
    };
    exports.writeParsedProjects = writeParsedProjects;
    let projectCache;
    const getProjectCache = (useFresh) => {
        if (useFresh || !projectCache)
            projectCache = (0, exports.readProjectCache)();
        return projectCache;
    };
    exports.getProjectCache = getProjectCache;
    /**
     *
     * @param roots
     * @returns
     */
    const findProjects = (roots = []) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let config = (0, helpers_1.getConfigFile)();
        roots = [
            ...roots,
            (0, helpers_1.cwd)() + '/projects/',
            ...(config.roots || []).map((root) => {
                if (root.startsWith('../'))
                    root = root.replace('../', (0, helpers_1.cwd)() + '/../');
                return (root +
                    (root[root.length - 1] !== '/' ? '/projects/' : 'projects/'));
            }),
        ];
        let projects = [];
        for (let i = 0; i < roots.length; i++) {
            projects = [
                ...projects,
                ...(yield (0, helpers_1.findFiles)(roots[i] + '**/*.json')),
                ...(yield (0, helpers_1.findFiles)(roots[i] + '**/*.js')),
                ...(yield (0, helpers_1.findFiles)(roots[i] + '**/*.cjs')),
                ...(yield (0, helpers_1.findFiles)(roots[i] + '**/*.mjs')),
            ];
            if ((0, helpers_1.isTypescript)() || !((_b = (_a = config.settings) === null || _a === void 0 ? void 0 : _a.scripts) === null || _b === void 0 ? void 0 : _b.disallowTypescript)) {
                projects = [
                    ...projects,
                    ...(yield (0, helpers_1.findFiles)(roots[i] + '**/*.ts')),
                ];
                projects = projects.filter((x) => !x.endsWith('.d.ts') && !x.endsWith('.type-extension.ts'));
            }
        }
        //remove update folder
        projects = projects.filter((x) => !x.includes('/projects/updates/'));
        return projects.map((filePath) => path_1.default.parse(filePath));
    });
    exports.findProjects = findProjects;
    /**
     *
     * @param script
     * @param type
     * @returns
     */
    const createTemporaryProject = (script, type, network, version, newVersion) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        let project = ((_b = (_a = script.args) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.value)
            ? ((0, exports.hasCompiledProject)(script.project.source)
                ? (0, exports.getCompiledProject)((0, exports.findProject)((_d = (_c = script.args) === null || _c === void 0 ? void 0 : _c.project) === null || _d === void 0 ? void 0 : _d.value))
                : null) || (0, exports.findProject)((_f = (_e = script.args) === null || _e === void 0 ? void 0 : _e.project) === null || _f === void 0 ? void 0 : _f.value)
            : script.project.compiledProject || script.project.source;
        if (!project)
            throw new Error('project not found, please specify a project with the --project flag');
        network = network || ((_g = hardhat_1.default.network) === null || _g === void 0 ? void 0 : _g.name);
        version =
            version ||
                ((_h = project === null || project === void 0 ? void 0 : project.version) === null || _h === void 0 ? void 0 : _h.version) ||
                ((_j = script.args.target) === null || _j === void 0 ? void 0 : _j.value) ||
                '1.0.0';
        if (!((_l = (_k = script.args) === null || _k === void 0 ? void 0 : _k.dontUseTemp) === null || _l === void 0 ? void 0 : _l.value) &&
            type === 'compiled' &&
            (0, exports.hasTempCompiledProject)(project, newVersion || version)) {
            script.infinityConsole.log('{yellow-fg}found previous compiled project attempting to retry{/yellow-fg}');
            return (0, exports.getTempCompiledProject)(project, newVersion || version);
        }
        else if (type === 'compiled' && (0, exports.hasCompiledProject)(project, version)) {
            let compiledProject = (0, exports.getCompiledProject)(project, version);
            if (compiledProject) {
                compiledProject.version.version = newVersion || version;
                return compiledProject;
            }
        }
        else if (!((_o = (_m = script.args) === null || _m === void 0 ? void 0 : _m.dontUseTemp) === null || _o === void 0 ? void 0 : _o.value) &&
            type === 'deployed' &&
            (0, exports.hasTempDeployedProject)(project, version)) {
            script.infinityConsole.log('{yellow-fg}found previous deployed project attempting to retry{/yellow-fg}');
            return (0, exports.getTempDeployedProject)(project, newVersion || version);
        }
        else if (type === 'deployed' &&
            (0, exports.hasDeployedProject)(project, network, version)) {
            let deployedProject = (0, exports.getDeployedProject)(project, network, version);
            if (deployedProject) {
                deployedProject.version.version = newVersion || version;
                return deployedProject;
            }
        }
        if (type === 'deployed')
            (0, helpers_1.warning)('deployed project not found, using source');
        if (type === 'compiled')
            (0, helpers_1.warning)('compiled project not found, using source');
        return project;
    };
    exports.createTemporaryProject = createTemporaryProject;
    /**
     *
     * @param projectOrPathName
     * @returns
     */
    const getProjectSource = (projectOrPathName) => {
        let key = typeof projectOrPathName === 'string'
            ? projectOrPathName
            : (0, exports.getProjectName)(projectOrPathName);
        let projects = (0, exports.getProjectCache)();
        return projects.database[projects.keys[key]];
    };
    exports.getProjectSource = getProjectSource;
    /**
     * Returns a project class, see {@link app/projects.Project}
     * @param projectOrPathName
     * @param infinityConsole
     * @returns
     */
    const getProject = (projectOrPathName, network, infinityConsole, version) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        version = version || projectOrPathName.split('@')[1];
        let result = (0, exports.findProject)(projectOrPathName);
        if (!result)
            throw new Error('project not found => ' + projectOrPathName);
        if ((0, exports.hasCompiledProject)(result, version) && !version)
            version = (_c = (0, exports.getCompiledProject)(result, version).version) === null || _c === void 0 ? void 0 : _c.version;
        let project = new Project(result, infinityConsole, version || ((_d = result === null || result === void 0 ? void 0 : result.version) === null || _d === void 0 ? void 0 : _d.version) || '1.0.0', network);
        if ((0, exports.hasDeployedProject)(project.source, network, version))
            yield project.loadDeployments(network).catch((e) => {
                (0, helpers_1.warning)('error loading deployments for ' +
                    result.name +
                    '=>\n' +
                    e.stack);
            });
        else
            (0, helpers_1.debugLog)('no deployments found for ' + result.name + ' on network ' + network);
        return project;
    });
    exports.getProject = getProject;
    /**
     * Gets a project
     * @param projectNameOrPath
     * @returns
     */
    const findProject = (projectNameOrPath) => {
        let projects = (0, exports.getProjectCache)();
        if (!projects.keys[projectNameOrPath])
            throw new Error('cannot find project: ' + projectNameOrPath);
        let projectName = projects.keys[projectNameOrPath];
        if (!projects.database[projectName] && (0, exports.findProject)(projectNameOrPath))
            projectName = (0, exports.findProject)(projectNameOrPath).name;
        if (!projects.database[projectName])
            throw new Error('cannot find project: ' + projectNameOrPath);
        let result = (0, exports.requireProject)(projects.database[projectName].dir +
            '/' +
            projects.database[projectName].base, projects.database[projectName].ext !== '.ts', true);
        if (!result.name)
            result.name = projects.database[projectName].name;
        return result;
    };
    exports.findProject = findProject;
    /**
     * Returns an InfinityMintProject file relative to the /projects/ folder, see {@link app/interfaces.InfinityMintProject}. Will return type of InfinityMintProjectClassic if second param is true.
     * @param projectName
     * @param isJavaScript
     * @throws
     */
    const requireProject = (projectPath, isJavaScript, clearCache) => {
        var _a;
        if (clearCache && require.cache[projectPath])
            delete require.cache[projectPath];
        let res = require(projectPath);
        res = res.default || res;
        res.javascript = isJavaScript;
        res.source = projectPath;
        res.name =
            res.name ||
                ((_a = res.description) === null || _a === void 0 ? void 0 : _a.name) ||
                path_1.default.parse(projectPath.toString()).name;
        if (isJavaScript)
            return res;
        return res;
    };
    exports.requireProject = requireProject;
    /**
     *
     * @returns
     */
    const getCurrentCompiledProject = () => {
        if (!(0, exports.getCurrentProject)())
            return {
                name: 'unknown',
                version: {
                    tag: 'unknown',
                    version: 'unknown',
                },
            };
        return (0, exports.getCompiledProject)((0, exports.getCurrentProject)());
    };
    exports.getCurrentCompiledProject = getCurrentCompiledProject;
});
//# sourceMappingURL=projects.js.map