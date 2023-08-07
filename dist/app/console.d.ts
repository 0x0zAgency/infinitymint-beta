/// <reference types="node" />
import { Gem, InfinityMintCompiledProject, InfinityMintConfigEventKeys, InfinityMintConsoleOptions, InfinityMintDeployedProject, InfinityMintEventKeys, InfinityMintExportScript, InfinityMintNetworkEventKeys, InfinityMintProject, InfinityMintScript, InfinityMintScriptArguments, InfinityMintTempProject, KeyValue } from './interfaces';
import { BlessedElement } from './helpers';
import { TelnetServer } from './telnet';
import { InfinityMintEventEmitter } from './interfaces';
import { InfinityMintWindow } from './window';
import { Network } from 'hardhat/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { PipeFactory } from './pipes';
import { Dictionary } from './helpers';
import { BigNumber } from 'ethers';
import { InfinityMintDeployment } from './deployments';
import path from 'path';
import { ImportCache } from './imports';
import { JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import { ProjectCache } from './projects';
import { ExpressServer } from './express';
import { IPFS } from './ipfs';
import { WebSocketController } from './webSocket';
import * as Projects from './projects';
import * as Helpers from './helpers';
import * as Deployments from './deployments';
import { UpdateCache } from './updates';
/**
 * Powered by Blessed-cli the InfinityConsole is the container of InfinityMintWindows and all things Web3 related. See {@link app/window.InfinityMintWindow}.
 */
export declare class InfinityConsole {
    /**
     * This is the projects module. It contains all the functions for managing projects. See {@link app/projects}
     */
    Projects: typeof Projects;
    /**
     * This is the helpers module. It contains useful utils. See {@link app/helpers}
     */
    Helpers: typeof Helpers;
    /**
     * This is the deployments module. It contains all the functions for managing deployments. See {@link app/deployments}
     */
    Deployments: typeof Deployments;
    /**
     * List of templates for creating new projects, see the /templates/ folder and new command
     */
    templates: any;
    /**
     * An instance of the web socket controller
     */
    WebSocketController: WebSocketController;
    /**
     * an instance of the express server
     */
    ExpressServer: ExpressServer;
    /**
     * Returns an instance of an InfinityMint IPFS class.
     */
    IPFS: IPFS;
    /**
     * the windows for the console
     */
    windows: InfinityMintWindow[];
    /**
     * the imports cache for the console
     */
    private imports;
    /**
     * this is handle to a setInterval that is used to update the console. the setInterval is cleared when the console is closed. the setInterval is used to update the console every 100ms by default. You can change this by changing the tickRate option in the console options.
     */
    protected think?: any;
    /**
     * the current window of the console
     */
    protected currentWindow?: InfinityMintWindow;
    /**
     * is the console is allowed to exit
     */
    protected allowExit: boolean;
    /**
     * the loading box element
     */
    private loadingBox?;
    /**
     * List of export solutions for exporting InfinityMint projects, see the /exports/ folder and export command
     */
    private exportSolutions;
    /**
     * the screen of the console. This is a blessed cli element.
     */
    private screen;
    /**
     * the gems
     */
    private gems;
    /**
     * the options for the console, see {@link app/interfaces.InfinityMintConsoleOptions}
     */
    private options?;
    /**
     * the hardhat runtime environment for the console. See {@link https://hardhat.org/hardhat-network/#hardhat-runtime-environment}.
     */
    private currentNetwork?;
    /**
     * the signers for the console. See {@link https://docs.ethers.io/v5/api/signer/#Signer}
     */
    private signers?;
    /**
     * the window manager element for the console
     */
    private windowManager?;
    /**
     * the error box element for the console
     */
    private errorBox?;
    /**
     * returns true if the console has successfully connected to a network
     */
    private currentNetworkAccess;
    /**
     * the keyboard shortcuts for the console, is a dictionary of key combinations and their respective functions
     */
    private inputKeys;
    /**
     * the current networks chainId of the console
     */
    private chainId;
    /**
     * the event emitter for the console
     */
    private EventEmitter;
    /**
     * the current account of the console
     */
    private currentAccount;
    /**
     * the current balance of the console
     */
    private currentBalance;
    /**
     * the scripts for the console
     */
    private scripts;
    /**
     * the session id of the console
     */
    private sessionId;
    /**
     * the current tick of the console
     */
    private tick;
    /**
     * the current audio being played
     */
    private currentAudio;
    /**
     * the telnets client instance
     */
    private telnetClient;
    /**
     *
     */
    private firstTime;
    /**
     * if the current audio has been killed or is not playing
     */
    private currentAudioKilled;
    /**
     * if the console has been initialized
     */
    private hasInitialized;
    /**
     *
     */
    private splashScreen;
    /**
     * if the audio is currently awaiting kill
     */
    private currentAudioAwaitingKill;
    /**
     * the audio player for the console
     */
    private player;
    /**
     * the telnet user entry for this console
     */
    private user;
    /**
     * the telnet session entry for this console innstance
     */
    private session;
    /**
     * the telnet server instance
     */
    TelnetServer: TelnetServer;
    /**
     * loggers for the console
     */
    PipeFactory: PipeFactory;
    /**
     * projects cache
     */
    private projects;
    /**
     * Updates cache
     */
    private updates;
    /**
     * constructor for the InfinityConsole, see {@link app/window.InfinityMintWindow}
     * @param options
     * @param pipeFactory
     * @param telnetServer
     * @param eventEmitter
     */
    constructor(options?: InfinityMintConsoleOptions, pipeFactory?: PipeFactory, telnetServer?: TelnetServer, eventEmitter?: InfinityMintEventEmitter);
    /**
     * Loads custom components
     */
    loadCustomComponents(): Promise<void>;
    /**
     * returns a guuidv4 id
     * @returns
     */
    private generateId;
    /**
     * gets the gems
     */
    loadGems(): Promise<void>;
    getLoadingBox(): BlessedElement;
    /**
     * will return the telnet username of this console
     * @returns
     */
    getTelnetUsername(): string;
    /**
     * set the telnet client of this console. you should not need to call this method.
     * @param client
     */
    setTelnetClient(client: any): void;
    /**
     *
     * @param eventEmitter
     */
    setEventEmitter(eventEmitter: InfinityMintEventEmitter): void;
    /**
     * sets the event emitter of this console to another consoles event emitter returning the old one
     * @param otherConsole
     * @returns
     */
    setEventEmitterFromConsole(otherConsole: InfinityConsole): InfinityMintEventEmitter;
    /**
     * retursn true if this console is a telnet console
     * @returns
     */
    isTelnet(): boolean;
    /**
     * creates a new event emitter for this console
     * @param dontCleanListeners
     * @returns
     */
    createEventEmitter(dontCleanListeners?: boolean): InfinityMintEventEmitter;
    /**
     * gets the consoles session id. this is used to identify the console in the telnet server as well as also being used to identify the console in the event emitter
     * @returns
     */
    getSessionId(): string;
    /**
     * gets the consoles event emitter
     * @returns
     */
    getEventEmitter(): InfinityMintEventEmitter;
    /**
     * gets the screen the console is running on
     * @returns
     */
    getScreen(): BlessedElement;
    /**
     * returns the current account of the console which is the first member of the signers array but with a correctly resolved address
     * @returns
     */
    getCurrentAccount(): SignerWithAddress;
    /**
     * returns the current balance of the account
     * @returns
     */
    getCurrentBalance(): BigNumber;
    /**
     * returns the current chain id
     * @returns
     */
    getCurrentChainId(): number;
    /**
     * logs a message to the console
     * @param msg
     * @param pipe
     */
    log(msg: string, pipe?: string): void;
    /**
     * logs an error to the default pipe
     * @param error
     */
    error(error: Error): void;
    /**
     * initializes the input keys property to equal the default keyboard shortcuts allowing the user to navigate the console and close windows
     */
    private registerDefaultKeys;
    /**
     * gets the first signer currently set in the console
     * @returns
     */
    getSigner(): SignerWithAddress;
    /**
     * gets all the signers currently set in the console
     * @returns
     */
    getSigners(): SignerWithAddress[];
    hasExpressServer(): boolean;
    hasWebSockets(): boolean;
    /**
     * reloads a window by removing it from the windows array, removing the cached window and then re-instantiating it. This reloads the script which defines the window with code updates and re-renders the window
     * @param thatWindow
     */
    reloadWindow(thatWindow: string | InfinityMintWindow): Promise<void>;
    /**
     * registers events on the window
     * @param window
     * @returns
     */
    private registerWindowEvents;
    /**
     * Will execute a script with the given arguments. argv is optional, you can pass argv directly from yargs if you want
     * @param scriptName
     * @param scriptArguments
     * @param argv
     */
    executeScript(scriptName: string, scriptArguments?: Dictionary<InfinityMintScriptArguments>, argv?: any, showDebugLogs?: boolean): Promise<void>;
    /**
     * sets current window to what ever is passed in and shows it
     * @param thatWindow
     * @returns
     */
    setCurrentWindow(thatWindow: string | Window): Promise<void>;
    /**
     * destroys the console
     */
    destroy(): void;
    /**
     * cleans up the console ready to be reloaded
     */
    private cleanup;
    /**
     * reloads the projects
     */
    loadProjects(useCache?: boolean): Promise<void>;
    /**
     * reloads the updates
     * @param useCache
     */
    loadUpdates(useCache?: boolean): Promise<void>;
    /**
     * Returns the current infinity mint projet
     * @returns
     */
    getCurrentProject(): Promise<Projects.Project>;
    /**
     *
     * @returns if the current project is valid
     */
    hasCurrentProject(): boolean;
    /**
     * Returns true if this project exists, used to check if project or full name exists
     * @param projectOrFullName
     * @returns
     */
    hasProject(projectOrFullName: string | KeyValue): boolean;
    /**
     * Reloads the current infinitymint.config.ts
     */
    reloadConfig(): void;
    /**
     * returns a list of all the projects found
     * @returns
     */
    getProjectNames(): string[];
    /**
     * Returns a project class. You can enter just the name of the project to be returned a class or pass in deployed or compiled project data to create a classed based off of that
     * @param projectOrFullName
     * @returns
     */
    getProject(projectOrFullName?: string | InfinityMintCompiledProject | InfinityMintDeployedProject | InfinityMintProject, network?: string, version?: string): Promise<Projects.Project>;
    /**
     * returns a compiled project
     * @param projectOrFullName
     * @returns
     */
    getCompiledProject(projectOrFullName: any): InfinityMintCompiledProject;
    /**
     * returns a deployed project
     * @param projectOrFullName
     * @param network
     * @returns
     */
    getDeployedProject(projectOrFullName: any, network?: string): InfinityMintDeployedProject;
    get network(): Network;
    /**
     * reloads the console
     * @param refreshImports
     */
    reload(refreshImports?: boolean): Promise<void>;
    /**
     * gets a window by its guid
     * @param id
     * @returns
     */
    getWindowById<T extends InfinityMintWindow>(id: string | Window): T;
    /**
     *
     * @returns
     */
    getCurrentDeployedProject(): InfinityMintDeployedProject;
    /**
     *
     * @returns
     */
    getCurrentCompiledProject(): InfinityMintCompiledProject;
    /**
     * returns the current consoles imports
     * @returns
     */
    getImports(): ImportCache;
    /**
     * returns the current consoles imports
     * @returns
     */
    getProjects(): ProjectCache;
    /**
     * Returns current project updates
     * @returns
     */
    getUpdates(): UpdateCache;
    /**
     * gets a list of windows orderd by creation date
     * @param name
     * @param oldest
     * @returns
     */
    getWindowByAge(name: string, oldest: boolean): InfinityMintWindow[];
    /**
     * Returns a list of windows with the same name
     * @param name
     * @returns
     */
    getWindowsByName(name: string): InfinityMintWindow[];
    /**
     * gets the current tick of the console. The tick is the number of times the console has been updated. The speed of which the console updates is determined by the config file
     * @returns
     */
    getTick(): number;
    /**
     * Adds a window to the console
     * @param window
     */
    addWindow(window: InfinityMintWindow): void;
    /**
     * returns true if there is a request to kill the current audio stream
     * @returns
     */
    isAudioAwaitingKill(): boolean;
    /**
     * returns a window by name
     * @param windowName
     * @returns
     */
    getWindow<T extends InfinityMintWindow>(windowName: string): T;
    /**
     * returns true if the window exists
     * @param windowName
     * @returns
     */
    hasWindowName(windowName: string): boolean;
    /**
     * returns true if audio is current playing
     * @returns
     */
    isAudioPlaying(): boolean;
    /**
     * Stops the current audio file
     * @returns
     */
    stopAudio(): Promise<void>;
    /**
     * plays an audio file using a child process to a music player executable on the system. Does not work if music is disabled in config. Will not work over telnet. Might not work on windows.
     * @param path
     * @param onFinished
     * @param onKilled
     * @returns
     */
    playAudio(path: string, onFinished?: Function, onKilled?: Function): void;
    /**
     * gets the current window
     * @returns
     */
    getCurrentWindow(): InfinityMintWindow;
    /**
     * Returns true if there is a current window
     * @returns
     */
    hasCurrentWindow(): boolean;
    /**
     * Returns true if the current window has killed the audio after it was requested to stop playing.
     * @returns
     */
    hasAudioBeenKilled(): Promise<void>;
    hasWindow(window: InfinityMintWindow): boolean;
    /**
     * Updates the windows list with the current windows in the console
     * @returns
     */
    private updateWindowsList;
    /**
     * shows a loading bar with a message in the center of the screen
     * @param msg
     * @param filled
     * @returns
     */
    setLoading(msg: string, filled?: number): void;
    isDrawing(): boolean;
    /**
     * stops the loading bar from appearing
     * @returns
     */
    stopLoading(): void;
    /**
     * creates the window manager
     */
    private createWindowManager;
    /**
     * Overwrites the key and mouse events on the blessed screen object to capture errors
     */
    private captureEventErrors;
    /**
     *
     * @param scriptName
     * @returns
     */
    getScript<T extends InfinityMintScript>(scriptName: string): T;
    /**
     * Displays an error in a box. Will not display if the console is not drawing.
     * @param error
     * @param onClick
     */
    displayError(error: Error, onClick?: any): void;
    /**
     * This method is used to register keyboard shortcuts which are included in each console by default. It is also used to register new keys if the console is reloaded.
     * @returns
     */
    private registerKeys;
    /**
     * sets the allow exit flag for this console.
     * @param canExit
     */
    setAllowExit(canExit: boolean): void;
    /**
     * Sets the telnet session for this console.
     * @param session
     */
    setTelnetSession(session: any): void;
    /**
     * Sets the telnet user for this console.
     * @param user
     */
    setTelnetUser(user: any): void;
    /**
     * Used by the close method to determine if the console can exit or not.
     * @returns
     */
    isAllowingExit(): boolean;
    /**
     * Changes the web3 provider to a new network, reloading the console and all windows and elements.
     * @param string
     * @returns
     */
    changeNetwork(string: string): Promise<JsonRpcProvider>;
    /**
     * assigns a key to a method for this console. Used by the console, windows and elements to register keyboard shortcuts
     * @param key
     * @param cb
     * @returns
     */
    key(key: string, cb: Function): Function;
    /**
     * unmaps a key combination from the console, if no cb is passed then will delete all keys under that key
     * @param key
     * @param cb
     */
    unkey(key: string, cb?: Function): void;
    /**
     * handles errors
     * @param error
     * @param cb
     */
    errorHandler(error: Error, cb?: Function): void;
    /**
     *
     * @returns
     */
    getCurrentTokenSymbol(): string;
    /**
     * returns true if the current network has access to the web3
     * @returns
     */
    hasNetworkAccess(): boolean;
    /**
     *
     */
    compileContracts(deletePrevious?: boolean): Promise<void>;
    /**
     *
     * @returns
     */
    loadWeb3(): Promise<void>;
    /**
     * Returns the current web3 provider for the console, you should use this over getProvider at all times
     * @returns
     */
    getProvider(): JsonRpcProvider;
    /**
     * Returns the URL for the current network (location of JsonRPC)
     * @param network
     * @returns
     */
    getNetworkEndpoint(network?: string): string;
    /**
     * Returns a simple static Json RPC Provider, takes the network you would like to read from. Network must be in the config.
     * @param network
     * @returns
     */
    createStaticProvider(network?: string): StaticJsonRpcProvider;
    /**
     * returns all of the InfinityMint script objects
     * @returns
     */
    getScripts(): InfinityMintScript[];
    /**
     * Will return all the deployment classes associated with a project. If you are looking for just the contract, use getProjectContract
     * @param projectName
     * @param console
     * @returns
     */
    getProjectDeploymentClasses(projectName: string | InfinityMintTempProject | InfinityMintCompiledProject | InfinityMintDeployedProject, gems?: boolean): Promise<Dictionary<InfinityMintDeployment>>;
    loadScripts(): Promise<void>;
    /**
     * logs to console but on the debug pipe
     * @param msg
     * @returns
     */
    debugLog(msg: string): any;
    /**
     * typed emit
     * @param eventName
     * @param eventParameters
     * @param eventType
     * @returns
     */
    emit(eventName: InfinityMintConfigEventKeys | InfinityMintEventKeys | InfinityMintNetworkEventKeys, eventParameters?: any, eventType?: any): boolean;
    /**
     * Similar to gotoWindow except it does require the window to exist in the window manager
     * @param window
     */
    setWindow(window: InfinityMintWindow): Promise<void>;
    /**
     * creates the current window
     * @returns
     */
    private createCurrentWindow;
    /**
     *
     * @param window
     */
    addWindowToList(window: InfinityMintWindow): Promise<void>;
    /**
     * destroys a window, can pass in a window, id, or name
     * @param windowOrIdOrName
     */
    destroyWindow(windowOrIdOrName: InfinityMintWindow | string): Promise<void>;
    /**
     * refreshes all windows
     */
    loadWindows(): Promise<void>;
    /**
     * refreshs the imports in the cache to be used by the window manager. Imports are gathers from the imports folder.
     * @param dontUseCache
     */
    buildImports(dontUseCache?: boolean): Promise<void>;
    /**
     *
     * @param projectOrName
     * @returns
     */
    getProjectPath(projectOrName: any): path.ParsedPath;
    /**
     *
     * @param projectOrName
     * @returns
     */
    getProjectKey(projectOrName: string | KeyValue): string;
    /**
     * Returns the list of paths to projects which have been found, the key is the name of the project followed by its location, you can get the key by using passing a project (or its name) into the method getProjectKey
     * @returns
     */
    getProjectPaths(): Dictionary<path.ParsedPath>;
    /**
     * Loads infinity mint and all of its components, used if we are not drawing console
     */
    private load;
    /**
     *
     * @returns
     */
    getExportSolutions(): Dictionary<InfinityMintExportScript>;
    /**
     *
     * @returns
     */
    getGems(): Dictionary<Gem>;
    /**
     * creates the infinity console UI and other elements
     * @returns
     */
    private createUI;
    /**
     * Initializes the InfinityConsole, calling all necessary functions to get the console up and running. This function is asynchronous and should be called with await.
     * @returns
     */
    initialize(): Promise<void>;
}
export default InfinityConsole;
//# sourceMappingURL=console.d.ts.map