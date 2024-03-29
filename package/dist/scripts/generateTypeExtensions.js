(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/types", "fs", "path", "../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const types_1 = require("../app/types");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const path_1 = tslib_1.__importDefault(require("path"));
    const helpers_1 = require("../app/helpers");
    const generateTypeExtensions = {
        name: 'Generate Type Extensions',
        description: 'Generates type extensions for the current InfinityMint',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            if (!(0, helpers_1.isTypescript)())
                throw new Error('You must be using typescript to generate type extensions');
            script.log('\n{magenta-fg}{bold}Generating type extensions for InfinityMint{/} => ' +
                (0, helpers_1.getInfinityMintVersion)());
            (0, helpers_1.makeDirectories)((0, helpers_1.cwd)() + '/infinitymint-types/');
            script.log('\nCreating script types...');
            let scriptTypes = (0, types_1.createScriptTypes)(script.infinityConsole.getScripts());
            script.log('Creating deployment types...');
            fs_1.default.writeFileSync(path_1.default.join((0, helpers_1.cwd)(), '/infinitymint-types/scripts.ts'), scriptTypes);
            let deploymentTypes = yield (0, types_1.createDeploymentsTypes)();
            fs_1.default.writeFileSync(path_1.default.join((0, helpers_1.cwd)(), '/infinitymint-types/deployments.ts'), deploymentTypes);
            script.log('Creating index...');
            //make index
            let index = `//this file is auto-generated by the InfinityMint CLI
//do not modify this file directly

export * from './scripts';
export * from './deployments';
`;
            fs_1.default.writeFileSync(path_1.default.join((0, helpers_1.cwd)(), '/infinitymint-types/index.ts'), index);
            script.log('\n{green-fg}{bold}Done!{/}');
            script.log('{gray-fg}If you ran this inside of the console you might need to restart the console for changes to be noticable!{/}\n');
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
        ],
    };
    exports.default = generateTypeExtensions;
});
//# sourceMappingURL=generateTypeExtensions.js.map