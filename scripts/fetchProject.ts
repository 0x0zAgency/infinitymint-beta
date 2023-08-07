import { getProjectDeploymentPath } from '../app/projects';
import fs from 'fs';
import { cwd, makeDirectories, networks, warning } from '../app/helpers';
import {
    InfinityMintDeployedProject,
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';
import { getContractArtifact, getContractFromAbi } from '../app/web3';
import { InfinityMintProject } from '@typechain-types/InfinityMintProject';
import hre, { ethers } from 'hardhat';

const fetchDeloyments: InfinityMintScript = {
    name: 'Fetch Project',
    description:
        'Attempts to fetch a project from an InfinityMint project contract',
    execute: async (script: InfinityMintScriptParameters) => {
        let address = script.args.contractDestination.value;
        let artifact = await getContractArtifact('InfinityMintProject');

        script.log('Fetching project from contract => ' + address);

        let contract = getContractFromAbi(
            artifact.abi,
            address
        ) as InfinityMintProject;

        let project = await contract.getProject();
        let decoded = ethers.utils.toUtf8String(project);
        let json;
        if (decoded.startsWith('http')) {
            let response = await fetch(decoded);
            json = await response.json();
        } else if (decoded.startsWith('{')) {
            json = JSON.parse(decoded);
        } else {
            //assume IPFS link
            let response = await fetch('https://ipfs.io/ipfs/' + decoded);
            json = await response.json();
        }

        //save project to projects folder
        let newProject = {
            ...json,
        } as InfinityMintDeployedProject;

        if (
            !newProject.version ||
            typeof newProject.version === 'string' ||
            typeof newProject.version === 'number'
        ) {
            newProject.version = {
                version:
                    typeof newProject.version === 'string' ||
                    typeof newProject.version === 'number'
                        ? (newProject.version as any).toString() + '.0.0'
                        : '1.0.0',
                tag: (newProject as any).tag || 'latest',
            };
        }

        newProject.deployed = true;
        newProject.compiled = true;
        newProject.name =
            newProject.name ||
            (newProject as any)?.description?.name ||
            (newProject as any).project;

        newProject.network = {
            name: script.infinityConsole.network.name,
            chainId: networks[script.infinityConsole.network.name],
        };

        //upgrade old IM project to new one
        if ((newProject as any).contracts) {
            let contracts = (newProject as any).contracts;
            newProject.deployments = {};
            await Promise.all(
                Object.keys(contracts).map(async (contractName: any) => {
                    let address = contracts[contractName];

                    try {
                        let artifact = await hre.artifacts.readArtifact(
                            contractName
                        );

                        newProject.deployments[contractName] = {
                            project: newProject.name,
                            network: newProject.network,
                            address,
                            key: contractName,
                            module: Object.keys(newProject.modules).filter(
                                (key) =>
                                    newProject.modules[key] === contractName
                            )[0],
                            abi: artifact.abi,
                            contractName: contractName,
                            permissions: [],
                            newlyDeployed: false,
                            liveDeployments: [],
                        };

                        newProject.deployments[contractName].liveDeployments = [
                            {
                                ...newProject.deployments[contractName],
                                liveDeployments: undefined,
                            },
                        ];
                    } catch (error) {
                        warning('Could not upgrade contract => ' + error);
                        return;
                    }
                })
            );

            delete (newProject as any).contracts;
        }

        if (newProject.paths && newProject.paths instanceof Array === false)
            newProject.paths = Object.values(newProject.paths);

        if (newProject.assets && newProject.assets instanceof Array === false)
            newProject.assets = Object.values(newProject.assets);

        script.log('calling the new project => ' + newProject.name);

        let deploymentPath = getProjectDeploymentPath(
            newProject.name,
            script.infinityConsole.network.name,
            newProject.version.version
        );

        if (fs.existsSync(cwd() + deploymentPath) && !script.args.force?.value)
            throw new Error(
                'Project already exists, cannot overwrite ' + deploymentPath
            );

        script.log('Saving new project to => ' + deploymentPath);

        makeDirectories(cwd() + deploymentPath);
        fs.writeFileSync(
            cwd() + deploymentPath,
            JSON.stringify(newProject, null, 4)
        );
    },
    arguments: [
        {
            name: 'contractDestination',
            type: 'string',
            optional: false,
        },
        {
            name: 'force',
            type: 'boolean',
            optional: true,
        },
    ],
};
export default fetchDeloyments;
