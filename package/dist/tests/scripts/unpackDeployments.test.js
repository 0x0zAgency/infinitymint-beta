(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("../../core");
    describe('Unpack Deployments', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let infinityConsole;
        before(() => {
            return new Promise((resolve) => {
                (0, core_1.load)({
                    test: true,
                    onlyCurrentNetworkEvents: true,
                    scriptMode: true,
                    startExpress: false,
                    startGanache: false,
                    startWebSocket: false,
                    network: 'hardhat',
                }).then((console) => {
                    infinityConsole = console;
                    resolve(console);
                });
            });
        });
        it('Does not ');
    }));
});
//# sourceMappingURL=unpackDeployments.test.js.map