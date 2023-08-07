(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/express", "../../app/projects"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const express_1 = require("../../app/express");
    const projects_1 = require("../../app/projects");
    const get = (req, res, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let source = req.query.source;
        let version = req.query.version;
        let network = req.query.network || infinityConsole.network.name;
        let contractName = req.query.contractName;
        if (!source || !version || !contractName)
            return new express_1.ExpressError('missing parameters');
        //remove special characters
        version = version.replace(/[^0-9.]/g, '');
        network = network.replace(/[^a-zA-Z0-9]/g, '');
        contractName = contractName.replace(/[^a-zA-Z0-9]/g, '');
        let projects = yield (0, projects_1.findProjects)();
        if (projects.length === 0)
            return new express_1.ExpressError('no projects found');
        let project = (0, projects_1.findProject)(source);
        if (!project)
            return new express_1.ExpressError('project not found');
        if (!(0, projects_1.hasDeployedProject)(project, network, version))
            return new express_1.ExpressError('project not deployed');
        let deployedProject = (0, projects_1.getDeployedProject)(project, network, version);
        if (!deployedProject.deployments[contractName])
            return new express_1.ExpressError('contract not deployed');
        return deployedProject.deployments[contractName];
    });
    exports.get = get;
});
//# sourceMappingURL=get.js.map