import { BigNumber } from 'ethers';
import { HardhatUserConfig } from 'hardhat/types';
import { debugLog, log } from './helpers';
import { EventEmitter } from 'events';
import { Contract } from '@ethersproject/contracts';
import InfinityConsole from './console';
import { InfinityMintDeployment } from './deployments';
import { PathLike, Stats } from 'fs';
import { InfinityMintSVGSettings } from './content';
import { GasPriceFunction, TokenPriceFunction } from './gasAndPrices';
import { ImportType } from './imports';
import { ParsedPath } from 'path';
import { DeployResult } from 'hardhat-deploy/dist/types';
import { Dictionary } from './helpers';
import { ExpressServer } from './express';
import { Project } from './projects';
import {
    InfinityMintDeploymentClass,
    InfinityMintLinkerDeploymentClass,
    InfinityMintProjectDeploymentClass,
    InfinityMintStorageDeploymentClass,
    InfinityMintValuesDeploymentClass,
} from '@infinitymint-types/deployments';

/**
 * Shorthand for Dictionary<any>, defines your typical javascript object
 */
export interface KeyValue extends Dictionary<any> {}

/**
 * Gems are our plugins. They allow you to easily extend the functionality of InfinityMint. Gems an contain solidity code, react code and more and integrate with every aspect of InfinityMint
 */
export interface InfinityMintGemScript extends InfinityMintDeploymentScript {
    /**
     * the name of this gem, does not have to be the same name as the folder it sits in
     */
    name: string;
    /**
     * called when the gem is first loaded into InfinityMint, useful when registering new windows with the InfinityConsole. Is initialized
     * based on the load order of the gem. You get all of the same order of execution options as you would do with a {@link InfinityMintDeploymentScript}
     */
    init: (parameters: InfinityMintGemParameters) => Promise<void>;
    /**
     * Allows event hooks to be defined the same as inside of the InfinityMint project file. *Please note that the context here in relation to pre build, pre set up and pre compile is in relation to the project and events will not be fired when the gem is set up, compiled or built. You need to use gemPostSetup and gemPreSetup if you would like to do calls when your gem is setup and after it has set up.
     */
    events?: InfinityMintEvents;
}

/**
 * Parameters which are passed into the deploy, setup and init methods inside of a {@link InfinityMintGemScript}.
 */
export interface InfinityMintGemParameters
    extends InfinityMintDeploymentParameters {
    gem: Gem;
    script: InfinityMintGemScript;
}

/**
 * This is what is passed into the callback methods which you assign to events. Event is the event data whcich was emitted. Script might be accessible depending on the context this event was emitted. Events can be emitted inside and outside of InfinityMint scripts as well as in deploy scripts, so make sure to check if the members you are trying to access are not undefined.
 */
export interface InfinityMintEventEmit<T>
    extends InfinityMintDeploymentParameters,
        KeyValue {
    event?: T;
    /**
     * might be accessible depending on the context of the event
     */
    gems?: Dictionary<InfinityMintGemScript>;
    /**
     *  Depending on the context of the event, either script or deploy script will be accessible
     */
    script?: InfinityMintScript;
}

/**
 * returned from the .json file inside of a gem folder. Contains metadata information about the gem as well as its git location and verison and solidity root
 */
export interface InfinityMintGemConfig {
    name?: string;
    infinitymint: string;
    homepage?: string;
    git?: string;
    version: string;
    solidityFolder: string;
    author?: KeyValue | KeyValue[];
}

export interface InfinityMintApplicationConfig {
    productionChains: any[];
    testChains: any[];
}

export interface BundleType extends ImportType {
    bundle?: string;
}

/**
 *
 */
export interface InfinityMintStaticManifest {
    project?: string;
    stylesheets?: Array<PathLike>;
    images?: Dictionary<PathLike>;
    javascript?: Array<PathLike> | Dictionary<PathLike>;
}

/**
 * the gem as it is, this is not the compiled version of the gem. This is the raw version of the gem as it is in the gem folder. This is what is used to compile the gem.
 */
export interface Gem {
    name: string;
    sources: string[];
    metadata: any;
    pages: string[];
    hasLoaded: boolean;
    components: string[];
    deployScripts: string[];
    modals: string[];
    script?: InfinityMintGemScript;
    modules?: {
        main: string;
        client: string;
        setup: string;
        deploy: string;
    };
    routes?: string[];
    windows: string[];
    windowComponents: string[];
    scripts: string[];
    contracts: string[];
    hasMainScript?: boolean;
    hasClientScript?: boolean;
    isOldGem?: boolean;
    hasSetupScript?: boolean;
    hasDeployScript?: boolean;
}

export interface InfinityMintBundle extends Dictionary<any> {
    version?: string;
    bundle?: string;
    imports?: Dictionary<BundleType>;
    ipfs?: Array<PathLike>;
}

/**
 * A compiled version of the InfinityMintProject, unlike the InfinityMintProject this does not contain any events which might have been defined in the project. You must include the project javascript or typescript file as well as the compiled project to also be able to do events.
 */
export interface InfinityMintCompiledProject {
    /**
     * the name of the current project
     */
    name: string;
    /**
     *
     */
    libraries?: Dictionary<
        string | InfinityMintDeploymentLocal | InfinityMintDeploymentLive
    >;

    updates?: Dictionary<InfinityMintProjectUpdate>;

    /**
     *
     */
    links?:
        | Dictionary<InfinityMintCompiledLink>
        | Dictionary<InfinityMintProjectSettingsLink>
        | Array<InfinityMintProjectSettingsLink>;
    /**
     * specificy other projects by name to have them deploy along side this minter and be packed together into the export location.
     */
    system?: Array<string>;
    /**
     * which infinity mint modules to use in the creation of your minter, here you can specify things such as the the `asset, minter, royalty or random` solidity contract you are using.
     */
    modules: InfinityMintProjectModules;
    /**
     * The price of your tokens. This can be in a decimal (for crypto) or as a real life value, for example:
     * ```js
     * //price: '$1',
     * //price: 0.15,
     * ```
     */
    price: number | BigNumber | string;
    /**
     * The information relating to your project.
     *
     * @see {@link InfinityMintProjectInformation}
     */
    information: InfinityMintProjectInformation;
    /**
     * An array containing the gems which are associated with this project.
     *
     * @see {@link InfinityMintProjectGem}
     */
    gems?: Array<InfinityMintProjectGem>;

    /**
     * All the possible mint varations of the minter, must be an Array of {@link InfinityMintProjectPath}
     */
    paths: Array<InfinityMintProjectPath>;
    /**
     * All the possible asset varations of the minter, must be an Array of {@link InfinityMintProjectAsset}
     */
    assets?:
        | Array<InfinityMintProjectAsset>
        | Dictionary<InfinityMintProjectAsset>;
    /**
     * The settings of the project. The settings key is which deployment the settings should be for, and you can enter what ever you like here.
     *
     * @see {@link InfinityMintProjectSettings}
     */
    settings?: InfinityMintProjectSettings;
    /**
     * The permissions of your project. here you can specify if certian addresses get free mint privilages or specific access to gems.
     *
     * @see {@link InfinityMintProjectPermissions}
     */
    permissions?: InfinityMintProjectPermissions;

    /**
     *
     */
    imports?: Dictionary<string>;

    /**
     *
     */
    source?: ParsedPath;

    /**
     *
     */
    bundles?: InfinityMintBundle;

    /**
     * The version information for this project
     */
    version?: {
        /**
         * @defaultValue initial
         */
        tag: string;
        /**
         * @defaultValue 0.0.1
         */
        version: string;
    };
    /**
     * only available in deployed InfinityMint projects
     */
    network: {
        /**
         * chain id of the network this project was deployed too
         */
        chainId: number;
        /**
         * rpc url if added, must specify in the config to add. See {@link InfinityMintConfig}
         */
        url?: string;
        /**
         * the name of the network
         */
        name: string;
        /**
         * the token symbol
         */
        tokenSymbol?: string;
    };
    meta?: {
        paths?: {
            disabledPaths?: [];
        };
        bundle?: string;
        usingRarity?: boolean;
        names?: Dictionary<string>;
        flags?: {};
        assets?: {
            sections?: string[];
        };
    };
    /**
     * is true if this is a compiled infinitymint project.
     */
    compiled?: boolean;
    /**
     * Only set when the project is compiled, the SolidityFolder this project was compiled with
     * @default undefined
     */
    compiledSolidityFolder: PathLike;
}

/**
 * Defines an infinitymint temporary project, a temporary project is created before a project is compiled or deployed. Effectively for the reason to allows you to restart where you last left off in case anything is wrong. Temporary projects are turned into either an InfinityMintComiledProject or an InfinityMintDeployedProject.
 */
export interface InfinityMintTempProject
    extends InfinityMintCompiledProject,
        InfinityMintDeployedProject {
    /**
     * A dictionary containing all of the currently deployed contracts associated with this project. Values inside of this object are inserted based on their key if they are a core infinity mint deployment (erc721, minter, assets) as well as by their contract name (DefaultMinter, RaritySVG) this also applies for gems as well. Note that deployments might not available if the project is compiling or deploying for the first time.
     *
     * @see {@link InfinityMintDeploymentLive}
     */
    deployments?: Dictionary<InfinityMintDeploymentLive>;
    /**
     * Used in keeping track of temporary projects which fail in their deployment. keeps track of stages we have passed so we can continue where we left off if anything goes wrong.
     */
    stages?: KeyValue;
    /**
     * if this is project has completed the setup stage yet
     */
    setup?: boolean;

    /**
     *
     */
    source?: ParsedPath;
}

/**
 *
 */
