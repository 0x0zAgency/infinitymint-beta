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
    const SelectiveMinter = {
        //going to give
        module: 'minter',
        index: 7,
        solidityFolder: 'alpha',
        deployArgs: ['values', 'storage', 'assets', 'random'],
        permissions: ['erc721', 'assets'],
    };
    exports.default = SelectiveMinter;
});
//# sourceMappingURL=SelectiveMinter.js.map