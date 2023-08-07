(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const get = (req, res, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let gems = infinityConsole.getGems();
        return {
            gems,
        };
    });
    exports.get = get;
});
//# sourceMappingURL=gems.js.map