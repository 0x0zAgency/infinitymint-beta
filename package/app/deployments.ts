import events, { EventEmitter } from 'events';
import {
    InfinityMintDeploymentScript,
    InfinityMintDeploymentParameters,
    InfinityMintDeploymentLive,
    InfinityMintDeploymentLocal,
    InfinityMintEventKeys,
    InfinityMintCompiledProject,
    InfinityMintDeployedProject,
    InfinityMintEventEmitter,
    KeyValue,
    InfinityMintTempProject,
    InfinityMintDeploymentLink,
    InfinityMintDeployments,
} from './interfaces';
import {
    Dictionary,
    cwd,
    debugLog,
    findFiles,
    getConfigFile,
    isEnvTrue,
    isInfinityMint,
    isTypescript,
    log,
    makeDirectories,
    readGlobalSession,
    warning,
} from './helpers';
import {
    getCompiledProject,
    getProjectName,
    findCompiledProject,
} from './projects';
import fs from 'fs';
import path from 'path';
import { deploy, getContract, getDefaultSigner, waitForTx } from './web3';
import { Contract } from '@ethersproject/contracts';
import hre from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import InfinityConsole from './console';
import { Authentication } from '@typechain-types/Authentication';
import { getLoadedGems } from './gems';

/**
 * Deployment class for InfinityMint deployments
 */
export class InfinityMintDeployment {
    /**
     * the event emitter for this deployment. Will be the event emitter of the infinity console if available or a new one.
     */
    protected emitter: EventEmitter;
    /**
     * the deployment script which was used to create this InfinityMintDeployment. See {@link app/interfaces.InfinityMintDeploymentScript}
     */
    protected deploymentScript: InfinityMintDeploymentScript = {};
    /**
     * the live infinity mint deployment interface containing the abi, address, deployer approved and more, See {@link app/interfaces.InfinityMintDeploymentLive}
     */
    protected tempLiveDeployment: InfinityMintDeploymentLive[];

    /**
     * the live infinity mint deployment interface containing the abi, address, deployer approved and more, See {@link app/interfaces.InfinityMintDeploymentLive}
     */
    protected liveDeployment: InfinityMintDeploymentLive[];
    /**
     * the location of the deployment script file
     */
    protected deploymentScriptLocation: string;
    /**
     * the key this deployment will take in the contract property of the InfinityMintDeployedProject. See {@link app/interfaces.InfinityMintDeployedProject}
     */
    protected key: string;

    public readonly isGem: boolean;
    /**
     * the project this deployment is for. See {@link app/interfaces.InfinityMintProject}
     */
    protected project:
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject
        | InfinityMintTempProject;
    /**
     * the network name this deployment is for
     */
    protected network: string;
    /**
     * returns true if the deployment has been deployed to a blockchain
     */
    protected hasDeployedAll: boolean = false;
    /**
     * returns true if the deployment has been set up
     */
    protected hasSetupDeployments: boolean = false;

    /**
     * creates a new InfinityMintDeployment. See {@link app/interfaces.InfinityMintDeploymentScript} for more information on the deployment script. The property key of the deployment script much match the key parameter.
     * @param deploymentScriptLocation
     * @param key
     * @param network
     * @param project
     * @param console
     */
    constructor(
        deploymentScriptLocation: string = null,
        key: string,
        network: string,
        project:
            | InfinityMintCompiledProject
            | InfinityMintTempProject
            | InfinityMintDeployedProject,
        console?: InfinityConsole
    ) {
        this.emitter = console?.getEventEmitter() || new events.EventEmitter();
        this.deploymentScriptLocation = deploymentScriptLocation;
        this.key = key;

        if (
            this.deploymentScriptLocation &&
            fs.existsSync(this.deploymentScriptLocation)
        )
            this.reloadScript();
        else
            debugLog(
                `\tdeploy script for [${this.key}]<${this.project}> not found`
            );

        if (
            this.deploymentScriptLocation &&
            this.deploymentScript.key !== this.key
        )
            throw new Error(
                'key mismatch: ' +
                    this.deploymentScript.key +
                    ' in ' +
                    deploymentScriptLocation +
                    'should equal ' +
                    this.key
            );

        this.network = network;
        this.project = project;
        this.tempLiveDeployment = [];
        this.liveDeployment = [];

        if (fs.existsSync(this.getFilePath())) {
            debugLog(
                `previous deployment for [${this.key}]<${this.project.name}> exists`
            );

            this.liveDeployment = this.readLiveDeployment().liveDeployments || [
                this.readLiveDeployment(),
            ];
            this.hasSetupDeployments = this.readLiveDeployment().setup;

            if (this.tempLiveDeployment.length === 0) {
                this.tempLiveDeployment = this.liveDeployment;
            }

            if (this.liveDeployment.length === this.tempLiveDeployment.length) {
                this.hasDeployedAll = true;
            }
        }

        if (fs.existsSync(this.getTemporaryFilePath())) {
            debugLog(
                `previous temp deployment for [${this.key}]<${this.project.name}> exists`
            );
            this.tempLiveDeployment =
                this.readTemporaryDeployment().liveDeployments ||
                this.tempLiveDeployment ||
                [];
            this.hasDeployedAll = this.tempLiveDeployment.length !== 0;
            this.hasSetupDeployments = this.readTemporaryDeployment().setup;
        }
    }

