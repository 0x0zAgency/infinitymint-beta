import { PipeFactory, defaultFactory } from './pipes';
import fsExtra from 'fs-extra';
import fs, { PathLike } from 'fs';
import path from 'path';
import os from 'os';
import {
    InfinityMintConfig,
    KeyValue,
    InfinityMintEnvironmentKeys,
    InfinityMintScript,
    InfinityMintGlobalSession,
    InfinityMintTempProject,
    InfinityMintExpressOptions,
    InfinityMintConsoleOptions,
    InfinityMintScriptArguments,
} from './interfaces';
import { generateMnemonic } from 'bip39';
import { HardhatUserConfig } from 'hardhat/types';
import { InfinityMintWindow } from './window';
import { glob } from 'glob';
import { InfinityConsole } from './console';
import { blessedToAnsi } from './colours';
import { getLoadedGems } from './gems';

//uuid stuff
const { v4: uuidv4 } = require('uuid');
//used to ping stuff to see if its online
export const {
    tcpPingPort,
}: {
    tcpPingPort: (
        host: string,
        port: number,
        timeout?: number
    ) => Promise<{
        online: boolean;
    }>;
} = require('tcp-ping-port');

let defaultPipeFactory: PipeFactory;

export const setPipeFactory = (pipeFactory: PipeFactory) => {
    defaultPipeFactory = pipeFactory;
};

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
    think?: (
        window: InfinityMintWindow,
        element: BlessedElement,
        blessed: Blessed
    ) => void;
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
    //base element
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
    intiialize?: (
        window: InfinityMintWindow,
        element: BlessedElement,
        blessed: Blessed
    ) => Promise<void> | void;
    postInitialize?: (
        window: InfinityMintWindow,
        element: BlessedElement,
        blessed: Blessed
    ) => Promise<void> | void;

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
    onHide?: (
        window: InfinityMintWindow,
        element: BlessedElement,
        blessed: Blessed
    ) => void;
    think?: (
        window: InfinityMintWindow,
        element: BlessedElement,
        blessed: Blessed
    ) => void;
    onShow?: (
        window: InfinityMintWindow,
        element: BlessedElement,
        blessed: Blessed
    ) => void;
    onDestroy?: (
        window: InfinityMintWindow,
        element: BlessedElement,
        blessed: Blessed
    ) => void;
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

export let allowExpress = false;
export const setAllowExpressLogs = (value: boolean) => {
    allowExpress = value;
};

let onlyDefault = false;
export const setOnlyDefaultLogs = (value: boolean) => {
    onlyDefault = value;
};

export const stripEmoji = (str: string) => {
    return str.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        '?'
    );
};

/**
 * returns a fresh new uuid
 * @returns
 */
export const getUUID = () => {
    return uuidv4();
};

let allowEmojis = true;
export const setAllowEmojis = (value: boolean) => {
    allowEmojis = value;
};

/**
 * Logs a console message to the current pipe.
 * @param msg
 * @param pipe
 */
export const log = (
    msg: string | object | number | boolean | Buffer,
    pipe?: string
) => {
    try {
        if (typeof msg === 'object') msg = JSON.stringify(msg, null, 2);
        if ((msg as any) instanceof Buffer)
            msg = (msg as any as Buffer).toString('utf8');
    } catch (error) {
    } finally {
        msg = msg.toString();
    }

    if (!allowEmojis) msg = stripEmoji(msg);

    pipe = pipe || 'default';

    if (
        pipe !== 'default' &&
        pipe !== 'debug' &&
        pipe !== 'express' &&
        onlyDefault
    )
        return;
    if (pipe === 'express' && !allowExpress) return;
    msg = msg.toString();

    //another very stupid way to filter out the eth messages from console log, too bad!
    if (
        isAllowPiping &&
        msg.indexOf('<#DONT_LOG_ME$>') === -1 &&
        !directlyOutputLogs
    )
        defaultPipeFactory.log(msg, pipe);

    if (isEnvTrue('PIPE_IGNORE_CONSOLE') || directlyOutputLogs)
        print(
            isScriptMode() && defaultPipeFactory
                ? blessedToAnsi(
                      defaultPipeFactory.addColoursToString(
                          defaultPipeFactory.messageToString(msg)
                      )
                  )
                : require('blessed').stripTags(msg)
        );
};

let exportSolutions = {};
export const findExportSolutions = async () => {
    let config = getConfigFile();
    let roots = [
        cwd() + '/export/',
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
            return root + 'export/';
        }),
    ];
    if (isInfinityMint()) roots.push(cwd() + '/app/export/');
    else roots.push(cwd() + '/node_modules/infinitymint/dist/app/export/');

    let results = await Promise.all(
        roots.map(async (root) => {
            debugLog('Searching for export scripts => ' + root);
            let ts = await new Promise<string[]>((resolve, reject) => {
                safeGlobCB(root + '**/*.ts', (err, files) => {
                    if (err) reject(err);
                    else resolve(files);
                });
            });
            let js = await new Promise<string[]>((resolve, reject) => {
                safeGlobCB(root + '**/*.js', (err, files) => {
                    if (err) reject(err);
                    else resolve(files);
                });
            });

            return [...ts, ...js];
        })
    );

    let flat = results.flat();
    flat = flat.filter(
        (file) =>
            !file.endsWith('.d.ts') && !file.endsWith('.type-extension.ts')
    );
    flat.forEach((file: string, index) => {
        let name = path.parse(file).name;
        debugLog(`[${index}] => Found export ` + file + `<${name}> loading...`);

        if (require.cache[file]) {
            debugLog(
                `\t{gray-fg}Found ` +
                    file +
                    `<${name}> in cache, deleting...{/}`
            );
            delete require.cache[file];
        }

        try {
            exportSolutions[name] = require(file);
            exportSolutions[name] =
                exportSolutions[name].default || exportSolutions[name];
            exportSolutions[name].path = file;
        } catch (error) {
            debugLog(
                `\t{red-fg}Error loading export ` +
                    file +
                    `<${name}>: ${error.message}{/}`
            );
            return;
        }
    });

    return exportSolutions;
};

export const getExportSolutions = () => {
    return exportSolutions;
};

