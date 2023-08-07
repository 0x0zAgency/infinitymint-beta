/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { PipeFactory } from './pipes';
import { PathLike } from 'fs';
import path from 'path';
import { InfinityMintConfig, KeyValue, InfinityMintEnvironmentKeys, InfinityMintScript, InfinityMintGlobalSession, InfinityMintTempProject, InfinityMintExpressOptions, InfinityMintConsoleOptions, InfinityMintScriptArguments } from './interfaces';
import { InfinityMintWindow } from './window';
import { InfinityConsole } from './console';
export declare const tcpPingPort: (host: string, port: number, timeout?: number) => Promise<{
    online: boolean;
}>;
export declare const setPipeFactory: (pipeFactory: PipeFactory) => void;
/**
 *
 */
export interface Dictionary<T> {
    [key: string | number]: T;
}
/**
 * a simple interface to describe a vector
 */
export interface Vector {
    x: number;
    y: number;
    z: number;
}
/**
 * a simple interface to describe the import from blessed
 */
export interface Blessed {
    screen: (options: any) => BlessedElement;
    escape: (input: string) => string;
    stripTags: (input: string) => string;
    cleanTags: (input: string) => string;
    box: (options: BlessedElementOptions) => BlessedElement;
    layout: (options: BlessedElementOptions) => BlessedElement;
    loading: (options: BlessedElementOptions) => BlessedElement;
    button: (options: BlessedElementOptions) => BlessedElement;
    list: (options: BlessedElementOptions) => BlessedElement;
    listbox: (options: BlessedElementOptions) => BlessedElement;
    listtable: (options: BlessedElementOptions) => BlessedElement;
    image: (options: BlessedElementOptions) => BlessedElement;
    form: (options: BlessedElementOptions) => BlessedElement;
}
/**
 * describes the padding of a blessed element
 */
export type BlessedElementPadding = {
    top: string | number;
    left: string | number;
    right: string | number;
    bottom: string | number;
};
/**
 * describes the properties of a blessed element, as well as the options you may pass as a parameter in the create element function. This is the base interface for all blessed elements.
 */
export interface BlessedElementOptions extends KeyValue {
    /**
     * will always run the think hook of this blessed element even if it is hidden
     */
    alwaysUpdate?: boolean;
    dontAutoCreate?: boolean;
    /**
     * will make sure the element is always brung to the front
     */
    alwaysFront?: boolean;
    /**
     * will make sure the element is always focus
     */
    alwayFocus?: boolean;
    /**
     * will make sure the element is always at the back
     */
    alwaysBack?: boolean;
    draggable?: boolean;
    tags?: boolean;
    bold?: boolean;
    mouse?: boolean;
    keyboard?: boolean;
    think?: (window: InfinityMintWindow, element: BlessedElement, blessed: Blessed) => void;
    options?: KeyValue;
    width?: string | number;
    height?: string | number;
    padding?: BlessedElementPadding | string | number;
    file?: PathLike;
    parent?: BlessedElement;
    style?: KeyValue;
    scrollbar?: KeyValue;
    label?: string;
    animate?: boolean;
    border?: KeyValue | string;
    content?: any;
}
/**
 * describes a blessed element, this is the base interface for all blessed elements.
 */
export interface BlessedElement extends BlessedElementOptions, KeyValue {
    focus?: Function;
    render?: Function;
    hide?: Function;
    setFront?: Function;
    on?: Function;
    off?: Function;
    setBack?: Function;
    setScroll?: Function;
    removeLabel?: Function;
    base?: string;
    default?: any;
    strWidth?: any;
    /**
     * Doesn't appear to function
     */
    pushLine?: Function;
    disableMouse?: Function;
    instantlyCreate?: boolean;
    instantlyAppend?: boolean;
    /**
     * Returns the current window this element is assigned too. Will be undefined if the element has not been registered with an InfinityMintWindow
     */
    window?: InfinityMintWindow;
    disableKeys?: Function;
    setItems?: Function;
    enterSelected?: Function;
    enableKeys?: Function;
    intiialize?: (window: InfinityMintWindow, element: BlessedElement, blessed: Blessed) => Promise<void> | void;
    postInitialize?: (window: InfinityMintWindow, element: BlessedElement, blessed: Blessed) => Promise<void> | void;
    /**
     * true if the window is hidden
     */
    hidden?: boolean;
    /**
     * ture if the window should hide when the window is shown again, applied to elements which are hidden initially when the window is initialized and used to keep them hidden when we reshow the window later on.
     */
    shouldUnhide?: boolean;
    setContent?: Function;
    setLabel?: Function;
    enableMouse?: Function;
    enableInput?: Function;
    enableDrag?: Function;
    disableDrag?: Function;
    show?: Function;
    toggle?: Function;
    destroy?: Function;
    free?: Function;
    /**
     * Doesn't appear to function
     */
    setLine?: (line: number, text: string) => void;
    /**
     * Doesn't appear to function
     */
    insertLine?: (line: number, text: string) => void;
    key?: Function;
    onceKey?: (key: string[], callback: Function) => void;
    onScreenEvent?: (eventName: string, callback: Function) => void;
    onHide?: (window: InfinityMintWindow, element: BlessedElement, blessed: Blessed) => void;
    think?: (window: InfinityMintWindow, element: BlessedElement, blessed: Blessed) => void;
    onShow?: (window: InfinityMintWindow, element: BlessedElement, blessed: Blessed) => void;
    onDestroy?: (window: InfinityMintWindow, element: BlessedElement, blessed: Blessed) => void;
    unkey?: Function;
}
/**
 * used in the InfinityMintWindow. Is the bounding box of the current window relative to the current terminal size (see {@link app/window.InfinityMintWindow}).
 */
