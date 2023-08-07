import {
    InfinityMintDeploymentLive,
    InfinityMintDeploymentParameters,
    InfinityMintEventEmit,
    InfinityMintScript,
    InfinityMintScriptParameters,
    InfinityMintTempProject,
} from '../app/interfaces';
import fs from 'fs';
import {
    getProjectDeploymentClasses,
    InfinityMintDeployment,
} from '../app/deployments';
import {
    getProjectFullName,
    getScriptTemporaryProject,
    hasDeployedProject,
} from '../app/projects';
import {
    action,
    always,
    cwd,
    getConfigFile,
    getGanacheMnemonic,
    logDirect,
    prepare,
    readGlobalSession,
    stage,
    warning,
} from '../app/helpers';
import { getAccounts, logTransaction } from '../app/web3';
import { file } from 'jszip';

const deployProject: InfinityMintScript = {
    name: 'Deploy',
    description:
        'Deploys InfinityMint or a specific InfinityMint contract related to the current project',
    /**
     * Deploys an InfinityMint project
     * @param script
     */
    execute: async (script: InfinityMintScriptParameters) => {
        let config = getConfigFile();
        let project: InfinityMintTempProject = getScriptTemporaryProject(
            script,
            'compiled'
        );
        let shouldSave =
            script.args?.save?.value === true ||
            script.infinityConsole.getCurrentNetwork().name !== 'hardhat';

        if (script.args?.save?.value === false) shouldSave = false;

        if (!project.compiled)
            throw new Error('please compile this project before deploying it');

        if (!script.infinityConsole.hasNetworkAccess())
            throw new Error(
                'invalid current network please check connectivity'
            );

        if (script.args.save === undefined)
            script.args.save = {
                value:
                    script.infinityConsole.getCurrentNetwork().name ===
                    'hardhat'
                        ? false
                        : true,
                name: 'save',
                type: 'boolean',
            };

        if (script.infinityConsole.getCurrentNetwork().name === 'ganache') {
            if (project.permissions === undefined) project.permissions = {};

            project.permissions.all = [
                ...(project?.permissions?.all || []),
                ...getAccounts(
                    getGanacheMnemonic(),
                    script.infinityConsole.getCurrentNetwork().name ===
                        'ganache'
                        ? 20
                        : 10
                ),
            ];
        }

        let update = script.args.update?.value || true;

        if (
            !update &&
            hasDeployedProject(
                project,
                script.infinityConsole.getCurrentNetwork().name
            )
        )
            throw new Error(`A project with this version already exists`);
        else {
            if (
                fs.existsSync(
                    cwd() +
                        '/projects/deployed/' +
                        script.infinityConsole.getCurrentNetwork().name +
                        '/' +
                        getProjectFullName(project, project.version.version) +
                        '.json'
                )
            ) {
                script.log(
                    `Removing deployed project: ${getProjectFullName(
                        project,
                        project.version.version
                    )}`
                );
                fs.unlinkSync(
                    cwd() +
                        '/projects/deployed/' +
                        script.infinityConsole.getCurrentNetwork().name +
                        '/' +
                        getProjectFullName(project, project.version.version) +
                        '.json'
                );
            }
        }

        if (script.args?.setPipe?.value) {
            //pipes are used to pipe console.log and console.errors to containers which can then be viewed instead of logs/debug logs all being in one place, here we are registering a new pipe for this deployment process and setting it as the current pipe
            let pipeName = 'deploy_' + project.name;
            if (!script.infinityConsole.getConsoleLogs().pipes[pipeName])
                script.infinityConsole
                    .getConsoleLogs()
                    .registerSimplePipe(pipeName, {
                        listen: true,
                    });

            //all log messages will now go to deploy
            script.infinityConsole.getConsoleLogs().setCurrentPipe(pipeName);
        }

        if (!project.network)
            project.network = {
                chainId: script.infinityConsole.getCurrentChainId(),
                name: script.infinityConsole.getCurrentNetwork().name,
                url: config.settings?.networks?.[
                    script.infinityConsole.getCurrentNetwork().name
                ]?.exposeRpc
                    ? (
                          config.hardhat.networks[
                              script.infinityConsole.getCurrentNetwork().name
                          ] as any
                      ).url
                    : config.settings?.networks?.[
                          script.infinityConsole.getCurrentNetwork().name
                      ]?.rpc,
                tokenSymbol: script.infinityConsole.getCurrentTokenSymbol(),
            };

        //sets the project and script to be the one used by the action method. Must be called before any action is called or any always is called
        prepare(project, script, 'deploy');

        if (script.project.modules)
            Object.keys(script.project.modules).map((key) => {
                project.modules[key] = script.project.modules[key];
            });

        //make folder for deployments to go into
        if (
            !fs.existsSync(
                cwd() +
                    '/deployments/' +
                    script.infinityConsole.getCurrentNetwork().name +
                    '/'
            )
        )
            fs.mkdirSync(
                cwd() +
                    '/deployments/' +
                    script.infinityConsole.getCurrentNetwork().name +
                    '/'
            );

        script.log(
            `{cyan-fg}{bold}getting deployment classes for ${project.name}@${project.version.version}{/}`
        );

        let deployments: InfinityMintDeployment[] =
            await getProjectDeploymentClasses(project);

        let notUniqueAndImportant = deployments
            .filter(
                (deployment) =>
                    !deployment.isUnique() && !deployment.isImportant()
            )
            .filter(
                (deployment) =>
                    deployments.filter(
                        (thatDeployment) =>
                            thatDeployment.getKey() === deployment.getKey()
                    ).length > 1
            );

        let keyValueDeployments = {};

        Object.values(deployments).forEach((deployment) => {
            keyValueDeployments[
                deployment.getModuleKey() || deployment.getContractName()
            ] = deployment;
        });

        if (notUniqueAndImportant.length !== 0)
            throw new Error(
                '1 or more conflicting unique and important deploy scripts: check ' +
                    notUniqueAndImportant
                        .map(
                            (deployment) =>
                                deployment.getKey() +
                                ':' +
                                deployment.getTemporaryFilePath()
                        )
                        .join('\n')
            );

        let libraies = deployments.filter((deployment) =>
            deployment.isLibrary()
        );
        let important = deployments.filter((deployment) =>
            deployment.isImportant()
        );

        let importantDeployments = [...libraies];
        important.forEach((deployment, index) => {
            if (
                importantDeployments.filter(
                    (thatDeployment) =>
                        thatDeployment.getKey() === deployment.getKey()
                ).length === 0
            )
                importantDeployments.push(deployment);
        });

        importantDeployments.sort((a, b) => {
            if (a.isLibrary() && !b.isLibrary()) return -1;
            if (!a.isLibrary() && b.isLibrary()) return 1;
            return 0;
        });

        script.log(
            `{yellow-fg}{bold}deploying ${deployments.length} contracts{/}`
        );
        deployments.forEach((deployment) => {
            script.log(`{white-fg}{bold} - ${deployment.getKey()}{/}`);
        });

        let contracts = { ...project.deployments };
        let libraires = { ...project.libraries };
        //deploy stage
        let deploy = await always('deploy', async (isFirstTime) => {
            script.log(`\n{cyan-fg}{bold}Deploying Smart Contracts{/}\n`);
            for (let i = 0; i < deployments.length; i++) {
                let deployment = deployments[i];

                //deploy each contract
                let result = await always(
                    'deploy_' + deployment.getKey(),
                    async () => {
                        if (
                            script.args?.contract &&
                            deployment.getKey() !==
                                script.args?.contract.value &&
                            deployment.getContractName() !==
                                script.args.contract.value
                        ) {
                            script.log(
                                `[${i}] skipping <` +
                                    deployment.getKey() +
                                    '>(' +
                                    deployment.getContractName() +
                                    ')'
                            );
                            return;
                        }

                        project.deployments = contracts;

                        script.infinityConsole.emit('preDeploy', {
                            ...script,
                            project: project,
                            deployments: keyValueDeployments,
                            deployment,
                            event: deployment,
                        } as InfinityMintEventEmit<InfinityMintDeployment>);

                        if (
                            deployment.hasDeployed() &&
                            script.args?.redeploy?.value !== true
                        ) {
                            let previousContracts = deployment.getDeployments();
                            previousContracts.forEach((contract, index) => {
                                script.log(
                                    `[${i}] => (${index}) {yellow-fg}already deployed <${contract.name}>{/yellow-fg} => ${contract.address}`
                                );
                                contracts[contract.name as string] = contract;
                                contracts[
                                    index === 0
                                        ? (contract.key as string)
                                        : contract.key + ':' + index
                                ] = contract;
                                contracts[
                                    index === 0
                                        ? deployment.getModuleKey()
                                        : deployment.getModuleKey() +
                                          ':' +
                                          index
                                ] = contract;
                            });

                            //call post deploy with previous contracts
                            script.infinityConsole.emit('postDeploy', {
                                project: project,
                                deployments: keyValueDeployments,
                                deployment,
                                event: previousContracts,
                                ...script,
                            } as InfinityMintEventEmit<InfinityMintDeploymentLive[]>);
                            return;
                        } else if (deployment.hasDeployed()) {
                            script.log(
                                `[${i}] already deployed, but we are redeploying so calling cleanup <` +
                                    deployment.getKey() +
                                    '>(' +
                                    deployment.getContractName() +
                                    ')'
                            );

                            let contractNames = (await deployment.execute(
                                'cleanup',
                                {
                                    isFirstTime,
                                }
                            )) as string[];

                            contractNames = contractNames || [];
                            contractNames.forEach((contract) => {
                                if (contracts[contract]) {
                                    script.log(`\tRemoving ${contract}`);
                                    delete contracts[contract];
                                }
                            });
                        }

                        script.log(
                            `[${i}] deploying <` +
                                deployment.getKey() +
                                '>(' +
                                deployment.getContractName() +
                                ')'
                        );

                        let deployedContracts = await deployment.deploy({
                            ...script,
                            project: project,
                            save:
                                script.args.save === undefined
                                    ? true
                                    : script.args.save?.value || false,
                            deployments: keyValueDeployments,
                            deployment: deployment,
                            contracts: contracts,
                            deployed: deployment.hasDeployed(),
                            deploymentScript: deployment.getDeploymentScript(),
                            usePreviousDeployment:
                                script.args?.redeploy?.value !== true,
                        } as InfinityMintDeploymentParameters);

                        deployedContracts.forEach((contract, index) => {
                            script.log(
                                `[${i}] => (${index}) deployed <${contract.name}> => ${contract.address}`
                            );
                            contracts[contract.name as string] = contract;
                            contracts[
                                index === 0
                                    ? (contract.key as string)
                                    : contract.key + ':' + index
                            ] = contract;
                            contracts[
                                index === 0
                                    ? deployment.getModuleKey()
                                    : deployment.getModuleKey() + ':' + index
                            ] = contract;
                        });

                        if (deployment.isLibrary()) {
                            deployment.getDeployments().forEach((contract) => {
                                libraires[contract.contractName] =
                                    contract.address;
                            });
                        }
                        project.libraries = libraires;

                        if (shouldSave) deployment.saveTemporaryDeployments();

                        script.infinityConsole.emit('postDeploy', {
                            ...script,
                            project: project,
                            deployments: keyValueDeployments,
                            deployment,
                            event: deployedContracts,
                        } as InfinityMintEventEmit<InfinityMintDeploymentLive[]>);

                        //if we are to instantly set up
                        if (
                            deployment.getDeploymentScript().instantlySetup &&
                            !deployment.hasSetup()
                        ) {
                            script.log(
                                `[${i}] instantly setting up <` +
                                    deployment.getKey() +
                                    '>'
                            );

                            script.infinityConsole.emit('preSetup', {
                                ...script,
                                project: project,
                                deployments: keyValueDeployments,
                                deployment,
                                event: deployment,
                            } as InfinityMintEventEmit<InfinityMintDeployment>);

                            project.stages['setup_' + deployment.getKey()] =
                                false;
                            try {
                                await deployment.setup({
                                    ...script,
                                    project: project,
                                    deployments: keyValueDeployments,
                                    deployment: deployment,
                                    event: deployment,
                                    contracts: contracts,
                                    deployed: deployment.hasDeployed(),
                                    deploymentScript:
                                        deployment.getDeploymentScript(),
                                } as InfinityMintDeploymentParameters);
                            } catch (error) {
                                project.stages['setup_' + deployment.getKey()] =
                                    error;
                                throw error;
                            }

                            if (shouldSave)
                                deployment.saveTemporaryDeployments();

                            project.stages['setup_' + deployment.getKey()] =
                                true;

                            script.infinityConsole.emit('postSetup', {
                                ...script,
                                project: project,
                                deployments: keyValueDeployments,
                                deployment,
                                event: deployment,
                            } as InfinityMintEventEmit<InfinityMintDeployment>);
                        }

                        project.deployments = contracts;
                    }
                );

                //throw error from stage
                if (result !== true) {
                    script.log(
                        `[${i}] cleaning up <` +
                            deployment.getKey() +
                            '>(' +
                            deployment.getContractName() +
                            ') after failed deployment'
                    );
                    let contractNames = (await deployment.execute('cleanup', {
                        isFirstTime,
                        error: result as Error,
                    })) as string[];

                    contractNames = contractNames || [];
                    contractNames.forEach((contract) => {
                        if (contracts[contract]) {
                            script.log(`\tRemoving ${contract}`);
                            delete contracts[contract];
                        }
                    });

                    throw result;
                }

                script.log(
                    `{green-fg}successfully deployed{/green-fg} <${deployment.getContractName()}>(` +
                        project.name +
                        ')'
                );
            }
            script.log(`{green-fg}{bold}Deployment Successful{/}`);
        });

        if (deploy !== true) throw deploy;

        //setup stage
        let setup = await always('setup', async () => {
            script.log(`\n{cyan-fg}{bold}Configuring Smart Contracts{/}\n`);
            let setupContracts = deployments.filter(
                (deployment) => !deployment.hasSetup()
            );

            if (setupContracts.length === 0) {
                script.log(`{yellow-fg}{bold}No Contracts To Setup{/}`);
                return;
            }

            for (let i = 0; i < setupContracts.length; i++) {
                let deployment = setupContracts[i];

                let result = await always(
                    'setup_' + deployment.getContractName(),
                    async () => {
                        if (!deployment.getDeploymentScript().setup) {
                            script.log(
                                `[${i}] => {gray-fg} Skipping <${deployment.getContractName()}>`
                            );
                            return;
                        }

                        if (deployment.hasSetup()) {
                            script.log(
                                `[${i}] => {yellow-fg} <${deployment.getContractName()}> has already been set up`
                            );
                            return;
                        }

                        script.infinityConsole.emit('preSetup', {
                            ...script,
                            project: project,
                            deployments: keyValueDeployments,
                            event: deployment,
                        } as InfinityMintEventEmit<InfinityMintDeployment>);

                        script.log(
                            `[${i}] setting up <` +
                                deployment.getKey() +
                                '>(' +
                                deployment.getContractName() +
                                ')'
                        );

                        await deployment.setup({
                            ...script,
                            project: project,
                            deployments: keyValueDeployments,
                            deployment: deployment,
                            event: deployment,
                            contracts: contracts,
                            deployed: deployment.hasDeployed(),
                            deploymentScript: deployment.getDeploymentScript(),
                        } as InfinityMintDeploymentParameters);

                        if (shouldSave) deployment.saveTemporaryDeployments();

                        script.infinityConsole.emit('postSetup', {
                            ...script,
                            project: project,
                            deployments: keyValueDeployments,
                            event: deployment,
                        } as InfinityMintEventEmit<InfinityMintDeployment>);
                    }
                );

                if (result !== true) throw result;

                script.log(
                    `{green-fg}successfully setup <${deployment.getContractName()}>{/green-fg} (` +
                        project.name +
                        ')'
                );
            }

            script.log(`{green-fg}{bold}Setup Successful{/}`);
        });

        if (setup !== true) throw setup;

        //authentication stage
        let authentication = await action('authentication', async () => {
            script.log(`\n{cyan-fg}{bold}Authenticating Smart Contracts{/}`);

            //using await Promise.all breaks ganache?
            let _vals = Object.values(deployments);
            for (let index = 0; index < _vals.length; index++) {
                let deployment = _vals[index];
                if (
                    deployment.isLibrary() ||
                    !deployment.getDeploymentScript().permissions ||
                    deployment.getDeploymentScript().permissions.length === 0
                ) {
                    script.log(`\nSkipping <${deployment.getContractName()}>`);
                    continue;
                }

                let approvedAddresses = [];

                deployment
                    .getDeploymentScript()
                    .permissions.forEach((statement) => {
                        if (contracts[statement])
                            approvedAddresses.push(
                                contracts[statement].address
                            );
                        else
                            switch (statement) {
                                case 'approved':
                                    break;
                                case 'all':
                                    approvedAddresses = [
                                        ...approvedAddresses,
                                        ...(project.permissions?.all || []),
                                        ...(project?.permissions?.[
                                            deployment.getModuleKey()
                                        ] || []),
                                    ];
                                    break;
                                default:
                                    if (statement.indexOf('0x') === -1) return;
                                    approvedAddresses.push(statement);
                            }
                    });

                if (approvedAddresses.length === 0) {
                    script.log(`\nSkipping <${deployment.getContractName()}>`);
                    continue;
                }

                script.log(
                    `\n{cyan-fg}Approving ${
                        approvedAddresses.length
                    } with <${deployment.getContractName()}>`
                );

                try {
                    approvedAddresses = approvedAddresses.filter(
                        (address) =>
                            approvedAddresses.filter(
                                (thatAddress) => thatAddress === address
                            ).length === 1
                    );

                    approvedAddresses.forEach((address, index) => {
                        script.log(`[${index}] => ${address}`);
                    });
                    await deployment.multiApprove(approvedAddresses);
                    deployment.setApproved(approvedAddresses);

                    if (shouldSave) deployment.saveTemporaryDeployments();
                    script.log(
                        `\n{green-fg}Success{/}\n\tApproved (${
                            approvedAddresses.length
                        }) addresses on <${deployment.getContractName()}>\n`
                    );
                } catch (error) {
                    warning(
                        `error approving <${deployment.getContractName()}>: ${
                            error.message
                        }`
                    );
                }
            }
        });

        if (authentication !== true) throw authentication;

        //project has deployed
        project.deployed = true;
        //set the project deployer
        project.deployer = script.infinityConsole.getCurrentAccount().address;

        //write phase
        let write = await action('write', async () => {
            if (
                !fs.existsSync(
                    cwd() +
                        '/projects/deployed/' +
                        script.infinityConsole.getCurrentNetwork().name
                )
            )
                fs.mkdirSync(
                    cwd() +
                        '/projects/deployed/' +
                        script.infinityConsole.getCurrentNetwork().name
                );

            if (script.args?.save.value === true) {
                script.log(`\n{cyan-fg}{bold}Writing Project{/}`);
                let newProjectPath =
                    cwd() +
                    '/projects/deployed/' +
                    script.infinityConsole.getCurrentNetwork().name +
                    '/' +
                    getProjectFullName(project) +
                    '.json';
                script.log('\tWriting => ' + newProjectPath);
                fs.writeFileSync(newProjectPath, JSON.stringify(project));
                script.log(`{green-fg}{bold}Write Successful{/}\n`);

                script.log(`{cyan-fg}{bold}Writing Deployments{/}`);
                let _vals = Object.values(deployments);
                for (let index = 0; index < _vals.length; index++) {
                    let deployment = _vals[index];

                    //restructure the json file
                    deployment.saveFinalDeployment();

                    script.log(
                        `[${index}] => Writing <${deployment.getContractName()}>`
                    );
                    let newPath =
                        cwd() +
                        '/deployments/' +
                        script.infinityConsole.getCurrentNetwork().name +
                        '/' +
                        getProjectFullName(project) +
                        '/' +
                        deployment.getContractName() +
                        '.json';

                    if (
                        !fs.existsSync(
                            cwd() +
                                '/temp/deployments/' +
                                getProjectFullName(project) +
                                '/' +
                                deployment.getContractName() +
                                '_' +
                                script.infinityConsole.getCurrentNetwork()
                                    .name +
                                '.json'
                        )
                    ) {
                        script.log(
                            `\t{gray-fg}Skipping <${deployment.getContractName()}>{/}`
                        );
                        continue;
                    }
                    fs.copyFileSync(
                        cwd() +
                            '/temp/deployments/' +
                            getProjectFullName(project) +
                            '/' +
                            deployment.getContractName() +
                            '_' +
                            script.infinityConsole.getCurrentNetwork().name +
                            '.json',
                        newPath
                    );
                    script.log(`\t{gray-fg}Wrote ${newPath}{/}`);
                }
                script.log(`{green-fg}{bold}Write Successful{/}`);
            } else {
                script.log(
                    `\n{yellow-fg}{bold}Skipping Write (saving is not enabled){/}`
                );

                script.log(`\n{cyan-fg}{bold}Removing Deployments{/}\n`);
                let _vals = Object.values(deployments);
                for (let index = 0; index < _vals.length; index++) {
                    let filePath =
                        cwd() +
                        '/deployments/' +
                        script.infinityConsole.getCurrentNetwork().name +
                        '/' +
                        getProjectFullName(project) +
                        '/' +
                        _vals[index].getContractName() +
                        '.json';

                    if (fs.existsSync(filePath))
                        await fs.promises.unlink(filePath);
                    else
                        script.log(
                            `\t{gray-fg}Skipping <${_vals[
                                index
                            ].getContractName()}>{/}`
                        );
                }
                script.log(`{green-fg}{bold}Removal Successful{/}`);
            }
        });

        if (write !== true) throw write;

        script.log(`\n{cyan-fg}{bold}Removing Temp Deployments{/}\n`);
        let _vals = Object.values(deployments);
        for (let index = 0; index < _vals.length; index++) {
            let tempFilePath =
                cwd() +
                '/temp/deployments/' +
                getProjectFullName(project) +
                '/' +
                _vals[index].getContractName() +
                '_' +
                script.infinityConsole.getCurrentNetwork().name +
                '.json';

            if (fs.existsSync(tempFilePath)) {
                script.log(
                    `\t{gray-fg}Removing Temp Deployment <${_vals[
                        index
                    ].getContractName()}>{/}`
                );
                fs.promises.unlink(tempFilePath);
            } else
                script.log(
                    `\t{gray-fg}Skipping Temp <${_vals[
                        index
                    ].getContractName()}>{/}`
                );
        }

        script.log(`\n{cyan-fg}{bold}Removing Temp Project File{/}\n`);
        script.log(
            `\tRemoving => ${cwd()}/temp/projects/${getProjectFullName(
                project
            )}.deployed.temp.json`
        );
        await fs.promises.unlink(
            cwd() +
                '/temp/projects/' +
                getProjectFullName(project) +
                '.deployed.temp.json'
        );

        script.log(`\n{cyan-fg}{bold}SHE HAS ASCENDED{/}`);
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
        {
            name: 'update',
            type: 'boolean',
            value: true,
            optional: true,
        },
        {
            name: 'contract',
            type: 'string',
            optional: true,
        },
        {
            name: 'useTemp',
            type: 'boolean',
            value: true,
            optional: true,
        },
        {
            name: 'redeploy',
            type: 'boolean',
            value: false,
            optional: true,
        },
        {
            name: 'setPipe',
            type: 'boolean',
            optional: true,
            value: true,
        },
    ],
};
export default deployProject;