export interface InfinityMintDeployedProject
    extends InfinityMintCompiledProject {
    /**
     * the name of the current project
     */
    name: string;

    /**
     *
     */
    stages?: KeyValue;
    /**
     * custom infinityLinks which can be linked to the token
     */
    links?:
        | Dictionary<InfinityMintCompiledLink>
        | Dictionary<InfinityMintProjectSettingsLink>
        | Array<InfinityMintProjectSettingsLink>;
    /**
     * specificy other projects by name to have them deploy along side this minter and be packed together into the export location.
     */
    system?: Array<string>;
    /**
     * which infinity mint modules to use in the creation of your minter, here you can specify things such as the the `asset, minter, royalty or random` solidity contract you are using.
     */
    modules: InfinityMintProjectModules;
    /**
     * The price of your tokens. This can be in a decimal (for crypto) or as a real life value, for example:
     * ```js
     * //price: '$1',
     * //price: 0.15,
     * ```
     */
    price: number | BigNumber | string;
    /**
     * The information relating to your project.
     *
     * @see {@link InfinityMintProjectInformation}
     */
    information: InfinityMintProjectInformation;
    /**
     * An array containing the gems which are associated with this project.
     *
     * @see {@link InfinityMintProjectGem}
     */
    gems?: Array<InfinityMintProjectGem>;
    /**
     * All the possible mint varations of the minter, must be an Array of {@link InfinityMintProjectPath}
     */
    paths: Array<InfinityMintProjectPath>;
    assets?:
        | Array<InfinityMintProjectAsset>
        | Dictionary<InfinityMintProjectAsset>;
    /**
     * The settings of the project. The settings key is which deployment the settings should be for, and you can enter what ever you like here.
     *
     * @see {@link InfinityMintProjectSettings}
     */
    settings?: InfinityMintProjectSettings;
    /**
     * The permissions of your project. here you can specify if certian addresses get free mint privilages or specific access to gems.
     *
     * @see {@link InfinityMintProjectPermissions}
     */
    permissions?: InfinityMintProjectPermissions;
    /**
     * A dictionary containing all of the currently deployed contracts associated with this project. Values inside of this object are inserted based on their key if they are a core infinity mint deployment (erc721, minter, assets) as well as by their contract name (DefaultMinter, RaritySVG) this also applies for gems as well.
     *
     * @see {@link InfinityMintDeploymentLive}
     */
    deployments?: InfinityMintLiveDeployments;
    /**
     * the deployer of this project
     */
    deployer?: string;
    /**
     * if this is a deployed project or not
     */
    deployed?: boolean;
    /**
     *
     */
    libraries?: Dictionary<
        string | InfinityMintDeploymentLocal | InfinityMintDeploymentLive
    >;
    /**
     * The version information for this project
     */
    version?: {
        /**
         * @defaultValue initial
         */
        tag: string;
        /**
         * @defaultValue 0.0.1
         */
        version: string;
    };
    /**
     * only available in deployed InfinityMint projects
     */
    network: {
        /**
         * chain id of the network this project was deployed too
         */
        chainId: number;
        /**
         * rpc url if added, must specify in the config to add. See {@link InfinityMintConfig}
         */
        url?: string;
        /**
         * the name of the network
         */
        name: string;
        /**
         * the token symbol
         */
        tokenSymbol?: string;
    };
    /**
     * Only set when the project is compiled, the SolidityFolder this project was compiled with
     * @default undefined
     */
    compiledSolidityFolder: PathLike;

    /**
     *
     */
    source?: ParsedPath;
}

/**
 * The infinitymint project is responsible for holding the paths, assets and other information relating to the project. You can set which modules are used in the creation of the minter, along with other specific settings relating to the project. Each project is stored inside of the `./projects/` in the root of where ever InfinityMint is run.
 *
 * @see {@link InfinityMintDeploymentLive}
 * @see {@link InfinityMintProjectModules}
 * @see {@link InfinityMintProjectAsset}
 * @see {@link InfinityMintProjectPath}
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProject {
    /**
     * the name of the current project
     */
    name: string;
    /**
     * custom infinityLinks which can be linked to the token
     */
    links?:
        | Array<InfinityMintProjectSettingsLink>
        | Dictionary<InfinityMintProjectSettingsLink>;
    /**
     * @defaultValue 'minter'
     */
    type?:
        | 'minter'
        | 'project'
        | 'asset'
        | 'gem'
        | 'system'
        | 'service'
        | 'library'
        | 'interface';

    //holds the static imports for a project
    static?: {
        background?: PathLike;
        headerBackground?: PathLike;
        backgroundColour?: string;
        stylesheets?: PathLike[];
        images?: Dictionary<PathLike>;
    };
    // if this project requires any other projects to be deployed before it can be deployed
    dependencies?: Dictionary<string>;

    /**
     * which infinity mint modules to use in the creation of your minter, here you can specify things such as the the `asset, minter, royalty or random` solidity contract you are using.
     */
    modules: InfinityMintProjectModules;
    /**
     * The price of your tokens. This can be in a decimal (for crypto) or as a real life value, for example:
     * ```js
     * //price: '$1',
     * //price: 0.15,
     * ```
     */
    price: number | BigNumber | string;
    /**
     * The information relating to your project.
     *
     * @see {@link InfinityMintProjectInformation}
     */
    information: InfinityMintProjectInformation;
    /**
     * An array containing the gems which are associated with this project.
     *
     * @see {@link InfinityMintProjectGem}
     */
    gems?: Array<InfinityMintProjectGem>;
    /**
     * The base path of the project. All values entered into the basePath will be inserted into each of the minters paths. This is similar to `defaultPath` for classic infinitymint.
     *
     * @see {@link InfinityMintProjectPath}
     */
    basePath?: InfinityMintProjectPath;
    /**
     * The base asset of the project. All values entered into the baseAsset will be inserted into each of the minters paths. This is similar to `defaultAsset` for classic infinitymint.
     *
     * @see {@link InfinityMintProjectAsset}
     */
    baseAsset?: InfinityMintProjectAsset;
    /**
     * All the possible mint varations of the minter, must be an Array of {@link InfinityMintProjectPath}
     */
    paths: Array<InfinityMintProjectPath>;
    /**
     * All the possible asset varations of the minter, must be an Array of {@link InfinityMintProjectAsset}
     */
    assets?:
        | Array<InfinityMintProjectAsset>
        | Dictionary<Array<InfinityMintProjectAsset[]>>;
    /**
     * The settings of the project. The settings key is which deployment the settings should be for, and you can enter what ever you like here.
     *
     * @see {@link InfinityMintProjectSettings}
     */
    settings?: InfinityMintProjectSettings;
    /**
     * The permissions of your project. here you can specify if certian addresses get free mint privilages or specific access to gems.
     *
     * @see {@link InfinityMintProjectPermissions}
     */
    permissions?: InfinityMintProjectPermissions;
    /**
     * Here you can specificy callbacks which will be fired when certain events are triggered.
     *
     * @see {@link InfinityMintEvents}
     */
    events?: InfinityMintEvents;
    /**
     * if this is a deployed project or not
     */
    deployed?: boolean;
    /**
     * The version information for this project
     */
    version?: {
        /**
         * @defaultValue initial
         */
        tag: string;
        /**
         * @defaultValue 0.0.1
         */
        version: string;
    };
    /**
     * where this project is
     */
    source?: ParsedPath;
    /**
     * is true if the source file for this project is a javascript file, using javascript InfinityMint project.
     * @private
     */
    javascript?: boolean;
    /**
     * Only set when the project is compiled, the SolidityFolder this project was compiled with
     * @default undefined
     */
    compiledSolidityFolder?: PathLike;
}

/**
 * The InfinityMint event emitter interface is combined with the eventEmitter class to create our own class which simply adds autocompletion features to on and emit.
 *
 * See {@link InfinityMintEvents} for a more complete list of all the events,
 *
 * @event preDeploy called when a deployment is about to be deployed
 * @event postDeploy called when a deployment has been deployed
 * @event preSetup called when a deployment is about to be setup
 * @event postSetup called when a deployment has been fully setup
 * @event preBuild
 * @event postBuild
 * @event success
 * @event failure
 */
export interface InfinityMintEventEmitter {
    /**
     * Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments
     * to each.
     *
     * Returns `true` if the event had listeners, `false` otherwise.
     *
     * ```js
     * const EventEmitter = require('events');
     * const myEmitter = new EventEmitter();
     *
     * // First listener
     * myEmitter.on('event', function firstListener() {
     *   console.log('Helloooo! first listener');
     * });
     * // Second listener
     * myEmitter.on('event', function secondListener(arg1, arg2) {
     *   console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
     * });
     * // Third listener
     * myEmitter.on('event', function thirdListener(...args) {
     *   const parameters = args.join(', ');
     *   console.log(`event with parameters ${parameters} in third listener`);
     * });
     *
     * console.log(myEmitter.listeners('event'));
     *
     * myEmitter.emit('event', 1, 2, 3, 4, 5);
     *
     * // Prints:
     * // [
     * //   [Function: firstListener],
     * //   [Function: secondListener],
     * //   [Function: thirdListener]
     * // ]
     * // Helloooo! first listener
     * // event with parameters 1, 2 in second listener
     * // event with parameters 1, 2, 3, 4, 5 in third listener
     * ```
     * @since v0.1.26
     */
    emit(eventName: string, ...args: any[]): boolean;
    emit(eventName: InfinityMintEventKeys, ...args: any[]): boolean;
    emit(eventName: InfinityMintConfigEventKeys, ...args: any[]): boolean;
    emit(eventName: InfinityMintNetworkEventKeys, ...args: any[]): boolean;

