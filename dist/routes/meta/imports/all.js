(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../app/imports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const imports_1 = require("../../../app/imports");
    const get = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let page = parseInt(req.query.page) || 1;
        let search = req.query.search;
        if ((search === null || search === void 0 ? void 0 : search.length) < 2)
            search = null;
        let importCache = yield (0, imports_1.getImports)();
        let keys = Object.keys(importCache.database);
        if (search && search.length > 0) {
            keys = keys.filter((key) => key.includes(search) ||
                importCache.database[key].name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                importCache.database[key].base
                    .toLowerCase()
                    .includes(search.toLowerCase()));
        }
        let imports = keys.slice((page - 1) * 100, page * 100);
        let newImports = {};
        imports.forEach((key) => (newImports[key] = importCache.database[key]));
        return {
            imports: newImports,
            page,
            count: keys.length,
            pages: Math.ceil(keys.length / 100),
        };
    });
    exports.get = get;
});
//# sourceMappingURL=all.js.map