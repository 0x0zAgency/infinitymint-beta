(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@app/helpers", "../../core", "chai"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("@app/helpers");
    const core_1 = require("../../core");
    const chai_1 = require("chai");
    describe('Make Script Test Casing', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        //boilerplate
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
        //boilerplate
        it('should throw at trying to make an invalid project', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(infinityConsole.executeScript('make', {
                project: {
                    name: 'project',
                    value: 'amogus_amogus_amogus_amogus',
                },
            })).to.be.rejectedWith(Error);
        }));
        it('should make the current project successfully with out needing a project flag, should redeploy and recompile. Should not export since we are on ganche.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(infinityConsole.executeScript('make', {
                redeploy: {
                    name: 'redeploy',
                    value: true,
                },
                recompile: {
                    name: 'recompile',
                    value: true,
                },
                save: {
                    name: 'save',
                    value: true,
                },
            })).to.not.be.rejectedWith(Error);
        }));
    }));
});
//# sourceMappingURL=make.test.js.map