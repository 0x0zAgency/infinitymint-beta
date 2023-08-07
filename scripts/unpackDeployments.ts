import {
    getCurrentProject,
    getProjectDeploymentPath,
    getProjectSource,
} from '../app/projects';
import fs from 'fs';
import { cwd, getPackageJson, makeDirectories } from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';
import { getDeploymentProjectPath } from '../app/web3';

const unpackDeployments: InfinityMintScript = {
    name: 'Unpack Deployments',
    description:
        'Attempts to unpack all deployments in the project to a folder',
    execute: async (script: InfinityMintScriptParameters) => {
        if (!script.project.hasDeployed())
            throw new Error(
                'Project ' +
                    script.project.getFullyQualifiedName() +
                    ' has not been deployed to ' +
                    script.infinityConsole.network.name
            );

        let destination =
            script.args.destination?.value ||
            getDeploymentProjectPath(script.project.getDeployedProject());

        makeDirectories(destination);

        Object.keys(script.project.getDeployedProject().deployments).forEach(
            (contractName) => {
                let contract =
                    script.project.getDeployedProject().deployments[
                        contractName
                    ];

                if (fs.existsSync(destination + contractName + '.json'))
                    throw new Error(
                        'Contract ' +
                            contractName +
                            ' already exists in ' +
                            destination
                    );

                script.log(
                    'Unpacking ' +
                        contractName +
                        ' to => ' +
                        destination +
                        contractName +
                        '.json'
                );
                fs.writeFileSync(
                    destination + contractName + '.json',
                    JSON.stringify(contract, null, 4)
                );
            }
        );
        script.log('Unpacked all deployments to => ' + destination);
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
        {
            name: 'destination',
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
    ],
};
export default unpackDeployments;
