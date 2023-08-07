(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/projects", "../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const projects_1 = require("../app/projects");
    const helpers_1 = require("../app/helpers");
    const setProject = {
        name: 'Set Current Project',
        description: 'Sets the current working project',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let session = (0, helpers_1.readGlobalSession)();
            let project = (0, projects_1.getProjectSource)(script.args.project.value);
            session.environment.project = project;
            session.environment.defaultProject = script.args.project.value;
            (0, helpers_1.saveGlobalSessionFile)(session);
            script.log('\nCurrent project set to => ' + script.args.project.value);
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: false,
            },
        ],
    };
    exports.default = setProject;
});
//# sourceMappingURL=setProject.js.map