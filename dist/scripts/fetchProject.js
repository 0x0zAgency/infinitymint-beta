(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/projects", "fs", "../app/helpers", "../app/web3", "hardhat"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const projects_1 = require("../app/projects");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const helpers_1 = require("../app/helpers");
    const web3_1 = require("../app/web3");
    const hardhat_1 = tslib_1.__importStar(require("hardhat"));
    const fetchDeloyments = {
        name: 'Fetch Project',
        description: 'Attempts to fetch a project from an InfinityMint project contract',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            let address = script.args.contractDestination.value;
            let artifact = yield (0, web3_1.getContractArtifact)('InfinityMintProject');
            script.log('Fetching project from contract => ' + address);
            let contract = (0, web3_1.getContractFromAbi)(artifact.abi, address);
            let project = yield contract.getProject();
            let decoded = hardhat_1.ethers.utils.toUtf8String(project);
            let json;
            if (decoded.startsWith('http')) {
                let response = yield fetch(decoded);
                json = yield response.json();
            }
            else if (decoded.startsWith('{')) {
                json = JSON.parse(decoded);
            }
            else {
                //assume IPFS link
                let response = yield fetch('https://ipfs.io/ipfs/' + decoded);
                json = yield response.json();
            }
            //save project to projects folder
            let newProject = Object.assign({}, json);
            if (!newProject.version ||
                typeof newProject.version === 'string' ||
                typeof newProject.version === 'number') {
                newProject.version = {
                    version: typeof newProject.version === 'string' ||
                        typeof newProject.version === 'number'
                        ? newProject.version.toString() + '.0.0'
                        : '1.0.0',
                    tag: newProject.tag || 'latest',
                };
            }
            newProject.deployed = true;
            newProject.compiled = true;
            newProject.name =
                newProject.name ||
                    ((_a = newProject === null || newProject === void 0 ? void 0 : newProject.description) === null || _a === void 0 ? void 0 : _a.name) ||
                    newProject.project;
            newProject.network = {
                name: script.infinityConsole.network.name,
                chainId: helpers_1.networks[script.infinityConsole.network.name],
            };
            //upgrade old IM project to new one
            if (newProject.contracts) {
                let contracts = newProject.contracts;
                newProject.deployments = {};
                yield Promise.all(Object.keys(contracts).map((contractName) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    let address = contracts[contractName];
                    try {
                        let artifact = yield hardhat_1.default.artifacts.readArtifact(contractName);
                        newProject.deployments[contractName] = {
                            project: newProject.name,
                            network: newProject.network,
                            address,
                            key: contractName,
                            module: Object.keys(newProject.modules).filter((key) => newProject.modules[key] === contractName)[0],
                            abi: artifact.abi,
                            contractName: contractName,
                            permissions: [],
                            newlyDeployed: false,
                            liveDeployments: [],
                        };
                        newProject.deployments[contractName].liveDeployments = [
                            Object.assign(Object.assign({}, newProject.deployments[contractName]), { liveDeployments: undefined }),
                        ];
                    }
                    catch (error) {
                        (0, helpers_1.warning)('Could not upgrade contract => ' + error);
                        return;
                    }
                })));
                delete newProject.contracts;
            }
            if (newProject.paths && newProject.paths instanceof Array === false)
                newProject.paths = Object.values(newProject.paths);
            if (newProject.assets && newProject.assets instanceof Array === false)
                newProject.assets = Object.values(newProject.assets);
            script.log('calling the new project => ' + newProject.name);
            let deploymentPath = (0, projects_1.getProjectDeploymentPath)(newProject.name, script.infinityConsole.network.name, newProject.version.version);
            if (fs_1.default.existsSync((0, helpers_1.cwd)() + deploymentPath) && !((_b = script.args.force) === null || _b === void 0 ? void 0 : _b.value))
                throw new Error('Project already exists, cannot overwrite ' + deploymentPath);
            script.log('Saving new project to => ' + deploymentPath);
            (0, helpers_1.makeDirectories)((0, helpers_1.cwd)() + deploymentPath);
            fs_1.default.writeFileSync((0, helpers_1.cwd)() + deploymentPath, JSON.stringify(newProject, null, 4));
        }),
        arguments: [
            {
                name: 'contractDestination',
                type: 'string',
                optional: false,
            },
            {
                name: 'force',
                type: 'boolean',
                optional: true,
            },
        ],
    };
    exports.default = fetchDeloyments;
});
//# sourceMappingURL=fetchProject.js.map