import { isTypescript } from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';
import {
    getProjectVersions,
    createUpdate as create,
    hasUpdate,
} from '../app/updates';

const createUpdate: InfinityMintScript = {
    name: 'Create Update',
    description: 'Creates a new update for an InfinityMint project.',
    execute: async (script: InfinityMintScriptParameters) => {
        await script.infinityConsole.loadUpdates();
        let version = script.args?.target?.value;
        if (!version) {
            let versions = getProjectVersions(script.project.deployedProject);

            if (versions.length === 0 || !versions) version = '1.0.0';
            else {
                let dots = versions[0].split('.');
                version = parseInt(dots[0] + 1) + dots.slice(1).join('.');
            }
        }

        if (!version)
            throw new Error(
                'no version specified, please specify with --target <version>'
            );

        //make sure version conforms to semver
        if (!version.match(/\d+\.\d+\.\d+/))
            throw new Error('bad version format, must be semver (eg: ');

        let project =
            script.project?.deployedProject || script.project.compiledProject;

        if (
            hasUpdate(
                project,
                version,
                script.args?.global?.value
                    ? null
                    : project.network?.name ||
                          script.infinityConsole.network?.name
            )
        )
            throw new Error(`
            update ${version} already exists for project ${project.name} ${
                script.args?.global?.value
                    ? 'globally'
                    : 'on network ' +
                      (project.network?.name ||
                          script.infinityConsole.network?.name)
            }
            `);

        let update = create(
            project,
            version,
            script.args?.tag?.value,
            script?.args?.network?.value
                ? null ||
                      script.project.network ||
                      script.infinityConsole.network.name
                : null,
            !script.args?.dontSave?.value,
            isTypescript()
        );

        script.log('\n{green-fg}{bold}Succesfully Created Update{/}');
        script.log(`\tProject: ${update.name}`);
        script.log(`\tUpdate Tag: ${update.version?.tag}`);
        script.log(
            `\tVersion: ${update.version.version} (${update.version.tag})\n` +
                (update.network
                    ? `\tNetwork: ${update.network.name} (chainId:${update.network.chainId})`
                    : '\tNetwork: global (all networks)')
        );

        script.log(
            `\n{gray-fg}You can now edit your update in the /projects/update/ folder, then when you are ready you can run the update script to apply it{/}`
        );
    },

    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
        {
            name: 'target',
            type: 'string',
            optional: true,
        },
        {
            name: 'global',
            type: 'boolean',
            optional: true,
        },
        {
            name: 'network',
            type: 'string',
            optional: true,
        },
        {
            name: 'tag',
            type: 'string',
            optional: true,
        },
    ],
};

export default createUpdate;
