import {
    readGlobalSession,
    log,
    readJson,
    getConfigFile,
    findFiles,
    write,
    cwd,
    replaceSeperators,
    isTypescript,
    saveGlobalSessionFile,
    warning,
    debugLog,
} from './helpers';
import { Contract, ContractTransaction } from '@ethersproject/contracts';
import hre, { ethers } from 'hardhat';
import {
    InfinityMintProject,
    InfinityMintDeployedProject,
    InfinityMintCompiledProject,
    InfinityMintTempProject,
    InfinityMintScriptParameters,
    InfinityMintProjectUpdate,
    InfinityMintDeployments,
    InfinityMintProjectAsset,
    InfinityMintProjectPath,
} from './interfaces';
import path from 'path';
import { Dictionary } from './helpers';
import fs, { PathLike } from 'fs';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
    loadProjectDeploymentClasses,
    InfinityMintDeployment,
    filterUsedDeploymentClasses,
    toKeyValues,
} from './deployments';
import InfinityConsole from './console';
import { InfinityMint, TokenMintedEvent } from '@typechain-types/InfinityMint';
import {
    InfinityMintObject,
    InfinityMintStorage,
} from '@typechain-types/InfinityMintStorage';
import { InfinityMintValues } from '@typechain-types/InfinityMintValues';
import { findEvent, waitForTx } from './web3';
import { InfinityMintApi } from '@typechain-types/InfinityMintApi';
import { InfinityMintFlags } from '@typechain-types/InfinityMintFlags';
import { InfinityMintLinker } from '@typechain-types/InfinityMintLinker';
import { Token, generateToken } from './token';
import { PromiseOrValue } from '@typechain-types/common';
import { BigNumberish } from 'ethers';
import { InfinityMintAsset } from '@typechain-types/InfinityMintAsset';

/**
 * The default InfinityMint project class
 */
export class Project {
    public version: string = '1.0.0';
    public compiledProject: InfinityMintCompiledProject;
    public source: InfinityMintProject;
    public deployments: InfinityMintDeployments;
    public network: string = 'ganache';
    protected deployed: Dictionary<InfinityMintDeployedProject>;
    protected temp: InfinityMintTempProject;
    private infinityConsole: InfinityConsole;

    constructor(
        projectNameOrProject:
            | string
            | InfinityMintProject
            | InfinityMintDeployedProject,
        console: InfinityConsole,
        version?: string,
        network?: string
    ) {
        if (typeof projectNameOrProject === 'string')
            this.source = findProject(
                projectNameOrProject
            ) as InfinityMintProject;
        else this.source = projectNameOrProject as InfinityMintProject;

        if (hasCompiledProject(this.source, version))
            this.compiledProject = getCompiledProject(this.source, version);
        else this.compiledProject = null;

        this.infinityConsole = console;
        this.version = version || this.version;
        this.network = network || hre.network.name;
    }

    /**
     *
     * @param network
     */
    async setNetwork(network: string) {
        this.network = network || hre.network.name;
        await this.loadDeployments(network);
    }

    public get name() {
        return this.source?.name || this.deployedProject?.name;
    }

    public get deployedProject() {
        return this.deployed?.[this.network];
    }

    async loadDeployments(network: string) {
        network = this.network || hre.network.name;

        if (this.hasDeployed(network)) this.readDeployedProject(network);
        else
            log(
                `No deployed project found for ${this.source.name} on ${network}.`,
                'yellow'
            );

        let deployments = await loadProjectDeploymentClasses(
            this.compiledProject || this.deployed[network],
            this.infinityConsole
        );

        this.deployments = toKeyValues(deployments);

        if (!this.network) this.network = network;
    }

    getAsset(assetId: number) {
        if (assetId <= 0) assetId = 1;

        return (this.deployed?.[this.network].assets ||
            this.compiledProject.assets ||
            this.source.assets)[assetId - 1] as InfinityMintProjectAsset;
    }

    getPath(pathId: number) {
        return (this.deployed?.[this.network].paths ||
            this.compiledProject.paths ||
            this.source.paths)[pathId - 1] as InfinityMintProjectPath;
    }

