(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("../../app/helpers");
    const get = (req, res, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        let network = infinityConsole.network;
        delete network.provider;
        delete network.config.accounts;
        let config = (0, helpers_1.getConfigFile)();
        //do network settings stuff
        if ((_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.networks) {
            //check if to expose RPC url
            if (!((_d = (_c = (_b = config === null || config === void 0 ? void 0 : config.settings) === null || _b === void 0 ? void 0 : _b.networks) === null || _c === void 0 ? void 0 : _c[network.name]) === null || _d === void 0 ? void 0 : _d.exposeRpc)) {
                network.config.url = undefined;
            }
        }
        return {
            name: network.name,
            chainId: infinityConsole.getCurrentChainId(),
            rpc: network.config.url,
            networkAccess: infinityConsole.hasNetworkAccess(),
            accounts: infinityConsole.hasNetworkAccess()
                ? infinityConsole.getSigners().map((signer) => signer.address)
                : [],
            config: (0, helpers_1.makeJsonSafe)(network.config),
        };
    });
    exports.get = get;
});
//# sourceMappingURL=network.js.map