let customBlessedElements: Dictionary<BlessedElement> = {};
export const findCustomBlessedElements = async () => {
    let config = getConfigFile();
    let roots = [cwd() + '/windows/elements/'];
    if (isInfinityMint() && !config?.dev?.useLocalDist)
        roots.push(cwd() + '/app/elements/');
    else if (config?.dev?.useLocalDist)
        roots.push(cwd() + '/dist/app/elements/');
    else roots.push(cwd() + '/node_modules/infinitymint/dist/app/elements/');

    let results = await Promise.all(
        roots.map(async (root) => {
            debugLog('Searching for custom elements => ' + root);
            let ts =
                isTypescript() ||
                !config.settings?.console?.disallowTypescriptElements
                    ? await new Promise<string[]>((resolve, reject) => {
                          safeGlobCB(root + '**/*.ts', (err, files) => {
                              if (err) reject(err);
                              else resolve(files);
                          });
                      })
                    : [];
            let js = await new Promise<string[]>((resolve, reject) => {
                safeGlobCB(root + '**/*.js', (err, files) => {
                    if (err) reject(err);
                    else resolve(files);
                });
            });

            return [...ts, ...js];
        })
    );

    let flat = results.flat();
    //also include gem custom elements
    flat = [
        ...flat,
        ...Object.values(getLoadedGems())
            .map((x) => x.windowComponents)
            .flat(),
    ];
    flat = flat.filter(
        (file) =>
            !file.endsWith('.d.ts') && !file.endsWith('.type-extension.ts')
    );
    flat.forEach((file, index) => {
        let name = file.split('/').pop().split('.')[0];
        debugLog(`[${index}] => Found ` + file + `<${name}> loading...`);

        if (require.cache[file]) {
            debugLog(
                `\t{gray-fg}Found ` +
                    file +
                    `<${name}> in cache, deleting...{/}`
            );
            delete require.cache[file];
        }

        try {
            customBlessedElements[name] = require(file);
            customBlessedElements[name] =
                customBlessedElements[name].default ||
                customBlessedElements[name];
        } catch (error) {
            if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
            console.log(
                `{red-fg}Element Failure: {/red-fg} ${error.message} <${name}>`
            );
        }
    });

    return customBlessedElements;
};

export let isDebugLogDisabled = false;

export const setDebugLogDisabled = (disabled: boolean) => {
    isDebugLogDisabled = disabled;

    if (disabled) warning('Debug log messages are disabled');
};
/**
 * Logs a debug message to the current pipe.
 * @param msg
 * @param pipe
 */
export const debugLog = (msg: string | object | number) => {
    if (isDebugLogDisabled) return;
    log(msg, 'debug');
};

/**
 * Logs a debug message to the current pipe.
 * @param msg
 * @param pipe
 */
export const warning = (msg: string | object | number) => {
    msg = `{yellow-fg}{underline}⚠️{/underline}  {red-fg}${msg}{/}`;
    log(msg, isEnvTrue('PIPE_SEPERATE_WARNINGS') ? 'warning' : 'debug');
};

/**
 *
 * @returns
 */
export const getConsoleOptions = () => {
    let config = getConfigFile();
    return config?.console as InfinityMintConsoleOptions;
};

/**
 * gets the elements padding. use type to get the left, right, up, or down padding.
 * @param element
 * @param type
 * @returns
 */
export const getElementPadding = (
    element: BlessedElement,
    type: 'left' | 'right' | 'up' | 'down'
) => {
    if (!element.padding) return 0;
    if (!element?.padding[type]) return 0;
    return parseInt(element?.padding[type].toString());
};

/**
 * calculates the width of the blessed given elements
 * @param elements
 * @returns
 */
export const calculateWidth = (...elements: BlessedElement[]) => {
    let fin = 0;
    elements
        .map(
            (element) =>
                element.strWidth(element.content) +
                //for the border
                (element.border ? 2 : 0) +
                getElementPadding(element, 'left') +
                getElementPadding(element, 'right')
        )
        .forEach((num) => (fin += num));
    return fin;
};

/**
 * Will return the current session file as stored in memorys. Make sure to specify if to forceRead from the .session file agead.
 * @returns
 */
export const readGlobalSession = (
    forceRead?: boolean
): InfinityMintGlobalSession => {
    if (!fs.existsSync(cwd() + '/.session'))
        return { created: Date.now(), environment: {} };

    if (memorySession && !forceRead) return memorySession;

    try {
        let result = JSON.parse(
            fs.readFileSync(cwd() + '/.session', {
                encoding: 'utf-8',
            })
        );
        memorySession = result;
        return result;
    } catch (error) {
        console.error(error);
    }

    return {
        created: Date.now(),
        environment: {},
    };
};

/**
 * Will replace all seperators in the path with the correct seperator for the current OS before glob.
 * @param path
 * @param cb
 */
export const safeGlobCB = (
    path: string,
    cb: (err: any, files: any[]) => void
) => {
    path = normalizeSeperators(path);
    log(`(safeGlobCB) Searching in => ${path}`, 'glob');
    glob(path, cb as any);
};

/**
 * Will replace all seperators in the path with the correct seperator for the current OS before glob. It also won't throw unless specified.
 * @param path
 */
export const safeGlob = async (
    path: string,
    throwAll: boolean = false,
    shouldLog: boolean = true
): Promise<string[]> => {
    path = normalizeSeperators(path);
    return await new Promise((resolve, reject) => {
        if (shouldLog) log(`(safeGlob) Searching in => ${path}`, 'glob');
        glob(path, (err, files) => {
            if (err) {
                if (throwAll) reject(err);
                else resolve([] as any);
            } else resolve(files);
        });
    });
};

/**
 * delays the current thread for the specified amount of time. Written by the AI
 * @param ms
 * @returns
 */
export const delay = async (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * the most safest safe way to get cwd according to stack overflow
 * @returns
 */
export const cwd = () => {
    let result = path.resolve(process.cwd());
    if (result === '/') return '';
    return result;
};

let scriptMode = false;

export const setScriptMode = (_scriptMode: boolean) => {
    scriptMode = _scriptMode;
};

export const getCustomBlessedElements = () => {
    return customBlessedElements;
};

/**
 * Unlike Console.log log express will also show messages inside of the InfinityConsle
 * @param msg
 */
export const logExpress = (...msg: any[]) => {
    msg = msg.map((x) => {
        if (typeof x === 'object')
            try {
                return JSON.stringify(x, null, 4);
            } catch {
                return x.toString();
            }
        return x;
    });

    log(msg.join('\n'), 'express');
};

export const getExpressConfig = (): InfinityMintExpressOptions => {
    let config: InfinityMintExpressOptions;
    if (
        getConfigFile().express !== undefined &&
        typeof getConfigFile().express !== 'boolean'
    )
        config = getConfigFile().express as InfinityMintExpressOptions;
    else config = {};
    return config;
};

/**
 * Unlike log direct will not turn blessed into ansi codes and simply output directly to the current console.
 * @param any
 */
export const print = (...any: any) => {
    if ((console as any)._log === undefined) console.log(...any);
    else (console as any)._log(...any);
};

/**
 *
 * @param type
 * @param exportLocations
 * @returns
 */
export const getExportLocation = (type: string, exportLocations: any[]) => {
    let result = exportLocations.find((x) => x.type === type);
    let root = exportLocations.find((x) => x.type === 'root');

    if (
        result.useRoot &&
        replaceSeperators(result.location).indexOf(
            replaceSeperators(root.location)
        ) === -1
    )
        result.location = replaceSeperators(
            path.join(root.location, result.location)
        );

    return result;
};

export const mergeObjects = (
    a: { [x: string]: any },
    b: { [x: string]: any }
) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        return [...a, ...b];
    }

    if (typeof a === 'object' && typeof b === 'object') {
        return Object.keys({ ...a, ...b }).reduce((acc, key) => {
            acc[key] = mergeObjects(a[key], b[key]);
            return acc;
        }, {});
    }

    return b;
};