    getFullyQualifiedName(network?: string) {
        let src = this.deployed?.[network || this.network] || this.source;
        return getFullyQualifiedName(
            src,
            this.version,
            network || (src as any)?.network?.name || this.network
        );
    }

    getNameAndVersion(includeVersion: boolean = true) {
        return `${this.name}${includeVersion ? `@${this.version}` : ''}`;
    }

    private readDeployedProject(network?: string) {
        network = network || this.network || hre.network.name;
        this.deployed = this.deployed || {};
        this.deployed[network] = getDeployedProject(
            this.source,
            network,
            this.version
        );
    }

    hasDeployed(network?: string) {
        network = network || this.network;
        return hasDeployedProject(this.source, network, this.version);
    }

    hasCompiled() {
        return hasCompiledProject(this.source, this.version);
    }

    getDeployedProject(network?: string): InfinityMintDeployedProject {
        network = network || this.network || hre.network.name;

        this.readDeployedProject(network);
        return this.deployed[network];
    }

    /**
     * Mints multiple tokens to the current address
     * @param count
     * @param projectNameOrProject
     * @param options
     * @returns
     */
    public async mintMultiple(
        tokens: InfinityMintObject.InfinityObjectStructOutput[]
    ) {
        let pathIds = tokens.map((token) => token.pathId);
        let colours = tokens.map((token) => token.colours);
        let mintData = tokens.map((token) => token.mintData);
        let assets = tokens.map((token) => token.assets);
        let names = tokens.map((token) => token.names);
        let erc721 = await this.erc721();
        let tx = await erc721.implicitBatch(
            pathIds,
            colours,
            mintData,
            assets,
            names
        );

        let receipt = await waitForTx(
            tx,
            'mint multiple ' + tokens.length + 'x tokens'
        );
        return receipt;
    }

    public async erc721(): Promise<InfinityMint> {
        return await this.getSignedContract<InfinityMint>('erc721');
    }

    public async storage(): Promise<InfinityMintStorage> {
        return await this.getSignedContract<InfinityMintStorage>('storage');
    }

    public async values(): Promise<InfinityMintValues> {
        return await this.getSignedContract<InfinityMintValues>('values');
    }

    public async api(): Promise<InfinityMintApi> {
        return await this.getSignedContract<InfinityMintApi>('api');
    }

    public async assets(): Promise<InfinityMintAsset> {
        return await this.getSignedContract<InfinityMintAsset>('api');
    }

    public async flags(): Promise<InfinityMintFlags> {
        return await this.getSignedContract<InfinityMintFlags>('flags');
    }

    public async linker(): Promise<InfinityMintLinker> {
        return await this.getSignedContract<InfinityMintLinker>('linker');
    }

    public async setFlag(
        tokenId: PromiseOrValue<BigNumberish>,
        flag: PromiseOrValue<string>,
        value: boolean | Promise<boolean>
    ) {
        let flags = await this.flags();
        let tx = await flags.setFlag(tokenId, flag, value);
        await waitForTx(tx, `set flag ${flag} to ${value}`);
    }

    public async setGlobalFlag(flag: string, value: boolean) {
        let flags = await this.flags();
        let tx = await flags.setGlobalFlag(flag, value);
        await waitForTx(tx, `set global flag ${flag} to ${value}`);
    }

    public async setOnChainOption(option: string, value: string) {
        let flags = await this.flags();
        let tx = await flags.setOption(option, value);
        await waitForTx(tx, `set option ${option} to ${value}`);
    }

    public async hasOnChainOption(option: string) {
        let flags = await this.flags();
        return await flags.hasOption(option);
    }

    public async getOnChainOption(option: string) {
        let flags = await this.flags();
        return await flags.getOption(option);
    }

    public async setOnChainOptions(options: { [key: string]: string }) {
        let flags = await this.flags();
        let tx = await flags.setOptions(
            Object.keys(options),
            Object.values(options)
        );
        await waitForTx(tx, `set options ${JSON.stringify(options)}`);

        return tx;
    }

