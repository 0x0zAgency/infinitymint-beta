(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "fs", "../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const helpers_1 = require("../app/helpers");
    const version = {
        name: 'Version',
        description: 'Displays the current infinitymint version',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let packageJson = (0, helpers_1.getPackageJson)();
            if (packageJson.name === 'infinitymint')
                script.log(packageJson.version);
            else if (fs_1.default.existsSync((0, helpers_1.cwd)() + '/node_modules/infinitymint/package.json'))
                script.log(JSON.parse(fs_1.default.readFileSync((0, helpers_1.cwd)() + '/node_modules/infinitymint/package.json', {
                    encoding: 'utf-8',
                })).version);
        }),
        arguments: [],
    };
    exports.default = version;
});
//# sourceMappingURL=version.js.map