import {
    Gem,
    InfinityMintExportScript,
    InfinityMintExportScriptParameters,
} from '../interfaces';
import fs from 'fs';
import { loadProjectDeploymentClasses } from '../deployments';
import {
    cwd,
    getExportLocation,
    isWindows,
    makeDirectories,
    warning,
} from '../helpers';
import { getCompiledProject, getFullyQualifiedName } from '../projects';
import JSZip from 'jszip';
import { readImportCache } from '../imports';
import pathEx from 'path';

const tokens = {
    projectName: '%projectName%',
    projectVersion: '%projectVersion%',
    deploymentNetwork: '%deploymentNetwork%',
    gemName: '%gemName%',
};

let publicFolder: string;

export const replaceTokens = (
    script: InfinityMintExportScriptParameters,
    location: string,
    currentGem?: Gem
) => {
    //if we arent windows add a slash to the beginning

    if (location[0] !== '/' && !isWindows()) location = '/' + location;
    if (location[location.length - 1] !== '/') location = location + '/';
    Object.keys(tokens).forEach((key) => {
        switch (key) {
            case 'projectName':
                location = location
                    .split(tokens[key])
                    .join(script.project.source.name);
                break;
            case 'projectVersion':
                location = location
                    .split(tokens[key])
                    .join(
                        script.project.getDeployedProject()?.version?.version
                    );
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

const defaultExport: InfinityMintExportScript = {
    name: 'Default',
    export: async (script) => {
        let location = script.location;

        //resolve the location to the actual export location
        if (location.startsWith('../') || location.startsWith('/../'))
            location = pathEx.resolve(pathEx.join(cwd(), location));
        if (location[location.length - 1] !== '/') location = location + '/';

        if (!fs.existsSync(location))
            throw new Error('Export location does not exist: ' + location);

        let deployedProject = script.project.getDeployedProject();
        let { project, ignorePublic, useGems, useBundle, publicFolder } =
            script;

        if (publicFolder && publicFolder[publicFolder.length - 1] !== '/')
            publicFolder = publicFolder + '/';

        let deployments = await loadProjectDeploymentClasses(
            deployedProject,
            script.infinityConsole
        );

        //copy over deployments
        for (let i = 0; i < deployments.length; i++) {
            let deployment = deployments[i];

            if (!deployment.hasDeployed()) {
                warning(
                    'Deployment has not been deployed: ' +
                        deployment.getContractName()
                );
                continue;
            }

            if (!ignorePublic) {
                // Copy over deployment to the public folder

                let deploymentLocation = getExportLocation(
                    'deployments',
                    defaultExport.roots
                );

                if (deploymentLocation.usePublic)
                    if (!fs.existsSync(location + publicFolder))
                        makeDirectories(location + publicFolder);

                if (!deploymentLocation)
                    throw new Error('Deployment location not found');

                let path = deploymentLocation.location;

                if (deploymentLocation.usePublic)
                    path =
                        location + publicFolder + deploymentLocation.location;

                if (deploymentLocation.useRoot)
                    path = location + deploymentLocation.location;

                path = replaceTokens(script, path);

                if (!fs.existsSync(path)) makeDirectories(path);

                script.log(
                    `[${i}] => Writing ${path}${deployment.getContractName()}.json`
                );
                fs.copyFileSync(
                    cwd() +
                        `/deployments/${
                            script.infinityConsole.network.name
                        }/${script.project.getNameAndVersion()}/${deployment.getContractName()}.json`,
                    path + deployment.getContractName() + '.json'
                );
            }
        }

        //Copy over project to public folder
        if (!ignorePublic) {
            script.log(`\n{cyan-fg}{bold}Copying Project{/}\n`);

            let compiledProjectLocation = getExportLocation(
                'projects',
                defaultExport.roots
            );
            let compiledProject = getCompiledProject(
                script.project.source,
                deployedProject.version.version
            );

            if (!compiledProjectLocation)
                throw new Error('Project location not found');

            let path = compiledProjectLocation.location;
            if (compiledProjectLocation.usePublic)
                path =
                    location + publicFolder + compiledProjectLocation.location;

            if (compiledProjectLocation.useRoot)
                path = location + compiledProjectLocation.location;

            path = replaceTokens(script, path);

            if (!fs.existsSync(path)) makeDirectories(path);

            if (compiledProjectLocation.onlyName) {
                script.log(
                    `Writing compiled ${path}${compiledProject.name}.json`
                );
                fs.writeFileSync(
                    path + `${compiledProject.name}.json`,
                    JSON.stringify(compiledProject)
                );
            } else {
                script.log(
                    `Writing ${path}${getFullyQualifiedName(
                        compiledProject,
                        compiledProject.version.version || '1.0.0'
                    )}.json`
                );
                fs.writeFileSync(
                    path +
                        `${getFullyQualifiedName(
                            compiledProject,
                            compiledProject.version.version || '1.0.0'
                        )}.json`,
                    JSON.stringify(compiledProject)
                );
            }
        }

        let deployedProjectLocation = getExportLocation(
            'deployedProjects',
            defaultExport.roots
        );

        if (!deployedProjectLocation)
            throw new Error('Deployed project location not found');

        let path = deployedProjectLocation.location;
        if (deployedProjectLocation.usePublic)
            path = location + publicFolder + deployedProjectLocation.location;

        if (deployedProjectLocation.useRoot)
            path = location + deployedProjectLocation.location;

        //nest project inside the src folder
        path = replaceTokens(script, path);

        if (!fs.existsSync(path)) makeDirectories(path);

        if (deployedProjectLocation.onlyName) {
            script.log(`Writing ${path}${deployedProject.name}.json`);
            fs.writeFileSync(
                path + `${deployedProject.name}.json`,
                JSON.stringify(deployedProject)
            );
        } else {
            script.log(
                `Writing ${path}${script.project.getFullyQualifiedName()}.json`
            );
            fs.writeFileSync(
                path + `${script.project.getFullyQualifiedName()}.json`,
                JSON.stringify(deployedProject)
            );
        }

        if (!ignorePublic) {
            if (useBundle) {
                script.log(`\n{cyan-fg}{bold}Unpacking Bundle{/}\n`);

                let bundlePath =
                    cwd() +
                    '/projects/bundles/' +
                    script.project.getNameAndVersion() +
                    '.bundle';

                if (!fs.existsSync(bundlePath))
                    bundlePath =
                        cwd() +
                        '/projects/bundles/' +
                        script.project.getNameAndVersion(false) +
                        '@1.0.0.bundle';

                let zip = await JSZip.loadAsync(fs.readFileSync(bundlePath));
                let importsLocation = getExportLocation(
                    'imports',
                    defaultExport.roots
                );

                let path = importsLocation.location;
                if (importsLocation.usePublic)
                    path = location + publicFolder + importsLocation.location;

                if (importsLocation.useRoot)
                    path = location + importsLocation.location;

                if (!fs.existsSync(path)) makeDirectories(path);

                path = replaceTokens(script, path);

                await Promise.all(
                    Object.keys(zip.files).map(async (key) => {
                        let file = zip.file(key);

                        if (!file) return;
                        let name = file.name;

                        //skip project json
                        if (name === 'project.json') return;

                        if (name[0] === '/') name = name.substring(1);
                        if (file.dir) {
                            if (!fs.existsSync(path + name)) {
                                script.log(
                                    `Creating directory => ${path + name}`
                                );
                                fs.mkdirSync(path + name);
                            }

                            return;
                        }

                        //remove the file name from the path
                        let pathName = name.substring(0, name.lastIndexOf('/'));
                        //check if the path exists
                        if (!fs.existsSync(path + pathName)) {
                            script.log(`Creating directory => ${path + name}`);
                            makeDirectories(path + pathName);
                        }

                        let data = await file.async('nodebuffer');
                        script.log(`Writing => ${key}`);
                        fs.writeFileSync(path + name, data);
                    })
                );
            } else {
                let importsLocation = getExportLocation(
                    'imports',
                    defaultExport.roots
                );
                let importsCache = readImportCache();

                script.log('Copying over imports');
            }
        }
    },
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
            location:
                'deployments/%deploymentNetwork%/%projectName%@%projectVersion%/',
        },
        {
            type: 'gemDeployments',
            usePublic: true,
            location:
                'deployments/%deploymentNetwork%/%projectName%@%projectVersion%/%gemName%/',
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
export default defaultExport;
