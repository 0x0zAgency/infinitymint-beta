(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/web3", "hardhat"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const web3_1 = require("../../app/web3");
    const hardhat_1 = require("hardhat");
    const InfinityMintLinker = {
        //going to give
        module: 'linker',
        index: 10,
        deployArgs: ['storage', 'erc721'],
        solidityFolder: 'alpha',
        requestPermissions: ['storage', 'erc721'],
        update: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield params.deployScript.cleanup(params);
            yield params.deployScript.post(params);
            return params.deployment.write();
        }),
        cleanup: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            if (params.deployment.hasDeployed()) {
                let contract = yield params.deployment.write();
                yield (0, web3_1.waitForTx)(yield contract.clearLinks(), 'clear links');
            }
        }),
        post: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let linkerContract = yield params.deployment.write();
            let valuesContract = yield params.deployments.values.write();
            let links = params.project
                .links;
            let linkKeys = Object.keys(links);
            //sort the link keys by index
            linkKeys.sort((a, b) => {
                return links[a].index - links[b].index;
            });
            let values = {};
            for (let i = 0; i < linkKeys.length; i++) {
                let link = links[linkKeys[i]];
                params.log('\n{magenta-fg}Adding InfinityLink{/} => ' + link.key);
                params.log(`\terc721 => ${link.erc721 === true ? 'true' : 'false'}`);
                params.log(`\tverified => ${link.verify === true ? 'true' : 'false'}`);
                params.log(`\tforced only => ${link.forcedOnly === true ? 'true' : 'false'}`);
                params.log(`\tinterface id => ${link.interfaceId || '0x00000000'}`);
                yield (0, web3_1.waitForTx)(yield linkerContract.addSupport(i, link.key, hardhat_1.ethers.utils.toUtf8Bytes(link.key), link.erc721 === true, link.verify === true, link.forcedOnly === true, false), `add support for ${link.key}`);
                values[link.key] = i;
            }
            params.log('\n{cyan-fg}Setting Link Indexes in Values...{/}\n');
            Object.keys(values).forEach((key, index) => params.log(`[${index}] ` +
                'link' +
                key.charAt(0).toUpperCase() +
                key.slice(1) +
                'Index => ' +
                values[key]));
            yield (0, web3_1.waitForTx)(yield valuesContract.setValues(Object.keys(values).map((key) => 'link' +
                key.charAt(0).toUpperCase() +
                key.slice(1) +
                'Index'), Object.values(values).map((value) => value.toString())), 'set link values');
            params.deployment.setDefaultValues(values, true);
        }),
    };
    exports.default = InfinityMintLinker;
});
//# sourceMappingURL=InfinityMintLinker.js.map