    readLiveDeployment(index: number = 0) {
        return JSON.parse(
            fs.readFileSync(this.getFilePath(index), { encoding: 'utf8' })
        );
    }

    setLink(link: InfinityMintDeploymentLink) {
        this.deploymentScript.link = link;
    }

    getFilePath(index: number = 0) {
        return path.join(
            cwd(),
            'deployments',
            this.network,
            getProjectName(
                this.project,
                this.project?.version?.version || '1.0.0'
            ),
            this.getContractName(index) + '.json'
        );
    }

    get values() {
        return this.deploymentScript.values;
    }

    /**
     * reloads the source file script
     */
    reloadScript() {
        let location = this.deploymentScriptLocation;
        if (require.cache[location]) {
            debugLog('\tdeleting old cache of ' + location);
            delete require.cache[location];
            debugLog(`\treloading <${location}>`);
        } else debugLog(`\tloading <${location}>`);

        let requirement = require(location);
        this.deploymentScript = requirement.default || requirement;
        if (!this.deploymentScript.key!) this.deploymentScript.key = this.key;
    }

    /**
     * Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple  calls passing the same combination of eventNameand listener will result in the listener being added, and called, multiple times.
     *
     * Returns a reference to the EventEmitter, so that calls can be chained.
     * @param event
     * @param callback
     * @returns
     */
    on(event: InfinityMintEventKeys, callback: (...args: any[]) => void) {
        return this.emitter.on(event, callback);
    }

    /**
     * unregisters a listener
     * @param event
     * @param callback
     * @returns
     */
    off(event: InfinityMintEventKeys, callback: (...args: any[]) => void) {
        return this.emitter.off(event, callback);
    }

    /**
     * returns the index of this deployment. the index is used to determine the order in which the deployments are deployed. The default index is 10.
     * @returns
     */
    getIndex() {
        return this.deploymentScript.index || 10;
    }

    /**
     * returns the current solidity folder. The default solidity folder is 'alpha'. The solidity folder is the folder solc will use to compile the contracts.
     * @returns
     */
    getSolidityFolder() {
        return this.deploymentScript.solidityFolder || 'alpha';
    }

    get read() {
        return this.getContract();
    }

    async write() {
        return this.getSignedContract();
    }

    /**
     * returns the key of this deployment. The key is the same key in the property contracts in the InfinityMintDeployedProject. See {@link app/interfaces.InfinityMintDeployedProject}
     * @returns
     */
    getKey() {
        return this.key;
    }

    /**
     * Defines which InfinityMintProjectModules this deployment satities. A module is a type of contract that is used by other contracts or by the frontend. See {@link app/interfaces.InfinityMintProjectModules}. Some possible modules include 'erc721', 'assets', 'random' and 'minter'.
     * @returns
     */
    getModuleKey() {
        return this.deploymentScript.module;
    }

    /**
     * gets the name of the live deployment at the specified index. If no index is specified, the name of the first live deployment is returned.
     * @param index
     * @returns
     */
    getContractName(index: number = 0) {
        return this.tempLiveDeployment.length !== 0 &&
            this.tempLiveDeployment[index]
            ? this.tempLiveDeployment[index]?.name ||
                  this.tempLiveDeployment[index]?.contractName
            : this?.deploymentScript?.contract || this.key;
    }

    /**
     *
     * @param index
     * @returns
     */
    async getArtifact(index: number = 0) {
        let contractName = this.getContractName(index);

        return await hre.artifacts.readArtifact(contractName);
    }

    /**
     *
     * @param index
     * @returns
     */
    hasLiveDeployment(index: number = 0) {
        return this.liveDeployment[index] !== undefined;
    }

    /**
     * gets a live deployment, only accessible once deployment has succeeded a deploy script
     * @param index
     * @returns
     */
    getLiveDeployment<T extends InfinityMintDeploymentLive>(index: number = 0) {
        let deployment = this.liveDeployment[index];
        return deployment as T;
    }

    /**
     * returns the permissions of this deployment. The permissions are used to determine which contracts can call this contract.
     */
    getPermissions() {
        return this.deploymentScript.permissions;
    }

    /**
     * gets the temporary deployment file path
     * @returns
     */
    getTemporaryFilePath() {
        return path.join(
            cwd(),
            `/temp/deployments/${this.project.name}@${
                this.project.version?.version || '1.0.0'
            }/`,
            `${this.key}_${this.network}.json`
        );
    }

