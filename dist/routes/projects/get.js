(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/projects", "../../app/express"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const projects_1 = require("../../app/projects");
    const express_1 = require("../../app/express");
    const get = (req, res, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let source = req.query.source;
        let version = req.query.version;
        let network = req.query.network || infinityConsole.network.name;
        let type = req.query.type || 'deployed';
        if (!source || !version || !type)
            return new express_1.ExpressError('missing parameters');
        //remove special characters
        version = version.replace(/[^0-9.]/g, '');
        type = type.replace(/[^a-zA-Z0-9]/g, '');
        network = network.replace(/[^a-zA-Z0-9]/g, '');
        let project = (0, projects_1.findProject)(source);
        if (!project)
            return new express_1.ExpressError('current project not deployed');
        if (type === 'deployed' && !(0, projects_1.hasDeployedProject)(project, network, version))
            return new express_1.ExpressError('project not deployed');
        else if (type === 'deployed') {
            return (0, projects_1.getDeployedProject)(project, network, version);
        }
        else if (type === 'compiled' && !(0, projects_1.hasCompiledProject)(project, version)) {
            return new express_1.ExpressError('project not compiled');
        }
        else if (type === 'compiled') {
            return (0, projects_1.getCompiledProject)(project, version);
        }
        else
            return new express_1.ExpressError('unknown project type');
    });
    exports.get = get;
});
//# sourceMappingURL=get.js.map