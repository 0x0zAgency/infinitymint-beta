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
    const InfinitMintFlags = {
        //going to give
        module: 'flags',
        index: 10,
        deployArgs: ['storage', 'erc721'],
        solidityFolder: 'alpha',
        requestPermissions: ['storage'],
    };
    exports.default = InfinitMintFlags;
});
//# sourceMappingURL=InfinityMintFlags.js.map