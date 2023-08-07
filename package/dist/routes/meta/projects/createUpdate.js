(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../app/projects", "../../../app/express", "../../../app/updates", "../../../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const projects_1 = require("../../../app/projects");
    const express_1 = require("../../../app/express");
    const updates_1 = require("../../../app/updates");
    const helpers_1 = require("../../../app/helpers");
    const get = (req, res, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let source = req.query.source;
        let useCompiled = req.query.useCompiled;
        let network = req.query.network;
        let version = req.query.version;
        let tag = req.query.tag;
        if (!source)
            return new express_1.ExpressError('missing parameters');
        if (!version)
            return new express_1.ExpressError('missing version');
        if (!tag)
            tag = version;
        let project = (0, projects_1.findProject)(source);
        if (!project)
            return new express_1.ExpressError('project not found');
        if (useCompiled)
            project = (0, projects_1.getCompiledProject)(source);
        else if (network)
            project = (0, projects_1.getDeployedProject)(project, network || infinityConsole.network.name);
        if ((0, updates_1.hasUpdate)(project, version, network))
            return new express_1.ExpressError('update already exists for verison ' + version);
        let update = (0, updates_1.createUpdate)(project, version, tag, network, true, (0, helpers_1.isTypescript)());
        return update;
    });
    exports.get = get;
});
//# sourceMappingURL=createUpdate.js.map