export interface Rectangle {
    startX: number | string;
    endX: number | string;
    startY: number | string;
    endY: number | string;
    width: number | string;
    height: number | string;
    z: number;
}
export declare let allowExpress: boolean;
export declare const setAllowExpressLogs: (value: boolean) => void;
export declare const setOnlyDefaultLogs: (value: boolean) => void;
export declare const stripEmoji: (str: string) => string;
/**
 * returns a fresh new uuid
 * @returns
 */
export declare const getUUID: () => any;
export declare const setAllowEmojis: (value: boolean) => void;
/**
 * Logs a console message to the current pipe.
 * @param msg
 * @param pipe
 */
export declare const log: (msg: string | object | number | boolean | Buffer, pipe?: string) => void;
export declare const findExportSolutions: () => Promise<{}>;
export declare const getExportSolutions: () => {};
export declare const findCustomBlessedElements: () => Promise<Dictionary<BlessedElement>>;
export declare let isDebugLogDisabled: boolean;
export declare const setDebugLogDisabled: (disabled: boolean) => void;
/**
 * Logs a debug message to the current pipe.
 * @param msg
 * @param pipe
 */
export declare const debugLog: (msg: string | object | number) => void;
/**
 * Logs a debug message to the current pipe.
 * @param msg
 * @param pipe
 */
export declare const warning: (msg: string | object | number) => void;
/**
 *
 * @returns
 */
export declare const getConsoleOptions: () => InfinityMintConsoleOptions;
/**
 * gets the elements padding. use type to get the left, right, up, or down padding.
 * @param element
 * @param type
 * @returns
 */
export declare const getElementPadding: (element: BlessedElement, type: 'left' | 'right' | 'up' | 'down') => number;
/**
 * calculates the width of the blessed given elements
 * @param elements
 * @returns
 */
export declare const calculateWidth: (...elements: BlessedElement[]) => number;
/**
 * Will return the current session file as stored in memorys. Make sure to specify if to forceRead from the .session file agead.
 * @returns
 */
export declare const readGlobalSession: (forceRead?: boolean) => InfinityMintGlobalSession;
/**
 * Will replace all seperators in the path with the correct seperator for the current OS before glob.
 * @param path
 * @param cb
 */
export declare const safeGlobCB: (path: string, cb: (err: any, files: any[]) => void) => void;
/**
 * Will replace all seperators in the path with the correct seperator for the current OS before glob. It also won't throw unless specified.
 * @param path
 */
export declare const safeGlob: (path: string, throwAll?: boolean, shouldLog?: boolean) => Promise<string[]>;
/**
 * delays the current thread for the specified amount of time. Written by the AI
 * @param ms
 * @returns
 */
export declare const delay: (ms: number) => Promise<unknown>;
/**
 * the most safest safe way to get cwd according to stack overflow
 * @returns
 */
export declare const cwd: () => string;
export declare const setScriptMode: (_scriptMode: boolean) => void;
export declare const getCustomBlessedElements: () => Dictionary<BlessedElement>;
/**
 * Unlike Console.log log express will also show messages inside of the InfinityConsle
 * @param msg
 */
export declare const logExpress: (...msg: any[]) => void;
export declare const getExpressConfig: () => InfinityMintExpressOptions;
/**
 * Unlike log direct will not turn blessed into ansi codes and simply output directly to the current console.
 * @param any
 */
