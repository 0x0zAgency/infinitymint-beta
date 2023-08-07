(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../app/imports", "path", "../../../app/express"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const imports_1 = require("../../../app/imports");
    const path_1 = tslib_1.__importDefault(require("path"));
    const express_1 = require("../../../app/express");
    const get = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let key = req.query.key;
        let importCache = yield (0, imports_1.getImports)();
        if (!importCache.database[key])
            return new express_1.ExpressError('Import not found: ' + key);
        res.sendFile(path_1.default.resolve(importCache.database[key].dir + '/' + importCache.database[key].base));
    });
    exports.get = get;
});
//# sourceMappingURL=get.js.map