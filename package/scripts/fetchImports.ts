import fs from 'fs';
import { cwd, makeDirectories, warning } from '../app/helpers';
import {
    InfinityMintCompiledProject,
    InfinityMintDeployedProject,
    InfinityMintProjectPath,
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';

const fetchImports: InfinityMintScript = {
    name: 'Fetch Imports Using IPFS',
    description:
        'Fetches imports relating to a project  and write them to a destination or your current repository. The project must have uploaded its resources to IPFS',
    execute: async (script: InfinityMintScriptParameters) => {
        let destination = script.args.destination?.value || cwd() + '/imports/';
        let targetProject:
            | InfinityMintCompiledProject
            | InfinityMintDeployedProject;

        if (script.args.useCompiled?.value)
            targetProject = script.project.compiledProject;
        else targetProject = script.project.getDeployedProject();

        //fetch paths
        let pathImports = {};

        Object.values([
            ...targetProject.paths,
            ...Object.values(targetProject.assets),
        ]).forEach((path) => {
            let getPath = (path: InfinityMintProjectPath) => {
                if (
                    !path?.export?.external?.ipfs?.url &&
                    !path?.export?.external?.web2?.url
                )
                    return;

                pathImports[path.fileName.toString()] =
                    path?.export?.external?.ipfs?.url ||
                    path?.export?.external?.web2?.url;
            };

            getPath(path);

            if (path.content)
                Object.values(path.content).forEach((path) => {
                    getPath(path);
                });
        });

        //write all the path imports to the destination
        await Promise.all(
            Object.keys(pathImports).map(async (path, index) => {
                let importPath = destination + path;

                if (fs.existsSync(importPath) && !script.args.force?.value) {
                    script.log(
                        `[${index}] => Skipping ${path} as it already exists in ${destination}`
                    );
                    return;
                }

                script.log(
                    `[${index}] => Fetching ${path} from ${pathImports[path]}, writing to ${importPath}`
                );
                let fetched: Response;
                try {
                    fetched = await fetch(pathImports[path]);
                    if (!fetched.ok) {
                        throw new Error('failed to fetch');
                    }
                } catch (error) {
                    warning(
                        `[${index}] => Failed to fetch ${path} from ${pathImports[path]}`
                    );
                    return;
                }

                if (importPath[0] !== '/') importPath = '/' + importPath;
                if (importPath.indexOf('/imports/') === -1)
                    importPath = `/imports${importPath}`;
                let content = await fetched.text();
                makeDirectories(cwd() + importPath);
                fs.writeFileSync(cwd() + importPath, content);
            })
        );
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
        {
            name: 'network',
            type: 'string',
            optional: true,
        },
        {
            name: 'target',
            type: 'string',
            optional: true,
        },
        {
            name: 'force',
            type: 'boolean',
            optional: true,
        },
        {
            name: 'destination',
            type: 'string',
            optional: true,
        },
        {
            name: 'useCompiled',
            type: 'boolean',
            optional: true,
        },
    ],
};
export default fetchImports;
