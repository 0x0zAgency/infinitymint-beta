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
        return {
            success: true,
            server: (0, helpers_1.getInfinityMintVersion)(),
            client: (0, helpers_1.getInfinityMintClientVersion)(),
        };
    });
    exports.get = get;
});
//# sourceMappingURL=version.js.map