export const getArgumentValues = (
    args: Dictionary<InfinityMintScriptArguments>
) => {
    let result: Dictionary<any> = {};
    Object.keys(args).forEach((key) => {
        result[key] = args[key].value;

        if (result[key] === 'true' && args[key].type === 'boolean')
            result[key] = true;
        else if (result[key] === 'false' && args[key].type === 'boolean')
            result[key] = false;
        else if (
            result[key] &&
            !isNaN(result[key]) &&
            args[key].type === 'number'
        )
            result[key] = Number(result[key]);
    });
    return result;
};

export const isScriptMode = () => {
    return scriptMode;
};

export const createNetworkPipes = (_networks?: any) => {
    let config = getConfigFile();
    let networks = Object.keys(_networks || config.hardhat.networks);
    networks.forEach((network) => {
        let settings = config?.settings?.networks?.[network] || {};
        if (settings.useDefaultPipe) return;
        debugLog('registered pipe for ' + network);
        defaultPipeFactory.registerSimplePipe(network);
    });
};

const parseCache = {};
export const parse = (
    path: PathLike,
    useCache?: boolean,
    encoding?: string
) => {
    if (parseCache[path.toString()] && useCache)
        return parseCache[path.toString()];

    let result = fs.readFileSync(
        cwd() + (path[0] !== '/' ? '/' + path : path),
        {
            encoding: (encoding || 'utf-8') as any,
        }
    );

    let parsedResult: string;
    if (typeof result === typeof Buffer)
        parsedResult = new TextDecoder().decode(result);
    else parsedResult = (result as any).toString();

    return JSON.parse(parsedResult);
};

export let exposeLocalHostMessage = false;
export const setExposeConsoleHostMessage = (value: boolean) => {
    exposeLocalHostMessage = value;
};

/**
 *
 * @param path
 * @param object
 */
export const write = (path: PathLike, object: any) => {
    fs.writeFileSync(
        cwd() + (path[0] !== '/' ? '/' + path : path),
        typeof object === 'object' ? JSON.stringify(object) : object
    );
};

export const networks = {
    ethereum: 1,
    eth: 1,
    mainnet: 1,
    ropsten: 3,
    rinkeby: 4,
    goerli: 5,
    kovan: 42,
    bsc: 56,
    binance: 56,
    polygon: 137,
    matic: 137,
    fantom: 250,
    fantomtestnet: 4002,
    xdai: 100,
    xdaitestnet: 100,
    avalanche: 43114,
    avax: 43114,
    avaxtestnet: 43113,
    harmony: 1666600000,
    harmonytestnet: 1666700000,
    heco: 128,
    hecotestnet: 256,
    arbitrum: 42161,
    arbitrumtestnet: 421611,
    celo: 42220,
    celotestnet: 44787,
    moonbeam: 1287,
    moonbeamtestnet: 1281,
    mumbai: 80001,
    fantomopera: 250,
};

export const blockedGanacheMessages = [
    'eth_blockNumber',
    'eth_chainId',
    'eth_getFilterChanges',
    'eth_getBalance',
    'eth_getTransactionByHash',
    'eth_getTransactionReceipt',
    'eth_getTransactionCount',
    'eth_gasPrice',
    'eth_estimateGas',
];

export const ganacheMessages = [
    'eth_chainId',
    'eth_feeHistory',
    'eth_getBlockByNumber',
    'eth_getBlockByHash',
    'eth_getBlockTransactionCountByNumber',
    'eth_blockNumber',
    'eth_getBalance',
    'eth_estimateGas',
    'eth_gasPrice',
    'eth_sendRawTransaction',
    'eth_getFilterChanges',
    'eth_getTransactionByHash',
    'eth_getTransactionReceipt',
    'eth_getTransactionCount',
    'eth_getCode',
    'eth_getLogs',
    'eth_getStorageAt',
    'eth_getTransactionByBlockNumberAndIndex',
    'eth_getTransactionByBlockHashAndIndex',
    'eth_getBlockTransactionCountByHash',
    'eth_getUncleCountByBlockNumber',
    'eth_getUncleCountByBlockHash',
    'eth_getUncleByBlockNumberAndIndex',
    'eth_getUncleByBlockHashAndIndex',
    'eth_getCompilers',
    'eth_compileLLL',
    'eth_compileSolidity',
    'eth_compileSerpent',
    'eth_newFilter',
    'eth_newBlockFilter',
    'eth_newPendingTransactionFilter',
    'eth_uninstallFilter',
    'net_version',
    'Transaction: ',
    'Contract created: ',
    'Block number: ',
    'Block time: ',
    'Gas usage: ',
];

export let directlyOutputLogs = false;
export const setIgnorePipeFactory = (value: boolean) => {
    directlyOutputLogs = value;
};

export const hasNodeModule = (name: string) => {
    name = name.replace('@', '');
    return fs.existsSync(path.join(cwd(), 'node_modules', name));
};

export const removeBlockedGanacheMessage = (message: string) => {
    let index = blockedGanacheMessages.indexOf(message);
    if (index !== -1) blockedGanacheMessages.splice(index, 1);
};

export const removeGanacheMessage = (message: string) => {
    let index = ganacheMessages.indexOf(message);
    if (index !== -1) ganacheMessages.splice(index, 1);
};

export const addGanacheMessage = (message: string) => {
    if (ganacheMessages.indexOf(message) === -1) ganacheMessages.push(message);
};

export const consoleLogReplacement = (...any: any[]) => {
    any = any.map((val) => {
        if (val instanceof Error) val = val.message;
        if (val && typeof val === 'object' && val.message) val = val.message;

        if (typeof val === 'object')
            try {
                val = JSON.stringify(val, null, 4);
            } catch (error) {}

        val = val.toString();
        return val;
    });
    let msg = any.join('\n');

    //this is a very stupid way to filter out the eth messages from console log, too bad!
    if (ganacheMessages.filter((val) => val === msg).length !== 0) {
        if (blockedGanacheMessages.filter((val) => val === msg).length === 0)
            defaultPipeFactory.log(msg, 'localhost');

        return;
    }

    //another very stupid way to filter out the eth messages from console log, too bad!
    if (
        isAllowPiping &&
        msg.indexOf('<#DONT_LOG_ME$>') === -1 &&
        !directlyOutputLogs
    )
        defaultPipeFactory.log(msg);

    //remove the tag
    msg = msg.replace('<#DONT_LOG_ME$>', '');
    let consoleLog = (console as any)._log || console.log;

    if (isEnvTrue('PIPE_IGNORE_CONSOLE') || directlyOutputLogs)
        consoleLog(
            ...any.map((any) =>
                typeof any === 'string'
                    ? isScriptMode() && defaultPipeFactory
                        ? blessedToAnsi(
                              defaultPipeFactory.addColoursToString(
                                  defaultPipeFactory.messageToString(any)
                              )
                          )
                        : require('blessed').stripTags(any)
                    : any
            )
        );
};

