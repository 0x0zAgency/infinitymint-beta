(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./helpers", "path", "fs", "node:crypto", "./ipfs", "./projects"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildImports = exports.getImports = exports.readImportCache = exports.saveImportCache = exports.addImport = exports.getImportKeys = exports.verifyImport = exports.setupProjectImport = exports.getFileChecksum = exports.getImport = exports.hasImport = exports.importCount = exports.hasImportCache = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("./helpers");
    const path_1 = tslib_1.__importDefault(require("path"));
    const fs_1 = tslib_1.__importStar(require("fs"));
    const node_crypto_1 = require("node:crypto");
    const ipfs_1 = require("./ipfs");
    const projects_1 = require("./projects");
    /**
     * returns true if the import cache exists. does not check if its valid.
     * @returns
     */
    const hasImportCache = () => {
        return fs_1.default.existsSync((0, helpers_1.cwd)() + '/temp/import_cache.json');
    };
    exports.hasImportCache = hasImportCache;
    /**
     * counts the amount of assets we've found
     * @param imports
     * @returns
     */
    const importCount = (imports) => {
        imports = imports || importCache || (0, exports.readImportCache)();
        return Object.values(imports.database).length;
    };
    exports.importCount = importCount;
    /**
     * Searches the import cache for that particular import, can search by full path or just the name of the asset.
     * @param fileNameOrPath
     * @returns
     */
    const hasImport = (fileNameOrPath) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let imports = yield (0, exports.getImports)();
        if (!imports.keys[fileNameOrPath] ||
            !imports.database[imports.keys[fileNameOrPath]])
            return false;
        return true;
    });
    exports.hasImport = hasImport;
    /**
     * returns the parsedPath to a given fileNameOrPath in the imports cache. You can pass in the full path or just the name of the asset. It can have the extension or not. It can be any case.
     * @param fileNameOrPath
     * @returns
     */
    const getImport = (fileNameOrPath) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let imports = yield (0, exports.getImports)();
        if (!(0, exports.hasImport)(fileNameOrPath))
            throw new Error('import not found: ' + fileNameOrPath);
        return imports.database[imports.keys[fileNameOrPath]];
    });
    exports.getImport = getImport;
    /**
     * Returns a checksum based on the contents of the file
     * @param filePath
     * @returns
     */
    const getFileChecksum = (filePath) => {
        return (0, node_crypto_1.createHash)('sha256').update(fs_1.default.readFileSync(filePath)).digest('hex');
    };
    exports.getFileChecksum = getFileChecksum;
    /**
     * Checks that a project import exists and is valid. If it isnt valid but does exist it will add it to the import cache
     * @param project
     * @param fileName
     * @param type
     * @param _log
     * @returns
     */
    const upsertImport = (fileName, type, project, _log = helpers_1.log) => {
        var _a, _b, _c, _d;
        let errors = [];
        if (!importCache.keys[fileName] ||
            !importCache.database[importCache.keys[fileName]]) {
            if (fileName[0] !== '/')
                fileName = '/' + fileName;
            if (!fs_1.default.existsSync((0, helpers_1.cwd)() + fileName) &&
                project &&
                !fs_1.default.existsSync((0, helpers_1.replaceSeperators)(((_a = project === null || project === void 0 ? void 0 : project.source) === null || _a === void 0 ? void 0 : _a.dir) + '/../' + fileName)) &&
                !fs_1.default.existsSync((0, helpers_1.cwd)().split('/').slice(0, -1).join('/') + fileName) &&
                project &&
                !fs_1.default.existsSync((0, helpers_1.replaceSeperators)(((_b = project === null || project === void 0 ? void 0 : project.source) === null || _b === void 0 ? void 0 : _b.dir) + '/../imports/' + fileName))) {
                errors.push(`${type} content error: File not found in ${((_c = project === null || project === void 0 ? void 0 : project.source) === null || _c === void 0 ? void 0 : _c.dir) + '.../'} or ${((_d = project === null || project === void 0 ? void 0 : project.source) === null || _d === void 0 ? void 0 : _d.dir) + '.../imports/'} or ${(0, helpers_1.cwd)().split('/').slice(0, -1).join('/') + fileName} => ` + fileName);
                return errors;
            }
            else {
                let filePath;
                if (fs_1.default.existsSync((0, helpers_1.cwd)() + fileName))
                    filePath = (0, helpers_1.cwd)() + fileName;
                else if (fs_1.default.existsSync((0, helpers_1.replaceSeperators)(project.source.dir + '/../' + fileName)))
                    filePath = (0, helpers_1.replaceSeperators)(project.source.dir + '/../' + fileName);
                else if (fs_1.default.existsSync((0, helpers_1.cwd)().split('/').slice(0, -1).join('/') + fileName))
                    filePath = (0, helpers_1.cwd)().split('/').slice(0, -1).join('/') + fileName;
                else
                    filePath = (0, helpers_1.replaceSeperators)(project.source.dir + '/../imports' + fileName);
                _log('\t{yellow-fg}Adding ' + filePath + ' to import cache{/}');
                //add it to the import base
                importCache = (0, exports.addImport)(filePath);
            }
        }
        else {
            let newChecksum = (0, exports.getFileChecksum)(importCache.database[importCache.keys[fileName]].dir +
                '/' +
                importCache.database[importCache.keys[fileName]].base);
            if (importCache.database[importCache.keys[fileName]].checksum !==
                newChecksum) {
                _log(`\t{yellow-fg}Checksum Changed{/} ${importCache.database[importCache.keys[fileName]].checksum} => ${newChecksum}`);
                importCache.database[importCache.keys[fileName]].cid = undefined;
                importCache.database[importCache.keys[fileName]].checksum =
                    newChecksum;
                (0, exports.saveImportCache)(importCache);
            }
        }
        return true;
    };
    /**
     * Will correctly setup an paths import in a project. Also does the path content too. Uploads it to IPFS and fills in the required data for the projectp path interface. used in the compile script
     * @param project
     * @param path
     * @param infinityConsole
     * @param _log
     * @returns
     */
    const setupProjectImport = (project, path, infinityConsole, _log = helpers_1.log) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        _log(`\t{cyan-fg}Setting Up{/} => ${path.fileName}`);
        let imports = {};
        let fileName = path.fileName.toString().toLowerCase(); //because of issue with uppercase/lowercase filenames we lowercase it first
        let pathImport = importCache.database[importCache.keys[fileName]] || {
            extension: 'none',
            name: 'none',
            dir: 'none',
            checksum: 'none',
            base: 'none',
            settings: [],
        };
        path.source = pathImport;
        //puts the settings for the import into the path
        if (pathImport === null || pathImport === void 0 ? void 0 : pathImport.settings) {
            pathImport.settings.map((setting) => {
                if (!path.settings)
                    path.settings = {};
                else if (typeof path.settings === 'object')
                    path.settings = {
                        '@project': path.settings,
                    };
                else
                    path.settings = {};
                _log(`\t{cyan-fg}Found Settings{/} => ${setting.dir + '/' + setting.base} (${setting.ext})`);
                if (setting.ext === '.json') {
                    path.settings[setting.dir + '/' + setting.base] = Object.assign(Object.assign({}, JSON.parse(fs_1.default.readFileSync(setting.dir + '/' + setting.base, {
                        encoding: 'utf-8',
                    }))), { source: setting });
                }
                else if (setting.ext === '.js' || setting.ext === '.ts') {
                    let result = require(setting.dir + '/' + setting.base);
                    result = result.default;
                    path.settings[setting.dir + '/' + setting.base] = Object.assign(Object.assign({}, (typeof result === 'function' ? result() : result)), { source: setting });
                }
                else {
                    throw new Error('unknown settings file extension: ' +
                        setting.dir +
                        '/' +
                        setting.base);
                }
                imports[setting.dir + '/' + setting.base] =
                    setting.dir + '/' + setting.base;
            });
            Object.values(path.settings || {}).forEach((svgSetting) => {
                var _a;
                if (!((_a = svgSetting === null || svgSetting === void 0 ? void 0 : svgSetting.style) === null || _a === void 0 ? void 0 : _a.css))
                    return;
                let path = svgSetting.style.css;
                path = path[0] === '/' ? '' : '/' + path;
                if (svgSetting.style.css instanceof Array)
                    svgSetting.style.css.forEach((style) => {
                        style = (style[0] === '/' ? '' : '/') + style;
                        if (!importCache.keys[style])
                            throw new Error(`${svgSetting.source.dir +
                                '/' +
                                svgSetting.source.base} bad css reference: ${style}`);
                        else {
                            _log(`\t{cyan-fg}Included CSS reference{/} => ${style}`);
                            let truePath = svgSetting.source.dir.split('imports')[0] +
                                style;
                            imports[style] = truePath;
                            imports[project.name + '@' + style] = truePath;
                            imports[(0, projects_1.getFullyQualifiedName)(project) + style] =
                                truePath;
                            imports[(0, helpers_1.cwd)() + style] = truePath;
                            imports[(svgSetting.source.dir + style).replace(/\/\//g, '/')] = truePath;
                            imports[truePath] = truePath;
                        }
                    });
                else if (!importCache.keys[path])
                    throw new Error(`${svgSetting.source.dir +
                        '/' +
                        svgSetting.source.base} has a bad css reference: ${path}`);
                else {
                    _log(`\t{cyan-fg}Included CSS reference{/} => ${path}`);
                    let truePath = svgSetting.source.dir.split('imports')[0] + path;
                    imports[path] = truePath;
                    imports[svgSetting.source.dir + path] = truePath;
                    imports[(0, helpers_1.cwd)() + path] = truePath;
                    imports[project.name + '@' + path] = truePath;
                    imports[(0, projects_1.getFullyQualifiedName)(project) + path] = truePath;
                    imports[truePath] = truePath;
                }
            });
            if (path.content) {
                _log('\t{cyan-fg}Setting Up Path Content...{/}');
                let keys = Object.keys(path.content);
                for (let i = 0; i < keys.length; i++) {
                    let content = keys[i];
                    let newImport = Object.assign({ fileName: path.content[content].fileName || path.content[content], name: content }, (typeof path.content[content] === 'object'
                        ? path.content[content]
                        : {}));
                    if (infinityConsole)
                        infinityConsole.emit('preCompileSetup', path, typeof path);
                    yield (0, exports.setupProjectImport)(project, newImport, infinityConsole, _log);
                    newImport.compiled = true;
                    path.content[content] = newImport;
                    if (infinityConsole)
                        infinityConsole.emit('postCompileSetup', path, typeof path);
                }
            }
            _log('\t\t{green-fg}Success{/}');
        }
        //create basic exports object to fill in later
        path.export = {
            key: `${project.name}@${fileName}`,
            checksum: (_a = path === null || path === void 0 ? void 0 : path.source) === null || _a === void 0 ? void 0 : _a.checksum,
            project: project.name,
            version: project.version || {
                version: '1.0.0',
                tag: 'initial',
            },
            stats: (path === null || path === void 0 ? void 0 : path.source) && path.source.base !== 'none'
                ? fs_1.default.statSync(`${path.source.dir}/${path.source.base}`)
                : {},
            exported: Date.now(),
        };
        if ((0, ipfs_1.isAllowingIPFS)() && infinityConsole) {
            try {
                let cid = pathImport.cid;
                if (!cid) {
                    _log(`\t{cyan-fg}Uploading to IPFS{/}`);
                    cid = yield infinityConsole.IPFS.add(fs_1.default.readFileSync(path.source.dir + '/' + path.source.base), path.source.base);
                    _log(`\t\t{green-fg}Successly uploaded to IPFS{/} => ${cid}`);
                    importCache.database[importCache.keys[fileName]].cid = cid;
                    (0, exports.saveImportCache)(importCache);
                }
                else
                    _log(`\t{cyan-fg}Reusing IPFS cid => ${cid}{/}`);
                let ipfsConfig = (0, ipfs_1.getIPFSConfig)();
                let endpoint = ipfsConfig.endpoint || 'https://ipfs.io/ipfs/';
                if (!path.export.external)
                    path.export.external = {};
                path.export.external.ipfs = {
                    hash: cid,
                    url: `${endpoint}${cid}/${path.source.base}`,
                    fileName: path.source.base,
                };
            }
            catch (error) {
                _log(`{red-fg}Failed to upload to IPFS{/}`);
                _log(error);
            }
        }
        else
            _log('\t{red-fg}Not uploading to IPFS!{/}');
        if (path.export.key)
            imports[path.export.key] = path.source.dir + '/' + path.source.base;
        if (path.source)
            imports[path.source.dir + '/' + path.source.base] =
                path.source.dir + '/' + path.source.base;
        imports[project.name + '@' + fileName] =
            path.source.dir + '/' + path.source.base;
        let fileNameWithSlash = (fileName[0] === '/' ? '' : '/') + fileName;
        imports[fileName] = path.source.dir + '/' + path.source.base;
        imports[fileNameWithSlash] = path.source.dir + '/' + path.source.base;
        imports[(0, helpers_1.cwd)() + fileNameWithSlash] =
            path.source.dir + '/' + path.source.base;
        imports[(0, projects_1.getFullyQualifiedName)(project) + fileNameWithSlash] =
            path.source.dir + '/' + path.source.base;
        path.checksum = (0, node_crypto_1.createHash)('md5')
            .update(JSON.stringify(path))
            .digest('hex');
        _log(`\t{cyan-fg}Path checksum{/cyan-fg} => ${path.checksum}`);
        return imports;
    });
    exports.setupProjectImport = setupProjectImport;
    /**
     * Takes a project and a path, returns an array of errors if any else will return true if everything is okay
     * @param project
     * @param path
     * @param type
     * @param _log
     * @returns
     */
    const verifyImport = (path, type, project, _log = helpers_1.log) => {
        var _a;
        let files = [];
        let errors = [];
        type = type || 'path';
        if (!path.fileName) {
            errors.push(`${type} content error: File name not found!`);
            return errors;
        }
        let fileName = path.fileName.toString().toLowerCase();
        _log('\t{cyan-fg}Verifying ' + fileName + '{/}');
        upsertImport(fileName, type, project, _log);
        let file = importCache.database[importCache.keys[fileName]];
        if (!file) {
            errors.push(`${type} content error (${(path === null || path === void 0 ? void 0 : path.pathId) ||
                path.assetId ||
                'content'}): File not found in import cache => ` + fileName);
        }
        else if (!(file === null || file === void 0 ? void 0 : file.checksum) || ((_a = file === null || file === void 0 ? void 0 : file.checksum) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            errors.push(`${type} content error (${(path === null || path === void 0 ? void 0 : path.pathId) ||
                path.assetId ||
                'content'}): Checksum not found! Try refreshing import cache => ` +
                fileName +
                ' <' +
                (importCache.keys[fileName] || 'BAD KEY') +
                '>');
        }
        if (errors.length !== 0)
            return errors;
        let stats = fs_1.default.statSync(file.dir + '/' + file.base);
        if (stats.size === 0) {
            errors.push(`${type} content error (${(path === null || path === void 0 ? void 0 : path.pathId) ||
                path.assetId ||
                'content'}): File size is zero (means file is empty) => ` + fileName);
        }
        if (errors.length !== 0)
            files.push(fileName);
        if (path.content && Object.keys(path.content).length > 0) {
            _log('\t{cyan-fg}Verifying content...{/}');
            Object.keys(path.content).forEach((contentKey) => {
                let content = path.content[contentKey];
                if (content !== null &&
                    typeof content === 'object' &&
                    !(content === null || content === void 0 ? void 0 : content.fileName)) {
                    _log('\t{yellow-fg}no filename assuming none import => {/}' +
                        contentKey);
                    content.fileName = 'none';
                }
                else if (typeof content === 'string') {
                    content = {
                        fileName: content,
                        name: contentKey,
                    };
                }
                else if (typeof content !== 'object') {
                    _log('\t{yellow-fg}weird type assuming none => {/}' + contentKey);
                    content = {
                        fileName: 'none',
                        name: 'none',
                    };
                }
                fileName = content.fileName.toString().toLowerCase();
                _log('\t{cyan-fg}Checking Content: ' + fileName + '{/}');
                if (fileName === 'undefined' ||
                    fileName === 'null' ||
                    fileName === 'NaN' ||
                    fileName === 'none' ||
                    fileName.length === 0) {
                    _log('\t{red-fg}Unable to verify content => ' + fileName + '{/}');
                }
                else {
                    if (!importCache.keys[fileName]) {
                        if (fileName[0] !== '/')
                            fileName = '/' + fileName;
                        let result = upsertImport(fileName, 'content', project, _log);
                        if (!result)
                            errors = [...errors, ...result];
                        else
                            _log('\t\t{green-fg}Success{/}');
                    }
                    files.push(fileName);
                }
            });
        }
        if (typeof path.settings === 'string' &&
            !importCache.database[importCache.keys[path.settings]]) {
            errors.push(`${type} settings reference error (${(path === null || path === void 0 ? void 0 : path.pathId) ||
                path.assetId ||
                'content'}): Settings file not found => ` + path.settings);
        }
        //now lets check the imports database for settings files and if the locaiton actually exists
        files.forEach((file) => {
            let thatImport = importCache.database[importCache.keys[file.toLowerCase()]];
            if (!fs_1.default.existsSync(thatImport.dir + '/' + thatImport.base)) {
                errors.push(`${type} reference error (${(path === null || path === void 0 ? void 0 : path.pathId) ||
                    path.assetId ||
                    'content'}): File does not exist locally => ` +
                    thatImport.dir +
                    '/' +
                    thatImport.base);
                return;
            }
            if (thatImport.settings && thatImport.settings.length !== 0) {
                thatImport.settings.forEach((setting) => {
                    let settingLocation = setting.dir + '/' + setting.base;
                    if (!fs_1.default.existsSync(settingLocation)) {
                        errors.push(`${type} settings error (${(path === null || path === void 0 ? void 0 : path.pathId) ||
                            path.assetId ||
                            'content'}): Settings file not found => ` + settingLocation);
                    }
                    else
                        _log('\t{cyan-fg}Verified Settings ' +
                            settingLocation +
                            '{/}');
                });
            }
        });
        if (errors.length === 0)
            return true;
        return errors;
    };
    exports.verifyImport = verifyImport;
    const getImportKeys = (newImport, key) => {
        let root = newImport.dir.split('imports');
        if (root.length > 2)
            root.slice(1).join('imports');
        else
            root = root[1];
        let rootFolder = newImport.dir.split('/imports')[0].split('/').pop();
        let nss = root[0] === '/' ? root.substring(1) : root;
        let newKeys = {};
        newKeys[path_1.default.join(rootFolder, 'imports', root.toString(), newImport.base)] =
            key;
        newKeys['/' + path_1.default.join(rootFolder, 'imports', root.toString(), newImport.base)] = key;
        newKeys['/' +
            path_1.default
                .join(rootFolder, 'imports', root.toString(), newImport.base)
                .toLowerCase()] = key;
        newKeys[path_1.default
            .join(rootFolder, 'imports', root.toString(), newImport.base)
            .toLowerCase()] = key;
        newKeys[path_1.default.resolve(path_1.default.join((0, helpers_1.cwd)(), rootFolder, 'imports', root.toString(), newImport.base))] = key;
        newKeys[path_1.default
            .resolve(path_1.default.join((0, helpers_1.cwd)(), 'imports', rootFolder, root.toString(), newImport.base))
            .toLowerCase()] = key;
        newKeys[(0, helpers_1.cwd)().split('/').pop() + root + '/' + newImport.base] = key;
        newKeys[path_1.default.resolve((0, helpers_1.cwd)().split('/').pop() + root + '/' + newImport.base)] = key;
        newKeys[(0, helpers_1.cwd)().split('/').pop() + root + '/' + newImport.name] = key;
        newKeys[path_1.default.resolve((0, helpers_1.cwd)().split('/').pop() + root + '/' + newImport.name)] = key;
        newKeys[(0, helpers_1.cwd)().split('/').pop() + '/imports' + root + '/' + newImport.base] =
            key;
        newKeys[path_1.default.resolve((0, helpers_1.cwd)().split('/').pop() + '/imports' + root + '/' + newImport.base)] = key;
        newKeys[path_1.default.resolve((0, helpers_1.cwd)().split('/').pop() +
            '/imports' +
            root +
            '/' +
            newImport.base.toLowerCase())] = key;
        newKeys[(0, helpers_1.cwd)().split('/').pop() + '/imports' + root + '/' + newImport.name] =
            key;
        newKeys[path_1.default.resolve((0, helpers_1.cwd)().split('/').pop() + '/imports' + root + '/' + newImport.name)] = key;
        newKeys[newImport.dir + '/' + newImport.base] = key;
        newKeys[newImport.dir + '/' + newImport.name] = key;
        newKeys[(0, helpers_1.cwd)() + '/imports' + root + '/' + newImport.name] = key;
        newKeys[path_1.default.resolve((0, helpers_1.cwd)() + '/imports' + root + '/' + newImport.name)] =
            key;
        newKeys[(0, helpers_1.cwd)() + '/imports' + root + '/' + newImport.base] = key;
        newKeys[path_1.default.resolve((0, helpers_1.cwd)() + '/imports' + root + '/' + newImport.base)] =
            key;
        newKeys['imports/' + newImport.name + newImport.extension.toLowerCase()] =
            key;
        newKeys['/imports/' + newImport.name + newImport.extension.toLowerCase()] =
            key;
        newKeys['imports/' + newImport.name + newImport.extension.toUpperCase()] =
            key;
        newKeys['/imports/' + newImport.name + newImport.extension.toUpperCase()] =
            key;
        newKeys['imports/' + newImport.name] = key;
        newKeys['/imports/' + newImport.name] = key;
        newKeys['imports/' + newImport.base] = key;
        newKeys['/imports/' + newImport.base] = key;
        newKeys[('/imports/' + newImport.name).toLowerCase()] = key;
        newKeys[('/imports/' + newImport.base).toLowerCase()] = key;
        newKeys[('imports/' + newImport.base).toLowerCase()] = key;
        newKeys[('imports/' + newImport.name).toLowerCase()] = key;
        newKeys['imports' + root + '/' + newImport.name] = key;
        newKeys['/imports' + root + '/' + newImport.name] = key;
        newKeys['imports' + root + '/' + newImport.base] = key;
        newKeys['/imports' + root + '/' + newImport.base] = key;
        newKeys[('/imports' + root + '/' + newImport.name).toLowerCase()] = key;
        newKeys[('imports' + root + '/' + newImport.base).toLowerCase()] = key;
        newKeys[root + '/' + newImport.name] = key;
        newKeys[root + '/' + newImport.name] = key;
        newKeys[(root + '/' + newImport.name).toLowerCase()] = key;
        newKeys[(root + '/' + newImport.base).toLowerCase()] = key;
        newKeys[root + '/' + newImport.name + newImport.extension.toLowerCase()] =
            key;
        newKeys[root + '/' + newImport.name + newImport.extension.toUpperCase()] =
            key;
        newKeys[(root + '/' + newImport.name).toLowerCase()] = key;
        newKeys[(root + '/' + newImport.base).toLowerCase()] = key;
        newKeys[root + '/' + newImport.base] = key;
        newKeys[root + '/' + newImport.base] = key;
        newKeys[nss + '/' + newImport.name] = key;
        newKeys[nss + '/' + newImport.name + newImport.extension.toLowerCase()] =
            key;
        newKeys[nss + '/' + newImport.name + newImport.extension.toUpperCase()] =
            key;
        newKeys[(nss + '/' + newImport.base).toLowerCase()] = key;
        newKeys[(nss + '/' + newImport.name).toLowerCase()] = key;
        newKeys[nss + '/' + newImport.name] = key;
        newKeys[nss + '/' + newImport.base] = key;
        newKeys[nss + '/' + newImport.base] = key;
        newKeys[newImport.base] = key;
        newKeys[newImport.name] = key;
        newKeys[newImport.name.toLowerCase()] = key;
        newKeys[newImport.base.toLowerCase()] = key;
        Object.keys(newKeys).forEach((key) => {
            //TODO: Fix this
            if (key.indexOf('//') !== -1) {
                newKeys[key.replace(/\/\//g, '/')] = newKeys[key];
                delete newKeys[key];
            }
            //TODO: Fix this too
            if (key.indexOf('\\\\') !== -1) {
                newKeys[key.replace(/\\\\/g, '\\')] = newKeys[key];
                delete newKeys[key];
            }
            //for windows support
            newKeys['C:' + (0, helpers_1.replaceSeperators)(key, true)] = newKeys[key];
            //lowercase variants
            newKeys[key.toLowerCase()] = newKeys[key];
            newKeys[key.toUpperCase()] = newKeys[key];
        });
        return newKeys;
    };
    exports.getImportKeys = getImportKeys;
    /**
     * Adds an import to the import cache, the filePath must be the direct location of the path
     * @param filePath
     * @returns
     */
    const addImport = (filePath) => {
        if (!fs_1.default.existsSync(filePath))
            throw new Error('tried to add non existent file to import cache: ' + filePath);
        let imports = (0, exports.readImportCache)();
        let checksum = (0, exports.getFileChecksum)(filePath);
        let parsedPath = path_1.default.parse(filePath);
        let newImport = {
            extension: parsedPath.ext,
            name: parsedPath.name,
            base: parsedPath.base,
            checksum: checksum,
            dir: parsedPath.dir,
            settings: [],
        };
        imports.database[filePath] = newImport;
        imports.keys = Object.assign(Object.assign({}, imports.keys), (0, exports.getImportKeys)(newImport, filePath));
        (0, exports.saveImportCache)(imports);
        return imports;
    };
    exports.addImport = addImport;
    /**
     * saves the import cache to disk
     * @param cache
     */
    const saveImportCache = (cache) => {
        (0, helpers_1.log)(`saving <${(0, exports.importCount)(cache)}> imports to cache file`, 'imports');
        (0, helpers_1.log)('saving imports to /temp/import_cache.json', 'fs');
        fs_1.default.writeFileSync((0, helpers_1.cwd)() + '/temp/import_cache.json', JSON.stringify(cache, null, 2));
    };
    exports.saveImportCache = saveImportCache;
    /**
     * reads the import cache from disk
     * @returns
     */
    const readImportCache = () => {
        if (!fs_1.default.existsSync((0, helpers_1.cwd)() + '/temp/import_cache.json'))
            return { keys: {}, database: {}, updated: Date.now() };
        return JSON.parse(fs_1.default.readFileSync((0, helpers_1.cwd)() + '/temp/import_cache.json', {
            encoding: 'utf-8',
        }));
    };
    exports.readImportCache = readImportCache;
    let importCache;
    /**
     * returns the current import cache. if useFresh is true, it will recompile the cache. if the cache does not exist, it will create it. It will also save the cache to disk.
     * @param dontUseCache
     * @param infinityConsole
     * @returns
     */
    const getImports = (dontUseCache, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        let config = (0, helpers_1.getConfigFile)();
        if (dontUseCache ||
            (!importCache && !fs_1.default.existsSync((0, helpers_1.cwd)() + '/temp/import_cache.json'))) {
            let oldCache;
            if (fs_1.default.existsSync((0, helpers_1.cwd)() + '/temp/import_cache.json'))
                oldCache = (0, exports.readImportCache)();
            importCache = yield (0, exports.buildImports)(((_c = (_b = config.settings) === null || _b === void 0 ? void 0 : _b.imports) === null || _c === void 0 ? void 0 : _c.supportedExtensions) || [], infinityConsole);
            // we want to keep the old cid's if they exist
            if (oldCache) {
                Object.keys(oldCache.database).forEach((key) => {
                    var _a;
                    if (((_a = oldCache === null || oldCache === void 0 ? void 0 : oldCache.database[key]) === null || _a === void 0 ? void 0 : _a.cid) && importCache.database[key])
                        importCache.database[key].cid = oldCache.database[key].cid;
                });
            }
            (0, exports.saveImportCache)(importCache);
        }
        else
            importCache = (0, exports.readImportCache)();
        return importCache;
    });
    exports.getImports = getImports;
    /**
     * creates the import cache to be then saved to disk. Can pass in more supported extensions to add to the default ones. More extensions can also be added to the config file.
     * @param supportedExtensions
     * @param infinityConsole
     * @returns
     */
    const buildImports = (supportedExtensions, infinityConsole, roots = []) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f, _g;
        supportedExtensions = supportedExtensions || [];
        let config = (0, helpers_1.getConfigFile)();
        supportedExtensions = [
            ...supportedExtensions,
            ,
            ...[
                '.png',
                '.svg',
                '.jpg',
                '.jpeg',
                '.gif',
                '.glb',
                '.mp3',
                '.obj',
                '.wav',
                '.css',
            ],
        ];
        if ((_e = (_d = config.settings) === null || _d === void 0 ? void 0 : _d.imports) === null || _e === void 0 ? void 0 : _e.disabledExtensions)
            supportedExtensions = supportedExtensions.filter((val) => config.settings.imports.disabledExtensions.indexOf(val) === -1);
        (0, helpers_1.log)('found ' + supportedExtensions.length + ' supported extensions', 'imports');
        supportedExtensions.forEach((ext) => (0, helpers_1.log)(`\t${ext}`, 'imports'));
        let finalLocations = [];
        [
            ...roots,
            (0, helpers_1.cwd)() + '/imports/',
            ...(config.imports || []).map((root) => {
                if (root.startsWith('../') ||
                    root.startsWith('./') ||
                    root.startsWith('/../'))
                    root =
                        (0, helpers_1.cwd)() +
                            '/' +
                            (root.startsWith('/') ? root.substring(1) : root);
                if (!root.endsWith('/'))
                    root += '/';
                return root + 'imports/';
            }),
            ...(config.roots || []).map((root) => {
                if (root.startsWith('../') ||
                    root.startsWith('./') ||
                    root.startsWith('/../'))
                    root =
                        (0, helpers_1.cwd)() +
                            '/' +
                            (root.startsWith('/') ? root.substring(1) : root);
                return (root +
                    (root[root.length - 1] !== '/' ? '/imports/' : 'imports/'));
            }),
        ]
            .map((location) => {
            return location + '**/*';
        })
            .map((location) => {
            //removes broken double directory slash
            return location.replace(/\/\//g, '');
        })
            //then add the glob extensions
            .forEach((location) => {
            supportedExtensions.forEach((ext) => {
                if (!ext || ext.length === 0)
                    return;
                if (ext[0] === '.')
                    ext = ext.substring(1);
                finalLocations.push(location + '.' + ext);
                finalLocations.push(location + '.' + ext.toUpperCase());
                finalLocations.push(location + '.' + ext + '.settings.*');
                finalLocations.push(location + '.' + ext.toUpperCase() + '.settings.*');
            });
        });
        let results = [];
        for (let i = 0; i < finalLocations.length; i++) {
            let files = yield (0, helpers_1.findFiles)(finalLocations[i]);
            //remove disabled roots
            if ((_g = (_f = config.settings) === null || _f === void 0 ? void 0 : _f.imports) === null || _g === void 0 ? void 0 : _g.disabledRoots)
                files = files.filter((file) => config.settings.imports.disabledRoots.filter((root) => file.indexOf(root) !== -1).length === 0);
            files.forEach((result) => {
                if (infinityConsole && infinityConsole.isDrawing())
                    infinityConsole
                        .getLoadingBox()
                        .setContent('Loading => ' + result);
                results.push(result);
            });
        }
        let parsedFiles = results.map((filePath) => path_1.default.parse(filePath));
        let foundImports = parsedFiles.filter((file) => file.base.indexOf('.settings.') === -1);
        let foundSettings = parsedFiles.filter((file) => file.base.indexOf('.settings.') !== -1);
        let newImports = {
            updated: Date.now(),
            database: {},
            keys: {},
        };
        let c = [...foundImports, ...foundSettings];
        for (let i = 0; i < c.length; i++) {
            let currentImport = c[i];
            let filePath = currentImport.dir + '/' + currentImport.base;
            if (newImports.database[filePath])
                throw new Error('conflict: ' + filePath);
            (0, helpers_1.log)(`[${i}] found file => ${filePath}`, 'imports');
            (0, helpers_1.log)(`\t => calculating checksum`, 'imports');
            if (infinityConsole && infinityConsole.isDrawing())
                infinityConsole
                    .getLoadingBox()
                    .setContent('Calculating Checksum => ' + filePath);
            let checksum = (0, node_crypto_1.createHash)('md5')
                .update(yield fs_1.promises.readFile(filePath, {
                encoding: 'utf-8',
            }))
                .digest('hex');
            (0, helpers_1.log)(`\t => checksum calculated: ${checksum}`, 'imports');
            newImports.database[filePath] = {
                extension: currentImport.ext,
                name: currentImport.name,
                dir: currentImport.dir,
                base: currentImport.base,
                checksum: checksum,
                settings: foundSettings.filter((thatSetting) => thatSetting.base.indexOf(currentImport.name + currentImport.ext + '.settings.') !== -1),
            };
            //update the keys
            newImports.keys = Object.assign(Object.assign({}, newImports.keys), (0, exports.getImportKeys)(newImports.database[filePath], filePath));
            if (infinityConsole && infinityConsole.isDrawing())
                infinityConsole
                    .getLoadingBox()
                    .setContent('Imported => ' + filePath);
            else if (infinityConsole && !infinityConsole.isDrawing())
                infinityConsole.log('Imported => ' + filePath);
        }
        return newImports;
    });
    exports.buildImports = buildImports;
});
//# sourceMappingURL=imports.js.map