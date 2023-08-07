(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Mod_Example = {
        settings: {},
        values: {},
        important: true,
        index: 10, //should be after everything else
    };
    exports.default = Mod_Example;
});
//# sourceMappingURL=Mod_Example.js.map