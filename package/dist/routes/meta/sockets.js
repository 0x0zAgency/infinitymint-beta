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
        let express = (0, helpers_1.getExpressConfig)();
        return {
            online: infinityConsole.hasWebSockets(),
            config: (express === null || express === void 0 ? void 0 : express.sockets) || {},
        };
    });
    exports.get = get;
});
//# sourceMappingURL=sockets.js.map