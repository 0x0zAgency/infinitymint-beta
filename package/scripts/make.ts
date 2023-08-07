import {
    getFullyQualifiedName,
    hasCompiledProject,
    hasDeployedProject,
    getCompiledProject,
    getDeployedProject,
} from '../app/projects';
import { cwd, getArgumentValues, warning } from '../app/helpers';
import {
    InfinityMintCompiledProject,
    InfinityMintDeployedProject,
    InfinityMintProject,
    InfinityMintScript,
} from '../app/interfaces';
import fs from 'fs';
import path from 'path';

const make: InfinityMintScript = {
    name: 'Make',
    description:
        'Will compile and deploy your project to the current network and then export it',
    execute: async (script) => {
        if (!script.project)
            throw new Error(
                'No project found, please specify a project with the --project flag'
            );

        let version = script.args.target?.value || '1.0.0';
        let project:
            | InfinityMintCompiledProject
            | InfinityMintProject
            | InfinityMintDeployedProject =
            script.project.compiledProject || script.project.source;

        let { recompile, redeploy, report, enableMinter, save, dontExport } =
            getArgumentValues(script.args);

        if (
            save === undefined &&
            script.infinityConsole.network.name !== 'hardhat'
        )
            save = true;

        if (recompile && hasCompiledProject(project, version)) {
            let compiledProject = getCompiledProject(project, version);
            script.log(
                `Removing compiled project => ${getFullyQualifiedName(
                    project,
                    version || compiledProject?.version?.version
                )}`
            );
            fs.unlinkSync(
                cwd() +
                    '/projects/compiled/' +
                    getFullyQualifiedName(
                        project,
                        version || compiledProject.version.version
                    ) +
                    '.json'
            );
        }

        if (!hasCompiledProject(project, version)) {
            script.log(
                `\n{magenta-fg}{bold}Compiling project => ${getFullyQualifiedName(
                    project,
                    version
                )}{/}\n`
            );
            await script.infinityConsole.executeScript('compileProject', {
                ...script.args,
            });
        } else
            script.log(
                `\n{magenta-fg}{bold}Project ${getFullyQualifiedName(
                    project,
                    version
                )} has already been compiled, skipping compilation{/}\n`
            );

        project = getCompiledProject(project, version);

        if (
            redeploy &&
            hasDeployedProject(project, script.infinityConsole.network.name)
        ) {
            let deployedProject = getDeployedProject(
                project,
                script.infinityConsole.network.name,
                version
            );
            script.log(
                `Removing deployed project => ${getFullyQualifiedName(
                    project,
                    version || deployedProject.version.version
                )}`
            );
            fs.unlinkSync(
                cwd() +
                    '/projects/deployed/' +
                    script.infinityConsole.network.name +
                    '/' +
                    getFullyQualifiedName(
                        project,
                        version || deployedProject.version.version,
                        script.infinityConsole.network.name
                    ) +
                    '.json'
            );
        }

        if (
            !hasDeployedProject(
                project,
                script.infinityConsole.network.name,
                version
            )
        ) {
            script.log(
                `\n{magenta-fg}{bold}Deploying project => ${getFullyQualifiedName(
                    project
                )}{/}\n`
            );
            await script.infinityConsole.executeScript('deployProject', {
                ...script.args,
            });
        }

        if (save && !dontExport) {
            script.log(
                `\n{magenta-fg}{bold}Exporting project => ${getFullyQualifiedName(
                    project,
                    version
                )}{/}\n`
            );
            await script.infinityConsole.executeScript('exportProject', {
                ...script.args,
            });
        } else if (!save && script.infinityConsole.network.name === 'hardhat') {
            script.log(''); //newline
            warning(
                'You are currently on the hardhat network and the save flag is not present. you will need to deploy your project to a testnet or mainnet or set save flag to true'
            );
        }

        if (enableMinter && save) {
            await script.infinityConsole.executeScript('call', {
                project: {
                    value: script.args?.project?.value,
                },
                network: {
                    value: script.args?.network?.value,
                },
                version: {
                    value: script.args?.version?.value,
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
        } else warning('please add --save flag if you wish to enable minter');

        script.log(
            fs.readFileSync(
                path
                    .join(__dirname, '../resources/ascended.txt')
                    .replace('dist/', ''),
                {
                    encoding: 'utf-8',
                }
            )
        );

        if (report)
            await script.infinityConsole.executeScript('report', {
                ...script.args,
            });
    },
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
export default make;