export const directlyLog = (...any: any[]) => {
    any = any.map((val) => {
        if (val instanceof Error) val = val.message;
        if (val && typeof val === 'object' && val.message) val = val.message;
        if (typeof val === 'object')
            try {
                val = JSON.stringify(val, null, 4);
            } catch (error) {}
        val = val.toString();

        return isScriptMode() && defaultPipeFactory
            ? blessedToAnsi(
                  defaultPipeFactory.addColoursToString(
                      defaultPipeFactory.messageToString(val)
                  )
              )
            : require('blessed').stripTags(val);
    });

    print(...any);
};

export const consoleErrorReplacement = (...any: any[]) => {
    let error = any[0];

    if (defaultPipeFactory) {
        //adds it to the log
        defaultPipeFactory.error(error);

        if (isEnvTrue('PIPE_LOG_ERRORS_TO_DEBUG'))
            defaultPipeFactory.pipes['debug'].log(error);

        if (isEnvTrue('PIPE_LOG_ERRORS_TO_DEFAULT'))
            defaultPipeFactory.pipes['default'].log(error);
    }

    if (
        isEnvTrue('PIPE_ECHO_ERRORS') ||
        scriptMode ||
        !isAllowPiping ||
        !defaultFactory
    )
        (console as any)._error(...any);
};

/**
 * Overwrites default behaviour of console.log and console.error
 */
export const overwriteConsoleMethods = () => {
    //overwrite console log
    let __log = console.log;

    if (!(console as any)._log) {
        (console as any)._log = (...any: any[]) => __log(...any);
        console.log = consoleLogReplacement;
    }

    let __error = console.error;

    if (!(console as any)._error) {
        (console as any)._error = (...any: any[]) => __error(...any);
        console.error = consoleErrorReplacement;
    }
};

/**
 * Returns safely the infinity mint config file
 * @returns
 */
let _config = null;
export const getConfigFile = (reload: boolean = false): InfinityMintConfig => {
    if (_config) return _config;

    let checkExtensions = ['mjs', 'js', 'ts', 'cjs', 'json'];

    let configPath = cwd() + '/infinitymint.config';
    for (let i = 0; i < checkExtensions.length; i++) {
        if (fs.existsSync(configPath + '.' + checkExtensions[i])) {
            configPath = configPath + '.' + checkExtensions[i];
            break;
        }
    }

    if (reload && require.cache[configPath]) {
        warning('reloading config file => ' + configPath);
        delete require.cache[configPath];
    }

    console.log('loading config file from ' + configPath);
    let res = require(configPath);
    res = res.default || res;

    let session = readGlobalSession();
    //will replace all the variables in the config with the environment variables or the session variables
    let replaceVariables = (obj: any) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                if (obj[key].startsWith('session:')) {
                    let sessionKey = obj[key].substring(8);

                    if (sessionKey.includes('||')) {
                        let split = sessionKey.split('||');
                        sessionKey = split[0];
                        if (
                            !session.environment[sessionKey] ||
                            session.environment?.[sessionKey]?.trim()
                                ?.length === 0
                        ) {
                            obj[key] = sessionKey.split('||')[1];
                            replaceVariables(obj);
                            return;
                        }
                    }

                    obj[key] = session.environment[sessionKey] || '';
                }
                if (obj[key].startsWith('env:')) {
                    let envKey = obj[key].substring(4);

                    if (envKey.includes('||')) {
                        let split = envKey.split('||');
                        envKey = split[0];

                        if (
                            !process.env[envKey] ||
                            process.env?.[envKey]?.trim()?.length === 0
                        ) {
                            obj[key] = split[1];
                            replaceVariables(obj);
                            return;
                        }
                    }

                    obj[key] = process.env[envKey] || '';
                }
            } else if (typeof obj[key] === 'object') {
                replaceVariables(obj[key]);
            }
        }

        return obj;
    };

    replaceVariables(res);
    _config = res;

    return res as InfinityMintConfig;
};

export const copyContractsFromNodeModule = (
    destination: PathLike,
    source: PathLike
) => {
    if (isInfinityMint()) {
        warning('cannot use node modules in InfinityMint package');
        return;
    }

    if (!fs.existsSync(source))
        throw new Error(
            'please npm i infinitymint and make sure ' + module + 'exists'
        );

    if (fs.existsSync(destination) && isEnvTrue('SOLIDITY_CLEAN_NAMESPACE')) {
        log('cleaning ' + source, 'fs');
        fs.rmdirSync(destination, {
            recursive: true,
            force: true,
        } as any);
    }

    if (!fs.existsSync(destination)) {
        log('copying ' + source + ' to ' + destination, 'fs');
        fsExtra.copySync(source, destination);
        fs.chmodSync(destination, 0o777);
    }
};

export const prepareHardhatConfig = (config: InfinityMintConfig) => {
    if (!config.hardhat.networks) config.hardhat.networks = {};
    //copy ganache settings to localhost settings if ganache exists
    if (!config.hardhat.networks.localhost && config.hardhat.networks.ganache)
        config.hardhat.networks.localhost = config.hardhat.networks.ganache;

    if (!config.hardhat.paths) config.hardhat.paths = {};

    return config;
};

export const cleanCompilations = () => {
    try {
        debugLog('removing ./artifacts');
        fs.rmdirSync(cwd() + '/artifacts', {
            recursive: true,
            force: true,
        } as any);
        debugLog('removing ./cache');
        fs.rmdirSync(cwd() + '/cache', {
            recursive: true,
            force: true,
        } as any);
        debugLog('removing ./typechain-types');
        fs.rmdirSync(cwd() + '.typechain-types', {
            recursive: true,
            force: true,
        } as any);
    } catch (error: any) {
        if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
        warning('unable to delete folder: ' + error?.message || error);
    }
};

export let hasChangedGlobalUserId = false;

/**
 * Loads the infinitymint.config.js and prepares the hardhat response. Only to be used inside of hardhat.config.ts.
 * @returns
 */