    public setApproved(addresses: string[], index: number = 0) {
        this.tempLiveDeployment[index].approved = addresses;
    }

    public async multiApprove(addresses: string[]) {
        if (!this.hasDeployed) throw new Error('please deploy contract first');

        let contract = (await this.getSignedContract()) as Authentication;
        return await waitForTx(
            await contract.multiApprove(addresses),
            'multi approve'
        );
    }

    public async isAuthenticated(addressToCheck: string) {
        if (!this.hasDeployed) throw new Error('please deploy contract first');

        let contract = (await this.getSignedContract()) as Authentication;

        return await contract.isAuthenticated(addressToCheck);
    }

    /**
     *
     * @param addresses
     */
    public async multiRevoke(addresses: string[]) {
        if (!this.hasDeployed) throw new Error('please deploy contract first');

        let contract = (await this.getSignedContract()) as Authentication;
        return await waitForTx(
            await contract.multiRevoke(addresses),
            'multi revoke'
        );
    }

    /**
     * TODO: needs an interface
     * returns a parsed temporary deployment
     * @returns
     */
    private readTemporaryDeployment() {
        if (!fs.existsSync(this.getTemporaryFilePath()))
            return {
                liveDeployments: {},
            };

        let result = JSON.parse(
            fs.readFileSync(this.getTemporaryFilePath(), {
                encoding: 'utf-8',
            })
        );

        if (
            (result.project && result.project !== this.project.name) ||
            (result.network && result.network !== this.network)
        )
            throw new Error(
                'bad file: ' +
                    this.getTemporaryFilePath() +
                    ' is from another network/project'
            );

        return result;
    }

    /**
     * returns a live deployment by its artifact name
     * @param name
     * @returns
     */
    getDeploymentByArtifactName(name: string) {
        return this.tempLiveDeployment.filter(
            (deployment) => (deployment.name = name)
        )[0];
    }

    /**
     * gets the deployer of the live deployment at the specified index. If no index is specified, the deployer of the first live deployment is returned.
     * @param index
     * @returns
     */
    getDeployer(index?: number) {
        return this.tempLiveDeployment[index || 0].deployer;
    }

    /**
     * gets the approved addresses of the live deployment at the specified index. If no index is specified, the approved addresses of the first live deployment is returned.
     * @param index
     * @returns
     */
    getApproved(index?: number) {
        return this.tempLiveDeployment[index || 0].approved || [];
    }

    /**
     * gets the address of the live deployment at the specified index. If no index is specified, the address of the first live deployment is returned.
     * @param index
     * @returns
     */
    getAddress(index?: number) {
        return this.tempLiveDeployment[index || 0].address;
    }

    isLink() {
        return this.deploymentScript.link !== undefined;
    }

    getLinkKey() {
        return this.deploymentScript?.link.key || this.getContractName();
    }

    getLink() {
        return this.deploymentScript.link;
    }

    /**
     * returns true if this deployment is a library
     * @returns
     */
    isLibrary() {
        return this.deploymentScript.library;
    }

    /**
     * returns the abi of the live deployment at the specified index. If no index is specified, the abi of the first live deployment is returned.
     * @param index
     * @returns
     */
    getAbi(index?: number) {
        return this.tempLiveDeployment[index || 0].abi;
    }

    /**
     * returns all of the deployed contracts for this deployment
     * @returns
     */
    getDeployments() {
        return this.tempLiveDeployment;
    }

    reset() {
        this.tempLiveDeployment = [];
        this.liveDeployment = [];
        this.hasDeployedAll = false;
        this.hasSetupDeployments = false;
        this.saveTemporaryDeployments();
    }

    /**
     * returns true if this deployment is important. An important deployment is a deployment that is required for the project to function. If an important deployment fails to deploy, the project will not be deployed. Import contracts will also be deployed first.
     * @returns
     */
    isImportant() {
        return this.deploymentScript?.important;
    }

    /**
     * returns true if this deployment is unique. A unique deployment is a deployment that can only be deployed once. If a unique deployment has already been deployed, it will not be deployed again.
     * @returns
     */
    isUnique() {
        return this.deploymentScript?.unique;
    }

    /**
     * returns true if this deployment has been deployed
     * @returns
     */
    hasDeployed() {
        return this.hasDeployedAll;
    }

    /**
     * returns true if the deployment has been setup
     * @returns
     */
    hasSetup() {
        return this.hasSetupDeployments;
    }