export declare const print: (...any: any) => void;
/**
 *
 * @param type
 * @param exportLocations
 * @returns
 */
export declare const getExportLocation: (type: string, exportLocations: any[]) => any;
export declare const mergeObjects: (a: {
    [x: string]: any;
}, b: {
    [x: string]: any;
}) => {
    [x: string]: any;
};
export declare const getArgumentValues: (args: Dictionary<InfinityMintScriptArguments>) => Dictionary<any>;
export declare const isScriptMode: () => boolean;
export declare const createNetworkPipes: (_networks?: any) => void;
export declare const parse: (path: PathLike, useCache?: boolean, encoding?: string) => any;
export declare let exposeLocalHostMessage: boolean;
export declare const setExposeConsoleHostMessage: (value: boolean) => void;
/**
 *
 * @param path
 * @param object
 */
export declare const write: (path: PathLike, object: any) => void;
export declare const networks: {
    ethereum: number;
    eth: number;
    mainnet: number;
    ropsten: number;
    rinkeby: number;
    goerli: number;
    kovan: number;
    bsc: number;
    binance: number;
    polygon: number;
    matic: number;
    fantom: number;
    fantomtestnet: number;
    xdai: number;
    xdaitestnet: number;
    avalanche: number;
    avax: number;
    avaxtestnet: number;
    harmony: number;
    harmonytestnet: number;
    heco: number;
    hecotestnet: number;
    arbitrum: number;
    arbitrumtestnet: number;
    celo: number;
    celotestnet: number;
    moonbeam: number;
    moonbeamtestnet: number;
    mumbai: number;
    fantomopera: number;
};
export declare const blockedGanacheMessages: string[];
export declare const ganacheMessages: string[];
export declare let directlyOutputLogs: boolean;
export declare const setIgnorePipeFactory: (value: boolean) => void;
export declare const hasNodeModule: (name: string) => boolean;
export declare const removeBlockedGanacheMessage: (message: string) => void;
export declare const removeGanacheMessage: (message: string) => void;
export declare const addGanacheMessage: (message: string) => void;
export declare const consoleLogReplacement: (...any: any[]) => void;
export declare const directlyLog: (...any: any[]) => void;
export declare const consoleErrorReplacement: (...any: any[]) => void;
/**
 * Overwrites default behaviour of console.log and console.error
 */
export declare const overwriteConsoleMethods: () => void;
export declare const getConfigFile: (reload?: boolean) => InfinityMintConfig;
export declare const copyContractsFromNodeModule: (destination: PathLike, source: PathLike) => void;
export declare const prepareHardhatConfig: (config: InfinityMintConfig) => InfinityMintConfig;
export declare const cleanCompilations: () => void;
export declare let hasChangedGlobalUserId: boolean;
/**
 * Loads the infinitymint.config.js and prepares the hardhat response. Only to be used inside of hardhat.config.ts.
 * @returns
 */
export declare const prepareConfig: () => InfinityMintConfig;
export declare const findWindows: (roots?: PathLike[]) => Promise<string[]>;
export declare const getInfinityMintVersion: () => any;
export declare const getInfinityMintClientVersion: () => any;
export declare const blockGanacheMessage: (msg: string) => void;
/**
 *
 * @returns the package.json file as an object
 */
export declare const getPackageJson: () => any;
/**
 *
 * @param globPattern
 * @returns
 */
export declare const findFiles: (globPattern: string) => Promise<string[]>;
export declare const isTypescript: () => boolean;
export declare const getRandomNumber: (maxNumber: number) => number;
export declare const getFileImportExtension: () => ".ts" | ".js";
/**
 * looks for scripts inside of cwd /scripts/ and if we aren't infinityMint and the env variable INFINITYMINT_s
 * @param extension
 * @param roots
 * @returns
 */
export declare const findScripts: (roots?: PathLike[]) => Promise<path.ParsedPath[]>;
export declare const toTempProject: (project: any) => InfinityMintTempProject;
export declare const normalizeSeperators: (path: string) => string;
export declare const replaceSeperators: (path: string, force?: boolean) => string;
export declare const isWindows: () => boolean;
export declare const makeDirectories: (directoryPath: string) => void;
/**
 *
 * @param fileName
 * @returns
 */
export declare const requireWindow: (fileName: string, infinityConsole?: InfinityConsole, keepCache?: boolean) => any;
/**
 * Checks cwd for a /script/ folder and looks for a script with that name. if it can't find it will look in this repos deploy scripts and try and return that
 * @param fileName
 * @param root
 * @returns
 */