export const prepareConfig = () => {
    //else, import the InfinityMint config
    let config = getConfigFile();
    let session = readGlobalSession();

    let flag = true;
    if (session.environment?.globalUserId === undefined) {
        session.environment.globalUserId = uuidv4();
        hasChangedGlobalUserId = fs.existsSync(cwd() + '/.uuid');
        fs.writeFileSync(cwd() + '/.uuid', session.environment.globalUserId);
        flag = false;
    }

    if (flag && fs.existsSync(cwd() + '/.uuid')) {
        let result = fs.readFileSync(cwd() + '/.uuid', {
            encoding: 'utf-8',
        });

        if (result !== session.environment.globalUserId)
            hasChangedGlobalUserId = true;
    }

    if (!config.hardhat.defaultNetwork)
        config.hardhat.defaultNetwork = 'hardhat';

    //
    prepareHardhatConfig(config);

    let solidityModuleFolder =
        cwd() +
        '/node_modules/infinitymint/' +
        (process.env.DEFAULT_SOLIDITY_FOLDER || 'alpha');
    let solidityFolder =
        cwd() + '/' + (process.env.DEFAULT_SOLIDITY_FOLDER || 'alpha');

    if (isEnvTrue('SOLIDITY_USE_NODE_MODULE'))
        copyContractsFromNodeModule(solidityFolder, solidityModuleFolder);

    //if the sources is undefined, then set the solidityFolder to be the source foot
    if (!config.hardhat.paths.sources) {
        //set the sources
        config.hardhat.paths.sources = solidityFolder;

        //delete artifacts folder if namespace changes
        if (
            process.env.DEFAULT_SOLIDITY_FOLDER &&
            session.environment.solidityFolder &&
            session.environment.solidityFolder !==
                process.env.DEFAULT_SOLIDITY_FOLDER
        ) {
            cleanCompilations();
            session.environment.solidityFolder =
                process.env.DEFAULT_SOLIDITY_FOLDER;
        }

        saveGlobalSessionFile(session);
    } else {
        //if we have changed the sources file then clean up old stuff
        if (session.environment.solidityFolder !== config.hardhat.paths.sources)
            cleanCompilations();

        //if it is then set the solidityFolder to be the current value of the sources
        session.environment.solidityFolder = config.hardhat.paths.sources;

        saveGlobalSessionFile(session);
    }

    //set the solidityFolder in the environment if it is undefined
    if (!session.environment.solidityFolder)
        session.environment.solidityFolder =
            process.env.DEFAULT_SOLIDITY_FOLDER || 'alpha';

    //will replace all the variables in the config with the environment variables or the session variables
    let replaceVariables = (obj: any) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                if (obj[key].startsWith('session:')) {
                    let sessionKey = obj[key].substring(8);

                    if (sessionKey.includes('||')) {
                        let split = sessionKey.split('||');
                        sessionKey = split[0];
                        if (
                            !session.environment[sessionKey] ||
                            session.environment?.[sessionKey]?.trim()
                                ?.length === 0
                        ) {
                            obj[key] = sessionKey.split('||')[1];
                            replaceVariables(obj);
                            return;
                        }
                    }

                    obj[key] = session.environment[sessionKey] || '';
                }
                if (obj[key].startsWith('env:')) {
                    let envKey = obj[key].substring(4);

                    if (envKey.includes('||')) {
                        let split = envKey.split('||');
                        envKey = split[0];

                        if (
                            !process.env[envKey] ||
                            process.env?.[envKey]?.trim()?.length === 0
                        ) {
                            obj[key] = split[1];
                            replaceVariables(obj);
                            return;
                        }
                    }

                    obj[key] = process.env[envKey] || '';
                }
            } else if (typeof obj[key] === 'object') {
                replaceVariables(obj[key]);
            }
        }

        return obj;
    };

    replaceVariables(config);

    return config as InfinityMintConfig;
};

export const findWindows = async (roots?: PathLike[]): Promise<string[]> => {
    let config = getConfigFile();
    let searchLocations = [...(roots || [])] as string[];

    if (!isInfinityMint())
        searchLocations.push(
            cwd() + '/node_modules/infinitymint/dist/app/windows/**/*.js'
        );
    searchLocations.push(cwd() + '/windows/**/*.js');

    if (
        isTypescript() ||
        !config.settings?.console?.disallowTypescriptWindows
    ) {
        if (isInfinityMint())
            searchLocations.push(cwd() + '/app/windows/**/*.ts');

        searchLocations.push(cwd() + '/windows/**/*.ts');
    }

    let files = [];

    for (let i = 0; i < searchLocations.length; i++) {
        files = [...files, ...(await findFiles(searchLocations[i]))];
        files = files.filter(
            (x) => !x.endsWith('.d.ts') && !x.endsWith('.type-extension.ts')
        );
    }

    //also add loaded gems windows
    files = [
        ...files,
        ...Object.values(getLoadedGems())
            .map((x) => x.windows)
            .flat(),
    ];
    files = files.filter((x) => !x.endsWith('.d.ts'));

    return files;
};

export const getInfinityMintVersion = () => {
    if (isInfinityMint()) return getPackageJson()?.version || '1.0.0';

    if (!fs.existsSync(cwd() + '/node_modules/infinitymint/package.json'))
        return '1.0.0';

    return (
        JSON.parse(
            fs.readFileSync(cwd() + '/node_modules/infinitymint/package.json', {
                encoding: 'utf-8',
            })
        )?.version || '1.0.0'
    );
};

export const getInfinityMintClientVersion = () => {
    if (
        !fs.existsSync(cwd() + '/node_modules/infinitymint-client/package.json')
    )
        return '1.0.0';

    return (
        JSON.parse(
            fs.readFileSync(
                cwd() + '/node_modules/infinitymint-client/package.json',
                {
                    encoding: 'utf-8',
                }
            )
        ).version || '1.0.0'
    );
};

export const blockGanacheMessage = (msg: string) => {
    blockedGanacheMessages.push(msg);
};

/**
 *
 * @returns the package.json file as an object
 */
export const getPackageJson = () => {
    if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) return {};

    return JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json'), {
            encoding: 'utf-8',
        })
    );
};

/**
 *
 * @param globPattern
 * @returns
 */
export const findFiles = (globPattern: string) => {
    return new Promise<string[]>((resolve, reject) => {
        safeGlobCB(globPattern, (err: Error, matches: string[]) => {
            if (err) throw err;
            //remove duplicates
            matches = matches.filter((v, i, a) => a.indexOf(v) === i);
            resolve(matches);
        });
    });
};

export const isTypescript = () => {
    let session = readGlobalSession();
    return (
        session.environment?.javascript === undefined ||
        session.environment.javascript !== true
    );
};

export const getRandomNumber = (maxNumber: number) => {
    //get a more random number not base on time but on the current process id
    let pid = process.pid;
    let seed = Date.now() + pid;
    let random = seed * Math.random();
    return Math.floor(random % maxNumber);
};

export const getFileImportExtension = () => {
    let session = readGlobalSession();

    if (session.environment?.javascript) return '.js';

    return '.ts';
};

/**
 * looks for scripts inside of cwd /scripts/ and if we aren't infinityMint and the env variable INFINITYMINT_s
 * @param extension
 * @param roots
 * @returns
 */
