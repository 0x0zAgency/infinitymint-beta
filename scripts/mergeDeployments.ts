import {
    Dictionary,
    log,
    safeGlob,
    warning,
    getArgumentValues,
} from '../app/helpers';
import {
    InfinityMintDeploymentLive,
    InfinityMintScript,
} from '../app/interfaces';
import {
    getProjectDeploymentPath,
    getFullyQualifiedName,
} from '../app/projects';
import fs from 'fs';
import path from 'path';
import { getDeploymentProjectPath } from '../app/web3';

const mergeDeployments: InfinityMintScript = {
    name: 'Merge Deployments',
    description:
        'Merges a directory of deployments into a new deployed project.',
    execute: async ({ args, project }) => {
        let { target, newVersion, network, chainId } = getArgumentValues(args);

        if (!target || !fs.existsSync(target)) throw new Error('bad target');
        if (!project.hasCompiled()) throw new Error('please compile first');

        let dots = project.version.split('.');
        let version = newVersion
            ? parseInt(dots[0] + 1) + dots.slice(1).join('.')
            : project.version;
        let newProject = {
            ...project.getDeployedProject(),
        };
        let deployments =
            newProject.deployments as Dictionary<InfinityMintDeploymentLive>;

        //read dir
        let files = await safeGlob(target);
        files
            .filter((_) => _.endsWith('.json'))
            .map((_) => path.parse(_))
            .forEach((parsedFile) => {
                let parsedAbi = JSON.parse(
                    fs.readFileSync(
                        path.join(parsedFile.dir, parsedFile.base),
                        {
                            encoding: 'utf-8',
                        }
                    )
                );

                if (parsedAbi.abi === undefined) {
                    warning('bad abi in => ' + parsedFile.name);
                    return;
                }

                deployments[parsedFile.name] = {
                    ...parsedAbi,
                };

                network =
                    deployments[parsedFile.name]?.network?.name || deployments;

                if (parsedAbi.liveDeployments === undefined)
                    deployments[parsedFile.name].liveDeployments = [
                        { ...deployments[parsedFile.name] },
                    ];

                let newPath = getDeploymentProjectPath(
                    project.getDeployedProject()
                );
                newPath = path.join(newPath, parsedAbi.name);
                log('Writing Deployment => ' + newPath);
                fs.writeFileSync(newPath, JSON.stringify(deployments));
            });

        //save the project file
        let newPath = getProjectDeploymentPath(
            project.getFullyQualifiedName(),
            project.network,
            version
        );

        newProject.network = {
            name: network,
            chainId: chainId,
        };

        newProject.version = {
            tag: newVersion ? 'new merge' : 'initial',
            version: version,
        };

        newProject.deployed = true;

        log('Writing Project => ' + newPath);
        fs.writeFileSync(newPath, JSON.stringify(deployments));

        log(
            'Merged old deployments into project ' +
                getFullyQualifiedName(newProject) +
                '. Created version ' +
                version +
                '. Please remember to export the project'
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
            optional: false,
        },
        {
            name: 'network',
            type: 'string',
            optional: true,
        },
        {
            name: 'chainId',
            type: 'string',
            optional: true,
        },
        {
            name: 'newVersion',
            type: 'boolean',
            optional: true,
        },
    ],
};
export default mergeDeployments;