    /**
     * saves the live deployments to the temporary deployment file
     */
    saveTemporaryDeployments() {
        let deployments = this.readTemporaryDeployment();
        deployments.liveDeployments = this.tempLiveDeployment;
        deployments.updated = Date.now();
        deployments.network = this.network;
        deployments.name = this.getContractName();
        deployments.project = this.project.name;
        deployments.setup = this.hasSetupDeployments;

        //make the directory
        makeDirectories(
            cwd() +
                `/temp/deployments/${this.project.name}@${
                    this.project.version?.version || '1.0.0'
                }/`
        );

        fs.writeFileSync(
            this.getTemporaryFilePath(),
            JSON.stringify(deployments)
        );
    }

    /**
     * Will read temporary deployment and then write it to the real deployment location
     */
    public saveFinalDeployment() {
        let deployments = this.readTemporaryDeployment();
        deployments.liveDeployments = this.tempLiveDeployment;
        deployments = {
            ...deployments,
            ...deployments.liveDeployments[0],
        };
        deployments.updated = Date.now();
        deployments.network = this.network;
        deployments.name = this.getContractName();
        deployments.project = this.project.name;
        deployments.setup = this.hasSetupDeployments;

        fs.writeFileSync(this.getFilePath(), JSON.stringify(deployments));
    }

    /**
     * Returns an ethers contract instance of this deployment for you to connect signers too.
     * @param index
     * @returns
     */
    getContract<T extends Contract>(index?: number, provider?: any) {
        return getContract<T>(
            this.tempLiveDeployment[index || 0] ||
                this.tempLiveDeployment[index || 0],
            provider
        ) as T;
    }

    /**
     * Returns a signed contract with the current account.
     * @param index
     * @returns
     */
    async getSignedContract<T extends Contract>(
        index?: number,
        signer?: SignerWithAddress,
        provider?: any
    ) {
        let contract = this.getContract<T>(index, provider);
        signer = signer || (await getDefaultSigner());
        return contract.connect(signer) as T;
    }

    /**
     * used after deploy to set the the live deployments for this deployment. See {@link app/interfaces.InfinityMintDeploymentLive}, Will check if each member has the same network and project name as the one this deployment class is attached too
     * @param liveDeployments
     */
    public updateLiveDeployments(
        liveDeployments:
            | InfinityMintDeploymentLive
            | InfinityMintDeploymentLive[]
    ) {
        if (liveDeployments instanceof Array)
            (liveDeployments as InfinityMintDeploymentLive[]) = [
                ...liveDeployments,
            ];

        let mismatchNetworkAndProject = liveDeployments.filter(
            (deployment: InfinityMintDeploymentLive) =>
                deployment.network.name !== this.network ||
                deployment.project !== this.project.name
        ) as InfinityMintDeploymentLive[];

        //throw error if we found any
        if (mismatchNetworkAndProject.length !== 0)
            throw new Error(
                'one or more deployments are from a different network or project, check: ' +
                    mismatchNetworkAndProject.map(
                        (deployment) =>
                            `<${deployment.key}>(${deployment.name}), `
                    )
            );

        this.tempLiveDeployment =
            liveDeployments as InfinityMintDeploymentLive[];
        this.saveTemporaryDeployments();
    }

    /**
     * returns true if we have a local deployment for this current network
     * @param index
     * @returns
     */
    hasLocalDeployment(index?: number) {
        let deployment = this.tempLiveDeployment[index || 0];
        let path =
            cwd() +
            '/deployments/' +
            this.network +
            '/' +
            deployment.name +
            '.json';

        return fs.existsSync(path);
    }

    /**
     * gets a deployment inside of the current /deployments/ folder
     * @param index
     * @returns
     */
    getLocalDeployment(index?: number) {
        let deployment = this.tempLiveDeployment[index || 0];
        let path =
            cwd() +
            '/deployments/' +
            this.network +
            '/' +
            deployment.name +
            '.json';

        if (!fs.existsSync(path))
            throw new Error('local deployment not found: ' + path);

        return JSON.parse(
            fs.readFileSync(path, {
                encoding: 'utf-8',
            })
        ) as InfinityMintDeploymentLocal;
    }

    /**
     * returns the deployment script for this deployment
     * @returns
     */
    public getDeploymentScript<T extends InfinityMintDeploymentScript>() {
        return this.deploymentScript as T;
    }

    public getValues<T>() {
        return this.deploymentScript.values as T;
    }

    public setDefaultValues(values: KeyValue, save = false) {
        this.liveDeployment.forEach((deployment) => {
            deployment.values = {
                ...deployment.values,
                ...values,
            };
        });

        this.tempLiveDeployment.forEach((deployment) => {
            deployment.values = {
                ...deployment.values,
                ...values,
            };
        });

        if (save) {
            this.saveTemporaryDeployments();
            this.saveFinalDeployment();
        }
    }

    /**
     * returns the location the deployment script is located at
     * @returns
     */
    public getDeploymentScriptLocation() {
        return this.deploymentScriptLocation;
    }

