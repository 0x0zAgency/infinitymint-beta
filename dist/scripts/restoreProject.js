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
    const restoreProject = {
        name: 'Restore Project',
        description: 'Takes a source project file. Will attempt to fetch the project from a contract location, then unpack its deployments to your deployments folder',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
        ],
    };
    exports.default = restoreProject;
});
//# sourceMappingURL=restoreProject.js.map