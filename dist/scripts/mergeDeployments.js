(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/helpers", "../app/projects", "fs", "path", "../app/web3"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../app/helpers");
    const projects_1 = require("../app/projects");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const path_1 = tslib_1.__importDefault(require("path"));
    const web3_1 = require("../app/web3");
    const mergeDeployments = {
        name: 'Merge Deployments',
        description: 'Merges a directory of deployments into a new deployed project.',
        execute: ({ args, project }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let { target, newVersion, network, chainId } = (0, helpers_1.getArgumentValues)(args);
            if (!target || !fs_1.default.existsSync(target))
                throw new Error('bad target');
            if (!project.hasCompiled())
                throw new Error('please compile first');
            let dots = project.version.split('.');
            let version = newVersion
                ? parseInt(dots[0] + 1) + dots.slice(1).join('.')
                : project.version;
            let newProject = Object.assign({}, project.getDeployedProject());
            let deployments = newProject.deployments;
            //read dir
            let files = yield (0, helpers_1.safeGlob)(target);
            files
                .filter((_) => _.endsWith('.json'))
                .map((_) => path_1.default.parse(_))
                .forEach((parsedFile) => {
                var _a, _b;
                let parsedAbi = JSON.parse(fs_1.default.readFileSync(path_1.default.join(parsedFile.dir, parsedFile.base), {
                    encoding: 'utf-8',
                }));
                if (parsedAbi.abi === undefined) {
                    (0, helpers_1.warning)('bad abi in => ' + parsedFile.name);
                    return;
                }
                deployments[parsedFile.name] = Object.assign({}, parsedAbi);
                network =
                    ((_b = (_a = deployments[parsedFile.name]) === null || _a === void 0 ? void 0 : _a.network) === null || _b === void 0 ? void 0 : _b.name) || deployments;
                if (parsedAbi.liveDeployments === undefined)
                    deployments[parsedFile.name].liveDeployments = [
                        Object.assign({}, deployments[parsedFile.name]),
                    ];
                let newPath = (0, web3_1.getDeploymentProjectPath)(project.getDeployedProject());
                newPath = path_1.default.join(newPath, parsedAbi.name);
                (0, helpers_1.log)('Writing Deployment => ' + newPath);
                fs_1.default.writeFileSync(newPath, JSON.stringify(deployments));
            });
            //save the project file
            let newPath = (0, projects_1.getProjectDeploymentPath)(project.getFullyQualifiedName(), project.network, version);
            newProject.network = {
                name: network,
                chainId: chainId,
            };
            newProject.version = {
                tag: newVersion ? 'new merge' : 'initial',
                version: version,
            };
            newProject.deployed = true;
            (0, helpers_1.log)('Writing Project => ' + newPath);
            fs_1.default.writeFileSync(newPath, JSON.stringify(deployments));
            (0, helpers_1.log)('Merged old deployments into project ' +
                (0, projects_1.getFullyQualifiedName)(newProject) +
                '. Created version ' +
                version +
                '. Please remember to export the project');
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
            {
                name: 'target',
                type: 'string',
                optional: false,
            },
            {
                name: 'network',
                type: 'string',
                optional: true,
            },
            {
                name: 'chainId',
                type: 'string',
                optional: true,
            },
            {
                name: 'newVersion',
                type: 'boolean',
                optional: true,
            },
        ],
    };
    exports.default = mergeDeployments;
});
//# sourceMappingURL=mergeDeployments.js.map