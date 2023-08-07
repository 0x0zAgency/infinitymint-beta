(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/helpers", "../app/web3", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../app/helpers");
    const web3_1 = require("../app/web3");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const deployContract = {
        name: 'DeployContract',
        description: 'Deploy a contract to the current network, the deployment will be saved in the __@any folder in the deployments folder (relative to your network)',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let { contract } = (0, helpers_1.getArgumentValues)(script.args);
            script.log('\n{underline}deploying {yellow-fg}{bold}' + contract + '{/}');
            let deployment = yield (0, web3_1.deployAnonContract)(contract);
            script.log('\n{green-fg}successfully deployed {cyan-fg}{bold}' +
                contract +
                '{/} => ' +
                deployment.address);
            script.log('cleaning up...');
            fs_1.default.unlinkSync('./deployments/' +
                script.infinityConsole.network.name +
                '/' +
                deployment.contractName +
                '.json');
        }),
        arguments: [
            {
                name: 'contractName',
                type: 'string',
                optional: false,
            },
        ],
    };
    exports.default = deployContract;
});
//# sourceMappingURL=deployContract.js.map