    /**
     * Deploys this ssmart contract
     * @param args
     * @returns
     */
    async deploy(...args: any) {
        this.reloadScript();

        let result = (await this.execute('deploy', args)) as {
            contract: Contract;
            localDeployment: InfinityMintDeploymentLocal;
        };

        if (!result)
            throw new Error('deploy function did not return a contract');

        if (result instanceof Array) {
            result.forEach((result) => {
                this.tempLiveDeployment.push(
                    this.populateLiveDeployment(result.localDeployment)
                );
            });
        } else
            this.tempLiveDeployment.push(
                this.populateLiveDeployment(result.localDeployment)
            );

        return this.tempLiveDeployment;
    }

    /**
     * used internally to turn an InfinityMintDeploymentLocal into an InfinityMintDeploymentLive
     * @param localDeployment
     * @returns
     */
    private populateLiveDeployment(
        localDeployment: InfinityMintDeploymentLocal
    ) {
        let deployment = localDeployment as any;
        deployment.key = this.deploymentScript.key;
        deployment.javascript =
            (this.project as InfinityMintTempProject).source.ext === '.js';
        deployment.project = getProjectName(this.project);
        deployment.network = {
            name: hre.network.name,
            chainId: hre.network.config.chainId,
        };
        deployment.name = deployment.contractName;
        deployment.source = path.parse(this.deploymentScriptLocation);
        deployment.permissions = [];

        return deployment as InfinityMintDeploymentLive;
    }

    /**
     * approves wallets passed in to be able to run admin methods on the contract
     * @param addresses
     * @param log
     * @returns
     */
    async setPermissions(addresses: string[]) {
        let contract = await this.getSignedContract();
        let authenticator = contract;

        if (!authenticator?.multiApprove) {
            if (isEnvTrue('THROW_ALL_ERRORS'))
                throw new Error(`${this.key} does not have an approve method`);
            else warning(`${this.key} does not have an approve method`);

            return;
        }
        let tx = await authenticator.multiApprove(addresses);

        return await waitForTx(
            tx,
            `setting ${addresses} permissions inside of ${this.key}`
        );
    }

    /**
     * calls the setup method on the deployment script
     * @param args
     */
    async setup(...args: any) {
        this.reloadScript();
        await this.execute('setup', args);
        this.hasSetupDeployments = true;
    }

    async getLibaries() {
        let libs: any = {};
        Object.keys(this.deploymentScript.libraries || {}).forEach((key) => {
            let lib = this.deploymentScript.libraries[key];
            if (lib === true)
                libs[key] =
                    typeof this.project.libraries[key] === 'string'
                        ? this.project.libraries[key]
                        : (
                              this.project.libraries[
                                  key
                              ] as InfinityMintDeploymentLive
                          ).address;
            else libs[key] = this.deploymentScript.libraries[key];
        });

        return libs;
    }

