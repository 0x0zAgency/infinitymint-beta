(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "fs", "../../../app/projects", "../../../app/express"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.post = void 0;
    const tslib_1 = require("tslib");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const projects_1 = require("../../../app/projects");
    const express_1 = require("../../../app/express");
    const post = (req, res, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let source = (_a = req.body) === null || _a === void 0 ? void 0 : _a.source;
        let blob = (_b = req.body) === null || _b === void 0 ? void 0 : _b.blob;
        if (!source)
            return new express_1.ExpressError('missing parameters');
        let project = (0, projects_1.findProject)(source);
        if (!project)
            return new express_1.ExpressError('project not found');
        let path = infinityConsole.getProjectPath(project);
        if (!fs_1.default.existsSync(path.dir + '/' + path.base))
            return new express_1.ExpressError('project source file not found');
        fs_1.default.writeFileSync(path.dir + '/' + path.base, blob);
        return { success: true };
    });
    exports.post = post;
});
//# sourceMappingURL=save.js.map