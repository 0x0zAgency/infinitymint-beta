(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/helpers", "../../core", "chai"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../../app/helpers");
    const core_1 = require("../../core");
    const chai_1 = require("chai");
    describe('Set Network Script Test Casing', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let infinityConsole;
        before(() => {
            return new Promise((resolve) => {
                (0, core_1.load)({
                    test: true,
                    onlyCurrentNetworkEvents: true,
                    startExpress: false,
                    startGanache: false,
                    startWebSocket: false,
                    network: 'hardhat',
                })
                    .then((console) => {
                    infinityConsole = console;
                    resolve(console);
                })
                    .catch((e) => {
                    (0, helpers_1.warning)('Could not load Infinitymint testing environment. Please check your configuration.\nIf you are running this test in a CI environment, please make sure you have the correct configuration.');
                    (0, helpers_1.warning)(e.stack);
                });
            });
        });
        it('Sets the current network to hardhat', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield infinityConsole.executeScript('setNetwork', {
                network: {
                    name: 'hardhat',
                    value: 'hardhat',
                },
            });
            let session = (0, helpers_1.readGlobalSession)();
            chai_1.assert.equal(session.environment.defaultNetwork, 'hardhat');
        }));
        // TODO: Your test casing here.
    }));
});
//# sourceMappingURL=setNetwork.test.js.map