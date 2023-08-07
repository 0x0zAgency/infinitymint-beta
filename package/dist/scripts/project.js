(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../app/helpers");
    const setNetwork = {
        name: 'Project',
        description: 'Displays the current working project',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let session = (0, helpers_1.readGlobalSession)();
            script.log(session.environment.defaultProject);
        }),
        arguments: [],
    };
    exports.default = setNetwork;
});
//# sourceMappingURL=project.js.map