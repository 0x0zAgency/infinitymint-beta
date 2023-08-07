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
    InfinityMintDeployment,
    loadDeploymentClasses,
    filterUsedDeploymentClasses,
} from '../app/deployments';
import {
    getProjectDeploymentPath,
    createTemporaryProject,
    hasDeployedProject,
    removeTempDeployedProject,
    getNameWithNetwork,
    getFullyQualifiedName,
} from '../app/projects';
import {
    Dictionary,
    cwd,
    getArgumentValues,
    getConfigFile,
    getGanacheMnemonic,
    makeDirectories,
    warning,
} from '../app/helpers';
import {
    getAccounts,
    startReceiptMonitor,
    stopReceiptMonitor,
} from '../app/web3';
import { prepare, action, always } from '../app/web3';
import path from 'path';
import { getReport, saveReport } from '../app/gasAndPrices';

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
        let tempProject: InfinityMintTempProject = createTemporaryProject(
            script,
            'compiled',
            null,
            script.args.target?.value
        );

        let { redeploy, setPipe, cleanup, save } = getArgumentValues(
            script.args
        );

        if (
            save === undefined &&
            script.infinityConsole.network.name !== 'hardhat'
        )
            save = true;

        if (!tempProject.compiled)
            throw new Error('please compile this project before deploying it');

        if (!script.infinityConsole.hasNetworkAccess())
            throw new Error(
                'invalid current network please check connectivity'
            );

        //add permissions to project
        if (script.infinityConsole.network.name === 'ganache') {
            if (tempProject.permissions === undefined)
                tempProject.permissions = {};

            tempProject.permissions.all = [
                ...(tempProject?.permissions?.all || []),
                ...getAccounts(
                    getGanacheMnemonic(),
                    script.infinityConsole.network.name === 'ganache' ? 20 : 10
                ),
            ];
        }

        if (!tempProject.network)
            tempProject.network = {
                chainId: script.infinityConsole.getCurrentChainId(),
                name: script.infinityConsole.network.name,
                url: config.settings?.networks?.[
                    script.infinityConsole.network.name
                ]?.exposeRpc
                    ? (
                          config.hardhat.networks[
                              script.infinityConsole.network.name
                          ] as any
                      ).url
                    : config.settings?.networks?.[
                          script.infinityConsole.network.name
                      ]?.rpc,
                tokenSymbol: script.infinityConsole.getCurrentTokenSymbol(),
            };

        let previousPath = path.join(
            cwd(),
            getProjectDeploymentPath(
                tempProject.name,
                tempProject.network.name,
                tempProject.version?.version
            )
        );

        if (redeploy && fs.existsSync(previousPath)) {
            script.log(
                `Removing deployed project => ${getNameWithNetwork(
                    tempProject
                )}`
            );
            fs.unlinkSync(previousPath);
        } else if (hasDeployedProject(tempProject, tempProject.network.name))
            throw new Error(`A project with this version already exists`);

        if (setPipe) {
            //pipes are used to pipe console.log and console.errors to containers which can then be viewed instead of logs/debug logs all being in one place, here we are registering a new pipe for this deployment process and setting it as the current pipe
            let pipeName = 'deploy_' + tempProject.name;
            if (!script.infinityConsole.PipeFactory.pipes[pipeName])
                script.infinityConsole.PipeFactory.registerSimplePipe(
                    pipeName,
                    {
                        listen: true,
                    }
                );

            //all log messages will now go to deploy
            script.infinityConsole.PipeFactory.setCurrentPipe(pipeName);
        }

        //make folder for deployments to go into
        makeDirectories(
            cwd() + '/deployments/' + script.infinityConsole.network.name + '/'
        );
        //make directory for deployed projects
        makeDirectories(
            cwd() +
                '/projects/deployed/' +
                script.infinityConsole.network.name +
                '/'
        );

        script.log(
            `{cyan-fg}{bold}getting deployment classes for ${getFullyQualifiedName(
                tempProject
            )}`
        );

        //sets the project and script to be the one used by the action method. Must be called before any action is called or any always is called
        await prepare(tempProject, script, 'deploy');
        //start the receipt monitor
        startReceiptMonitor();

        //load all of the deployment classes, this is an optimization
        const deploymentClasses = await loadDeploymentClasses(
            tempProject,
            script.infinityConsole
        ); //fetches all of the deployment classes with the context of this project

        //filters our deployment classes to ones only for this project
        let deployments: InfinityMintDeployment[] = filterUsedDeploymentClasses(
            tempProject,
            deploymentClasses //pass it so the function uses our pre-fetched classes
        );

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

        let keyValueDeployments: Dictionary<InfinityMintDeployment> = {};

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

        let contracts = { ...tempProject.deployments };
        let libraires = { ...tempProject.libraries };
        //deploy stage
        let deploy = await always('deploy', async (isFirstTime) => {
            script.log(`\n{cyan-fg}{bold}Deploying Smart Contracts{/}\n`);
            for (let i = 0; i < deployments.length; i++) {
                let deployment = deployments[i];

                let instantSetup = async () => {
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
                            project: tempProject,
                            deployments: keyValueDeployments,
                            deployment,
                            event: deployment,
                        } as InfinityMintEventEmit<InfinityMintDeployment>);

                        tempProject.stages['setup_' + deployment.getKey()] =
                            false;
                        try {
                            await deployment.setup({
                                ...script,
                                project: tempProject,
                                deployments: keyValueDeployments,
                                deployment: deployment,
                                deploymentClasses,
                                event: deployment,
                                contracts: contracts,
                                deployed: deployment.hasDeployed(),
                                deploymentScript:
                                    deployment.getDeploymentScript(),
                            } as InfinityMintDeploymentParameters);

                            contracts[deployment.getContractName()].setup =
                                true;
                            contracts[deployment.getModuleKey()].setup = true;
                        } catch (error) {
                            tempProject.stages['setup_' + deployment.getKey()] =
                                error;
                            throw error;
                        }

                        if (save) deployment.saveTemporaryDeployments();

                        tempProject.stages['setup_' + deployment.getKey()] =
                            true;

                        script.infinityConsole.emit('postSetup', {
                            ...script,
                            project: tempProject,
                            deployments: keyValueDeployments,
                            deployment,
                            event: deployment,
                        } as InfinityMintEventEmit<InfinityMintDeployment>);
                    }
                };
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

                        tempProject.deployments = contracts;

                        script.infinityConsole.emit('preDeploy', {
                            ...script,
                            project: tempProject,
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
                                    `[${i}] => (${index}) {yellow-fg}already deployed <${contract.contractName}>{/yellow-fg} => ${contract.address}`
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
                                project: tempProject,
                                deployments: keyValueDeployments,
                                deployment,
                                event: previousContracts,
                                ...script,
                            } as InfinityMintEventEmit<InfinityMintDeploymentLive[]>);
                            //do instant setup if we are to
                            await instantSetup();

                            //return
                            return;
                        } else if (deployment.hasDeployed()) {
                            script.log(
                                `[${i}] {yellow-fg}already deployed{/yellow-fg} <` +
                                    deployment.getKey() +
                                    '>(' +
                                    deployment.getContractName() +
                                    ')'
                            );

                            if (cleanup) {
                                script.log(
                                    `[${i}] calling cleanup since cleanup on redeploy since flag is present <` +
                                        deployment.getKey() +
                                        '>(' +
                                        deployment.getContractName() +
                                        ')'
                                );

                                let contractNames = (await deployment.execute(
                                    'cleanup',
                                    {
                                        isFirstTime,
                                        deploymentClasses,
                                    },
                                    script.infinityConsole,
                                    script.infinityConsole.getEventEmitter(),
                                    keyValueDeployments,
                                    contracts
                                )) as string[];

                                if (contractNames) {
                                    contractNames.forEach((contract) => {
                                        if (contracts[contract]) {
                                            script.log(
                                                `\tRemoving ${contract}`
                                            );
                                            delete contracts[contract];
                                        }
                                    });
                                } else {
                                    delete contracts[
                                        deployment.getContractName()
                                    ];
                                    delete contracts[deployment.getModuleKey()];
                                }
                            } else {
                                //reset
                                delete contracts[deployment.getContractName()];
                                delete contracts[deployment.getModuleKey()];
                            }

                            //reset the deployment class
                            deployment.reset();
                        }

                        script.log(
                            `\n[${i}] deploying <` +
                                deployment.getKey() +
                                '>(' +
                                deployment.getContractName() +
                                ')'
                        );

                        let deployedContracts = await deployment.deploy({
                            ...script,
                            project: tempProject,
                            save:
                                script.args.save === undefined
                                    ? true
                                    : script.args.save?.value || false,
                            deployments: keyValueDeployments,
                            deployment: deployment,
                            deploymentClasses,
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
                            contracts[contract.name as string].module =
                                deployment.getModuleKey() as string;
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
                        tempProject.libraries = libraires;

                        if (save) deployment.saveTemporaryDeployments();

                        script.infinityConsole.emit('postDeploy', {
                            ...script,
                            project: tempProject,
                            deployments: keyValueDeployments,
                            deployment,
                            event: deployedContracts,
                        } as InfinityMintEventEmit<InfinityMintDeploymentLive[]>);

                        //do instant setup if we are to
                        await instantSetup();

                        tempProject.deployments = contracts;
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

                    let contractNames = (await deployment.execute(
                        'cleanup',
                        {
                            isFirstTime,
                            error: result as Error,
                            stage: 'deploy',
                            deploymentClasses,
                        },
                        script.infinityConsole,
                        script.infinityConsole.getEventEmitter(),
                        keyValueDeployments,
                        contracts
                    )) as string[];
                    contractNames = contractNames || [
                        deployment.getContractName(),
                    ]; //dont remove contract by default
                    contractNames.forEach((contract) => {
                        if (contracts[contract]) {
                            script.log(`\tRemoving ${contract}`);
                            delete contracts[contract];
                        }
                    });

                    tempProject.deployments = contracts;

                    throw result;
                }

                script.log(
                    `{green-fg}successfully deployed{/green-fg} <${deployment.getContractName()}> (` +
                        tempProject.name +
                        ')\n'
                );
            }
            script.log(`{green-fg}{bold}Deployment Successful{/}`);
        });

        if (deploy !== true) throw deploy;

        //setup stage
        let setup = await always('setup', async (isFirstTime) => {
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
                            project: tempProject,
                            deployments: keyValueDeployments,
                            event: deployment,
                        } as InfinityMintEventEmit<InfinityMintDeployment>);

                        script.log(
                            `\n[${i}] setting up <` +
                                deployment.getKey() +
                                '>(' +
                                deployment.getContractName() +
                                ')'
                        );

                        await deployment.setup({
                            ...script,
                            project: tempProject,
                            deployments: keyValueDeployments,
                            deployment: deployment,
                            event: deployment,
                            deploymentClasses,
                            contracts: contracts,
                            deployed: deployment.hasDeployed(),
                            deploymentScript: deployment.getDeploymentScript(),
                        } as InfinityMintDeploymentParameters);

                        if (save) deployment.saveTemporaryDeployments();

                        contracts[deployment.getContractName()].setup = true;
                        contracts[deployment.getModuleKey()].setup = true;

                        script.infinityConsole.emit('postSetup', {
                            ...script,
                            project: tempProject,
                            deployments: keyValueDeployments,
                            event: deployment,
                        } as InfinityMintEventEmit<InfinityMintDeployment>);
                    }
                );

                //throw error from stage
                if (result !== true) {
                    script.log(
                        `[${i}] cleaning up <` +
                            deployment.getKey() +
                            '>(' +
                            deployment.getContractName() +
                            ') after failed setup'
                    );

                    let contractNames = (await deployment.execute(
                        'cleanup',
                        {
                            isFirstTime,
                            error: result as Error,
                            stage: 'setup',
                            deploymentClasses,
                        },
                        script.infinityConsole,
                        script.infinityConsole.getEventEmitter(),
                        keyValueDeployments,
                        contracts
                    )) as string[];
                    contractNames = contractNames || []; //dont remove contract by default
                    contractNames.forEach((contract) => {
                        if (contracts[contract]) {
                            script.log(`\tRemoving ${contract}`);
                            delete contracts[contract];
                        }
                    });

                    throw result;
                }

                script.log(
                    `{green-fg}successfully setup <${deployment.getContractName()}>{/green-fg} (` +
                        tempProject.name +
                        ')\n'
                );
            }

            script.log(`{green-fg}{bold}Setup Successful{/}`);
        });

        if (setup !== true) throw setup;

        //authentication stage
        let authentication = await action('authentication', async () => {
            script.log(`\n{cyan-fg}{bold}Authenticating Smart Contracts{/}\n`);

            //using await Promise.all breaks ganache?
            let _vals = Object.values(deployments);
            for (let index = 0; index < _vals.length; index++) {
                let deployment = _vals[index];
                if (deployment.isLibrary()) {
                    script.log(`Skipping <${deployment.getContractName()}>\n`);
                    continue;
                }

                script.log(
                    `\n[${index}] authenticating <` +
                        deployment.getKey() +
                        '>(' +
                        deployment.getContractName() +
                        ')'
                );

                let approvedAddresses = [];

                if (deployment.getDeploymentScript().permissions)
                    deployment
                        .getDeploymentScript()
                        .permissions.forEach((statement) => {
                            if (keyValueDeployments[statement]) {
                                script.log(
                                    `\tgiving permissions to => ` + statement
                                );
                                approvedAddresses.push(
                                    contracts[statement].address
                                );
                            } else
                                switch (statement) {
                                    case 'approved':
                                        break;
                                    case 'all':
                                        approvedAddresses = [
                                            ...approvedAddresses,
                                            ...(tempProject.permissions?.all ||
                                                []),
                                            ...(tempProject?.permissions?.[
                                                deployment.getModuleKey()
                                            ] || []),
                                        ];
                                        break;
                                    default:
                                        if (statement.indexOf('0x') === -1) {
                                            warning(
                                                'bad permission key: ' +
                                                    statement
                                            );
                                            return;
                                        }

                                        approvedAddresses.push(statement);
                                }
                        });

                //now do requested permissions
                let requested = deployments
                    .filter((thatDeployment) => {
                        return (
                            thatDeployment
                                .getDeploymentScript()
                                ?.requestPermissions?.includes(
                                    deployment.getModuleKey().toString()
                                ) ||
                            thatDeployment
                                .getDeploymentScript()
                                ?.requestPermissions?.includes(
                                    deployment.getContractName()
                                )
                        );
                    })
                    .map((thatDeployment) => thatDeployment.getAddress());

                approvedAddresses = [...approvedAddresses, ...requested];
                //remove duplicate addresses
                approvedAddresses = approvedAddresses.filter(
                    (item, pos, self) => self.indexOf(item) == pos
                );

                if (approvedAddresses.length === 0) {
                    script.log(`Skipping <${deployment.getContractName()}>\n`);
                    continue;
                }

                script.log(
                    `\n{cyan-fg}Approving ${
                        approvedAddresses.length
                    } with <${deployment.getContractName()}>`
                );

                try {
                    approvedAddresses.forEach((address, index) => {
                        script.log(`[${index}] => ${address}`);
                    });

                    await deployment.multiApprove(approvedAddresses);
                    deployment.setApproved(approvedAddresses);

                    if (save) deployment.saveTemporaryDeployments();
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
        tempProject.deployed = true;
        //set the project deployer
        tempProject.deployer =
            script.infinityConsole.getCurrentAccount().address;

        //post funcs
        let post = await action('post', async (isFirstTime) => {
            script.log(`\n{cyan-fg}{bold}Post Deployment Meta{/}\n`);

            //names to object
            let names = {};

            if (!tempProject.settings.names) tempProject.settings.names = [];

            Object.keys(tempProject.settings.names).forEach((key) => {
                names[key] = tempProject.settings.names[key];
            });

            tempProject.meta.names = names;

            script.log(`\n{cyan-fg}{bold}Post Deployment Functions{/}\n`);

            let postContracts = deployments.filter(
                (deployment) => deployment.getDeploymentScript().post
            );

            if (postContracts.length === 0) {
                script.log(`{yellow-fg}{bold}No Contracts{/}`);
                return;
            }

            for (let i = 0; i < postContracts.length; i++) {
                let deployment = postContracts[i];
                script.log(
                    `[${i}] running post func on <` +
                        deployment.getKey() +
                        '> (' +
                        deployment.getModuleKey() +
                        ')'
                );

                let result = await action(
                    'post_' + deployment.getContractName(),
                    async () => {
                        await deployment.execute(
                            'post',
                            {
                                deploymentClasses,
                            },
                            script.infinityConsole,
                            script.infinityConsole.getEventEmitter(),
                            keyValueDeployments,
                            contracts
                        );
                    }
                );

                //throw error from stage
                if (result !== true) {
                    script.log(
                        `[${i}] cleaning up <` +
                            deployment.getKey() +
                            '>(' +
                            deployment.getContractName() +
                            ') after failed post func exec'
                    );

                    let contractNames = (await deployment.execute(
                        'cleanup',
                        {
                            isFirstTime,
                            error: result as Error,
                            stage: 'post',
                        },
                        script.infinityConsole,
                        script.infinityConsole.getEventEmitter(),
                        keyValueDeployments,
                        contracts
                    )) as string[];
                    contractNames = contractNames || []; //dont remove contract by default
                    contractNames.forEach((contract) => {
                        if (contracts[contract]) {
                            script.log(`\tRemoving ${contract}`);
                            delete contracts[contract];
                        }
                    });

                    throw result;
                }

                script.log(
                    `{green-fg}successfully ran post func <${postContracts[
                        i
                    ].getContractName()}>{/green-fg} (` +
                        tempProject.name +
                        ')\n'
                );
            }
        });

        if (post !== true) throw post;

        //write phase
        let write = await always('write', async () => {
            if (save) {
                script.log(`\n{cyan-fg}{bold}Writing Project{/}`);
                let newProjectPath = getProjectDeploymentPath(
                    tempProject.name,
                    tempProject.network?.name,
                    tempProject.version?.version
                );
                script.log('\tWriting => ' + newProjectPath);
                fs.writeFileSync(
                    path.join(cwd(), newProjectPath),
                    JSON.stringify(tempProject)
                );
                script.log(`{green-fg}{bold}Write Successful{/}\n`);

                script.log(`{cyan-fg}{bold}Writing Deployments{/}`);
                let values = Object.values(deployments);
                for (let index = 0; index < values.length; index++) {
                    let deployment = values[index];

                    script.log(
                        `[${index}] => Writing <${deployment.getContractName()}>`
                    );
                    deployment.saveFinalDeployment();
                    script.log(
                        `\t{green-fg}Success!{/green-fg} => ${deployment.getFilePath()}`
                    );
                }
                script.log(`{green-fg}{bold}Write Successful{/}`);
            } else {
                script.log(
                    `\n{yellow-fg}{bold}Skipping Write (saving is not enabled){/}`
                );

                script.log(`\n{cyan-fg}{bold}Removing Deployments{/}\n`);
                let values = Object.values(deployments);
                for (let index = 0; index < values.length; index++) {
                    let deployment = values[index];
                    if (fs.existsSync(deployment.getFilePath()))
                        await fs.promises.unlink(deployment.getFilePath());
                    else
                        script.log(
                            `\t{gray-fg}Skipping <${deployment.getContractName()}>{/}`
                        );
                }
                script.log(`\n{green-fg}{bold}Removal Successful{/}`);
            }
        });
        if (write !== true) throw write;

        script.log(`\n{cyan-fg}{bold}Removing Temp Deployments{/}\n`);
        let values = Object.values(deployments);
        for (let index = 0; index < values.length; index++) {
            let deployment = values[index];
            if (fs.existsSync(deployment.getTemporaryFilePath())) {
                script.log(
                    `\t{gray-fg}Removing Temp Deployment ${deployment.getTemporaryFilePath()} => <${deployment.getContractName()}>{/}`
                );
                fs.promises.unlink(deployment.getTemporaryFilePath());
            } else
                script.log(
                    `\t{gray-fg}Skipping Temp ${deployment.getTemporaryFilePath()} => <${deployment.getContractName()}>{/}`
                );
        }

        script.log(`\n{cyan-fg}{bold}Removing Temp Project File{/}\n`);
        removeTempDeployedProject(tempProject);

        script.log('\n{cyan-fg}{bold}Stopping Receipt Monitor{/}\n');
        let receipts = await stopReceiptMonitor();
        script.log('\n{cyan-fg}{bold}Generating Receipt Report{/}');
        let report = getReport(receipts);

        script.log(
            `\tReport Path: ${path.join(
                cwd(),
                '/projects/reports/',
                getFullyQualifiedName(tempProject) + '.report.json'
            )}\n\tGas Used: ${report.gasUsage.toString()}\n\tAverage Gas Price: ${(
                report.averageGasPrice / 1000000000
            ).toFixed(2)} gwei\n\tCost (in tokens): ${
                report.cost
            }\n\tTransactions: ${report.transactions}`
        );
        saveReport(tempProject, report);

        script.log('\n{green-fg}{bold}Deployment Successful{/}');
        script.log(`\tProject: ${tempProject.name}`);
        script.log(
            `\tVersion: ${tempProject.version.version} (${tempProject.version.tag})\n` +
                `\tNetwork: ${tempProject.network.name} (chainId:${tempProject.network.chainId})`
        );

        if (script.infinityConsole.network.name !== 'hardhat')
            script.log(
                '{gray-fg}{bold}You can now go ahead and {cyan-fg}export this project!{/}'
            );
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
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
