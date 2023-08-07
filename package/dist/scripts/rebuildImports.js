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
    const refreshImports = {
        name: 'Rebuild Imports',
        description: 'Rebuilds your import cache which contains references to all the files you are using through out InfinityMint',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield script.infinityConsole.buildImports(true);
        }),
        arguments: [],
    };
    exports.default = refreshImports;
});
//# sourceMappingURL=rebuildImports.js.map