export declare const requireScript: (fullPath: string, infinityConsole?: InfinityConsole, keepCache?: boolean) => Promise<InfinityMintScript>;
export declare const isInfinityMint: () => boolean;
export declare let showAllLogs: boolean;
export declare const setShowAllLogs: (value?: boolean) => void;
export declare let isAllowPiping: boolean;
export declare const setAllowPiping: (value?: boolean) => void;
/**
 * Takes argv from yargs and returns destructuable object, see {@link app/cli}
 * @param argv
 */
export declare const getFlags: (argv: any) => any;
/**
 * Loaded when hardhat is being initialized, essentially creates an infinitymint.config if one is not available, generates a new ganache mnemonic and overwrites console.log and console.error to be piped to what ever pipe is currently default.
 *
 * @see {@link app/interfaces.InfinityMintConfig}
 * @see {@link app/pipes.Pipe}
 * @param useJavascript Will return infinitymint.config.js instead of infinitymint.config.ts
 * @param useInternalRequire  Will use require('./app/interfaces') instead of require('infinitymint/dist/app/interfaces')
 * @returns
 */
export declare const loadInfinityMint: (useJavascript?: boolean, useInternalRequire?: boolean) => void;
export declare const exposeLogs: (reexpose?: boolean) => void;
export declare const createDirs: (dirs: string[]) => void;
export declare const readJson: (fileName: string) => any;
export declare const createEnvFile: (source: any) => void;
export declare const getEnv: (key: InfinityMintEnvironmentKeys) => string;
export declare const createEnv: () => void;
/**
 * creates the pipes (loggers) on the passed pipe factory.
 * @param factory
 */
export declare const createPipes: (factory: PipeFactory) => void;
export declare const initializeGanacheMnemonic: () => void;
/**
 * creates a default infinitymint.config.ts file or a infinitymint.config.js file if useJavascript is true
 * @param useJavascript
 * @param useInternalRequire
 */
export declare const createInfinityMintConfig: (useJavascript?: boolean, useInternalRequire?: boolean) => void;
/**
 * gets the current folder solc is using
 * @returns
 */
export declare const getSolidityFolder: () => any;
export declare const hasHardhatConfig: (extensions?: string[]) => boolean;
/**
 * saves a session variable to the .session file
 * @param session
 * @param key
 * @param value
 * @returns
 */
export declare const saveSessionVariable: (session: InfinityMintGlobalSession, key: string, value: any) => InfinityMintGlobalSession;
declare let locations: {
    [key: string]: string;
};
export declare const saveLocations: (_locations?: typeof locations) => void;
export declare const hasLocationForProject: (projectName: string) => boolean;
export declare const readLocations: (useFresh?: boolean) => {
    [key: string]: string;
};
/**
 *
 * @param session Saves the InfinityMint Session
 */
export declare const saveGlobalSessionFile: (session: InfinityMintGlobalSession) => void;
/**
 * gets ganache mnemonic
 * @returns
 */
export declare const getGanacheMnemonic: () => string;
/**
 *
 * @param error Logs an error
 */
export declare const error: (error: string | Error) => void;
/**
 * Since InfinityMintEnvironmentKeys is need as a type for both isEnvSet and isEnvTrue you can use this one to look any env up
 * @param
 * @returns
 */
export declare const envExists: (key: string) => boolean;
/**
 * Used in express routes. This will send a json response that is garunteed to be safe to be serialized
 * @param res
 * @param obj
 */
export declare const returnSafeJson: (res: any, obj?: any, status?: number) => void;
export declare const isGanacheAlive: (port?: number) => Promise<boolean>;
/**
 * non typed version of isEnvTrue
 * @param key
 * @returns
 */
export declare const envTrue: (key: string) => boolean;
/**
 * Makes an object safe to be serialized to json
 * @param obj
 * @returns
 */
export declare const makeJsonSafe: (obj?: Dictionary<any>) => any;
/**
 * returns if an InfinityMintEnvironmentKeys is set to true in the environment of the current process
 * @param key
 * @returns
 */
export declare const isEnvTrue: (key: InfinityMintEnvironmentKeys) => boolean;
/**
 * returns true if InfinityMintEnvironmentKeys is set in the environment of the current process. Unlike isEnvTrue this will only check if the key is not empty.
 * @param key
 * @returns
 */
export declare const isEnvSet: (key: InfinityMintEnvironmentKeys) => boolean;
export {};
//# sourceMappingURL=helpers.d.ts.map