    on(eventName: string, cb: Function): any;
    on(eventName: InfinityMintEventKeys, cb: Function): any;
    on(eventName: InfinityMintConfigEventKeys, cb: Function): any;
    on(eventName: InfinityMintNetworkEventKeys, cb: Function): any;
}

/**
 * Extends the default node event emitter to have our event names appear in auto completion making it easier to work with InfinityMint
 */
export class InfinityMintEventEmitter extends EventEmitter {}

export interface InfinityMintConfigEvents extends InfinityMintEvents {
    changeProject?: (
        event: InfinityMintEventEmit<string>
    ) => Promise<void | boolean>;

    changeNetwork?: (
        event: InfinityMintEventEmit<string>
    ) => Promise<void | boolean>;
    destroyed?: (
        event: InfinityMintEventEmit<string>
    ) => Promise<void | boolean>;
}

export interface InfinityMintNetworkEvents extends InfinityMintEvents {
    onBlock?: (event: InfinityMintEventEmit<string>) => Promise<void | boolean>;
    onTransactionPending?: (
        event: InfinityMintEventEmit<string>
    ) => Promise<void | boolean>;
    onTransactionSuccess?: (
        event: InfinityMintEventEmit<string>
    ) => Promise<void | boolean>;
    onTransactionFailure?: (
        event: InfinityMintEventEmit<string>
    ) => Promise<void | boolean>;
}

export type InfinityMintConfigEventKeys = keyof InfinityMintConfigEvents;
export type InfinityMintNetworkEventKeys = keyof InfinityMintNetworkEvents;
/**
 * Events can be defined which can then be called directly from the project file or a gem. The EventEmitter where ever the project is used is responsible for handling the automatic assignment of these events. All you need to do is return a promise which returns void. Please be aware that promises will not be waited for.
 */
export interface InfinityMintEvents {
    /**
     * Fired when the InfinityConsole is initialized
     * @event
     */
    initialized?: (
        event: InfinityMintEventEmit<void>
    ) => Promise<void | boolean>;
    /**
     * Fired when the InfinityConsole is connected. (telnet only).
     * @event
     */
    connected?: (event: InfinityMintEventEmit<any>) => Promise<void | boolean>;
    /**
     * Fired when the client is logged in. (telnet only).
     * @event
     */
    login?: (event: InfinityMintEventEmit<any>) => Promise<void | boolean>;
    /**
     * Fired when a new client is registered. (telnet only).
     * @event
     */
    register?: (event: InfinityMintEventEmit<any>) => Promise<void | boolean>;
    /**
     * Fired when the InfinityConsole is disconnected. (telnet only).
     * @event
     */
    disconnected?: (
        event: InfinityMintEventEmit<any>
    ) => Promise<void | boolean>;

    /**
     * Fired when the InfinityConsole is reinitialized
     * @event
     */
    reloaded?: (event: InfinityMintEventEmit<void>) => Promise<void | boolean>;
    /**
     * @event
     */
    preCompile?: (
        event: InfinityMintEventEmit<InfinityMintProject>
    ) => Promise<void | boolean>;
    /**
     * Will be called when project is compiled
     * @event
     */
    postCompile?: (
        event: InfinityMintEventEmit<InfinityMintProject>
    ) => Promise<void | boolean>;
    /**
     * Will be called when setup is about to take place. Can return false to abort setup silently.
     * @event
     */
    preSetup?: (
        event: InfinityMintEventEmit<InfinityMintDeployment>
    ) => Promise<void | boolean>;
    /**
     * @event
     */
    postSetup?: (
        event: InfinityMintEventEmit<InfinityMintDeployment>
    ) => Promise<void | boolean>;
    /**
     * Will be called when setup is about to take place. Can return false to abort setup silently.
     * @event
     */
    preVerify?: (
        event: InfinityMintEventEmit<
            | InfinityMintProjectPath
            | InfinityMintProjectAsset
            | InfinityMintProjectContent
        >
    ) => Promise<void>;

    /**
     * @event
     */
    postVerify?: (
        event: InfinityMintEventEmit<
            | InfinityMintProjectPath
            | InfinityMintProjectAsset
            | InfinityMintProjectContent
        >
    ) => Promise<void>;

    /**
     * Will be called when setup is about to take place. Can return false to abort setup silently.
     * @event
     */
    preCompileSetup?: (
        event: InfinityMintEventEmit<
            | InfinityMintProjectPath
            | InfinityMintProjectAsset
            | InfinityMintProjectContent
        >
    ) => Promise<void>;

    /**
     * @event
     */
    postCompileSetup?: (
        event: InfinityMintEventEmit<
            | InfinityMintProjectPath
            | InfinityMintProjectAsset
            | InfinityMintProjectContent
        >
    ) => Promise<void>;
    /**
     * Will be called when deploy complete.
     * @event
     */
    postDeploy?: (
        event: InfinityMintEventEmit<InfinityMintDeploymentLive[]>
    ) => Promise<void>;
    /**
     * @event
     */
    preDeploy?: (
        event: InfinityMintEventEmit<InfinityMintDeploymentLive[]>
    ) => Promise<void>;
    /**
     * @event
     */
    gemPreSetup?: (
        event: InfinityMintEventEmit<InfinityMintGemScript>
    ) => Promise<void>;
    /**
     * @event
     */
    gemPostSetup?: (
        event: InfinityMintEventEmit<InfinityMintGemScript>
    ) => Promise<void>;
    /**
     * @event
     */
    gemPreDeploy?: (
        event: InfinityMintEventEmit<InfinityMintDeploymentLive[]>
    ) => Promise<void>;
    /**
     * @event
     */
    gemPostDeploy?: (
        event: InfinityMintEventEmit<InfinityMintDeploymentLive[]>
    ) => Promise<void>;
    /**
     * @event
     */
    stageCompile?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    stageCompilePre?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    stageCompilePost?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    stageSetup?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    stageSetupPre?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    stageSetupPost?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    stageVerify?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    stageVerifyPre?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    stageVerifyPost?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    stageSuccess?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    stageFailure?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    /**
     * @event
     */
    postGems?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    /**
     * @event
     */
    preGems?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    /**
     * @event
     */
    postGem?: (
        event: InfinityMintEventEmit<InfinityMintGemScript>
    ) => Promise<void>;
    /**
     * @event
     */
    preGem?: (
        event: InfinityMintEventEmit<InfinityMintGemScript>
    ) => Promise<void>;

    /**
     * @event
     */
    preScript?: (
        event: InfinityMintEventEmit<InfinityMintScript>
    ) => Promise<void>;
    /**
     * @event
     */
    postScript?: (
        event: InfinityMintEventEmit<InfinityMintScript>
    ) => Promise<void>;
    /**
     * @event
     */
    success?: (event: InfinityMintEventEmit<void>) => Promise<void>;
    /**
     * @event
     */
    failure?: (event: InfinityMintEventEmit<void>) => Promise<void>;
}

export type InfinityMintEventKeys = keyof InfinityMintEvents;

/**
 * The project information is where you can set the token symbol, other language definitions such as the full name of your project, short name and a brief description for metadata purposes.
 */
export interface InfinityMintProjectInformation {
    /**
     * The symbol of your token. `appears on OpenSea and inside of the contract as the ERC721 tokenSymbol`.
     */
    tokenSymbol: string;
    tokenSingular: string;
    tokenMultiple?: string;
    fullName?: string;
    shortName?: string;
    description?: string;
}

/**
 * Here you can specify addresses which will be given admin permissions inside of the InfinityMint deployments.
 */
export interface InfinityMintProjectPermissions extends KeyValue {
    /**
     * Will give all addresses inside the array admin access to all deployments.
     */
    all?: Array<string>;
    /**
     * Will give all addresses inside the array admin access to only the erc721 (InfinityMint) deployment.
     */
    erc721?: Array<string>;
    /**
     * Will give all addresses inside the array admin access to only the minter deployment.
     *
     * @see {@link InfinityMintProjectModules}
     */
    minter?: Array<string>;
    /**
     * Will give all addresses inside the array admin access to only the random deployment.
     *
     * @see {@link InfinityMintProjectModules}
     */
    random?: Array<string>;
    /**
     * Will give all addresses inside the array admin access to only the royalty deployment.
     *
     * @see {@link InfinityMintProjectModules}
     */
    royalty?: Array<string>;
    /**
     * Will give all addresses inside the array admin access to only the assets deployment.
     *
     * @see {@link InfinityMintProjectModules}
     */
    assets?: Array<string>;
    /**
     * Will give all addresses inside the array admin access on all gem contracts.
     */
    gems?: Array<string>;
}

/**
 * Holds settings and other information relating to a gem inside of the project file. This is not the gem file its self but simply a configuration option inside of the projects where users can state if a gem is enable or disabled and pass settings from the project directly to all of the gem scripts and windows for them to read and use.
 *
 * @see {@link InfinityMintGemScript}
 */
export interface InfinityMintProjectGem {
    /**
     * The name of the gem to enable/disable.
     *
     * @see {@link InfinityMintGemScript}
     */
    name: string;
    /**
     * If the gem is enabled or disabled.
     */
    enabled: boolean;
    /**
     * The settings for the gem.
     *
     * @see {@link InfinityMintGemScript}
     */
    settings?: KeyValue;
}
export interface InfinityMintCompiledLink {
    key: string;
    name?: string;
    description?: string;
    verify?: boolean;
    index?: number;
    forcedOnly?: boolean;
    contract?: string;
    erc721?: boolean;
    interfaceId?: any;
    required?: string;
    abi?: any;
    args?: any;
    bytecode?: any;
}

