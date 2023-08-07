(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/helpers", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../app/helpers");
    const path_1 = tslib_1.__importDefault(require("path"));
    const setLocation = {
        name: 'Set Export Location',
        description: 'Sets the export location of the current working project',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let locations = (0, helpers_1.readLocations)();
            let location = (_a = script.args.location) === null || _a === void 0 ? void 0 : _a.value;
            if (!location)
                location = (0, helpers_1.cwd)();
            if (location.startsWith('../') || location.startsWith('/../'))
                location = path_1.default.join((0, helpers_1.cwd)(), location);
            //resolve it
            location = path_1.default.resolve(location);
            //remove new lines and tabs
            location = location.replace(/(\r\n|\n|\r|\t)/gm, '');
            location = location.trim();
            locations[script.project.getFullyQualifiedName()] = location;
            (0, helpers_1.saveLocations)();
            script.log(`\n{cyan-fg}{bold}Export location for ${script.project.getFullyQualifiedName()} set to{/} => ${locations[script.project.getFullyQualifiedName()]}\n`);
        }),
        arguments: [
            {
                name: 'location',
                type: 'string',
                optional: true,
            },
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
        ],
    };
    exports.default = setLocation;
});
//# sourceMappingURL=setLocation.js.map