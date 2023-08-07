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
    const InfinityMintApi = {
        //going to give
        module: 'api',
        index: 10,
        deployArgs: ['erc721', 'storage', 'assets', 'values', 'royalty', 'project'],
        solidityFolder: 'alpha',
        requestPermissions: ['erc721', 'storage', 'flags', 'linker'],
    };
    exports.default = InfinityMintApi;
});
//# sourceMappingURL=InfinityMintApi.js.map