export interface InfinityMintProjectSettingsLink {
    key: string;
    name?: string;
    description?: string;
    verify?: boolean;
    forcedOnly?: boolean;
    contract?: string;
    settings?: InfinityMintProjectSettingsLinkSettings;
    interfaceId?: any;
}

export interface InfinityMintProjectSettingsLinkSettings {
    erc721?: boolean;
    required?: boolean;
}

/**
 * Settings for the values deployment. Can contain either booleans or numbers. All values here will be set on chain inside of the InfinityMintValues contract.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsValues extends KeyValue {}

/**
 * Settings for the minter deployment.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsMinter {
    mintBytesOnly?: boolean;
    previewCount?: number;
}

/**
 * Settings for the asset controller deployment. Here you can configure algorithmic properties which define how InfinityMint will create you toke. You can also change how many random names InfinityMint should mint for your token and for instance if you would like to prevent the same pathId from minting twice.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsAssets {
    incremental?: boolean;
    randomNames?: boolean;
    randomNameCount?: number;
    preventSamePathTwice?: boolean;
    pickLeastCommon?: boolean;
    pickMostCommon?: boolean;
    disabledPaths?: Array<any>;
}

export interface InfinityMintProjectSettingsRoyaltySplit extends KeyValue {
    address: string;
    cuts?: InfinityMintProjectSettingsRoyaltyCuts;
}

export interface InfinityMintProjectSettingsRoyaltyCuts extends KeyValue {
    stickers: number;
    mints: number;
}

/**
 * Settings for the royalty deployment.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsRoyalty extends KeyValue {
    cuts: InfinityMintProjectSettingsRoyaltyCuts;
    splits?:
        | InfinityMintProjectSettingsRoyaltySplit
        | InfinityMintProjectSettingsRoyaltySplit[];
}

export interface InfinityMintProjectSettingsRandom extends KeyValue {
    seedNumber?: number;
}

/**
 * Settings for the erc721 (InfinityMint) deployment.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsERC721 extends KeyValue {
    defaultTokenURI?: string;
}

/**
 * All of the InfinityMint environment variables
 */
export interface InfinityMintEnvironmentVariables {
    INFINITYMINT_PROJECT?: string;
    ETHERSCAN_API_KEY?: string;
    PRODUCTION?: boolean;
    POLYGONSCAN_API_KEY?: string;
    INFINITYMINT_LOAD?: boolean;
    PIPE_ECHO_DEFAULT?: boolean;
    PIPE_ECHO_DEBUG?: boolean;
    DONT_COMPILE_CONTRACTS?: boolean;
    ETH_MNEMONIC?: string;
    POLYGON_MNEMONIC?: string;
    MUMBAI_MNEMONIC?: string;
    GOERLI_MNEMONIC?: string;
    POLYGON_ZKSYNC_MNEMONIC?: string;
    OPTIMISM_MNEMONIC?: string;
    ARBITRUM_MNEMONIC?: string;
    AVALANCHE_MNEMONIC?: string;
    PIPE_ECHO_ERRORS?: boolean;
    PIPE_ECHO_WARNINGS?: boolean;
    PIPE_SEPERATE_WARNINGS?: boolean;
    PIPE_LOG_ERRORS_TO_DEFAULT?: boolean;
    PIPE_LOG_ERRORS_TO_DEBUG?: boolean;
    PIPE_SILENCE_UNDEFINED_PIPE?: boolean;
    PIPE_SILENCE?: boolean;
    PIPE_SILENCE_DEBUG?: boolean;
    PIPE_IGNORE_CONSOLE?: boolean;
    INFINITYMINT_UNINCLUDE_DEPLOY?: boolean;
    INFINITYMINT_TELNET?: boolean;
    INFINITYMINT_UNINCLUDE_SCRIPTS?: boolean;
    EXPRESS_PORT?: number;
    GANACHE_PORT?: number;
    GANACHE_AUTORUN?: boolean;
    THROW_ALL_ERRORS?: boolean;
    INFINITYMINT_CONSOLE?: boolean;
    DEFAULT_SOLIDITY_FOLDER?: PathLike;
    GANACHE_EXTERNAL?: boolean;
    SOLIDITY_CLEAN_NAMESPACE?: boolean;
    SOLIDITY_USE_NODE_MODULE?: boolean;
}

export type InfinityMintEnvironmentKeys =
    keyof InfinityMintEnvironmentVariables;

/**
 * The project settings are where you can configure your infinity mint deployments to the logic you require. The name of each key is the same as the keys you defined in the `modules` key. (see {@link InfinityMintProjectModules}). The key is the deployment you would like to configure. You must not configure gem contracts here, but inside of the `gems` key of the project instead.
 *
 * @see {@link InfinityMintProject}
 * @see {@link InfinityMintProjectSettingsAssets}
 * @see {@link InfinityMintProjectSettingsERC721}
 * @see {@link InfinityMintProjectSettingsMinter}
 * @see {@link InfinityMintProjectSettingsValues}
 * @see {@link InfinityMintProjectSettingsRoyalty}
 */
export interface InfinityMintProjectSettings extends KeyValue {
    /**
     * Set settings for the erc721 (InfinityMint) deployment.
     *
     * @see {@link InfinityMintProjectSettingsERC721}
     */
    erc721?: InfinityMintProjectSettingsERC721;
    /**
     * Set settings for the minter deployment.
     *
     * @see {@link InfinityMintProjectSettingsMinter}
     */
    minter?: InfinityMintProjectSettingsMinter;
    /**
     * Set settings for the random deployment.
     */
    random?: InfinityMintProjectSettingsRandom;
    /**
     * Set settings for the values deployment.
     *
     * @see {@link InfinityMintProjectSettingsValues}
     */
    values?: InfinityMintProjectSettingsValues;
    /**
     * Set settings royalty deployment.
     *
     * @see {@link InfinityMintProjectSettingsRoyalty}
     */
    royalty?: InfinityMintProjectSettingsRoyalty;
    /**
     * Set settings for the assets deployment.
     *
     * @see {@link InfinityMintProjectSettingsAssets}
     */
    assets?: InfinityMintProjectSettingsAssets;
    /**
     * Names to use in the random name generator
     */
    names?: string[];
    /**
     * List of contracts which are disabled, will check if member equals contract name or key
     */
    disabledContracts?: string;
    /**
     *
     */
    defaultRenderer?: string;
    /**
     *
     */
    defaultLinks?: string[];
}

export type InfinityMintProjectSettingsKeys = keyof InfinityMintProjectSettings;

/**
 * The InfinityMint project modules are the solidity files InfinityMint will use for its token creation and royalty distribution. Here is where you can change what is used in each step of the InfinityMint chain. The assets key controls what type of content will be minted based on what type of content it is (svg, image, sound). The minter controls how to talk to the asset controller, and if the user needs to specify which path they would like or if it should be random or if it should be only one specific path id until you say anything different. The royalty controller will control who is paid what for what ever happens inside of the minter. From mints, to things that gems do the royalty controller decides how any incoming money will be split accordingly. The random controller decides how InfinityMint obtains its random numbers which it uses in the mint process. You can use VCF randomness with chainlink here or use keccack256 randomisation but beware of the security risks of doing so.
 *
 * @see {@link InfinityMintProjectSettings}
 * @see {@link InfinityMintDeploymentLive}
 */
export interface InfinityMintProjectModules extends KeyValue {
    /**
     * Should be the *fully quallified solidity artifact name* for an Asset Controller. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
     *
     * @example RaritySVG, SimpleSVG, RarityImage, SimpleImage
     */
    assets: string;
    /**
     * Should be the *fully quallified solidity artifact name* for a Mint Controller. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
     *
     * @example DefaultMinter, SelectiveMinter, LockedMinter
     */
    minter: string;
    /**
     * Should be the *fully quallified solidity artifact name* for a Royalty Controller. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
     *
     * @example DefaultRoyalty, SplitRoyalty
     */
    royalty: string;
    /**
     * Should be the *fully quallified solidity artifact name* for a Random Controller. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
     *
     * @example SeededRandom, UnsafeRandom
     */
    random: string;
    /**
     * Should be the *fully quallified solidity artifact name* for a Random Controller. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
     *
     * @private
     */
    utils?: string;
    /**
     * Should be the *fully quallified solidity artifact name*. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
     *
     * @private
     */
    values?: string;
    /**
     * Should be the *fully quallified solidity artifact name*. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
     *
     * @private
     */
    storage?: string;
    /**
     * Should be the *fully quallified solidity artifact name*. Solidity artifacts are compiled based on the current solidity root which is usually the `./alpha` folder. Gems will have an Gem_ before their artifact name.
     *
     * @example InfinityMint, InfinityMint2
     */
    erc721?: string;
}

export type InfinityMintProjetModulesKeys = keyof InfinityMintProjectModules;

/**
 *
 */
export interface InfinityMintProjectPathExport {
    key: string;
    checksum: string;
    exported: number;
    stats: Stats;
    external?: {
        ipfs?: {
            /**
             * the CID (v1 or v0)
             */
            hash: string;
            /**
             * url to where you can view this asset on web2 browser, contains filename
             */
            url: string;
            /**
             * the filename of the asset that was used to upload to IPFS
             */
            fileName: string;
        };
        web2?: {
            /**
             * url of where to access this asset on web2 browser
             */
            url: string;
            /**
             * the filename that was used to upload the asset
             */
            fileName: string;
        };
    };
    project: string;
    version: {
        tag: string;
        version: string;
    };
}

