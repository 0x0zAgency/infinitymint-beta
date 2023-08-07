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
    const tslib_1 = require("tslib");
    const Example = {
        name: 'Example',
        init: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
    };
});
//# sourceMappingURL=infinitymint.gem.js.map