export const findScripts = async (roots: PathLike[] = []) => {
    let config = getConfigFile();
    roots = roots || [];

    //try and include everything in the scripts folder of the module
    if (!isInfinityMint() && !isEnvTrue('INFINITYMINT_UNINCLUDE_SCRIPTS')) {
        if (config?.dev?.useLocalDist) roots.push(cwd() + '/dist/scripts/');
        else roots.push(cwd() + '/node_modules/infinitymint/dist/scripts/');
    }

    //require JS files always
    roots.push(cwd() + '/scripts/');
    roots = [
        ...roots,
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
            return root + 'scripts/';
        }),
    ];

    let scanned = [];
    for (let i = 0; i < roots.length; i++) {
        scanned = [
            ...scanned,
            ...(await findFiles(roots[i] + '**/*.js')),
            ...(await findFiles(roots[i] + '**/*.cjs')),
            ...(await findFiles(roots[i] + '**/*.mjs')),
        ];

        if (isTypescript() || !config.settings?.scripts?.disallowTypescript) {
            scanned = [...scanned, ...(await findFiles(roots[i] + '**/*.ts'))];
            scanned = scanned.filter(
                (x) => !x.endsWith('.d.ts') && !x.endsWith('.type-extension.ts')
            );
        }
    }

    //also add gems
    scanned = [
        ...scanned,
        ...Object.values(getLoadedGems())
            .map((x) => x.scripts)
            .flat(),
    ];

    //remove duplicates and also hidden scripts
    scanned = scanned.filter((value, index, self) => {
        return (
            self.indexOf(value) === index &&
            [...(config?.settings?.scripts?.hideScripts || [])].filter((x) =>
                value.includes(x)
            ).length === 0
        );
    });

    scanned = scanned.map((fullPath) => {
        return path.parse(fullPath);
    });

    return scanned as path.ParsedPath[];
};

export const toTempProject = (project: any) => {
    return project as InfinityMintTempProject;
};

export const normalizeSeperators = (path: string) => {
    return path.replace(/\\/g, '/');
};