    /**
     * Executes a method on the deploy script and immediately returns the value. Setup will return ethers contracts.
     * @param method
     * @param args
     * @returns
     */
    async execute(
        method: 'setup' | 'deploy' | 'update' | 'switch' | 'cleanup' | 'post',
        args: KeyValue,
        infinityConsole?: InfinityConsole,
        eventEmitter?: InfinityMintEventEmitter,
        deployments?: InfinityMintDeployments,
        contracts?: any
    ) {
        let params = {
            debugLog: debugLog,
            deployment: this,
            deployments: deployments,
            contracts: contracts,
            log: log,
            infinityConsole: infinityConsole,
            eventEmitter: eventEmitter || this.emitter,
        } as InfinityMintDeploymentParameters;

        params = { ...params, ...(args[0] || args) };

        if (params.project === undefined) params.project = this.project;

        debugLog(
            'executing deployment method => ' + method + ' <' + this.key + '>'
        );

        switch (method) {
            case 'deploy':
                if (this.deploymentScript.deploy) {
                    let result = await this.deploymentScript.deploy(params);
                    this.hasDeployedAll = true;
                    return result;
                } else if (this.getContractName()) {
                    let replacables = {
                        '%token_name%': this.project.information.tokenSingular,
                        '%token_name_multiple%':
                            this.project.information.tokenMultiple,
                        '%token_symbol%': this.project.information.tokenSymbol,
                    };

                    let _args = [];
                    if (this.deploymentScript.deployArgs instanceof Array)
                        _args = this.deploymentScript.deployArgs as any[];
                    else if (
                        this.deploymentScript.deployArgs instanceof Function ||
                        typeof this.deploymentScript.deployArgs === 'function'
                    )
                        _args = await (
                            this.deploymentScript?.deployArgs as any
                        )(params);

                    _args = Object.values(_args);
                    _args = _args.map((arg) => {
                        if (!isNaN(arg)) return parseFloat(arg);

                        let deployments = (
                            this.project as InfinityMintTempProject
                        ).deployments;

                        if (deployments[arg]) return deployments[arg].address;

                        Object.keys(replacables).forEach((key) => {
                            arg = arg.replace(key, replacables[key]);
                        });
                        return arg;
                    });

                    debugLog('args => [' + _args.join(',') + ']');

                    let libs = {};
                    Object.keys(this.deploymentScript.libraries || {}).forEach(
                        (key) => {
                            let lib = this.deploymentScript.libraries[key];
                            if (lib === true)
                                libs[key] =
                                    typeof this.project.libraries[key] ===
                                    'string'
                                        ? this.project.libraries[key]
                                        : (
                                              this.project.libraries[
                                                  key
                                              ] as InfinityMintDeploymentLive
                                          ).address;
                            else
                                libs[key] =
                                    this.deploymentScript.libraries[key];
                        }
                    );

                    let result = await deploy(
                        this.getContractName(),
                        this.project as any,
                        _args,
                        libs,
                        undefined,
                        args?.save || true,
                        args?.usePreviousDeployment || false
                    );
                    this.hasDeployedAll = true;
                    return result;
                } else
                    throw new Error(
                        'no deploy method found on ' +
                            this.key +
                            ' and no contractName specified so cannot automatically deploy'
                    );
            case 'setup':
                if (this.deploymentScript.setup)
                    await this.deploymentScript.setup(params);
                return;
            case 'update':
                if (this.deploymentScript.update)
                    await this.deploymentScript.update(params);
                return;

            case 'post':
                if (this.deploymentScript.post)
                    await this.deploymentScript.post(params);
                return;
            case 'cleanup':
                try {
                    if (this.deploymentScript.cleanup)
                        return await this.deploymentScript.cleanup(params);
                    else {
                        this.tempLiveDeployment = [];
                        this.hasDeployedAll = false;
                        this.hasSetupDeployments = false;
                        this.saveTemporaryDeployments();
                    }
                } catch (error) {
                    warning(
                        'Failed to run cleanup on => ' + this.getContractName()
                    );
                    warning(error.message);
                }
                return;
            case 'switch':
                if (this.deploymentScript.switch)
                    await this.deploymentScript.switch(params);
                return;
            default:
                throw new Error('unknown method:' + this.execute);
        }
    }
}

/**
 * loads all deployment classes for a project
 * @param project
 * @param console
 * @returns
 */
export const loadDeploymentClasses = async (
    project: InfinityMintDeployedProject | InfinityMintCompiledProject,
    console?: InfinityConsole
) => {
    let deployments = [...(await getDeploymentClasses(project, console))];

    //add stuff to config by default
    let config = getConfigFile();

    //add default settings to config file if they dont exist
    deployments.forEach((deployment) => {
        if (deployment.getDeploymentScript().config) {
            if (!config.settings) config.settings;
            if (!config.settings.deploy) config.settings.deploy = {};

            //loop each key in the config and add a default value
            let scrape = (obj: any, self: any) => {
                Object.keys(obj).forEach((key) => {
                    if (typeof obj[key] === 'object') {
                        if (!self[key]) self[key] = {};
                        scrape(obj[key], self[key]);
                    } else {
                        if (self[key] === undefined) self[key] = obj[key];
                    }
                });
            };
            scrape(
                deployment.getDeploymentScript().config,
                config.settings.deploy
            );
        }
    });

    return deployments;
};

export const toKeyValues = (
    loadDeploymentClasses: InfinityMintDeployment[]
) => {
    let keys: Dictionary<InfinityMintDeployment> = {};
    loadDeploymentClasses.forEach((deployment) => {
        keys[deployment.getModuleKey() || deployment.getContractName()] =
            deployment;
    });
    return keys;
};

export const filterLinkDeployments = (
    projectOrPath:
        | string
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject,
    loadedDeploymentClasses: InfinityMintDeployment[],
    includeAll: boolean = false
) => {
    let compiledProject:
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject = findCompiledProject(projectOrPath);
    let currentKeys = {};
    let links = loadedDeploymentClasses.filter((deployment) => {
        if (!deployment.isLink()) return false;
        let key = deployment.getLinkKey();

        if (
            !includeAll &&
            !compiledProject.settings.defaultLinks?.[key] &&
            !deployment.isImportant()
        ) {
            debugLog(
                'skipping link ' +
                    key +
                    ' as it is not in the project settings links and is not important'
            );
            return false;
        }

        if (currentKeys[key]) return false;
        currentKeys[key] = true;
        return true;
    });

    //sort the deployments based on getIndex
    links.sort((a, b) => {
        if (a.getIndex() > b.getIndex()) return 1;
        if (a.getIndex() < b.getIndex()) return -1;
        return 0;
    });

    return links;
};

/**
 * Returns a list of deployment classes which are InfinityLinks
 * @param projectOrPath
 * @param loadedDeploymentClasses
 * @returns
 */
