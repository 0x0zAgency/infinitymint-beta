(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../app/helpers");
    const setNetwork = {
        name: 'Set Current Target Network',
        description: 'Sets the current target network, this is the default network which you will deploy too and read information from',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let session = (0, helpers_1.readGlobalSession)();
            let config = (0, helpers_1.getConfigFile)();
            if (config.hardhat.networks[script.args.network.value] === undefined)
                throw new Error(`bad network: ${script.args.network.value} is not a network defined in infinitymint.config`);
            session.environment.defaultNetwork = script.args.network.value;
            (0, helpers_1.saveGlobalSessionFile)(session);
            script.log('\nCurrent network set to => ' + script.args.network.value);
        }),
        arguments: [
            {
                name: 'network',
                type: 'string',
                optional: false,
            },
        ],
    };
    exports.default = setNetwork;
});
//# sourceMappingURL=setNetwork.js.map