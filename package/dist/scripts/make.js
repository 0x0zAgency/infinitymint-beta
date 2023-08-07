(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/projects", "../app/helpers", "fs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const projects_1 = require("../app/projects");
    const helpers_1 = require("../app/helpers");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const path_1 = tslib_1.__importDefault(require("path"));
    const make = {
        name: 'Make',
        description: 'Will compile and deploy your project to the current network and then export it',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (!script.project)
                throw new Error('No project found, please specify a project with the --project flag');
            let version = ((_a = script.args.target) === null || _a === void 0 ? void 0 : _a.value) || '1.0.0';
            let project = script.project.compiledProject || script.project.source;
            let { recompile, redeploy, report, enableMinter, save, dontExport } = (0, helpers_1.getArgumentValues)(script.args);
            if (save === undefined &&
                script.infinityConsole.network.name !== 'hardhat')
                save = true;
            if (recompile && (0, projects_1.hasCompiledProject)(project, version)) {
                let compiledProject = (0, projects_1.getCompiledProject)(project, version);
                script.log(`Removing compiled project => ${(0, projects_1.getFullyQualifiedName)(project, version || ((_b = compiledProject === null || compiledProject === void 0 ? void 0 : compiledProject.version) === null || _b === void 0 ? void 0 : _b.version))}`);
                fs_1.default.unlinkSync((0, helpers_1.cwd)() +
                    '/projects/compiled/' +
                    (0, projects_1.getFullyQualifiedName)(project, version || compiledProject.version.version) +
                    '.json');
            }
            if (!(0, projects_1.hasCompiledProject)(project, version)) {
                script.log(`\n{magenta-fg}{bold}Compiling project => ${(0, projects_1.getFullyQualifiedName)(project, version)}{/}\n`);
                yield script.infinityConsole.executeScript('compileProject', Object.assign({}, script.args));
            }
            else
                script.log(`\n{magenta-fg}{bold}Project ${(0, projects_1.getFullyQualifiedName)(project, version)} has already been compiled, skipping compilation{/}\n`);
            project = (0, projects_1.getCompiledProject)(project, version);
            if (redeploy &&
                (0, projects_1.hasDeployedProject)(project, script.infinityConsole.network.name)) {
                let deployedProject = (0, projects_1.getDeployedProject)(project, script.infinityConsole.network.name, version);
                script.log(`Removing deployed project => ${(0, projects_1.getFullyQualifiedName)(project, version || deployedProject.version.version)}`);
                fs_1.default.unlinkSync((0, helpers_1.cwd)() +
                    '/projects/deployed/' +
                    script.infinityConsole.network.name +
                    '/' +
                    (0, projects_1.getFullyQualifiedName)(project, version || deployedProject.version.version, script.infinityConsole.network.name) +
                    '.json');
            }
            if (!(0, projects_1.hasDeployedProject)(project, script.infinityConsole.network.name, version)) {
                script.log(`\n{magenta-fg}{bold}Deploying project => ${(0, projects_1.getFullyQualifiedName)(project)}{/}\n`);
                yield script.infinityConsole.executeScript('deployProject', Object.assign({}, script.args));
            }
            if (save && !dontExport) {
                script.log(`\n{magenta-fg}{bold}Exporting project => ${(0, projects_1.getFullyQualifiedName)(project, version)}{/}\n`);
                yield script.infinityConsole.executeScript('exportProject', Object.assign({}, script.args));
            }
            else if (!save && script.infinityConsole.network.name === 'hardhat') {
                script.log(''); //newline
                (0, helpers_1.warning)('You are currently on the hardhat network and the save flag is not present. you will need to deploy your project to a testnet or mainnet or set save flag to true');
            }
            if (enableMinter && save) {
                yield script.infinityConsole.executeScript('call', {
                    project: {
                        value: (_d = (_c = script.args) === null || _c === void 0 ? void 0 : _c.project) === null || _d === void 0 ? void 0 : _d.value,
                    },
                    network: {
                        value: (_f = (_e = script.args) === null || _e === void 0 ? void 0 : _e.network) === null || _f === void 0 ? void 0 : _f.value,
                    },
                    version: {
                        value: (_h = (_g = script.args) === null || _g === void 0 ? void 0 : _g.version) === null || _h === void 0 ? void 0 : _h.value,
                    },
                    method: {
                        value: 'setMintsEnabled',
                    },
                    module: {
                        value: 'erc721',
                    },
                    value: {
                        value: true,
                    },
                });
            }
            else
                (0, helpers_1.warning)('please add --save flag if you wish to enable minter');
            script.log(fs_1.default.readFileSync(path_1.default
                .join(__dirname, '../resources/ascended.txt')
                .replace('dist/', ''), {
                encoding: 'utf-8',
            }));
            if (report)
                yield script.infinityConsole.executeScript('report', Object.assign({}, script.args));
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
            {
                name: 'enableMinter',
                type: 'boolean',
                optional: true,
            },
            {
                name: 'recompile',
                type: 'boolean',
                optional: true,
                value: false,
            },
            {
                name: 'dontExport',
                type: 'boolean',
                optional: true,
            },
            {
                name: 'report',
                type: 'boolean',
                optional: true,
                value: false,
            },
            {
                name: 'recompile',
                type: 'boolean',
                optional: true,
                value: false,
            },
            {
                name: 'publicFolder',
                type: 'string',
                optional: true,
                value: 'public',
            },
            {
                name: 'redeploy',
                type: 'boolean',
                optional: true,
                value: false,
            },
            {
                name: 'location',
                type: 'string',
                optional: true,
            },
            {
                name: 'exportScript',
                type: 'string',
                optional: true,
                value: 'default',
            },
            {
                name: 'useBundle',
                type: 'boolean',
                optional: true,
                value: true,
            },
            {
                name: 'useGems',
                type: 'boolean',
                optional: true,
            },
        ],
    };
    exports.default = make;
});
//# sourceMappingURL=make.js.map