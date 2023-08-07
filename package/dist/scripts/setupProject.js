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
    const setupProject = {
        name: 'Setup/Relaunch Project',
        description: 'Will resetup your project, calling clean up methods on all the deployments contained in the project and then reinitializing them on the block chain',
        execute: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
        ],
    };
    exports.default = setupProject;
});
//# sourceMappingURL=setupProject.js.map