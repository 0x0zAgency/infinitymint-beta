(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/projects", "../app/helpers", "../app/imports", "fs", "jszip", "../app/deployments", "../app/web3", "../app/ipfs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const projects_1 = require("../app/projects");
    const helpers_1 = require("../app/helpers");
    const imports_1 = require("../app/imports");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const jszip_1 = tslib_1.__importDefault(require("jszip"));
    const deployments_1 = require("../app/deployments");
    const web3_1 = require("../app/web3");
    const ipfs_1 = require("../app/ipfs");
    const compile = {
        name: 'Compile',
        description: 'Compile an InfinityMint project ready for deployment. The compiled file will garuntee that all the assets used in the minter are uploaded to IPFS and accessible at all times.',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let tempProject = (0, projects_1.createTemporaryProject)(script, 'compiled', null, null, (_a = script.args.target) === null || _a === void 0 ? void 0 : _a.value); //gets a temporary project file if there is one for a compilation, if not will just return the source project aka the .ts file or .js file
            let config = (0, helpers_1.getConfigFile)();
            let { continuePrevious, recompile, uploadBundle } = (0, helpers_1.getArgumentValues)(script.args);
            if (!continuePrevious) {
                script.log(`{red-fg}Not continuing with previous compilation. Making new temp file{/}`);
                tempProject = (0, projects_1.createTemporaryProject)(script, 'source');
            }
            if (recompile && (0, projects_1.hasCompiledProject)(tempProject)) {
                let compiledProject = (0, projects_1.getCompiledProject)(tempProject);
                script.log(`Removing compiled project: ${(0, projects_1.getFullyQualifiedName)(tempProject, compiledProject.version.version)}`);
                fs_1.default.unlinkSync((0, helpers_1.cwd)() +
                    '/projects/compiled/' +
                    (0, projects_1.getFullyQualifiedName)(tempProject, compiledProject.version.version) +
                    '.json');
                //reset the project back to the source
                tempProject = (0, projects_1.createTemporaryProject)(script, 'source');
            }
            if (!tempProject.version)
                tempProject.version = {
                    version: '1.0.0',
                    tag: 'initial',
                };
            //sets the project and script to be the one used by the action method. Must be called before any action is called or any always is called
            (0, web3_1.prepare)(tempProject, script, 'compile');
            //rechange the modules over if they have changed
            if (script.project.source.modules)
                tempProject.modules = script.project.source.modules;
            //sets where this project is stored locally
            tempProject.source = (0, projects_1.getProjectSource)(tempProject);
            //if the project is a classic project from InfinityMint alpha make it classic
            Object.values(((_c = (_b = config.settings) === null || _b === void 0 ? void 0 : _b.projects) === null || _c === void 0 ? void 0 : _c.classicProjects) || []).forEach((location) => {
                if (tempProject.source.dir.includes(location.toString()))
                    tempProject.classic = true;
            });
            if (tempProject.javascript &&
                tempProject.classic === true) {
                let upgrade = yield (0, web3_1.action)('upgrade', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    var _e, _f, _g;
                    script.log(`{cyan-fg}{bold}Upgrading ${tempProject.name}@${tempProject.version.version} with InfinityMint@${(0, helpers_1.getInfinityMintVersion)()}{/}`);
                    tempProject.information = Object.assign(Object.assign({}, ((tempProject === null || tempProject === void 0 ? void 0 : tempProject.description) || {})), (tempProject.information || {}));
                    tempProject.settings = Object.assign({}, ((tempProject === null || tempProject === void 0 ? void 0 : tempProject.settings) || {}));
                    if (tempProject.names && !((_e = tempProject.settings) === null || _e === void 0 ? void 0 : _e.names))
                        tempProject.settings.names = tempProject.names;
                    let javaScriptProject = tempProject;
                    tempProject.information.tokenSingular =
                        javaScriptProject.description.token;
                    tempProject.information.tokenMultiple =
                        javaScriptProject.description.tokenPlural;
                    tempProject.price =
                        tempProject.price ||
                            javaScriptProject.deployment.startingPrice.toString() ||
                            0;
                    if (tempProject.description)
                        delete tempProject.description;
                    tempProject.modules = Object.assign(Object.assign({}, javaScriptProject.modules), { assets: javaScriptProject.modules.controller });
                    if (tempProject.settings === undefined)
                        tempProject.settings = {};
                    //move deployment variables to the settings
                    if (javaScriptProject.deployment) {
                        tempProject.settings.values = javaScriptProject.deployment;
                        if (tempProject.deployment)
                            delete tempProject.deployment;
                    }
                    if (javaScriptProject.royalties) {
                        tempProject.settings.royalty =
                            javaScriptProject.royalties;
                        if (tempProject.royalties)
                            delete tempProject.royalties;
                    }
                    if (javaScriptProject.approved)
                        tempProject.permissions = Object.assign(Object.assign({}, (tempProject.permissions || {})), { all: javaScriptProject.approved });
                    if (javaScriptProject.mods) {
                        tempProject.gems = javaScriptProject.mods;
                        if (tempProject.mods)
                            delete tempProject.mods;
                    }
                    if ((_f = javaScriptProject.paths) === null || _f === void 0 ? void 0 : _f.indexes)
                        javaScriptProject.paths = Object.values((_g = javaScriptProject.paths) === null || _g === void 0 ? void 0 : _g.indexes).map((path) => {
                            var _a, _b;
                            //do a deep copy of the default path and merge it with the path
                            let newObj = Object.assign(Object.assign({}, (((_a = javaScriptProject.paths) === null || _a === void 0 ? void 0 : _a.default) || {})), path);
                            newObj.content = Object.assign(Object.assign({}, path.content), (((_b = javaScriptProject.paths) === null || _b === void 0 ? void 0 : _b.default) || {}).content);
                            return newObj;
                        });
                }));
                if (upgrade !== true)
                    throw upgrade;
            }
            const deploymentLinks = yield (0, deployments_1.loadProjectDeploymentLinks)(tempProject, script.infinityConsole, null, true);
            let result = yield (0, web3_1.always)('compile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if ((0, projects_1.hasCompiledProject)(tempProject) && !recompile) {
                    script.log(`\n{red-fg}Using previous compliation...{/}`);
                    return;
                }
                script.log(`{cyan-fg}{bold}Compiling Project ${tempProject.name}@${tempProject.version.version} with InfinityMint@${(0, helpers_1.getInfinityMintVersion)()}{/}\n`);
                let verify = yield (0, web3_1.always)('verify', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    var _h, _j, _k, _l, _m;
                    let errors = [];
                    let tempPaths = tempProject.javascript &&
                        tempProject.old
                        ? ((_h = tempProject === null || tempProject === void 0 ? void 0 : tempProject.paths) === null || _h === void 0 ? void 0 : _h.indexes) ||
                            (tempProject === null || tempProject === void 0 ? void 0 : tempProject.paths) ||
                            []
                        : tempProject.paths;
                    tempPaths = Object.values(tempPaths || {});
                    let basePath = tempProject.javascript &&
                        tempProject.old
                        ? ((_j = tempProject === null || tempProject === void 0 ? void 0 : tempProject.paths) === null || _j === void 0 ? void 0 : _j.default) ||
                            ((_k = script.project.source) === null || _k === void 0 ? void 0 : _k.basePath) ||
                            {}
                        : ((_l = script.project.source) === null || _l === void 0 ? void 0 : _l.basePath) || {};
                    let tempAssets = [];
                    //unpack the assets array adding the section key
                    if (tempProject.assets instanceof Array) {
                        tempAssets = tempProject.assets || [];
                    }
                    else {
                        Object.keys(tempProject.assets || {}).forEach((section) => {
                            Object.values(tempProject.assets
                                ? tempProject.assets[section]
                                : {}).forEach((asset) => {
                                tempAssets.push(Object.assign(Object.assign({}, asset), { section: section }));
                            });
                        });
                    }
                    let baseAsset = ((_m = script.project.source) === null || _m === void 0 ? void 0 : _m.baseAsset) ||
                        {};
                    for (let i = 0; i < tempPaths.length; i++) {
                        let path = tempPaths[i];
                        path = Object.assign(Object.assign({}, basePath), path);
                        path.content = Object.assign(Object.assign({}, (basePath.content || {})), (path.content || {}));
                        path.valid = false;
                        script.log(`[Path ${i}] {yellow-fg}Verifying...{/yellow-fg}`);
                        script.infinityConsole.emit('preVerify', path, typeof path);
                        let pathErrors = (0, imports_1.verifyImport)(path, 'path', tempProject, script.log);
                        if (pathErrors !== true) {
                            script.log(`[Path ${i}] {red-fg}ERROR OCCURED{/}`);
                            errors = [...errors, ...pathErrors];
                        }
                        else {
                            path.valid = true;
                            script.log(`[Path ${i}] {green-fg}VERIFIED{/}`);
                        }
                        script.infinityConsole.emit('postVerify', path, typeof path);
                        tempPaths[i] = path;
                    }
                    for (let i = 0; i < tempAssets.length; i++) {
                        let asset = tempAssets[i];
                        asset = Object.assign(Object.assign({}, baseAsset), asset);
                        asset.content = Object.assign(Object.assign({}, (baseAsset.content || {})), (asset.content || {}));
                        asset.valid = false;
                        script.log(`{yellow-fg}[Asset ${i}] Verifying...{/yellow-fg}`);
                        script.infinityConsole.emit('preVerify', asset, typeof asset);
                        let assetErrors = (0, imports_1.verifyImport)(asset, 'asset', tempProject, script.log);
                        if (assetErrors !== true) {
                            script.log(`{red-fg}[Asset ${i}] ERROR OCCURED{/}`);
                            errors = [...errors, ...assetErrors];
                        }
                        else {
                            asset.valid = true;
                            script.log(`{green-fg}[Asset ${i}] VERIFIED{/}`);
                        }
                        script.infinityConsole.emit('postVerify', asset, typeof asset);
                        tempAssets[i] = asset;
                    }
                    //if errors are not length of zero then throw them!
                    if (errors.length !== 0)
                        throw errors;
                    //set it
                    tempProject.paths = tempPaths;
                    tempProject.assets = tempAssets;
                }));
                if (verify !== true) {
                    if (verify instanceof Array !== true)
                        throw verify;
                    throw new Error('failed verification of assets/paths. please check errors below.\n' +
                        verify.join('\n'));
                }
                let setup = yield (0, web3_1.always)('setup', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    let imports = tempProject.imports || {};
                    //here we need to loop through paths and see if we find settings
                    for (let i = 0; i < tempProject.paths.length; i++) {
                        script.infinityConsole.emit('preCompileSetup', tempProject.paths[i], typeof tempProject.paths[i]);
                        script.log(`[Path ${i}] {yellow-fg}Setting up...{/}`);
                        imports = Object.assign(Object.assign({}, imports), (yield (0, imports_1.setupProjectImport)(tempProject, tempProject.paths[i], script.infinityConsole, script.log)));
                        script.log(`[Path ${i}] {green-fg}VERIFIED{/}`);
                        tempProject.paths[i].pathId = i;
                        tempProject.paths[i].compiled = true;
                        script.infinityConsole.emit('postCompileSetup', tempProject.paths[i], typeof tempProject.paths[i]);
                    }
                    //here we need to loop through assets as well
                    if (tempProject.assets) {
                        if (tempProject.assets instanceof Array) {
                            for (let i = 0; i < tempProject.assets.length; i++) {
                                script.infinityConsole.emit('preCompileSetup', tempProject.assets[i], typeof tempProject.assets[i]);
                                script.log(`[Asset ${i}] {yellow-fg}Setting up...{/}`);
                                imports = Object.assign(Object.assign({}, imports), (yield (0, imports_1.setupProjectImport)(tempProject, tempProject.assets[i], script.infinityConsole, script.log)));
                                script.log(`[Asset ${i}] {green-fg}VERIFIED{/}`);
                                tempProject.assets[i].assetId = i + 1; //asset ids start counting from 1 as asset id 0 is null asset
                                tempProject.assets[i].compiled = true; //asset ids start counting from 1 as asset id 0 is null asset
                                script.infinityConsole.emit('postCompileSetup', tempProject.assets[i], typeof tempProject.assets[i]);
                            }
                        }
                        else {
                            throw new Error('assets should be flat by this point');
                        }
                    }
                    //replace double slashes with single slashes in each member of imports
                    Object.keys(imports).forEach((key) => {
                        imports[key] = imports[key].replace(/\/\//g, '/');
                    });
                    tempProject.imports = imports;
                    tempProject.compiled = true;
                }));
                if (setup !== true)
                    throw setup;
            }));
            if (result !== true)
                throw result;
            let links = yield (0, web3_1.action)('buildLinks', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                script.log(`\n{cyan-fg}{bold}Compiling Links...{/}\n`);
                let projectLinks = tempProject.links || {};
                let newLinks = deploymentLinks.filter((link) => link.isImportant());
                //find links from the project links
                Object.values(projectLinks).forEach((value) => {
                    let link = value;
                    if (link === null)
                        return;
                    if (link === undefined)
                        return;
                    //if the link is already in the default links
                    if (deploymentLinks.filter((defaultLink) => defaultLink.getLinkKey() === link.key).length > 0) {
                        let newLink = deploymentLinks.filter((defaultLink) => defaultLink.getLinkKey() === link.key)[0];
                        newLink.setLink(Object.assign(Object.assign({}, newLink.getLink()), link));
                        //add the link to the new links
                        newLinks.push(newLink);
                    }
                    else {
                        //adding implicit deployment links
                        script.log(`\t{cyan-fg}Adding Implicit Deployment Link => ${link.contract || link.key}{/}`);
                        let newLink = new deployments_1.InfinityMintDeployment(null, link.contract || link.key, script.infinityConsole.network.name, tempProject, script.infinityConsole);
                        newLink.setLink(link);
                        newLinks.push(newLink);
                    }
                });
                newLinks.sort((a, b) => b.getIndex() - a.getIndex());
                script.log(`\n{cyan-fg}{bold}Compiling ${Object.keys(newLinks).length} InfinityLinks...{/}`);
                //compile all the links
                for (let i = 0; i < newLinks.length; i++) {
                    let link = newLinks[i];
                    let artifact = yield link.getArtifact();
                    tempProject.links = tempProject.links || {};
                    tempProject.links[link.getLinkKey()] = Object.assign(Object.assign({}, link.getLink()), { contract: link.getContractName(), index: i, name: link.getLink().name || link.getContractName(), abi: artifact.abi, bytecode: artifact.bytecode });
                    script.log(`\t{cyan-fg}new link => ${link.getLinkKey()}[${i}]{/}`);
                }
            }));
            if (links !== true)
                throw links;
            let post = yield (0, web3_1.action)('post', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                var _o, _p;
                let sectionKeys = [];
                if (!tempProject.meta)
                    tempProject.meta = {
                        names: {},
                        assets: {
                            sections: [],
                        },
                    };
                //get all the section keys
                if (tempProject.assets instanceof Array) {
                    tempProject.assets.forEach((asset) => {
                        if (sectionKeys.includes(asset.section))
                            return;
                        sectionKeys.push(asset.section);
                    });
                }
                else {
                    Object.keys(tempProject.assets || {}).forEach((section) => {
                        if (sectionKeys.includes(section))
                            return;
                        sectionKeys.push(section);
                    });
                }
                let names = {};
                (_p = (_o = tempProject.settings) === null || _o === void 0 ? void 0 : _o.names) === null || _p === void 0 ? void 0 : _p.forEach((name) => {
                    names[name] = name;
                });
                tempProject.meta.names = names;
                tempProject.meta.assets.sections = sectionKeys;
            }));
            if (post !== true)
                throw post;
            let buildImports = yield (0, web3_1.action)('buildImports', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                var _q;
                let imports = tempProject.imports || {};
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
                tempProject.bundles = {
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
                    tempProject.bundles.imports[importCache.keys[file]] = path;
                    rawBundle[location] = yield fs_1.default.promises.readFile(path.dir + '/' + path.base);
                    tempProject.bundles.imports[importCache.keys[file]].bundle =
                        location;
                    script.log(`\t{cyan-fg}Read => ${location}{/}`);
                })));
                //build a zip file out of each member of the raw bundle
                let zip = new jszip_1.default();
                Object.keys(rawBundle).forEach((key) => {
                    script.log(`\t\t{green-fg}Zipping => ${key}{/}`);
                    zip.file(key, rawBundle[key]);
                });
                let projectFile = (0, projects_1.getProjectName)(tempProject, (_q = tempProject.version) === null || _q === void 0 ? void 0 : _q.version);
                script.log(`\t\t{green-fg}Zipping => ${projectFile}.json{/}`);
                zip.file(projectFile + '.json', JSON.stringify(tempProject));
                let source = tempProject.source.dir + '/' + tempProject.source.base;
                zip.file(tempProject.name + tempProject.source.ext, fs_1.default.readFileSync(source));
                script.log(`\t\t{green-fg}Zipping => ${projectFile + tempProject.source.ext}{/}`);
                let zipBuffer = yield zip.generateAsync({ type: 'nodebuffer' });
                script.log(`\t{cyan-fg}Saving Bundle...{/}`);
                if (!fs_1.default.existsSync((0, helpers_1.cwd)() + '/projects/bundles/'))
                    fs_1.default.mkdirSync((0, helpers_1.cwd)() + '/projects/bundles/');
                yield fs_1.default.promises.writeFile(`${(0, helpers_1.cwd)()}/projects/bundles/${(0, projects_1.getFullyQualifiedName)(tempProject)}.bundle`, zipBuffer);
                let zippedSize = zipBuffer.length / 1024;
                script.log('{green-fg}Bundle Wrote Successfully{/}');
                script.log(`\t{cyan-fg}Bundle Size  => ${(zippedSize / 1024).toFixed(2)}mb {/}`);
            }));
            if (buildImports !== true)
                throw buildImports;
            if (uploadBundle && (0, ipfs_1.isAllowingIPFS)()) {
                let upload = yield (0, web3_1.action)('uploadBundle', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    let bundle = yield fs_1.default.promises.readFile(`${(0, helpers_1.cwd)()}/projects/bundles/${(0, projects_1.getFullyQualifiedName)(tempProject)}.bundle`);
                    let bundleHash = yield script.infinityConsole.IPFS.add(bundle, 'index.zip');
                    let session = (0, helpers_1.readGlobalSession)();
                    script.log(`\n{cyan-fg}{bold}Uploaded Bundle to IPFS => ${bundleHash}{/}`);
                    session.environment.bundles = session.environment.bundles || {};
                    session.environment.bundles[(0, projects_1.getFullyQualifiedName)(tempProject)] = {
                        hash: bundleHash,
                        size: bundle.length,
                    };
                    tempProject.meta.bundle = bundleHash;
                }));
                if (upload !== true)
                    throw upload;
            }
            //copy the project from the temp projects folder to the projects folder, will always run regardless of it calling action and not always
            let copy = yield (0, web3_1.action)('copyProject', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                script.log('\n{cyan-fg}Copying Project...{/}');
                let projectLocation = `${(0, helpers_1.cwd)()}/projects/compiled/${(0, projects_1.getFullyQualifiedName)(tempProject)}.json`;
                let tempLocation = `${(0, helpers_1.cwd)()}/temp/projects/${(0, projects_1.getFullyQualifiedName)(tempProject)}.compiled.temp.json`;
                fs_1.default.copyFileSync(tempLocation, projectLocation);
                script.log(`\t => ${projectLocation}{/}`);
            }));
            //everything changed in the project past the copy action will not be saved to disk
            if (copy !== true)
                throw copy;
            script.log(`\n{cyan-fg}{bold}Removing Temp Project File{/}\n`);
            (0, projects_1.removeTempCompliledProject)(tempProject, (_d = tempProject.version) === null || _d === void 0 ? void 0 : _d.version);
            if (uploadBundle && tempProject.meta.bundle) {
                script.log(`\n{green-fg}{bold}Bundle Uploaded To IPFS => ${tempProject.meta.bundle}{/}`);
                script.log(`You can now access this bundle (and share it with others) from\n\thttps://ipfs.ip/ips/${tempProject.meta.bundle}}`);
                script.log(`You can also execute\n\tnpx infinitymint downloadBundle --hash ${tempProject.meta.bundle}\n\t\t{gray-fg}to download the bundle to your local machine and install it into InfinityMint.{/gray-fg}`);
            }
            script.log('\n{green-fg}{bold}Compilation Successful{/}');
            script.log(`\tProject: ${tempProject.name}`);
            script.log(`\tVersion: ${tempProject.version.version} (${tempProject.version.tag})`);
            script.log('{gray-fg}{bold}You can now go ahead and {cyan-fg}deploy this project!{/}');
            return true;
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
            {
                name: 'uploadBundle',
                type: 'boolean',
                value: true,
                optional: true,
            },
            {
                name: 'continuePrevious',
                type: 'boolean',
                value: true,
                optional: true,
            },
            {
                name: 'recompile',
                type: 'boolean',
                value: false,
                optional: true,
            },
        ],
    };
    exports.default = compile;
});
//# sourceMappingURL=compileProject.js.map