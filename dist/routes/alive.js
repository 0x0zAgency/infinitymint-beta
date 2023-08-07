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
    exports.get = exports.post = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("../app/helpers");
    const post = (req, res, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let expressConfig = (0, helpers_1.getExpressConfig)();
        return {
            alive: true,
            production: (0, helpers_1.isEnvTrue)('PRODUCTION'),
            developer: !(0, helpers_1.isEnvTrue)('PRODUCTION'),
            websockets: expressConfig.sockets !== undefined,
            meta: !(0, helpers_1.isEnvTrue)('PRODUCTION') && !expressConfig.disableMeta,
        };
    });
    exports.post = post;
    const get = (req, res, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.post)(req, res, infinityConsole);
    });
    exports.get = get;
});
//# sourceMappingURL=alive.js.map