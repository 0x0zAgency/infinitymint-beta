(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "hardhat", "fs", "./helpers", "hardhat", "./telnet", "./interfaces", "./window", "./web3", "./templates", "./pipes", "./deployments", "path", "./imports", "@ethersproject/providers", "blessed", "./projects", "./gems", "./express", "./ipfs", "./webSocket", "./web3", "./projects", "./helpers", "./deployments", "./updates"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InfinityConsole = void 0;
    const tslib_1 = require("tslib");
    const hardhat_1 = require("hardhat");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const helpers_1 = require("./helpers");
    const hardhat_2 = tslib_1.__importDefault(require("hardhat"));
    const telnet_1 = require("./telnet");
    const interfaces_1 = require("./interfaces");
    const window_1 = require("./window");
    const web3_1 = require("./web3");
    const templates_1 = require("./templates");
    const pipes_1 = require("./pipes");
    const deployments_1 = require("./deployments");
    const path_1 = tslib_1.__importDefault(require("path"));
    const imports_1 = require("./imports");
    const providers_1 = require("@ethersproject/providers");
    //blessed
    const blessed_1 = tslib_1.__importDefault(require("blessed"));
    const projects_1 = require("./projects");
    const gems_1 = require("./gems");
    const express_1 = require("./express");
    const ipfs_1 = require("./ipfs");
    const webSocket_1 = require("./webSocket");
    const web3_2 = require("./web3");
    //
    const Projects = tslib_1.__importStar(require("./projects"));
    const Helpers = tslib_1.__importStar(require("./helpers"));
    const Deployments = tslib_1.__importStar(require("./deployments"));
    const updates_1 = require("./updates");
    //uuid stuff
    const { v4: uuidv4 } = require('uuid');
    /**
     * Powered by Blessed-cli the InfinityConsole is the container of InfinityMintWindows and all things Web3 related. See {@link app/window.InfinityMintWindow}.
     */
    class InfinityConsole {
        /**
         * constructor for the InfinityConsole, see {@link app/window.InfinityMintWindow}
         * @param options
         * @param pipeFactory
         * @param telnetServer
         * @param eventEmitter
         */
        constructor(options, pipeFactory, telnetServer, eventEmitter) {
            var _a, _b;
            //This allows for developers to access these three modules from the console. This is useful for developers who want to use only the console like a module. (like in jsGlue)
            /**
             * This is the projects module. It contains all the functions for managing projects. See {@link app/projects}
             */
            this.Projects = Projects;
            /**
             * This is the helpers module. It contains useful utils. See {@link app/helpers}
             */
            this.Helpers = Helpers;
            /**
             * This is the deployments module. It contains all the functions for managing deployments. See {@link app/deployments}
             */
            this.Deployments = Deployments;
            /**
             * returns true if the console has successfully connected to a network
             */
            this.currentNetworkAccess = false;
            /**
             *
             */
            this.firstTime = true;
            this.PipeFactory = pipeFactory || pipes_1.defaultFactory;
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
                let config = (0, helpers_1.getConfigFile)();
                if ((_a = this.options.blessed) === null || _a === void 0 ? void 0 : _a.fullUnicode)
                    (0, helpers_1.setAllowEmojis)(true);
                if (config.music)
                    this.player = require('play-sound')({ player: 'afplay' });
                this.debugLog(`starting blessed on InfinityConsole<${this.sessionId}>`);
                this.screen = blessed_1.default.screen(((_b = this.options) === null || _b === void 0 ? void 0 : _b.blessed) || {
                    fastCRS: true,
                    smartCRS: true,
                    autoPadding: true,
                    dockBorders: true,
                    sendFocus: true,
                });
                //captures errors which happen in key events in the window
                this.captureEventErrors();
                this.loadingBox = blessed_1.default.loading({
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
                let splashPath = path_1.default
                    .join(__dirname, '../resources/splashscreen.txt')
                    .replace('dist/', '');
                let content = fs_1.default.existsSync(splashPath)
                    ? fs_1.default.readFileSync(splashPath, {
                        encoding: 'utf-8',
                    })
                    : 'InfinityMint';
                this.splashScreen = blessed_1.default.box({
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
        loadCustomComponents() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                //load custom components
                yield (0, helpers_1.findCustomBlessedElements)();
                //add custom elements
                let elements = (0, helpers_1.getCustomBlessedElements)();
                if (Object.keys(elements).length !== 0) {
                    this.log('registering custom elements to window', 'debug');
                    Object.keys(elements).forEach((key) => {
                        try {
                            let element = elements[key];
                            if (require.cache['./elements/Base'])
                                delete require.cache['./elements/Base'];
                            let base = require('./elements/Base');
                            blessed_1.default[key] = base(key, element);
                        }
                        catch (error) {
                            if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS'))
                                throw error;
                            this.PipeFactory.pipes['windows'].error(error);
                            this.log(`{red-fg}Element Failure: {/red-fg} ${error.message} <${key}>`);
                        }
                    });
                }
            });
        }
        /**
         * returns a guuidv4 id
         * @returns
         */
        generateId() {
            return uuidv4();
        }
        /**
         * gets the gems
         */
        loadGems() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.debugLog('{yellow-fg}{bold}Loading Gems...{/}');
                let gems = yield (0, gems_1.includeGems)();
                this.gems = gems;
                yield (0, gems_1.loadGems)(this);
            });
        }
        getLoadingBox() {
            return this.loadingBox;
        }
        /**
         * will return the telnet username of this console
         * @returns
         */
        getTelnetUsername() {
            if (!this.telnetClient)
                return 'root';
        }
        /**
         * set the telnet client of this console. you should not need to call this method.
         * @param client
         */
        setTelnetClient(client) {
            this.telnetClient = client;
        }
        /**
         *
         * @param eventEmitter
         */
        setEventEmitter(eventEmitter) {
            this.EventEmitter = eventEmitter;
        }
        /**
         * sets the event emitter of this console to another consoles event emitter returning the old one
         * @param otherConsole
         * @returns
         */
        setEventEmitterFromConsole(otherConsole) {
            let oldEmitter = this.EventEmitter;
            this.EventEmitter = otherConsole.EventEmitter;
            return oldEmitter;
        }
        /**
         * retursn true if this console is a telnet console
         * @returns
         */
        isTelnet() {
            let config = (0, helpers_1.getConfigFile)();
            return config.telnet && this.TelnetServer !== undefined;
        }
        /**
         * creates a new event emitter for this console
         * @param dontCleanListeners
         * @returns
         */
        createEventEmitter(dontCleanListeners) {
            var _a;
            let config = (0, helpers_1.getConfigFile)();
            if (!dontCleanListeners)
                try {
                    if (this.EventEmitter)
                        (_a = this.EventEmitter) === null || _a === void 0 ? void 0 : _a.removeAllListeners();
                }
                catch (error) {
                    if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS'))
                        throw error;
                    (0, helpers_1.warning)('unable to remove all listeners on eventEMitter');
                }
            this.EventEmitter = new interfaces_1.InfinityMintEventEmitter();
            //define these events
            if (config.events)
                Object.keys(config.events).forEach((event) => {
                    this.debugLog('new event registered => ' + event);
                    try {
                        this.EventEmitter.off(event, config.events[event]);
                    }
                    catch (error) { }
                    this.EventEmitter.on(event, config.events[event]);
                });
            //define these events
            let telnetEvents = (0, telnet_1.getTelnetOptions)();
            if (telnetEvents === null || telnetEvents === void 0 ? void 0 : telnetEvents.events)
                Object.keys(telnetEvents.events).forEach((event) => {
                    this.debugLog('new telnet event registered => ' + event);
                    try {
                        this.EventEmitter.off(event, telnetEvents.events[event]);
                    }
                    catch (error) { }
                    this.EventEmitter.on(event, telnetEvents.events[event]);
                });
            return this.EventEmitter;
        }
        /**
         * gets the consoles session id. this is used to identify the console in the telnet server as well as also being used to identify the console in the event emitter
         * @returns
         */
        getSessionId() {
            return this.sessionId;
        }
        /**
         * gets the consoles event emitter
         * @returns
         */
        getEventEmitter() {
            return this.EventEmitter;
        }
        /**
         * gets the screen the console is running on
         * @returns
         */
        getScreen() {
            return this.screen;
        }
        /**
         * returns the current account of the console which is the first member of the signers array but with a correctly resolved address
         * @returns
         */
        getCurrentAccount() {
            return this.currentAccount;
        }
        /**
         * returns the current balance of the account
         * @returns
         */
        getCurrentBalance() {
            return this.currentBalance;
        }
        /**
         * returns the current chain id
         * @returns
         */
        getCurrentChainId() {
            var _a;
            return parseInt(((_a = this.chainId) === null || _a === void 0 ? void 0 : _a.toString()) || '-1');
        }
        /**
         * logs a message to the console
         * @param msg
         * @param pipe
         */
        log(msg, pipe) {
            this.PipeFactory.log(`${msg} ${this.isTelnet() ? ` <${this.sessionId}}>` : ''}`, pipe || 'default');
        }
        /**
         * logs an error to the default pipe
         * @param error
         */
        error(error) {
            if ((0, helpers_1.isScriptMode)())
                console.log(error);
            this.PipeFactory.error(error);
        }
        /**
         * initializes the input keys property to equal the default keyboard shortcuts allowing the user to navigate the console and close windows
         */
        registerDefaultKeys() {
            const close = (ch, key) => {
                var _a, _b, _c, _d;
                if (!this.isDrawing())
                    return;
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
                if (((_a = this.currentWindow) === null || _a === void 0 ? void 0 : _a.name) !== 'CloseBox') {
                    let windows = this.getWindowsByName('CloseBox');
                    if (windows.length !== 0)
                        windows[0].options.currentWindow = (_b = this.currentWindow) === null || _b === void 0 ? void 0 : _b.name;
                    this.setCurrentWindow('CloseBox');
                    //if the closeBox aka the current window is visible and we press control-c again just exit
                }
                else if (((_c = this.currentWindow) === null || _c === void 0 ? void 0 : _c.name) === 'CloseBox') {
                    if (this.telnetClient) {
                        this.destroy();
                        return;
                    }
                    if (this.currentWindow.isVisible()) {
                        (_d = this.currentAudio) === null || _d === void 0 ? void 0 : _d.kill();
                    }
                    else
                        this.currentWindow.show();
                    //exit
                    process.exit(1);
                }
            };
            //default input keys
            this.inputKeys = {
                'C-l': [
                    (ch, key) => {
                        var _a, _b;
                        if (((_a = this.currentWindow) === null || _a === void 0 ? void 0 : _a.name) !== 'Logs')
                            this.screen.lastWindow = this.currentWindow;
                        (_b = this.currentWindow) === null || _b === void 0 ? void 0 : _b.openWindow('Logs');
                    },
                ],
                'C-r': [
                    (ch, key) => {
                        if (this.currentWindow &&
                            this.currentWindow.isVisible() &&
                            this.currentWindow.canRefresh())
                            this.reloadWindow(this.currentWindow);
                        else
                            this.reload(true);
                    },
                ],
                'C-i': [
                    (ch, key) => {
                        this.reload(true);
                    },
                ],
                'C-p': [
                    (ch, key) => {
                        this.setCurrentWindow('Projects');
                    },
                ],
                //shows the current video
                'C-x': [
                    (ch, key) => {
                        var _a, _b, _c;
                        if (this.screen.lastWindow) {
                            (_a = this.currentWindow) === null || _a === void 0 ? void 0 : _a.hide();
                            this.currentWindow = this.screen.lastWindow;
                            delete this.screen.lastWindow;
                        }
                        this.updateWindowsList();
                        if (!((_b = this.windowManager) === null || _b === void 0 ? void 0 : _b.hidden))
                            (_c = this.currentWindow) === null || _c === void 0 ? void 0 : _c.show();
                    },
                ],
                //hides the current window
                'C-z': [
                    (ch, key) => {
                        var _a;
                        this.updateWindowsList();
                        (_a = this.currentWindow) === null || _a === void 0 ? void 0 : _a.hide();
                        this.windowManager.show();
                    },
                ],
                up: [
                    (ch, key) => {
                        var _a;
                        if ((_a = this.currentWindow) === null || _a === void 0 ? void 0 : _a.isVisible())
                            return;
                        this.windowManager.focus();
                    },
                ],
                down: [
                    (ch, key) => {
                        var _a;
                        if ((_a = this.currentWindow) === null || _a === void 0 ? void 0 : _a.isVisible())
                            return;
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
        getSigner() {
            return this.getSigners()[0];
        }
        /**
         * gets all the signers currently set in the console
         * @returns
         */
        getSigners() {
            if (!this.signers)
                throw new Error('signers must be initialized before getting signer');
            return this.signers;
        }
        hasExpressServer() {
            return this.ExpressServer !== undefined;
        }
        hasWebSockets() {
            return this.WebSocketController !== undefined;
        }
        /**
         * reloads a window by removing it from the windows array, removing the cached window and then re-instantiating it. This reloads the script which defines the window with code updates and re-renders the window
         * @param thatWindow
         */
        reloadWindow(thatWindow) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.setLoading('Reloading ' + thatWindow.toString());
                for (let i = 0; i < this.windows.length; i++) {
                    let window = this.windows[i];
                    if (window.toString() !== thatWindow.toString() &&
                        window.name !== thatWindow.toString())
                        continue;
                    try {
                        let shouldInstantiate = false;
                        if (this.currentWindow.toString() === window.toString() ||
                            this.currentWindow.name === window.name) {
                            shouldInstantiate = true;
                            this.currentWindow.hide();
                        }
                        let fileName = window.getFileName();
                        window.log('reloading blessed elements');
                        yield this.loadCustomComponents();
                        this.debugLog('{cyan-fg}Reimporting ' + window.name + '{/cyan-fg}');
                        let newWindow = (0, helpers_1.requireWindow)(fileName, this);
                        this.debugLog('{green-fg}Successfully Reimported ' +
                            newWindow.name +
                            `{/green-fg} <${newWindow.getId()}>`);
                        window.destroy();
                        newWindow.setFileName(fileName);
                        newWindow.setBlessed(blessed_1.default);
                        this.windows[i] = newWindow;
                        this.currentWindow = newWindow;
                        if (shouldInstantiate) {
                            yield this.createCurrentWindow();
                        }
                    }
                    catch (error) {
                        this.errorHandler(error);
                    }
                }
                this.stopLoading();
            });
        }
        /**
         * registers events on the window
         * @param window
         * @returns
         */
        registerWindowEvents(window) {
            if (!this.currentWindow && !window)
                return;
            window = window || this.currentWindow;
            if (!window)
                return;
            //when the window is destroyed, rebuild the items list
            this.debugLog('registering events window specific for <' +
                window.name +
                `>[${window.getId()}]`);
            //so we only fire once
            if (window.data.destroy)
                window.off('destroy', window.data.destroy);
            window.data.destroy = () => {
                this.updateWindowsList();
            };
            window.on('destroy', window.data.destroy);
            //so we only fire once
            if (window.data.hide)
                window.off('hide', window.data.hide);
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
        executeScript(scriptName, scriptArguments = {}, argv = {}, showDebugLogs) {
            var _a, _b;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let script = this.getScript(scriptName);
                if (!script)
                    throw new Error('cannot find script: ' + scriptName);
                if (!argv)
                    argv = {};
                if (script.arguments === undefined)
                    script.arguments = [];
                Object.keys(argv).map((key, index) => {
                    let value = argv[key];
                    if (!value || value.length === 0)
                        value = true;
                    if (key[0] === '_')
                        return;
                    if (key[0] === '$' && argv._.length !== 0) {
                        let index = key.split('$')[1];
                        if (index === undefined)
                            return;
                        key = script.arguments[index].name;
                        value = argv._[parseInt(index)] || '';
                    }
                    if (script.arguments[key] === undefined)
                        scriptArguments[key] = Object.assign(Object.assign({}, (script.arguments[key] || {})), { name: key, value: value });
                    if (scriptArguments[key].type === 'boolean') {
                        if (value === 'true' || value === '')
                            scriptArguments[key].value = true;
                        else if (value === 'false')
                            scriptArguments[key].value = false;
                        else
                            throw new Error('Invalid value for boolean argument: ' +
                                key +
                                ' (expected true or false)');
                    }
                    if (scriptArguments[key].type === 'number') {
                        if (isNaN(value))
                            throw new Error('Invalid value for number argument: ' +
                                key +
                                ' (expected number)');
                        else
                            scriptArguments[key].value = parseInt(value);
                    }
                    if (scriptArguments[key].validator &&
                        scriptArguments[key].validator(scriptArguments[key].value) ===
                            false)
                        throw new Error('Invalid value for argument: ' + key + ' (failed validator');
                });
                Object.keys(scriptArguments).forEach((arg) => {
                    if (!scriptArguments[arg].name)
                        scriptArguments[arg].name = arg;
                });
                Object.values(script.arguments).forEach((arg) => {
                    if (!arg.optional && !scriptArguments[arg.name])
                        throw new Error('Missing required argument: ' + arg.name);
                });
                this.log('Script args => ' + JSON.stringify(scriptArguments, null, 4), 'express');
                yield (0, web3_2.executeScript)(script, this.getEventEmitter(), {}, //gems when we get them
                scriptArguments, this, !this.options.test, showDebugLogs !== undefined
                    ? showDebugLogs
                    : ((_a = scriptArguments['show-debug-logs']) === null || _a === void 0 ? void 0 : _a.value) ||
                        ((_b = scriptArguments['show-all-logs']) === null || _b === void 0 ? void 0 : _b.value) ||
                        helpers_1.directlyOutputLogs ||
                        false);
            });
        }
        /**
         * sets current window to what ever is passed in and shows it
         * @param thatWindow
         * @returns
         */
        setCurrentWindow(thatWindow) {
            var _a;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if ((_a = this.currentWindow) === null || _a === void 0 ? void 0 : _a.isForcedOpen())
                    return;
                if (this.currentWindow)
                    this.currentWindow.hide();
                for (let i = 0; i < this.windows.length; i++) {
                    let window = this.windows[i];
                    if (window.toString() !== thatWindow.toString() &&
                        window.name !== thatWindow.toString()) {
                        if (thatWindow === 'CloseBox')
                            window.hide();
                        continue;
                    }
                    this.currentWindow = window;
                    yield this.createCurrentWindow();
                    this.currentWindow.show();
                }
            });
        }
        /**
         * destroys the console
         */
        destroy() {
            var _a, _b;
            this.emit('destroyed');
            this.cleanup();
            this.screen.destroy();
            if ((_a = this === null || this === void 0 ? void 0 : this.telnetClient) === null || _a === void 0 ? void 0 : _a.writable) {
                try {
                    (_b = this.telnetClient) === null || _b === void 0 ? void 0 : _b.destroy();
                }
                catch (error) {
                    (0, helpers_1.warning)('could not destroy: ' + error.message);
                }
            }
            this.telnetClient = undefined;
        }
        /**
         * cleans up the console ready to be reloaded
         */
        cleanup() {
            var _a, _b;
            this.hasInitialized = false;
            //then start destorying
            Object.keys(this.inputKeys).forEach((key) => {
                this.unkey(key);
            });
            //more destroying
            this.imports = undefined;
            this.currentWindow = undefined;
            (_a = this.windows) === null || _a === void 0 ? void 0 : _a.forEach((window) => window === null || window === void 0 ? void 0 : window.destroy());
            this.windows = [];
            this.currentNetwork = undefined;
            (_b = this.windowManager) === null || _b === void 0 ? void 0 : _b.destroy();
            this.windowManager = undefined;
        }
        /**
         * reloads the projects
         */
        loadProjects(useCache) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let projects = yield (0, projects_1.findProjects)();
                this.projects = (0, projects_1.writeParsedProjects)(projects);
            });
        }
        /**
         * reloads the updates
         * @param useCache
         */
        loadUpdates(useCache = false) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let updates = yield (0, updates_1.loadUpdates)([], !useCache);
                this.updates = updates;
            });
        }
        /**
         * Returns the current infinity mint projet
         * @returns
         */
        getCurrentProject() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!(0, projects_1.getCurrentProject)())
                    return null;
                return yield this.getProject((0, projects_1.getCurrentProject)());
            });
        }
        /**
         *
         * @returns if the current project is valid
         */
        hasCurrentProject() {
            let session = (0, helpers_1.readGlobalSession)();
            if (!session)
                return false;
            if (!session.environment.defaultProject)
                return false;
            if (!session.environment.project)
                return false;
            if (!this.projects)
                return false;
            if (!this.hasProject(session.environment.project))
                return false;
            return true;
        }
        /**
         * Returns true if this project exists, used to check if project or full name exists
         * @param projectOrFullName
         * @returns
         */
        hasProject(projectOrFullName) {
            let name;
            if (typeof projectOrFullName === 'string')
                name = projectOrFullName;
            else
                name = projectOrFullName.name;
            return this.projects.keys[name] !== undefined;
        }
        /**
         * Reloads the current infinitymint.config.ts
         */
        reloadConfig() {
            (0, helpers_1.getConfigFile)(true);
        }
        /**
         * returns a list of all the projects found
         * @returns
         */
        getProjectNames() {
            return this.projects.projects;
        }
        /**
         * Returns a project class. You can enter just the name of the project to be returned a class or pass in deployed or compiled project data to create a classed based off of that
         * @param projectOrFullName
         * @returns
         */
        getProject(projectOrFullName, network, version) {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let name;
                version =
                    version ||
                        (typeof projectOrFullName === 'string'
                            ? Projects.getProjectVersion(projectOrFullName)
                            : (_a = projectOrFullName === null || projectOrFullName === void 0 ? void 0 : projectOrFullName.version) === null || _a === void 0 ? void 0 : _a.version);
                if (typeof projectOrFullName !== 'string')
                    name = Projects.getProjectName(projectOrFullName);
                else {
                    name = projectOrFullName;
                    name = projectOrFullName.split('@')[0];
                }
                if (!name)
                    throw new Error('no project found: ' + name);
                if (typeof projectOrFullName === 'string') {
                    if (!network && projectOrFullName.indexOf('_') !== -1)
                        network = (_b = projectOrFullName === null || projectOrFullName === void 0 ? void 0 : projectOrFullName.split('_')) === null || _b === void 0 ? void 0 : _b.pop();
                    if (!version && projectOrFullName.indexOf('@') !== -1)
                        version = (_d = (_c = projectOrFullName === null || projectOrFullName === void 0 ? void 0 : projectOrFullName.split('@')) === null || _c === void 0 ? void 0 : _c.pop()) === null || _d === void 0 ? void 0 : _d.split('_')[0];
                }
                return Projects.getProject(name, network ||
                    ((_e = projectOrFullName === null || projectOrFullName === void 0 ? void 0 : projectOrFullName.network) === null || _e === void 0 ? void 0 : _e.name) ||
                    hardhat_2.default.network.name, this, version || ((_f = projectOrFullName === null || projectOrFullName === void 0 ? void 0 : projectOrFullName.version) === null || _f === void 0 ? void 0 : _f.version));
            });
        }
        /**
         * returns a compiled project
         * @param projectOrFullName
         * @returns
         */
        getCompiledProject(projectOrFullName) {
            return (0, projects_1.getCompiledProject)(projectOrFullName);
        }
        /**
         * returns a deployed project
         * @param projectOrFullName
         * @param network
         * @returns
         */
        getDeployedProject(projectOrFullName, network) {
            network = network || this.network.name;
            let project = (0, projects_1.findProject)(projectOrFullName);
            if (!project)
                throw new Error('no project found: ' + projectOrFullName);
            return (0, projects_1.getDeployedProject)(project, network);
        }
        get network() {
            return this.currentNetwork;
        }
        /**
         * reloads the console
         * @param refreshImports
         */
        reload(refreshImports) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.hasInitialized = false;
                try {
                    this.log(`{bold}{cyan-fg}Reloading InfinityMint{/cyan-fg}{/bold} => InfinityMint Console`);
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
                    yield this.initialize();
                    //rebuild imports
                    yield this.buildImports(refreshImports);
                    //render
                    this.screen.render();
                    yield this.reloadWindow(this.currentWindow);
                }
                catch (error) {
                    this.errorHandler(error);
                }
            });
        }
        /**
         * gets a window by its guid
         * @param id
         * @returns
         */
        getWindowById(id) {
            return this.windows
                .filter((thatWindow) => thatWindow.getId() === id.toString())
                .pop();
        }
        /**
         *
         * @returns
         */
        getCurrentDeployedProject() {
            return (0, projects_1.getDeployedProject)(this.getCurrentProject(), this.network.name);
        }
        /**
         *
         * @returns
         */
        getCurrentCompiledProject() {
            if (!this.getCurrentProject())
                return null;
            return (0, projects_1.getCompiledProject)(this.getCurrentProject());
        }
        /**
         * returns the current consoles imports
         * @returns
         */
        getImports() {
            return this.imports;
        }
        /**
         * returns the current consoles imports
         * @returns
         */
        getProjects() {
            return this.projects;
        }
        /**
         * Returns current project updates
         * @returns
         */
        getUpdates() {
            return this.updates;
        }
        /**
         * gets a list of windows orderd by creation date
         * @param name
         * @param oldest
         * @returns
         */
        getWindowByAge(name, oldest) {
            let windows = this.getWindowsByName(name);
            if (oldest) {
                windows = windows.sort((a, b) => {
                    return a.getCreation() - b.getCreation();
                });
            }
            else {
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
        getWindowsByName(name) {
            return this.windows.filter((thatWindow) => thatWindow.name === name);
        }
        /**
         * gets the current tick of the console. The tick is the number of times the console has been updated. The speed of which the console updates is determined by the config file
         * @returns
         */
        getTick() {
            return this.tick;
        }
        /**
         * Adds a window to the console
         * @param window
         */
        addWindow(window) {
            if (this.hasWindow(window))
                throw new Error('window with that id is already inside of the console');
            this.windows.push(window);
        }
        /**
         * returns true if there is a request to kill the current audio stream
         * @returns
         */
        isAudioAwaitingKill() {
            if (!(0, helpers_1.getConfigFile)().music)
                return false;
            return this.currentAudioAwaitingKill;
        }
        /**
         * returns a window by name
         * @param windowName
         * @returns
         */
        getWindow(windowName) {
            return this.getWindowsByName(windowName)[0];
        }
        /**
         * returns true if the window exists
         * @param windowName
         * @returns
         */
        hasWindowName(windowName) {
            return this.getWindowsByName(windowName).length !== 0;
        }
        /**
         * returns true if audio is current playing
         * @returns
         */
        isAudioPlaying() {
            if (!(0, helpers_1.getConfigFile)().music)
                false;
            return !!this.currentAudio;
        }
        /**
         * Stops the current audio file
         * @returns
         */
        stopAudio() {
            var _a, _b;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!(0, helpers_1.getConfigFile)().music)
                    return;
                if ((_a = this.currentAudio) === null || _a === void 0 ? void 0 : _a.kill) {
                    (_b = this.currentAudio) === null || _b === void 0 ? void 0 : _b.kill();
                    yield this.hasAudioBeenKilled();
                }
                else {
                    this.currentAudioAwaitingKill = false;
                    this.currentAudioKilled = true;
                }
            });
        }
        /**
         * plays an audio file using a child process to a music player executable on the system. Does not work if music is disabled in config. Will not work over telnet. Might not work on windows.
         * @param path
         * @param onFinished
         * @param onKilled
         * @returns
         */
        playAudio(path, onFinished, onKilled) {
            if (!(0, helpers_1.getConfigFile)().music)
                return;
            this.currentAudioKilled = false;
            this.debugLog('playing => ' + (0, helpers_1.cwd)() + path);
            // configure arguments for executable if any
            this.currentAudio = this.player.play((0, helpers_1.cwd)() + path, { afplay: ['-v', 1] /* lower volume for afplay on OSX */ }, (err) => {
                if (err && !this.currentAudio.killed) {
                    if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS'))
                        throw err;
                    else
                        (0, helpers_1.warning)('cannot play file: ' + (err === null || err === void 0 ? void 0 : err.message));
                    return;
                }
                if (this.currentAudio.killed) {
                    this.debugLog('killed => ' + (0, helpers_1.cwd)() + path);
                    this.currentAudio = null;
                    this.currentAudioKilled = true;
                    if (onKilled)
                        onKilled(this.currentWindow, this);
                }
                else {
                    this.debugLog('finished playing => ' + (0, helpers_1.cwd)() + path);
                    this.currentAudio = null;
                    if (onFinished)
                        onFinished(this.currentWindow, this);
                }
            });
        }
        /**
         * gets the current window
         * @returns
         */
        getCurrentWindow() {
            return this.currentWindow;
        }
        /**
         * Returns true if there is a current window
         * @returns
         */
        hasCurrentWindow() {
            return !!this.currentWindow;
        }
        /**
         * Returns true if the current window has killed the audio after it was requested to stop playing.
         * @returns
         */
        hasAudioBeenKilled() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!(0, helpers_1.getConfigFile)().music)
                    return;
                if (this.currentAudioKilled)
                    return;
                this.currentAudioAwaitingKill = true;
                yield new Promise((resolve, reject) => {
                    let int = setInterval(() => {
                        if (this.currentAudioKilled || !this.currentWindow.isAlive()) {
                            clearInterval(int);
                            resolve(true);
                            this.currentAudioAwaitingKill = false;
                            return;
                        }
                    }, 1000);
                });
            });
        }
        hasWindow(window) {
            return (this.windows.filter((thatWindow) => thatWindow.getId() === window.getId()).length !== 0);
        }
        /**
         * Updates the windows list with the current windows in the console
         * @returns
         */
        updateWindowsList() {
            if (this.options.dontDraw)
                return;
            this.windowManager.setBack();
            this.windowManager.enableKeys();
            this.windowManager.enableMouse();
            try {
                this.windowManager.setItems(this.windows
                    .filter((window) => !window.isHiddenFromMenu())
                    .map((window, index) => `{bold}[${index.toString().padEnd(4, '0')}]{bold}` +
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
                            : ''))));
            }
            catch (error) {
                if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS'))
                    throw error;
                (0, helpers_1.warning)('cannot update window manager: ' + (error === null || error === void 0 ? void 0 : error.message));
            }
            this.windowManager.show();
        }
        /**
         * shows a loading bar with a message in the center of the screen
         * @param msg
         * @param filled
         * @returns
         */
        setLoading(msg, filled) {
            if (this.options.dontDraw || !this.loadingBox || this.firstTime)
                return;
            this.loadingBox.setFront();
            this.loadingBox.load(msg);
            this.loadingBox.filled = this.loadingBox.filled || filled || 100;
            this.screen.render();
        }
        isDrawing() {
            return this.options.dontDraw !== true;
        }
        /**
         * stops the loading bar from appearing
         * @returns
         */
        stopLoading() {
            if (this.options.dontDraw)
                return;
            this.loadingBox.stop();
            this.loadingBox.setBack();
            this.screen.render();
        }
        /**
         * creates the window manager
         */
        createWindowManager() {
            var _a, _b;
            //incase this is ran again, delete the old windowManager
            if (this.windowManager) {
                (_a = this.windowManager) === null || _a === void 0 ? void 0 : _a.free();
                (_b = this.windowManager) === null || _b === void 0 ? void 0 : _b.destroy();
                this.windowManager = undefined;
            }
            //creating window manager
            this.windowManager = blessed_1.default.list({
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
            this.windowManager.on('select', (_el, selected) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                var _c, _d, _e, _f, _g;
                try {
                    if ((_c = this.currentWindow) === null || _c === void 0 ? void 0 : _c.isForcedOpen()) {
                        this.currentWindow.show();
                        return;
                    }
                    //disable the select if the current window is visible
                    if ((_d = this.currentWindow) === null || _d === void 0 ? void 0 : _d.isVisible())
                        return;
                    //set the current window to the one that was selected
                    this.currentWindow = this.windows.filter((window) => !window.isHiddenFromMenu())[selected];
                    if (!this.currentWindow) {
                        (0, helpers_1.warning)('current window is undefined');
                        this.updateWindowsList();
                        this.currentWindow = this.getWindow('Menu');
                        return;
                    }
                    if (!this.currentWindow.hasInitialized()) {
                        //reset it
                        this.currentWindow.destroy();
                        //create it again
                        yield this.createCurrentWindow();
                    }
                    else if (!this.currentWindow.isVisible())
                        this.currentWindow.show();
                    else
                        this.currentWindow.hide();
                    yield this.currentWindow.updateFrameTitle();
                }
                catch (error) {
                    (_e = this.currentWindow) === null || _e === void 0 ? void 0 : _e.hide();
                    (_f = this.currentWindow) === null || _f === void 0 ? void 0 : _f.destroy();
                    try {
                        (_g = this.windows[selected]) === null || _g === void 0 ? void 0 : _g.hide();
                        this.destroyWindow(this.windows[selected]);
                    }
                    catch (error) {
                        (0, helpers_1.warning)('cannot destroy window: ' + error.message);
                    }
                    this.errorHandler(error);
                }
            }));
            //append window manager to the screen
            this.screen.append(this.windowManager);
            this.windowManager.setBack();
            this.windowManager.hide();
        }
        /**
         * Overwrites the key and mouse events on the blessed screen object to capture errors
         */
        captureEventErrors() {
            //captures errors in keys
            if (!this.screen.oldKey)
                this.screen.oldKey = this.screen.key;
            this.screen.key = (param1, cb) => {
                if (typeof cb === typeof Promise)
                    this.screen.oldKey(param1, (...any) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            yield cb(...any);
                        }
                        catch (error) {
                            this.errorHandler(error);
                        }
                    }));
                else
                    this.screen.oldKey(param1, (...any) => {
                        try {
                            cb(...any);
                        }
                        catch (error) {
                            this.errorHandler(error);
                        }
                    });
            };
            //does the same a above, since for sone reason the on events aren't emitting errors, we can still get them like this
            if (!this.screen.oldOn)
                this.screen.oldOn = this.screen.on;
            this.screen.on = (param1, cb) => {
                if (typeof cb === typeof Promise)
                    this.screen.oldOn(param1, (...any) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            yield cb(...any);
                        }
                        catch (error) {
                            this.errorHandler(error);
                        }
                    }));
                else
                    this.screen.oldOn(param1, (...any) => {
                        try {
                            cb(...any);
                        }
                        catch (error) {
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
        getScript(scriptName) {
            return this.scripts.find((script) => script.name.toLowerCase() === scriptName.toLowerCase() ||
                script.fileName.split('.')[0].toLowerCase() ===
                    scriptName.toLowerCase());
        }
        /**
         * Displays an error in a box. Will not display if the console is not drawing.
         * @param error
         * @param onClick
         */
        displayError(error, onClick) {
            var _a;
            if (this.errorBox) {
                (_a = this.errorBox) === null || _a === void 0 ? void 0 : _a.destroy();
                this.errorBox = undefined;
            }
            this.errorBox = blessed_1.default.box({
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
                content: `{white-bg}{black-fg}CRITICAL ERROR - SYSTEM MALFUCTION{/white-bg} {underline}(control-c/cmd-c to close this box){/underline}\n\n{black-bg}{white-fg}${error.message}{/black-bg}{/white-fg}\n\n{white-bg}{black-fg}thrown on ${new Date(Date.now()).toString()}{/black-fg}{/white-bg}\n{white-bg}{black-fg}infinitymint-beta ${(0, helpers_1.getInfinityMintVersion)()}{/black-fg}{/white-bg}\n\n${error.stack}`,
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
            });
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
        registerKeys() {
            if (!this.inputKeys)
                return;
            let keys = Object.keys(this.inputKeys);
            keys.forEach((key) => {
                try {
                    this.screen.unkey([key]);
                }
                catch (error) {
                    if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS'))
                        throw error;
                    (0, helpers_1.warning)('could not unkey ' + key);
                }
                this.debugLog(`registering keyboard shortcut method on [${key}]`);
                this.screen.key([key], (ch, _key) => {
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
        setAllowExit(canExit) {
            this.allowExit = canExit;
        }
        /**
         * Sets the telnet session for this console.
         * @param session
         */
        setTelnetSession(session) {
            this.session = session;
        }
        /**
         * Sets the telnet user for this console.
         * @param user
         */
        setTelnetUser(user) {
            this.user = user;
        }
        /**
         * Used by the close method to determine if the console can exit or not.
         * @returns
         */
        isAllowingExit() {
            return this.allowExit;
        }
        /**
         * Changes the web3 provider to a new network, reloading the console and all windows and elements.
         * @param string
         * @returns
         */
        changeNetwork(string) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                (0, web3_1.setWalletNetwork)(string);
                yield this.reload();
                return hardhat_1.ethers.provider;
            });
        }
        /**
         * assigns a key to a method for this console. Used by the console, windows and elements to register keyboard shortcuts
         * @param key
         * @param cb
         * @returns
         */
        key(key, cb) {
            if (!this.inputKeys)
                this.inputKeys = {};
            this.debugLog(`registering keyboard shortcut method on [${key}]`);
            if (!this.inputKeys[key]) {
                this.inputKeys[key] = [];
                this.screen.key([key], (ch, _key) => {
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
        unkey(key, cb) {
            if (!this.inputKeys[key] || this.inputKeys[key].length <= 1 || !cb)
                this.inputKeys[key] = [];
            else {
                this.inputKeys[key] = this.inputKeys[key].filter((cb) => cb.toString() !== cb.toString());
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
        errorHandler(error, cb) {
            var _a, _b;
            this.error(error);
            if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS') || ((_a = this.options) === null || _a === void 0 ? void 0 : _a.throwErrors)) {
                this.stopLoading();
                throw error;
            }
            if (!((_b = this.options) === null || _b === void 0 ? void 0 : _b.dontDraw))
                this.displayError(error, () => {
                    this.errorBox.destroy();
                    this.errorBox = undefined;
                    if (cb)
                        cb();
                });
        }
        /**
         *
         * @returns
         */
        getCurrentTokenSymbol() {
            return 'eth';
        }
        /**
         * returns true if the current network has access to the web3
         * @returns
         */
        hasNetworkAccess() {
            return this.currentNetworkAccess;
        }
        /**
         *
         */
        compileContracts(deletePrevious = false) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (deletePrevious)
                    yield hardhat_2.default.run('cleanup');
                Helpers.log('🏗️ {bold}{cyan-fg}Compiling Contracts{/}');
                this.setLoading('Compiling Contracts', 10);
                yield hardhat_2.default.run('compile');
                this.stopLoading();
            });
        }
        /**
         *
         * @returns
         */
        loadWeb3() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.currentNetworkAccess = false;
                try {
                    this.currentNetwork = hardhat_2.default.network;
                    this.setLoading('Refreshing "' + hardhat_2.default.network.name + '"', 10);
                    this.chainId = (yield hardhat_1.ethers.provider.getNetwork()).chainId;
                    this.signers = yield hardhat_1.ethers.getSigners();
                    this.currentAccount = this.signers[(0, web3_1.getDefaultAccountIndex)()];
                    this.currentBalance = yield this.currentAccount.getBalance();
                    this.currentNetworkAccess = true;
                }
                catch (error) {
                    this.currentNetworkAccess = false;
                    if ((0, helpers_1.isScriptMode)() || this.options.scriptMode) {
                        this.stopLoading();
                        (0, helpers_1.warning)(`could not refresh web3: ${error.message}`);
                        return;
                    }
                    this.stopLoading();
                    this.errorHandler(error, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        this.errorBox.destroy();
                        this.errorBox = undefined;
                        try {
                            yield this.loadWeb3();
                        }
                        catch (error) {
                            (0, helpers_1.warning)('could not refresh web3');
                        }
                    }));
                }
                this.stopLoading();
            });
        }
        /**
         * Returns the current web3 provider for the console, you should use this over getProvider at all times
         * @returns
         */
        getProvider() {
            return hardhat_1.ethers.provider;
        }
        /**
         * Returns the URL for the current network (location of JsonRPC)
         * @param network
         * @returns
         */
        getNetworkEndpoint(network) {
            var _a, _b;
            network = network || this.currentNetwork.name;
            let config = (_b = (_a = (0, helpers_1.getConfigFile)()) === null || _a === void 0 ? void 0 : _a.hardhat) === null || _b === void 0 ? void 0 : _b.networks[network];
            if (!config)
                throw new Error(`could not find network ${network} in hardhat.config.js`);
            let url = config.url;
            if (!url)
                throw new Error(`could not find url for network ${network} in hardhat.config.js`);
            return url;
        }
        /**
         * Returns a simple static Json RPC Provider, takes the network you would like to read from. Network must be in the config.
         * @param network
         * @returns
         */
        createStaticProvider(network) {
            return new providers_1.StaticJsonRpcProvider(this.getNetworkEndpoint(network));
        }
        /**
         * returns all of the InfinityMint script objects
         * @returns
         */
        getScripts() {
            return this.scripts || [];
        }
        /**
         * Will return all the deployment classes associated with a project. If you are looking for just the contract, use getProjectContract
         * @param projectName
         * @param console
         * @returns
         */
        getProjectDeploymentClasses(projectName, gems) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let classes = yield (0, deployments_1.loadProjectDeploymentClasses)(projectName, this);
                let deployments = {};
                for (let key in classes) {
                    let deployment = classes[key];
                    if (!gems && deployment.isGem)
                        continue;
                    deployments[deployment.getModuleKey()] = deployment;
                    deployments[deployment.getContractName()] = deployment;
                }
                return deployments;
            });
        }
        loadScripts() {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let config = (0, helpers_1.getConfigFile)();
                this.setLoading('Loading Scripts', 10);
                let oldProcess = process.exit;
                //call reloads
                if (this.scripts && this.scripts.length !== 0) {
                    for (let i = 0; i < this.scripts.length; i++) {
                        let script = this.scripts[i];
                        try {
                            if (script === null || script === void 0 ? void 0 : script.reloaded)
                                yield script.reloaded({
                                    log: this.log,
                                    debugLog: this.debugLog,
                                    infinityConsole: this,
                                    eventEmitter: this.getEventEmitter(),
                                    script,
                                });
                        }
                        catch (error) {
                            if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS'))
                                throw error;
                            this.error(error);
                            this.log(`{red-fg}Script Failure: {/red-fg} ${error.message} <${script.name}>`);
                        }
                    }
                }
                let scripts = yield (0, helpers_1.findScripts)();
                this.debugLog('found ' + scripts.length + ' InfinityMint scripts');
                this.scripts = [];
                this.debugLog('{yellow-fg}{bold}Loading Scripts...{/}');
                for (let i = 0; i < scripts.length; i++) {
                    let script = scripts[i];
                    try {
                        this.debugLog(`[${i}] requiring script <${script.name}> => ${script.dir + '/' + script.base}`);
                        if (!((_b = (_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.scripts) === null || _b === void 0 ? void 0 : _b.classicScripts) ||
                            ((_d = (_c = config === null || config === void 0 ? void 0 : config.settings) === null || _c === void 0 ? void 0 : _c.scripts) === null || _d === void 0 ? void 0 : _d.classicScripts.filter((value) => script.dir.indexOf(value) !== -1).length) === 0) {
                            let scriptSource = yield (0, helpers_1.requireScript)(script.dir + '/' + script.base, this, this.isTelnet());
                            scriptSource.fileName = script.base;
                            scriptSource.path = script.dir + '/' + script.base;
                            this.scripts.push(scriptSource);
                        }
                        else {
                            let _potentialSource = {};
                            if (!((_f = (_e = config === null || config === void 0 ? void 0 : config.settings) === null || _e === void 0 ? void 0 : _e.scripts) === null || _f === void 0 ? void 0 : _f.disableMainExecution) ||
                                ((_h = (_g = config === null || config === void 0 ? void 0 : config.settings) === null || _g === void 0 ? void 0 : _g.scripts) === null || _h === void 0 ? void 0 : _h.disableMainExecution.filter((value) => script.dir.indexOf(value) !== -1).length) === 0) {
                                process._exit = (code) => {
                                    (0, helpers_1.warning)('not allowing process exit');
                                };
                                try {
                                    _potentialSource = yield (0, helpers_1.requireScript)(script.dir + '/' + script.base, this, this.isTelnet());
                                }
                                catch (error) {
                                    process.exit = oldProcess;
                                    throw error;
                                }
                                finally {
                                    process.exit = oldProcess;
                                }
                            }
                            else
                                this.scripts.push(Object.assign(Object.assign({}, _potentialSource), { name: (_potentialSource === null || _potentialSource === void 0 ? void 0 : _potentialSource.name) || script.name, path: script.dir + '/' + script.base, fileName: script.base, javascript: script.ext === '.js', execute: (infinitymint) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                        process._exit = (code) => {
                                            if (code === 1)
                                                (0, helpers_1.warning)('exited with code 0');
                                        };
                                        let result = yield (0, helpers_1.requireScript)(script.dir + '/' + script.base, this, this.isTelnet());
                                        if (typeof result === 'function')
                                            yield result(infinitymint);
                                        else if (result.execute)
                                            yield result.execute(infinitymint);
                                        process.exit = oldProcess;
                                    }) }));
                        }
                        this.debugLog(`{green-fg}Script Required Successfully{/green-fg} <${script.name}>`);
                    }
                    catch (error) {
                        if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS'))
                            throw error;
                        this.error(error);
                        this.log(`{red-fg}Script Failure: {/red-fg} ${error.message} <${script.name}>`);
                    }
                }
                process.exit = oldProcess;
                this.stopLoading();
            });
        }
        /**
         * logs to console but on the debug pipe
         * @param msg
         * @returns
         */
        debugLog(msg) {
            //throw away debug log
            if (!this.PipeFactory.pipes['debug'])
                return;
            return this.PipeFactory.log(msg, 'debug');
        }
        /**
         * typed emit
         * @param eventName
         * @param eventParameters
         * @param eventType
         * @returns
         */
        emit(eventName, eventParameters, eventType) {
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
            });
        }
        /**
         * Similar to gotoWindow except it does require the window to exist in the window manager
         * @param window
         */
        setWindow(window) {
            var _a, _b;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if ((_a = this.currentWindow) === null || _a === void 0 ? void 0 : _a.isForcedOpen())
                    return;
                if (this.currentWindow)
                    (_b = this.currentWindow) === null || _b === void 0 ? void 0 : _b.hide();
                for (let i = 0; i < this.windows.length; i++) {
                    let thatWindow = this.windows[i];
                    if (window.toString() !== thatWindow.toString()) {
                        if (window.isAlive())
                            window.hide();
                    }
                }
                this.currentWindow = window;
                if (!this.currentWindow.hasInitialized())
                    yield this.createCurrentWindow();
                this.currentWindow.show();
                this.addWindowToList(window);
            });
        }
        /**
         * creates the current window
         * @returns
         */
        createCurrentWindow() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!this.currentWindow || this.currentWindow.hasInitialized()) {
                    return;
                }
                if (!this.currentWindow.hasContainer())
                    this.currentWindow.setContainer(this);
                this.currentWindow.setScreen(this.screen);
                this.currentWindow.setBlessed(blessed_1.default);
                this.windowManager.hide();
                this.currentWindow.createFrame();
                yield this.currentWindow.create();
                this.windowManager.show();
                this.windowManager.setBack();
                this.registerWindowEvents();
            });
        }
        /**
         *
         * @param window
         */
        addWindowToList(window) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (this.windows.filter((thatWindow) => thatWindow.toString() === window.toString()).length !== 0)
                    (0, helpers_1.warning)('window is already in list');
                else {
                    this.windows.push(window);
                    this.updateWindowsList();
                }
            });
        }
        /**
         * destroys a window, can pass in a window, id, or name
         * @param windowOrIdOrName
         */
        destroyWindow(windowOrIdOrName) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < this.windows.length; i++) {
                    if (this.windows[i].toString() === windowOrIdOrName.toString() ||
                        this.windows[i].name === windowOrIdOrName.toString() ||
                        this.windows[i].getId() === windowOrIdOrName.toString()) {
                        //if its a clone then just kill it. InfinityMint will clean it up automatically
                        if (this.windows[i].data.clone) {
                            this.windows[i].destroy();
                            //init a dummy window to not kill console
                            this.windows[i] = new window_1.InfinityMintWindow(this.windows[i].name);
                            //hide it from the menu
                            this.windows[i].setHiddenFromMenu(true);
                            return;
                        }
                        let fileName = this.windows[i].getFileName();
                        this.debugLog('{cyan-fg}Reimporting ' +
                            this.windows[i].name +
                            '{/cyan-fg}');
                        this.windows[i].destroy();
                        this.windows[i] = (0, helpers_1.requireWindow)(fileName, this);
                        this.windows[i].setFileName(fileName);
                        this.debugLog('{green-fg}Successfully Reimported ' +
                            this.windows[i].name +
                            `{/green-fg} <${this.windows[i].getId()}>`);
                    }
                }
            });
        }
        /**
         * refreshes all windows
         */
        loadWindows() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let windows = yield (0, helpers_1.findWindows)();
                this.windows = [];
                this.debugLog('{yellow-fg}{bold}Loading Windows...{/}');
                for (let i = 0; i < windows.length; i++) {
                    try {
                        this.debugLog('{cyan-fg}Importing{/cyan-fg} => ' + windows[i]);
                        let window = (0, helpers_1.requireWindow)(windows[i], this);
                        //check if gem or mods is in the file name
                        if (windows[i].includes('/gems/') ||
                            windows[i].includes('/mod/')) {
                            let gemName = windows[i];
                            if (windows[i].includes('/gems/'))
                                gemName = gemName.split('/gems/')[1];
                            else if (windows[i].includes('/mod/'))
                                gemName = gemName.split('/mod/')[1];
                            gemName = gemName.split('/')[0];
                            if (gemName === '__')
                                gemName = windows[i].split('/__')[1].split('/')[0];
                            if (!this.gems[gemName]) {
                                (0, helpers_1.warning)(`Gem ${gemName} not found`);
                            }
                            else {
                                this.debugLog(`Window ${window.name} is a gem or mod. Setting gem to ${gemName}`);
                                window.setGem(this.gems[gemName]);
                            }
                        }
                        if (!window.hasContainer())
                            window.setContainer(this);
                        else
                            (0, helpers_1.warning)('window has container already');
                        window.setFileName(windows[i]);
                        window.setBlessed(blessed_1.default);
                        this.windows.push(window);
                        this.debugLog(`{green-fg}Succesfully Required ${window.name}{/green-fg} <` +
                            window.getId() +
                            '>');
                        this.updateWindowsList();
                    }
                    catch (error) {
                        if ((0, helpers_1.isEnvTrue)('THROW_ALL_ERRORS'))
                            throw error;
                        this.PipeFactory.pipes['windows'].error(error.stack);
                        this.log(`{red-fg}Window Failure: {/red-fg} ${error.message} <${windows[i]}>`);
                    }
                }
                if (this.windows.length === 0) {
                    throw new Error('No windows found after load. This usually means glob has failed... please report on our github');
                }
            });
        }
        /**
         * refreshs the imports in the cache to be used by the window manager. Imports are gathers from the imports folder.
         * @param dontUseCache
         */
        buildImports(dontUseCache) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.setLoading('Loading Imports');
                this.imports = yield (0, imports_1.getImports)(dontUseCache, this);
                this.stopLoading();
            });
        }
        /**
         *
         * @param projectOrName
         * @returns
         */
        getProjectPath(projectOrName) {
            let key = this.getProjectKey(projectOrName);
            if (!key)
                throw new Error('Project not found');
            return this.projects.database[key];
        }
        /**
         *
         * @param projectOrName
         * @returns
         */
        getProjectKey(projectOrName) {
            let name;
            if (typeof projectOrName === 'string')
                name = projectOrName;
            else
                name = projectOrName.name;
            return this.projects.keys[name];
        }
        /**
         * Returns the list of paths to projects which have been found, the key is the name of the project followed by its location, you can get the key by using passing a project (or its name) into the method getProjectKey
         * @returns
         */
        getProjectPaths() {
            return this.projects.database;
        }
        /**
         * Loads infinity mint and all of its components, used if we are not drawing console
         */
        load(options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.log(`{bold}💭 Loading Infinity Mint => v${(0, helpers_1.getInfinityMintVersion)()}{/}`);
                this.setLoading('Loading Gems', 20);
                yield this.loadGems();
                this.log('\t{green-fg}Successfully Loaded Gems{/green-fg}');
                this.setLoading('Loading Templates', 30);
                yield (0, templates_1.findTemplates)();
                this.templates = (0, templates_1.getTemplates)();
                this.log('\t{green-fg}Successfully Loaded Templates{/green-fg}');
                this.setLoading('Loading Export Solutions', 30);
                yield (0, helpers_1.findExportSolutions)();
                this.exportSolutions = (0, helpers_1.getExportSolutions)();
                this.log('\t{green-fg}Successfully Loaded Export Solutions{/green-fg}');
                //express
                if (options.startExpress) {
                    this.setLoading('Loading Express Server', 40);
                    //allow console logs for express
                    Helpers.setAllowExpressLogs(true);
                    if (!this.ExpressServer)
                        this.ExpressServer = yield (0, express_1.startExpressServer)(this);
                    else
                        yield this.ExpressServer.reload();
                    this.log('\t{green-fg}Successfully Loaded Express Server{/green-fg}');
                }
                //express
                if (options.startWebSocket) {
                    this.setLoading('Loading WebSocket Server', 45);
                    if (this.WebSocketController)
                        this.WebSocketController.close();
                    this.WebSocketController = yield (0, webSocket_1.startWebSocket)(this);
                    this.log('\t{green-fg}Successfully Loaded Websocket Server{/green-fg}');
                }
                if ((0, ipfs_1.isAllowingIPFS)()) {
                    this.setLoading('Loading IPFS', 50);
                    this.IPFS = new ipfs_1.IPFS();
                    yield this.IPFS.start();
                    this.log('\t{green-fg}Successfully Loaded IPFS{/green-fg}');
                }
                this.setLoading('Loading Imports', 55);
                //refresh imports
                if (!this.imports || !(0, imports_1.hasImportCache)())
                    yield this.buildImports();
                //if we are loading UI
                if (!options.dontDraw) {
                    this.createWindowManager();
                    this.setLoading('Loading Custom Blessed Components', 60);
                    yield this.loadCustomComponents();
                    this.log('\t{green-fg}Successfully Loaded Custom Blessed Components{/green-fg}');
                    this.setLoading('Loading Windows', 75);
                    yield this.loadWindows();
                    this.log('\t{green-fg}Successfully Loaded Windows{/green-fg}');
                }
                this.setLoading('Loading Web3', 80);
                yield this.loadWeb3();
                this.log('\t{green-fg}Successfully Loaded Web3{/green-fg}');
                this.setLoading('Loading Scripts', 85);
                yield this.loadScripts();
                this.log('\t{green-fg}Successfully Loaded Scripts{/green-fg}');
                this.setLoading('Loading Projects', 90);
                yield this.loadProjects();
                this.log('\t{green-fg}Successfully Loaded Projects{/green-fg}');
                this.setLoading('Loading Updates', 95);
                yield this.loadUpdates();
                this.log('\t{green-fg}Successfully Loaded Updates{/green-fg}');
            });
        }
        /**
         *
         * @returns
         */
        getExportSolutions() {
            return this.exportSolutions || {};
        }
        /**
         *
         * @returns
         */
        getGems() {
            return this.gems || {};
        }
        /**
         * creates the infinity console UI and other elements
         * @returns
         */
        createUI() {
            var _a, _b, _c;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    //register core key events
                    this.registerKeys();
                    //set the current window from the
                    if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.initialWindow))
                        this.currentWindow =
                            this.getWindowsByName('Menu')[0] || this.windows[0];
                    else if (typeof this.options.initialWindow === typeof window_1.InfinityMintWindow) {
                        let potentialWindow = this.options.initialWindow;
                        this.currentWindow = potentialWindow;
                    }
                    else {
                        this.currentWindow = this.getWindowsByName(this.options.initialWindow)[0];
                    }
                    //instantly instante windows which seek such a thing
                    let instantInstantiate = this.windows.filter((thatWindow) => thatWindow.shouldInstantiate());
                    this.debugLog(`initializing ${instantInstantiate.length} windows`);
                    for (let i = 0; i < instantInstantiate.length; i++) {
                        this.setLoading('Loading Window ' + instantInstantiate[i].name, 50);
                        try {
                            this.debugLog(`[${i}] initializing <` +
                                instantInstantiate[i].name +
                                `>[${instantInstantiate[i].getId()}]`);
                            if (!instantInstantiate[i].hasContainer())
                                instantInstantiate[i].setContainer(this);
                            instantInstantiate[i].setScreen(this.screen);
                            instantInstantiate[i].createFrame();
                            yield instantInstantiate[i].create();
                            instantInstantiate[i].hide();
                            //register events
                            this.registerWindowEvents(instantInstantiate[i]);
                        }
                        catch (error) {
                            (0, helpers_1.warning)(`[${i}] error initializing <` +
                                instantInstantiate[i].name +
                                `>[${instantInstantiate[i].getId()}]: ` +
                                error.message);
                        }
                    }
                    this.debugLog(`finished initializing ${instantInstantiate.length} windows`);
                    this.setLoading('Loading Current Window', 70);
                    yield this.createCurrentWindow(); //create the current window
                    this.stopLoading();
                    //render
                    this.screen.render();
                    //set window manager to the back
                    this.windowManager.setBack();
                    //hide the current window
                    this.currentWindow.hide();
                }
                catch (error) {
                    (0, helpers_1.exposeLogs)(true);
                    if (this.isDrawing())
                        (_b = this === null || this === void 0 ? void 0 : this.screen) === null || _b === void 0 ? void 0 : _b.destroy();
                    console.log(`
            {red-fg}Error: ${error.message}:${error.name}{/red-fg}
            {red-fg}Stack: ${error.stack}{/red-fg}
            Something really bad happened. Please check your /temp/pipes folder for a full log output
            {red-fg}If you are using a custom window, please check your window for errors{/red-fg}
            {cyan-fg}Current window: ${((_c = this === null || this === void 0 ? void 0 : this.currentWindow) === null || _c === void 0 ? void 0 : _c.name) || 'NO CURRENT WINDOW'}{/cyan-fg}
            `);
                    try {
                        Object.keys(this.PipeFactory.pipes || {}).forEach((pipe) => {
                            try {
                                this.PipeFactory.savePipe(pipe);
                            }
                            catch (error) { }
                        });
                    }
                    catch (error) { }
                    process.exit(1);
                }
            });
        }
        /**
         * Initializes the InfinityConsole, calling all necessary functions to get the console up and running. This function is asynchronous and should be called with await.
         * @returns
         */
        initialize() {
            var _a, _b, _c;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                //register keyboard shortcuts
                this.registerDefaultKeys();
                //if the network member has been defined then we have already initialized
                try {
                    yield this.load(this.options);
                    if (this.options.dontDraw) {
                        (0, helpers_1.warning)(`InfinityConsole will not draw! Windows & Blessed elements inaccessible`);
                    }
                    else {
                        //create the window manager
                        this.createWindowManager();
                        yield this.createUI();
                        //hide loading screen
                        this.stopLoading();
                        //the think method for this console
                        let int = () => {
                            if (!this.hasInitialized)
                                return;
                            this.loadingBox.setFront();
                            if (this.errorBox !== undefined)
                                this.errorBox.setFront();
                            this.windows.forEach((window) => {
                                if (window.isAlive() &&
                                    (window.shouldBackgroundThink() ||
                                        (!window.shouldBackgroundThink() &&
                                            window.isVisible())))
                                    window.update();
                            });
                            this.screen.render();
                        };
                        this.think = setInterval(() => {
                            var _a;
                            if (!this.hasInitialized)
                                return;
                            (((_a = this.options) === null || _a === void 0 ? void 0 : _a.think) || int)();
                            this.tick++;
                            //bit of a hacky solution but keeps these buttons forward
                            if (this.currentWindow) {
                                Object.values(this.currentWindow.elements)
                                    .filter((element) => !element.hidden)
                                    .forEach((element) => {
                                    if (!this.options.dontDraw &&
                                        element.alwaysBack)
                                        element.setBack();
                                    if (!this.options.dontDraw &&
                                        element.alwaysFront)
                                        element.setFront();
                                    if (!this.options.dontDraw &&
                                        element.alwaysFocus)
                                        element.focus();
                                    if (!this.options.dontDraw &&
                                        (element.options.mouse ||
                                            element.options.keys))
                                        element.enableInput();
                                    if (element.think &&
                                        typeof element.think === 'function' &&
                                        (!element.hidden || element.alwaysUpdate))
                                        element.think(this.currentWindow, element, blessed_1.default);
                                });
                            }
                            this.windowManager.setBack();
                            this.loadingBox.setFront();
                            if (this.errorBox && !this.errorBox.hidden)
                                this.errorBox.setFront();
                        }, ((_a = this.options) === null || _a === void 0 ? void 0 : _a.tickRate) || (this.isTelnet() ? 346 : 100));
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
                }
                catch (error) {
                    (0, helpers_1.exposeLogs)(true);
                    if (this.screen)
                        try {
                            (_b = this.screen) === null || _b === void 0 ? void 0 : _b.destroy();
                        }
                        catch (e) { }
                    console.log(`
            {red-fg}Error: ${error.message}{/red-fg}
            {red-fg}Stack: ${error.stack}{/red-fg}
            Something really bad happened. Please check your /temp/pipes folder for a full log output
            {red-fg}If you are using a custom window, please check your window for errors{/red-fg}
            {cyan-fg}Current window: ${((_c = this.currentWindow) === null || _c === void 0 ? void 0 : _c.name) || 'NO CURRENT WINDOW'}{/cyan-fg}
            `);
                    try {
                        Object.keys(this.PipeFactory.pipes || {}).forEach((pipe) => {
                            try {
                                this.PipeFactory.savePipe(pipe);
                            }
                            catch (error) { }
                        });
                    }
                    catch (error) { }
                    process.exit(1);
                }
                this.hasInitialized = true;
                this.emit('initialized');
            });
        }
    }
    exports.InfinityConsole = InfinityConsole;
    exports.default = InfinityConsole;
});
//# sourceMappingURL=console.js.map