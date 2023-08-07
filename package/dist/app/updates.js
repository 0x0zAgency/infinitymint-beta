(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./helpers", "./imports", "path", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyUpdate = exports.updateProcedures = exports.createProjectProcedure = exports.createProjectContent = exports.updateProjectProcedure = exports.updateProjectContent = exports.findUpdates = exports.createUpdate = exports.getUpdate = exports.hasUpdate = exports.removeUpdate = exports.rebuildUpdateCache = exports.loadUpdates = exports.readUpdateCache = exports.writeUpdateCache = exports.formatCacheEntry = exports.getProjectVersions = exports.createTemporaryUpdate = exports.saveTemporaryUpdate = exports.getTemporaryUpdates = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("./helpers");
    const imports_1 = require("./imports");
    const path_1 = tslib_1.__importDefault(require("path"));
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const UpdateCache = {
        database: {},
        keys: {},
        updates: [],
        projects: {},
    };
    /**
     *
     * @param project
     * @returns
     */
    const getTemporaryUpdates = (project) => {
        var _a;
        let session = (0, helpers_1.readGlobalSession)();
        return ((_a = session === null || session === void 0 ? void 0 : session.environment) === null || _a === void 0 ? void 0 : _a.updates[project.name]) || {};
    };
    exports.getTemporaryUpdates = getTemporaryUpdates;
    /**
     *
     * @param project
     * @param update
     */
    const saveTemporaryUpdate = (project, update) => {
        let session = (0, helpers_1.readGlobalSession)();
        session.environment.updates = session.environment.updates || {};
        session.environment.updates[project.name] =
            session.environment.updates[project.name] || {};
        session.environment.updates[project.name][update.version.version] = update;
        (0, helpers_1.saveGlobalSessionFile)(session);
    };
    exports.saveTemporaryUpdate = saveTemporaryUpdate;
    /**
     * Creates an update
     * @param project
     * @param version
     * @returns
     */
    const createTemporaryUpdate = (project, version, data = {}) => {
        var _a, _b;
        version =
            version ||
                ((_a = data === null || data === void 0 ? void 0 : data.version) === null || _a === void 0 ? void 0 : _a.version) ||
                parseInt(project.version.version.split('.')[0] || '1') + 1 + '.0.0';
        let update = Object.assign(Object.assign({}, data), { name: project.name, version: {
                version,
                tag: ((_b = data === null || data === void 0 ? void 0 : data.version) === null || _b === void 0 ? void 0 : _b.tag) || version,
            } });
        (0, exports.saveTemporaryUpdate)(project, update);
        return update;
    };
    exports.createTemporaryUpdate = createTemporaryUpdate;
    const getProjectVersions = (projectOrName) => {
        let project = typeof projectOrName === 'string' ? projectOrName : projectOrName.name;
        return UpdateCache.projects[project];
    };
    exports.getProjectVersions = getProjectVersions;
    const formatCacheEntry = (update, newPath, name) => {
        var _a, _b;
        name =
            name ||
                (update.name || newPath.name) + '@' + newPath.dir + '/' + newPath.base;
        let newKeys = {};
        let root = newPath.dir.split('projects');
        if (root.length > 2)
            root.slice(1).join('projects');
        else
            root = root[1];
        let nss = root[0] === '/' ? root.substring(1) : root;
        let projectName = update.name || ((_a = update === null || update === void 0 ? void 0 : update.description) === null || _a === void 0 ? void 0 : _a.name) || newPath.name;
        let network = ((_b = update.network) === null || _b === void 0 ? void 0 : _b.name) || projectName.split('_')[1];
        newKeys[path_1.default.join(newPath.dir, newPath.base)] = name;
        newKeys[path_1.default.join(newPath.dir, newPath.name)] = name;
        newKeys[path_1.default.join('/', newPath.name)] = name;
        newKeys[path_1.default.join('/', newPath.base)] = name;
        newKeys[path_1.default.join('/projects/', newPath.name)] = name;
        newKeys[path_1.default.join('projects/', newPath.name)] = name;
        newKeys[path_1.default.join('/projects/', newPath.base)] = name;
        newKeys[path_1.default.join('projects/', newPath.base)] = name;
        newKeys[path_1.default.join((0, helpers_1.cwd)(), newPath.name)] = name;
        newKeys[path_1.default.join((0, helpers_1.cwd)(), newPath.base)] = name;
        newKeys[path_1.default.join((0, helpers_1.cwd)(), '/projects/' + newPath.name)] = name;
        newKeys[path_1.default.join((0, helpers_1.cwd)(), '/projects/' + newPath.base)] = name;
        newKeys[path_1.default.join(root, newPath.name)] = name;
        newKeys[path_1.default.join(root, newPath.base)] = name;
        newKeys[path_1.default.join(nss, newPath.name)] = name;
        newKeys[path_1.default.join(nss, newPath.base)] = name;
        newKeys[newPath.name] = name;
        name;
        newKeys[newPath.name + '@source'] = name;
        newKeys[newPath.base] = name;
        newKeys[projectName + (network ? `_${network}` : '')] = name;
        newKeys[projectName + '@source'] = name;
        newKeys[projectName + newPath.ext] = name;
        Object.keys(newKeys).forEach((key) => {
            newKeys['C:' + (0, helpers_1.replaceSeperators)(key, true)] = newKeys[key];
        });
        return newKeys;
    };
    exports.formatCacheEntry = formatCacheEntry;
    const writeUpdateCache = (cache) => {
        fs_1.default.writeFileSync((0, helpers_1.cwd)() + '/temp/update_cache.json', JSON.stringify(cache));
    };
    exports.writeUpdateCache = writeUpdateCache;
    const readUpdateCache = () => {
        if (fs_1.default.existsSync((0, helpers_1.cwd)() + '/temp/update_cache.json')) {
            let cache = JSON.parse(fs_1.default.readFileSync((0, helpers_1.cwd)() + '/temp/update_cache.json', 'utf-8'));
            UpdateCache.database = cache.database;
            UpdateCache.keys = cache.keys;
            UpdateCache.updates = cache.updates;
            UpdateCache.projects = cache.projects;
        }
    };
    exports.readUpdateCache = readUpdateCache;
    const loadUpdates = (roots = [], useFresh = false) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (!useFresh && fs_1.default.existsSync((0, helpers_1.cwd)() + '/temp/update_cache.json')) {
            (0, exports.readUpdateCache)();
            return UpdateCache;
        }
        yield (0, exports.rebuildUpdateCache)(roots);
        (0, exports.writeUpdateCache)(UpdateCache);
        return UpdateCache;
    });
    exports.loadUpdates = loadUpdates;
    const rebuildUpdateCache = (roots = []) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let updates = yield (0, exports.findUpdates)(roots);
        let updateCache = {
            database: {},
            keys: {},
            updates: [],
            projects: {},
        };
        yield Promise.all(updates.map((update) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a;
            var _b, _c;
            let updateFile = (yield (_a = update.dir + '/' + update.base, __syncRequire ? Promise.resolve().then(() => tslib_1.__importStar(require(_a))) : new Promise((resolve_1, reject_1) => { require([_a], resolve_1, reject_1); }).then(tslib_1.__importStar)));
            updateFile = updateFile.default || updateFile;
            let network = ((_b = updateFile === null || updateFile === void 0 ? void 0 : updateFile.network) === null || _b === void 0 ? void 0 : _b.name) || update.name.split('_')[1];
            let projectName = updateFile.name || update.name.split('@')[0];
            projectName = projectName.split('_')[0];
            let updateVersion = ((_c = updateFile === null || updateFile === void 0 ? void 0 : updateFile.version) === null || _c === void 0 ? void 0 : _c.version) || update.name.split('@')[1];
            updateVersion = updateVersion.split('_')[0];
            let name = projectName +
                '@' +
                updateVersion +
                update.dir +
                '/' +
                update.base;
            if (!updateVersion) {
                (0, helpers_1.warning)(`Could not find version for ${update.name}`);
                return;
            }
            if (!updateFile.name)
                updateFile.name = projectName;
            let keys = (0, exports.formatCacheEntry)(updateFile, update, name);
            updateCache.database[name] = update;
            updateCache.keys = Object.assign(Object.assign({}, updateCache.keys), keys);
            updateCache.updates.push(projectName +
                (network ? `_${network}` : '') +
                '@' +
                updateVersion);
            updateCache.projects[projectName + (network ? `_${network}` : '')] =
                updateCache.projects[projectName + (network ? `_${network}` : '')] || [];
            updateCache.projects[projectName + (network ? `_${network}` : '')].push(updateVersion);
        })));
        UpdateCache.database = updateCache.database;
        UpdateCache.keys = updateCache.keys;
        UpdateCache.updates = updateCache.updates;
        UpdateCache.projects = updateCache.projects;
        //order updateCache.projects by version, so the latest version is first
        Object.keys(UpdateCache.projects).forEach((project) => {
            UpdateCache.projects[project] = UpdateCache.projects[project].sort((a, b) => {
                let aVersion = a.split('.').map((v) => parseInt(v));
                let bVersion = b.split('.').map((v) => parseInt(v));
                for (let i = 0; i < aVersion.length; i++) {
                    if (aVersion[i] > bVersion[i])
                        return -1;
                    if (aVersion[i] < bVersion[i])
                        return 1;
                }
                return 0;
            });
        });
        return UpdateCache;
    });
    exports.rebuildUpdateCache = rebuildUpdateCache;
    /**
     *
     * @param updateOrVersion
     * @returns
     */
    const removeUpdate = (updateOrVersion) => {
        let update;
        if (typeof updateOrVersion === 'string') {
            update = UpdateCache.database[updateOrVersion];
        }
        else {
            update = updateOrVersion;
        }
        if (!update)
            return;
        let projectName = update.name || update.name;
        let version = update.version.version;
        let name = projectName + '@' + version;
        delete UpdateCache.database[name];
        delete UpdateCache.keys[name];
        UpdateCache.updates = UpdateCache.updates.filter((u) => u !== name);
        UpdateCache.projects[projectName] = UpdateCache.projects[projectName].filter((v) => v !== version);
    };
    exports.removeUpdate = removeUpdate;
    /**
     *
     * @param projectOrName
     * @param version
     * @returns
     */
    const hasUpdate = (projectOrName, version, network) => {
        var _a;
        if (!network)
            network =
                typeof projectOrName !== 'string'
                    ? (_a = projectOrName === null || projectOrName === void 0 ? void 0 : projectOrName.network) === null || _a === void 0 ? void 0 : _a.name
                    : projectOrName.split('_')[1] || null;
        if (!version)
            version = projectOrName.split('@')[1] || '1.0.0';
        if (projectOrName !== 'string')
            projectOrName = projectOrName.name;
        projectOrName =
            projectOrName + '@' + version + (network ? `_${network}` : '');
        if (!UpdateCache.projects[projectOrName])
            return false;
        return UpdateCache.projects[projectOrName].includes(version);
    };
    exports.hasUpdate = hasUpdate;
    const getUpdate = (projectOrName, version, network) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _d;
        if (!network)
            network =
                typeof projectOrName !== 'string'
                    ? (_d = projectOrName === null || projectOrName === void 0 ? void 0 : projectOrName.network) === null || _d === void 0 ? void 0 : _d.name
                    : projectOrName.split('_')[1] || null;
        if (!version)
            version = projectOrName.split('@')[1] || '1.0.0';
        if (projectOrName !== 'string')
            projectOrName = projectOrName.name;
        projectOrName =
            projectOrName + '@' + version + (network ? `_${network}` : '');
        let path = UpdateCache.database[UpdateCache.keys[projectOrName]];
        if (!path)
            throw new Error(`Could not find update for ${projectOrName}`);
        let update;
        if (path.ext === '.json')
            update = JSON.parse(fs_1.default.readFileSync(path.dir + '/' + path.base, {
                encoding: 'utf8',
            }));
        else
            update = yield require(path.dir + '/' + path.base).default;
        return update;
    });
    exports.getUpdate = getUpdate;
    /**
     * Creates a new update
     * @param project
     * @param newVersion
     * @param newTag
     * @param save
     * @returns
     */
    const createUpdate = (project, newVersion, newTag, network, save = true, createTypeScriptFile = true) => {
        var _a, _b, _c;
        if (!newTag)
            newTag = newVersion;
        let update = {
            name: project.name,
            version: {
                version: newVersion,
                tag: newTag,
            },
            network: {
                name: network || project.network.name || null,
                chainId: project.network.chainId || null,
            },
        };
        let projectName = update.name + (((_a = update.network) === null || _a === void 0 ? void 0 : _a.name) ? `_${update.network.name}` : null);
        if (save && !createTypeScriptFile)
            fs_1.default.writeFileSync((0, helpers_1.cwd)() +
                '/projects/updates/' +
                project.name +
                '@' +
                update.version.version +
                (((_b = update.network) === null || _b === void 0 ? void 0 : _b.name) ? `_${update.network.name}` : null) +
                '.json', JSON.stringify(update, null, 2));
        else {
            let tsFile = `import { InfinityMintProjectUpdate } from '${(0, helpers_1.isInfinityMint)()
                ? '../../app/interfaces'
                : 'infinitymint/dist/app/interfaces'}';

const update: InfinityMintProjectUpdate = ${JSON.stringify(update, null, 2)};
export default update;
`;
            fs_1.default.writeFileSync((0, helpers_1.cwd)() +
                '/projects/updates/' +
                project.name +
                '@' +
                update.version.version +
                (((_c = update.network) === null || _c === void 0 ? void 0 : _c.name) ? `_${update.network.name}` : null) +
                '.ts', tsFile);
        }
        //add to update cahe
        let keys = (0, exports.formatCacheEntry)(update, {
            dir: (0, helpers_1.cwd)() + '/projects/updates/',
            base: project.name + '@' + update.version.version + '.json',
            name: project.name + '@' + update.version.version,
            root: (0, helpers_1.cwd)() + '/projects/updates/',
            ext: '.json',
        });
        UpdateCache.database[project.name + '@' + update.version.version] = {
            dir: (0, helpers_1.cwd)() + '/projects/updates/',
            base: project.name + '@' + update.version.version + '.json',
            name: project.name + '@' + update.version.version,
            root: (0, helpers_1.cwd)() + '/projects/updates/',
            ext: '.json',
        };
        UpdateCache.keys = Object.assign(Object.assign({}, UpdateCache.keys), keys);
        UpdateCache.updates.push(update.name + '@' + update.version.version);
        UpdateCache.projects[projectName] = UpdateCache.projects[projectName] || [];
        UpdateCache.projects[projectName].push(update.version.version);
        //save file
        (0, exports.writeUpdateCache)(UpdateCache);
        return update;
    };
    exports.createUpdate = createUpdate;
    /**
     *
     * @param roots
     * @returns
     */
    const findUpdates = (roots = []) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let config = (0, helpers_1.getConfigFile)();
        roots = roots || [];
        //require JS files always
        roots.push((0, helpers_1.cwd)() + '/projects/updates/');
        roots = [
            ...roots,
            ...(config.roots || []).map((root) => {
                if (root.startsWith('../') ||
                    root.startsWith('./') ||
                    root.startsWith('/../'))
                    root =
                        (0, helpers_1.cwd)() +
                            '/' +
                            (root.startsWith('/') ? root.substring(1) : root);
                if (!root.endsWith('/'))
                    root += '/';
                return path_1.default.resolve(root + 'projects/updates/');
            }),
        ];
        let files = (yield Promise.all(roots.map((root) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _e, _f;
            let results = [
                ...(yield (0, helpers_1.safeGlob)(root + '**/*.json')),
                ...(yield (0, helpers_1.safeGlob)(root + '**/*.js')),
                ...(yield (0, helpers_1.safeGlob)(root + '**/*.mjs')),
                ...(yield (0, helpers_1.safeGlob)(root + '**/*.cjs')),
            ];
            if ((0, helpers_1.isTypescript)() ||
                !((_f = (_e = config.settings) === null || _e === void 0 ? void 0 : _e.updates) === null || _f === void 0 ? void 0 : _f.disallowTypescript)) {
                results = [
                    ...results,
                    ...(yield (0, helpers_1.safeGlob)(root + '**/*.ts')),
                ];
                results = results.filter((x) => !x.endsWith('.d.ts') &&
                    !x.endsWith('.type-extension.ts'));
            }
            return results;
        })))).flat();
        return files.map((fullPath) => {
            (0, helpers_1.debugLog)('Found update => ' + fullPath);
            return path_1.default.parse(fullPath);
        });
    });
    exports.findUpdates = findUpdates;
    const updateProjectContent = (project, update, infinityConsole, debugLog) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        //update paths
        if (update.paths) {
            debugLog('Updating path data <' + Object.values(update.paths).length + '>');
            yield Promise.all(Object.values(update.paths).map((path) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                let projectPath = project.paths.find((p) => p.pathId === path.pathId);
                let newPath = (0, helpers_1.mergeObjects)(projectPath, path);
                debugLog('Updating path => ' +
                    projectPath.pathId +
                    ' ' +
                    projectPath.name);
                if (projectPath.fileName !== newPath.fileName) {
                    let pathErrors = (0, imports_1.verifyImport)(newPath, 'path', project, debugLog);
                    if (pathErrors !== true)
                        throw new Error(pathErrors.map((e) => e.message || e).join('\n'));
                    let newImports = yield (0, imports_1.setupProjectImport)(project, newPath, infinityConsole, debugLog);
                    project.imports = Object.assign(Object.assign({}, project.imports), newImports);
                }
                project.paths = project.paths.map((p) => p.pathId === path.pathId ? newPath : p);
            })));
        }
        //update assets
        if (update.assets) {
            debugLog('Updating assets <' + Object.values(update.paths).length + '>');
            yield Promise.all(Object.values(update.assets).map((asset) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                let projectAsset = Object.values(project.assets).find((p) => p.assetId === asset.assetId);
                //deep merge asset with project asset
                let newAsset = (0, helpers_1.mergeObjects)(projectAsset, asset);
                debugLog('Updating asset => ' +
                    newAsset.assetId +
                    ' ' +
                    newAsset.name);
                if (newAsset.fileName !== projectAsset.fileName) {
                    let pathErrors = (0, imports_1.verifyImport)(newAsset, 'asset', project, debugLog);
                    if (pathErrors !== true)
                        throw new Error(pathErrors.map((e) => e.message || e).join('\n'));
                    let newImports = yield (0, imports_1.setupProjectImport)(project, newAsset, infinityConsole, debugLog);
                    project.imports = Object.assign(Object.assign({}, project.imports), newImports);
                }
                project.assets = Object.values(project.assets).map((p) => p.assetId === asset.assetId ? newAsset : p);
            })));
        }
    });
    exports.updateProjectContent = updateProjectContent;
    const updateProjectProcedure = (project, projectUpdate, infinityConsole, debugLog) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let { update } = projectUpdate;
        if (update.assets || update.paths)
            yield (0, exports.updateProjectContent)(project, update, infinityConsole, debugLog);
    });
    exports.updateProjectProcedure = updateProjectProcedure;
    const createProjectContent = (project, update, infinityConsole, debugLog, oldVersion) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        //add path to project
        if (update.paths) {
            yield Promise.all(Object.values(update.paths).map((path) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                let newPath = Object.assign(Object.assign({}, path), { pathId: project.paths.length });
                let pathErrors = (0, imports_1.verifyImport)(newPath, 'path', project, debugLog);
                if (pathErrors !== true)
                    throw new Error(pathErrors.map((e) => e.message || e).join('\n'));
                let newImports = yield (0, imports_1.setupProjectImport)(project, newPath, infinityConsole, debugLog);
                project.imports = Object.assign(Object.assign({}, project.imports), newImports);
                debugLog('Adding path => ' + newPath.pathId + ' ' + newPath.name);
                project.paths.push(newPath);
                return newPath;
            })));
        }
        if (update.assets) {
            yield Promise.all(Object.values(update.assets).map((path) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                let newAsset = Object.assign(Object.assign({}, path), { asetId: Object.values(project.assets).length + 1 });
                let pathErrors = (0, imports_1.verifyImport)(newAsset, 'asset', project, debugLog);
                if (pathErrors !== true)
                    throw new Error(pathErrors.map((e) => e.message || e).join('\n'));
                let newImports = yield (0, imports_1.setupProjectImport)(project, newAsset, infinityConsole, debugLog);
                project.imports = Object.assign(Object.assign({}, project.imports), newImports);
                debugLog('Adding path => ' + newAsset.pathId + ' ' + newAsset.name);
                project.assets = Object.assign(Object.assign({}, project.assets), { [newAsset.assetId]: newAsset });
                return newAsset;
            })));
        }
        //call asset controller execute method
        if (project.deployed) {
            let projectClass = yield infinityConsole.getProject(project, project.network.name, oldVersion);
            yield projectClass.deployments.assets.execute('update', {
                project: project,
                deployments: projectClass.deployments,
                contracts: projectClass.deployments,
                deployScript: projectClass.deployments.assets.getDeploymentScript(),
            }, infinityConsole);
        }
    });
    exports.createProjectContent = createProjectContent;
    const createProjectProcedure = (project, projectUpdate, infinityConsole, debugLog, oldVersion) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let { create } = projectUpdate;
        if (create.assets || create.paths)
            yield (0, exports.createProjectContent)(project, create, infinityConsole, debugLog, oldVersion);
    });
    exports.createProjectProcedure = createProjectProcedure;
    exports.updateProcedures = {
        update: exports.updateProjectProcedure,
        create: exports.createProjectProcedure,
        remove: (project, projectUpdate, infinityConsole, debugLog) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            debugLog('Removing data => ' + project.version.version);
        }),
    };
    const applyUpdate = (update, project, infinityConsole, debugLog) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _g;
        let newProject = Object.assign({}, project);
        debugLog = debugLog || helpers_1.log;
        newProject.version = update.version;
        debugLog('Applying update => ' + update.version.version);
        if (update.remove) {
            debugLog('Removing data => ' + update.version.version);
            yield exports.updateProcedures.remove(newProject, update, infinityConsole, debugLog);
        }
        if (update.create) {
            debugLog('Creating data => ' + update.version.version);
            yield exports.updateProcedures.create(newProject, update, infinityConsole, debugLog, ((_g = update.oldVersion) === null || _g === void 0 ? void 0 : _g.version) || '1.0.0');
        }
        if (update.update) {
            debugLog('Updating Project assets => ' + update.version.version);
            yield exports.updateProcedures.update(newProject, update, infinityConsole, debugLog);
        }
        if (update.merge) {
            debugLog('Merging Project assets => ' + update.version.version);
            newProject = (0, helpers_1.mergeObjects)(newProject, update.merge);
        }
        if (update.delete) {
            debugLog('Deleting Project assets => ' + update.version.version);
            update.delete.forEach((key) => {
                delete newProject[key];
            });
        }
        debugLog('Update Complete => ' + update.version.version);
        return newProject;
    });
    exports.applyUpdate = applyUpdate;
});
//# sourceMappingURL=updates.js.map