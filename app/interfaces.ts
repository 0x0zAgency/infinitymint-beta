import { BigNumber } from "ethers";
import { Dictionary } from "form-data";
import { HardhatUserConfig } from "hardhat/types";
import { debugLog, FuncDouble, FuncSingle, log } from "./helpers";
import { ServerOptions } from "ganache";
import { EventEmitter } from "events";
import { Contract } from "@ethersproject/contracts";
import InfinityConsole from "./console";
import { InfinityMintDeployment } from "./deployments";
import { PathLike } from "fs";
import { InfinityMintSVGSettings } from "./content";
import { GasPriceFunction, TokenPriceFunction } from "./gasAndPrices";
import { Options } from "ipfs-core";
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
	init?: FuncSingle<InfinityMintGemParameters, Promise<void>>;
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
	gem: InfinityMintGemScript;
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

/**
 * For backwards compatability and JavaScript support. A Definition for the classic InfinityMint omega project. Iss used when projects are .js and not .ts before they have been compiled. When they get compiled they get turned into normal project interface. See {@link InfinityMintProject}.
 */
export interface InfinityMintProjectJavascript
	extends InfinityMintProject,
		KeyValue {
	/**
	 * will always be true
	 */
	javascript: true;
	mods: Dictionary<boolean>;
	contracts: KeyValue;
	description: KeyValue;
	static: KeyValue;
	deployment: KeyValue;
	royalty?: KeyValue;
	approved: Dictionary<string>;
	assetConfig: KeyValue;
	names: Array<string>;
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
 * classic paths, used when project file is a .js
 */
export interface InfinityMintProjectJavascriptPaths {
	default: KeyValue;
	indexes: Array<InfinityMintProjectPath>;
}

/**
 * classic assets, used when project file is a .js
 */
export interface InfinityMintProjectJavascriptAssets
	extends Dictionary<InfinityMintProjectAsset> {}

/**
 * A compiled version of the InfinityMintProject, unlike the InfinityMintProject this does not contain any events which might have been defined in the project. You must include the project javascript or typescript file as well as the compiled project to also be able to do events.
 */
export interface InfinityMintCompiledProject {
	/**
	 * the name of the current project
	 */
	name: string;
	/**
	 * custom infinityLinks which can be linked to the token
	 */
	links: Array<InfinityMintProjectSettingsLink>;
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
	assets?: Array<InfinityMintProjectAsset>;
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
	bundles?: Dictionary<{
		version?: string;
		paths?: {
			ipfs?: Array<PathLike>;
		};
	}>;

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
	stages: KeyValue;
	/**
	 * if this is project has completed the setup stage yet
	 */
	setup?: boolean;
}

/**
 *
 */
export interface InfinityMintDeployedProject {
	/**
	 * the name of the current project
	 */
	name: string;
	/**
	 * custom infinityLinks which can be linked to the token
	 */
	links: Array<InfinityMintProjectSettingsLink>;
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
	assets?: Array<InfinityMintProjectAsset>;
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
	deployments?: Dictionary<InfinityMintDeploymentLive>;
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
	links?: Array<InfinityMintProjectSettingsLink>;
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
	paths: Array<InfinityMintProjectPath> | InfinityMintProjectJavascriptPaths;
	/**
	 * All the possible asset varations of the minter, must be an Array of {@link InfinityMintProjectAsset}
	 */
	assets?:
		| Array<InfinityMintProjectAsset>
		| InfinityMintProjectJavascriptAssets
		| Dictionary<InfinityMintProjectAsset[]>;
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
export declare interface InfinityMintEventEmitter {
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

	on(eventName: string, cb: Function): any;
	on(eventName: InfinityMintEventKeys, cb: Function): any;
	on(eventName: InfinityMintConfigEventKeys, cb: Function): any;
}

/**
 * Extends the default node event emitter to have our event names appear in auto completion making it easier to work with InfinityMint
 */
export class InfinityMintEventEmitter extends EventEmitter {}

export interface InfinityMintConfigEvents extends InfinityMintEvents {
	changeProject?: FuncSingle<
		InfinityMintEventEmit<string>,
		Promise<void | boolean>
	>;
	changeNetwork?: FuncSingle<
		InfinityMintEventEmit<string>,
		Promise<void | boolean>
	>;
	destroyed?: FuncSingle<
		InfinityMintEventEmit<string>,
		Promise<void | boolean>
	>;
}

export type InfinityMintConfigEventKeys = keyof InfinityMintConfigEvents;

/**
 * Events can be defined which can then be called directly from the project file or a gem. The EventEmitter where ever the project is used is responsible for handling the automatic assignment of these events. All you need to do is return a promise which returns void. Please be aware that promises will not be waited for.
 */
export interface InfinityMintEvents {
	/**
	 * Fired when the InfinityConsole is initialized
	 * @event
	 */
	initialized?: FuncSingle<
		InfinityMintEventEmit<void>,
		Promise<void | boolean>
	>;
	/**
	 * Fired when the InfinityConsole is reinitialized
	 * @event
	 */
	reloaded?: FuncSingle<InfinityMintEventEmit<void>, Promise<void | boolean>>;
	/**
	 * @event
	 */
	preCompile?: FuncSingle<
		InfinityMintEventEmit<void>,
		Promise<void | boolean>
	>;
	/**
	 * Will be called when project is compiled
	 * @event
	 */
	postCompile?: FuncSingle<InfinityMintEventEmit<void>, Promise<void>>;
	/**
	 * Will be called when setup is about to take place. Can return false to abort setup silently.
	 * @event
	 */
	preSetup?: FuncSingle<
		InfinityMintEventEmit<InfinityMintDeployment>,
		Promise<void | boolean>
	>;
	/**
	 * @event
	 */
	postSetup?: FuncSingle<
		InfinityMintEventEmit<InfinityMintDeployment>,
		Promise<void>
	>;
	/**
	 * Will be called when deploy complete.
	 * @event
	 */
	postDeploy?: FuncSingle<
		InfinityMintEventEmit<InfinityMintDeploymentLive[]>,
		Promise<void>
	>;
	/**
	 * @event
	 */
	preDeploy?: FuncSingle<
		InfinityMintEventEmit<InfinityMintDeployment>,
		Promise<void | boolean>
	>;
	/**
	 * @event
	 */
	gemPreSetup?: FuncSingle<
		InfinityMintEventEmit<InfinityMintGemScript>,
		Promise<void>
	>;
	/**
	 * @event
	 */
	gemPostSetup?: FuncSingle<
		InfinityMintEventEmit<InfinityMintGemScript>,
		Promise<void | boolean>
	>;
	/**
	 * @event
	 */
	gemPreDeploy?: FuncSingle<
		InfinityMintEventEmit<InfinityMintGemScript>,
		Promise<void>
	>;
	/**
	 * @event
	 */
	gemPostDeploy?: FuncSingle<
		InfinityMintEventEmit<
			InfinityMintDeploymentLive | InfinityMintDeploymentLive[]
		>,
		Promise<void | boolean>
	>;
	/**
	 * @event
	 */
	postGems?: FuncSingle<InfinityMintEventEmit<void>, Promise<void>>;
	/**
	 * @event
	 */
	preGems?: FuncSingle<InfinityMintEventEmit<void>, Promise<void | boolean>>;
	/**
	 * @event
	 */
	postGem?: FuncSingle<
		InfinityMintEventEmit<InfinityMintGemScript>,
		Promise<void>
	>;
	/**
	 * @event
	 */
	preGem?: FuncSingle<
		InfinityMintEventEmit<InfinityMintGemScript>,
		Promise<void | boolean>
	>;
	/**
	 * @event
	 */
	postExport?: FuncSingle<InfinityMintEventEmit<string[]>, Promise<void>>;
	/**
	 * Will be called when export is about to begin. Can return false to abort/skip export silently.
	 * @event
	 */
	preExport?: FuncSingle<
		InfinityMintEventEmit<string[]>,
		Promise<void | boolean>
	>;
	/**
	 * @event
	 */
	preBuild?: FuncSingle<InfinityMintEventEmit<void>, Promise<void | boolean>>;
	/**
	 * @event
	 */
	postBuild?: FuncSingle<InfinityMintEventEmit<void>, Promise<void>>;
	/**
	 * @event
	 */
	preScript?: FuncSingle<
		InfinityMintEventEmit<void>,
		Promise<void | boolean>
	>;
	/**
	 * @event
	 */
	postScript?: FuncSingle<InfinityMintEventEmit<void>, Promise<void>>;
	/**
	 * @event
	 */
	success?: FuncSingle<InfinityMintEventEmit<void>, Promise<void>>;
	/**
	 * @event
	 */
	failure?: FuncSingle<InfinityMintEventEmit<Error>, Promise<void>>;
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

export interface InfinityMintProjectSettingsLink {
	key: string;
	name: string;
	description?: string;
	verify?: boolean;
	forcedOnly?: boolean;
	contract?: string;
	settings?: InfinityMintProjectSettingsLinkSettings;
	interfaceId?: any;
}

export interface InfinityMintProjectSettingsLinkSettings {
	erc721?: boolean;
}

/**
 * Settings for the values deployment. Can contain either booleans or numbers. All values here will be set on chain inside of the InfinityMintValues contract.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsValues extends KeyValue {
	disablePreviews?: boolean;
	disableAssets?: boolean;
}

/**
 * Settings for the minter deployment.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsMinter {
	pathId?: number;
	maxSupply?: number;
	mintBytes?: KeyValue;
	approvedOnly?: boolean;
	onlyImplicitMint?: boolean;
	maxTokensPerWallet?: number;
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
	preventSamePathTwice?: boolean;
	rarity?: {
		pickLeastCommon?: boolean;
		pickMostCommon?: boolean;
	};
	disabledPaths?: Array<any>;
	nameCount?: number;
}

export interface InfinityMintProjectSettingsRoyaltySplit extends KeyValue {
	address: string;
	mints: number;
	stickers: number;
}

export interface InfinityMintProjectSettingsRoyaltyCuts extends KeyValue {
	stickers: number;
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

/**
 * Settings for the erc721 (InfinityMint) deployment.
 *
 * @see {@link InfinityMintProjectSettings}
 */
export interface InfinityMintProjectSettingsERC721 extends KeyValue {
	defaultTokenURI?: string;
	allowTransfer?: boolean;
}

/**
 * All of the InfinityMint environment variables
 */
export interface InfinityMintEnvironmentVariables {
	INFINITYMINT_PROJECT?: string;
	ETHERSCAN_API_KEY?: string;
	POLYGONSCAN_API_KEY?: string;
	PIPE_ECHO_DEFAULT?: boolean;
	PIPE_ECHO_DEBUG?: boolean;
	DEFAULT_WALLET_MNEMONIC?: string;
	BACKUP_WALLET_MNEMONIC?: string;
	PIPE_ECHO_ERRORS?: boolean;
	PIPE_ECHO_WARNINGS?: boolean;
	PIPE_SEPERATE_WARNINGS?: boolean;
	PIPE_LOG_ERRORS_TO_DEFAULT?: boolean;
	PIPE_LOG_ERRORS_TO_DEBUG?: boolean;
	PIPE_SILENCE_UNDEFINED_PIPE?: boolean;
	PIPE_SILENCE?: boolean;
	PIPE_IGNORE_CONSOLE?: boolean;
	INFINITYMINT_INCLUDE_DEPLOY?: boolean;
	INFINITYMINT_TELNET?: boolean;
	INFINITYMINT_INCLUDE_SCRIPTS?: boolean;
	GANACHE_PORT?: number;
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
export interface InfinityMintProjectSettings {
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
	 * List of contracts which are disabled, will check if member equals contract name or key
	 */
	disabledContracts?: string;
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
	settingsFile?: string;
	settingsFileKey?: string;
	settings: KeyValue | InfinityMintSVGSettings;
}

/**
 * InfinityMint paths are what the minter will use when rendering your token. For each path you define is a different apperance the token can take. Inside the project file you can set options (see {@link InfinityMintProjectSettingsAssets}) for how the paths will be picked. For each path you have to specify its name and the fileName to use. You can also specify if it is encrypted.
 */
export interface InfinityMintProjectPath {
	name: string;
	fileName: PathLike;
	/**
	 * is the mint data, this is copied to each token internally. Can be a path to a file
	 */
	data?: KeyValue | PathLike;
	/**
	 * can either contain an object of settings for the path or a link to the settings file or simply `true` to look for a settings file that matches the fileName import. See {@link app/content.InfinityMintSVGSettings}
	 */
	settings?: KeyValue | PathLike | boolean | InfinityMintSVGSettings;
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
	 * true if the project the path contains has been compiled.
	 */
	compiled?: boolean;
}

/**
 * is the same as {@link InfinityMintProjectPath} but is for JavaScript project files (classic InfinityMint).
 */
export interface InfinityMintProjectJavascriptPath
	extends InfinityMintProjectPath {
	/**
	 * For Javascript infinitymint paths this is where exported data is put. This is only used when the project is a javascript file as it does call it 'exports'. See {@link InfinityMintProjectPath}
	 */
	paths?: InfinityMintProjectPathExport;
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
}

/**
 * The infinitymint configuation interface, this is what is returnted from the infinitymint.config.js in the current root and holds ganache, hardhat and infinitymint configuration details.
 */
export interface InfinityMintConfig {
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
	console?: InfinityMintConsoleOptions | boolean;
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
	startup?: boolean;

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
	 * The settings inputted to ganache within the `server.run()` function of its startup. Uses all valid configuration options found within their docs. <https://www.npmjs.com/package/ganache>
	 */
	ganache?: ServerOptions;
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
}

export interface InfinityMintIPFSOptions {
	web3Storage: {
		token?: string;
		useAlways?: boolean;
	};
	endpoints: string[] | string;
	kubo: {
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

export interface InfinityMintSessionEnvironment extends KeyValue {
	ganacheMnemonic?: string;
	project?: KeyValue;
}

/**
 * the interface for the .session file
 */
export interface InfinityMintSession {
	environment?: InfinityMintSessionEnvironment;
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
export interface InfinityMintConfigSettingsNetworks
	extends Dictionary<InfinityMintConfigSettingsNetwork> {
	ganache?: InfinityMintConfigSettingsNetwork;
	hardhat?: InfinityMintConfigSettingsNetwork;
	ethereum?: InfinityMintConfigSettingsNetwork;
	polygon?: InfinityMintConfigSettingsNetwork;
	mumbai?: InfinityMintConfigSettingsNetwork;
	goreli?: InfinityMintConfigSettingsNetwork;
}
/**
 * @see {@link InfinityMintConfigSettings}
 */
export interface InfinityMintConfigSettingsCompile extends KeyValue {
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
	networks: InfinityMintConfigSettingsNetworks;
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
	scripts?: {
		disableJavascriptRequire: PathLike[];
	};
}

/**
 * This interface refers to the specific arguments which can be passed to the script. Either as parameters in a bash script or from the InfinityMintConsole. See {@link InfinityMintScript}
 */
export interface InfinityMintScriptArguments {
	name: string;
	optional?: boolean;
	validator?: Function;
	//defines which type of UI element to render for this element, also takes over as a basic validator if no validor function is defined
	type?: "boolean" | "string" | "number";
	value?: any;
}

/**
 *
 */
export interface InfinityMintConsoleOptions {
	blessed?: KeyValue;
	/**
	 * custom think method
	 */
	think?: Function;
	/**
	 * number of ms to wait before running think again
	 */
	tickRate?: number;
	/**
	 * if to throw errors outside of the console
	 */
	throwErrors?: boolean;
	/**
	 * the initial window the console should open into
	 */
	initialWindow?: string | Window;
	//will not start blessed and draw nothing to this console.
	dontDraw?: boolean;
}

export interface InfinityMintTelnetOptions {
	/**
	 * port to run telnet on
	 */
	port?: number;
}

/**
 * An InfinityMint script is like a Hardhat test, it essentially allows InfinityMint to perform a task. The scripts by default are located in the `./scripts` folder.
 */

export interface InfinityMintScript {
	name?: string;
	/**
	 * The location of the script file
	 */
	fileName?: string;
	description?: string;
	/**
	 * called when the script is executed, is passed {@link InfinityMintScriptParameters}. Return false to signify that this script failed.
	 */
	execute: FuncSingle<InfinityMintScriptParameters, Promise<boolean | void>>;
	loaded?: FuncSingle<InfinityMintScriptEventParameters, Promise<void>>;
	reloaded?: FuncSingle<InfinityMintScriptEventParameters, Promise<void>>;
	arguments?: InfinityMintScriptArguments[];
	events?: InfinityMintEvents;
	/**
	 * registers this InfinityMint script as a hardhat task as well.
	 */
	task?: true;
	solidityFolder?: string;
	javascript?: true;
	author?: KeyValue | KeyValue[];
}

/**
 * This is passed into the execute method of the script inside the scripts/ folder by default. See {@link InfinityMintScript}
 */
export interface InfinityMintScriptParameters
	extends InfinityMintDeploymentParameters,
		KeyValue {
	/**
	 * Refers to the current script of which the parameters values come from. Could not be available due to the fact this extends InfinityMintDeploymentParameters and InfinityMintEventEmit
	 */
	script?: InfinityMintScript;
	gems?: Dictionary<InfinityMintGemScript>;
	args?: Dictionary<InfinityMintScriptArguments>;
}

export interface InfinityMintScriptEventParameters {
	console?: InfinityConsole;
	log: typeof log;
	debugLog: typeof debugLog;
	script?: InfinityMintDeploymentScript;
}

export interface InfinityMintDeploymentParametersDeployments
	extends Dictionary<InfinityMintDeploymentLive> {
	assets: InfinityMintDeploymentLive;
	royalty: InfinityMintDeploymentLive;
	erc721: InfinityMintDeploymentLive;
	random: InfinityMintDeploymentLive;
	minter: InfinityMintDeploymentLive;
	values: InfinityMintDeploymentLive;
	utils: InfinityMintDeploymentLive;
	InfinityMintLinker: InfinityMintDeploymentLive;
	InfinityMintProject: InfinityMintDeploymentLive;
}

export interface InfinityMintDeploymentLocal extends KeyValue {
	abi?: any[];
	name?: string;
	address?: string;
	args?: any[];
	transactionHash?: string;
	receipt?: KeyValue;
	input?: KeyValue;
	output?: KeyValue;
	sourceName?: string;
	contractName?: string;
	deployer?: string;
}

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
	infinityConsole?: InfinityConsole;
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
	deployments?: Dictionary<InfinityMintDeployment>;
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
	 *  The abi of the current dpeloyment.
	 */
	abi?: Array<any>;
	/**
	 * the key of this live deployment, by default will be the contract name
	 */
	key?: string;
	/**
	 * The name of the current deployment, same as the .sol filename.
	 */
	name?: string;
	/**
	 * The address of this deployment on the blockchain.
	 */
	address?: string;
	/**
	 * The name of the project this deployment was deployed under.
	 *
	 * @see {@link InfinityMintProject}
	 */
	project?: string;
	/**
	 * The network name and chainId this deployment was deploymend too.
	 */
	network?: {
		name: string;
		chainId: number;
	};
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
	 * the location of the deployment script which deployed this deployment
	 */
	deploymentScript?: string;
	/**
	 * is true if the project file this deployment is from is a javascript file and not typescript
	 */
	javascript?: boolean;
}

/**
 * This is the interface which should be returned from all deployment scripts inside of the `./deploy` folder.
 *
 * @see {@link InfinityMintDeploymentLive}
 */
export interface InfinityMintDeploymentScript {
	/**
	 * @async
	 * Deploys the smart contract or smart contracts.
	 */
	deploy?: FuncSingle<
		InfinityMintDeploymentParameters,
		Promise<Contract | Contract[]>
	>;
	/**
	 * @async
	 * Only called when the project has been deployed. Called when a live InfinityMint switches from key to the other particuarlly in the modules. See {@link InfinityMintProjectModules}. For instance if the minter was to change from SimpleSVG to SimpleImage then this method would be called. An example use would be to relink the newly asset controller to the minter.
	 */
	switch?: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
	/**
	 * @async
	 * Sets up the smart contract post deployment.
	 */
	setup?: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
	/**
	 * @async
	 * Called when a project has been deployed or has failed to deploy and is retrying. Defines how to clean up an active smart contract with the goal of running setup again to update changes.
	 */
	cleanup?: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
	/**
	 * @async
	 * Only called when the project has been deployed. Define custom update logic depending on the situation. By default if an update method is not defined in the deployment script InfinityMint will execute clean up and then set up in the deployment script.
	 */
	update?: FuncSingle<InfinityMintDeploymentParameters, Promise<void>>;
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
	 * //all will give requestPermissions to every contract InfinityMint can
	 * ['all', 'erc721']
	 * ```
	 */
	requestPermissions?: Array<string>;
	/**
	 * If important is true will prevent allow other deploy scripts from overwrite this key. If false will allow scripts to overwrite this key even if unique is true
	 *
	 * @defaultValue false
	 */
	important?: boolean;
	/**
	 * if set to true, infinityMint will throw an error if similar key to another deployment is found
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
	 * Refers to the name of the artifact/contract that this deployment script works with. Will be the same as the key if left undefined.
	 */
	contract?: string;
	/**
	 * used in auto deployment configuration (when no deploy field is set and contractName is of valid artifact), will pass these arguments to the constructor of the smart contract.
	 *
	 * @example
	 * ```js
	 * //will replace erc721, assets, royalty with the address of the live deployment that uses that tag. (if it has been deployed by this stage)
	 * deployArgs: ['erc721','assets', 'royalty','0x523...']
	 * ```
	 */
	deployArgs?: any[];
	/**
	 * If this deployment is a library. Will not set permissions.
	 *
	 * @defaultValue false
	 */
	library?: boolean;
	/**
	 * Defines which InfinityMint module this deployment satisfies (see {@link InfinityMintProjectModules}).
	 */
	module?: InfinityMintProjetModulesKeys[] | string;
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
