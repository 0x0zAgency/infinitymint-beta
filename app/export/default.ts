import {
    Gem,
    InfinityMintDeployedProject,
    InfinityMintExportScript,
    InfinityMintExportScriptParameters,
} from '../interfaces';
import fs from 'fs';
import {
    getDeploymentClasses,
    getProjectDeploymentClasses,
} from '../deployments';
import { cwd, getExportLocation, makeDirectories, warning } from '../helpers';
import { getProjectFullName } from '../projects';
import JSZip from 'jszip';
import { readImportCache } from '../imports';
import { logDirect } from 'infinitymint/dist/app/helpers';

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
    if (location[0] !== '/') location = '/' + location;
    if (location[location.length - 1] !== '/') location = location + '/';
    Object.keys(tokens).forEach((key) => {
        switch (key) {
            case 'projectName':
                location = location
                    .split(tokens[key])
                    .join(script.project.name);
                break;
            case 'projectVersion':
                location = location
                    .split(tokens[key])
                    .join(script.project.version.version);
                break;
            case 'deploymentNetwork':
                location = location
                    .split(tokens[key])
                    .join(script.infinityConsole.getCurrentNetwork().name);
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
        let location;

        if (script.location.indexOf(cwd()) === -1) {
            location = cwd() + '/' + script.location;
        } else location = script.location;

        if (location[location.length - 1] !== '/') location = location + '/';

        if (!fs.existsSync(location))
            throw new Error('Export location does not exist: ' + location);

        let config = script.config;
        let project = script.project;
        let ignorePublic = script.ignorePublic;
        let useBundle = script.useBundle;
        let useGems = script.useGems;

        publicFolder =
            script.publicFolder ||
            getExportLocation('public', script.exportScript.roots);

        if (publicFolder[publicFolder.length - 1] !== '/')
            publicFolder = publicFolder + '/';

        let deployments = await getProjectDeploymentClasses(
            project,
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
                    script.exportScript.roots
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
                            script.infinityConsole.getCurrentNetwork().name
                        }/${getProjectFullName(
                            project
                        )}/${deployment.getContractName()}.json`,
                    path + deployment.getContractName() + '.json'
                );
            }
        }

        //Copy over project to public folder
        if (!ignorePublic) {
            let projectLocation = getExportLocation(
                'projects',
                script.exportScript.roots
            );

            if (!projectLocation) throw new Error('Project location not found');

            let path = projectLocation.location;
            if (projectLocation.usePublic)
                path = location + publicFolder + projectLocation.location;

            if (projectLocation.useRoot)
                path = location + projectLocation.location;

            path = replaceTokens(script, path);

            if (!fs.existsSync(path)) makeDirectories(path);

            if (projectLocation.onlyName) {
                script.log(`Writing ${path}${project.name}.json`);
                fs.writeFileSync(
                    path + `${project.name}.json`,
                    JSON.stringify(project)
                );
            } else {
                script.log(
                    `Writing ${path}${getProjectFullName(project)}.json`
                );
                fs.writeFileSync(
                    path + `${getProjectFullName(project)}.json`,
                    JSON.stringify(project)
                );
            }
        }

        let deployedProjectLocation = getExportLocation(
            'deployedProjects',
            script.exportScript.roots
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
            script.log(`Writing ${path}${project.name}.json`);
            fs.writeFileSync(
                path + `${project.name}.json`,
                JSON.stringify(project)
            );
        } else {
            script.log(`Writing ${path}${getProjectFullName(project)}.json`);
            fs.writeFileSync(
                path + `${getProjectFullName(project)}.json`,
                JSON.stringify(project)
            );
        }

        if (!ignorePublic) {
            if (useBundle) {
                let zip = await JSZip.loadAsync(
                    fs.readFileSync(
                        cwd() +
                            '/projects/bundles/' +
                            getProjectFullName(project) +
                            '.bundle'
                    )
                );

                script.log(
                    `Unpacking /projects/bundles/${getProjectFullName(
                        project
                    )}.bundle`
                );
                let importsLocation = getExportLocation(
                    'imports',
                    script.exportScript.roots
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
                                script.debugLog(
                                    `Creating directory ${path + name}`
                                );
                                fs.mkdirSync(path + name);
                            }

                            return;
                        }

                        //remove the file name from the path
                        let pathName = name.substring(0, name.lastIndexOf('/'));
                        //check if the path exists
                        if (!fs.existsSync(path + pathName)) {
                            script.debugLog(
                                `Creating directory ${path + name}`
                            );
                            makeDirectories(path + pathName);
                        }

                        let data = await file.async('nodebuffer');
                        script.log(`Writing ${key}`);
                        fs.writeFileSync(path + name, data);
                    })
                );
            } else {
                let importsLocation = getExportLocation(
                    'imports',
                    script.exportScript.roots
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
            location: 'projects/',
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
