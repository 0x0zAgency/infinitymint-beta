(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "fs", "../app/helpers", "../app/web3"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const helpers_1 = require("../app/helpers");
    const web3_1 = require("../app/web3");
    const unpackDeployments = {
        name: 'Unpack Deployments',
        description: 'Attempts to unpack all deployments in the project to a folder',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!script.project.hasDeployed())
                throw new Error('Project ' +
                    script.project.getFullyQualifiedName() +
                    ' has not been deployed to ' +
                    script.infinityConsole.network.name);
            let destination = ((_a = script.args.destination) === null || _a === void 0 ? void 0 : _a.value) ||
                (0, web3_1.getDeploymentProjectPath)(script.project.getDeployedProject());
            (0, helpers_1.makeDirectories)(destination);
            Object.keys(script.project.getDeployedProject().deployments).forEach((contractName) => {
                let contract = script.project.getDeployedProject().deployments[contractName];
                if (fs_1.default.existsSync(destination + contractName + '.json'))
                    throw new Error('Contract ' +
                        contractName +
                        ' already exists in ' +
                        destination);
                script.log('Unpacking ' +
                    contractName +
                    ' to => ' +
                    destination +
                    contractName +
                    '.json');
                fs_1.default.writeFileSync(destination + contractName + '.json', JSON.stringify(contract, null, 4));
            });
            script.log('Unpacked all deployments to => ' + destination);
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
            {
                name: 'destination',
                type: 'string',
                optional: true,
            },
            {
                name: 'network',
                type: 'string',
                optional: true,
            },
            {
                name: 'target',
                type: 'string',
                optional: true,
            },
        ],
    };
    exports.default = unpackDeployments;
});
//# sourceMappingURL=unpackDeployments.js.map