export const replaceSeperators = (path: string, force: boolean = false) => {
    if (os.platform() === 'win32' || force) return path.replace(/\//g, '\\');
    return path;
};

export const isWindows = () => {
    return os.platform() === 'win32';
};

export const makeDirectories = (directoryPath: string) => {
    if (directoryPath.split('/').pop().includes('.'))
        directoryPath = path.dirname(directoryPath);

    let split = directoryPath.split('/');
    let current = '';
    for (let i = 0; i < split.length; i++) {
        current += split[i] + '/';
        if (!fs.existsSync(current)) fs.mkdirSync(current, { recursive: true });
    }
};

/**
 *
 * @param fileName
 * @returns
 */
export const requireWindow = (
    fileName: string,
    infinityConsole?: InfinityConsole,
    keepCache?: boolean
) => {
    if (!fs.existsSync(fileName))
        throw new Error('cannot find script: ' + fileName);

    if (!keepCache && require.cache[fileName]) {
        if (infinityConsole)
            infinityConsole.debugLog('\tdeleting old cache  => ' + fileName);
        else debugLog('\tdeleting old cache  => ' + fileName);
        delete require.cache[fileName];
    } else if (keepCache)
        if (infinityConsole)
            infinityConsole.debugLog('\tkeeping old cache  => ' + fileName);
        else debugLog('\tkeeping old cache  => ' + fileName);

    if (infinityConsole) infinityConsole.debugLog('\trequiring => ' + fileName);
    else debugLog('\trequiring  => ' + fileName);
    let result = require(fileName);
    result = result.default || result;
    result.setFileName(fileName);
    return result;
};

/**
 * Checks cwd for a /script/ folder and looks for a script with that name. if it can't find it will look in this repos deploy scripts and try and return that
 * @param fileName
 * @param root
 * @returns
 */

export const requireScript = async (
    fullPath: string,
    infinityConsole?: InfinityConsole,
    keepCache?: boolean
) => {
    let hasReloaded = false;

    if (!fs.existsSync(fullPath))
        throw new Error('cannot find script: ' + fullPath);

    if (!keepCache && require.cache[fullPath]) {
        infinityConsole
            ? infinityConsole.debugLog(
                  '\tdeleting old script cache => ' + fullPath
              )
            : debugLog('\tdeleting old script cache of ' + fullPath);
        delete require.cache[fullPath];
        hasReloaded = true;
    } else if (keepCache) {
        infinityConsole
            ? infinityConsole.debugLog(
                  '\tkeeping old script cache => ' + fullPath
              )
            : debugLog('\tkeeping old script cache => ' + fullPath);
    }

    let result = await require(fullPath);
    result = result.default || result;
    if (hasReloaded && keepCache && infinityConsole.isTelnet())
        result = Object.create(result); //clone this object if it has been reloaded, and keeping cache, and we are telnet

    result.fileName = fullPath;

    if (infinityConsole && result.events) {
        Object.keys(result.events).forEach((key) => {
            try {
                infinityConsole.getEventEmitter().off(key, result.events[key]);
            } catch (error) {
                warning('could not turn off event emitter: ' + error?.message);
            }

            infinityConsole
                ? infinityConsole.debugLog(
                      '\tnew event registered<EventEmitter>(' + key + ')'
                  )
                : debugLog(
                      '\tnew event registered <EventEmitter>(' + key + ')'
                  );

            infinityConsole.getEventEmitter().on(key, result.events[key]);
        });
    }

    try {
        if (result?.reloaded && hasReloaded) {
            if (infinityConsole)
                infinityConsole.debugLog('\tcalling (reloaded) => ' + fullPath);
            else debugLog('\tcalling (reloaded) => ' + fullPath);
            await (result as InfinityMintScript).reloaded({
                log,
                debugLog,
                infinityConsole,
                eventEmitter: infinityConsole.getEventEmitter(),
                script: result,
            });
        }

        if (result?.loaded) {
            if (infinityConsole)
                infinityConsole.debugLog('\tcalling (loaded) => ' + fullPath);
            else debugLog('\tcalling (loaded) => ' + fullPath);

            await (result as InfinityMintScript).loaded({
                log,
                debugLog,
                infinityConsole,
                eventEmitter: infinityConsole.getEventEmitter(),
                script: result,
            });
        }
    } catch (error) {
        warning('bad reload/loaded: ' + error.message);
    }

    return result as InfinityMintScript;
};

export const isInfinityMint = () => {
    try {
        let packageJson = getPackageJson();
        if (packageJson?.name === 'infinitymint') return true;
    } catch (error) {
        if (isEnvTrue('THROW_ALL_ERRORS')) throw error;

        return false;
    }
};

export let showAllLogs = false;
export const setShowAllLogs = (value: boolean = true) => {
    showAllLogs = value;
};

export let isAllowPiping = false;
export const setAllowPiping = (value: boolean = true) => {
    isAllowPiping = value;
};

/**
 * Takes argv from yargs and returns destructuable object, see {@link app/cli}
 * @param argv
 */
export const getFlags = (argv: any) => {
    if (argv.argv) argv = argv.argv;

    let obj: any = {};
    Object.keys(argv).forEach((k) => {
        let splits = k.split('_');

        if (splits) splits = splits.filter((split) => split.length !== 0);

        let str = splits[0] || k;

        if (splits && splits.length > 1)
            for (let i = 0; i < splits.length; i++) {
                str = str + splits[i][0].toUpperCase() + splits[i].substring(1);
            }

        obj[str] =
            argv?.[k] === true ||
            argv?.[k] === 'true' ||
            (argv?.[k] !== undefined &&
                argv?.[k] !== 'false' &&
                parseInt(argv?.[k]) !== 0 &&
                !isNaN(parseInt(argv?.[k])));
    });
    return obj;
};

/**
 * Loaded when hardhat is being initialized, essentially creates an infinitymint.config if one is not available, generates a new ganache mnemonic and overwrites console.log and console.error to be piped to what ever pipe is currently default.
 *
 * @see {@link app/interfaces.InfinityMintConfig}
 * @see {@link app/pipes.Pipe}
 * @param useJavascript Will return infinitymint.config.js instead of infinitymint.config.ts
 * @param useInternalRequire  Will use require('./app/interfaces') instead of require('infinitymint/dist/app/interfaces')
 * @returns
 */
export const loadInfinityMint = (
    useJavascript?: boolean,
    useInternalRequire?: boolean
) => {
    //set default pipe factory
    setPipeFactory(defaultFactory || new PipeFactory());
    //creates dirs
    createDirs([
        'gems',
        'temp',
        'temp/settings',
        'temp/receipts',
        'temp/pipes',
        'temp/deployments',
        'temp/projects',
        'imports',
        'deployments',
        'deployments/hardhat',
        'deployments/ganache',
        'projects',
        'projects/compiled',
        'projects/deployed',
        'projects/bundles',
        'windows',
        'windows/elements',
        'routes',
        'scripts',
        'deploy',
        'export',
    ]);

    createEnv();
    initializeGanacheMnemonic();

    //try to automatically add module alias
    try {
        let projectJson = getPackageJson();
        if (!projectJson._moduleAliases) {
            projectJson._moduleAliases = {
                '@app': './node_modules/infinitymint/dist/app/',
                '@types': './node_modules/infinitymint/dist/types/',
                '@typechain-types':
                    './node_modules/infinitymint/dist/typechain-types/',
            };
        }
        fs.writeFileSync(
            cwd() + '/package.json',
            JSON.stringify(projectJson, null, 2)
        );
    } catch (error) {}

    //set status of javascript usage
    let session = readGlobalSession();
    session.environment.javascript = useJavascript;
    saveGlobalSessionFile(session);
    createInfinityMintConfig(useJavascript, useInternalRequire);
};

let hasExposed = false;
export const exposeLogs = (reexpose = false) => {
    if (hasExposed && !reexpose) return;

    setExposeConsoleHostMessage(true);
    setIgnorePipeFactory(true);
    setAllowPiping(false);
    hasExposed = true;
};

export const createDirs = (dirs: string[]) => {
    dirs.filter((dir: string) => !fs.existsSync(dir)).forEach((dir) =>
        fs.mkdirSync(cwd() + (dir[0] !== '/' ? '/' + dir : dir))
    );
};

export const readJson = (fileName: string) => {
    return JSON.parse(
        fs.readFileSync(fileName, {
            encoding: 'utf8',
        })
    );
};

export const createEnvFile = (source: any) => {
    source = source?.default || source;

    //dont do node modules
    if (isInfinityMint()) source.SOLIDITY_USE_NODE_MODULE = false;

    let stub = ``;
    Object.keys(source).forEach((key) => {
        stub = `${stub}${key.toUpperCase()}=${
            typeof source[key] === 'string'
                ? '"' + source[key] + '"'
                : source[key]
                ? source[key]
                : ''
        }\n`;
    });

    fs.writeFileSync(cwd() + '/.env', stub);
};

export const getEnv = (key: InfinityMintEnvironmentKeys) => {
    return process?.env[key];
};

export const createEnv = () => {
    if (!fs.existsSync(cwd() + '/.env')) {
        let path = fs.existsSync(cwd() + '/examples/.example.env')
            ? cwd() + '/examples/.example.env'
            : cwd() + '/node_modules/infinitymint/examples/.example.env';

        if (!fs.existsSync(path))
            throw new Error(
                'could not find: ' + path + ' to create .env file with'
            );

        fs.copyFileSync(path, cwd() + '/.env');
        console.log('🧱 Created default .env file');

        //require dotenv if it exists
        if (hasNodeModule('dotenv')) {
            console.log('🧱 Loading .env file');
            require('dotenv').config({
                override: false, //will not override already established environment variables
            });
        }
    }
};

/**
 * creates the pipes (loggers) on the passed pipe factory.
 * @param factory
 */
export const createPipes = (factory: PipeFactory) => {
    let pipes = [
        'debug',
        'imports',
        'gems',
        'windows',
        'glob',
        'fs',
        'express',
        'ipfs',
        'receipts',
    ];

    if (!factory.pipes['default']) factory.registerSimplePipe('default');

    //will log console.log output to the default pipe
    if (isEnvTrue('PIPE_ECHO_DEFAULT'))
        factory.getPipe('default').listen = true;

    //removes debug pipe
    if (isEnvTrue('PIPE_SILENCE_DEBUG')) pipes = pipes.slice(1);

    pipes.forEach((pipe) => {
        if (!factory.pipes[pipe])
            factory.registerSimplePipe(pipe, {
                listen:
                    envExists('PIPE_ECHO_' + pipe.toUpperCase()) &&
                    process.env['PIPE_ECHO_' + pipe.toUpperCase()] === 'true',
                save: true,
            });
    });

    if (isEnvTrue('PIPE_SEPERATE_WARNINGS'))
        factory.registerSimplePipe('warnings', {
            listen: isEnvTrue('PIPE_ECHO_WARNINGS'),
            save: true,
        });
};

export const initializeGanacheMnemonic = () => {
    let session = readGlobalSession();

    if (!isEnvTrue('GANACHE_EXTERNAL'))
        session.environment.ganacheMnemonic = getGanacheMnemonic();
    else {
        if (session.environment.ganacheMnemonic)
            delete session.environment.ganacheMnemonic;

        if (fs.existsSync(cwd() + '/.mnemonics'))
            session.environment.ganacheMnemonic = readJson(
                cwd() + '/.mnemonics'
            ).ganache.mnemonic;
        else
            warning(
                'no ganache mnemonic found, please create a .mnemonics file by running npm run ganache'
            );
    }

    saveGlobalSessionFile(session);
};

/**
 * creates a default infinitymint.config.ts file or a infinitymint.config.js file if useJavascript is true
 * @param useJavascript
 * @param useInternalRequire
 */
export const createInfinityMintConfig = (
    useJavascript?: boolean,
    useInternalRequire?: boolean
) => {
    let filename = useJavascript
        ? 'infinitymint.config.js'
        : 'infinitymint.config.ts';

    if (!fs.existsSync(cwd() + '/' + filename)) return;

    let config: HardhatUserConfig = {
        solidity: {
            version: '0.8.12',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 20,
                },
            },
        },
        paths: {
            tests: './tests',
        },
    };

    let requireStatement = useInternalRequire
        ? './app/interfaces'
        : 'infinitymint/dist/app/interfaces';

    let stub = useJavascript
        ? `\n
		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config = {
			console: true,
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		module.exports = config;`
        : `\n
		import { InfinityMintConfig } from "${requireStatement}";

		//please visit docs.infinitymint.app for a more complete starter configuration file
		const config: InfinityMintConfig = {
			console: true,
			hardhat: ${JSON.stringify(config, null, 2)}
		}
		export default config;`;

    let checkExtensions = ['mjs', 'js', 'ts', 'cjs', 'json'];

    if (
        checkExtensions
            .map((ext) => {
                if (fs.existsSync(cwd() + '/infinitymint.config.' + ext))
                    return true;

                return false;
            })
            .filter((v) => v).length !== 0
    ) {
        return;
    }

    //check if the infinity mint config file has not been created, if it hasn't then create a new config file with the values of the object above

    fs.writeFileSync(cwd() + '/' + filename, stub);
};