    /**
     * Will return a non signed contract related to the project for you to use. contractName can be the full name of the contract or the module key it might use.
     *
     * eg (all are the same):
     *  - InfinityMint
     *  - InfinityMint:InfinityMint
     *  - erc721
     *
     *
     * @param contractNameOrModuleKey
     * @param signer
     * @param contractIndex
     * @returns
     */
    public async getContract<T extends Contract>(
        contractNameOrModuleKey: string,
        provider?: any,
        contractIndex?: number
    ) {
        let result = filterUsedDeploymentClasses(
            this.getDeployedProject(),
            Object.values(this.deployments)
        );
        let deployments = toKeyValues(result);

        if (!deployments[contractNameOrModuleKey])
            throw new Error(
                'no contract/model key found: ' + contractNameOrModuleKey
            );

        if (!deployments[contractNameOrModuleKey].hasDeployed())
            throw new Error(
                'contract/model has not been deployed: ' +
                    contractNameOrModuleKey
            );

        return deployments[contractNameOrModuleKey].getContract<T>(
            contractIndex,
            provider
        );
    }

    /**
     * Will return a signed contract related to the project for you to use. contractName can be the full name of the contract or the module key it might use.
     *
     * eg (all are the same):
     *  - InfinityMint
     *  - InfinityMint:InfinityMint
     *  - erc721
     *
     *
     * @param contractNameOrModuleKey
     * @param signer
     * @param contractIndex
     * @returns
     */
    public async getSignedContract<T extends Contract>(
        contractNameOrModuleKey: string,
        signer?: SignerWithAddress,
        provider?: any,
        contractIndex?: number
    ) {
        if (!this.deployments)
            throw new Error(
                'no deployments found, please load deployments first'
            );

        let result = filterUsedDeploymentClasses(
            this.getDeployedProject(),
            Object.values(this.deployments)
        );

        let deployments = toKeyValues(result);

        if (!deployments[contractNameOrModuleKey])
            throw new Error(
                'no contract/model key found: ' + contractNameOrModuleKey
            );

        if (!deployments[contractNameOrModuleKey].hasDeployed())
            throw new Error(
                'contract/model has not been deployed: ' +
                    contractNameOrModuleKey
            );

        return deployments[contractNameOrModuleKey].getSignedContract<T>(
            contractIndex,
            signer,
            provider
        );
    }

    /**
     * Creates a random token
     * @param pathId
     * @returns
     */
    public createRandomToken(pathId?: number) {
        let newToken = generateToken(this.deployedProject, pathId);
        return new Token(
            this,
            parseInt(newToken.currentTokenId.toString()),
            newToken as any
        );
    }

    /**
     * Gets a token from the project
     * @param tokenId
     * @returns
     */
    public async getToken(tokenId: number) {
        let token = new Token(this, tokenId);
        await token.load();
        return token;
    }

    /**
     *
     * @param projectNameOrProject
     * @param options
     * @returns
     */
    public async mint(
        options?: {
            to?: string;
            pathId: number;
            pathSize: number;
            mintData: string;
            assets?: string[];
            colours?: string[];
            names?: string[];
        },
        gasLimit?: number,
        useImplicitMint = false
    ) {
        let account =
            options?.to || this.infinityConsole.getCurrentAccount().address;
        let erc721 = await this.erc721();
        let tx: ContractTransaction;
        if (useImplicitMint)
            tx = await erc721.implicitMint(
                account,
                options?.pathId,
                options.colours || [],
                options?.mintData,
                options?.assets || [],
                options?.names || [],
                {
                    gasLimit: gasLimit || 1000000,
                }
            );
        else tx = await erc721.mint();
        let receipt = await waitForTx(tx, 'minted token');
        let event = findEvent<TokenMintedEvent>('TokenMinted', receipt);
        let token = new Token(this, event.args[0], null, receipt);
        await token.load();
        return token;
    }
}
/**
 *
 * @returns
 */
export const getCurrentProject = (cleanCache?: boolean) => {
    if (!getCurrentProjectPath()) return null;

    return requireProject(
        getCurrentProjectPath().dir + '/' + getCurrentProjectPath().base,
        getCurrentProjectPath().ext !== '.ts',
        cleanCache
    );
};

/**
 * Returns a parsed path the current project source file
 * @returns
 */