/**
 * InfinityMint paths are what the minter will use when rendering your token. For each path you define is a different apperance the token can take. Inside the project file you can set options (see {@link InfinityMintProjectSettingsAssets}) for how the paths will be picked. For each path you have to specify its name and the fileName to use. You can also specify if it is encrypted.
 */
export interface InfinityMintProjectPath {
    name: string;
    fileName: PathLike;
    pathId?: number;
    valid?: boolean;
    rarity?: number;
    section?: string | string[];
    /**
     * is the mint data, this is copied to each token internally. Can be a path to a file
     */
    data?: KeyValue | PathLike;
    /**
     * can either contain an object of settings for the path or a link to the settings file or simply `true` to look for a settings file that matches the fileName import. See {@link app/content.InfinityMintSVGSettings}
     */
    settings?:
        | boolean
        | InfinityMintSVGSettings
        | KeyValue
        | Dictionary<InfinityMintSVGSettings>;
    description?: string;
    /**
     * Unlike assets, content are not used in the rendering process but can be any type of media which is included with the mint of this path. For instance music, more images or 3D files could be put here.
     *
     * @examples
     * ```js
     * content: {
     * 		myContent: {
     * 			name: '3d',
     * 			fileName: '@import/3d/file.obj'
     * 		}
     *	}
     * ```
     */
    content?: Dictionary<InfinityMintProjectContent>;
    /**
     * When the path has been compiled this is filled.
     */
    export?: InfinityMintProjectPathExport;
    /**
     * Where this path is located on the compilers hard drive
     */
    source?: ImportType;
    /**
     * true if the project the path contains has been compiled.
     */
    compiled?: boolean;
    /**
     * Checksum of the object inside of the path
     */
    checksum?: string;
}

/**
 *
 */
export interface InfinityMintProjectContent extends InfinityMintProjectPath {
    onlyOwners?: boolean;
    onlyApproved?: boolean;
}

/**
 *
 */
export interface InfinityMintProjectAsset extends InfinityMintProjectPath {
    pathId?: number;
    section?: string;
    assetId?: number;
}

export interface InfinityMintExpressOptions {
    sockets?: {
        port?: number;
    };
    disableTypescript?: boolean;
    port?: number;
    cors?: any[];
    disableMeta?: boolean;
    startup?: (server: ExpressServer) => Promise<void>;
}

/**
 * The infinitymint configuation interface, this is what is returnted from the infinitymint.config.js in the current root and holds ganache, hardhat and infinitymint configuration details.
 */
export interface InfinityMintConfig {
    //for testing, InfinityMint will load things from /dist/ folder locally.
    dev?: {
        useLocalDist?: boolean;
    };
    /**
     * Gems to load, must put the gems name here is loaded through node module. Gems are plugins that can be used to extend the functionality of InfinityMint. See {@link InfinityMintProjectGem}.
     */
    gems?: string[];
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * Will launch into the infinitymint console if the value of this member is true or equals an object. See {@link InfinityMintConsoleOptions}
     *
     * @example
     * ```js
     * //set console options, see
     * console: {
     * 	blessed: {
     * 		//blessed screen options (see blessed api)
     * 	},
     * 	initialWindow: 'Logs'
     * }
     *
     * //or you can just set it to true
     * console: true
     * ```
     */
    express?: InfinityMintExpressOptions | boolean;
    console?: InfinityMintConsoleOptions | boolean;
    logging?: {
        ganache?: {
            blockedMessages: string[];
            ethereumMessages: string[];
        };
    };
    telnet?: boolean | InfinityMintTelnetOptions;
    /**
     * enabled music playback functionality
     * @experimental
     */
    music?: boolean;
    /**
     * automatically loads InfinityMint if true. The default import of the infinitymint repository will return the InfinityConsole instance of which to work from. See {@link app/console.InfinityConsole}
     *
     * @example
     * ```js
     * //infinitymit.config.js has member load which is true
     * const infinitymint = require('infinitymint');
     * //if we dont have member load which is true we do the line below
     * //const { load } = require('infinitymint');
     *
     * //changes network to ganache
     * (async () => {
     * 	//if we don't have member load in infinitymint.config.js is true we do the line below
     * 	//let infinitymint = await load();
     * 	await infinitymint.changeNetwork('ganache');
     * })().then(() => {
     * 	process.exit(0);
     * }).catch((err) => {
     * 	console.error(err);
     * 	process.exit(1);
     * });
     * ```
     */
    onlyInitialize?: boolean;

    /**
     * The hardhat configuration, the same as hre.config. Uses all valid configuration options found within their docs. <https://www.npmjs.com/package/hardhat>
     */
    hardhat: HardhatUserConfig;
    /**
     * execute code when things happen inside of InfinityMint, config file gets a few more event names than normal infinitymint events. Events defined here are always the first to be added to event Emitters
     */
    events?: InfinityMintConfigEvents;
    /**
     * ipfs cofiguration settings
     */
    ipfs?: InfinityMintIPFSOptions | boolean;
    /**
     * @type {import('ganache').ServerOptions}
     */
    ganache?: any;
    /**
     * Other filesystem locations where IM will look for assets such as PNGs, Vectors etc.to create tokens with.
     */
    imports?: Array<PathLike>;

    /**
     * Others InfinityMint repositories to add to the root of this root.
     */
    roots?: Array<PathLike>;
    /**
     * InfinityMint-specific config settings. Configures settings such as how networks behave, what wallets to use by default, & if to log a specific chain within `defaultPipe`, & specify whether a chain is *production* or a *testnet*. Also determines what will be used to fetch `Gas Estimates` and *token prices*.
     *
     * @see {@link InfinityMintConfigSettings}
     */
    settings?: InfinityMintConfigSettings;

    /**
     * Defines how this project will be exported to the output.
     */
    export?: {
        putGems?: (
            gems: Gem[],
            infinityConsole: InfinityConsole
        ) => Promise<void>;
        putTokenRenderScripts?: (
            scripts,
            infinityConsole: InfinityConsole
        ) => Promise<void>;
        putDeployments?: (
            deployments: InfinityMintDeployment[],
            project: InfinityMintDeployedProject,
            infinityConsole: InfinityConsole
        ) => Promise<void>;
        putProject?: (
            deployedProject: InfinityMintDeployedProject,
            compiledProject: InfinityMintCompiledProject,
            project: InfinityMintProject,
            infinityConsole: InfinityConsole
        ) => Promise<void>;
        putImages?: (
            images: Dictionary<string>,
            infinityConsole: InfinityConsole
        ) => Promise<void>;
        putStyles?: (
            styles: Dictionary<string>,
            infinityConsole: InfinityConsole
        ) => Promise<void>;
        putResources?: (
            resources: Dictionary<string>,
            infinityConsole: InfinityConsole
        ) => Promise<void>;
    };
}

/**
 * Configure IPFS capabilities inside infinity mint
 */
export interface InfinityMintIPFSOptions {
    web3Storage?: {
        token?: string;
        useAlways?: boolean;
    };
    resolvers?: string[];
    endpoint?: string;
    kubo?: {
        useAlways?: boolean;
    };
}

/**
 * Network specific settings for InfinityMint.
 * @see {@link InfinityMintConfigSettings}
 * @see {@link InfinityMintConfigSettingsNetworks}
 */
export interface InfinityMintConfigSettingsNetwork {
    defaultAccount?: number;
    /**
     * will pipe the events emitted by this network to the default log and not its own network name specific log.
     */
    useDefaultPipe?: boolean;
    /**
     * Allows you to specify an RPC to use for this network in a client setting. Does not equal the RPC which is used for hardhat to communicate in chain and is just used to create JsonStaticProvider on reacts end.
     */
    rpc?: string;
    /**
     * if true, will expose the hardhat rpc to be included in the project files network object. See {@link InfinityMintProject} specfically the member 'network'.
     */
    exposeRpc?: boolean;
    /**
     * disabled contracts for this network, takes fully qualified contract name or the key name, see {@link app/deployments.InfinityMintDeployment}.
     */
    disabledContracts?: string[];
    /**
     * will always create a Json Rpc Provider for this network, even if it is not the default network.
     */
    alwaysCreateProvider?: boolean;
    /**
     * if true, will write the current mnemonic to the .mnemonic file
     */
    writeMnemonic?: boolean;
    /**
     * define handlers for situations such as getting the gas price on this network and the token price
     */
    handlers?: {
        /**
         * will register a gas price handler for this network
         */
        gasPrice?: GasPriceFunction;
        /**
         * will register a token price handler for this network
         */
        tokenPrice?: TokenPriceFunction;
    };

    /**
     * if true, InfinityMint will treat this chain as a test chain.
     *
     * @default
     * false //true if chainId 1337 and chainId 31337
     */
    testnet?: boolean;
}

export interface GlobalSessionEnvironment extends KeyValue {
    /**
     * the current ganache mnemonic
     */
    ganacheMnemonic?: string;
    /**
     * the location of the current selected project
     */
    project?: KeyValue;
    //the default network
    defaultNetwork?: string;
    defaultProject?: string;
    //generated when the .session file is new, is a GUUID, overwrote if in telnet mode
    globalUserId?: string;
}

/**
 * the interface for the .session file. InfinityMintWindow use SQL lite to store thing, transactions
 * are also stored in SQL lite where possible.
 */
export interface InfinityMintGlobalSession {
    /**
     * can be used to store any data you want to be stored in the session file
     */
    environment?: GlobalSessionEnvironment;
    /**
     * is the date the session file was created
     */
    created: number;
}

/**
 * @see {@link InfinityMintConfigSettings}
 */
export interface InfinityMintConfigSettingsDeploy extends KeyValue {
    /**
     * locations are relative to the cwd
     */
    scriptFolders?: PathLike[];
}

