import {
    Dictionary,
    cwd,
    getArgumentValues,
    isEnvTrue,
    isInfinityMint,
    makeDirectories,
    readLocations,
} from '../app/helpers';
import {
    InfinityMintExportScript,
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';
import fs from 'fs';
import path from 'path';

const exportProject: InfinityMintScript = {
    name: 'Export',
    description:
        'Exports a project to the specified location, will copy over styles, gems and anything else relating to the project',
    execute: async (script: InfinityMintScriptParameters) => {
        let location = script.args.location?.value;

        let exportScriptLocation =
            script.args?.exportScript?.value || 'default';

        if (exportScriptLocation === 'default')
            exportScriptLocation = isInfinityMint()
                ? path.join(cwd(), '/app/export/default')
                : path.join(
                      cwd(),
                      '/node_modules/infinitymint/dist/app/export/default'
                  );

        if (exportScriptLocation === 'classic')
            exportScriptLocation = isInfinityMint()
                ? path.join(cwd(), '/app/export/classic')
                : path.join(
                      cwd(),
                      '/node_modules/infinitymint/dist/app/export/classic'
                  );

        let {
            useBundle,
            useGems,
            publicFolder,
            ignorePublic,
            requireInClient,
            setAsDefault,
        } = getArgumentValues(script.args);

        //default location
        if (!location) {
            let locations = readLocations();

            if (locations[script.project.getNameAndVersion()])
                location = locations[script.project.getNameAndVersion()];
            else location = cwd();
        }

        script.log(`\n{cyan-fg}{bold}Exporting to => ${location}`);

        let exportScript = require(exportScriptLocation.indexOf(cwd()) === -1
            ? path.resolve(path.join('/../', exportScriptLocation))
            : exportScriptLocation) as InfinityMintExportScript;

        exportScript = (exportScript as any)?.default || exportScript;

        if (!exportScript.export)
            throw new Error(
                'Export script does not have an export function, please check the script'
            );

        script.log(
            `{green-fg}Using export script{/} => ${
                exportScript.name || exportScriptLocation
            }\n`
        );
        script.log(`{green-fg}Location{/} => ${exportScriptLocation}\n`);
        await exportScript.export({
            ...script,
            project: script.project,
            location,
            exportScript,
            useBundle,
            useGems,
            publicFolder,
            ignorePublic,
        });

        let deployedProject = script.project.getDeployedProject();

        if (requireInClient || setAsDefault) {
            script.log(`\n{cyan-fg}{bold}Updating client manifest.json{/}\n`);

            makeDirectories(path.join(location, publicFolder, '/client'));

            let clientManifest: {
                require?: Dictionary<{
                    name: string;
                    version: string;
                    network: string;
                }>;
                default?: Dictionary<{
                    prod: Dictionary<string>;
                    dev: Dictionary<string>;
                }>;
            } = {};

            let manifestFilePath = path.join(
                location,
                publicFolder,
                '/client/manifest.json'
            );
            if (fs.existsSync(manifestFilePath))
                try {
                    clientManifest = JSON.parse(
                        fs.readFileSync(manifestFilePath, 'utf8')
                    );
                } catch (e) {
                    clientManifest = {};
                }

            if (requireInClient) {
                script.log(
                    `{green-fg}Adding requirement to client manifest.json{/} => ${script.project.getFullyQualifiedName()}\n`
                );
                clientManifest.require = {
                    ...clientManifest.require,
                    [script.project.getFullyQualifiedName()]: {
                        name: deployedProject.name,
                        version: deployedProject.version?.version,
                        network: deployedProject.network.name,
                    },
                };
            }

            if (setAsDefault) {
                script.log(
                    `{green-fg}Setting project as default for ${
                        script.infinityConsole.network.name
                    } in client manifest{/} => ${script.project.getFullyQualifiedName()}\n`
                );

                clientManifest.default = {
                    ...clientManifest.default,
                    [isEnvTrue('PRODUCTION') ? 'prod' : 'dev']: {
                        ...clientManifest.default?.[
                            isEnvTrue('PRODUCTION') ? 'prod' : 'dev'
                        ],
                        [script.project.network]:
                            script.project.getFullyQualifiedName(),
                    },
                };
            }

            fs.writeFileSync(
                manifestFilePath,
                JSON.stringify(clientManifest, null, 4)
            );
        }

        script.log('\n{green-fg}{bold}Export Successful{/}');
        script.log(`\tProject: ${deployedProject.name}`);
        script.log(
            `\tVersion: ${deployedProject.version.version} (${deployedProject.version.tag})\n` +
                `\tNetwork: ${deployedProject.network.name} (chainId:${deployedProject.network.chainId})`
        );
        script.log(`\tLocation: ${location}\n`);
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
            name: 'requireInClient',
            type: 'boolean',
            value: true,
            optional: true,
        },
        {
            name: 'setAsDefault',
            type: 'boolean',
            value: false,
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
            value: 'public',
        },
        {
            name: 'ignorePublic',
            type: 'boolean',
            optional: true,
        },
    ],
};
export default exportProject;