export const getCurrentProjectPath = () => {
    let session = readGlobalSession();

    if (!session.environment.project) return undefined;
    return session.environment.project as path.ParsedPath;
};

/**
 * Returns a deployed project for the current project, takes a network.
 * @param network
 * @returns
 */
export const getCurrentDeployedProject = (network?: string) => {
    if (!getCurrentProject()) return null;

    network = network || require('hardhat')?.network?.name || 'hardhat';
    return getDeployedProject(getCurrentProject() as any, network);
};

export const hasCompiledProject = (
    project: InfinityMintProject | InfinityMintTempProject,
    version?: string
) => {
    version = version || '1.0.0';
    let projectName = getProjectName(project);
    let filename = getProjectCompiledPath(projectName, version);
    return fs.existsSync(cwd() + filename);
};

/**
 * Will use temporary compiled project if it exists, otherwise will use the compiled project.
 * @param projectOrPath
 * @returns
 */
export const findCompiledProject = (projectOrPath: any) => {
    let compiledProject:
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject;
    if (typeof projectOrPath === 'string') {
        let project = findProject(projectOrPath);

        if (hasTempDeployedProject(project))
            compiledProject = getTempDeployedProject(project);
        else if (hasCompiledProject(project))
            compiledProject = getCompiledProject(project);
        else
            throw new Error(
                'no valid project found to get deployment classes for: ' +
                    projectOrPath
            );
    } else compiledProject = projectOrPath;
    return compiledProject;
};

/**
 * Returns a compiled InfinityMintProject ready to be deployed, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 * @throws
 */
export const getCompiledProject = (
    project: InfinityMintProject | InfinityMintTempProject | string,
    version?: string
) => {
    version =
        version ||
        (typeof project === 'string' && project.indexOf('@') !== -1
            ? (project as string).split('@')[1] || undefined
            : undefined) ||
        '1.0.0';
    let projectName = getProjectName(
        typeof project === 'string'
            ? ({
                  name: project,
              } as any)
            : project
    );
    let filename = getProjectCompiledPath(projectName, version);
    let res = readJson(cwd() + filename);

    if (!res.compiled)
        throw new Error(`project ${projectName} has not been compiled`);

    return res as InfinityMintCompiledProject;
};

/**
 *
 * @param project
 * @param version
 * @param network
 * @returns
 */
export const getNameWithNetwork = (
    project:
        | InfinityMintProject
        | InfinityMintTempProject
        | InfinityMintDeployedProject,
    version?: string,
    network?: string
) => {
    network = network || hre.network.name;
    return getFullyQualifiedName(project, version, network);
};

/**
 * Must specify a network if you want it to be included
 * @param project
 * @param version
 * @param network
 * @returns
 */
export const getFullyQualifiedName = (
    project:
        | InfinityMintProject
        | InfinityMintTempProject
        | InfinityMintDeployedProject,
    version?: string,
    network?: string
) => {
    return (
        getProjectName(project) +
        '@' +
        (version ? version : project?.version?.version || '1.0.0') +
        ((project as any)?.network?.name || network
            ? `_${(project as any)?.network?.name || network}`
            : '')
    );
};

export const getProjectName = (
    project: InfinityMintProject | InfinityMintTempProject,
    version?: string
) => {
    return (
        (
            project?.name ||
            (project as any)?.description?.name ||
            (project.source as path.ParsedPath)?.name
        ).split('@')[0] + (version ? `@${version}` : '')
    );
};

export const getProjectVersion = (projectFullName: string) => {
    return projectFullName?.split('@')[1]?.split('_')[0];
};

export const hasTempCompiledProject = (
    project: InfinityMintProject | InfinityMintTempProject,
    version?: string
) => {
    let projectName = getProjectName(project);
    if (!projectName) return false;

    version = version || '1.0.0';
    let filename = `/temp/projects/${projectName}@${version}.compiled.temp.json`;

    return fs.existsSync(cwd() + filename);
};

export const hasTempDeployedProject = (
    project: InfinityMintProject | InfinityMintTempProject,
    version?: string
) => {
    let projectName = getProjectName(project);
    if (!projectName) return false;
    version = version || '1.0.0';
    let filename = `/temp/projects/${projectName}@${version}.deployed.temp.json`;
    return fs.existsSync(cwd() + filename);
};

