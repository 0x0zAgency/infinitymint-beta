(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/updates", "../app/web3", "../app/helpers", "fs", "../app/projects", "jszip", "../app/imports", "../app/ipfs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const updates_1 = require("../app/updates");
    const web3_1 = require("../app/web3");
    const helpers_1 = require("../app/helpers");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const projects_1 = require("../app/projects");
    const jszip_1 = tslib_1.__importDefault(require("jszip"));
    const imports_1 = require("../app/imports");
    const ipfs_1 = require("../app/ipfs");
    const updateProject = {
        name: 'Update',
        description: 'Updates a project by reading any changes which have occured and then setting them on chain',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            yield script.infinityConsole.loadUpdates();
            let newVersion = script.args.newVersion.value;
            let currentVersion = ((_b = (_a = script.project.deployedProject) === null || _a === void 0 ? void 0 : _a.version) === null || _b === void 0 ? void 0 : _b.version) ||
                ((_d = (_c = script.project.compiledProject) === null || _c === void 0 ? void 0 : _c.version) === null || _d === void 0 ? void 0 : _d.version) ||
                '1.0.0';
            let { useCompiled, save, uploadBundle } = (0, helpers_1.getArgumentValues)(script.args);
            if (newVersion === currentVersion)
                throw new Error(`Project is already at version ${newVersion}`);
            //check that currentVersion is not greater than newVersion
            let currentVersionDots = currentVersion.split('.');
            let newVersionDots = newVersion.split('.');
            for (let i = 0; i < currentVersionDots.length; i++) {
                if (parseInt(currentVersionDots[i]) > parseInt(newVersionDots[i]))
                    throw new Error(`Current version ${currentVersion} is greater than new version ${newVersion}`);
            }
            let project = (0, projects_1.createTemporaryProject)(script, useCompiled ||
                !(0, projects_1.hasDeployedProject)(script.project.compiledProject, script.infinityConsole.network.name)
                ? 'compiled'
                : 'deployed', null, null, newVersion);
            let update = yield (0, updates_1.getUpdate)(script.project.deployedProject || script.project.compiledProject, newVersion);
            if (!update)
                throw new Error(`Update ${newVersion} not read correctly. Could be the update file does not export anything or you need to restart IM`);
            update.oldVersion = {
                version: currentVersion,
                tag: (_f = (_e = script.project.deployedProject) === null || _e === void 0 ? void 0 : _e.version) === null || _f === void 0 ? void 0 : _f.tag,
            };
            if (useCompiled &&
                (0, projects_1.hasCompiledProject)(script.project.compiledProject, (_g = update.version) === null || _g === void 0 ? void 0 : _g.version))
                throw new Error(`Compiled project for update ${(_h = update.version) === null || _h === void 0 ? void 0 : _h.version} already exists`);
            if (!useCompiled &&
                (0, projects_1.hasDeployedProject)(script.project.compiledProject, script.project.network || script.infinityConsole.network.name, (_j = update.version) === null || _j === void 0 ? void 0 : _j.version))
                throw new Error(`Deployed project for update ${(_k = update.version) === null || _k === void 0 ? void 0 : _k.version} already exists`);
            yield (0, web3_1.prepare)(project, script, useCompiled ? 'compiled' : 'deployed');
            let updateAction = yield (0, web3_1.action)('update_' + ((_l = update.version) === null || _l === void 0 ? void 0 : _l.version), () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                var _s;
                project = yield (0, updates_1.applyUpdate)(update, project, script.infinityConsole, script.log);
                project.updates = project.updates || {};
                project.updates[((_s = update.version) === null || _s === void 0 ? void 0 : _s.version) || '2.0.0'] = update;
            }));
            if (updateAction !== true)
                throw updateAction;
            project.version = update.version;
            let buildImports = yield (0, web3_1.action)('buildImports_' + ((_m = project.version) === null || _m === void 0 ? void 0 : _m.version), () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                var _t;
                let imports = project.imports || {};
                let keys = Object.keys(imports);
                let importCache = yield (0, imports_1.getImports)();
                if (keys.length === 0)
                    throw new Error('project has no imports this is weird!');
                //this is where we need to go over every file reference in the project and include all of them
                let files = {};
                Object.keys(imports).forEach((key) => {
                    if (!files[imports[key]])
                        files[imports[key]] = imports[key];
                });
                script.log(`\n{cyan-fg}{bold}Packing ${Object.keys(files).length} imports...{/}`);
                project.bundles = {
                    version: (0, helpers_1.getInfinityMintVersion)(),
                    imports: {},
                };
                let rawBundle = {};
                //pack all the files
                yield Promise.all(Object.keys(files).map((file) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    let path = importCache.database[importCache.keys[file]];
                    let location = (path.dir + '/' + path.base).split('imports')[1];
                    if (path === undefined || path.dir === undefined)
                        return;
                    project.bundles.imports[importCache.keys[file]] = path;
                    rawBundle[location] = yield fs_1.default.promises.readFile(path.dir + '/' + path.base);
                    project.bundles.imports[importCache.keys[file]].bundle =
                        location;
                    script.log(`\t{cyan-fg}Read => ${location}{/}`);
                })));
                //build a zip file out of each member of the raw bundle
                let zip = new jszip_1.default();
                Object.keys(rawBundle).forEach((key) => {
                    script.log(`\t\t{green-fg}Zipping => ${key}{/}`);
                    zip.file(key, rawBundle[key]);
                });
                let projectFile = (0, projects_1.getProjectName)(project, (_t = project.version) === null || _t === void 0 ? void 0 : _t.version);
                script.log(`\t\t{green-fg}Zipping => ${projectFile}.json{/}`);
                zip.file(projectFile + '.json', JSON.stringify(project));
                let source = project.source.dir + '/' + project.source.base;
                script.log(`\t\t{green-fg}Zipping => ${project.name + project.source.ext}{/}`);
                zip.file(project.name + project.source.ext, fs_1.default.readFileSync(source));
                let zipBuffer = yield zip.generateAsync({ type: 'nodebuffer' });
                script.log(`\t{cyan-fg}Saving Bundle...{/}`);
                if (!fs_1.default.existsSync((0, helpers_1.cwd)() + '/projects/bundles/'))
                    fs_1.default.mkdirSync((0, helpers_1.cwd)() + '/projects/bundles/');
                yield fs_1.default.promises.writeFile(`${(0, helpers_1.cwd)()}/projects/bundles/${(0, projects_1.getFullyQualifiedName)(project)}.bundle`, zipBuffer);
                let zippedSize = zipBuffer.length / 1024;
                script.log('{green-fg}Bundle Wrote Successfully{/}');
                script.log(`\t{cyan-fg}Bundle Size  => ${(zippedSize / 1024).toFixed(2)}mb {/}`);
            }));
            if (buildImports !== true)
                throw buildImports;
            if (uploadBundle && (0, ipfs_1.isAllowingIPFS)()) {
                let upload = yield (0, web3_1.action)('uploadBundle_' + ((_o = project.version) === null || _o === void 0 ? void 0 : _o.version), () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    let bundle = yield fs_1.default.promises.readFile(`${(0, helpers_1.cwd)()}/projects/bundles/${(0, projects_1.getFullyQualifiedName)(project)}.bundle`);
                    let bundleHash = yield script.infinityConsole.IPFS.add(bundle, 'index.zip');
                    let session = (0, helpers_1.readGlobalSession)();
                    script.log(`\n{cyan-fg}{bold}Uploaded Bundle to IPFS => ${bundleHash}{/}`);
                    session.environment.bundles =
                        session.environment.bundles || {};
                    session.environment.bundles[(0, projects_1.getFullyQualifiedName)(project)] = {
                        hash: bundleHash,
                        size: bundle.length,
                    };
                    project.meta.bundle = bundleHash;
                }));
                if (upload !== true)
                    throw upload;
            }
            if (save && useCompiled)
                fs_1.default.writeFileSync((0, helpers_1.cwd)() +
                    '/projects/compiled/' +
                    project.name +
                    '@' +
                    ((_p = project.version) === null || _p === void 0 ? void 0 : _p.version) +
                    '.json', JSON.stringify(project));
            else if (save)
                fs_1.default.writeFileSync((0, helpers_1.cwd)() +
                    '/projects/deployed/' +
                    ((_q = project.network) === null || _q === void 0 ? void 0 : _q.name) +
                    '/' +
                    (0, projects_1.getFullyQualifiedName)(project) +
                    '.json', JSON.stringify(project));
            if (useCompiled)
                (0, projects_1.removeTempCompliledProject)(project);
            else
                (0, projects_1.removeTempDeployedProject)(project);
            yield script.infinityConsole.loadProjects();
            script.log('\n{green-fg}{bold}Update successfully Applied{/}');
            script.log(`\tProject: ${update.name}`);
            script.log(`\tUpdated From => (${script.project.version}) to (${(_r = update.version) === null || _r === void 0 ? void 0 : _r.version})`);
            script.log(`\tVersion: ${update.version.version} (${update.version.tag})\n` +
                (update.network
                    ? `\tNetwork: ${update.network.name} (chainId:${update.network.chainId})`
                    : '\tNetwork: global (all networks)'));
            if (!save)
                script.log('\n{yellow-fg}{bold}Note: Project update was not saved to disk{/}');
        }),
        arguments: [
            {
                name: 'project',
                optional: true,
            },
            {
                name: 'save',
                type: 'boolean',
                optional: true,
                value: true,
            },
            {
                name: 'uploadBundle',
                type: 'boolean',
                optional: true,
                value: true,
            },
            {
                name: 'newVersion',
                type: 'string',
                optional: false,
            },
            {
                name: 'useCompiled',
                type: 'boolean',
                optional: true,
            },
        ],
    };
    exports.default = updateProject;
});
//# sourceMappingURL=updateProject.js.map