/**
 * @see {@link InfinityMintConfigSettings}
 */
export interface InfinityMintConfigSettingsBuild extends KeyValue {}

/**
 * A mutable object containing infinity mint specific settings for each network. Based off of the networks which are defined in the hardhat member of the InfinityMintConfig Settings.
 * @see {@link InfinityMintConfigSettings}
 * @see {@link InfinityMintConfigSettingsNetwork}
 */
export interface InfinityMintConfigSettingsNetworks extends KeyValue {
    /**
     * the ganache network, see {@link InfinityMintConfigSettingsNetwork} for a list of all the settings you can configure for this network.
     */
    ganache?: InfinityMintConfigSettingsNetwork;
    /**
     * the hardhat network, see {@link InfinityMintConfigSettingsNetwork} for a list of all the settings you can configure for this network.
     */
    hardhat?: InfinityMintConfigSettingsNetwork;
    /**
     * the ethereum network, see {@link InfinityMintConfigSettingsNetwork} for a list of all the settings you can configure for this network.
     */
    ethereum?: InfinityMintConfigSettingsNetwork;
    /**
     * the polygon network, see {@link InfinityMintConfigSettingsNetwork} for a list of all the settings you can configure for this network.
     */
    polygon?: InfinityMintConfigSettingsNetwork;
    /**
     * the mumabi network, see {@link InfinityMintConfigSettingsNetwork} for a list of all the settings you can configure for this network.
     */
    mumbai?: InfinityMintConfigSettingsNetwork;
    /**
     * the goerli network, see {@link InfinityMintConfigSettingsNetwork} for a list of all the settings you can configure for this network.
     */
    goreli?: InfinityMintConfigSettingsNetwork;

    /**
     * InfinityMint will only create providers for the default network as defined by hardhat. Use this if you have lots of networks and don't want to create JsonRpcProviders for all of them
     */
    onlyCreateDefaultProvider?: boolean;
}
/**
 * @see {@link InfinityMintConfigSettings}
 */
export interface InfinityMintConfigSettingsCompile extends KeyValue {
    disallowTypescript?: boolean;
    disallowIPFS?: boolean;
    supportedExtensions?: string[];
}

/**
 * here you can specify the infinity mint settings for the `networks`, `deploy` and `build` and `export` steps. You can configure infinity mint here.
 *
 * @see {@link InfinityMintConfigSettingsNetwork}
 * @see {@link InfinityMintConfigSettingsDeploy}
 * @see {@link InfinityMintConfigSettingsBuild}
 * @see {@link InfinityMintConfigSettingsCompile}
 */
export interface InfinityMintConfigSettings extends KeyValue {
    /**
     * each key is the network name followed by an object with the type of {@link InfinityMintConfigSettingsNetwork}
     *
     * @example
     * ```js
     * networks: {
     *		//settings for the hardhat network
     *		hardhat: {
     *			defaultAccount: 0,
     *		},
     *		//settings for the ganache network
     *		ganache: {
     *			defaultAccount: 0,
     *		},
     *	},
     * ```
     */

    networks?: InfinityMintConfigSettingsNetworks;
    /**
     * Configure InfinityMints deploy stage here.
     *
     * @see {@link InfinityMintConfigSettingsDeploy}
     * @see {@link InfinityMintDeploymentLive}
     */
    deploy?: InfinityMintConfigSettingsDeploy;
    /**
     * Configure InfinityMints deploy stage here.
     *
     * @see {@link InfinityMintConfigSettingsBuild}
     */
    build?: InfinityMintConfigSettingsBuild;
    /**
     * Configure InfinityMints compile stage here.
     *
     * @see {@link InfinityMintConfigSettingsCompile}
     */
    compile?: InfinityMintConfigSettingsCompile;
    imports?: {
        disabledExtensions?: string[];
        supportedExtensions?: string[];
        disabledRoots?: string[];
    };
    templates?: {
        disallowTypescript?: boolean;
    };
    projects?: {
        classicProjects?: PathLike[];
    };
    console?: {
        disallowTypescriptWindows?: boolean;
        disallowTypescriptElements?: boolean;
    };
    updates?: {
        disallowTypescript?: boolean;
    };
    /**
     * Configure InfinityMints script handling here. You can specify if an entire directory has main executable scripts or to treat them like classic scripts which do not export an object with a main function.
     */
    scripts?: {
        disallowTypescript?: boolean;
        disableMainExecution?: PathLike[];
        classicScripts?: PathLike[];
        hideScripts?: PathLike[];
        disableDeployScripts?: PathLike[];
    };
}

/**
 * This interface refers to the specific arguments which can be passed to the script. Either as parameters in a bash script or from the InfinityMintConsole. See {@link InfinityMintScript}
 */
export interface InfinityMintScriptArguments {
    name?: string;
    optional?: boolean;
    validator?: Function;
    //defines which type of UI element to render for this element, also takes over as a basic validator if no validor function is defined
    type?: 'boolean' | 'string' | 'number';
    value?: any;
}

export interface InfinityMintProjectUpdateKey {
    deployments?: Dictionary<InfinityMintDeploymentLive>;
    paths?: Dictionary<InfinityMintProjectPath>;
    assets?: Dictionary<InfinityMintProjectAsset>;
    links?: Dictionary<InfinityMintProjectSettingsLink>;
    gems?: Dictionary<InfinityMintProjectGem>;
}
/**
 * Describes the interface for an InfinityMintProjectUpdate which is used to update the InfinityMintProject
 */
export interface InfinityMintProjectUpdate {
    name?: string;
    version?: {
        version: string;
        tag: string;
    };
    oldVersion?: {
        version: string;
        tag: string;
    };
    network?: {
        name?: string;
        chainId?: number;
    };
    create?: InfinityMintProjectUpdateKey;
    deploy?: string[];
    setup?: string[];
    permissions?: {
        approve: Dictionary<string[]>;
        unapprove: Dictionary<string[]>;
    };
    update?: InfinityMintProjectUpdateKey;
    disable?: {
        paths?: Dictionary<InfinityMintProjectPath>;
        assets?: Dictionary<InfinityMintProjectAsset>;
        links?: Dictionary<InfinityMintProjectSettingsLink>;
        gems?: Dictionary<InfinityMintProjectGem>;
    };
    enable?: {
        paths?: Dictionary<InfinityMintProjectPath>;
        assets?: Dictionary<InfinityMintProjectAsset>;
        links?: Dictionary<InfinityMintProjectSettingsLink>;
        gems?: Dictionary<InfinityMintProjectGem>;
    };
    remove?: {
        deployments?: Dictionary<InfinityMintDeploymentLive>;
        paths?: Dictionary<InfinityMintProjectPath>;
        assets?: Dictionary<InfinityMintProjectAsset>;
        links?: Dictionary<InfinityMintProjectSettingsLink>;
        gems?: Dictionary<InfinityMintProjectGem>;
    };
    merge?: InfinityMintDeployedProject;
    replace?: InfinityMintDeployedProject;
    delete?: (keyof InfinityMintDeployedProject)[];
}

/**
 *
 */
export interface InfinityMintConsoleOptions {
    blessed?: {
        fullUnicode?: boolean;
        fastCSR?: boolean;
        smartCSR?: boolean;
        input?: any;
        output?: any;
        terminal?: string;
    };

    /**
     * will load IM fast
     */
    dontInitialize?: boolean;
    disableNetworkEvents?: boolean;
    onlyCurrentNetworkEvents?: boolean;

    /**
     * custom think method
     */
    think?: Function;
    startGanache?: boolean;
    startWebSocket?: boolean;
    /**
     * will force infinitymint to a network
     */
    network?: string;
    /**
     * number of ms to wait before running think again
     */
    tickRate?: number;
    /**
     * Will run InfintyMint in test mode
     */
    test?: boolean;
    /**
     * Will not pipe InfinityMint outputs
     */
    dontPipe?: boolean;
    /**
     * Will launch the InfinityConsole UI
     */
    console?: boolean;
    /**
     * Used in some cases where you want infinityConsole to create its self later, will return to you a new InfinityMint class when you call load that has not been
     * created. Call InfinityMint.create() to create the console and begin doing stuff with InfinityMint.
     */
    onlyInitialize?: boolean;
    /**
     * if to throw errors outside of the console
     */
    throwErrors?: boolean;
    /**
     * the initial window the console should open into
     */
    initialWindow?: string | Window;
    /**
     * automatically enabled if script mode is true, will mean that the terminal  will not draw the InfinityConsole
     */
    dontDraw?: boolean;
    /**
     * Scriptmode will mean that each time load is called one InfinityConsole will be returned and it will not create a new one. This is useful for testing and running scripts.
     */
    scriptMode?: boolean;
    /**
     * Will start the express server or not start the express server. Will overrule config value.
     */
    startExpress?: boolean;
}

export interface InfinityMintTelnetOptions {
    /**
     * port to run telnet on
     */
    port?: number;
    maxClients?: number;
    hideFrameTitle?: boolean;
    /**
     * can be a string or a function which returns a string. If a function is passed, it will be called with the current {@link app/window.InfinityMintWindow} as the first argument.
     *
     * @example
     * ```js
     * frameTitle: 'My Frame Title'
     * ```
     *
     * @example
     * ```ts
     * frameTitle: async (window: InfinityMintWindow) => {
     * 	let ethers = window.getEthers():
     * 	//do ethers stuff
     * 	return window.title;
     * }
     * ```
     */
    frameTitle?: string | Function;
    /**
     * any methods here are defined with the event name as the key and the method as the value. The method will be called with InfinityMintEventParameters as the first argument. There are also some special events which are defined in the {@link InfinityMintEvents} interface.
     */
    events?: InfinityMintEvents;
    /**
     * the title to present on the login screen
     */
    title?: string;
    /**
     * the message of the day
     */
    motd?: string;
    /**
     * if only admins can log in
     */
    adminsOnly?: boolean;
    /**
     * only allow these username or ips to enter
     */
    whitelist?: string[];
    /**
     * do not require login/registration
     */
    anonymous?: boolean;
    /**
     * default group people are signed up with
     */
    defaultGroup?: string;
}

