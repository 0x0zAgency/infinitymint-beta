(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "fs", "../app/deployments", "../app/projects", "../app/helpers", "../app/web3", "../app/web3", "path", "../app/gasAndPrices"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const deployments_1 = require("../app/deployments");
    const projects_1 = require("../app/projects");
    const helpers_1 = require("../app/helpers");
    const web3_1 = require("../app/web3");
    const web3_2 = require("../app/web3");
    const path_1 = tslib_1.__importDefault(require("path"));
    const gasAndPrices_1 = require("../app/gasAndPrices");
    const deployProject = {
        name: 'Deploy',
        description: 'Deploys InfinityMint or a specific InfinityMint contract related to the current project',
        /**
         * Deploys an InfinityMint project
         * @param script
         */
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            let config = (0, helpers_1.getConfigFile)();
            let tempProject = (0, projects_1.createTemporaryProject)(script, 'compiled', null, (_a = script.args.target) === null || _a === void 0 ? void 0 : _a.value);
            let { redeploy, setPipe, cleanup, save } = (0, helpers_1.getArgumentValues)(script.args);
            if (save === undefined &&
                script.infinityConsole.network.name !== 'hardhat')
                save = true;
            if (!tempProject.compiled)
                throw new Error('please compile this project before deploying it');
            if (!script.infinityConsole.hasNetworkAccess())
                throw new Error('invalid current network please check connectivity');
            //add permissions to project
            if (script.infinityConsole.network.name === 'ganache') {
                if (tempProject.permissions === undefined)
                    tempProject.permissions = {};
                tempProject.permissions.all = [
                    ...(((_b = tempProject === null || tempProject === void 0 ? void 0 : tempProject.permissions) === null || _b === void 0 ? void 0 : _b.all) || []),
                    ...(0, web3_1.getAccounts)((0, helpers_1.getGanacheMnemonic)(), script.infinityConsole.network.name === 'ganache' ? 20 : 10),
                ];
            }
            if (!tempProject.network)
                tempProject.network = {
                    chainId: script.infinityConsole.getCurrentChainId(),
                    name: script.infinityConsole.network.name,
                    url: ((_e = (_d = (_c = config.settings) === null || _c === void 0 ? void 0 : _c.networks) === null || _d === void 0 ? void 0 : _d[script.infinityConsole.network.name]) === null || _e === void 0 ? void 0 : _e.exposeRpc)
                        ? config.hardhat.networks[script.infinityConsole.network.name].url
                        : (_h = (_g = (_f = config.settings) === null || _f === void 0 ? void 0 : _f.networks) === null || _g === void 0 ? void 0 : _g[script.infinityConsole.network.name]) === null || _h === void 0 ? void 0 : _h.rpc,
                    tokenSymbol: script.infinityConsole.getCurrentTokenSymbol(),
                };
            let previousPath = path_1.default.join((0, helpers_1.cwd)(), (0, projects_1.getProjectDeploymentPath)(tempProject.name, tempProject.network.name, (_j = tempProject.version) === null || _j === void 0 ? void 0 : _j.version));
            if (redeploy && fs_1.default.existsSync(previousPath)) {
                script.log(`Removing deployed project => ${(0, projects_1.getNameWithNetwork)(tempProject)}`);
                fs_1.default.unlinkSync(previousPath);
            }
            else if ((0, projects_1.hasDeployedProject)(tempProject, tempProject.network.name))
                throw new Error(`A project with this version already exists`);
            if (setPipe) {
                //pipes are used to pipe console.log and console.errors to containers which can then be viewed instead of logs/debug logs all being in one place, here we are registering a new pipe for this deployment process and setting it as the current pipe
                let pipeName = 'deploy_' + tempProject.name;
                if (!script.infinityConsole.PipeFactory.pipes[pipeName])
                    script.infinityConsole.PipeFactory.registerSimplePipe(pipeName, {
                        listen: true,
                    });
                //all log messages will now go to deploy
                script.infinityConsole.PipeFactory.setCurrentPipe(pipeName);
            }
            //make folder for deployments to go into
            (0, helpers_1.makeDirectories)((0, helpers_1.cwd)() + '/deployments/' + script.infinityConsole.network.name + '/');
            //make directory for deployed projects
            (0, helpers_1.makeDirectories)((0, helpers_1.cwd)() +
                '/projects/deployed/' +
                script.infinityConsole.network.name +
                '/');
            script.log(`{cyan-fg}{bold}getting deployment classes for ${(0, projects_1.getFullyQualifiedName)(tempProject)}`);
            //sets the project and script to be the one used by the action method. Must be called before any action is called or any always is called
            yield (0, web3_2.prepare)(tempProject, script, 'deploy');
            //start the receipt monitor
            (0, web3_1.startReceiptMonitor)();
            //load all of the deployment classes, this is an optimization
            const deploymentClasses = yield (0, deployments_1.loadDeploymentClasses)(tempProject, script.infinityConsole); //fetches all of the deployment classes with the context of this project
            //filters our deployment classes to ones only for this project
            let deployments = (0, deployments_1.filterUsedDeploymentClasses)(tempProject, deploymentClasses //pass it so the function uses our pre-fetched classes
            );
            let notUniqueAndImportant = deployments
                .filter((deployment) => !deployment.isUnique() && !deployment.isImportant())
                .filter((deployment) => deployments.filter((thatDeployment) => thatDeployment.getKey() === deployment.getKey()).length > 1);
            let keyValueDeployments = {};
            Object.values(deployments).forEach((deployment) => {
                keyValueDeployments[deployment.getModuleKey() || deployment.getContractName()] = deployment;
            });
            if (notUniqueAndImportant.length !== 0)
                throw new Error('1 or more conflicting unique and important deploy scripts: check ' +
                    notUniqueAndImportant
                        .map((deployment) => deployment.getKey() +
                        ':' +
                        deployment.getTemporaryFilePath())
                        .join('\n'));
            let libraies = deployments.filter((deployment) => deployment.isLibrary());
            let important = deployments.filter((deployment) => deployment.isImportant());
            let importantDeployments = [...libraies];
            important.forEach((deployment, index) => {
                if (importantDeployments.filter((thatDeployment) => thatDeployment.getKey() === deployment.getKey()).length === 0)
                    importantDeployments.push(deployment);
            });
            importantDeployments.sort((a, b) => {
                if (a.isLibrary() && !b.isLibrary())
                    return -1;
                if (!a.isLibrary() && b.isLibrary())
                    return 1;
                return 0;
            });
            script.log(`{yellow-fg}{bold}deploying ${deployments.length} contracts{/}`);
            deployments.forEach((deployment) => {
                script.log(`{white-fg}{bold} - ${deployment.getKey()}{/}`);
            });
            let contracts = Object.assign({}, tempProject.deployments);
            let libraires = Object.assign({}, tempProject.libraries);
            //deploy stage
            let deploy = yield (0, web3_2.always)('deploy', (isFirstTime) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                script.log(`\n{cyan-fg}{bold}Deploying Smart Contracts{/}\n`);
                for (let i = 0; i < deployments.length; i++) {
                    let deployment = deployments[i];
                    let instantSetup = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        if (deployment.getDeploymentScript().instantlySetup &&
                            !deployment.hasSetup()) {
                            script.log(`[${i}] instantly setting up <` +
                                deployment.getKey() +
                                '>');
                            script.infinityConsole.emit('preSetup', Object.assign(Object.assign({}, script), { project: tempProject, deployments: keyValueDeployments, deployment, event: deployment }));
                            tempProject.stages['setup_' + deployment.getKey()] =
                                false;
                            try {
                                yield deployment.setup(Object.assign(Object.assign({}, script), { project: tempProject, deployments: keyValueDeployments, deployment: deployment, deploymentClasses, event: deployment, contracts: contracts, deployed: deployment.hasDeployed(), deploymentScript: deployment.getDeploymentScript() }));
                                contracts[deployment.getContractName()].setup =
                                    true;
                                contracts[deployment.getModuleKey()].setup = true;
                            }
                            catch (error) {
                                tempProject.stages['setup_' + deployment.getKey()] =
                                    error;
                                throw error;
                            }
                            if (save)
                                deployment.saveTemporaryDeployments();
                            tempProject.stages['setup_' + deployment.getKey()] =
                                true;
                            script.infinityConsole.emit('postSetup', Object.assign(Object.assign({}, script), { project: tempProject, deployments: keyValueDeployments, deployment, event: deployment }));
                        }
                    });
                    //deploy each contract
                    let result = yield (0, web3_2.always)('deploy_' + deployment.getKey(), () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        var _k, _l, _m, _o, _p, _q, _r;
                        if (((_k = script.args) === null || _k === void 0 ? void 0 : _k.contract) &&
                            deployment.getKey() !==
                                ((_l = script.args) === null || _l === void 0 ? void 0 : _l.contract.value) &&
                            deployment.getContractName() !==
                                script.args.contract.value) {
                            script.log(`[${i}] skipping <` +
                                deployment.getKey() +
                                '>(' +
                                deployment.getContractName() +
                                ')');
                            return;
                        }
                        tempProject.deployments = contracts;
                        script.infinityConsole.emit('preDeploy', Object.assign(Object.assign({}, script), { project: tempProject, deployments: keyValueDeployments, deployment, event: deployment }));
                        if (deployment.hasDeployed() &&
                            ((_o = (_m = script.args) === null || _m === void 0 ? void 0 : _m.redeploy) === null || _o === void 0 ? void 0 : _o.value) !== true) {
                            let previousContracts = deployment.getDeployments();
                            previousContracts.forEach((contract, index) => {
                                script.log(`[${i}] => (${index}) {yellow-fg}already deployed <${contract.contractName}>{/yellow-fg} => ${contract.address}`);
                                contracts[contract.name] = contract;
                                contracts[index === 0
                                    ? contract.key
                                    : contract.key + ':' + index] = contract;
                                contracts[index === 0
                                    ? deployment.getModuleKey()
                                    : deployment.getModuleKey() +
                                        ':' +
                                        index] = contract;
                            });
                            //call post deploy with previous contracts
                            script.infinityConsole.emit('postDeploy', Object.assign({ project: tempProject, deployments: keyValueDeployments, deployment, event: previousContracts }, script));
                            //do instant setup if we are to
                            yield instantSetup();
                            //return
                            return;
                        }
                        else if (deployment.hasDeployed()) {
                            script.log(`[${i}] {yellow-fg}already deployed{/yellow-fg} <` +
                                deployment.getKey() +
                                '>(' +
                                deployment.getContractName() +
                                ')');
                            if (cleanup) {
                                script.log(`[${i}] calling cleanup since cleanup on redeploy since flag is present <` +
                                    deployment.getKey() +
                                    '>(' +
                                    deployment.getContractName() +
                                    ')');
                                let contractNames = (yield deployment.execute('cleanup', {
                                    isFirstTime,
                                    deploymentClasses,
                                }, script.infinityConsole, script.infinityConsole.getEventEmitter(), keyValueDeployments, contracts));
                                if (contractNames) {
                                    contractNames.forEach((contract) => {
                                        if (contracts[contract]) {
                                            script.log(`\tRemoving ${contract}`);
                                            delete contracts[contract];
                                        }
                                    });
                                }
                                else {
                                    delete contracts[deployment.getContractName()];
                                    delete contracts[deployment.getModuleKey()];
                                }
                            }
                            else {
                                //reset
                                delete contracts[deployment.getContractName()];
                                delete contracts[deployment.getModuleKey()];
                            }
                            //reset the deployment class
                            deployment.reset();
                        }
                        script.log(`\n[${i}] deploying <` +
                            deployment.getKey() +
                            '>(' +
                            deployment.getContractName() +
                            ')');
                        let deployedContracts = yield deployment.deploy(Object.assign(Object.assign({}, script), { project: tempProject, save: script.args.save === undefined
                                ? true
                                : ((_p = script.args.save) === null || _p === void 0 ? void 0 : _p.value) || false, deployments: keyValueDeployments, deployment: deployment, deploymentClasses, contracts: contracts, deployed: deployment.hasDeployed(), deploymentScript: deployment.getDeploymentScript(), usePreviousDeployment: ((_r = (_q = script.args) === null || _q === void 0 ? void 0 : _q.redeploy) === null || _r === void 0 ? void 0 : _r.value) !== true }));
                        deployedContracts.forEach((contract, index) => {
                            script.log(`[${i}] => (${index}) deployed <${contract.name}> => ${contract.address}`);
                            contracts[contract.name] = contract;
                            contracts[contract.name].module =
                                deployment.getModuleKey();
                            contracts[index === 0
                                ? contract.key
                                : contract.key + ':' + index] = contract;
                            contracts[index === 0
                                ? deployment.getModuleKey()
                                : deployment.getModuleKey() + ':' + index] = contract;
                        });
                        if (deployment.isLibrary()) {
                            deployment.getDeployments().forEach((contract) => {
                                libraires[contract.contractName] =
                                    contract.address;
                            });
                        }
                        tempProject.libraries = libraires;
                        if (save)
                            deployment.saveTemporaryDeployments();
                        script.infinityConsole.emit('postDeploy', Object.assign(Object.assign({}, script), { project: tempProject, deployments: keyValueDeployments, deployment, event: deployedContracts }));
                        //do instant setup if we are to
                        yield instantSetup();
                        tempProject.deployments = contracts;
                    }));
                    //throw error from stage
                    if (result !== true) {
                        script.log(`[${i}] cleaning up <` +
                            deployment.getKey() +
                            '>(' +
                            deployment.getContractName() +
                            ') after failed deployment');
                        let contractNames = (yield deployment.execute('cleanup', {
                            isFirstTime,
                            error: result,
                            stage: 'deploy',
                            deploymentClasses,
                        }, script.infinityConsole, script.infinityConsole.getEventEmitter(), keyValueDeployments, contracts));
                        contractNames = contractNames || [
                            deployment.getContractName(),
                        ]; //dont remove contract by default
                        contractNames.forEach((contract) => {
                            if (contracts[contract]) {
                                script.log(`\tRemoving ${contract}`);
                                delete contracts[contract];
                            }
                        });
                        tempProject.deployments = contracts;
                        throw result;
                    }
                    script.log(`{green-fg}successfully deployed{/green-fg} <${deployment.getContractName()}> (` +
                        tempProject.name +
                        ')\n');
                }
                script.log(`{green-fg}{bold}Deployment Successful{/}`);
            }));
            if (deploy !== true)
                throw deploy;
            //setup stage
            let setup = yield (0, web3_2.always)('setup', (isFirstTime) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                script.log(`\n{cyan-fg}{bold}Configuring Smart Contracts{/}\n`);
                let setupContracts = deployments.filter((deployment) => !deployment.hasSetup());
                if (setupContracts.length === 0) {
                    script.log(`{yellow-fg}{bold}No Contracts To Setup{/}`);
                    return;
                }
                for (let i = 0; i < setupContracts.length; i++) {
                    let deployment = setupContracts[i];
                    let result = yield (0, web3_2.always)('setup_' + deployment.getContractName(), () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        if (!deployment.getDeploymentScript().setup) {
                            script.log(`[${i}] => {gray-fg} Skipping <${deployment.getContractName()}>`);
                            return;
                        }
                        if (deployment.hasSetup()) {
                            script.log(`[${i}] => {yellow-fg} <${deployment.getContractName()}> has already been set up`);
                            return;
                        }
                        script.infinityConsole.emit('preSetup', Object.assign(Object.assign({}, script), { project: tempProject, deployments: keyValueDeployments, event: deployment }));
                        script.log(`\n[${i}] setting up <` +
                            deployment.getKey() +
                            '>(' +
                            deployment.getContractName() +
                            ')');
                        yield deployment.setup(Object.assign(Object.assign({}, script), { project: tempProject, deployments: keyValueDeployments, deployment: deployment, event: deployment, deploymentClasses, contracts: contracts, deployed: deployment.hasDeployed(), deploymentScript: deployment.getDeploymentScript() }));
                        if (save)
                            deployment.saveTemporaryDeployments();
                        contracts[deployment.getContractName()].setup = true;
                        contracts[deployment.getModuleKey()].setup = true;
                        script.infinityConsole.emit('postSetup', Object.assign(Object.assign({}, script), { project: tempProject, deployments: keyValueDeployments, event: deployment }));
                    }));
                    //throw error from stage
                    if (result !== true) {
                        script.log(`[${i}] cleaning up <` +
                            deployment.getKey() +
                            '>(' +
                            deployment.getContractName() +
                            ') after failed setup');
                        let contractNames = (yield deployment.execute('cleanup', {
                            isFirstTime,
                            error: result,
                            stage: 'setup',
                            deploymentClasses,
                        }, script.infinityConsole, script.infinityConsole.getEventEmitter(), keyValueDeployments, contracts));
                        contractNames = contractNames || []; //dont remove contract by default
                        contractNames.forEach((contract) => {
                            if (contracts[contract]) {
                                script.log(`\tRemoving ${contract}`);
                                delete contracts[contract];
                            }
                        });
                        throw result;
                    }
                    script.log(`{green-fg}successfully setup <${deployment.getContractName()}>{/green-fg} (` +
                        tempProject.name +
                        ')\n');
                }
                script.log(`{green-fg}{bold}Setup Successful{/}`);
            }));
            if (setup !== true)
                throw setup;
            //authentication stage
            let authentication = yield (0, web3_2.action)('authentication', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                script.log(`\n{cyan-fg}{bold}Authenticating Smart Contracts{/}\n`);
                //using await Promise.all breaks ganache?
                let _vals = Object.values(deployments);
                for (let index = 0; index < _vals.length; index++) {
                    let deployment = _vals[index];
                    if (deployment.isLibrary()) {
                        script.log(`Skipping <${deployment.getContractName()}>\n`);
                        continue;
                    }
                    script.log(`\n[${index}] authenticating <` +
                        deployment.getKey() +
                        '>(' +
                        deployment.getContractName() +
                        ')');
                    let approvedAddresses = [];
                    if (deployment.getDeploymentScript().permissions)
                        deployment
                            .getDeploymentScript()
                            .permissions.forEach((statement) => {
                            var _a, _b;
                            if (keyValueDeployments[statement]) {
                                script.log(`\tgiving permissions to => ` + statement);
                                approvedAddresses.push(contracts[statement].address);
                            }
                            else
                                switch (statement) {
                                    case 'approved':
                                        break;
                                    case 'all':
                                        approvedAddresses = [
                                            ...approvedAddresses,
                                            ...(((_a = tempProject.permissions) === null || _a === void 0 ? void 0 : _a.all) ||
                                                []),
                                            ...(((_b = tempProject === null || tempProject === void 0 ? void 0 : tempProject.permissions) === null || _b === void 0 ? void 0 : _b[deployment.getModuleKey()]) || []),
                                        ];
                                        break;
                                    default:
                                        if (statement.indexOf('0x') === -1) {
                                            (0, helpers_1.warning)('bad permission key: ' +
                                                statement);
                                            return;
                                        }
                                        approvedAddresses.push(statement);
                                }
                        });
                    //now do requested permissions
                    let requested = deployments
                        .filter((thatDeployment) => {
                        var _a, _b, _c, _d;
                        return (((_b = (_a = thatDeployment
                            .getDeploymentScript()) === null || _a === void 0 ? void 0 : _a.requestPermissions) === null || _b === void 0 ? void 0 : _b.includes(deployment.getModuleKey().toString())) ||
                            ((_d = (_c = thatDeployment
                                .getDeploymentScript()) === null || _c === void 0 ? void 0 : _c.requestPermissions) === null || _d === void 0 ? void 0 : _d.includes(deployment.getContractName())));
                    })
                        .map((thatDeployment) => thatDeployment.getAddress());
                    approvedAddresses = [...approvedAddresses, ...requested];
                    //remove duplicate addresses
                    approvedAddresses = approvedAddresses.filter((item, pos, self) => self.indexOf(item) == pos);
                    if (approvedAddresses.length === 0) {
                        script.log(`Skipping <${deployment.getContractName()}>\n`);
                        continue;
                    }
                    script.log(`\n{cyan-fg}Approving ${approvedAddresses.length} with <${deployment.getContractName()}>`);
                    try {
                        approvedAddresses.forEach((address, index) => {
                            script.log(`[${index}] => ${address}`);
                        });
                        yield deployment.multiApprove(approvedAddresses);
                        deployment.setApproved(approvedAddresses);
                        if (save)
                            deployment.saveTemporaryDeployments();
                        script.log(`\n{green-fg}Success{/}\n\tApproved (${approvedAddresses.length}) addresses on <${deployment.getContractName()}>\n`);
                    }
                    catch (error) {
                        (0, helpers_1.warning)(`error approving <${deployment.getContractName()}>: ${error.message}`);
                    }
                }
            }));
            if (authentication !== true)
                throw authentication;
            //project has deployed
            tempProject.deployed = true;
            //set the project deployer
            tempProject.deployer =
                script.infinityConsole.getCurrentAccount().address;
            //post funcs
            let post = yield (0, web3_2.action)('post', (isFirstTime) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                script.log(`\n{cyan-fg}{bold}Post Deployment Meta{/}\n`);
                //names to object
                let names = {};
                if (!tempProject.settings.names)
                    tempProject.settings.names = [];
                Object.keys(tempProject.settings.names).forEach((key) => {
                    names[key] = tempProject.settings.names[key];
                });
                tempProject.meta.names = names;
                script.log(`\n{cyan-fg}{bold}Post Deployment Functions{/}\n`);
                let postContracts = deployments.filter((deployment) => deployment.getDeploymentScript().post);
                if (postContracts.length === 0) {
                    script.log(`{yellow-fg}{bold}No Contracts{/}`);
                    return;
                }
                for (let i = 0; i < postContracts.length; i++) {
                    let deployment = postContracts[i];
                    script.log(`[${i}] running post func on <` +
                        deployment.getKey() +
                        '> (' +
                        deployment.getModuleKey() +
                        ')');
                    let result = yield (0, web3_2.action)('post_' + deployment.getContractName(), () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        yield deployment.execute('post', {
                            deploymentClasses,
                        }, script.infinityConsole, script.infinityConsole.getEventEmitter(), keyValueDeployments, contracts);
                    }));
                    //throw error from stage
                    if (result !== true) {
                        script.log(`[${i}] cleaning up <` +
                            deployment.getKey() +
                            '>(' +
                            deployment.getContractName() +
                            ') after failed post func exec');
                        let contractNames = (yield deployment.execute('cleanup', {
                            isFirstTime,
                            error: result,
                            stage: 'post',
                        }, script.infinityConsole, script.infinityConsole.getEventEmitter(), keyValueDeployments, contracts));
                        contractNames = contractNames || []; //dont remove contract by default
                        contractNames.forEach((contract) => {
                            if (contracts[contract]) {
                                script.log(`\tRemoving ${contract}`);
                                delete contracts[contract];
                            }
                        });
                        throw result;
                    }
                    script.log(`{green-fg}successfully ran post func <${postContracts[i].getContractName()}>{/green-fg} (` +
                        tempProject.name +
                        ')\n');
                }
            }));
            if (post !== true)
                throw post;
            //write phase
            let write = yield (0, web3_2.always)('write', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                var _s, _t;
                if (save) {
                    script.log(`\n{cyan-fg}{bold}Writing Project{/}`);
                    let newProjectPath = (0, projects_1.getProjectDeploymentPath)(tempProject.name, (_s = tempProject.network) === null || _s === void 0 ? void 0 : _s.name, (_t = tempProject.version) === null || _t === void 0 ? void 0 : _t.version);
                    script.log('\tWriting => ' + newProjectPath);
                    fs_1.default.writeFileSync(path_1.default.join((0, helpers_1.cwd)(), newProjectPath), JSON.stringify(tempProject));
                    script.log(`{green-fg}{bold}Write Successful{/}\n`);
                    script.log(`{cyan-fg}{bold}Writing Deployments{/}`);
                    let values = Object.values(deployments);
                    for (let index = 0; index < values.length; index++) {
                        let deployment = values[index];
                        script.log(`[${index}] => Writing <${deployment.getContractName()}>`);
                        deployment.saveFinalDeployment();
                        script.log(`\t{green-fg}Success!{/green-fg} => ${deployment.getFilePath()}`);
                    }
                    script.log(`{green-fg}{bold}Write Successful{/}`);
                }
                else {
                    script.log(`\n{yellow-fg}{bold}Skipping Write (saving is not enabled){/}`);
                    script.log(`\n{cyan-fg}{bold}Removing Deployments{/}\n`);
                    let values = Object.values(deployments);
                    for (let index = 0; index < values.length; index++) {
                        let deployment = values[index];
                        if (fs_1.default.existsSync(deployment.getFilePath()))
                            yield fs_1.default.promises.unlink(deployment.getFilePath());
                        else
                            script.log(`\t{gray-fg}Skipping <${deployment.getContractName()}>{/}`);
                    }
                    script.log(`\n{green-fg}{bold}Removal Successful{/}`);
                }
            }));
            if (write !== true)
                throw write;
            script.log(`\n{cyan-fg}{bold}Removing Temp Deployments{/}\n`);
            let values = Object.values(deployments);
            for (let index = 0; index < values.length; index++) {
                let deployment = values[index];
                if (fs_1.default.existsSync(deployment.getTemporaryFilePath())) {
                    script.log(`\t{gray-fg}Removing Temp Deployment ${deployment.getTemporaryFilePath()} => <${deployment.getContractName()}>{/}`);
                    fs_1.default.promises.unlink(deployment.getTemporaryFilePath());
                }
                else
                    script.log(`\t{gray-fg}Skipping Temp ${deployment.getTemporaryFilePath()} => <${deployment.getContractName()}>{/}`);
            }
            script.log(`\n{cyan-fg}{bold}Removing Temp Project File{/}\n`);
            (0, projects_1.removeTempDeployedProject)(tempProject);
            script.log('\n{cyan-fg}{bold}Stopping Receipt Monitor{/}\n');
            let receipts = yield (0, web3_1.stopReceiptMonitor)();
            script.log('\n{cyan-fg}{bold}Generating Receipt Report{/}');
            let report = (0, gasAndPrices_1.getReport)(receipts);
            script.log(`\tReport Path: ${path_1.default.join((0, helpers_1.cwd)(), '/projects/reports/', (0, projects_1.getFullyQualifiedName)(tempProject) + '.report.json')}\n\tGas Used: ${report.gasUsage.toString()}\n\tAverage Gas Price: ${(report.averageGasPrice / 1000000000).toFixed(2)} gwei\n\tCost (in tokens): ${report.cost}\n\tTransactions: ${report.transactions}`);
            (0, gasAndPrices_1.saveReport)(tempProject, report);
            script.log('\n{green-fg}{bold}Deployment Successful{/}');
            script.log(`\tProject: ${tempProject.name}`);
            script.log(`\tVersion: ${tempProject.version.version} (${tempProject.version.tag})\n` +
                `\tNetwork: ${tempProject.network.name} (chainId:${tempProject.network.chainId})`);
            if (script.infinityConsole.network.name !== 'hardhat')
                script.log('{gray-fg}{bold}You can now go ahead and {cyan-fg}export this project!{/}');
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
            {
                name: 'redeploy',
                type: 'boolean',
                value: false,
                optional: true,
            },
            {
                name: 'setPipe',
                type: 'boolean',
                optional: true,
                value: true,
            },
        ],
    };
    exports.default = deployProject;
});
//# sourceMappingURL=deployProject.js.map