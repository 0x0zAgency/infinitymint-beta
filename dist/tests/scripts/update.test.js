(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@app/helpers", "../../core", "chai", "../../app/projects"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("@app/helpers");
    const core_1 = require("../../core");
    const chai_1 = require("chai");
    const projects_1 = require("../../app/projects");
    describe('Update Script Test Casing', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
        it('should check if the default project has been deployed, if it hasnt then deploy it', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            if (!(0, projects_1.getCurrentCompiledProject)())
                yield (0, chai_1.expect)(infinityConsole.executeScript('make', {
                    redeploy: {
                        name: 'redeploy',
                        value: true,
                    },
                    recompile: {
                        name: 'recompile',
                        value: !(0, projects_1.getCurrentCompiledProject)(),
                    },
                    save: {
                        name: 'save',
                        value: true,
                    },
                })).to.not.be.rejectedWith(Error);
        }));
    }));
});
//# sourceMappingURL=update.test.js.map