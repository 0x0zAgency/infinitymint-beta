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
    describe('Load Infinitymint Testing Environment', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
        it('should have loaded InfinityMint', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(infinityConsole).to.not.be.undefined;
        }));
        it('should have loaded the current network and it should equal hardhat', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(infinityConsole.network).to.not.be.undefined;
            (0, chai_1.expect)(infinityConsole.network.name).to.equal('hardhat');
        }));
        it('should have a current project, if it does not it should error', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let currentProject = yield infinityConsole.getCurrentProject();
            if (!currentProject)
                (0, chai_1.expect)(currentProject).to.be.null;
            (0, chai_1.expect)(currentProject).to.not.be.undefined;
        }));
        it('should have loaded some scripts', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(infinityConsole.getScripts().length).to.be.greaterThan(0);
        }));
        it('should have loaded some projects', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(infinityConsole.getProjects()).to.not.be.undefined;
            (0, chai_1.expect)(infinityConsole.getProjects().projects.length).to.be.greaterThan(0);
        }));
    }));
});
//# sourceMappingURL=load.test.js.map