export const saveTempDeployedProject = (
    project: InfinityMintTempProject,
    network?: string
) => {
    let filename = `/temp/projects/${project.name}@${
        project.version?.version || '1.0.0'
    }_${network || hre.network.name}.deployed.temp.json`;
    write(filename, project);
};

export const removeTempDeployedProject = (
    project: InfinityMintTempProject,
    version?: string,
    network?: string
) => {
    let filename = `/temp/projects/${project.name}@${
        version || project.version?.version || '1.0.0'
    }_${
        network || project?.network?.name || hre.network.name
    }.deployed.temp.json`;
    fs.unlinkSync(cwd() + filename);
};

export const removeTempCompliledProject = (
    project: InfinityMintTempProject,
    version?: string
) => {
    let filename = `/temp/projects/${project.name}@${
        version || project.version?.version || '1.0.0'
    }.compiled.temp.json`;
    fs.unlinkSync(cwd() + filename);
};

export const saveTempCompiledProject = (project: InfinityMintTempProject) => {
    let filename = `/temp/projects/${project.name}@${
        project.version?.version || '1.0.0'
    }.compiled.temp.json`;
    write(filename, project);
};

/**
 * Returns a temporary deployed InfinityMintProject which can be picked up and completed.
 * @param projectName
 * @returns
 * @throws
 */
export const getTempDeployedProject = (
    project: InfinityMintProject | string | InfinityMintCompiledProject,
    version?: string,
    network?: string
) => {
    version =
        version ||
        (typeof project === 'string' && project.indexOf('@') !== -1
            ? (project as string).split('@')[1] || undefined
            : undefined) ||
        (project as any)?.version?.version ||
        '1.0.0';
    let projectName = getProjectName(
        typeof project === 'string'
            ? ({
                  name: project,
              } as any)
            : project
    );

    network = network || (project as any)?.network?.name || hre.network.name;
    let filename = `/temp/projects/${projectName}@${version}_${network}.deployed.temp.json`;
    try {
        let res = readJson(cwd() + filename);
        return res as InfinityMintTempProject;
    } catch (error) {
        throw new Error(
            'could not load temp deployed project: ' + error.message
        );
    }
};

/**
 * Returns a temporary compiled InfinityMintProject which can be picked up and completed.
 * @param projectName
 * @returns
 * @throws
 */
export const getTempCompiledProject = (
    project: InfinityMintProject | string | InfinityMintCompiledProject,
    version?: string
) => {
    version =
        version ||
        (typeof project === 'string' && project.indexOf('@') !== -1
            ? (project as string).split('@')[1] || undefined
            : undefined) ||
        '1.0.0';
    let projectName = getProjectName(
        typeof project === 'string'
            ? ({
                  name: project,
              } as any)
            : project
    );
    let filename = `/temp/projects/${projectName}@${version}.compiled.temp.json`;
    try {
        let res = readJson(cwd() + filename);
        return res as InfinityMintTempProject;
    } catch (error) {
        throw new Error(
            'could not load temp compiled project: ' + error.message
        );
    }
};

export const deleteDeployedProject = (
    project:
        | InfinityMintCompiledProject
        | InfinityMintProject
        | InfinityMintDeployedProject,
    network: string,
    version?: string
) => {
    fs.unlinkSync(
        cwd() +
            getProjectDeploymentPath(getProjectName(project), network, version)
    );
};

export const getProjectCompiledPath = (
    projectName: string,
    version?: string
) => {
    projectName = projectName.split('@')[0];
    return `/projects/compiled/${projectName}@${version || '1.0.0'}.json`;
};

export const deleteCompiledProject = (
    project: InfinityMintCompiledProject | InfinityMintProject,
    version?: string
) => {
    fs.unlinkSync(
        cwd() +
            getProjectCompiledPath(
                getProjectName(project),
                version || project.version.version
            )
    );
};

/**
 *
 * @param project
 * @param version
 * @returns
 */
