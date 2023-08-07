(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./pipes", "fs-extra", "fs", "path", "os", "bip39", "glob", "./colours", "./gems"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isEnvSet = exports.isEnvTrue = exports.makeJsonSafe = exports.envTrue = exports.isGanacheAlive = exports.returnSafeJson = exports.envExists = exports.error = exports.getGanacheMnemonic = exports.saveGlobalSessionFile = exports.readLocations = exports.hasLocationForProject = exports.saveLocations = exports.saveSessionVariable = exports.hasHardhatConfig = exports.getSolidityFolder = exports.createInfinityMintConfig = exports.initializeGanacheMnemonic = exports.createPipes = exports.createEnv = exports.getEnv = exports.createEnvFile = exports.readJson = exports.createDirs = exports.exposeLogs = exports.loadInfinityMint = exports.getFlags = exports.setAllowPiping = exports.isAllowPiping = exports.setShowAllLogs = exports.showAllLogs = exports.isInfinityMint = exports.requireScript = exports.requireWindow = exports.makeDirectories = exports.isWindows = exports.replaceSeperators = exports.normalizeSeperators = exports.toTempProject = exports.findScripts = exports.getFileImportExtension = exports.getRandomNumber = exports.isTypescript = exports.findFiles = exports.getPackageJson = exports.blockGanacheMessage = exports.getInfinityMintClientVersion = exports.getInfinityMintVersion = exports.findWindows = exports.prepareConfig = exports.hasChangedGlobalUserId = exports.cleanCompilations = exports.prepareHardhatConfig = exports.copyContractsFromNodeModule = exports.getConfigFile = exports.overwriteConsoleMethods = exports.consoleErrorReplacement = exports.directlyLog = exports.consoleLogReplacement = exports.addGanacheMessage = exports.removeGanacheMessage = exports.removeBlockedGanacheMessage = exports.hasNodeModule = exports.setIgnorePipeFactory = exports.directlyOutputLogs = exports.ganacheMessages = exports.blockedGanacheMessages = exports.networks = exports.write = exports.setExposeConsoleHostMessage = exports.exposeLocalHostMessage = exports.parse = exports.createNetworkPipes = exports.isScriptMode = exports.getArgumentValues = exports.mergeObjects = exports.getExportLocation = exports.print = exports.getExpressConfig = exports.logExpress = exports.getCustomBlessedElements = exports.setScriptMode = exports.cwd = exports.delay = exports.safeGlob = exports.safeGlobCB = exports.readGlobalSession = exports.calculateWidth = exports.getElementPadding = exports.getConsoleOptions = exports.warning = exports.debugLog = exports.setDebugLogDisabled = exports.isDebugLogDisabled = exports.findCustomBlessedElements = exports.getExportSolutions = exports.findExportSolutions = exports.log = exports.setAllowEmojis = exports.getUUID = exports.stripEmoji = exports.setOnlyDefaultLogs = exports.setAllowExpressLogs = exports.allowExpress = exports.setPipeFactory = exports.tcpPingPort = void 0;
    const tslib_1 = require("tslib");
    const pipes_1 = require("./pipes");
    const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const path_1 = tslib_1.__importDefault(require("path"));
    const os_1 = tslib_1.__importDefault(require("os"));
    const bip39_1 = require("bip39");
    const glob_1 = require("glob");
    const colours_1 = require("./colours");
    const gems_1 = require("./gems");
    //uuid stuff
    const { v4: uuidv4 } = require('uuid');
    //used to ping stuff to see if its online
    exports.tcpPingPort = require('tcp-ping-port').tcpPingPort;
    let defaultPipeFactory;
    const setPipeFactory = (pipeFactory) => {
        defaultPipeFactory = pipeFactory;
    };
    exports.setPipeFactory = setPipeFactory;
    exports.allowExpress = false;
    const setAllowExpressLogs = (value) => {
        exports.allowExpress = value;
    };
    exports.setAllowExpressLogs = setAllowExpressLogs;
    let onlyDefault = false;
    const setOnlyDefaultLogs = (value) => {
        onlyDefault = value;
    };
    exports.setOnlyDefaultLogs = setOnlyDefaultLogs;
    const stripEmoji = (str) => {
        return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '?');
    };
    exports.stripEmoji = stripEmoji;
    /**
     * returns a fresh new uuid
     * @returns
     */
    const getUUID = () => {
        return uuidv4();
    };
    exports.getUUID = getUUID;
    let allowEmojis = true;
    const setAllowEmojis = (value) => {
        allowEmojis = value;
    };
    exports.setAllowEmojis = setAllowEmojis;
    /**
     * Logs a console message to the current pipe.
     * @param msg
     * @param pipe
     */
    const log = (msg, pipe) => {
        try {
            if (typeof msg === 'object')
                msg = JSON.stringify(msg, null, 2);
            if (msg instanceof Buffer)
                msg = msg.toString('utf8');
        }
        catch (error) {
        }
        finally {
            msg = msg.toString();
        }
        if (!allowEmojis)
            msg = (0, exports.stripEmoji)(msg);
        pipe = pipe || 'default';
        if (pipe !== 'default' &&
            pipe !== 'debug' &&
            pipe !== 'express' &&
            onlyDefault)
            return;
        if (pipe === 'express' && !exports.allowExpress)
            return;
        msg = msg.toString();
        //another very stupid way to filter out the eth messages from console log, too bad!
        if (exports.isAllowPiping &&
            msg.indexOf('<#DONT_LOG_ME$>') === -1 &&
            !exports.directlyOutputLogs)
            defaultPipeFactory.log(msg, pipe);
        if ((0, exports.isEnvTrue)('PIPE_IGNORE_CONSOLE') || exports.directlyOutputLogs)
            (0, exports.print)((0, exports.isScriptMode)() && defaultPipeFactory
                ? (0, colours_1.blessedToAnsi)(defaultPipeFactory.addColoursToString(defaultPipeFactory.messageToString(msg)))
                : require('blessed').stripTags(msg));
    };
    exports.log = log;
    let exportSolutions = {};
    const findExportSolutions = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let config = (0, exports.getConfigFile)();
        let roots = [
            (0, exports.cwd)() + '/export/',
            ...(config.roots || []).map((root) => {
                if (root.startsWith('../') ||
                    root.startsWith('./') ||
                    root.startsWith('/../'))
                    root =
                        (0, exports.cwd)() +
                            '/' +
                            (root.startsWith('/') ? root.substring(1) : root);
                if (!root.endsWith('/'))
                    root += '/';
                return root + 'export/';
            }),
        ];
        if ((0, exports.isInfinityMint)())
            roots.push((0, exports.cwd)() + '/app/export/');
        else
            roots.push((0, exports.cwd)() + '/node_modules/infinitymint/dist/app/export/');
        let results = yield Promise.all(roots.map((root) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            (0, exports.debugLog)('Searching for export scripts => ' + root);
            let ts = yield new Promise((resolve, reject) => {
                (0, exports.safeGlobCB)(root + '**/*.ts', (err, files) => {
                    if (err)
                        reject(err);
                    else
                        resolve(files);
                });
            });
            let js = yield new Promise((resolve, reject) => {
                (0, exports.safeGlobCB)(root + '**/*.js', (err, files) => {
                    if (err)
                        reject(err);
                    else
                        resolve(files);
                });
            });
            return [...ts, ...js];
        })));
        let flat = results.flat();
        flat = flat.filter((file) => !file.endsWith('.d.ts') && !file.endsWith('.type-extension.ts'));
        flat.forEach((file, index) => {
            let name = path_1.default.parse(file).name;
            (0, exports.debugLog)(`[${index}] => Found export ` + file + `<${name}> loading...`);
            if (require.cache[file]) {
                (0, exports.debugLog)(`\t{gray-fg}Found ` +
                    file +
                    `<${name}> in cache, deleting...{/}`);
                delete require.cache[file];
            }
            try {
                exportSolutions[name] = require(file);
                exportSolutions[name] =
                    exportSolutions[name].default || exportSolutions[name];
                exportSolutions[name].path = file;
            }
            catch (error) {
                (0, exports.debugLog)(`\t{red-fg}Error loading export ` +
                    file +
                    `<${name}>: ${error.message}{/}`);
                return;
            }
        });
        return exportSolutions;
    });
    exports.findExportSolutions = findExportSolutions;
    const getExportSolutions = () => {
        return exportSolutions;
    };
    exports.getExportSolutions = getExportSolutions;
    let customBlessedElements = {};
    const findCustomBlessedElements = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let config = (0, exports.getConfigFile)();
        let roots = [(0, exports.cwd)() + '/windows/elements/'];
        if ((0, exports.isInfinityMint)() && !((_a = config === null || config === void 0 ? void 0 : config.dev) === null || _a === void 0 ? void 0 : _a.useLocalDist))
            roots.push((0, exports.cwd)() + '/app/elements/');
        else if ((_b = config === null || config === void 0 ? void 0 : config.dev) === null || _b === void 0 ? void 0 : _b.useLocalDist)
            roots.push((0, exports.cwd)() + '/dist/app/elements/');
        else
            roots.push((0, exports.cwd)() + '/node_modules/infinitymint/dist/app/elements/');
        let results = yield Promise.all(roots.map((root) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            (0, exports.debugLog)('Searching for custom elements => ' + root);
            let ts = (0, exports.isTypescript)() ||
                !((_d = (_c = config.settings) === null || _c === void 0 ? void 0 : _c.console) === null || _d === void 0 ? void 0 : _d.disallowTypescriptElements)
                ? yield new Promise((resolve, reject) => {
                    (0, exports.safeGlobCB)(root + '**/*.ts', (err, files) => {
                        if (err)
                            reject(err);
                        else
                            resolve(files);
                    });
                })
                : [];
            let js = yield new Promise((resolve, reject) => {
                (0, exports.safeGlobCB)(root + '**/*.js', (err, files) => {
                    if (err)
                        reject(err);
                    else
                        resolve(files);
                });
            });
            return [...ts, ...js];
        })));
        let flat = results.flat();
        //also include gem custom elements
        flat = [
            ...flat,
            ...Object.values((0, gems_1.getLoadedGems)())
                .map((x) => x.windowComponents)
                .flat(),
        ];
        flat = flat.filter((file) => !file.endsWith('.d.ts') && !file.endsWith('.type-extension.ts'));
        flat.forEach((file, index) => {
            let name = file.split('/').pop().split('.')[0];
            (0, exports.debugLog)(`[${index}] => Found ` + file + `<${name}> loading...`);
            if (require.cache[file]) {
                (0, exports.debugLog)(`\t{gray-fg}Found ` +
                    file +
                    `<${name}> in cache, deleting...{/}`);
                delete require.cache[file];
            }
            try {
                customBlessedElements[name] = require(file);
                customBlessedElements[name] =
                    customBlessedElements[name].default ||
                        customBlessedElements[name];
            }
            catch (error) {
                if ((0, exports.isEnvTrue)('THROW_ALL_ERRORS'))
                    throw error;
                console.log(`{red-fg}Element Failure: {/red-fg} ${error.message} <${name}>`);
            }
        });
        return customBlessedElements;
    });
    exports.findCustomBlessedElements = findCustomBlessedElements;
    exports.isDebugLogDisabled = false;
    const setDebugLogDisabled = (disabled) => {
        exports.isDebugLogDisabled = disabled;
        if (disabled)
            (0, exports.warning)('Debug log messages are disabled');
    };
    exports.setDebugLogDisabled = setDebugLogDisabled;
    /**
     * Logs a debug message to the current pipe.
     * @param msg
     * @param pipe
     */
    const debugLog = (msg) => {
        if (exports.isDebugLogDisabled)
            return;
        (0, exports.log)(msg, 'debug');
    };
    exports.debugLog = debugLog;
    /**
     * Logs a debug message to the current pipe.
     * @param msg
     * @param pipe
     */
    const warning = (msg) => {
        msg = `{yellow-fg}{underline}⚠️{/underline}  {red-fg}${msg}{/}`;
        (0, exports.log)(msg, (0, exports.isEnvTrue)('PIPE_SEPERATE_WARNINGS') ? 'warning' : 'debug');
    };
    exports.warning = warning;
    /**
     *
     * @returns
     */
    const getConsoleOptions = () => {
        let config = (0, exports.getConfigFile)();
        return config === null || config === void 0 ? void 0 : config.console;
    };
    exports.getConsoleOptions = getConsoleOptions;
    /**
     * gets the elements padding. use type to get the left, right, up, or down padding.
     * @param element
     * @param type
     * @returns
     */
    const getElementPadding = (element, type) => {
        if (!element.padding)
            return 0;
        if (!(element === null || element === void 0 ? void 0 : element.padding[type]))
            return 0;
        return parseInt(element === null || element === void 0 ? void 0 : element.padding[type].toString());
    };
    exports.getElementPadding = getElementPadding;
    /**
     * calculates the width of the blessed given elements
     * @param elements
     * @returns
     */
    const calculateWidth = (...elements) => {
        let fin = 0;
        elements
            .map((element) => element.strWidth(element.content) +
            //for the border
            (element.border ? 2 : 0) +
            (0, exports.getElementPadding)(element, 'left') +
            (0, exports.getElementPadding)(element, 'right'))
            .forEach((num) => (fin += num));
        return fin;
    };
    exports.calculateWidth = calculateWidth;
    /**
     * Will return the current session file as stored in memorys. Make sure to specify if to forceRead from the .session file agead.
     * @returns
     */
    const readGlobalSession = (forceRead) => {
        if (!fs_1.default.existsSync((0, exports.cwd)() + '/.session'))
            return { created: Date.now(), environment: {} };
        if (memorySession && !forceRead)
            return memorySession;
        try {
            let result = JSON.parse(fs_1.default.readFileSync((0, exports.cwd)() + '/.session', {
                encoding: 'utf-8',
            }));
            memorySession = result;
            return result;
        }
        catch (error) {
            console.error(error);
        }
        return {
            created: Date.now(),
            environment: {},
        };
    };
    exports.readGlobalSession = readGlobalSession;
    /**
     * Will replace all seperators in the path with the correct seperator for the current OS before glob.
     * @param path
     * @param cb
     */
    const safeGlobCB = (path, cb) => {
        path = (0, exports.normalizeSeperators)(path);
        (0, exports.log)(`(safeGlobCB) Searching in => ${path}`, 'glob');
        (0, glob_1.glob)(path, cb);
    };
    exports.safeGlobCB = safeGlobCB;
    /**
     * Will replace all seperators in the path with the correct seperator for the current OS before glob. It also won't throw unless specified.
     * @param path
     */
    const safeGlob = (path, throwAll = false, shouldLog = true) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        path = (0, exports.normalizeSeperators)(path);
        return yield new Promise((resolve, reject) => {
            if (shouldLog)
                (0, exports.log)(`(safeGlob) Searching in => ${path}`, 'glob');
            (0, glob_1.glob)(path, (err, files) => {
                if (err) {
                    if (throwAll)
                        reject(err);
                    else
                        resolve([]);
                }
                else
                    resolve(files);
            });
        });
    });
    exports.safeGlob = safeGlob;
    /**
     * delays the current thread for the specified amount of time. Written by the AI
     * @param ms
     * @returns
     */
    const delay = (ms) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return new Promise((resolve) => setTimeout(resolve, ms)); });
    exports.delay = delay;
    /**
     * the most safest safe way to get cwd according to stack overflow
     * @returns
     */
    const cwd = () => {
        let result = path_1.default.resolve(process.cwd());
        if (result === '/')
            return '';
        return result;
    };
    exports.cwd = cwd;
    let scriptMode = false;
    const setScriptMode = (_scriptMode) => {
        scriptMode = _scriptMode;
    };
    exports.setScriptMode = setScriptMode;
    const getCustomBlessedElements = () => {
        return customBlessedElements;
    };
    exports.getCustomBlessedElements = getCustomBlessedElements;
    /**
     * Unlike Console.log log express will also show messages inside of the InfinityConsle
     * @param msg
     */
    const logExpress = (...msg) => {
        msg = msg.map((x) => {
            if (typeof x === 'object')
                try {
                    return JSON.stringify(x, null, 4);
                }
                catch (_a) {
                    return x.toString();
                }
            return x;
        });
        (0, exports.log)(msg.join('\n'), 'express');
    };
    exports.logExpress = logExpress;
    const getExpressConfig = () => {
        let config;
        if ((0, exports.getConfigFile)().express !== undefined &&
            typeof (0, exports.getConfigFile)().express !== 'boolean')
            config = (0, exports.getConfigFile)().express;
        else
            config = {};
        return config;
    };
    exports.getExpressConfig = getExpressConfig;
    /**
     * Unlike log direct will not turn blessed into ansi codes and simply output directly to the current console.
     * @param any
     */
    const print = (...any) => {
        if (console._log === undefined)
            console.log(...any);
        else
            console._log(...any);
    };
    exports.print = print;
    /**
     *
     * @param type
     * @param exportLocations
     * @returns
     */
    const getExportLocation = (type, exportLocations) => {
        let result = exportLocations.find((x) => x.type === type);
        let root = exportLocations.find((x) => x.type === 'root');
        if (result.useRoot &&
            (0, exports.replaceSeperators)(result.location).indexOf((0, exports.replaceSeperators)(root.location)) === -1)
            result.location = (0, exports.replaceSeperators)(path_1.default.join(root.location, result.location));
        return result;
    };
    exports.getExportLocation = getExportLocation;
    const mergeObjects = (a, b) => {
        if (Array.isArray(a) && Array.isArray(b)) {
            return [...a, ...b];
        }
        if (typeof a === 'object' && typeof b === 'object') {
            return Object.keys(Object.assign(Object.assign({}, a), b)).reduce((acc, key) => {
                acc[key] = (0, exports.mergeObjects)(a[key], b[key]);
                return acc;
            }, {});
        }
        return b;
    };
    exports.mergeObjects = mergeObjects;
    const getArgumentValues = (args) => {
        let result = {};
        Object.keys(args).forEach((key) => {
            result[key] = args[key].value;
            if (result[key] === 'true' && args[key].type === 'boolean')
                result[key] = true;
            else if (result[key] === 'false' && args[key].type === 'boolean')
                result[key] = false;
            else if (result[key] &&
                !isNaN(result[key]) &&
                args[key].type === 'number')
                result[key] = Number(result[key]);
        });
        return result;
    };
    exports.getArgumentValues = getArgumentValues;
    const isScriptMode = () => {
        return scriptMode;
    };
    exports.isScriptMode = isScriptMode;
    const createNetworkPipes = (_networks) => {
        let config = (0, exports.getConfigFile)();
        let networks = Object.keys(_networks || config.hardhat.networks);
        networks.forEach((network) => {
            var _a, _b;
            let settings = ((_b = (_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.networks) === null || _b === void 0 ? void 0 : _b[network]) || {};
            if (settings.useDefaultPipe)
                return;
            (0, exports.debugLog)('registered pipe for ' + network);
            defaultPipeFactory.registerSimplePipe(network);
        });
    };
    exports.createNetworkPipes = createNetworkPipes;
    const parseCache = {};
    const parse = (path, useCache, encoding) => {
        if (parseCache[path.toString()] && useCache)
            return parseCache[path.toString()];
        let result = fs_1.default.readFileSync((0, exports.cwd)() + (path[0] !== '/' ? '/' + path : path), {
            encoding: (encoding || 'utf-8'),
        });
        let parsedResult;
        if (typeof result === typeof Buffer)
            parsedResult = new TextDecoder().decode(result);
        else
            parsedResult = result.toString();
        return JSON.parse(parsedResult);
    };
    exports.parse = parse;
    exports.exposeLocalHostMessage = false;
    const setExposeConsoleHostMessage = (value) => {
        exports.exposeLocalHostMessage = value;
    };
    exports.setExposeConsoleHostMessage = setExposeConsoleHostMessage;
    /**
     *
     * @param path
     * @param object
     */
    const write = (path, object) => {
        fs_1.default.writeFileSync((0, exports.cwd)() + (path[0] !== '/' ? '/' + path : path), typeof object === 'object' ? JSON.stringify(object) : object);
    };
    exports.write = write;
    exports.networks = {
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
    exports.blockedGanacheMessages = [
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
    exports.ganacheMessages = [
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
    exports.directlyOutputLogs = false;
    const setIgnorePipeFactory = (value) => {
        exports.directlyOutputLogs = value;
    };
    exports.setIgnorePipeFactory = setIgnorePipeFactory;
    const hasNodeModule = (name) => {
        name = name.replace('@', '');
        return fs_1.default.existsSync(path_1.default.join((0, exports.cwd)(), 'node_modules', name));
    };
    exports.hasNodeModule = hasNodeModule;
    const removeBlockedGanacheMessage = (message) => {
        let index = exports.blockedGanacheMessages.indexOf(message);
        if (index !== -1)
            exports.blockedGanacheMessages.splice(index, 1);
    };
    exports.removeBlockedGanacheMessage = removeBlockedGanacheMessage;
    const removeGanacheMessage = (message) => {
        let index = exports.ganacheMessages.indexOf(message);
        if (index !== -1)
            exports.ganacheMessages.splice(index, 1);
    };
    exports.removeGanacheMessage = removeGanacheMessage;
    const addGanacheMessage = (message) => {
        if (exports.ganacheMessages.indexOf(message) === -1)
            exports.ganacheMessages.push(message);
    };
    exports.addGanacheMessage = addGanacheMessage;
    const consoleLogReplacement = (...any) => {
        any = any.map((val) => {
            if (val instanceof Error)
                val = val.message;
            if (val && typeof val === 'object' && val.message)
                val = val.message;
            if (typeof val === 'object')
                try {
                    val = JSON.stringify(val, null, 4);
                }
                catch (error) { }
            val = val.toString();
            return val;
        });
        let msg = any.join('\n');
        //this is a very stupid way to filter out the eth messages from console log, too bad!
        if (exports.ganacheMessages.filter((val) => val === msg).length !== 0) {
            if (exports.blockedGanacheMessages.filter((val) => val === msg).length === 0)
                defaultPipeFactory.log(msg, 'localhost');
            return;
        }
        //another very stupid way to filter out the eth messages from console log, too bad!
        if (exports.isAllowPiping &&
            msg.indexOf('<#DONT_LOG_ME$>') === -1 &&
            !exports.directlyOutputLogs)
            defaultPipeFactory.log(msg);
        //remove the tag
        msg = msg.replace('<#DONT_LOG_ME$>', '');
        let consoleLog = console._log || console.log;
        if ((0, exports.isEnvTrue)('PIPE_IGNORE_CONSOLE') || exports.directlyOutputLogs)
            consoleLog(...any.map((any) => typeof any === 'string'
                ? (0, exports.isScriptMode)() && defaultPipeFactory
                    ? (0, colours_1.blessedToAnsi)(defaultPipeFactory.addColoursToString(defaultPipeFactory.messageToString(any)))
                    : require('blessed').stripTags(any)
                : any));
    };
    exports.consoleLogReplacement = consoleLogReplacement;
    const directlyLog = (...any) => {
        any = any.map((val) => {
            if (val instanceof Error)
                val = val.message;
            if (val && typeof val === 'object' && val.message)
                val = val.message;
            if (typeof val === 'object')
                try {
                    val = JSON.stringify(val, null, 4);
                }
                catch (error) { }
            val = val.toString();
            return (0, exports.isScriptMode)() && defaultPipeFactory
                ? (0, colours_1.blessedToAnsi)(defaultPipeFactory.addColoursToString(defaultPipeFactory.messageToString(val)))
                : require('blessed').stripTags(val);
        });
        (0, exports.print)(...any);
    };
    exports.directlyLog = directlyLog;
    const consoleErrorReplacement = (...any) => {
        let error = any[0];
        if (defaultPipeFactory) {
            //adds it to the log
            defaultPipeFactory.error(error);
            if ((0, exports.isEnvTrue)('PIPE_LOG_ERRORS_TO_DEBUG'))
                defaultPipeFactory.pipes['debug'].log(error);
            if ((0, exports.isEnvTrue)('PIPE_LOG_ERRORS_TO_DEFAULT'))
                defaultPipeFactory.pipes['default'].log(error);
        }
        if ((0, exports.isEnvTrue)('PIPE_ECHO_ERRORS') ||
            scriptMode ||
            !exports.isAllowPiping ||
            !pipes_1.defaultFactory)
            console._error(...any);
    };
    exports.consoleErrorReplacement = consoleErrorReplacement;
    /**
     * Overwrites default behaviour of console.log and console.error
     */
    const overwriteConsoleMethods = () => {
        //overwrite console log
        let __log = console.log;
        if (!console._log) {
            console._log = (...any) => __log(...any);
            console.log = exports.consoleLogReplacement;
        }
        let __error = console.error;
        if (!console._error) {
            console._error = (...any) => __error(...any);
            console.error = exports.consoleErrorReplacement;
        }
    };
    exports.overwriteConsoleMethods = overwriteConsoleMethods;
    /**
     * Returns safely the infinity mint config file
     * @returns
     */
    let _config = null;
    const getConfigFile = (reload = false) => {
        if (_config)
            return _config;
        let checkExtensions = ['mjs', 'js', 'ts', 'cjs', 'json'];
        let configPath = (0, exports.cwd)() + '/infinitymint.config';
        for (let i = 0; i < checkExtensions.length; i++) {
            if (fs_1.default.existsSync(configPath + '.' + checkExtensions[i])) {
                configPath = configPath + '.' + checkExtensions[i];
                break;
            }
        }
        if (reload && require.cache[configPath]) {
            (0, exports.warning)('reloading config file => ' + configPath);
            delete require.cache[configPath];
        }
        console.log('loading config file from ' + configPath);
        let res = require(configPath);
        res = res.default || res;
        let session = (0, exports.readGlobalSession)();
        //will replace all the variables in the config with the environment variables or the session variables
        let replaceVariables = (obj) => {
            var _a, _b, _c, _d, _e, _f;
            for (let key in obj) {
                if (typeof obj[key] === 'string') {
                    if (obj[key].startsWith('session:')) {
                        let sessionKey = obj[key].substring(8);
                        if (sessionKey.includes('||')) {
                            let split = sessionKey.split('||');
                            sessionKey = split[0];
                            if (!session.environment[sessionKey] ||
                                ((_c = (_b = (_a = session.environment) === null || _a === void 0 ? void 0 : _a[sessionKey]) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.length) === 0) {
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
                            if (!process.env[envKey] ||
                                ((_f = (_e = (_d = process.env) === null || _d === void 0 ? void 0 : _d[envKey]) === null || _e === void 0 ? void 0 : _e.trim()) === null || _f === void 0 ? void 0 : _f.length) === 0) {
                                obj[key] = split[1];
                                replaceVariables(obj);
                                return;
                            }
                        }
                        obj[key] = process.env[envKey] || '';
                    }
                }
                else if (typeof obj[key] === 'object') {
                    replaceVariables(obj[key]);
                }
            }
            return obj;
        };
        replaceVariables(res);
        _config = res;
        return res;
    };
    exports.getConfigFile = getConfigFile;
    const copyContractsFromNodeModule = (destination, source) => {
        if ((0, exports.isInfinityMint)()) {
            (0, exports.warning)('cannot use node modules in InfinityMint package');
            return;
        }
        if (!fs_1.default.existsSync(source))
            throw new Error('please npm i infinitymint and make sure ' + module + 'exists');
        if (fs_1.default.existsSync(destination) && (0, exports.isEnvTrue)('SOLIDITY_CLEAN_NAMESPACE')) {
            (0, exports.log)('cleaning ' + source, 'fs');
            fs_1.default.rmdirSync(destination, {
                recursive: true,
                force: true,
            });
        }
        if (!fs_1.default.existsSync(destination)) {
            (0, exports.log)('copying ' + source + ' to ' + destination, 'fs');
            fs_extra_1.default.copySync(source, destination);
            fs_1.default.chmodSync(destination, 0o777);
        }
    };
    exports.copyContractsFromNodeModule = copyContractsFromNodeModule;
    const prepareHardhatConfig = (config) => {
        if (!config.hardhat.networks)
            config.hardhat.networks = {};
        //copy ganache settings to localhost settings if ganache exists
        if (!config.hardhat.networks.localhost && config.hardhat.networks.ganache)
            config.hardhat.networks.localhost = config.hardhat.networks.ganache;
        if (!config.hardhat.paths)
            config.hardhat.paths = {};
        return config;
    };
    exports.prepareHardhatConfig = prepareHardhatConfig;
    const cleanCompilations = () => {
        try {
            (0, exports.debugLog)('removing ./artifacts');
            fs_1.default.rmdirSync((0, exports.cwd)() + '/artifacts', {
                recursive: true,
                force: true,
            });
            (0, exports.debugLog)('removing ./cache');
            fs_1.default.rmdirSync((0, exports.cwd)() + '/cache', {
                recursive: true,
                force: true,
            });
            (0, exports.debugLog)('removing ./typechain-types');
            fs_1.default.rmdirSync((0, exports.cwd)() + '.typechain-types', {
                recursive: true,
                force: true,
            });
        }
        catch (error) {
            if ((0, exports.isEnvTrue)('THROW_ALL_ERRORS'))
                throw error;
            (0, exports.warning)('unable to delete folder: ' + (error === null || error === void 0 ? void 0 : error.message) || error);
        }
    };
    exports.cleanCompilations = cleanCompilations;
    exports.hasChangedGlobalUserId = false;
    /**
     * Loads the infinitymint.config.js and prepares the hardhat response. Only to be used inside of hardhat.config.ts.
     * @returns
     */
    const prepareConfig = () => {
        var _a;
        //else, import the InfinityMint config
        let config = (0, exports.getConfigFile)();
        let session = (0, exports.readGlobalSession)();
        let flag = true;
        if (((_a = session.environment) === null || _a === void 0 ? void 0 : _a.globalUserId) === undefined) {
            session.environment.globalUserId = uuidv4();
            exports.hasChangedGlobalUserId = fs_1.default.existsSync((0, exports.cwd)() + '/.uuid');
            fs_1.default.writeFileSync((0, exports.cwd)() + '/.uuid', session.environment.globalUserId);
            flag = false;
        }
        if (flag && fs_1.default.existsSync((0, exports.cwd)() + '/.uuid')) {
            let result = fs_1.default.readFileSync((0, exports.cwd)() + '/.uuid', {
                encoding: 'utf-8',
            });
            if (result !== session.environment.globalUserId)
                exports.hasChangedGlobalUserId = true;
        }
        if (!config.hardhat.defaultNetwork)
            config.hardhat.defaultNetwork = 'hardhat';
        //
        (0, exports.prepareHardhatConfig)(config);
        let solidityModuleFolder = (0, exports.cwd)() +
            '/node_modules/infinitymint/' +
            (process.env.DEFAULT_SOLIDITY_FOLDER || 'alpha');
        let solidityFolder = (0, exports.cwd)() + '/' + (process.env.DEFAULT_SOLIDITY_FOLDER || 'alpha');
        if ((0, exports.isEnvTrue)('SOLIDITY_USE_NODE_MODULE'))
            (0, exports.copyContractsFromNodeModule)(solidityFolder, solidityModuleFolder);
        //if the sources is undefined, then set the solidityFolder to be the source foot
        if (!config.hardhat.paths.sources) {
            //set the sources
            config.hardhat.paths.sources = solidityFolder;
            //delete artifacts folder if namespace changes
            if (process.env.DEFAULT_SOLIDITY_FOLDER &&
                session.environment.solidityFolder &&
                session.environment.solidityFolder !==
                    process.env.DEFAULT_SOLIDITY_FOLDER) {
                (0, exports.cleanCompilations)();
                session.environment.solidityFolder =
                    process.env.DEFAULT_SOLIDITY_FOLDER;
            }
            (0, exports.saveGlobalSessionFile)(session);
        }
        else {
            //if we have changed the sources file then clean up old stuff
            if (session.environment.solidityFolder !== config.hardhat.paths.sources)
                (0, exports.cleanCompilations)();
            //if it is then set the solidityFolder to be the current value of the sources
            session.environment.solidityFolder = config.hardhat.paths.sources;
            (0, exports.saveGlobalSessionFile)(session);
        }
        //set the solidityFolder in the environment if it is undefined
        if (!session.environment.solidityFolder)
            session.environment.solidityFolder =
                process.env.DEFAULT_SOLIDITY_FOLDER || 'alpha';
        //will replace all the variables in the config with the environment variables or the session variables
        let replaceVariables = (obj) => {
            var _a, _b, _c, _d, _e, _f;
            for (let key in obj) {
                if (typeof obj[key] === 'string') {
                    if (obj[key].startsWith('session:')) {
                        let sessionKey = obj[key].substring(8);
                        if (sessionKey.includes('||')) {
                            let split = sessionKey.split('||');
                            sessionKey = split[0];
                            if (!session.environment[sessionKey] ||
                                ((_c = (_b = (_a = session.environment) === null || _a === void 0 ? void 0 : _a[sessionKey]) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.length) === 0) {
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
                            if (!process.env[envKey] ||
                                ((_f = (_e = (_d = process.env) === null || _d === void 0 ? void 0 : _d[envKey]) === null || _e === void 0 ? void 0 : _e.trim()) === null || _f === void 0 ? void 0 : _f.length) === 0) {
                                obj[key] = split[1];
                                replaceVariables(obj);
                                return;
                            }
                        }
                        obj[key] = process.env[envKey] || '';
                    }
                }
                else if (typeof obj[key] === 'object') {
                    replaceVariables(obj[key]);
                }
            }
            return obj;
        };
        replaceVariables(config);
        return config;
    };
    exports.prepareConfig = prepareConfig;
    const findWindows = (roots) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _e, _f;
        let config = (0, exports.getConfigFile)();
        let searchLocations = [...(roots || [])];
        if (!(0, exports.isInfinityMint)())
            searchLocations.push((0, exports.cwd)() + '/node_modules/infinitymint/dist/app/windows/**/*.js');
        searchLocations.push((0, exports.cwd)() + '/windows/**/*.js');
        if ((0, exports.isTypescript)() ||
            !((_f = (_e = config.settings) === null || _e === void 0 ? void 0 : _e.console) === null || _f === void 0 ? void 0 : _f.disallowTypescriptWindows)) {
            if ((0, exports.isInfinityMint)())
                searchLocations.push((0, exports.cwd)() + '/app/windows/**/*.ts');
            searchLocations.push((0, exports.cwd)() + '/windows/**/*.ts');
        }
        let files = [];
        for (let i = 0; i < searchLocations.length; i++) {
            files = [...files, ...(yield (0, exports.findFiles)(searchLocations[i]))];
            files = files.filter((x) => !x.endsWith('.d.ts') && !x.endsWith('.type-extension.ts'));
        }
        //also add loaded gems windows
        files = [
            ...files,
            ...Object.values((0, gems_1.getLoadedGems)())
                .map((x) => x.windows)
                .flat(),
        ];
        files = files.filter((x) => !x.endsWith('.d.ts'));
        return files;
    });
    exports.findWindows = findWindows;
    const getInfinityMintVersion = () => {
        var _a, _b;
        if ((0, exports.isInfinityMint)())
            return ((_a = (0, exports.getPackageJson)()) === null || _a === void 0 ? void 0 : _a.version) || '1.0.0';
        if (!fs_1.default.existsSync((0, exports.cwd)() + '/node_modules/infinitymint/package.json'))
            return '1.0.0';
        return (((_b = JSON.parse(fs_1.default.readFileSync((0, exports.cwd)() + '/node_modules/infinitymint/package.json', {
            encoding: 'utf-8',
        }))) === null || _b === void 0 ? void 0 : _b.version) || '1.0.0');
    };
    exports.getInfinityMintVersion = getInfinityMintVersion;
    const getInfinityMintClientVersion = () => {
        if (!fs_1.default.existsSync((0, exports.cwd)() + '/node_modules/infinitymint-client/package.json'))
            return '1.0.0';
        return (JSON.parse(fs_1.default.readFileSync((0, exports.cwd)() + '/node_modules/infinitymint-client/package.json', {
            encoding: 'utf-8',
        })).version || '1.0.0');
    };
    exports.getInfinityMintClientVersion = getInfinityMintClientVersion;
    const blockGanacheMessage = (msg) => {
        exports.blockedGanacheMessages.push(msg);
    };
    exports.blockGanacheMessage = blockGanacheMessage;
    /**
     *
     * @returns the package.json file as an object
     */
    const getPackageJson = () => {
        if (!fs_1.default.existsSync(path_1.default.join(process.cwd(), 'package.json')))
            return {};
        return JSON.parse(fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'package.json'), {
            encoding: 'utf-8',
        }));
    };
    exports.getPackageJson = getPackageJson;
    /**
     *
     * @param globPattern
     * @returns
     */
    const findFiles = (globPattern) => {
        return new Promise((resolve, reject) => {
            (0, exports.safeGlobCB)(globPattern, (err, matches) => {
                if (err)
                    throw err;
                //remove duplicates
                matches = matches.filter((v, i, a) => a.indexOf(v) === i);
                resolve(matches);
            });
        });
    };
    exports.findFiles = findFiles;
    const isTypescript = () => {
        var _a;
        let session = (0, exports.readGlobalSession)();
        return (((_a = session.environment) === null || _a === void 0 ? void 0 : _a.javascript) === undefined ||
            session.environment.javascript !== true);
    };
    exports.isTypescript = isTypescript;
    const getRandomNumber = (maxNumber) => {
        //get a more random number not base on time but on the current process id
        let pid = process.pid;
        let seed = Date.now() + pid;
        let random = seed * Math.random();
        return Math.floor(random % maxNumber);
    };
    exports.getRandomNumber = getRandomNumber;
    const getFileImportExtension = () => {
        var _a;
        let session = (0, exports.readGlobalSession)();
        if ((_a = session.environment) === null || _a === void 0 ? void 0 : _a.javascript)
            return '.js';
        return '.ts';
    };
    exports.getFileImportExtension = getFileImportExtension;
    /**
     * looks for scripts inside of cwd /scripts/ and if we aren't infinityMint and the env variable INFINITYMINT_s
     * @param extension
     * @param roots
     * @returns
     */
    const findScripts = (roots = []) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _g, _h, _j;
        let config = (0, exports.getConfigFile)();
        roots = roots || [];
        //try and include everything in the scripts folder of the module
        if (!(0, exports.isInfinityMint)() && !(0, exports.isEnvTrue)('INFINITYMINT_UNINCLUDE_SCRIPTS')) {
            if ((_g = config === null || config === void 0 ? void 0 : config.dev) === null || _g === void 0 ? void 0 : _g.useLocalDist)
                roots.push((0, exports.cwd)() + '/dist/scripts/');
            else
                roots.push((0, exports.cwd)() + '/node_modules/infinitymint/dist/scripts/');
        }
        //require JS files always
        roots.push((0, exports.cwd)() + '/scripts/');
        roots = [
            ...roots,
            ...(config.roots || []).map((root) => {
                if (root.startsWith('../') ||
                    root.startsWith('./') ||
                    root.startsWith('/../'))
                    root =
                        (0, exports.cwd)() +
                            '/' +
                            (root.startsWith('/') ? root.substring(1) : root);
                if (!root.endsWith('/'))
                    root += '/';
                return root + 'scripts/';
            }),
        ];
        let scanned = [];
        for (let i = 0; i < roots.length; i++) {
            scanned = [
                ...scanned,
                ...(yield (0, exports.findFiles)(roots[i] + '**/*.js')),
                ...(yield (0, exports.findFiles)(roots[i] + '**/*.cjs')),
                ...(yield (0, exports.findFiles)(roots[i] + '**/*.mjs')),
            ];
            if ((0, exports.isTypescript)() || !((_j = (_h = config.settings) === null || _h === void 0 ? void 0 : _h.scripts) === null || _j === void 0 ? void 0 : _j.disallowTypescript)) {
                scanned = [...scanned, ...(yield (0, exports.findFiles)(roots[i] + '**/*.ts'))];
                scanned = scanned.filter((x) => !x.endsWith('.d.ts') && !x.endsWith('.type-extension.ts'));
            }
        }
        //also add gems
        scanned = [
            ...scanned,
            ...Object.values((0, gems_1.getLoadedGems)())
                .map((x) => x.scripts)
                .flat(),
        ];
        //remove duplicates and also hidden scripts
        scanned = scanned.filter((value, index, self) => {
            var _a, _b;
            return (self.indexOf(value) === index &&
                [...(((_b = (_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.scripts) === null || _b === void 0 ? void 0 : _b.hideScripts) || [])].filter((x) => value.includes(x)).length === 0);
        });
        scanned = scanned.map((fullPath) => {
            return path_1.default.parse(fullPath);
        });
        return scanned;
    });
    exports.findScripts = findScripts;
    const toTempProject = (project) => {
        return project;
    };
    exports.toTempProject = toTempProject;
    const normalizeSeperators = (path) => {
        return path.replace(/\\/g, '/');
    };
    exports.normalizeSeperators = normalizeSeperators;
    const replaceSeperators = (path, force = false) => {
        if (os_1.default.platform() === 'win32' || force)
            return path.replace(/\//g, '\\');
        return path;
    };
    exports.replaceSeperators = replaceSeperators;
    const isWindows = () => {
        return os_1.default.platform() === 'win32';
    };
    exports.isWindows = isWindows;
    const makeDirectories = (directoryPath) => {
        if (directoryPath.split('/').pop().includes('.'))
            directoryPath = path_1.default.dirname(directoryPath);
        let split = directoryPath.split('/');
        let current = '';
        for (let i = 0; i < split.length; i++) {
            current += split[i] + '/';
            if (!fs_1.default.existsSync(current))
                fs_1.default.mkdirSync(current, { recursive: true });
        }
    };
    exports.makeDirectories = makeDirectories;
    /**
     *
     * @param fileName
     * @returns
     */
    const requireWindow = (fileName, infinityConsole, keepCache) => {
        if (!fs_1.default.existsSync(fileName))
            throw new Error('cannot find script: ' + fileName);
        if (!keepCache && require.cache[fileName]) {
            if (infinityConsole)
                infinityConsole.debugLog('\tdeleting old cache  => ' + fileName);
            else
                (0, exports.debugLog)('\tdeleting old cache  => ' + fileName);
            delete require.cache[fileName];
        }
        else if (keepCache)
            if (infinityConsole)
                infinityConsole.debugLog('\tkeeping old cache  => ' + fileName);
            else
                (0, exports.debugLog)('\tkeeping old cache  => ' + fileName);
        if (infinityConsole)
            infinityConsole.debugLog('\trequiring => ' + fileName);
        else
            (0, exports.debugLog)('\trequiring  => ' + fileName);
        let result = require(fileName);
        result = result.default || result;
        result.setFileName(fileName);
        return result;
    };
    exports.requireWindow = requireWindow;
    /**
     * Checks cwd for a /script/ folder and looks for a script with that name. if it can't find it will look in this repos deploy scripts and try and return that
     * @param fileName
     * @param root
     * @returns
     */
    const requireScript = (fullPath, infinityConsole, keepCache) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let hasReloaded = false;
        if (!fs_1.default.existsSync(fullPath))
            throw new Error('cannot find script: ' + fullPath);
        if (!keepCache && require.cache[fullPath]) {
            infinityConsole
                ? infinityConsole.debugLog('\tdeleting old script cache => ' + fullPath)
                : (0, exports.debugLog)('\tdeleting old script cache of ' + fullPath);
            delete require.cache[fullPath];
            hasReloaded = true;
        }
        else if (keepCache) {
            infinityConsole
                ? infinityConsole.debugLog('\tkeeping old script cache => ' + fullPath)
                : (0, exports.debugLog)('\tkeeping old script cache => ' + fullPath);
        }
        let result = yield require(fullPath);
        result = result.default || result;
        if (hasReloaded && keepCache && infinityConsole.isTelnet())
            result = Object.create(result); //clone this object if it has been reloaded, and keeping cache, and we are telnet
        result.fileName = fullPath;
        if (infinityConsole && result.events) {
            Object.keys(result.events).forEach((key) => {
                try {
                    infinityConsole.getEventEmitter().off(key, result.events[key]);
                }
                catch (error) {
                    (0, exports.warning)('could not turn off event emitter: ' + (error === null || error === void 0 ? void 0 : error.message));
                }
                infinityConsole
                    ? infinityConsole.debugLog('\tnew event registered<EventEmitter>(' + key + ')')
                    : (0, exports.debugLog)('\tnew event registered <EventEmitter>(' + key + ')');
                infinityConsole.getEventEmitter().on(key, result.events[key]);
            });
        }
        try {
            if ((result === null || result === void 0 ? void 0 : result.reloaded) && hasReloaded) {
                if (infinityConsole)
                    infinityConsole.debugLog('\tcalling (reloaded) => ' + fullPath);
                else
                    (0, exports.debugLog)('\tcalling (reloaded) => ' + fullPath);
                yield result.reloaded({
                    log: exports.log,
                    debugLog: exports.debugLog,
                    infinityConsole,
                    eventEmitter: infinityConsole.getEventEmitter(),
                    script: result,
                });
            }
            if (result === null || result === void 0 ? void 0 : result.loaded) {
                if (infinityConsole)
                    infinityConsole.debugLog('\tcalling (loaded) => ' + fullPath);
                else
                    (0, exports.debugLog)('\tcalling (loaded) => ' + fullPath);
                yield result.loaded({
                    log: exports.log,
                    debugLog: exports.debugLog,
                    infinityConsole,
                    eventEmitter: infinityConsole.getEventEmitter(),
                    script: result,
                });
            }
        }
        catch (error) {
            (0, exports.warning)('bad reload/loaded: ' + error.message);
        }
        return result;
    });
    exports.requireScript = requireScript;
    const isInfinityMint = () => {
        try {
            let packageJson = (0, exports.getPackageJson)();
            if ((packageJson === null || packageJson === void 0 ? void 0 : packageJson.name) === 'infinitymint')
                return true;
        }
        catch (error) {
            if ((0, exports.isEnvTrue)('THROW_ALL_ERRORS'))
                throw error;
            return false;
        }
    };
    exports.isInfinityMint = isInfinityMint;
    exports.showAllLogs = false;
    const setShowAllLogs = (value = true) => {
        exports.showAllLogs = value;
    };
    exports.setShowAllLogs = setShowAllLogs;
    exports.isAllowPiping = false;
    const setAllowPiping = (value = true) => {
        exports.isAllowPiping = value;
    };
    exports.setAllowPiping = setAllowPiping;
    /**
     * Takes argv from yargs and returns destructuable object, see {@link app/cli}
     * @param argv
     */
    const getFlags = (argv) => {
        if (argv.argv)
            argv = argv.argv;
        let obj = {};
        Object.keys(argv).forEach((k) => {
            let splits = k.split('_');
            if (splits)
                splits = splits.filter((split) => split.length !== 0);
            let str = splits[0] || k;
            if (splits && splits.length > 1)
                for (let i = 0; i < splits.length; i++) {
                    str = str + splits[i][0].toUpperCase() + splits[i].substring(1);
                }
            obj[str] =
                (argv === null || argv === void 0 ? void 0 : argv[k]) === true ||
                    (argv === null || argv === void 0 ? void 0 : argv[k]) === 'true' ||
                    ((argv === null || argv === void 0 ? void 0 : argv[k]) !== undefined &&
                        (argv === null || argv === void 0 ? void 0 : argv[k]) !== 'false' &&
                        parseInt(argv === null || argv === void 0 ? void 0 : argv[k]) !== 0 &&
                        !isNaN(parseInt(argv === null || argv === void 0 ? void 0 : argv[k])));
        });
        return obj;
    };
    exports.getFlags = getFlags;
    /**
     * Loaded when hardhat is being initialized, essentially creates an infinitymint.config if one is not available, generates a new ganache mnemonic and overwrites console.log and console.error to be piped to what ever pipe is currently default.
     *
     * @see {@link app/interfaces.InfinityMintConfig}
     * @see {@link app/pipes.Pipe}
     * @param useJavascript Will return infinitymint.config.js instead of infinitymint.config.ts
     * @param useInternalRequire  Will use require('./app/interfaces') instead of require('infinitymint/dist/app/interfaces')
     * @returns
     */
    const loadInfinityMint = (useJavascript, useInternalRequire) => {
        //set default pipe factory
        (0, exports.setPipeFactory)(pipes_1.defaultFactory || new pipes_1.PipeFactory());
        //creates dirs
        (0, exports.createDirs)([
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
        (0, exports.createEnv)();
        (0, exports.initializeGanacheMnemonic)();
        //try to automatically add module alias
        try {
            let projectJson = (0, exports.getPackageJson)();
            if (!projectJson._moduleAliases) {
                projectJson._moduleAliases = {
                    '@app': './node_modules/infinitymint/dist/app/',
                    '@types': './node_modules/infinitymint/dist/types/',
                    '@typechain-types': './node_modules/infinitymint/dist/typechain-types/',
                };
            }
            fs_1.default.writeFileSync((0, exports.cwd)() + '/package.json', JSON.stringify(projectJson, null, 2));
        }
        catch (error) { }
        //set status of javascript usage
        let session = (0, exports.readGlobalSession)();
        session.environment.javascript = useJavascript;
        (0, exports.saveGlobalSessionFile)(session);
        (0, exports.createInfinityMintConfig)(useJavascript, useInternalRequire);
    };
    exports.loadInfinityMint = loadInfinityMint;
    let hasExposed = false;
    const exposeLogs = (reexpose = false) => {
        if (hasExposed && !reexpose)
            return;
        (0, exports.setExposeConsoleHostMessage)(true);
        (0, exports.setIgnorePipeFactory)(true);
        (0, exports.setAllowPiping)(false);
        hasExposed = true;
    };
    exports.exposeLogs = exposeLogs;
    const createDirs = (dirs) => {
        dirs.filter((dir) => !fs_1.default.existsSync(dir)).forEach((dir) => fs_1.default.mkdirSync((0, exports.cwd)() + (dir[0] !== '/' ? '/' + dir : dir)));
    };
    exports.createDirs = createDirs;
    const readJson = (fileName) => {
        return JSON.parse(fs_1.default.readFileSync(fileName, {
            encoding: 'utf8',
        }));
    };
    exports.readJson = readJson;
    const createEnvFile = (source) => {
        source = (source === null || source === void 0 ? void 0 : source.default) || source;
        //dont do node modules
        if ((0, exports.isInfinityMint)())
            source.SOLIDITY_USE_NODE_MODULE = false;
        let stub = ``;
        Object.keys(source).forEach((key) => {
            stub = `${stub}${key.toUpperCase()}=${typeof source[key] === 'string'
                ? '"' + source[key] + '"'
                : source[key]
                    ? source[key]
                    : ''}\n`;
        });
        fs_1.default.writeFileSync((0, exports.cwd)() + '/.env', stub);
    };
    exports.createEnvFile = createEnvFile;
    const getEnv = (key) => {
        return process === null || process === void 0 ? void 0 : process.env[key];
    };
    exports.getEnv = getEnv;
    const createEnv = () => {
        if (!fs_1.default.existsSync((0, exports.cwd)() + '/.env')) {
            let path = fs_1.default.existsSync((0, exports.cwd)() + '/examples/.example.env')
                ? (0, exports.cwd)() + '/examples/.example.env'
                : (0, exports.cwd)() + '/node_modules/infinitymint/examples/.example.env';
            if (!fs_1.default.existsSync(path))
                throw new Error('could not find: ' + path + ' to create .env file with');
            fs_1.default.copyFileSync(path, (0, exports.cwd)() + '/.env');
            console.log('🧱 Created default .env file');
            //require dotenv if it exists
            if ((0, exports.hasNodeModule)('dotenv')) {
                console.log('🧱 Loading .env file');
                require('dotenv').config({
                    override: false, //will not override already established environment variables
                });
            }
        }
    };
    exports.createEnv = createEnv;
    /**
     * creates the pipes (loggers) on the passed pipe factory.
     * @param factory
     */
    const createPipes = (factory) => {
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
        if (!factory.pipes['default'])
            factory.registerSimplePipe('default');
        //will log console.log output to the default pipe
        if ((0, exports.isEnvTrue)('PIPE_ECHO_DEFAULT'))
            factory.getPipe('default').listen = true;
        //removes debug pipe
        if ((0, exports.isEnvTrue)('PIPE_SILENCE_DEBUG'))
            pipes = pipes.slice(1);
        pipes.forEach((pipe) => {
            if (!factory.pipes[pipe])
                factory.registerSimplePipe(pipe, {
                    listen: (0, exports.envExists)('PIPE_ECHO_' + pipe.toUpperCase()) &&
                        process.env['PIPE_ECHO_' + pipe.toUpperCase()] === 'true',
                    save: true,
                });
        });
        if ((0, exports.isEnvTrue)('PIPE_SEPERATE_WARNINGS'))
            factory.registerSimplePipe('warnings', {
                listen: (0, exports.isEnvTrue)('PIPE_ECHO_WARNINGS'),
                save: true,
            });
    };
    exports.createPipes = createPipes;
    const initializeGanacheMnemonic = () => {
        let session = (0, exports.readGlobalSession)();
        if (!(0, exports.isEnvTrue)('GANACHE_EXTERNAL'))
            session.environment.ganacheMnemonic = (0, exports.getGanacheMnemonic)();
        else {
            if (session.environment.ganacheMnemonic)
                delete session.environment.ganacheMnemonic;
            if (fs_1.default.existsSync((0, exports.cwd)() + '/.mnemonics'))
                session.environment.ganacheMnemonic = (0, exports.readJson)((0, exports.cwd)() + '/.mnemonics').ganache.mnemonic;
            else
                (0, exports.warning)('no ganache mnemonic found, please create a .mnemonics file by running npm run ganache');
        }
        (0, exports.saveGlobalSessionFile)(session);
    };
    exports.initializeGanacheMnemonic = initializeGanacheMnemonic;
    /**
     * creates a default infinitymint.config.ts file or a infinitymint.config.js file if useJavascript is true
     * @param useJavascript
     * @param useInternalRequire
     */
    const createInfinityMintConfig = (useJavascript, useInternalRequire) => {
        let filename = useJavascript
            ? 'infinitymint.config.js'
            : 'infinitymint.config.ts';
        if (!fs_1.default.existsSync((0, exports.cwd)() + '/' + filename))
            return;
        let config = {
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
        if (checkExtensions
            .map((ext) => {
            if (fs_1.default.existsSync((0, exports.cwd)() + '/infinitymint.config.' + ext))
                return true;
            return false;
        })
            .filter((v) => v).length !== 0) {
            return;
        }
        //check if the infinity mint config file has not been created, if it hasn't then create a new config file with the values of the object above
        fs_1.default.writeFileSync((0, exports.cwd)() + '/' + filename, stub);
    };
    exports.createInfinityMintConfig = createInfinityMintConfig;
    /**
     * gets the current folder solc is using
     * @returns
     */
    const getSolidityFolder = () => {
        var _a;
        let session = (0, exports.readGlobalSession)();
        return (((_a = session.environment) === null || _a === void 0 ? void 0 : _a.solidityFolder) ||
            process.env.DEFAULT_SOLIDITY_FOLDER ||
            'alpha');
    };
    exports.getSolidityFolder = getSolidityFolder;
    const hasHardhatConfig = (extensions = ['ts', 'js', 'mjs', 'cjs']) => {
        let hasConfig = false;
        extensions.forEach((extension) => {
            if (fs_1.default.existsSync(process.cwd() + `/hardhat.config.${extension}`))
                hasConfig = true;
        });
        return hasConfig;
    };
    exports.hasHardhatConfig = hasHardhatConfig;
    /**
     * saves a session variable to the .session file
     * @param session
     * @param key
     * @param value
     * @returns
     */
    const saveSessionVariable = (session, key, value) => {
        if (!session.environment)
            session.environment = {};
        session.environment[key] = value;
        return session;
    };
    exports.saveSessionVariable = saveSessionVariable;
    let locations = {};
    const saveLocations = (_locations) => {
        fs_1.default.writeFileSync((0, exports.cwd)() + '/temp/locations.json', JSON.stringify(_locations || locations));
    };
    exports.saveLocations = saveLocations;
    const hasLocationForProject = (projectName) => {
        return !!locations[projectName];
    };
    exports.hasLocationForProject = hasLocationForProject;
    const readLocations = (useFresh = false) => {
        if ((!useFresh && Object.keys(locations).length > 0) ||
            !fs_1.default.existsSync((0, exports.cwd)() + '/temp/locations.json'))
            return locations;
        locations = JSON.parse(fs_1.default.readFileSync((0, exports.cwd)() + '/temp/locations.json', {
            encoding: 'utf-8',
        }));
        return locations;
    };
    exports.readLocations = readLocations;
    let memorySession;
    /**
     *
     * @param session Saves the InfinityMint Session
     */
    const saveGlobalSessionFile = (session) => {
        memorySession = session;
        fs_1.default.writeFileSync((0, exports.cwd)() + '/.session', JSON.stringify(session));
    };
    exports.saveGlobalSessionFile = saveGlobalSessionFile;
    /**
     * gets ganache mnemonic
     * @returns
     */
    const getGanacheMnemonic = () => {
        var _a, _b, _c, _d;
        if ((_b = (_a = (0, exports.readGlobalSession)()) === null || _a === void 0 ? void 0 : _a.environment) === null || _b === void 0 ? void 0 : _b.ganacheMnemonic)
            return (_d = (_c = (0, exports.readGlobalSession)()) === null || _c === void 0 ? void 0 : _c.environment) === null || _d === void 0 ? void 0 : _d.ganacheMnemonic;
        return fs_1.default.existsSync((0, exports.cwd)() + '/.mnemonic')
            ? fs_1.default.readFileSync((0, exports.cwd)() + '/.mnemonic', {
                encoding: 'utf-8',
            })
            : (0, bip39_1.generateMnemonic)();
    };
    exports.getGanacheMnemonic = getGanacheMnemonic;
    /**
     *
     * @param error Logs an error
     */
    const error = (error) => {
        let newError = error instanceof Error ? error : new Error(error);
        if (!exports.isAllowPiping) {
            if (console._error)
                console._error(newError);
            else
                console.error(newError);
        }
        else
            defaultPipeFactory.error(newError);
    };
    exports.error = error;
    /**
     * Since InfinityMintEnvironmentKeys is need as a type for both isEnvSet and isEnvTrue you can use this one to look any env up
     * @param
     * @returns
     */
    const envExists = (key) => {
        return (0, exports.isEnvSet)(key);
    };
    exports.envExists = envExists;
    /**
     * Used in express routes. This will send a json response that is garunteed to be safe to be serialized
     * @param res
     * @param obj
     */
    const returnSafeJson = (res, obj = {}, status = 200) => {
        res.status(status);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify((0, exports.makeJsonSafe)(obj)));
    };
    exports.returnSafeJson = returnSafeJson;
    const isGanacheAlive = (port) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        port = parseInt((port || process.env.GANACHE_PORT || 8545).toString());
        return ((yield (0, exports.tcpPingPort)('127.0.0.1', port)).online === true ||
            (yield (0, exports.tcpPingPort)('localhost', port)).online === true);
    });
    exports.isGanacheAlive = isGanacheAlive;
    /**
     * non typed version of isEnvTrue
     * @param key
     * @returns
     */
    const envTrue = (key) => {
        return (0, exports.isEnvTrue)(key);
    };
    exports.envTrue = envTrue;
    /**
     * Makes an object safe to be serialized to json
     * @param obj
     * @returns
     */
    const makeJsonSafe = (obj = {}) => {
        if (obj === null)
            return {};
        //remove all functions, bigInts and other things which can't be serialized
        let newObj = {};
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'function' ||
                typeof obj[key] === 'symbol' ||
                typeof obj[key] === 'undefined')
                return;
            if (typeof obj[key] === 'bigint') {
                newObj[key] = obj[key].toString();
                return;
            }
            if (typeof obj[key] === 'object') {
                if (Array.isArray(obj[key])) {
                    newObj[key] = [];
                    obj[key].forEach((item) => {
                        if (typeof item === 'function' ||
                            typeof item === 'symbol' ||
                            typeof item === 'undefined')
                            return;
                        if (typeof item === 'bigint') {
                            newObj[key].push(item.toString());
                            return;
                        }
                        if (typeof item === 'object') {
                            newObj[key].push((0, exports.makeJsonSafe)(item));
                        }
                        else
                            newObj[key].push(item);
                    });
                }
                else {
                    newObj[key] = (0, exports.makeJsonSafe)(obj[key]);
                }
            }
            else
                newObj[key] = obj[key];
        });
        return newObj;
    };
    exports.makeJsonSafe = makeJsonSafe;
    /**
     * returns if an InfinityMintEnvironmentKeys is set to true in the environment of the current process
     * @param key
     * @returns
     */
    const isEnvTrue = (key) => {
        return process.env[key] && process.env[key] === 'true';
    };
    exports.isEnvTrue = isEnvTrue;
    /**
     * returns true if InfinityMintEnvironmentKeys is set in the environment of the current process. Unlike isEnvTrue this will only check if the key is not empty.
     * @param key
     * @returns
     */
    const isEnvSet = (key) => {
        var _a;
        return process.env[key] && ((_a = process.env[key]) === null || _a === void 0 ? void 0 : _a.trim().length) !== 0;
    };
    exports.isEnvSet = isEnvSet;
});
//# sourceMappingURL=helpers.js.map