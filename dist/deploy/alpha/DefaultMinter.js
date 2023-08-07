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
    const DefaultMinter = {
        //going to give
        unique: true,
        module: 'minter',
        index: 7,
        deployArgs: ['values', 'storage', 'assets', 'random'],
        solidityFolder: 'alpha',
        requestPermissions: ['erc721'],
        permissions: ['all', 'erc721', 'assets'],
    };
    exports.default = DefaultMinter;
});
//# sourceMappingURL=DefaultMinter.js.map