export const hasDeployedProject = (
    project:
        | InfinityMintProject
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject,
    network: string,
    version?: string
) => {
    version = version || project?.version?.version || '1.0.0';
    let projectName = getFullyQualifiedName(project, version);
    let filename = getProjectDeploymentPath(projectName, network, version);

    return fs.existsSync(cwd() + filename);
};

export const getProjectDeploymentPath = (
    projectName: string,
    network: string,
    version?: any
) => {
    projectName = projectName.split('@')[0];

    return `/projects/deployed/${network}/${projectName}@${
        version || '1.0.0'
    }_${network}.json`;
};

/**
 * Returns a deployed InfinityMintProject, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 */
export const getDeployedProject = (
    project:
        | InfinityMintProject
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject,
    network: string,
    version?: any
) => {
    version = version || '1.0.0';
    let projectName = getProjectName(project);
    let filename = getProjectDeploymentPath(projectName, network, version);

    if (!fs.existsSync(cwd() + filename)) return null;
    let res = readJson(cwd() + filename);

    //
    if (!res.deployed)
        throw new Error(
            `project ${projectName}@${version} has not been deployed to ${network}`
        );

    return res as InfinityMintDeployedProject;
};

export interface ProjectCache {
    updated: number;
    database: Dictionary<path.ParsedPath>;
    keys: Dictionary<string>;
    projects?: string[];
}

/**
 *
 * @returns
 */
export const readProjectCache = (): ProjectCache => {
    if (!fs.existsSync(cwd() + '/temp/projects_cache.json'))
        return {
            updated: Date.now(),
            database: {},
            keys: {},
            projects: [],
        };

    return JSON.parse(
        fs.readFileSync(cwd() + '/temp/projects_cache.json', {
            encoding: 'utf-8',
        })
    ) as ProjectCache;
};

export const formatCacheEntry = (
    project: InfinityMintProject,
    path: path.ParsedPath,
    name?: string
) => {
    name =
        name || (project.name || path.name) + '@' + path.dir + '/' + path.base;
    let newKeys = {};
    let root: string | string[] = path.dir.split('projects');
    if (root.length > 2) root.slice(1).join('projects');
    else root = root[1];
    let nss = root[0] === '/' ? (root as string).substring(1) : root;
    let projectName =
        project.name || (project as any)?.description?.name || path.name;

    newKeys[path.dir + '/' + path.base] = name;
    newKeys[path.dir + '/' + path.name] = name;
    newKeys['/' + path.name] = name;
    newKeys['/' + path.base] = name;
    newKeys['/projects/' + path.name] = name;
    newKeys['/projects/' + path.base] = name;
    newKeys['projects/' + path.base] = name;
    newKeys[cwd() + '/' + path.name] = name;
    newKeys[cwd() + '/' + path.base] = name;
    newKeys[cwd() + '/projects/' + path.name] = name;
    newKeys[cwd() + '/projects/' + path.base] = name;
    newKeys[root + '/' + path.name] = name;
    newKeys[root + '/' + path.base] = name;
    newKeys[nss + '/' + path.name] = name;
    newKeys[nss + '/' + path.base] = name;
    newKeys[path.name] = name;
    newKeys[path.name + '@' + (project.version?.tag || '1.0.0')] = name;
    newKeys[path.name + '@' + (project.version?.tag || '1.0.0') + path.ext] =
        name;
    newKeys[
        path.name +
            '@' +
            (project?.version?.version === '1.0.0' ||
            project?.version?.tag === 'initial'
                ? 'initial'
                : project?.version?.tag || 'initial')
    ] = name;
    newKeys[path.name + '@source'] = name;
    newKeys[path.base] = name;
    newKeys[projectName] = name;
    newKeys[projectName + '@' + (project.version?.tag || '1.0.0')] = name;
    newKeys[
        projectName +
            '@' +
            (project?.version?.version === '1.0.0' ||
            project?.version?.tag === 'initial'
                ? 'initial'
                : project?.version?.tag || 'initial')
    ] = name;
    newKeys[projectName + '@source'] = name;
    newKeys[projectName + path.ext] = name;

    Object.keys(newKeys).forEach((key) => {
        newKeys['C:' + replaceSeperators(key, true)] = newKeys[key];
    });

    return newKeys;
};