/**
 * gets the current folder solc is using
 * @returns
 */
export const getSolidityFolder = () => {
    let session = readGlobalSession();

    return (
        session.environment?.solidityFolder ||
        process.env.DEFAULT_SOLIDITY_FOLDER ||
        'alpha'
    );
};

export const hasHardhatConfig = (extensions = ['ts', 'js', 'mjs', 'cjs']) => {
    let hasConfig = false;
    extensions.forEach((extension) => {
        if (fs.existsSync(process.cwd() + `/hardhat.config.${extension}`))
            hasConfig = true;
    });

    return hasConfig;
};

/**
 * saves a session variable to the .session file
 * @param session
 * @param key
 * @param value
 * @returns
 */
export const saveSessionVariable = (
    session: InfinityMintGlobalSession,
    key: string,
    value: any
) => {
    if (!session.environment) session.environment = {};

    session.environment[key] = value;
    return session;
};

let locations: { [key: string]: string } = {};

export const saveLocations = (_locations?: typeof locations) => {
    fs.writeFileSync(
        cwd() + '/temp/locations.json',
        JSON.stringify(_locations || locations)
    );
};

export const hasLocationForProject = (projectName: string) => {
    return !!locations[projectName];
};

export const readLocations = (useFresh = false) => {
    if (
        (!useFresh && Object.keys(locations).length > 0) ||
        !fs.existsSync(cwd() + '/temp/locations.json')
    )
        return locations;

    locations = JSON.parse(
        fs.readFileSync(cwd() + '/temp/locations.json', {
            encoding: 'utf-8',
        })
    );
    return locations;
};

let memorySession: InfinityMintGlobalSession;
/**
 *
 * @param session Saves the InfinityMint Session
 */
export const saveGlobalSessionFile = (session: InfinityMintGlobalSession) => {
    memorySession = session;
    fs.writeFileSync(cwd() + '/.session', JSON.stringify(session));
};

/**
 * gets ganache mnemonic
 * @returns
 */
export const getGanacheMnemonic = () => {
    if (readGlobalSession()?.environment?.ganacheMnemonic)
        return readGlobalSession()?.environment?.ganacheMnemonic;

    return fs.existsSync(cwd() + '/.mnemonic')
        ? fs.readFileSync(cwd() + '/.mnemonic', {
              encoding: 'utf-8',
          })
        : generateMnemonic();
};

/**
 *
 * @param error Logs an error
 */
export const error = (error: string | Error) => {
    let newError = error instanceof Error ? error : new Error(error);
    if (!isAllowPiping) {
        if ((console as any)._error) (console as any)._error(newError);
        else console.error(newError);
    } else defaultPipeFactory.error(newError);
};

/**
 * Since InfinityMintEnvironmentKeys is need as a type for both isEnvSet and isEnvTrue you can use this one to look any env up
 * @param
 * @returns
 */
export const envExists = (key: string) => {
    return isEnvSet(key as any);
};

/**
 * Used in express routes. This will send a json response that is garunteed to be safe to be serialized
 * @param res
 * @param obj
 */
export const returnSafeJson = (
    res: any,
    obj: any = {},
    status: number = 200
) => {
    res.status(status);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(makeJsonSafe(obj)));
};

export const isGanacheAlive = async (port?: number) => {
    port = parseInt((port || process.env.GANACHE_PORT || 8545).toString());
    return (
        (await tcpPingPort('127.0.0.1', port)).online === true ||
        (await tcpPingPort('localhost', port)).online === true
    );
};

/**
 * non typed version of isEnvTrue
 * @param key
 * @returns
 */
export const envTrue = (key: string) => {
    return isEnvTrue(key as any);
};

/**
 * Makes an object safe to be serialized to json
 * @param obj
 * @returns
 */
export const makeJsonSafe = (obj: Dictionary<any> = {}) => {
    if (obj === null) return {};

    //remove all functions, bigInts and other things which can't be serialized
    let newObj: any = {};
    Object.keys(obj).forEach((key) => {
        if (
            typeof obj[key] === 'function' ||
            typeof obj[key] === 'symbol' ||
            typeof obj[key] === 'undefined'
        )
            return;

        if (typeof obj[key] === 'bigint') {
            newObj[key] = obj[key].toString();
            return;
        }

        if (typeof obj[key] === 'object') {
            if (Array.isArray(obj[key])) {
                newObj[key] = [];
                obj[key].forEach((item: any) => {
                    if (
                        typeof item === 'function' ||
                        typeof item === 'symbol' ||
                        typeof item === 'undefined'
                    )
                        return;

                    if (typeof item === 'bigint') {
                        newObj[key].push(item.toString());
                        return;
                    }

                    if (typeof item === 'object') {
                        newObj[key].push(makeJsonSafe(item));
                    } else newObj[key].push(item);
                });
            } else {
                newObj[key] = makeJsonSafe(obj[key]);
            }
        } else newObj[key] = obj[key];
    });
    return newObj;
};

/**
 * returns if an InfinityMintEnvironmentKeys is set to true in the environment of the current process
 * @param key
 * @returns
 */
export const isEnvTrue = (key: InfinityMintEnvironmentKeys): boolean => {
    return process.env[key] && process.env[key] === 'true';
};

/**
 * returns true if InfinityMintEnvironmentKeys is set in the environment of the current process. Unlike isEnvTrue this will only check if the key is not empty.
 * @param key
 * @returns
 */
export const isEnvSet = (key: InfinityMintEnvironmentKeys): boolean => {
    return process.env[key] && process.env[key]?.trim().length !== 0;
};
