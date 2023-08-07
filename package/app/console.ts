import {
    Gem,
    InfinityMintCompiledProject,
    InfinityMintConfigEventKeys,
    InfinityMintConsoleOptions,
    InfinityMintDeployedProject,
    InfinityMintEventEmit,
    InfinityMintEventKeys,
    InfinityMintExportScript,
    InfinityMintNetworkEventKeys,
    InfinityMintProject,
    InfinityMintScript,
    InfinityMintScriptArguments,
    InfinityMintTempProject,
    KeyValue,
} from './interfaces';
import { ethers } from 'hardhat';
import fs from 'fs';
import {
    BlessedElement,
    exposeLogs,
    cwd,
    directlyOutputLogs,
    findCustomBlessedElements,
    findExportSolutions,
    findScripts,
    findWindows,
    getConfigFile,
    getCustomBlessedElements,
    getExportSolutions,
    getInfinityMintVersion,
    isEnvTrue,
    isScriptMode,
    readGlobalSession,
    requireScript,
    requireWindow,
    setAllowEmojis,
    setAllowPiping,
    warning,
} from './helpers';
import hre from 'hardhat';
import { getTelnetOptions, SessionEntry, TelnetServer } from './telnet';
import { InfinityMintEventEmitter } from './interfaces';
import { InfinityMintWindow } from './window';
import { HardhatRuntimeEnvironment, Network } from 'hardhat/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { setWalletNetwork, getDefaultAccountIndex } from './web3';
import { findTemplates, getTemplates } from './templates';
import { defaultFactory, PipeFactory } from './pipes';
import { Dictionary } from './helpers';
import { BigNumber } from 'ethers';
import {
    loadProjectDeploymentClasses,
    InfinityMintDeployment,
} from './deployments';
import path from 'path';
import { getImports, hasImportCache, ImportCache } from './imports';
import {
    JsonRpcProvider,
    StaticJsonRpcProvider,
} from '@ethersproject/providers';
//blessed
import blessed from 'blessed';
import {
    findProjects,
    getCompiledProject,
    getCurrentProject,
    getDeployedProject,
    findProject,
    writeParsedProjects,
} from './projects';
import { ProjectCache } from './projects';
import { includeGems, loadGems } from './gems';
import { ExpressServer, startExpressServer } from './express';
import { isAllowingIPFS, IPFS } from './ipfs';
import { WebSocketController, startWebSocket } from './webSocket';
import { executeScript } from './web3';

//
import * as Projects from './projects';
import * as Helpers from './helpers';
import * as Deployments from './deployments';
import { UpdateCache, loadUpdates } from './updates';

//uuid stuff
const { v4: uuidv4 } = require('uuid');

/**
 * Powered by Blessed-cli the InfinityConsole is the container of InfinityMintWindows and all things Web3 related. See {@link app/window.InfinityMintWindow}.
 */
export class InfinityConsole {
    //This allows for developers to access these three modules from the console. This is useful for developers who want to use only the console like a module. (like in jsGlue)
    /**
     * This is the projects module. It contains all the functions for managing projects. See {@link app/projects}
     */
    public Projects = Projects;
    /**
     * This is the helpers module. It contains useful utils. See {@link app/helpers}
     */
    public Helpers = Helpers;
    /**
     * This is the deployments module. It contains all the functions for managing deployments. See {@link app/deployments}
     */
    public Deployments = Deployments;

    /**
     * List of templates for creating new projects, see the /templates/ folder and new command
     */
    public templates: any;
    /**
     * An instance of the web socket controller
     */
    public WebSocketController: WebSocketController;

    /**
     * an instance of the express server
     */
    public ExpressServer: ExpressServer;

    /**
     * Returns an instance of an InfinityMint IPFS class.
     */
    public IPFS: IPFS;

    /**
     * the windows for the console
     */
    public windows: InfinityMintWindow[];

    /**
     * the imports cache for the console
     */
    private imports: ImportCache;
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
    private loadingBox?: BlessedElement;
    /**
     * List of export solutions for exporting InfinityMint projects, see the /exports/ folder and export command
     */
    private exportSolutions: Dictionary<InfinityMintExportScript>;
    /**
     * the screen of the console. This is a blessed cli element.
     */
    private screen: BlessedElement;
    /**
     * the gems
     */
    private gems: Dictionary<Gem>;
    /**
     * the options for the console, see {@link app/interfaces.InfinityMintConsoleOptions}
     */
    private options?: InfinityMintConsoleOptions;
    /**
     * the hardhat runtime environment for the console. See {@link https://hardhat.org/hardhat-network/#hardhat-runtime-environment}.
     */
    private currentNetwork?: HardhatRuntimeEnvironment['network'];
    /**
     * the signers for the console. See {@link https://docs.ethers.io/v5/api/signer/#Signer}
     */
    private signers?: SignerWithAddress[];
    /**
     * the window manager element for the console
     */
    private windowManager?: BlessedElement;
    /**
     * the error box element for the console
     */
    private errorBox?: BlessedElement;
    /**
     * returns true if the console has successfully connected to a network
     */
    private currentNetworkAccess: boolean = false;
    /**
     * the keyboard shortcuts for the console, is a dictionary of key combinations and their respective functions
     */
    private inputKeys: Dictionary<Array<Function>>;
    /**
     * the current networks chainId of the console
     */
    private chainId: number;
    /**
     * the event emitter for the console
     */
    private EventEmitter: InfinityMintEventEmitter;
    /**
     * the current account of the console
     */
    private currentAccount: SignerWithAddress;
    /**
     * the current balance of the console
     */
    private currentBalance: BigNumber;
    /**
     * the scripts for the console
     */
    private scripts: InfinityMintScript[];
    /**
     * the session id of the console
     */
    private sessionId: string;
    /**
     * the current tick of the console
     */
    private tick: number;
    /**
     * the current audio being played
     */
    private currentAudio: any;
    /**
     * the telnets client instance
     */
    private telnetClient: any;
    /**
     *
     */
    private firstTime: boolean = true;
    /**
     * if the current audio has been killed or is not playing
     */
    private currentAudioKilled: boolean;
    /**
     * if the console has been initialized
     */
    private hasInitialized: boolean;
    /**
     *
     */
    private splashScreen: BlessedElement;
    /**
     * if the audio is currently awaiting kill
     */
    private currentAudioAwaitingKill: boolean;
    /**
     * the audio player for the console
     */
    private player: any;
    /**
     * the telnet user entry for this console
     */
    private user: any;
    /**
     * the telnet session entry for this console innstance
     */
    private session: SessionEntry;
    /**
     * the telnet server instance
     */
    public TelnetServer: TelnetServer;
    /**
     * loggers for the console
     */
    public PipeFactory: PipeFactory;
    /**
     * projects cache
     */
    private projects: ProjectCache;

    /**
     * Updates cache
     */
    private updates: UpdateCache;

    /**
     * constructor for the InfinityConsole, see {@link app/window.InfinityMintWindow}
     * @param options
     * @param pipeFactory
     * @param telnetServer
     * @param eventEmitter
     */
    constructor(
        options?: InfinityMintConsoleOptions,
        pipeFactory?: PipeFactory,
        telnetServer?: TelnetServer,
        eventEmitter?: InfinityMintEventEmitter
    ) {
        this.PipeFactory = pipeFactory || defaultFactory;
        this.windows = [];
        this.exportSolutions = {};
        this.templates = {};
        this.allowExit = true;
        this.options = options;
        this.tick = 0;
        this.TelnetServer = telnetServer;
        this.sessionId = this.generateId();
        this.EventEmitter = eventEmitter || this.createEventEmitter();

        if (!options.dontDraw) {
            let config = getConfigFile();
            if (this.options.blessed?.fullUnicode) setAllowEmojis(true);

            if (config.music)
                this.player = require('play-sound')({ player: 'afplay' });

            this.debugLog(
                `starting blessed on InfinityConsole<${this.sessionId}>`
            );
            this.screen = blessed.screen(
                this.options?.blessed || {
                    fastCRS: true,
                    smartCRS: true,
                    autoPadding: true,
                    dockBorders: true,
                    sendFocus: true,
                }
            );

            //captures errors which happen in key events in the window
            this.captureEventErrors();

            this.loadingBox = blessed.loading({
                top: 'center',
                left: 'center',
                width: '90%',
                height: '75%',
                horizonal: true,
                parent: this.screen,
                hidden: true,
                pch: '-',
                padding: 1,
                border: 'line',
                style: {
                    bg: 'black',
                    fg: 'green',
                    border: {
                        fg: 'green',
                    },
                },
            });

            this.screen.append(this.loadingBox);
            this.screen.render();

            let splashPath = path
                .join(__dirname, '../resources/splashscreen.txt')
                .replace('dist/', '');

            let content = fs.existsSync(splashPath)
                ? fs.readFileSync(splashPath, {
                      encoding: 'utf-8',
                  })
                : 'InfinityMint';

            this.splashScreen = blessed.box({
                top: 'center',
                left: 'center',
                width: 107,
                height: 'shrink',
                tags: true,
                content: content,
                horizonal: true,
                parent: this.screen,
                padding: 1,
                border: 'line',
                style: {
                    bg: 'black',
                    fg: 'cyan',
                    border: {
                        fg: 'magenta',
                    },
                },
            });

            this.screen.append(this.splashScreen);
            this.screen.render();

            this.splashScreen.show();
            this.splashScreen.setFront();
            this.loadingBox.setFront();
            this.loadingBox.hide();
        }
    }

