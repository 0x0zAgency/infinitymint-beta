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
    const InfinityMintUtil = {
        //going to give
        module: 'utils',
        index: 1,
        solidityFolder: 'alpha',
        library: true,
    };
    exports.default = InfinityMintUtil;
});
//# sourceMappingURL=InfinityMintUtil.js.map