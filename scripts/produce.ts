import {
    getCurrentProject,
    getProject,
    getProjectFullName,
    hasCompiledProject,
    hasDeployedProject,
    getCompiledProject,
    getDeployedProject,
} from '../app/projects';
import { cwd, warning } from '../app/helpers';
import { InfinityMintScript } from '../app/interfaces';
import fs from 'fs';

const produce: InfinityMintScript = {
    name: 'Produce',
    description:
        'Will compile and deploy your project to the current network and then export it',
    execute: async (script) => {
        let project;
        if (script.args.project?.value)
            project = getProject(script.args.project.value);
        else project = getCurrentProject();

        if (!project)
            throw new Error(
                'No project found, please specify a project with the --project flag'
            );

        let location = script.args.location
            ? script.args.location.value
            : cwd();
        let exportScript = script.args?.exportScript
            ? script.args.exportScript.value
            : 'default';
        let useBundle = script.args.useBundle?.value
            ? script.args.useBundle.value
            : true;
        let useGems = script.args.useGem?.value
            ? script.args.useGem.value
            : true;
        let recompile = script.args.recompile?.value
            ? script.args.recompile.value
            : false;
        let redeploy = script.args.redeploy?.value
            ? script.args.redeploy.value
            : false;
        let verion = script.args.version?.value
            ? script.args.version.value
            : false;

        if (recompile && hasCompiledProject(project)) {
            let compiledProject = getCompiledProject(project);
            script.log(
                `Removing compiled project: ${getProjectFullName(
                    project,
                    compiledProject.version.version
                )}`
            );
            fs.unlinkSync(
                cwd() +
                    '/projects/compiled/' +
                    getProjectFullName(
                        project,
                        compiledProject.version.version
                    ) +
                    '.json'
            );
        }

        if (!hasCompiledProject(project)) {
            script.log(
                `\n{magenta-fg}{bold}Compiling project => ${getProjectFullName(
                    project
                )}{/}\n`
            );
            await script.infinityConsole.executeScript('compileProject', {
                project: {
                    name: 'project',
                    value: getProjectFullName(project),
                },
            });
        } else
            script.log(
                `\n{magenta-fg}{bold}Project ${getProjectFullName(
                    project
                )} has already been compiled, skipping compilation{/}\n`
            );

        project = getCompiledProject(project);

        if (
            redeploy &&
            hasDeployedProject(
                project,
                script.infinityConsole.getCurrentNetwork().name
            )
        ) {
            let deployedProject = getDeployedProject(
                project,
                script.infinityConsole.getCurrentNetwork().name
            );
            script.log(
                `Removing deployed project: ${getProjectFullName(
                    project,
                    deployedProject.version.version
                )}`
            );
            fs.unlinkSync(
                cwd() +
                    '/projects/deployed/' +
                    script.infinityConsole.getCurrentNetwork().name +
                    '/' +
                    getProjectFullName(
                        project,
                        deployedProject.version.version
                    ) +
                    '.json'
            );

            let allowedNetworks = ['hardhat', 'ganache'];

            if (
                allowedNetworks.includes(
                    script.infinityConsole.getCurrentNetwork().name
                )
            ) {
                script.log(
                    `Removing deployments folder for ${getProjectFullName(
                        project,
                        deployedProject.version.version
                    )}`
                );
                //remove deployments folder
                await fs.promises.rmdir(
                    cwd() +
                        '/deployments/' +
                        script.infinityConsole.getCurrentNetwork().name +
                        '/' +
                        getProjectFullName(project) +
                        '/',
                    {
                        recursive: true,
                    }
                );
            }
        }

        if (
            !hasDeployedProject(
                project,
                script.infinityConsole.getCurrentNetwork().name
            )
        ) {
            script.log(
                `\n{magenta-fg}{bold}Deploying project => ${getProjectFullName(
                    project
                )}{/}\n`
            );
            await script.infinityConsole.executeScript('deployProject', {
                ...script.args,
                project: {
                    name: 'project',
                    value: getProjectFullName(project),
                },
            });
        }

        if (
            script.infinityConsole.getCurrentNetwork().name !== 'hardhat' ||
            script.args['save']?.value !== false
        ) {
            script.log(
                `\n{magenta-fg}{bold}Exporting project => ${getProjectFullName(
                    project
                )}{/}\n`
            );
            await script.infinityConsole.executeScript('exportProject', {
                project: {
                    name: 'project',
                    value: getProjectFullName(project),
                },
                location: {
                    name: 'location',
                    value: location,
                },
                exportScript: {
                    name: 'exportScript',
                    value: exportScript,
                },
                useBundle: {
                    name: 'useBundle',
                    value: useBundle,
                },
                useGems: {
                    name: 'useGems',
                    value: useGems,
                },
            });
        } else
            warning(
                'You are currently on the hardhat network and the save flag is not present. you will need to deploy your project to a testnet or mainnet or set save flag to true'
            );
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
    ],
};
export default produce;
