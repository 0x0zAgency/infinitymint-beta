(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/projects", "fs", "../../app/express", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const projects_1 = require("../../app/projects");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const express_1 = require("../../app/express");
    const path_1 = tslib_1.__importDefault(require("path"));
    const get = (req, res, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let source = req.query.source;
        let version = req.query.version;
        let key = req.query.key;
        if (!source || !version || !key)
            return new express_1.ExpressError('missing parameters');
        //remove special characters
        version = version.replace(/[^0-9.]/g, '');
        let projects = yield (0, projects_1.findProjects)();
        if (projects.length === 0)
            return new express_1.ExpressError('no projects found');
        let project;
        try {
            project = (0, projects_1.findProject)(source);
        }
        catch (error) {
            return new express_1.ExpressError('project not found');
        }
        if (!project)
            return new express_1.ExpressError('current project not deployed');
        if (!(0, projects_1.hasDeployedProject)(project, infinityConsole.network.name, version))
            return new express_1.ExpressError('project not deployed');
        let deployedProject = (0, projects_1.getDeployedProject)(project, infinityConsole.network.name, version);
        let imports = infinityConsole.getImports();
        if (!deployedProject.imports[key])
            return new express_1.ExpressError('import not found in project');
        let importItem = imports.database[deployedProject.imports[key]];
        if (!importItem)
            return new express_1.ExpressError('import not found');
        //get the importItem from the pathLike object and serve it
        if (!fs_1.default.existsSync(importItem.dir + '/' + importItem.base))
            return new express_1.ExpressError('import link not found');
        res.sendFile(path_1.default.resolve(importItem.dir + '/' + importItem.base));
    });
    exports.get = get;
});
//# sourceMappingURL=get.js.map