export const parseProject = (path: path.ParsedPath, cache?: ProjectCache) => {
    cache = cache || {
        updated: Date.now(),
        database: {},
        keys: {},
        projects: [],
    };

    let project = requireProject(
        path.dir + '/' + path.base,
        path.ext !== '.ts'
    );
    let name = (project.name || path.name) + '@' + path.dir + '/' + path.base;
    let version = project?.version?.version || project.version || `1.0.0`;

    if (!cache.projects.includes(project.name + '@' + version))
        cache.projects.push(project.name + '@' + version);

    if (cache.database[name]) {
        name =
            name +
            '_' +
            Object.keys(cache.database).filter((key) => key === name).length;
        cache.database[name];
    } else cache.database[name] = path;

    cache.keys = {
        ...cache.keys,
        ...formatCacheEntry(project, path, name),
    };

    return cache;
};

/**
 *
 * @param projects
 */
export const writeParsedProjects = (projects: path.ParsedPath[]) => {
    let cache = {
        updated: Date.now(),
        database: {},
        keys: {},
        projects: [],
    } as ProjectCache;

    projects.forEach((path) => {
        parseProject(path, cache);
    });

    fs.writeFileSync(
        cwd() + '/temp/projects_cache.json',
        JSON.stringify(cache)
    );

    return cache;
};

let projectCache: ProjectCache;
export const getProjectCache = (useFresh?: boolean) => {
    if (useFresh || !projectCache) projectCache = readProjectCache();
    return projectCache;
};

/**
 *
 * @param roots
 * @returns
 */
export const findProjects = async (roots: PathLike[] = []) => {
    let config = getConfigFile();
    roots = [
        ...roots,
        cwd() + '/projects/',
        ...(config.roots || []).map((root: string) => {
            if (root.startsWith('../'))
                root = root.replace('../', cwd() + '/../');
            return (
                root +
                (root[root.length - 1] !== '/' ? '/projects/' : 'projects/')
            );
        }),
    ];

    let projects = [];
    for (let i = 0; i < roots.length; i++) {
        projects = [
            ...projects,
            ...(await findFiles(roots[i] + '**/*.json')),
            ...(await findFiles(roots[i] + '**/*.js')),
            ...(await findFiles(roots[i] + '**/*.cjs')),
            ...(await findFiles(roots[i] + '**/*.mjs')),
        ];
        if (isTypescript() || !config.settings?.scripts?.disallowTypescript) {
            projects = [
                ...projects,
                ...(await findFiles(roots[i] + '**/*.ts')),
            ];
            projects = projects.filter(
                (x) => !x.endsWith('.d.ts') && !x.endsWith('.type-extension.ts')
            );
        }
    }

    //remove update folder
    projects = projects.filter((x) => !x.includes('/projects/updates/'));
    return projects.map((filePath) => path.parse(filePath));
};

/**
 *
 * @param script
 * @param type
 * @returns
 */
export const createTemporaryProject = (
    script: InfinityMintScriptParameters,
    type?: 'deployed' | 'compiled' | 'source',
    network?: string,
    version?: any,
    newVersion?: any
) => {
    let project = script.args?.project?.value
        ? (hasCompiledProject(script.project.source)
              ? getCompiledProject(findProject(script.args?.project?.value))
              : null) || findProject(script.args?.project?.value)
        : script.project.compiledProject || script.project.source;

    if (!project)
        throw new Error(
            'project not found, please specify a project with the --project flag'
        );

    network = network || hre.network?.name;
    version =
        version ||
        project?.version?.version ||
        script.args.target?.value ||
        '1.0.0';

    if (
        !script.args?.dontUseTemp?.value &&
        type === 'compiled' &&
        hasTempCompiledProject(project, newVersion || version)
    ) {
        script.infinityConsole.log(
            '{yellow-fg}found previous compiled project attempting to retry{/yellow-fg}'
        );
        return getTempCompiledProject(project, newVersion || version);
    } else if (type === 'compiled' && hasCompiledProject(project, version)) {
        let compiledProject = getCompiledProject(project, version);

        if (compiledProject) {
            compiledProject.version.version = newVersion || version;
            return compiledProject;
        }
    } else if (
        !script.args?.dontUseTemp?.value &&
        type === 'deployed' &&
        hasTempDeployedProject(project, version)
    ) {
        script.infinityConsole.log(
            '{yellow-fg}found previous deployed project attempting to retry{/yellow-fg}'
        );
        return getTempDeployedProject(project, newVersion || version);
    } else if (
        type === 'deployed' &&
        hasDeployedProject(project, network, version)
    ) {
        let deployedProject = getDeployedProject(project, network, version);

        if (deployedProject) {
            deployedProject.version.version = newVersion || version;
            return deployedProject;
        }
    }

    if (type === 'deployed')
        warning('deployed project not found, using source');

    if (type === 'compiled')
        warning('compiled project not found, using source');

    return project as InfinityMintTempProject;
};

