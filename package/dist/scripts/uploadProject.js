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
    const uploadProject = {
        name: 'Upload',
        description: 'Builds and then uploads to IPFS directory an InfinityMint build ready to be set as a the content record of an ENS',
        execute: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
        arguments: [
            {
                name: 'project',
                optional: true,
            },
        ],
    };
    exports.default = uploadProject;
});
//# sourceMappingURL=uploadProject.js.map