    /**
     * Loads custom components
     */
    public async loadCustomComponents() {
        //load custom components
        await findCustomBlessedElements();

        //add custom elements
        let elements = getCustomBlessedElements();

        if (Object.keys(elements).length !== 0) {
            this.log('registering custom elements to window', 'debug');
            Object.keys(elements).forEach((key) => {
                try {
                    let element = elements[key];

                    if (require.cache['./elements/Base'])
                        delete require.cache['./elements/Base'];

                    let base = require('./elements/Base');
                    blessed[key] = base(key, element);
                } catch (error) {
                    if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
                    this.PipeFactory.pipes['windows'].error(error);
                    this.log(
                        `{red-fg}Element Failure: {/red-fg} ${error.message} <${key}>`
                    );
                }
            });
        }
    }

    /**
     * returns a guuidv4 id
     * @returns
     */
    private generateId() {
        return uuidv4();
    }

    /**
     * gets the gems
     */
    public async loadGems() {
        this.debugLog('{yellow-fg}{bold}Loading Gems...{/}');
        let gems = await includeGems();
        this.gems = gems;
        await loadGems(this);
    }

    public getLoadingBox() {
        return this.loadingBox;
    }

    /**
     * will return the telnet username of this console
     * @returns
     */
    public getTelnetUsername() {
        if (!this.telnetClient) return 'root';
    }

    /**
     * set the telnet client of this console. you should not need to call this method.
     * @param client
     */
    public setTelnetClient(client: any) {
        this.telnetClient = client;
    }

    /**
     *
     * @param eventEmitter
     */
    public setEventEmitter(eventEmitter: InfinityMintEventEmitter) {
        this.EventEmitter = eventEmitter;
    }

    /**
     * sets the event emitter of this console to another consoles event emitter returning the old one
     * @param otherConsole
     * @returns
     */
    public setEventEmitterFromConsole(otherConsole: InfinityConsole) {
        let oldEmitter = this.EventEmitter;
        this.EventEmitter = otherConsole.EventEmitter;
        return oldEmitter;
    }

    /**
     * retursn true if this console is a telnet console
     * @returns
     */
    public isTelnet() {
        let config = getConfigFile();
        return config.telnet && this.TelnetServer !== undefined;
    }

    /**
     * creates a new event emitter for this console
     * @param dontCleanListeners
     * @returns
     */
    public createEventEmitter(dontCleanListeners?: boolean) {
        let config = getConfigFile();
        if (!dontCleanListeners)
            try {
                if (this.EventEmitter) this.EventEmitter?.removeAllListeners();
            } catch (error) {
                if (isEnvTrue('THROW_ALL_ERRORS')) throw error;

                warning('unable to remove all listeners on eventEMitter');
            }

        this.EventEmitter = new InfinityMintEventEmitter();

        //define these events
        if (config.events)
            Object.keys(config.events).forEach((event) => {
                this.debugLog('new event registered => ' + event);
                try {
                    this.EventEmitter.off(event, config.events[event]);
                } catch (error) {}
                this.EventEmitter.on(event, config.events[event]);
            });

        //define these events
        let telnetEvents = getTelnetOptions();
        if (telnetEvents?.events)
            Object.keys(telnetEvents.events).forEach((event) => {
                this.debugLog('new telnet event registered => ' + event);
                try {
                    this.EventEmitter.off(event, telnetEvents.events[event]);
                } catch (error) {}

                this.EventEmitter.on(event, telnetEvents.events[event]);
            });

        return this.EventEmitter;
    }

    /**
     * gets the consoles session id. this is used to identify the console in the telnet server as well as also being used to identify the console in the event emitter
     * @returns
     */
    public getSessionId(): string {
        return this.sessionId;
    }

    /**
     * gets the consoles event emitter
     * @returns
     */
    public getEventEmitter(): InfinityMintEventEmitter {
        return this.EventEmitter;
    }

    /**
     * gets the screen the console is running on
     * @returns
     */
    public getScreen(): BlessedElement {
        return this.screen;
    }

    /**
     * returns the current account of the console which is the first member of the signers array but with a correctly resolved address
     * @returns
     */
    public getCurrentAccount(): SignerWithAddress {
        return this.currentAccount;
    }

    /**
     * returns the current balance of the account
     * @returns
     */
    public getCurrentBalance(): BigNumber {
        return this.currentBalance;
    }

    /**
     * returns the current chain id
     * @returns
     */
    public getCurrentChainId(): number {
        return parseInt(this.chainId?.toString() || '-1');
    }

