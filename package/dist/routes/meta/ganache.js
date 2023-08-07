(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/helpers", "../../app/web3"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("../../app/helpers");
    const web3_1 = require("../../app/web3");
    const get = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        let session = (0, helpers_1.readGlobalSession)();
        let config = (0, helpers_1.getConfigFile)();
        let accountLength = ((_b = (_a = config.ganache) === null || _a === void 0 ? void 0 : _a.wallet) === null || _b === void 0 ? void 0 : _b.totalAccounts) || 20;
        let mnemonic = (_c = session === null || session === void 0 ? void 0 : session.environment) === null || _c === void 0 ? void 0 : _c.ganacheMnemonic;
        let keys = (0, web3_1.getPrivateKeys)(mnemonic, accountLength);
        return {
            mnemonic: mnemonic,
            keys: keys,
        };
    });
    exports.get = get;
});
//# sourceMappingURL=ganache.js.map