/**
 * An InfinityMint script is like a Hardhat test, it essentially allows InfinityMint to perform a task. The scripts by default are located in the `./scripts` folder.
 */

export interface InfinityMintScript {
    /**
     * the name of the script
     */
    name?: string;
    /**
     * The location of the script file
     */
    path?: string;
    /**
     * the file name
     */
    fileName?: string;
    /**
     * description of the script to be displayed in the help menu
     */
    description?: string;
    config?: InfinityMintConfigSettings;
    /**
     * called when the script is executed, is passed {@link InfinityMintScriptParameters}. Return false to signify that this script failed.
     */
    execute?: (script: InfinityMintScriptParameters) => Promise<boolean | void>;
    /**
     * called when the script is loaded, is passed {@link InfinityMintScriptEventParameters}.
     */
    loaded?: (script: InfinityMintScriptParameters) => Promise<boolean | void>;
    /**
     * called when the script is reloaded, is passed {@link InfinityMintScriptEventParameters}.
     */
    reloaded?: (
        script: InfinityMintScriptParameters
    ) => Promise<boolean | void>;
    /**
     * the arguments which can be passed to this script. See {@link InfinityMintScriptArguments}
     */
    arguments?: InfinityMintScriptArguments[];
    /**
     * the events to define for this script. See {@link InfinityMintEvents} for a list of events which can be defined. The method is passed {@link InfinityMintScriptEventParameters} as the first argument.
     */
    events?: InfinityMintEvents;
    /**
     * registers this InfinityMint script as a hardhat task as well.
     */
    task?: true;
    /**
     * the solidity folder solc should use when compiling this script
     */
    solidityFolder?: string;
    /**
     * if this script is javascript or not
     */
    javascript?: boolean;

    //true if this script is a gem
    gem?: boolean;
    /**
     * a object or dictionary of objects which define the authors of this script.
     */
    author?: KeyValue | KeyValue[];
}

/**
 * This is passed into the execute method of the script inside the scripts/ folder by default. See {@link InfinityMintScript}
 */
export interface InfinityMintScriptParameters extends KeyValue {
    /**
     * Refers to the current script of which the parameters values come from. Could not be available due to the fact this extends InfinityMintDeploymentParameters and InfinityMintEventEmit
     */
    script?: InfinityMintScript;
    /**
     * the gems which are loaded into the console. See {@link InfinityMintGemScript}
     */
    gems?: Dictionary<InfinityMintGemScript>;
    /**
     * the arguments which were passed to the script. See {@link InfinityMintScriptArguments}
     */
    args?: Dictionary<InfinityMintScriptArguments>;
    /**
     * The current class
     */
    project?: Project;
    /**
     * Returns true if this deployment has been set up or not.
     *
     * @defautValue false
     */
    setup?: boolean;
    /**
     * the current infinity console this is running from
     */
    infinityConsole: InfinityConsole;
    /**
     * the event emitter for you to emit events from, usually provided by the InfinityConsole. See {@link app/console.InfinityConsole}.
     *
     * For events, see {@link InfinityMintEvents}.
     *
     * @event preDeploy
     * @event postDeploy
     * @event preSetup
     * @event postSetup
     * @event failure
     * @event success
     */
    eventEmitter: InfinityMintEventEmitter;

    /**
     * Contains a list of InfinityMint deployment classes which have been deployed or about to be deployed up to this point
     */
    deployments?: InfinityMintDeployments;
    /**
     * includes all deployment classes
     */
    deploymentClasses?: InfinityMintDeployment[];
    /**
     * Contains a list of only the deployed contracts up to this point, unlike deployments member which has all the deployments including none deployed
     */
    pendingDeployments?: InfinityMintLiveDeployments;
    /**
     * the current script this method is being executed on
     */
    deploymentScript?: InfinityMintDeploymentScript;
    /**
     * refers to the current InfinityMintDeployment class from which the value of the current parameters are from. Might not be available since this is inhereted by InfinityMintEventEmit.
     *
     * See {@link InfinityMintEventEmit}
     */
    deployment?: InfinityMintDeployment;
    log: typeof log;
    debugLog: typeof debugLog;
}

export interface InfinityMintScriptEventParameters {
    /**
     * the infinity console instance which is running this script
     */
    console?: InfinityConsole;
    /**
     * a way to log to the console
     */
    log: typeof log;
    /**
     * a secondary log used to log debug messages
     */
    debugLog: typeof debugLog;
    /**
     * the script which this event is being called for
     */
    script?: InfinityMintDeploymentScript;
}

export interface InfinityMintExportScriptParameters
    extends InfinityMintScriptParameters {
    location: string;
    publicFolder: string;
    ignorePublic: boolean;
    useBundle: boolean;
    exportScript: InfinityMintExportScript;
    useGems: boolean;
}

export interface InfinityMintTemplateScript {
    name: string;
    description?: string;
    meta?: {
        options?: {
            allowModuleChoice?: boolean;
            allowModuleGem?: boolean;
            allowRoyalty?: boolean;
            allowPaths?: boolean;
            allowAssets?: boolean;
            allowLinks?: boolean;
        };
        requirements?: {
            client?: 'latest' | 'classic';
            gems?:
                | string[]
                | Dictionary<{
                      name?: string;
                      module?: string;
                      location?: string;
                      sha256?: string;
                  }>;
            base?:
                | 'typescript-boilerplate'
                | 'javascript-boilterplate'
                | 'typescript-starterkit'
                | 'javascript-starterkit'
                | 'svelte-starterkit';
            ipfsOnly?: boolean;
            ensHoldersOnly?: boolean;
            apiServer?: boolean;
            webSockets?: boolean;
        };
        tabs?: Dictionary<{
            name?: string;
            order?: number;
            help?: string;
            colour?: string;
            requirePreviousEntries?: boolean;
        }>;
    };
    inputs: Dictionary<
        [
            {
                name: string;
                type: 'string' | 'number' | 'any';
                description: string;
            }
        ]
    >;
    path?: ParsedPath;
}

export interface InfinityMintExportScript {
    name?: string;
    description?: string;

    roots?: Array<{
        type?:
            | 'styles'
            | 'scripts'
            | 'images'
            | 'fonts'
            | 'videos'
            | 'paths'
            | 'projects'
            | 'assets'
            | 'pages'
            | 'imports'
            | 'components'
            | 'gems'
            | 'gemComponents'
            | 'gemPages'
            | 'gemAssets'
            | 'deployedProjects'
            | 'gemDeployments'
            | 'gemStyles'
            | 'gemScripts'
            | 'gemImages'
            | 'gemFonts'
            | 'gemVideos'
            | 'gemPaths'
            | 'gemResources'
            | 'content'
            | 'audio'
            | 'resources'
            | 'root'
            | 'gems'
            | 'public'
            | 'deployments';
        onlyName?: boolean;
        useRoot?: boolean;
        usePublic?: boolean;
        location?: string;
    }>;
    export: (script: InfinityMintExportScriptParameters) => Promise<void>;
}

/**
 * todo: figure out what this is
 */
export interface InfinityMintDeployments
    extends Dictionary<InfinityMintDeployment> {
    assets?: InfinityMintDeployment;
    royalty?: InfinityMintDeployment;
    random?: InfinityMintDeployment;
    minter?: InfinityMintDeployment;
    erc721?: InfinityMintDeploymentClass;
    values?: InfinityMintValuesDeploymentClass;
    linker?: InfinityMintLinkerDeploymentClass;
    storage?: InfinityMintStorageDeploymentClass;
    project?: InfinityMintProjectDeploymentClass;
}

/**
 * todo: figure out what this is
 */
export interface InfinityMintLiveDeployments
    extends Dictionary<InfinityMintDeploymentLive> {
    assets?: InfinityMintDeploymentLive;
    royalty?: InfinityMintDeploymentLive;
    random?: InfinityMintDeploymentLive;
    minter?: InfinityMintDeploymentLive;
    erc721?: InfinityMintDeploymentLive;
    values?: InfinityMintDeploymentLive;
    linker?: InfinityMintDeploymentLive;
    project?: InfinityMintDeploymentLive;
}

/**
 * the deployed contract fresh from the blockchain. This is the result of a deploy script. See {@link InfinityMintDeploymentScript}.
 */
export interface InfinityMintDeploymentLocal extends DeployResult {
    /**
     * the artifact name of the contract which was deployed. usually the contract name or source file name without the extension.
     */
    contractName: string;
    /**
     * the project this contract was deployed from
     */
    project: string;
    /**
     * the address that deployed this contract
     */
    deployer?: string;
    /**
     * the name of this deploymentLocal, usually the artifact name.
     */
    name?: string;
    /**
     * the key this deploymentLocal is stored under in the contract property of the InfinityMintDeployedProject. See {@link InfinityMintDeployedProject}
     */
    key: string;
    /**
     * if this deployment was deployed from a javascript based deployment script. See {@link InfinityMintDeploymentScript}
     */
    javascript?: boolean;
    /**
     * The network name and chainId this deployment was deploymend too.
     */
    network: {
        name: string;
        chainId: number;
    };
}