export const loadProjectDeploymentLinks = async (
    projectOrPath:
        | string
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject,
    console?: InfinityConsole,
    loadedDeploymentClasses?: InfinityMintDeployment[],
    includeAll?: boolean
) => {
    let compiledProject:
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject = findCompiledProject(projectOrPath);

    loadedDeploymentClasses =
        loadedDeploymentClasses ||
        (await loadDeploymentClasses(compiledProject, console));

    return filterLinkDeployments(
        compiledProject,
        loadedDeploymentClasses,
        includeAll
    );
};

export const filterUsedDeploymentClasses = (
    projectOrPath:
        | string
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject,
    loadedDeploymentClasses: InfinityMintDeployment[]
) => {
    let compiledProject:
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject = findCompiledProject(projectOrPath);

    let currentModules = {};
    let deployments = loadedDeploymentClasses.filter((deployment) => {
        if (deployment.isLink()) return false;
        if (deployment.isLibrary()) return true;
        if (
            compiledProject.modules[deployment.getModuleKey()] === undefined &&
            currentModules[deployment.getModuleKey()] === undefined
        ) {
            currentModules[deployment.getModuleKey()] = true;
            return true;
        }

        if (
            compiledProject.modules[deployment.getModuleKey()] !== undefined &&
            deployment.getContractName() ===
                compiledProject.modules[deployment.getModuleKey()]
        ) {
            currentModules[deployment.getModuleKey()] = true;
            return true;
        }
    });

    //sort the deployments based on getIndex
    deployments.sort((a, b) => {
        if (a.getIndex() > b.getIndex()) return 1;
        if (a.getIndex() < b.getIndex()) return -1;
        return 0;
    });

    return deployments;
};

/**
 * Returns a list of deployment classes relating to a project in order to deploy it ready to be steped through
 * @param projectOrPath
 * @param loadedDeploymentClasses
 * @returns
 */
export const loadProjectDeploymentClasses = async (
    projectOrPath:
        | string
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject,
    console?: InfinityConsole,
    loadedDeploymentClasses?: InfinityMintDeployment[]
) => {
    let compiledProject:
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject = findCompiledProject(projectOrPath);

    loadedDeploymentClasses =
        loadedDeploymentClasses ||
        (await loadDeploymentClasses(compiledProject, console));

    if (!(compiledProject as any).compiled)
        throw new Error(
            'please compile ' +
                compiledProject.name +
                ' before trying to get deployment classes'
        );

    return filterUsedDeploymentClasses(
        compiledProject,
        loadedDeploymentClasses
    );
};

/**
 * gets a deployment in the /deployments/network/ folder and turns it into an InfinityMintDeploymentLive
 */
export const getLocalDeployment = (contractName: string, network: string) => {
    return readLocalDeployment(contractName, network);
};

/**
 * Returns the raw .json file in the /deployments/network/ folder
 * @param contractName
 * @returns
 */
export const readLocalDeployment = (contractName: string, network: string) => {
    let path = cwd() + '/deployments/' + network + '/' + contractName + '.json';

    if (!fs.existsSync(path)) throw new Error(`${path} not found`);
    return JSON.parse(
        fs.readFileSync(path, { encoding: 'utf-8' })
    ) as InfinityMintDeploymentLocal;
};

/**
 * Returns true if a deployment manifest for this key/contractName is found
 * @param contractName - can be a key (erc721, assets) or a fully qualified contract name
 * @param project
 * @param network
 * @returns
 */
export const hasDeploymentManifest = (
    contractName: string,
    project: InfinityMintDeployedProject | InfinityMintCompiledProject,
    network?: string
) => {
    network = network || project?.network?.name;

    if (!network) throw new Error('unable to automatically determain network');

    let path =
        cwd() +
        `/temp/deployments/${project.name}@${
            project.version?.version || '1.0.0'
        }/${contractName}_${network}.json`;
    return fs.existsSync(path);
};

export const getDeploymentClass = (
    contractName: string,
    project: InfinityMintDeployedProject,
    network?: string
) => {
    network = network || project?.network?.name;

    if (!network) throw new Error('unable to automatically determin network');

    let liveDeployments = getLiveDeployments(contractName, project, network);
    return create(liveDeployments[0]);
};

export const getLiveDeployments = (
    contractName: string,
    project: InfinityMintCompiledProject | InfinityMintDeployedProject,
    network: string
) => {
    let path =
        cwd() +
        `/temp/deployments/${project.name}@${
            project.version?.version || '1.0.0'
        }/${contractName}_${network}.json`;

    if (!hasDeploymentManifest(contractName, project, network)) return [];

    let result = JSON.parse(
        fs.readFileSync(path, {
            encoding: 'utf-8',
        })
    );
    return (result.liveDeployments || []) as InfinityMintDeploymentLive[];
};

