(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "fs", "../deployments", "../helpers", "../projects", "jszip", "../imports", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.replaceTokens = void 0;
    const tslib_1 = require("tslib");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const deployments_1 = require("../deployments");
    const helpers_1 = require("../helpers");
    const projects_1 = require("../projects");
    const jszip_1 = tslib_1.__importDefault(require("jszip"));
    const imports_1 = require("../imports");
    const path_1 = tslib_1.__importDefault(require("path"));
    const tokens = {
        projectName: '%projectName%',
        projectVersion: '%projectVersion%',
        deploymentNetwork: '%deploymentNetwork%',
        gemName: '%gemName%',
    };
    let publicFolder;
    const replaceTokens = (script, location, currentGem) => {
        //if we arent windows add a slash to the beginning
        if (location[0] !== '/' && !(0, helpers_1.isWindows)())
            location = '/' + location;
        if (location[location.length - 1] !== '/')
            location = location + '/';
        Object.keys(tokens).forEach((key) => {
            var _a, _b;
            switch (key) {
                case 'projectName':
                    location = location
                        .split(tokens[key])
                        .join(script.project.source.name);
                    break;
                case 'projectVersion':
                    location = location
                        .split(tokens[key])
                        .join((_b = (_a = script.project.getDeployedProject()) === null || _a === void 0 ? void 0 : _a.version) === null || _b === void 0 ? void 0 : _b.version);
                    break;
                case 'deploymentNetwork':
                    location = location
                        .split(tokens[key])
                        .join(script.infinityConsole.network.name);
                    break;
                case 'gemName':
                    if (currentGem)
                        location = location
                            .split(tokens[key])
                            .join(currentGem.name);
                    break;
            }
        });
        return location;
    };
    exports.replaceTokens = replaceTokens;
    const defaultExport = {
        name: 'Default',
        export: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let location = script.location;
            //resolve the location to the actual export location
            if (location.startsWith('../') || location.startsWith('/../'))
                location = path_1.default.resolve(path_1.default.join((0, helpers_1.cwd)(), location));
            if (location[location.length - 1] !== '/')
                location = location + '/';
            if (!fs_1.default.existsSync(location))
                throw new Error('Export location does not exist: ' + location);
            let deployedProject = script.project.getDeployedProject();
            let { project, ignorePublic, useGems, useBundle, publicFolder } = script;
            if (publicFolder && publicFolder[publicFolder.length - 1] !== '/')
                publicFolder = publicFolder + '/';
            let deployments = yield (0, deployments_1.loadProjectDeploymentClasses)(deployedProject, script.infinityConsole);
            //copy over deployments
            for (let i = 0; i < deployments.length; i++) {
                let deployment = deployments[i];
                if (!deployment.hasDeployed()) {
                    (0, helpers_1.warning)('Deployment has not been deployed: ' +
                        deployment.getContractName());
                    continue;
                }
                if (!ignorePublic) {
                    // Copy over deployment to the public folder
                    let deploymentLocation = (0, helpers_1.getExportLocation)('deployments', defaultExport.roots);
                    if (deploymentLocation.usePublic)
                        if (!fs_1.default.existsSync(location + publicFolder))
                            (0, helpers_1.makeDirectories)(location + publicFolder);
                    if (!deploymentLocation)
                        throw new Error('Deployment location not found');
                    let path = deploymentLocation.location;
                    if (deploymentLocation.usePublic)
                        path =
                            location + publicFolder + deploymentLocation.location;
                    if (deploymentLocation.useRoot)
                        path = location + deploymentLocation.location;
                    path = (0, exports.replaceTokens)(script, path);
                    if (!fs_1.default.existsSync(path))
                        (0, helpers_1.makeDirectories)(path);
                    script.log(`[${i}] => Writing ${path}${deployment.getContractName()}.json`);
                    fs_1.default.copyFileSync((0, helpers_1.cwd)() +
                        `/deployments/${script.infinityConsole.network.name}/${script.project.getNameAndVersion()}/${deployment.getContractName()}.json`, path + deployment.getContractName() + '.json');
                }
            }
            //Copy over project to public folder
            if (!ignorePublic) {
                script.log(`\n{cyan-fg}{bold}Copying Project{/}\n`);
                let compiledProjectLocation = (0, helpers_1.getExportLocation)('projects', defaultExport.roots);
                let compiledProject = (0, projects_1.getCompiledProject)(script.project.source, deployedProject.version.version);
                if (!compiledProjectLocation)
                    throw new Error('Project location not found');
                let path = compiledProjectLocation.location;
                if (compiledProjectLocation.usePublic)
                    path =
                        location + publicFolder + compiledProjectLocation.location;
                if (compiledProjectLocation.useRoot)
                    path = location + compiledProjectLocation.location;
                path = (0, exports.replaceTokens)(script, path);
                if (!fs_1.default.existsSync(path))
                    (0, helpers_1.makeDirectories)(path);
                if (compiledProjectLocation.onlyName) {
                    script.log(`Writing compiled ${path}${compiledProject.name}.json`);
                    fs_1.default.writeFileSync(path + `${compiledProject.name}.json`, JSON.stringify(compiledProject));
                }
                else {
                    script.log(`Writing ${path}${(0, projects_1.getFullyQualifiedName)(compiledProject, compiledProject.version.version || '1.0.0')}.json`);
                    fs_1.default.writeFileSync(path +
                        `${(0, projects_1.getFullyQualifiedName)(compiledProject, compiledProject.version.version || '1.0.0')}.json`, JSON.stringify(compiledProject));
                }
            }
            let deployedProjectLocation = (0, helpers_1.getExportLocation)('deployedProjects', defaultExport.roots);
            if (!deployedProjectLocation)
                throw new Error('Deployed project location not found');
            let path = deployedProjectLocation.location;
            if (deployedProjectLocation.usePublic)
                path = location + publicFolder + deployedProjectLocation.location;
            if (deployedProjectLocation.useRoot)
                path = location + deployedProjectLocation.location;
            //nest project inside the src folder
            path = (0, exports.replaceTokens)(script, path);
            if (!fs_1.default.existsSync(path))
                (0, helpers_1.makeDirectories)(path);
            if (deployedProjectLocation.onlyName) {
                script.log(`Writing ${path}${deployedProject.name}.json`);
                fs_1.default.writeFileSync(path + `${deployedProject.name}.json`, JSON.stringify(deployedProject));
            }
            else {
                script.log(`Writing ${path}${script.project.getFullyQualifiedName()}.json`);
                fs_1.default.writeFileSync(path + `${script.project.getFullyQualifiedName()}.json`, JSON.stringify(deployedProject));
            }
            if (!ignorePublic) {
                if (useBundle) {
                    script.log(`\n{cyan-fg}{bold}Unpacking Bundle{/}\n`);
                    let bundlePath = (0, helpers_1.cwd)() +
                        '/projects/bundles/' +
                        script.project.getNameAndVersion() +
                        '.bundle';
                    if (!fs_1.default.existsSync(bundlePath))
                        bundlePath =
                            (0, helpers_1.cwd)() +
                                '/projects/bundles/' +
                                script.project.getNameAndVersion(false) +
                                '@1.0.0.bundle';
                    let zip = yield jszip_1.default.loadAsync(fs_1.default.readFileSync(bundlePath));
                    let importsLocation = (0, helpers_1.getExportLocation)('imports', defaultExport.roots);
                    let path = importsLocation.location;
                    if (importsLocation.usePublic)
                        path = location + publicFolder + importsLocation.location;
                    if (importsLocation.useRoot)
                        path = location + importsLocation.location;
                    if (!fs_1.default.existsSync(path))
                        (0, helpers_1.makeDirectories)(path);
                    path = (0, exports.replaceTokens)(script, path);
                    yield Promise.all(Object.keys(zip.files).map((key) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                        let file = zip.file(key);
                        if (!file)
                            return;
                        let name = file.name;
                        //skip project json
                        if (name === 'project.json')
                            return;
                        if (name[0] === '/')
                            name = name.substring(1);
                        if (file.dir) {
                            if (!fs_1.default.existsSync(path + name)) {
                                script.log(`Creating directory => ${path + name}`);
                                fs_1.default.mkdirSync(path + name);
                            }
                            return;
                        }
                        //remove the file name from the path
                        let pathName = name.substring(0, name.lastIndexOf('/'));
                        //check if the path exists
                        if (!fs_1.default.existsSync(path + pathName)) {
                            script.log(`Creating directory => ${path + name}`);
                            (0, helpers_1.makeDirectories)(path + pathName);
                        }
                        let data = yield file.async('nodebuffer');
                        script.log(`Writing => ${key}`);
                        fs_1.default.writeFileSync(path + name, data);
                    })));
                }
                else {
                    let importsLocation = (0, helpers_1.getExportLocation)('imports', defaultExport.roots);
                    let importsCache = (0, imports_1.readImportCache)();
                    script.log('Copying over imports');
                }
            }
        }),
        roots: [
            {
                type: 'imports',
                usePublic: true,
                location: 'imports/',
            },
            {
                type: 'projects',
                location: 'projects/compiled/',
                usePublic: true,
            },
            {
                type: 'deployedProjects',
                usePublic: true,
                location: 'projects/deployed/',
            },
            {
                type: 'public',
                location: '/public/',
            },
            {
                type: 'assets',
                usePublic: true,
                location: 'assets/%projectName%@%projectVersion%/',
            },
            {
                type: 'paths',
                usePublic: true,
                location: 'assets/%projectName%@%projectVersion%/paths/',
            },
            {
                type: 'deployments',
                usePublic: true,
                location: 'deployments/%deploymentNetwork%/%projectName%@%projectVersion%/',
            },
            {
                type: 'gemDeployments',
                usePublic: true,
                location: 'deployments/%deploymentNetwork%/%projectName%@%projectVersion%/%gemName%/',
            },
            {
                type: 'components',
                location: '/src/components/',
            },
            {
                type: 'pages',
                location: '/src/pages/',
            },
            {
                type: 'styles',
                useRoot: true,
                location: 'styles/',
            },
            {
                type: 'root',
                location: 'src/content/',
            },
            {
                type: 'images',
                useRoot: true,
                location: 'images/',
            },
            {
                type: 'gems',
                useRoot: true,
                location: 'gems/',
            },
            {
                type: 'gemPages',
                useRoot: true,
                location: 'gems/%gemName%/pages',
            },
            {
                type: 'gemComponents',
                useRoot: true,
                location: 'gems/%gemName%/components',
            },
            {
                type: 'gemResources',
                useRoot: true,
                location: 'gems/%gemName%/resources',
            },
            {
                type: 'gemStyles',
                useRoot: true,
                location: 'gems/%gemName%/styles',
            },
            {
                type: 'fonts',
                useRoot: true,
                location: 'fonts/',
            },
        ],
        description: 'Default export script',
    };
    exports.default = defaultExport;
});
//# sourceMappingURL=default.js.map