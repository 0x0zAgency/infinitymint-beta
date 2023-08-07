(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/projects", "../../core", "chai", "@app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const projects_1 = require("../../app/projects");
    const core_1 = require("../../core");
    const chai_1 = require("chai");
    const helpers_1 = require("@app/helpers");
    describe('Mint Script Test Casing', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
            if (!(0, projects_1.getCurrentDeployedProject)())
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
        it('should check if mints are enabled, if they arent enable them', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let project = yield infinityConsole.getCurrentProject();
            let erc721 = yield project.erc721();
            if (!(yield erc721.mintsEnabled()))
                yield (0, chai_1.expect)(erc721.setMintsEnabled(true)).to.not.be.rejectedWith(Error);
            (0, chai_1.expect)(yield erc721.mintsEnabled()).to.be.true;
        }));
        it('should mint a token, currentTokenId should be zero or greater, names should not be zero, pathID should be 0 or greater, assets should exist, owner should not be undefined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let project = yield infinityConsole.getCurrentProject();
            let result = yield project.mint();
            (0, chai_1.expect)(result.tokenId).to.be.greaterThanOrEqual(0);
            (0, chai_1.expect)(result.getNames().length).to.be.greaterThanOrEqual(0);
            (0, chai_1.expect)(result.pathId).to.be.greaterThanOrEqual(0);
            (0, chai_1.expect)(result.getAssets().length).to.be.greaterThanOrEqual(0);
            (0, chai_1.expect)(result.owner).to.not.be.undefined;
        }));
    }));
});
//# sourceMappingURL=mint.test.js.map