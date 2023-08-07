(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../app/projects"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const projects_1 = require("../../../app/projects");
    const get = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return (0, projects_1.getProjectCache)();
    });
    exports.get = get;
});
//# sourceMappingURL=all.js.map