/**
 *
 * @param projectOrPathName
 * @returns
 */
export const getProjectSource = (
    projectOrPathName:
        | string
        | InfinityMintProject
        | InfinityMintTempProject
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject
) => {
    let key =
        typeof projectOrPathName === 'string'
            ? projectOrPathName
            : getProjectName(projectOrPathName as any);
    let projects = getProjectCache();
    return projects.database[projects.keys[key]];
};

/**
 * Returns a project class, see {@link app/projects.Project}
 * @param projectOrPathName
 * @param infinityConsole
 * @returns
 */
export const getProject = async (
    projectOrPathName: string,
    network: string,
    infinityConsole: InfinityConsole,
    version?: string
) => {
    version = version || projectOrPathName.split('@')[1];
    let result = findProject(projectOrPathName);

    if (!result) throw new Error('project not found => ' + projectOrPathName);

    if (hasCompiledProject(result, version) && !version)
        version = getCompiledProject(result, version).version?.version;

    let project = new Project(
        result,
        infinityConsole,
        version || result?.version?.version || '1.0.0',
        network
    );

    if (hasDeployedProject(project.source, network, version))
        await project.loadDeployments(network).catch((e) => {
            warning(
                'error loading deployments for ' +
                    result.name +
                    '=>\n' +
                    e.stack
            );
        });
    else
        debugLog(
            'no deployments found for ' + result.name + ' on network ' + network
        );

    return project;
};

/**
 * Gets a project
 * @param projectNameOrPath
 * @returns
 */
export const findProject = (
    projectNameOrPath: string
): InfinityMintProject | InfinityMintDeployedProject => {
    let projects = getProjectCache();

    if (!projects.keys[projectNameOrPath])
        throw new Error('cannot find project: ' + projectNameOrPath);

    let projectName = projects.keys[projectNameOrPath];
    if (!projects.database[projectName] && findProject(projectNameOrPath))
        projectName = findProject(projectNameOrPath).name;

    if (!projects.database[projectName])
        throw new Error('cannot find project: ' + projectNameOrPath);

    let result = requireProject(
        projects.database[projectName].dir +
            '/' +
            projects.database[projectName].base,
        projects.database[projectName].ext !== '.ts',
        true
    );
    if (!result.name) result.name = projects.database[projectName].name;

    return result;
};

/**
 * Returns an InfinityMintProject file relative to the /projects/ folder, see {@link app/interfaces.InfinityMintProject}. Will return type of InfinityMintProjectClassic if second param is true.
 * @param projectName
 * @param isJavaScript
 * @throws
 */
export const requireProject = (
    projectPath: PathLike,
    isJavaScript: boolean,
    clearCache?: boolean
) => {
    if (clearCache && require.cache[projectPath as string])
        delete require.cache[projectPath as string];

    let res = require(projectPath as string);
    res = res.default || res;
    res.javascript = isJavaScript;
    res.source = projectPath;
    res.name =
        res.name ||
        res.description?.name ||
        path.parse(projectPath.toString()).name;
    if (isJavaScript) return res as InfinityMintProject;
    return res as InfinityMintProject;
};

/**
 *
 * @returns
 */
export const getCurrentCompiledProject = () => {
    if (!getCurrentProject())
        return {
            name: 'unknown',
            version: {
                tag: 'unknown',
                version: 'unknown',
            },
        } as InfinityMintProject;
    return getCompiledProject(getCurrentProject() as any);
};
