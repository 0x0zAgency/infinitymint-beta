import { defaultFactory, PipeFactory } from './pipes';
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
    InfinityMintEventEmitter,
    InfinityMintScriptArguments,
    InfinityMintGemScript,
    InfinityMintTempProject,
    InfinityMintScriptParameters,
    InfinityMintProject,
    InfinityMintExpressOptions,
    InfinityMintConsoleOptions,
} from './interfaces';
import { generateMnemonic } from 'bip39';
import { HardhatUserConfig } from 'hardhat/types';
import { InfinityMintWindow } from './window';
import {
    registerGasPriceHandler,
    registerTokenPriceHandler,
} from './gasAndPrices';
import { glob } from 'glob';
import { InfinityConsole } from './console';
import {
    getCurrentProject,
    getCurrentProjectPath,
    getProjectFullName,
    saveTempCompiledProject,
    saveTempDeployedProject,
} from './projects';
import { blessedToAnsi } from './colours';
import { getLoadedGems } from './gems';

//uuid stuff
const { v4: uuidv4 } = require('uuid');
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

let allowExpress = false;
export const setAllowExpress = (value: boolean) => {
    allowExpress = value;
};

let onlyDefault = false;

export const setOnlyDefault = (value: boolean) => {
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

let allowEmojis = false;

export const setAllowEmojis = (value: boolean) => {
    allowEmojis = value;
};

/**
 * Logs a console message to the current pipe.
 * @param msg
 * @param pipe
 */
export const log = (msg: string | object | number | boolean, pipe?: string) => {
    try {
        if (typeof msg === 'object') msg = JSON.stringify(msg, null, 2);
    } catch (error) {
        logDirect(msg);
        return;
    }

    if (typeof msg === 'number' || typeof msg === 'boolean')
        msg = msg.toString();
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
    if (isAllowPiping) defaultFactory.log(msg, pipe);
    if (!isAllowPiping || isEnvTrue('PIPE_IGNORE_CONSOLE')) {
        if (!(console as any)._log) {
            console.log(
                blessedToAnsi(
                    defaultFactory
                        ? defaultFactory.addColoursToString(
                              defaultFactory.messageToString(msg)
                          )
                        : msg
                )
            );
        } else
            (console as any)._log(
                blessedToAnsi(
                    defaultFactory
                        ? defaultFactory.addColoursToString(
                              defaultFactory.messageToString(msg)
                          )
                        : msg
                )
            );
    }
};

let templates = {};
export const findTemplates = async () => {
    let config = getConfigFile();
    let roots = [cwd() + '/templates/'];
    if (isInfinityMint()) roots.push(cwd() + '/app/templates/');
    else roots.push(cwd() + '/node_modules/infinitymint/dist/app/templates/');

    let results = await Promise.all(
        roots.map(async (root) => {
            debugLog('Searching for templates => ' + root);
            let ts =
                isTypescript() ||
                !config.settings?.templates?.disallowTypescript
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
    flat = flat.filter((file) => !file.endsWith('.d.ts'));
    flat.forEach((file: string, index) => {
        let name = (file.split('/').pop() as string).split('.')[0];

        debugLog(
            `[${index}] => Found template ` + file + `<${name}> loading...`
        );

        if (require.cache[file]) {
            debugLog(
                `\t{gray-fg}Found ` +
                    file +
                    `<${name}> in cache, deleting...{/}`
            );
            delete require.cache[file];
        }

        try {
            templates[name] = require(file);
            templates[name] = templates[name].default || templates[name];
            templates[name].path = file;
        } catch (error) {
            debugLog(
                `\t{red-fg}Error loading template ` +
                    file +
                    `<${name}>: ${error.message}{/}`
            );
            return;
        }
    });

    return templates;
};

export const getTemplates = () => {
    return templates;
};

let exportSolutions = {};
export const findExportSolutions = async () => {
    let roots = [cwd() + '/export/'];
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
    flat = flat.filter((file) => !file.endsWith('.d.ts'));
    flat.forEach((file: string, index) => {
        let name = (file.split('/').pop() as string).split('.')[0];

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
    flat = flat.filter((file) => !file.endsWith('.d.ts'));
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
            log(
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
export const warning = (
    msg: string | object | number,
    direct: boolean = true
) => {
    msg = `{yellow-fg}{underline}⚠️{/underline}  {red-fg}${msg}{/}`;
    if (direct) logDirect(msg);
    else log(msg, isEnvTrue('PIPE_SEPERATE_WARNINGS') ? 'warning' : 'debug');
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
        defaultFactory.error(error);
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
export const safeGlob = async (path: string, throwAll: boolean = false) => {
    path = normalizeSeperators(path);
    await new Promise((resolve, reject) => {
        log(`(safeGlob) Searching in => ${path}`, 'glob');
        glob(path, (err, files) => {
            if (err) {
                if (throwAll) reject(err);
                else resolve([]);
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

export const setScriptMode = (scriptMode: boolean) => {
    scriptMode = scriptMode;
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
        try {
            if (typeof x === 'object') return JSON.stringify(x);
        } catch (error) {
            return '[object]';
        }
        return x;
    });

    if (!isAllowPiping) {
        print(msg.join(' '));
    } else log(msg.join(' '), 'express');
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

export const logDefault = (...msg: any[]) => {
    msg = msg.map((x) => {
        try {
            if (typeof x === 'object') return JSON.stringify(x);
        } catch (error) {
            return '[object]';
        }
        return x;
    });

    if (!isAllowPiping) {
        print(msg.join(' '));
    } else log(msg.join(' '), 'default');
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
 * will ignore the piper and log directly to console, very useful when trying to debug wtf went wrong with something. Because who need
 * line by line debug any?
 * @param msg
 */
export const logDirect = (...any: any) => {
    let msg = any.length === 1 ? any[0] : any.join(' ');
    if (typeof msg === 'boolean')
        msg ? (msg = '{green-fg}true{green-fg/}') : '{red-fg}false{/red-fg}';
    if (msg === undefined) msg === '{red-fg}undefined{/red-fg}';
    if (msg === null) msg === '{yellow-fg}null{/yellow-fg}';
    if (msg instanceof Error) msg = msg.message || msg.stack || msg;
    try {
        if (typeof msg === 'object') msg = JSON.stringify(msg, null, 2);
    } catch (error) {
        //not a json serializable object so just ignore
    }

    if (typeof msg === 'string') msg = blessedToAnsi(msg);
    print(msg);
};

let actionProject: InfinityMintTempProject | undefined;
let actionScript: InfinityMintScriptParameters | undefined;
let actionType: 'deploy' | 'compile' | 'deployed' | 'compiled';
/**
 * used by the prepare function to set the action project. You should not use this function.
 * @param project
 */
export const setActionProject = (project: InfinityMintTempProject) => {
    actionProject = project;
};

/**
 * allows you to use action instead of having to use stage
 * @param _stage
 * @param call
 * @param cleanup
 */
export const prepare = async (
    project: InfinityMintTempProject,
    script: InfinityMintScriptParameters,
    type: 'deploy' | 'compile' | 'deployed' | 'compiled'
) => {
    actionScript = script;
    actionType = type;

    if (actionType === 'compiled') actionType = 'compile';
    if (actionType === 'deployed') actionType = 'deploy';

    if (!project.stages) project.stages = {};
    setActionProject(project);
};

/**
 * must be called after prepare. Allows you to run a stage. A stage is a block of code that can be skipped or the execution can retry from the point this stage is at. This can be used to run a stage always. You may use the action function to run a stage once
 * @param _stage
 * @param call
 * @param cleanup
 */
export const always = async (
    _stage: string,
    call: (isFirstTime?: boolean) => Promise<void>,
    cleanup?: (isFirstTime?: boolean) => Promise<void>,
    action?: 'deploy' | 'compile'
) => {
    return await stage(
        _stage,
        actionProject!,
        call,
        action || actionType,
        actionScript,
        true,
        cleanup
    );
};

/**
 * you must call prepare before using this function. Allows you to run a stage. A stage is a block of code that can be skipped or the execution can retry from the point this stage is at. This can be used with the always function to run a stage always.
 * @param _stage
 * @param call
 * @param cleanup
 * @param action
 * @returns
 */
export const action = async (
    _stage: string,
    call: (isFirstTime?: boolean) => Promise<void>,
    cleanup?: (isFirstTime?: boolean) => Promise<void>,
    action?: 'deploy' | 'compile' | 'deployed' | 'compiled'
) => {
    return await stage(
        _stage,
        actionProject!,
        call,
        action || actionType,
        actionScript,
        false,
        cleanup
    );
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

    if (result.useRoot && result.location.indexOf(root.location) === -1)
        result.location = path.join(root.location, result.location);

    return result;
};

/**
 * runs a stage, a stage is a block of code that can be skipped if the stage has already been run or ran always if alwaysRun is set to true. A simpler way to use this is to use the action function. This requires you to call prepare before using this function. Prepare is a function that sets the project, script, and type for the action function as well as the always function.
 * @param stage
 * @param project
 * @param call
 * @param type
 * @param infinityConsole
 * @param alwaysRun
 * @returns
 */
export const stage = async (
    stage: string,
    project: InfinityMintTempProject,
    call: (isFirstTime?: boolean) => Promise<void>,
    type?: 'compile' | 'deploy' | 'deployed' | 'compiled',
    script?: InfinityMintScriptParameters,
    alwaysRun?: boolean,
    cleanup?: (isFirstTime?: boolean) => Promise<void>
): Promise<Error | Error[] | boolean> => {
    type = type || 'compile';

    if (type === 'compiled') type = 'compile';
    if (type === 'deployed') type = 'deploy';
    if (!project.stages) project.stages = {};
    let eventName = 'stage' + (stage[0].toUpperCase() + stage.substring(1));
    if (script?.infinityConsole)
        script?.infinityConsole.debugLog('executing stage => ' + stage);
    else debugLog('executing stage => ' + stage);

    if (script?.infinityConsole) script.infinityConsole.emitAny(eventName);

    if (project?.stages[stage] === true && !alwaysRun) {
        if (script?.infinityConsole)
            script.infinityConsole.debugLog(
                '\t{cyan-fg}Skipped{/cyan-fg} => ' + stage
            );
        else debugLog('\t{cyan-fg}Skipped{/cyan-fg} => ' + stage);

        if (script?.infinityConsole)
            script.infinityConsole.emitAny(eventName + 'Skipped');
        return true;
    }

    let isFirstTime = typeof project.stages[stage] !== 'object';
    project.stages[stage] = false;

    if (type === 'compile') saveTempCompiledProject(project);
    else saveTempDeployedProject(project);

    try {
        if (script?.infinityConsole)
            script?.infinityConsole.emitAny(eventName + 'Pre', isFirstTime);

        await new Promise((resolve, reject) => {
            setTimeout(async () => {
                await call(isFirstTime).catch(reject);
                resolve(true);
            }, 100);
        });

        project.stages[stage] = true;

        if (script?.infinityConsole)
            script.infinityConsole.emitAny(eventName + 'Post', isFirstTime);
        if (type === 'compile') saveTempCompiledProject(project);
        else saveTempDeployedProject(project);

        if (script?.infinityConsole)
            script?.infinityConsole.debugLog(
                '\t{green-fg}Success{/green-fg} => ' + stage
            );
        else debugLog('\t{green-fg}Success{/green-fg} => ' + stage);
        if (script?.infinityConsole)
            script?.infinityConsole.emitAny(eventName + 'Success');
        return true;
    } catch (error) {
        project.stages[stage] = error;

        try {
            if (type === 'compile') saveTempCompiledProject(project);
            else saveTempDeployedProject(project);
        } catch (_error) {
            warning('could not save project');
        }

        if (script?.infinityConsole)
            script?.infinityConsole.debugLog('\t{red-fg}Failure{/red-fg}');
        else debugLog('\t{red-fg}Failure{/red-fg} => ' + stage);
        if (script?.infinityConsole)
            script?.infinityConsole.emitAny(eventName + 'Failure', isFirstTime);

        if (cleanup) await cleanup();

        return error;
    }
};

export const isScriptMode = () => {
    return scriptMode;
};

export const registerNetworkLogs = (_networks?: any) => {
    let config = getConfigFile();
    let networks = Object.keys(_networks || config.hardhat.networks);
    networks.forEach((network) => {
        let settings = config?.settings?.networks?.[network] || {};
        if (settings.useDefaultPipe) return;
        debugLog('registered pipe for ' + network);
        defaultFactory.registerSimplePipe(network);
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
    log('writing ' + path, 'fs');
    fs.writeFileSync(
        cwd() + (path[0] !== '/' ? '/' + path : path),
        typeof object === 'object' ? JSON.stringify(object) : object
    );
};

export const blockedMessages = [
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
    'Contract Created: ',
];

export let directlyOutputLogs = false;
export const setDirectlyOutputLogs = (value: boolean) => {
    directlyOutputLogs = value;
};

export const removeBlockedMessage = (message: string) => {
    let index = blockedMessages.indexOf(message);
    if (index !== -1) blockedMessages.splice(index, 1);
};

export const addBlockedMessage = (message: string) => {
    if (blockedMessages.indexOf(message) === -1) blockedMessages.push(message);
};

export const consoleLogReplacement = (...any: any[]) => {
    let msg = any[0] || '';
    if (msg instanceof Error) msg = msg.message;
    if (typeof msg === 'object') msg = JSON.stringify(msg, null, 2);
    msg = msg.toString();

    let pipe = any[1] || defaultFactory.currentPipeKey || 'default';

    //this is a very stupid way to filter out the eth messages from console log, too bad!
    if (blockedMessages.some((m) => msg.indexOf(m) !== -1)) {
        pipe = 'localhost';
        defaultFactory.log(msg, pipe);
        return;
    }

    if (
        isAllowPiping &&
        msg.indexOf('<#DONT_LOG_ME$>') === -1 &&
        !directlyOutputLogs
    )
        defaultFactory.log(msg, pipe);

    msg = msg.replace('<#DONT_LOG_ME$>', '');
    //do normal log as well
    if (
        pipe !== 'localhost' &&
        (isEnvTrue('PIPE_IGNORE_CONSOLE') || directlyOutputLogs)
    ) {
        ((console as any)._log || (console as any).log)(
            scriptMode
                ? blessedToAnsi(
                      defaultFactory.addColoursToString(
                          defaultFactory.messageToString(msg)
                      )
                  )
                : require('blessed').cleanTags(msg),
            ...any.slice(1).filter((a: any) => a !== pipe)
        );
    }
};

export const consoleErrorReplacement = (...any: any[]) => {
    let error = any[0];
    //adds it to the log
    defaultFactory.error(error);

    if (isEnvTrue('PIPE_LOG_ERRORS_TO_DEBUG'))
        defaultFactory.pipes['debug'].log(error);

    if (isEnvTrue('PIPE_LOG_ERRORS_TO_DEFAULT'))
        defaultFactory.pipes['default'].log(error);

    if (isEnvTrue('PIPE_ECHO_ERRORS') || scriptMode || !isAllowPiping)
        (console as any)._error(...any);
};

/**
 * Overwrites default behaviour of console.log and console.error
 */
export const ovewriteConsoleMethods = () => {
    //overwrite console log
    let __log = console.log;
    (console as any)._log = (...any: any[]) => __log(...any);
    console.log = consoleLogReplacement;

    let __error = console.error;
    (console as any)._error = (...any: any[]) => __error(...any);
    console.error = consoleErrorReplacement;
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

    logDirect('loading config file from ' + configPath);
    let res = require(configPath);
    res = res.default || res;
    _config = res;
    return res as InfinityMintConfig;
};

export const copyContractsFromNodeModule = (
    destination: PathLike,
    source: PathLike
) => {
    if (
        fs.existsSync(cwd() + '/package.json') &&
        readJson(cwd() + '/package.json').name === 'infinitymint'
    )
        throw new Error('cannot use node modules in InfinityMint package');

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
        config.hardhat.defaultNetwork =
            session.environment.defaultNetwork || 'hardhat';

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

    registerGasAndPriceHandlers(config);

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
        files = files.filter((x) => !x.endsWith('.d.ts'));
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
    if (isInfinityMint()) return findLocalPackageJson()?.version || '1.0.0';

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

export const findLocalPackageJson = () => {
    if (
        !fs.existsSync('./../package.json') &&
        !fs.existsSync(cwd() + '/package.json')
    )
        throw new Error('no package.json');

    return JSON.parse(
        fs.readFileSync(
            fs.existsSync('./../package.json')
                ? './../package.json'
                : cwd() + '/package.json',
            {
                encoding: 'utf-8',
            }
        )
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
export const findScripts = async (roots?: string[]) => {
    let config = getConfigFile();
    roots = roots || [];

    //try and include everything in the scripts folder of the module
    if (!isInfinityMint() && isEnvTrue('INFINITYMINT_INCLUDE_SCRIPTS')) {
        if (config?.dev?.useLocalDist)
            roots.push(cwd() + '/dist/scripts/**/*.js');
        else
            roots.push(
                cwd() + '/node_modules/infinitymint/dist/scripts/**/*.js'
            );
    }

    //if we are typescript require ts files
    if (isTypescript() || !config.settings?.scripts?.disallowTypescript)
        roots.push(cwd() + '/scripts/**/*.ts');
    //require JS files always
    roots.push(cwd() + '/scripts/**/*.js');

    roots = [
        ...roots,
        ...(config.roots || []).map(
            (root: string) =>
                cwd() +
                '/' +
                root +
                (root[root.length - 1] !== '/' ? '/scripts/' : 'scripts/') +
                (isTypescript() || !config.settings?.scripts?.disallowTypescript
                    ? '**/*.ts'
                    : '**/*.js')
        ),
        ...(config.roots || []).map(
            (root: string) =>
                cwd() +
                '/' +
                root +
                (root[root.length - 1] !== '/' ? '/scripts/' : 'scripts/') +
                '**/*.js'
        ),
    ];

    let scanned = [];
    for (let i = 0; i < roots.length; i++) {
        let path = roots[i];
        scanned = [...scanned, ...(await findFiles(path))];
        scanned = scanned.filter((x) => !x.endsWith('.d.ts'));
    }

    //also add gems
    scanned = [
        ...scanned,
        ...Object.values(getLoadedGems())
            .map((x) => x.scripts)
            .flat(),
    ];
    scanned = scanned.filter((x) => !x.endsWith('.d.ts'));
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

export const makeDirectories = (directoryPath: string) => {
    let split = directoryPath.split('/');
    let current = '';
    for (let i = 0; i < split.length; i++) {
        current += split[i] + '/';
        if (!fs.existsSync(current)) fs.mkdirSync(current, { recursive: true });
    }
};

/**
 *
 * @param script
 * @param eventEmitter
 * @param gems
 * @param args
 * @param infinityConsole
 */
export const executeScript = async (
    script: InfinityMintScript,
    eventEmitter: InfinityMintEventEmitter,
    gems?: Dictionary<InfinityMintGemScript>,
    args?: Dictionary<InfinityMintScriptArguments>,
    infinityConsole?: InfinityConsole,
    overwriteConsoleMethods: boolean = true,
    disableDebugLog: boolean = false,
    project?: InfinityMintProject
) => {
    try {
        if (script.arguments) {
            script.arguments.forEach((arg) => {
                if (arg.optional === false && args[arg.name] === undefined)
                    throw new Error('Missing parameter: ' + arg.name);

                if (arg.validator && !arg.validator(args[arg.name]))
                    throw new Error(
                        'Invalid Parameter: ' +
                            arg.name +
                            ' [' +
                            (args[arg.name] || 'undefined') +
                            ']'
                    );
            });
        }

        if (overwriteConsoleMethods) {
            //
        }

        await script.execute({
            script: script,
            eventEmitter: eventEmitter,
            gems: gems,
            args: args,
            log: (msg: string) => {
                infinityConsole.log(msg, 'default');
            },
            debugLog: (msg: string) => {
                if (disableDebugLog) return;
                debugLog(msg);
            },
            infinityConsole: infinityConsole,
            project: !getCurrentProjectPath()
                ? project || {}
                : (getCurrentProject(true) as any),
        });
    } catch (error) {
        throw error;
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
        let packageJson = findLocalPackageJson();
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
 * Reads InfinityMint configuration file and and registers any gas and price handlers we have for each network
 * @param config
 */
export const registerGasAndPriceHandlers = (config: InfinityMintConfig) => {
    Object.keys(config?.settings?.networks || {}).forEach((key) => {
        let network = config?.settings?.networks[key];
        if (!network.handlers) return;

        if (network.handlers.gasPrice)
            registerGasPriceHandler(key, network.handlers.gasPrice);

        if (network.handlers.tokenPrice)
            registerTokenPriceHandler(key, network.handlers.tokenPrice);
    });
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
    useInternalRequire?: boolean,
    _startGanache?: boolean
) => {
    initializeGanacheMnemonic();
    //create default pipes
    createPipes(defaultFactory);

    //try to automatically add module alias
    try {
        let projectJson = findLocalPackageJson();
        if (!projectJson._moduleAliases) {
            projectJson._moduleAliases = {
                '@app': './node_modules/infinitymint/dist/app/',
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
    preInitialize(useJavascript);
};

let hasExposed = false;
export const exposeLogs = (reexpose = false) => {
    if (hasExposed && !reexpose) return;

    setExposeConsoleHostMessage(true);
    setDirectlyOutputLogs(true);
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

export const preInitialize = (isJavascript?: boolean) => {
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

    if (!fs.existsSync(cwd() + '/.env')) {
        //if it isn't javascript we can just include the .env.ts file, else if we aren't just copy the .env from the examples/js folder instead
        let path: PathLike;
        if (!isJavascript) {
            path = fs.existsSync(cwd() + '/examples/example.env.ts')
                ? cwd() + '/examples/example.env.ts'
                : cwd() +
                  '/node_modules/infinitymint/dist/examples/example.env.js';

            if (!fs.existsSync(path))
                throw new Error(
                    'could not find: ' + path + ' to create .env file with'
                );

            try {
                createEnvFile(require(path));
            } catch (error) {
                console.log(
                    'Could not create .env file for typescript environment, falling back to .env'
                );
                preInitialize(true);
                return;
            }
        } else {
            path = fs.existsSync(cwd() + '/examples/js/example.env')
                ? cwd() + '/examples/js/example.env'
                : cwd() + '/node_modules/infinitymint/examples/js/example.env';

            if (!fs.existsSync(path))
                throw new Error(
                    'could not find: ' + path + ' to create .env file with'
                );

            fs.copyFileSync(path, cwd() + '/.env');
        }

        console.log('made .env from ' + path);
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
    let filename = useJavascript
        ? 'infinitymint.config.js'
        : 'infinitymint.config.ts';
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
        log('infinitymint.config file already exists, skipping creation');
        return;
    }

    //check if the infinity mint config file has not been created, if it hasn't then create a new config file with the values of the object above
    if (!fs.existsSync(cwd() + '/' + filename)) {
        fs.writeFileSync(cwd() + '/' + filename, stub);
    }
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

export const hasLocationForProject = (
    projectOrProjectName: string | InfinityMintProject
) => {
    let projectName =
        typeof projectOrProjectName === 'string'
            ? projectOrProjectName
            : getProjectFullName(projectOrProjectName);
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
    } else defaultFactory.error(newError);
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
 * non typed version of isEnvTrue
 * @param key
 * @returns
 */
export const envTrue = (key: string) => {
    return isEnvTrue(key as any);
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