/**
 * Returns a new deployment class from a live deployment file
 * @param liveDeployment
 * @returns
 */
export const create = (
    liveDeployment: InfinityMintDeploymentLive,
    deploymentScript?: string,
    project?: InfinityMintCompiledProject | InfinityMintTempProject
) => {
    return new InfinityMintDeployment(
        deploymentScript || liveDeployment?.contractName,
        liveDeployment.key,
        liveDeployment.network.name,
        project || getCompiledProject(liveDeployment.project)
    );
};

/**
 * Returns a list of InfinityMintDeployment classes for the network and project based on the deployment typescripts which are found.
 * @returns
 */
export const getDeploymentClasses = async (
    project:
        | InfinityMintDeployedProject
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject,
    console?: InfinityConsole,
    network?: string,
    roots?: string[]
): Promise<InfinityMintDeployment[]> => {
    if (!project) throw new Error('project is undefined');

    network = network || project.network?.name || hre.network.name;

    let session = readGlobalSession();
    let config = getConfigFile();
    if (!network) throw new Error('unable to automatically find network');

    let searchLocations = [
        ...(roots || []),
        ...(config.roots || []).map((root: string) => {
            if (
                root.startsWith('../') ||
                root.startsWith('./') ||
                root.startsWith('/../')
            )
                root =
                    cwd() +
                    '/' +
                    (root.startsWith('/') ? root.substring(1) : root);

            if (!root.endsWith('/')) root += '/';
            return root + 'deploy/**/*.js';
        }),
    ];

    searchLocations.push(cwd() + '/deploy/**/*.js');

    if (isTypescript() || !config.settings?.compile?.disallowTypescript) {
        searchLocations.push(cwd() + '/deploy/**/*.ts');
        searchLocations.push(
            ...(config.roots || []).map((root: string) => {
                if (
                    root.startsWith('../') ||
                    root.startsWith('./') ||
                    root.startsWith('/../')
                )
                    root =
                        cwd() +
                        '/' +
                        (root.startsWith('/') ? root.substring(1) : root);

                if (!root.endsWith('/')) root += '/';
                return root + 'deploy/**/*.ts';
            })
        );
    }

    if (!isInfinityMint() && !isEnvTrue('INFINITYMINT_UNINCLUDE_DEPLOY'))
        searchLocations.push(
            cwd() + '/node_modules/infinitymint/dist/deploy/**/*.js'
        );

    //remove duplicates
    searchLocations = searchLocations.filter(
        (value, index, self) => self.indexOf(value) === index
    );

    let deployments = [];
    for (let i = 0; i < searchLocations.length; i++) {
        let isSkipping = false;
        if (config.settings?.scripts?.classicScripts)
            config.settings.scripts.classicScripts.forEach((script) => {
                if (searchLocations[i].includes(script as string))
                    isSkipping = true;
            });

        if (config.settings?.scripts?.disableDeployScripts)
            config.settings.scripts.disableDeployScripts.forEach((script) => {
                if (searchLocations[i].includes(script as string))
                    isSkipping = true;
            });

        if (isSkipping) {
            debugLog(
                'skipping (since disabled in config) => ' + searchLocations[i]
            );
            continue;
        }

        debugLog('scanning for deployment scripts in => ' + searchLocations[i]);
        let files = await findFiles(searchLocations[i]);
        files = files.filter(
            (file) =>
                !file.endsWith('.d.ts') && !file.endsWith('.type-extension.ts')
        );

        files.map((file, index) => {
            let key = path.parse(file).name;
            debugLog(`[${index}] => ${key}`);
            let result = new InfinityMintDeployment(
                file,
                key,
                network,
                project,
                console
            );

            if (
                result.getDeploymentScript()?.solidityFolder !==
                session.environment.solidityFolder
            )
                debugLog(
                    '\tskipping (since wrong solidity folder) => ' +
                        searchLocations[i]
                );
            else deployments.push(result);
        });
    }

    //also do gems
    let gems = getLoadedGems();
    Object.values(gems).map((gem) => {
        //get deployment scripts
        let deploymentScripts = gem.deployScripts;
        if (!deploymentScripts) return;

        //require the deployment scripts
        for (let i = 0; i < deploymentScripts.length; i++) {
            let deploymentScript = require(deploymentScripts[
                i
            ]) as InfinityMintDeploymentScript;
            deploymentScript =
                (deploymentScript as any).default || deploymentScript;

            let result = new InfinityMintDeployment(
                deploymentScripts[i],
                deploymentScript.key,
                network,
                project,
                console
            );
            if (
                result.getDeploymentScript()?.solidityFolder !==
                session.environment.solidityFolder
            )
                debugLog(
                    '\tskipping (since wrong solidity folder) => ' +
                        searchLocations[i]
                );
            else deployments.push(result);
        }
    });

    return deployments;
};
