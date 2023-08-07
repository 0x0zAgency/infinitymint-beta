(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/helpers", "fs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../app/helpers");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const path_1 = tslib_1.__importDefault(require("path"));
    const exportProject = {
        name: 'Export',
        description: 'Exports a project to the specified location, will copy over styles, gems and anything else relating to the project',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            let location = (_a = script.args.location) === null || _a === void 0 ? void 0 : _a.value;
            let exportScriptLocation = ((_c = (_b = script.args) === null || _b === void 0 ? void 0 : _b.exportScript) === null || _c === void 0 ? void 0 : _c.value) || 'default';
            if (exportScriptLocation === 'default')
                exportScriptLocation = (0, helpers_1.isInfinityMint)()
                    ? path_1.default.join((0, helpers_1.cwd)(), '/app/export/default')
                    : path_1.default.join((0, helpers_1.cwd)(), '/node_modules/infinitymint/dist/app/export/default');
            if (exportScriptLocation === 'classic')
                exportScriptLocation = (0, helpers_1.isInfinityMint)()
                    ? path_1.default.join((0, helpers_1.cwd)(), '/app/export/classic')
                    : path_1.default.join((0, helpers_1.cwd)(), '/node_modules/infinitymint/dist/app/export/classic');
            let { useBundle, useGems, publicFolder, ignorePublic, requireInClient, setAsDefault, } = (0, helpers_1.getArgumentValues)(script.args);
            //default location
            if (!location) {
                let locations = (0, helpers_1.readLocations)();
                if (locations[script.project.getNameAndVersion()])
                    location = locations[script.project.getNameAndVersion()];
                else
                    location = (0, helpers_1.cwd)();
            }
            script.log(`\n{cyan-fg}{bold}Exporting to => ${location}`);
            let exportScript = require(exportScriptLocation.indexOf((0, helpers_1.cwd)()) === -1
                ? path_1.default.resolve(path_1.default.join('/../', exportScriptLocation))
                : exportScriptLocation);
            exportScript = (exportScript === null || exportScript === void 0 ? void 0 : exportScript.default) || exportScript;
            if (!exportScript.export)
                throw new Error('Export script does not have an export function, please check the script');
            script.log(`{green-fg}Using export script{/} => ${exportScript.name || exportScriptLocation}\n`);
            script.log(`{green-fg}Location{/} => ${exportScriptLocation}\n`);
            yield exportScript.export(Object.assign(Object.assign({}, script), { project: script.project, location,
                exportScript,
                useBundle,
                useGems,
                publicFolder,
                ignorePublic }));
            let deployedProject = script.project.getDeployedProject();
            if (requireInClient || setAsDefault) {
                script.log(`\n{cyan-fg}{bold}Updating client manifest.json{/}\n`);
                (0, helpers_1.makeDirectories)(path_1.default.join(location, publicFolder, '/client'));
                let clientManifest = {};
                let manifestFilePath = path_1.default.join(location, publicFolder, '/client/manifest.json');
                if (fs_1.default.existsSync(manifestFilePath))
                    try {
                        clientManifest = JSON.parse(fs_1.default.readFileSync(manifestFilePath, 'utf8'));
                    }
                    catch (e) {
                        clientManifest = {};
                    }
                if (requireInClient) {
                    script.log(`{green-fg}Adding requirement to client manifest.json{/} => ${script.project.getFullyQualifiedName()}\n`);
                    clientManifest.require = Object.assign(Object.assign({}, clientManifest.require), { [script.project.getFullyQualifiedName()]: {
                            name: deployedProject.name,
                            version: (_d = deployedProject.version) === null || _d === void 0 ? void 0 : _d.version,
                            network: deployedProject.network.name,
                        } });
                }
                if (setAsDefault) {
                    script.log(`{green-fg}Setting project as default for ${script.infinityConsole.network.name} in client manifest{/} => ${script.project.getFullyQualifiedName()}\n`);
                    clientManifest.default = Object.assign(Object.assign({}, clientManifest.default), { [(0, helpers_1.isEnvTrue)('PRODUCTION') ? 'prod' : 'dev']: Object.assign(Object.assign({}, (_e = clientManifest.default) === null || _e === void 0 ? void 0 : _e[(0, helpers_1.isEnvTrue)('PRODUCTION') ? 'prod' : 'dev']), { [script.project.network]: script.project.getFullyQualifiedName() }) });
                }
                fs_1.default.writeFileSync(manifestFilePath, JSON.stringify(clientManifest, null, 4));
            }
            script.log('\n{green-fg}{bold}Export Successful{/}');
            script.log(`\tProject: ${deployedProject.name}`);
            script.log(`\tVersion: ${deployedProject.version.version} (${deployedProject.version.tag})\n` +
                `\tNetwork: ${deployedProject.network.name} (chainId:${deployedProject.network.chainId})`);
            script.log(`\tLocation: ${location}\n`);
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
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
            },
            {
                name: 'useBundle',
                type: 'boolean',
                value: true,
                optional: true,
            },
            {
                name: 'requireInClient',
                type: 'boolean',
                value: true,
                optional: true,
            },
            {
                name: 'setAsDefault',
                type: 'boolean',
                value: false,
                optional: true,
            },
            {
                name: 'useGems',
                type: 'boolean',
                optional: true,
            },
            {
                name: 'publicFolder',
                type: 'string',
                optional: true,
                value: 'public',
            },
            {
                name: 'ignorePublic',
                type: 'boolean',
                optional: true,
            },
        ],
    };
    exports.default = exportProject;
});
//# sourceMappingURL=exportProject.js.map