    /**
     * logs a message to the console
     * @param msg
     * @param pipe
     */
    public log(msg: string, pipe?: string) {
        this.PipeFactory.log(
            `${msg} ${this.isTelnet() ? ` <${this.sessionId}}>` : ''}`,
            pipe || 'default'
        );
    }

    /**
     * logs an error to the default pipe
     * @param error
     */
    public error(error: Error) {
        if (isScriptMode()) console.log(error);
        this.PipeFactory.error(error);
    }

    /**
     * initializes the input keys property to equal the default keyboard shortcuts allowing the user to navigate the console and close windows
     */
    private registerDefaultKeys() {
        const close = (ch: string, key: string) => {
            if (!this.isDrawing()) return;

            if (!this.allowExit) {
                this.debugLog('not showing CloseBox as allowExit is false');
                return;
            }

            if (this.errorBox && !this.errorBox.hidden) {
                this.errorBox.destroy();
                this.errorBox = undefined;
                return;
            }

            if (!this.currentWindow) {
                this.setCurrentWindow('CloseBox');
                return;
            }

            if (this.currentWindow?.name !== 'CloseBox') {
                let windows = this.getWindowsByName('CloseBox');
                if (windows.length !== 0)
                    windows[0].options.currentWindow = this.currentWindow?.name;

                this.setCurrentWindow('CloseBox');
                //if the closeBox aka the current window is visible and we press control-c again just exit
            } else if (this.currentWindow?.name === 'CloseBox') {
                if (this.telnetClient) {
                    this.destroy();
                    return;
                }

                if (this.currentWindow.isVisible()) {
                    this.currentAudio?.kill();
                } else this.currentWindow.show();

                //exit
                process.exit(1);
            }
        };
        //default input keys
        this.inputKeys = {
            'C-l': [
                (ch: string, key: string) => {
                    if (this.currentWindow?.name !== 'Logs')
                        this.screen.lastWindow = this.currentWindow;

                    this.currentWindow?.openWindow('Logs');
                },
            ],
            'C-r': [
                (ch: string, key: string) => {
                    if (
                        this.currentWindow &&
                        this.currentWindow.isVisible() &&
                        this.currentWindow.canRefresh()
                    )
                        this.reloadWindow(this.currentWindow);
                    else this.reload(true);
                },
            ],
            'C-i': [
                (ch: string, key: string) => {
                    this.reload(true);
                },
            ],
            'C-p': [
                (ch: string, key: string) => {
                    this.setCurrentWindow('Projects');
                },
            ],
            //shows the current video
            'C-x': [
                (ch: string, key: string) => {
                    if (this.screen.lastWindow) {
                        this.currentWindow?.hide();
                        this.currentWindow = this.screen.lastWindow;
                        delete this.screen.lastWindow;
                    }

                    this.updateWindowsList();
                    if (!this.windowManager?.hidden) this.currentWindow?.show();
                },
            ],
            //hides the current window
            'C-z': [
                (ch: string, key: string) => {
                    this.updateWindowsList();
                    this.currentWindow?.hide();
                    this.windowManager.show();
                },
            ],
            up: [
                (ch: string, key: string) => {
                    if (this.currentWindow?.isVisible()) return;
                    this.windowManager.focus();
                },
            ],
            down: [
                (ch: string, key: string) => {
                    if (this.currentWindow?.isVisible()) return;
                    this.windowManager.focus();
                },
            ],
            'C-c': [close],
        };
    }

    /**
     * gets the first signer currently set in the console
     * @returns
     */
    public getSigner(): SignerWithAddress {
        return this.getSigners()[0];
    }

    /**
     * gets all the signers currently set in the console
     * @returns
     */
    public getSigners(): SignerWithAddress[] {
        if (!this.signers)
            throw new Error(
                'signers must be initialized before getting signer'
            );

        return this.signers;
    }

    public hasExpressServer() {
        return this.ExpressServer !== undefined;
    }

    public hasWebSockets() {
        return this.WebSocketController !== undefined;
    }

    /**
     * reloads a window by removing it from the windows array, removing the cached window and then re-instantiating it. This reloads the script which defines the window with code updates and re-renders the window
     * @param thatWindow
     */
    public async reloadWindow(thatWindow: string | InfinityMintWindow) {
        this.setLoading('Reloading ' + thatWindow.toString());

        for (let i = 0; i < this.windows.length; i++) {
            let window = this.windows[i];

            if (
                window.toString() !== thatWindow.toString() &&
                window.name !== thatWindow.toString()
            )
                continue;

            try {
                let shouldInstantiate = false;
                if (
                    this.currentWindow.toString() === window.toString() ||
                    this.currentWindow.name === window.name
                ) {
                    shouldInstantiate = true;
                    this.currentWindow.hide();
                }
                let fileName = window.getFileName();

                window.log('reloading blessed elements');
                await this.loadCustomComponents();

                this.debugLog(
                    '{cyan-fg}Reimporting ' + window.name + '{/cyan-fg}'
                );
                let newWindow = requireWindow(fileName, this);
                this.debugLog(
                    '{green-fg}Successfully Reimported ' +
                        newWindow.name +
                        `{/green-fg} <${newWindow.getId()}>`
                );
                window.destroy();
                newWindow.setFileName(fileName);
                newWindow.setBlessed(blessed);

                this.windows[i] = newWindow;
                this.currentWindow = newWindow;
                if (shouldInstantiate) {
                    await this.createCurrentWindow();
                }
            } catch (error) {
                this.errorHandler(error);
            }
        }

        this.stopLoading();
    }

    /**
     * registers events on the window
     * @param window
     * @returns
     */
    private registerWindowEvents(window?: InfinityMintWindow) {
        if (!this.currentWindow && !window) return;
        window = window || this.currentWindow;

        if (!window) return;
        //when the window is destroyed, rebuild the items list

        this.debugLog(
            'registering events window specific for <' +
                window.name +
                `>[${window.getId()}]`
        );
        //so we only fire once
        if (window.data.destroy) window.off('destroy', window.data.destroy);

        window.data.destroy = () => {
            this.updateWindowsList();
        };
        window.on('destroy', window.data.destroy);

        //so we only fire once
        if (window.data.hide) window.off('hide', window.data.hide);

        //when the current window is hiden, rebuild the item
        window.data.hide = () => {
            this.updateWindowsList();
        };
        window.on('hide', window.data.hide);
    }

    /**
     * Will execute a script with the given arguments. argv is optional, you can pass argv directly from yargs if you want
     * @param scriptName
     * @param scriptArguments
     * @param argv
     */
    public async executeScript(
        scriptName: string,
        scriptArguments: Dictionary<InfinityMintScriptArguments> = {},
        argv: any = {},
        showDebugLogs?: boolean
    ) {
        let script = this.getScript(scriptName);
        if (!script) throw new Error('cannot find script: ' + scriptName);
        if (!argv) argv = {};
        if (script.arguments === undefined) script.arguments = [];

        Object.keys(argv).map((key, index) => {
            let value = argv[key];

            if (!value || value.length === 0) value = true;

            if (key[0] === '_') return;
            if (key[0] === '$' && argv._.length !== 0) {
                let index = key.split('$')[1];
                if (index === undefined) return;
                key = script.arguments[index].name;
                value = argv._[parseInt(index)] || '';
            }

            if (script.arguments[key] === undefined)
                scriptArguments[key] = {
                    ...(script.arguments[key] || {}),
                    name: key,
                    value: value,
                };

            if (scriptArguments[key].type === 'boolean') {
                if (value === 'true' || value === '')
                    scriptArguments[key].value = true;
                else if (value === 'false') scriptArguments[key].value = false;
                else
                    throw new Error(
                        'Invalid value for boolean argument: ' +
                            key +
                            ' (expected true or false)'
                    );
            }

            if (scriptArguments[key].type === 'number') {
                if (isNaN(value))
                    throw new Error(
                        'Invalid value for number argument: ' +
                            key +
                            ' (expected number)'
                    );
                else scriptArguments[key].value = parseInt(value);
            }

            if (
                scriptArguments[key].validator &&
                scriptArguments[key].validator(scriptArguments[key].value) ===
                    false
            )
                throw new Error(
                    'Invalid value for argument: ' + key + ' (failed validator'
                );
        });

        Object.keys(scriptArguments).forEach((arg) => {
            if (!scriptArguments[arg].name) scriptArguments[arg].name = arg;
        });

        Object.values(script.arguments).forEach((arg) => {
            if (!arg.optional && !scriptArguments[arg.name])
                throw new Error('Missing required argument: ' + arg.name);
        });

        this.log(
            'Script args => ' + JSON.stringify(scriptArguments, null, 4),
            'express'
        );

        await executeScript(
            script,
            this.getEventEmitter(),
            {}, //gems when we get them
            scriptArguments,
            this,
            !this.options.test,
            showDebugLogs !== undefined
                ? showDebugLogs
                : scriptArguments['show-debug-logs']?.value ||
                      scriptArguments['show-all-logs']?.value ||
                      directlyOutputLogs ||
                      false
        );
    }

    /**
     * sets current window to what ever is passed in and shows it
     * @param thatWindow
     * @returns
     */
    public async setCurrentWindow(thatWindow: string | Window) {
        if (this.currentWindow?.isForcedOpen()) return;
        if (this.currentWindow) this.currentWindow.hide();

        for (let i = 0; i < this.windows.length; i++) {
            let window = this.windows[i];
            if (
                window.toString() !== thatWindow.toString() &&
                window.name !== thatWindow.toString()
            ) {
                if (thatWindow === 'CloseBox') window.hide();
                continue;
            }

            this.currentWindow = window;
            await this.createCurrentWindow();
            this.currentWindow.show();
        }
    }

    /**
     * destroys the console
     */
    public destroy() {
        this.emit('destroyed');
        this.cleanup();
        this.screen.destroy();
        if (this?.telnetClient?.writable) {
            try {
                this.telnetClient?.destroy();
            } catch (error) {
                warning('could not destroy: ' + error.message);
            }
        }
        this.telnetClient = undefined;
    }

    /**
     * cleans up the console ready to be reloaded
     */
    private cleanup() {
        this.hasInitialized = false;

        //then start destorying
        Object.keys(this.inputKeys).forEach((key) => {
            this.unkey(key);
        });

        //more destroying
        this.imports = undefined;
        this.currentWindow = undefined;
        this.windows?.forEach((window) => window?.destroy());
        this.windows = [];
        this.currentNetwork = undefined;
        this.windowManager?.destroy();
        this.windowManager = undefined;
    }

    /**
     * reloads the projects
     */
    public async loadProjects(useCache?: boolean) {
        let projects = await findProjects();
        this.projects = writeParsedProjects(projects);
    }

    /**
     * reloads the updates
     * @param useCache
     */
    public async loadUpdates(useCache: boolean = false) {
        let updates = await loadUpdates([], !useCache);
        this.updates = updates;
    }

    /**
     * Returns the current infinity mint projet
     * @returns
     */
    public async getCurrentProject() {
        if (!getCurrentProject()) return null;
        return await this.getProject(getCurrentProject() as any);
    }

    /**
     *
     * @returns if the current project is valid
     */
    public hasCurrentProject() {
        let session = readGlobalSession();
        if (!session) return false;
        if (!session.environment.defaultProject) return false;
        if (!session.environment.project) return false;
        if (!this.projects) return false;
        if (!this.hasProject(session.environment.project)) return false;

        return true;
    }

    /**
     * Returns true if this project exists, used to check if project or full name exists
     * @param projectOrFullName
     * @returns
     */
    public hasProject(projectOrFullName: string | KeyValue) {
        let name: string;
        if (typeof projectOrFullName === 'string') name = projectOrFullName;
        else name = projectOrFullName.name;

        return this.projects.keys[name] !== undefined;
    }

    /**
     * Reloads the current infinitymint.config.ts
     */
    public reloadConfig() {
        getConfigFile(true);
    }

    /**
     * returns a list of all the projects found
     * @returns
     */
    public getProjectNames() {
        return this.projects.projects;
    }

    /**
     * Returns a project class. You can enter just the name of the project to be returned a class or pass in deployed or compiled project data to create a classed based off of that
     * @param projectOrFullName
     * @returns
     */
    public async getProject(
        projectOrFullName?:
            | string
            | InfinityMintCompiledProject
            | InfinityMintDeployedProject
            | InfinityMintProject,
        network?: string,
        version?: string
    ) {
        let name: string;
        version =
            version ||
            (typeof projectOrFullName === 'string'
                ? Projects.getProjectVersion(projectOrFullName)
                : projectOrFullName?.version?.version);

        if (typeof projectOrFullName !== 'string')
            name = Projects.getProjectName(projectOrFullName as any);
        else {
            name = projectOrFullName as string;
            name = projectOrFullName.split('@')[0];
        }
        if (!name) throw new Error('no project found: ' + name);

        if (typeof projectOrFullName === 'string') {
            if (!network && projectOrFullName.indexOf('_') !== -1)
                network = projectOrFullName?.split('_')?.pop();

            if (!version && projectOrFullName.indexOf('@') !== -1)
                version = projectOrFullName?.split('@')?.pop()?.split('_')[0];
        }

        return Projects.getProject(
            name,
            network ||
                (projectOrFullName as any)?.network?.name ||
                hre.network.name,
            this,
            version || (projectOrFullName as any)?.version?.version
        );
    }

    /**
     * returns a compiled project
     * @param projectOrFullName
     * @returns
     */
    public getCompiledProject(projectOrFullName: any) {
        return getCompiledProject(projectOrFullName);
    }

    /**
     * returns a deployed project
     * @param projectOrFullName
     * @param network
     * @returns
     */
    public getDeployedProject(projectOrFullName: any, network?: string) {
        network = network || this.network.name;
        let project = findProject(projectOrFullName);
        if (!project) throw new Error('no project found: ' + projectOrFullName);
        return getDeployedProject(project, network);
    }

    public get network() {
        return this.currentNetwork;
    }

    /**
     * reloads the console
     * @param refreshImports
     */
    public async reload(refreshImports?: boolean) {
        this.hasInitialized = false;

        try {
            this.log(
                `{bold}{cyan-fg}Reloading InfinityMint{/cyan-fg}{/bold} => InfinityMint Console`
            );
            this.log(`📦 Reloading infinitymint.config`);
            //reload the infinityMint config
            this.reloadConfig();
            this.emit('reloaded');

            this.log(`📦 Cleaning Up`);
            this.cleanup();
            //render
            this.screen.render();

            this.setLoading('Reinitializing', 20);
            this.stopLoading();
            await this.initialize();
            //rebuild imports
            await this.buildImports(refreshImports);
            //render
            this.screen.render();
            await this.reloadWindow(this.currentWindow);
        } catch (error) {
            this.errorHandler(error);
        }
    }

    /**
     * gets a window by its guid
     * @param id
     * @returns
     */
    public getWindowById<T extends InfinityMintWindow>(id: string | Window): T {
        return this.windows
            .filter((thatWindow) => thatWindow.getId() === id.toString())
            .pop() as T;
    }

    /**
     *
     * @returns
     */
    public getCurrentDeployedProject() {
        return getDeployedProject(
            this.getCurrentProject() as any,
            this.network.name
        );
    }

    /**
     *
     * @returns
     */
    public getCurrentCompiledProject() {
        if (!this.getCurrentProject()) return null;
        return getCompiledProject(this.getCurrentProject() as any);
    }

    /**
     * returns the current consoles imports
     * @returns
     */
    public getImports(): ImportCache {
        return this.imports;
    }

    /**
     * returns the current consoles imports
     * @returns
     */
    public getProjects(): ProjectCache {
        return this.projects;
    }

    /**
     * Returns current project updates
     * @returns
     */
    public getUpdates(): UpdateCache {
        return this.updates;
    }

    /**
     * gets a list of windows orderd by creation date
     * @param name
     * @param oldest
     * @returns
     */
    public getWindowByAge(name: string, oldest: boolean): InfinityMintWindow[] {
        let windows = this.getWindowsByName(name);
        if (oldest) {
            windows = windows.sort((a, b) => {
                return a.getCreation() - b.getCreation();
            });
        } else {
            windows = windows.sort((a, b) => {
                return b.getCreation() - a.getCreation();
            });
        }

        return windows;
    }

    /**
     * Returns a list of windows with the same name
     * @param name
     * @returns
     */
    public getWindowsByName(name: string): InfinityMintWindow[] {
        return this.windows.filter((thatWindow) => thatWindow.name === name);
    }

    /**
     * gets the current tick of the console. The tick is the number of times the console has been updated. The speed of which the console updates is determined by the config file
     * @returns
     */
    public getTick(): number {
        return this.tick;
    }

    /**
     * Adds a window to the console
     * @param window
     */
    public addWindow(window: InfinityMintWindow) {
        if (this.hasWindow(window))
            throw new Error(
                'window with that id is already inside of the console'
            );

        this.windows.push(window);
    }

    /**
     * returns true if there is a request to kill the current audio stream
     * @returns
     */
    public isAudioAwaitingKill(): boolean {
        if (!getConfigFile().music) return false;
        return this.currentAudioAwaitingKill;
    }

    /**
     * returns a window by name
     * @param windowName
     * @returns
     */
    public getWindow<T extends InfinityMintWindow>(windowName: string): T {
        return this.getWindowsByName(windowName)[0] as T;
    }

    /**
     * returns true if the window exists
     * @param windowName
     * @returns
     */
    public hasWindowName(windowName: string): boolean {
        return this.getWindowsByName(windowName).length !== 0;
    }

    /**
     * returns true if audio is current playing
     * @returns
     */
    public isAudioPlaying(): boolean {
        if (!getConfigFile().music) false;
        return !!this.currentAudio;
    }

    /**
     * Stops the current audio file
     * @returns
     */
    public async stopAudio() {
        if (!getConfigFile().music) return;

        if (this.currentAudio?.kill) {
            this.currentAudio?.kill();
            await this.hasAudioBeenKilled();
        } else {
            this.currentAudioAwaitingKill = false;
            this.currentAudioKilled = true;
        }
    }

    /**
     * plays an audio file using a child process to a music player executable on the system. Does not work if music is disabled in config. Will not work over telnet. Might not work on windows.
     * @param path
     * @param onFinished
     * @param onKilled
     * @returns
     */
    public playAudio(path: string, onFinished?: Function, onKilled?: Function) {
        if (!getConfigFile().music) return;
        this.currentAudioKilled = false;
        this.debugLog('playing => ' + cwd() + path);
        // configure arguments for executable if any
        this.currentAudio = this.player.play(
            cwd() + path,
            { afplay: ['-v', 1] /* lower volume for afplay on OSX */ },
            (err: Error | any) => {
                if (err && !this.currentAudio.killed) {
                    if (isEnvTrue('THROW_ALL_ERRORS')) throw err;
                    else warning('cannot play file: ' + err?.message);
                    return;
                }

                if (this.currentAudio.killed) {
                    this.debugLog('killed => ' + cwd() + path);
                    this.currentAudio = null;
                    this.currentAudioKilled = true;
                    if (onKilled) onKilled(this.currentWindow, this);
                } else {
                    this.debugLog('finished playing => ' + cwd() + path);
                    this.currentAudio = null;
                    if (onFinished) onFinished(this.currentWindow, this);
                }
            }
        );
    }

    /**
     * gets the current window
     * @returns
     */
    public getCurrentWindow(): InfinityMintWindow {
        return this.currentWindow;
    }

    /**
     * Returns true if there is a current window
     * @returns
     */
    public hasCurrentWindow(): boolean {
        return !!this.currentWindow;
    }

    /**
     * Returns true if the current window has killed the audio after it was requested to stop playing.
     * @returns
     */
    public async hasAudioBeenKilled() {
        if (!getConfigFile().music) return;
        if (this.currentAudioKilled) return;

        this.currentAudioAwaitingKill = true;
        await new Promise((resolve, reject) => {
            let int = setInterval(() => {
                if (this.currentAudioKilled || !this.currentWindow.isAlive()) {
                    clearInterval(int);
                    resolve(true);
                    this.currentAudioAwaitingKill = false;
                    return;
                }
            }, 1000);
        });
    }

    public hasWindow(window: InfinityMintWindow): boolean {
        return (
            this.windows.filter(
                (thatWindow) => thatWindow.getId() === window.getId()
            ).length !== 0
        );
    }

    /**
     * Updates the windows list with the current windows in the console
     * @returns
     */
    private updateWindowsList() {
        if (this.options.dontDraw) return;

        this.windowManager.setBack();
        this.windowManager.enableKeys();
        this.windowManager.enableMouse();
        try {
            this.windowManager.setItems(
                this.windows
                    .filter((window) => !window.isHiddenFromMenu())
                    .map(
                        (window, index) =>
                            `{bold}[${index.toString().padEnd(4, '0')}]{bold}` +
                            ((window.isAlive()
                                ? ` {green-fg}0x${index
                                      .toString(16)
                                      .padEnd(4, '0')}{/green-fg}`
                                : ' {red-fg}0x0000{/red-fg}') +
                                (!window.hasInitialized()
                                    ? ' {gray-fg}[!]{/gray-fg}'
                                    : ' {gray-fg}[?]{/gray-fg}') +
                                ' ' +
                                window.name +
                                (window.isGem()
                                    ? ' {magenta-fg}(gem){/magenta-fg}'
                                    : '') +
                                (window.isAlive() &&
                                window.shouldBackgroundThink()
                                    ? ' {gray-fg}(running in background){/gray-fg}'
                                    : ''))
                    )
            );
        } catch (error) {
            if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
            warning('cannot update window manager: ' + error?.message);
        }
        this.windowManager.show();
    }

    /**
     * shows a loading bar with a message in the center of the screen
     * @param msg
     * @param filled
     * @returns
     */
    public setLoading(msg: string, filled?: number) {
        if (this.options.dontDraw || !this.loadingBox || this.firstTime) return;

        this.loadingBox.setFront();
        this.loadingBox.load(msg);
        this.loadingBox.filled = this.loadingBox.filled || filled || 100;
        this.screen.render();
    }

    public isDrawing() {
        return this.options.dontDraw !== true;
    }

    /**
     * stops the loading bar from appearing
     * @returns
     */
    public stopLoading() {
        if (this.options.dontDraw) return;

        this.loadingBox.stop();
        this.loadingBox.setBack();
        this.screen.render();
    }

    /**
     * creates the window manager
     */
    private createWindowManager() {
        //incase this is ran again, delete the old windowManager
        if (this.windowManager) {
            this.windowManager?.free();
            this.windowManager?.destroy();
            this.windowManager = undefined;
        }

        //creating window manager
        this.windowManager = blessed.list({
            label: ' {bold}{white-fg}Windows{/white-fg} (Enter/Double-Click to hide/show){/bold}',
            tags: true,
            top: 'center',
            left: 'center',
            width: '95%',
            height: '95%',
            padding: 2,
            keys: true,
            hidden: true,
            mouse: true,
            parent: this.screen,
            vi: true,
            border: 'line',
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'black',
                },
                style: {
                    inverse: true,
                },
            },
            style: {
                bg: 'black',
                fg: 'white',
                item: {
                    hover: {
                        bg: 'green',
                        fg: 'black',
                    },
                },
                selected: {
                    bg: 'grey',
                    fg: 'green',
                    bold: true,
                },
            },
        });
        //when an item is selected form the list box, attempt to show or hide that Windoiw.
        this.windowManager.on('select', async (_el: any, selected: any) => {
            try {
                if (this.currentWindow?.isForcedOpen()) {
                    this.currentWindow.show();
                    return;
                }
                //disable the select if the current window is visible
                if (this.currentWindow?.isVisible()) return;
                //set the current window to the one that was selected
                this.currentWindow = this.windows.filter(
                    (window) => !window.isHiddenFromMenu()
                )[selected];

                if (!this.currentWindow) {
                    warning('current window is undefined');
                    this.updateWindowsList();
                    this.currentWindow = this.getWindow('Menu');
                    return;
                }

                if (!this.currentWindow.hasInitialized()) {
                    //reset it
                    this.currentWindow.destroy();
                    //create it again
                    await this.createCurrentWindow();
                } else if (!this.currentWindow.isVisible())
                    this.currentWindow.show();
                else this.currentWindow.hide();
                await this.currentWindow.updateFrameTitle();
            } catch (error) {
                this.currentWindow?.hide();
                this.currentWindow?.destroy();

                try {
                    this.windows[selected]?.hide();
                    this.destroyWindow(this.windows[selected]);
                } catch (error) {
                    warning('cannot destroy window: ' + error.message);
                }

                this.errorHandler(error);
            }
        });

        //append window manager to the screen
        this.screen.append(this.windowManager);
        this.windowManager.setBack();
        this.windowManager.hide();
    }

    /**
     * Overwrites the key and mouse events on the blessed screen object to capture errors
     */
    private captureEventErrors() {
        //captures errors in keys
        if (!this.screen.oldKey) this.screen.oldKey = this.screen.key;

        this.screen.key = (param1: any, cb: any) => {
            if (typeof cb === typeof Promise)
                this.screen.oldKey(param1, async (...any: any[]) => {
                    try {
                        await cb(...any);
                    } catch (error) {
                        this.errorHandler(error);
                    }
                });
            else
                this.screen.oldKey(param1, (...any: any[]) => {
                    try {
                        cb(...any);
                    } catch (error) {
                        this.errorHandler(error);
                    }
                });
        };

        //does the same a above, since for sone reason the on events aren't emitting errors, we can still get them like this
        if (!this.screen.oldOn) this.screen.oldOn = this.screen.on;

        this.screen.on = (param1: any, cb: any) => {
            if (typeof cb === typeof Promise)
                this.screen.oldOn(param1, async (...any: any[]) => {
                    try {
                        await cb(...any);
                    } catch (error) {
                        this.errorHandler(error);
                    }
                });
            else
                this.screen.oldOn(param1, (...any: any[]) => {
                    try {
                        cb(...any);
                    } catch (error) {
                        this.errorHandler(error);
                    }
                });
        };
    }

    /**
     *
     * @param scriptName
     * @returns
     */
    public getScript<T extends InfinityMintScript>(scriptName: string): T {
        return this.scripts.find(
            (script) =>
                script.name.toLowerCase() === scriptName.toLowerCase() ||
                script.fileName.split('.')[0].toLowerCase() ===
                    scriptName.toLowerCase()
        ) as T;
    }

    /**
     * Displays an error in a box. Will not display if the console is not drawing.
     * @param error
     * @param onClick
     */
    public displayError(error: Error, onClick?: any) {
        if (this.errorBox) {
            this.errorBox?.destroy();
            this.errorBox = undefined;
        }

        this.errorBox = blessed.box({
            top: 'center',
            left: 'center',
            shrink: true,
            width: '80%',
            keys: true,
            mouse: true,
            keyboard: true,
            parent: this.screen,
            height: '80%',
            scrollable: true,
            draggable: true,
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'black',
                },
                style: {
                    inverse: true,
                },
            },
            padding: 1,
            content: `{white-bg}{black-fg}CRITICAL ERROR - SYSTEM MALFUCTION{/white-bg} {underline}(control-c/cmd-c to close this box){/underline}\n\n{black-bg}{white-fg}${
                error.message
            }{/black-bg}{/white-fg}\n\n{white-bg}{black-fg}thrown on ${new Date(
                Date.now()
            ).toString()}{/black-fg}{/white-bg}\n{white-bg}{black-fg}infinitymint-beta ${getInfinityMintVersion()}{/black-fg}{/white-bg}\n\n${
                error.stack
            }`,
            tags: true,
            border: {
                type: 'line',
            },
            style: {
                fg: 'white',
                bg: 'red',
                border: {
                    fg: '#ffffff',
                },
            },
        }) as BlessedElement;

        this.screen.append(this.errorBox);
        this.screen.render();

        this.errorBox.setFront();
        this.errorBox.focus();
        this.errorBox.enableInput();
        this.errorBox.enableKeys();
    }

    /**
     * This method is used to register keyboard shortcuts which are included in each console by default. It is also used to register new keys if the console is reloaded.
     * @returns
     */
    private registerKeys() {
        if (!this.inputKeys) return;

        let keys = Object.keys(this.inputKeys);
        keys.forEach((key) => {
            try {
                this.screen.unkey([key]);
            } catch (error) {
                if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
                warning('could not unkey ' + key);
            }

            this.debugLog(`registering keyboard shortcut method on [${key}]`);
            this.screen.key([key], (ch: string, _key: string) => {
                this.inputKeys[key].forEach((method, index) => {
                    method();
                });
            });
        });
    }

    /**
     * sets the allow exit flag for this console.
     * @param canExit
     */
    public setAllowExit(canExit: boolean) {
        this.allowExit = canExit;
    }
    /**
     * Sets the telnet session for this console.
     * @param session
     */
    public setTelnetSession(session: any) {
        this.session = session;
    }

    /**
     * Sets the telnet user for this console.
     * @param user
     */
    public setTelnetUser(user: any) {
        this.user = user;
    }

    /**
     * Used by the close method to determine if the console can exit or not.
     * @returns
     */
    public isAllowingExit(): boolean {
        return this.allowExit;
    }

    /**
     * Changes the web3 provider to a new network, reloading the console and all windows and elements.
     * @param string
     * @returns
     */
    public async changeNetwork(string: string): Promise<JsonRpcProvider> {
        setWalletNetwork(string);
        await this.reload();
        return ethers.provider;
    }

    /**
     * assigns a key to a method for this console. Used by the console, windows and elements to register keyboard shortcuts
     * @param key
     * @param cb
     * @returns
     */
    public key(key: string, cb: Function) {
        if (!this.inputKeys) this.inputKeys = {};

        this.debugLog(`registering keyboard shortcut method on [${key}]`);
        if (!this.inputKeys[key]) {
            this.inputKeys[key] = [];
            this.screen.key([key], (ch: string, _key: string) => {
                this.inputKeys[key].forEach((method, index) => {
                    method();
                });
            });
        }

        this.inputKeys[key].push(cb);
        return cb;
    }

    /**
     * unmaps a key combination from the console, if no cb is passed then will delete all keys under that key
     * @param key
     * @param cb
     */
    public unkey(key: string, cb?: Function) {
        if (!this.inputKeys[key] || this.inputKeys[key].length <= 1 || !cb)
            this.inputKeys[key] = [];
        else {
            this.inputKeys[key] = this.inputKeys[key].filter(
                (cb) => cb.toString() !== cb.toString()
            );
        }

        if (this.inputKeys[key].length === 0) {
            this.screen.unkey([key]);
            delete this.inputKeys[key];
        }
    }

    /**
     * handles errors
     * @param error
     * @param cb
     */
    public errorHandler(error: Error, cb?: Function) {
        this.error(error);

        if (isEnvTrue('THROW_ALL_ERRORS') || this.options?.throwErrors) {
            this.stopLoading();
            throw error;
        }

        if (!this.options?.dontDraw)
            this.displayError(error as Error, () => {
                this.errorBox.destroy();
                this.errorBox = undefined;
                if (cb) cb();
            });
    }

    /**
     *
     * @returns
     */
    public getCurrentTokenSymbol(): string {
        return 'eth';
    }

    /**
     * returns true if the current network has access to the web3
     * @returns
     */
    public hasNetworkAccess() {
        return this.currentNetworkAccess;
    }

    /**
     *
     */

    public async compileContracts(deletePrevious: boolean = false) {
        if (deletePrevious) await hre.run('cleanup');
        Helpers.log('🏗️ {bold}{cyan-fg}Compiling Contracts{/}');
        this.setLoading('Compiling Contracts', 10);
        await hre.run('compile');
        this.stopLoading();
    }

    /**
     *
     * @returns
     */
    public async loadWeb3() {
        this.currentNetworkAccess = false;
        try {
            this.currentNetwork = hre.network;
            this.setLoading('Refreshing "' + hre.network.name + '"', 10);
            this.chainId = (await ethers.provider.getNetwork()).chainId;
            this.signers = await ethers.getSigners();
            this.currentAccount = this.signers[getDefaultAccountIndex()];
            this.currentBalance = await this.currentAccount.getBalance();
            this.currentNetworkAccess = true;
        } catch (error) {
            this.currentNetworkAccess = false;
            if (isScriptMode() || this.options.scriptMode) {
                this.stopLoading();
                warning(`could not refresh web3: ${error.message}`);
                return;
            }

            this.stopLoading();
            this.errorHandler(error, async () => {
                this.errorBox.destroy();
                this.errorBox = undefined;
                try {
                    await this.loadWeb3();
                } catch (error) {
                    warning('could not refresh web3');
                }
            });
        }
        this.stopLoading();
    }

    /**
     * Returns the current web3 provider for the console, you should use this over getProvider at all times
     * @returns
     */

    public getProvider(): JsonRpcProvider {
        return ethers.provider;
    }

    /**
     * Returns the URL for the current network (location of JsonRPC)
     * @param network
     * @returns
     */
    public getNetworkEndpoint(network?: string): string {
        network = network || this.currentNetwork.name;
        let config = getConfigFile()?.hardhat?.networks[network];

        if (!config)
            throw new Error(
                `could not find network ${network} in hardhat.config.js`
            );

        let url = (config as any).url;

        if (!url)
            throw new Error(
                `could not find url for network ${network} in hardhat.config.js`
            );

        return url;
    }

    /**
     * Returns a simple static Json RPC Provider, takes the network you would like to read from. Network must be in the config.
     * @param network
     * @returns
     */
    public createStaticProvider(network?: string): StaticJsonRpcProvider {
        return new StaticJsonRpcProvider(this.getNetworkEndpoint(network));
    }

    /**
     * returns all of the InfinityMint script objects
     * @returns
     */
    public getScripts(): InfinityMintScript[] {
        return this.scripts || [];
    }

    /**
     * Will return all the deployment classes associated with a project. If you are looking for just the contract, use getProjectContract
     * @param projectName
     * @param console
     * @returns
     */
    public async getProjectDeploymentClasses(
        projectName:
            | string
            | InfinityMintTempProject
            | InfinityMintCompiledProject
            | InfinityMintDeployedProject,
        gems?: boolean
    ): Promise<Dictionary<InfinityMintDeployment>> {
        let classes = await loadProjectDeploymentClasses(projectName, this);
        let deployments: Dictionary<InfinityMintDeployment> = {};
        for (let key in classes) {
            let deployment = classes[key];
            if (!gems && deployment.isGem) continue;
            deployments[deployment.getModuleKey()] = deployment;
            deployments[deployment.getContractName()] = deployment;
        }

        return deployments;
    }

    public async loadScripts() {
        let config = getConfigFile();

        this.setLoading('Loading Scripts', 10);
        let oldProcess = process.exit;

        //call reloads
        if (this.scripts && this.scripts.length !== 0) {
            for (let i = 0; i < this.scripts.length; i++) {
                let script = this.scripts[i];

                try {
                    if (script?.reloaded)
                        await script.reloaded({
                            log: this.log,
                            debugLog: this.debugLog,
                            infinityConsole: this,
                            eventEmitter: this.getEventEmitter(),
                            script,
                        });
                } catch (error) {
                    if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
                    this.error(error);
                    this.log(
                        `{red-fg}Script Failure: {/red-fg} ${error.message} <${script.name}>`
                    );
                }
            }
        }

        let scripts = await findScripts();
        this.debugLog('found ' + scripts.length + ' InfinityMint scripts');
        this.scripts = [];
        this.debugLog('{yellow-fg}{bold}Loading Scripts...{/}');

        for (let i = 0; i < scripts.length; i++) {
            let script = scripts[i];

            try {
                this.debugLog(
                    `[${i}] requiring script <${script.name}> => ${
                        script.dir + '/' + script.base
                    }`
                );

                if (
                    !config?.settings?.scripts?.classicScripts ||
                    config?.settings?.scripts?.classicScripts.filter(
                        (value: string) => script.dir.indexOf(value) !== -1
                    ).length === 0
                ) {
                    let scriptSource = await requireScript(
                        script.dir + '/' + script.base,
                        this,
                        this.isTelnet()
                    );
                    scriptSource.fileName = script.base;
                    scriptSource.path = script.dir + '/' + script.base;
                    this.scripts.push(scriptSource);
                } else {
                    let _potentialSource: any = {};
                    if (
                        !config?.settings?.scripts?.disableMainExecution ||
                        config?.settings?.scripts?.disableMainExecution.filter(
                            (value: string) => script.dir.indexOf(value) !== -1
                        ).length === 0
                    ) {
                        (process as any)._exit = (code?: number) => {
                            warning('not allowing process exit');
                        };
                        try {
                            _potentialSource = await requireScript(
                                script.dir + '/' + script.base,
                                this,
                                this.isTelnet()
                            );
                        } catch (error) {
                            (process as any).exit = oldProcess;
                            throw error;
                        } finally {
                            (process as any).exit = oldProcess;
                        }
                    } else
                        this.scripts.push({
                            ..._potentialSource,
                            name: _potentialSource?.name || script.name,
                            path: script.dir + '/' + script.base,
                            fileName: script.base,
                            javascript: script.ext === '.js',
                            execute: async (infinitymint) => {
                                (process as any)._exit = (code?: number) => {
                                    if (code === 1)
                                        warning('exited with code 0');
                                };

                                let result = await requireScript(
                                    script.dir + '/' + script.base,
                                    this,
                                    this.isTelnet()
                                );
                                if (typeof result === 'function')
                                    await (result as any)(infinitymint);
                                else if (result.execute)
                                    await result.execute(infinitymint);

                                (process as any).exit = oldProcess;
                            },
                        });
                }

                this.debugLog(
                    `{green-fg}Script Required Successfully{/green-fg} <${script.name}>`
                );
            } catch (error) {
                if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
                this.error(error);
                this.log(
                    `{red-fg}Script Failure: {/red-fg} ${error.message} <${script.name}>`
                );
            }
        }

        (process as any).exit = oldProcess;
        this.stopLoading();
    }

    /**
     * logs to console but on the debug pipe
     * @param msg
     * @returns
     */
    public debugLog(msg: string) {
        //throw away debug log
        if (!this.PipeFactory.pipes['debug']) return;

        return this.PipeFactory.log(msg, 'debug');
    }

    /**
     * typed emit
     * @param eventName
     * @param eventParameters
     * @param eventType
     * @returns
     */
    public emit(
        eventName:
            | InfinityMintConfigEventKeys
            | InfinityMintEventKeys
            | InfinityMintNetworkEventKeys,
        eventParameters?: any,
        eventType?: any
    ) {
        this.debugLog('emitting (' + eventName + ')');
        return this.EventEmitter.emit(eventName, {
            infinityConsole: this,
            event: eventParameters,
            log: (msg) => {
                this.log(msg.toString());
            },
            eventEmitter: this.EventEmitter,
            debugLog: (msg) => {
                this.log(msg.toString(), 'debug');
            },
        } as InfinityMintEventEmit<typeof eventType>);
    }

    /**
     * Similar to gotoWindow except it does require the window to exist in the window manager
     * @param window
     */
    public async setWindow(window: InfinityMintWindow) {
        if (this.currentWindow?.isForcedOpen()) return;
        if (this.currentWindow) this.currentWindow?.hide();

        for (let i = 0; i < this.windows.length; i++) {
            let thatWindow = this.windows[i];
            if (window.toString() !== thatWindow.toString()) {
                if (window.isAlive()) window.hide();
            }
        }

        this.currentWindow = window;

        if (!this.currentWindow.hasInitialized())
            await this.createCurrentWindow();

        this.currentWindow.show();
        this.addWindowToList(window);
    }

    /**
     * creates the current window
     * @returns
     */
    private async createCurrentWindow() {
        if (!this.currentWindow || this.currentWindow.hasInitialized()) {
            return;
        }

        if (!this.currentWindow.hasContainer())
            this.currentWindow.setContainer(this);

        this.currentWindow.setScreen(this.screen);
        this.currentWindow.setBlessed(blessed);
        this.windowManager.hide();
        this.currentWindow.createFrame();
        await this.currentWindow.create();
        this.windowManager.show();
        this.windowManager.setBack();
        this.registerWindowEvents();
    }

    /**
     *
     * @param window
     */
    public async addWindowToList(window: InfinityMintWindow) {
        if (
            this.windows.filter(
                (thatWindow) => thatWindow.toString() === window.toString()
            ).length !== 0
        )
            warning('window is already in list');
        else {
            this.windows.push(window);
            this.updateWindowsList();
        }
    }

    /**
     * destroys a window, can pass in a window, id, or name
     * @param windowOrIdOrName
     */
    public async destroyWindow(windowOrIdOrName: InfinityMintWindow | string) {
        for (let i = 0; i < this.windows.length; i++) {
            if (
                this.windows[i].toString() === windowOrIdOrName.toString() ||
                this.windows[i].name === windowOrIdOrName.toString() ||
                this.windows[i].getId() === windowOrIdOrName.toString()
            ) {
                //if its a clone then just kill it. InfinityMint will clean it up automatically
                if (this.windows[i].data.clone) {
                    this.windows[i].destroy();
                    //init a dummy window to not kill console
                    this.windows[i] = new InfinityMintWindow(
                        this.windows[i].name
                    );
                    //hide it from the menu
                    this.windows[i].setHiddenFromMenu(true);
                    return;
                }

                let fileName = this.windows[i].getFileName();
                this.debugLog(
                    '{cyan-fg}Reimporting ' +
                        this.windows[i].name +
                        '{/cyan-fg}'
                );
                this.windows[i].destroy();
                this.windows[i] = requireWindow(fileName, this);
                this.windows[i].setFileName(fileName);
                this.debugLog(
                    '{green-fg}Successfully Reimported ' +
                        this.windows[i].name +
                        `{/green-fg} <${this.windows[i].getId()}>`
                );
            }
        }
    }

    /**
     * refreshes all windows
     */
    public async loadWindows() {
        let windows = await findWindows();

        this.windows = [];
        this.debugLog('{yellow-fg}{bold}Loading Windows...{/}');
        for (let i = 0; i < windows.length; i++) {
            try {
                this.debugLog('{cyan-fg}Importing{/cyan-fg} => ' + windows[i]);
                let window = requireWindow(
                    windows[i],
                    this
                ) as InfinityMintWindow;

                //check if gem or mods is in the file name
                if (
                    windows[i].includes('/gems/') ||
                    windows[i].includes('/mod/')
                ) {
                    let gemName = windows[i];

                    if (windows[i].includes('/gems/'))
                        gemName = gemName.split('/gems/')[1];
                    else if (windows[i].includes('/mod/'))
                        gemName = gemName.split('/mod/')[1];

                    gemName = gemName.split('/')[0];

                    if (gemName === '__')
                        gemName = windows[i].split('/__')[1].split('/')[0];

                    if (!this.gems[gemName]) {
                        warning(`Gem ${gemName} not found`);
                    } else {
                        this.debugLog(
                            `Window ${window.name} is a gem or mod. Setting gem to ${gemName}`
                        );
                        window.setGem(this.gems[gemName]);
                    }
                }

                if (!window.hasContainer()) window.setContainer(this);
                else warning('window has container already');

                window.setFileName(windows[i]);
                window.setBlessed(blessed);
                this.windows.push(window);
                this.debugLog(
                    `{green-fg}Succesfully Required ${window.name}{/green-fg} <` +
                        window.getId() +
                        '>'
                );
                this.updateWindowsList();
            } catch (error) {
                if (isEnvTrue('THROW_ALL_ERRORS')) throw error;
                this.PipeFactory.pipes['windows'].error(error.stack);
                this.log(
                    `{red-fg}Window Failure: {/red-fg} ${error.message} <${windows[i]}>`
                );
            }
        }

        if (this.windows.length === 0) {
            throw new Error(
                'No windows found after load. This usually means glob has failed... please report on our github'
            );
        }
    }

    /**
     * refreshs the imports in the cache to be used by the window manager. Imports are gathers from the imports folder.
     * @param dontUseCache
     */
    public async buildImports(dontUseCache?: boolean) {
        this.setLoading('Loading Imports');
        this.imports = await getImports(dontUseCache, this);
        this.stopLoading();
    }

    /**
     *
     * @param projectOrName
     * @returns
     */
    public getProjectPath(projectOrName: any) {
        let key = this.getProjectKey(projectOrName);
        if (!key) throw new Error('Project not found');

        return this.projects.database[key];
    }

    /**
     *
     * @param projectOrName
     * @returns
     */
    public getProjectKey(projectOrName: string | KeyValue) {
        let name: string;
        if (typeof projectOrName === 'string') name = projectOrName;
        else name = projectOrName.name;

        return this.projects.keys[name];
    }

    /**
     * Returns the list of paths to projects which have been found, the key is the name of the project followed by its location, you can get the key by using passing a project (or its name) into the method getProjectKey
     * @returns
     */
    public getProjectPaths(): Dictionary<path.ParsedPath> {
        return this.projects.database;
    }

    /**
     * Loads infinity mint and all of its components, used if we are not drawing console
     */
    private async load(options: InfinityMintConsoleOptions) {
        this.log(
            `{bold}💭 Loading Infinity Mint => v${getInfinityMintVersion()}{/}`
        );

        this.setLoading('Loading Gems', 20);
        await this.loadGems();
        this.log('\t{green-fg}Successfully Loaded Gems{/green-fg}');

        this.setLoading('Loading Templates', 30);
        await findTemplates();
        this.templates = getTemplates();
        this.log('\t{green-fg}Successfully Loaded Templates{/green-fg}');

        this.setLoading('Loading Export Solutions', 30);
        await findExportSolutions();
        this.exportSolutions = getExportSolutions();
        this.log('\t{green-fg}Successfully Loaded Export Solutions{/green-fg}');

        //express
        if (options.startExpress) {
            this.setLoading('Loading Express Server', 40);
            //allow console logs for express
            Helpers.setAllowExpressLogs(true);
            if (!this.ExpressServer)
                this.ExpressServer = await startExpressServer(this);
            else await this.ExpressServer.reload();
            this.log(
                '\t{green-fg}Successfully Loaded Express Server{/green-fg}'
            );
        }

        //express
        if (options.startWebSocket) {
            this.setLoading('Loading WebSocket Server', 45);

            if (this.WebSocketController) this.WebSocketController.close();
            this.WebSocketController = await startWebSocket(this);
            this.log(
                '\t{green-fg}Successfully Loaded Websocket Server{/green-fg}'
            );
        }

        if (isAllowingIPFS()) {
            this.setLoading('Loading IPFS', 50);
            this.IPFS = new IPFS();
            await this.IPFS.start();
            this.log('\t{green-fg}Successfully Loaded IPFS{/green-fg}');
        }

        this.setLoading('Loading Imports', 55);
        //refresh imports
        if (!this.imports || !hasImportCache()) await this.buildImports();

        //if we are loading UI
        if (!options.dontDraw) {
            this.createWindowManager();

            this.setLoading('Loading Custom Blessed Components', 60);
            await this.loadCustomComponents();
            this.log(
                '\t{green-fg}Successfully Loaded Custom Blessed Components{/green-fg}'
            );

            this.setLoading('Loading Windows', 75);
            await this.loadWindows();
            this.log('\t{green-fg}Successfully Loaded Windows{/green-fg}');
        }

        this.setLoading('Loading Web3', 80);
        await this.loadWeb3();
        this.log('\t{green-fg}Successfully Loaded Web3{/green-fg}');

        this.setLoading('Loading Scripts', 85);
        await this.loadScripts();
        this.log('\t{green-fg}Successfully Loaded Scripts{/green-fg}');

        this.setLoading('Loading Projects', 90);
        await this.loadProjects();
        this.log('\t{green-fg}Successfully Loaded Projects{/green-fg}');

        this.setLoading('Loading Updates', 95);
        await this.loadUpdates();
        this.log('\t{green-fg}Successfully Loaded Updates{/green-fg}');
    }

    /**
     *
     * @returns
     */
    public getExportSolutions() {
        return this.exportSolutions || {};
    }

    /**
     *
     * @returns
     */
    public getGems() {
        return this.gems || {};
    }

    /**
     * creates the infinity console UI and other elements
     * @returns
     */
    private async createUI() {
        try {
            //register core key events
            this.registerKeys();
            //set the current window from the

            if (!this.options?.initialWindow)
                this.currentWindow =
                    this.getWindowsByName('Menu')[0] || this.windows[0];
            else if (
                typeof this.options.initialWindow === typeof InfinityMintWindow
            ) {
                let potentialWindow = this.options.initialWindow as unknown;
                this.currentWindow = potentialWindow as InfinityMintWindow;
            } else {
                this.currentWindow = this.getWindowsByName(
                    this.options.initialWindow as string
                )[0];
            }
            //instantly instante windows which seek such a thing
            let instantInstantiate = this.windows.filter((thatWindow) =>
                thatWindow.shouldInstantiate()
            );

            this.debugLog(`initializing ${instantInstantiate.length} windows`);
            for (let i = 0; i < instantInstantiate.length; i++) {
                this.setLoading(
                    'Loading Window ' + instantInstantiate[i].name,
                    50
                );
                try {
                    this.debugLog(
                        `[${i}] initializing <` +
                            instantInstantiate[i].name +
                            `>[${instantInstantiate[i].getId()}]`
                    );

                    if (!instantInstantiate[i].hasContainer())
                        instantInstantiate[i].setContainer(this);

                    instantInstantiate[i].setScreen(this.screen);
                    instantInstantiate[i].createFrame();
                    await instantInstantiate[i].create();
                    instantInstantiate[i].hide();
                    //register events
                    this.registerWindowEvents(instantInstantiate[i]);
                } catch (error) {
                    warning(
                        `[${i}] error initializing <` +
                            instantInstantiate[i].name +
                            `>[${instantInstantiate[i].getId()}]: ` +
                            error.message
                    );
                }
            }

            this.debugLog(
                `finished initializing ${instantInstantiate.length} windows`
            );

            this.setLoading('Loading Current Window', 70);
            await this.createCurrentWindow(); //create the current window
            this.stopLoading();
            //render
            this.screen.render();
            //set window manager to the back
            this.windowManager.setBack();
            //hide the current window
            this.currentWindow.hide();
        } catch (error: Error | any) {
            exposeLogs(true);

            if (this.isDrawing()) this?.screen?.destroy();

            console.log(`
            {red-fg}Error: ${error.message}:${(error as Error).name}{/red-fg}
            {red-fg}Stack: ${error.stack}{/red-fg}
            Something really bad happened. Please check your /temp/pipes folder for a full log output
            {red-fg}If you are using a custom window, please check your window for errors{/red-fg}
            {cyan-fg}Current window: ${
                this?.currentWindow?.name || 'NO CURRENT WINDOW'
            }{/cyan-fg}
            `);

            try {
                Object.keys(this.PipeFactory.pipes || {}).forEach((pipe) => {
                    try {
                        this.PipeFactory.savePipe(pipe);
                    } catch (error) {}
                });
            } catch (error) {}

            process.exit(1);
        }
    }

    /**
     * Initializes the InfinityConsole, calling all necessary functions to get the console up and running. This function is asynchronous and should be called with await.
     * @returns
     */
    public async initialize() {
        //register keyboard shortcuts
        this.registerDefaultKeys();
        //if the network member has been defined then we have already initialized
        try {
            await this.load(this.options);

            if (this.options.dontDraw) {
                warning(
                    `InfinityConsole will not draw! Windows & Blessed elements inaccessible`
                );
            } else {
                //create the window manager
                this.createWindowManager();
                await this.createUI();
                //hide loading screen
                this.stopLoading();

                //the think method for this console
                let int = () => {
                    if (!this.hasInitialized) return;
                    this.loadingBox.setFront();
                    if (this.errorBox !== undefined) this.errorBox.setFront();

                    this.windows.forEach((window) => {
                        if (
                            window.isAlive() &&
                            (window.shouldBackgroundThink() ||
                                (!window.shouldBackgroundThink() &&
                                    window.isVisible()))
                        )
                            window.update();
                    });

                    this.screen.render();
                };

                this.think = setInterval(() => {
                    if (!this.hasInitialized) return;
                    (this.options?.think || int)();
                    this.tick++;

                    //bit of a hacky solution but keeps these buttons forward
                    if (this.currentWindow) {
                        Object.values(this.currentWindow.elements)
                            .filter((element) => !element.hidden)
                            .forEach((element) => {
                                if (
                                    !this.options.dontDraw &&
                                    element.alwaysBack
                                )
                                    element.setBack();
                                if (
                                    !this.options.dontDraw &&
                                    element.alwaysFront
                                )
                                    element.setFront();
                                if (
                                    !this.options.dontDraw &&
                                    element.alwaysFocus
                                )
                                    element.focus();
                                if (
                                    !this.options.dontDraw &&
                                    (element.options.mouse ||
                                        element.options.keys)
                                )
                                    element.enableInput();

                                if (
                                    element.think &&
                                    typeof element.think === 'function' &&
                                    (!element.hidden || element.alwaysUpdate)
                                )
                                    element.think(
                                        this.currentWindow,
                                        element,
                                        blessed
                                    );
                            });
                    }

                    this.windowManager.setBack();
                    this.loadingBox.setFront();

                    if (this.errorBox && !this.errorBox.hidden)
                        this.errorBox.setFront();
                }, this.options?.tickRate || (this.isTelnet() ? 346 : 100));

                this.windowManager.hide();
                this.splashScreen.show();
                this.splashScreen.setFront();
                setTimeout(() => {
                    this.splashScreen.hide();
                    this.windowManager.show();
                    this.windowManager.setBack();
                    this.currentWindow.show();
                    this.screen.render();
                }, 2000);
            }
        } catch (error) {
            exposeLogs(true);

            if (this.screen)
                try {
                    this.screen?.destroy();
                } catch (e) {}

            console.log(`
            {red-fg}Error: ${error.message}{/red-fg}
            {red-fg}Stack: ${error.stack}{/red-fg}
            Something really bad happened. Please check your /temp/pipes folder for a full log output
            {red-fg}If you are using a custom window, please check your window for errors{/red-fg}
            {cyan-fg}Current window: ${
                this.currentWindow?.name || 'NO CURRENT WINDOW'
            }{/cyan-fg}
            `);

            try {
                Object.keys(this.PipeFactory.pipes || {}).forEach((pipe) => {
                    try {
                        this.PipeFactory.savePipe(pipe);
                    } catch (error) {}
                });
            } catch (error) {}

            process.exit(1);
        }

        this.hasInitialized = true;
        this.emit('initialized');
    }
}
export default InfinityConsole;
