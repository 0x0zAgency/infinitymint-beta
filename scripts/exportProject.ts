import { cwd, isInfinityMint } from '../app/helpers';
import {
    getCurrentDeployedProject,
    getDeployedProject,
    getProject,
} from '../app/projects';
import {
    InfinityMintDeployedProject,
    InfinityMintExportScript,
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';

const exportProject: InfinityMintScript = {
    name: 'Export',
    description:
        'Exports a project to the specified location, will copy over styles, gems and anything else relating to the project',
    execute: async (script: InfinityMintScriptParameters) => {
        let project: InfinityMintDeployedProject;
        let location = script.args.location?.value || cwd();
        let exportScript = script.args?.exportScript?.value || 'default';

        if (exportScript === 'default')
            exportScript = isInfinityMint()
                ? cwd() + '/app/export/default'
                : cwd() + '/node_modules/infinitymint/dist/app/export/default';

        if (exportScript === 'classic')
            exportScript = isInfinityMint()
                ? cwd() + '/app/export/classic'
                : cwd() + '/node_modules//infinitymint/dist/app/export/classic';

        let useBundle = script.args.useBundle
            ? script.args.useBundle.value
            : true;
        let useGems = script.args.useGem?.value
            ? script.args.useGem.value
            : true;
        let publicFolder = script.args.publicFolder?.value
            ? script.args.publicFolder.value
            : 'public';
        let ignorePublic = script.args.ignorePublic?.value
            ? script.args.ignorePublic.value
            : false;

        if (script.args.project?.value)
            project = getDeployedProject(
                getProject(script.args.project.value),
                script.infinityConsole.getCurrentNetwork().name
            );
        else
            project = getCurrentDeployedProject(
                script.infinityConsole.getCurrentNetwork().name
            );

        if (!project)
            throw new Error(
                'No project found, please specify a project with the --project flag'
            );

        let exportScriptFile = require(exportScript.indexOf(cwd()) === -1
            ? '/../' + exportScript
            : exportScript) as InfinityMintExportScript;

        exportScriptFile =
            (exportScriptFile as any)?.default || exportScriptFile;

        if (!exportScriptFile.export)
            throw new Error(
                'Export script does not have an export function, please check the script'
            );

        script.log(
            `{green-fg}Using export script{/} => ${
                exportScriptFile.name || exportScript
            }\n`
        );
        await exportScriptFile.export({
            ...script,
            project,
            location,
            exportScript: exportScriptFile,
            useBundle,
            useGems,
            publicFolder,
            ignorePublic,
        });
    },
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
            name: 'useGems',
            type: 'boolean',
            optional: true,
        },
        {
            name: 'publicFolder',
            type: 'string',
            optional: true,
        },
        {
            name: 'ignorePublic',
            type: 'boolean',
            optional: true,
        },
    ],
};
export default exportProject;