export type DeployArgsType = (
    params: InfinityMintDeploymentParameters
) => Promise<string[]> | string[];

/**
 * Parameters which are passed into every deploy script method which is called by InfinityMint. See {@link InfinityMintDeploymentScript}
 */
export interface InfinityMintDeploymentParameters extends KeyValue {
    /**
     * Returns true if this deployment has been set up or not.
     *
     * @defautValue false
     */
    setup?: boolean;
    /**
     * the current infinity console this is running from
     */
    infinityConsole: InfinityConsole;
    /**
     * the event emitter for you to emit events from, usually provided by the InfinityConsole. See {@link app/console.InfinityConsole}.
     *
     * For events, see {@link InfinityMintEvents}.
     *
     * @event preDeploy
     * @event postDeploy
     * @event preSetup
     * @event postSetup
     * @event failure
     * @event success
     */
    eventEmitter: InfinityMintEventEmitter;
    /**
     * Might have check if undefined depending on context
     */
    project?: InfinityMintProject | InfinityMintTempProject;
    /**
     * Contains a list of InfinityMint deployment classes which have been deployed or about to be deployed up to this point
     */
    deployments?: InfinityMintDeployments;
    /**
     * includes all deployment classes
     */
    deploymentClasses?: InfinityMintDeployment[];
    /**
     * Contains a list of only the deployed contracts up to this point, unlike deployments member which has all the deployments including none deployed
     */
    contracts?: Dictionary<InfinityMintDeploymentLive>;
    /**
     * the current script this method is being executed on
     */
    deploymentScript?: InfinityMintDeploymentScript;
    /**
     * refers to the current InfinityMintDeployment class from which the value of the current parameters are from. Might not be available since this is inhereted by InfinityMintEventEmit.
     *
     * See {@link InfinityMintEventEmit}
     */
    deployment?: InfinityMintDeployment;

    log: typeof log;
    debugLog: typeof debugLog;
    /**
     * is true if this is the first time running the setup
     */
    deployed?: boolean;
}

/**
 * An InfinityMint Depllyment is a smart contract which is currently active on which ever network is currently set. It holds the
 * abi for the contract along with its address and who deployed it. It also contains which project (see {@link InfinityMintProject}) it was deployed under.
 *
 * @see {@link InfinityMintDeploymentScript}
 */
export interface InfinityMintDeploymentLive extends KeyValue {
    /**
     *
     */
    liveDeployments: InfinityMintDeploymentLive[];
    /**
     *  The abi of the current dpeloyment.
     */
    abi: Array<any>;
    /**
     * the key of this live deployment, by default will be the contract name
     */
    key: string;
    /**
     * The name of the current deployment, same as the .sol filename.
     */
    contractName: string;
    /**
     * The address of this deployment on the blockchain.
     */
    address: string;

    /**
     * The values which are stored on chain for this deployment.
     */
    values?: KeyValue;
    /**
     * The name of the project this deployment was deployed under.
     *
     * @see {@link InfinityMintProject}
     */
    project: string;
    /**
     * The network name and chainId this deployment was deploymend too.
     */
    network: {
        name: string;
        chainId: number;
    };

    permissions: string[];

    /**
     * The name of the module this deployment is. See {@link InfinityMintProjetModulesKeys}.
     */
    module?: string;

    /**
     *  The approved addresses for this deployment.
     */
    approved?: string[];
    /**
     *  The address of the deployer of this contract.
     */
    deployer?: string;
    /**
     * The receipt for this deployment
     */
    receipt?: KeyValue;
    /**
     * true if the contract has had its setup method called successfully in the deploy script, see {@link InfinityMintDeploymentScript}
     */
    setup?: boolean;
    /**
     * the parsed path of the deployment script which deployed this contract
     */
    source?: ParsedPath;
    /**
     * is true if the project file this deployment is from is a javascript file and not typescript
     */
    javascript?: boolean;
    /**
     * if this is a new deployment or not
     */
    newlyDeployed: boolean;
}

export interface InfinityMintDeploymentLink extends InfinityMintCompiledLink {
    description?: string;
    require?: string[];
    args?: string[];
}

export type ValuesReturnType = (
    params: InfinityMintDeploymentParameters
) => Promise<number | boolean>;

export interface InfinityMintGemSettings extends InfinityMintProjectSettings {}

export interface InfinityMintGemDeploymentScript
    extends InfinityMintDeploymentScript {
    settings?: InfinityMintGemSettings;
}

/**
 * This is the interface which should be returned from all deployment scripts inside of the `./deploy` folder.
 *
 * @see {@link InfinityMintDeploymentLive}
 */
export interface InfinityMintDeploymentScript {
    /**
     * project settings relating to the deployment script
     */
    settings?: InfinityMintProjectSettings;
    /**
     * config settings relating to the deployment script
     */
    config?: KeyValue;
    /**
     * these values are stored on chain
     */
    values?: Dictionary<number | boolean | ValuesReturnType>;
    /**
     * @async
     * Deploys the smart contract or smart contracts.
     */
    deploy?: (params: InfinityMintDeploymentParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    /**
     * @async
     * Only called when the project has been deployed. Called when a live InfinityMint switches from key to the other particuarlly in the modules. See {@link InfinityMintProjectModules}. For instance if the minter was to change from SimpleSVG to SimpleImage then this method would be called. An example use would be to relink the newly asset controller to the minter.
     */
    switch?: (
        params: InfinityMintDeploymentParameters
    ) => Promise<Contract | Contract[]>;
    /**
     * @async
     * Sets up the smart contract post deployment.
     */
    setup?: (params: InfinityMintDeploymentParameters) => Promise<void>;

    /**
     * Ran once the deploy script has finished. Useful for the InfinityMintProject to set the project once its deployed
     * @param params
     * @returns
     */
    post?: (params: InfinityMintDeploymentParameters) => Promise<void>;
    /**
     * @async
     * Called when a project has been redeployed or has failed to deploy and is retrying. Defines how to clean up an active smart contract with the goal of running setup again to update changes.
     */
    cleanup?: (
        params: InfinityMintDeploymentParameters
    ) => Promise<string[] | void>;
    libraries?: Dictionary<string | boolean>;
    /**
     * @async
     * Only called when the project has been deployed. Define custom update logic depending on the situation. By default if an update method is not defined in the deployment script InfinityMint will execute clean up and then set up in the deployment script.
     */
    update?: (
        params: InfinityMintDeploymentParameters
    ) => Promise<Contract | Contract[]>;
    /**
     * The list of addresses or refrences which will be given admin access to this contract. Can be addresses or keys.
     *
     *
     * @example
     * ```js
     * //erc721 will replace with address of InfinityMint (erc721) deployment
     * ['approved', 'all', 'erc721']
     * ```
     */
    permissions?: Array<string>;
    /**
     * Only takes currently deployed contract names or module keys, will request that this contract is given permissions to any contract defined in the array
     *
     *
     * @example
     * ```js
     * //will request this contract has admin privillages on the main erc721 contract
     * ['erc721']
     * ```
     */
    requestPermissions?: Array<string>;
    /**
     * Will deploy this contract always.
     *
     * @defaultValue false
     */
    important?: boolean;

    /**
     * if this is set it will assume this is an InfinityLink contract. InfinityLink contracts are not deployed by InfinityMint but are instead deployed by the end user through the Launchpad.
     */
    link?: InfinityMintDeploymentLink;

    /**
     * if set to true, infinityMint will throw an error if another module/key alike this one is found in the deployment sequence
     */
    unique?: boolean;

    /**
     * Will prevent redeployment of this contract. If no cleanup method is defined, then InfinityMint will automatically try to redeploy the contract and run setup again unless this member is true. If this member is true then InfinityMint will run the setup method again.
     */
    static?: boolean;
    /**
     * Will run setup immediately after the deployment is succcessful
     *
     * @defaultValue false
     */
    instantlySetup?: boolean;
    /**
     * The current solidity root this contract is designed for. Solidity namespace refers to the current folder the solc is compiling from and is usually `./alpha`. You can change it in the *.env* and it is used to prototype new versions if InfinityMint or to launch completely custom code bases.
     *
     * @defaultValue alpha
     */
    solidityFolder?: PathLike;
    /**
     * Refers to the name of the artifact/contract that this deployment script works with. Will be the same as the key or file name if left undefined.
     */
    contract?: string;
    /**
     * used in auto deployment configuration (when no deploy field is set and contractName is of valid artifact), will pass these arguments to the constructor of the smart contract. You may also use function to return an array of arguments.
     *
     * @example
     * ```js
     * //will replace erc721, assets, royalty with the address of the live deployment that uses that tag. (if it has been deployed by this stage)
     * deployArgs: ['erc721','assets', 'royalty','0x523...']
     * ```
     * @example
     * ```js
     * deployArgs: async ({infinityConsole, project}) => {
     *  return [
     *     project.getName(),
     *     project.getContract('erc721').address,
     *  ]
     * }
     * ```
     */
    deployArgs?: string[] | DeployArgsType;
    /**
     * If this deployment is a library. Will not set permissions.
     *
     * @defaultValue false
     */
    library?: boolean;
    /**
     * Will export the abi of the contract when a project attached to this contract is exported.
     */
    exportAbi?: boolean;
    /**
     * Defines which InfinityMint module this deployment satisfies (see {@link InfinityMintProjectModules}).
     */
    module?: InfinityMintProjetModulesKeys | string;
    /**
     * Will be the filename of the deploy script by default.
     */
    key?: string;
    /**
     * used to specify deployment order, lower indexes will be deployed over higher indexes. Minus values can be used.
     *
     * @defaultValue 10
     */
    index?: number;
}
