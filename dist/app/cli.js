(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "yargs", "./helpers", "./colours", "./web3", "hardhat", "fs", "./imports", "./pipes"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const yargs_1 = tslib_1.__importDefault(require("yargs"));
    const helpers_1 = require("./helpers");
    //import things we need
    const colours_1 = require("./colours");
    const web3_1 = require("./web3");
    const hardhat_1 = tslib_1.__importDefault(require("hardhat"));
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const imports_1 = require("./imports");
    const pipes_1 = require("./pipes");
    let config = (0, helpers_1.getConfigFile)();
    let options;
    yargs_1.default.parserConfiguration({
        'short-option-groups': true,
        'camel-case-expansion': true,
        'dot-notation': true,
        'parse-numbers': false,
        'boolean-negation': true,
    });
    (() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        var _c, _d, _e, _f, _g, _h, _j, _k;
        (0, helpers_1.setAllowEmojis)(true);
        (0, helpers_1.setScriptMode)(true);
        Object.keys(yargs_1.default.argv).forEach((key) => {
            if (key !== '_')
                console.log('\t{gray-fg}Argument: ' +
                    key +
                    ' => ' +
                    yargs_1.default.argv[key].toString() +
                    '{/}');
        });
        let { startGanache, hideGanache, skipScripts, dontInitialize, showAllLogs, showDebugLogs, startExpress, startWebSocket, stayOpen, production, onlyCurrentNetworkEvents, disableNetworkEvents, } = (0, helpers_1.getFlags)(yield yargs_1.default.argv);
        const stayOpenMethod = () => {
            var _a, _b;
            if (stayOpen) {
                console.log(`{green-fg}{underline}{bold}InfinityMint ${(0, helpers_1.getInfinityMintVersion)()}{/}\nInfinityMint will now keep running until you end this process`);
                if (((_a = infinityConsole.network) === null || _a === void 0 ? void 0 : _a.name) === 'hardhat' &&
                    !((_b = scriptArguments === null || scriptArguments === void 0 ? void 0 : scriptArguments.save) === null || _b === void 0 ? void 0 : _b.value))
                    (0, helpers_1.warning)('Hardhat network is not a persistent network this could mean infinitymint-client. Please be aware that InfinityMint also would not have wrote to your deployments folder. If you want to save the deployments, please use the --save flag when running your script.');
                if (startGanache && !hideGanache) {
                    console.log('\n{cyan-fg}Exposing Ganache Private Keys...{/}');
                    (0, helpers_1.setExposeConsoleHostMessage)(true);
                    let session = (0, helpers_1.readGlobalSession)();
                    let ganachePrivateKeys = session.environment.ganachePrivateKeys;
                    if (ganachePrivateKeys === undefined)
                        (0, helpers_1.warning)(`No ganache private keys to display`);
                    else
                        ganachePrivateKeys.forEach((key, index) => {
                            console.log(`\t[${index}] => ${key}${index === 0 ? ' (deployer)' : ''}`);
                        });
                    console.log('\n{cyan-fg}{bold}Note: {/}{gray-fg}You will see logs being printed below once Ganache gets some action.\nYou can adjust your ganache filters in your config if you would like to limit a message.{/}\n');
                }
                //check if is ts-node instance, if so wait forever
                if (process.argv[0].indexOf('ts-node') !== -1) {
                    (0, helpers_1.warning)(`stopping exit (ran in ts-node)..`);
                    function wait() {
                        setTimeout(() => {
                            wait();
                        }, 1000);
                    }
                    wait();
                }
                if (startExpress) {
                    let routes = infinityConsole.ExpressServer.routes;
                    infinityConsole.log(`\n{cyan-fg}Exposing Express...{/}`);
                    console.log(`\t{gray-fg}Printing all routes{/}\n`);
                    if (routes === undefined || Object.keys(routes).length === 0)
                        (0, helpers_1.warning)(`No routes have been registered\n`);
                    Object.keys(routes).forEach((key) => {
                        let route = routes[key];
                        console.log(`{cyan-fg}Route => {bold}${route.path || key}{/} `);
                        if (route.post)
                            console.log(`\t{green-fg}{bold}HAS POST{/} `);
                        if (route.get)
                            console.log(`\t{green-fg}{bold}HAS GET{/} `);
                    });
                    (0, helpers_1.setAllowExpressLogs)(true);
                }
                if ((0, helpers_1.isEnvTrue)('PRODUCTION')) {
                    infinityConsole.log('\n{yellow-fg}{bold}InfinityMint is in {underline}production{/} {yellow-fg}{bold}mode!{/}');
                }
                console.log('\n{cyan-fg}Press CTRL+C to exit{/}\n');
            }
            else {
                if (infinityConsole.network.name === 'hardhat' &&
                    (!yargs_1.default.argv['save'] || yargs_1.default.argv['save'] === 'false'))
                    (0, helpers_1.warning)('No changes have been saved as you are using the hardhat network. If you want to save your changes, please use the --save flag when running your script.\n');
                if (!infinityConsole.hasNetworkAccess())
                    (0, helpers_1.warning)('No valid Web3 connection was made. Please make sure you have started the chain you are trying to access and check if you have entered the right network info in the config file.');
                process.exit(0);
            }
        };
        try {
            if ((0, helpers_1.isInfinityMint)())
                (yield (_a = (0, helpers_1.cwd)() + '/dist/app/pipes', __syncRequire ? Promise.resolve().then(() => tslib_1.__importStar(require(_a))) : new Promise((resolve_1, reject_1) => { require([_a], resolve_1, reject_1); }).then(tslib_1.__importStar))).setDefaultFactory(pipes_1.defaultFactory);
            else
                (yield (_b = (0, helpers_1.cwd)() + '/node_modules/infinitymint/dist/app/pipes', __syncRequire ? Promise.resolve().then(() => tslib_1.__importStar(require(_b))) : new Promise((resolve_2, reject_2) => { require([_b], resolve_2, reject_2); }).then(tslib_1.__importStar))).setDefaultFactory(pipes_1.defaultFactory);
        }
        catch (error) {
            (0, helpers_1.warning)('could not change default logger in node_modules, this is probably because dist doesnt exist or infinitymint package doesnt exist');
        }
        console.log('🧱 {magenta-fg}You are running InfinityMint {bold}' +
            (0, helpers_1.getInfinityMintVersion)() +
            '{/}');
        //register current network pipes
        (0, helpers_1.createNetworkPipes)();
        if (production && !(0, helpers_1.isEnvTrue)('PRODUCTION')) {
            process.env.PRODUCTION = 'true';
            console.log('{yellow-fg}Forcing production to true{/u}');
        }
        if (showAllLogs && !showDebugLogs)
            showDebugLogs = true;
        (0, helpers_1.setDebugLogDisabled)(!showDebugLogs);
        (0, helpers_1.setIgnorePipeFactory)(showAllLogs);
        //if to show only default
        (0, helpers_1.setOnlyDefaultLogs)(!showDebugLogs && !showAllLogs);
        //start ganache
        if (startGanache) {
            if (!fs_1.default.existsSync((0, helpers_1.cwd)() + '/node_modules/ganache/'))
                throw new Error('Ganache has not been installed, please type npm i ganache');
            try {
                let result = yield __syncRequire ? Promise.resolve().then(() => tslib_1.__importStar(require('../app/ganache'))) : new Promise((resolve_3, reject_3) => { require(['../app/ganache'], resolve_3, reject_3); }).then(tslib_1.__importStar);
                yield result.startGanache();
            }
            catch (error) {
                (0, helpers_1.warning)('could not start ganache: ' + error.stack);
            }
        }
        //create our Json RPC Providers
        (0, web3_1.createProviders)();
        options = Object.assign(Object.assign({}, (options || {})), (typeof (config === null || config === void 0 ? void 0 : config.console) === 'object' ? config.console : {}));
        //if we aren't staying open then we don't need to start express or web socket
        if (!stayOpen && startExpress) {
            (0, helpers_1.warning)(`InfinityMint is not staying open! Not starting express... add --stay-open flag!`);
            startExpress = false;
        }
        if (!stayOpen && startWebSocket) {
            (0, helpers_1.warning)(`InfinityMint is not staying open! Not starting web socket... add --stay-open flag!`);
            startWebSocket = false;
        }
        //sets the network through a flag
        let session = (0, helpers_1.readGlobalSession)();
        if (!options.network)
            options.network =
                yargs_1.default.argv['network'] ||
                    session.environment.defaultNetwork ||
                    'hardhat';
        hardhat_1.default.changeNetwork(options.network);
        let infinityConsole = yield (0, web3_1.startInfinityConsole)({
            dontDraw: true,
            scriptMode: true,
            startExpress,
            startWebSocket,
            onlyCurrentNetworkEvents,
            disableNetworkEvents,
            dontInitialize: dontInitialize,
        });
        if (!(0, imports_1.hasImportCache)()) {
            console.log('\n{cyan-fg}{bold}Building Imports{/}...');
            yield (0, imports_1.buildImports)((_d = (_c = config.settings) === null || _c === void 0 ? void 0 : _c.imports) === null || _d === void 0 ? void 0 : _d.supportedExtensions, infinityConsole);
        }
        console.log('🧱 {cyan-fg}Current target network is ' + hardhat_1.default.network.name + '{/}');
        console.log('🧱 {cyan-fg}Current account is ' +
            (((_e = infinityConsole.getCurrentAccount()) === null || _e === void 0 ? void 0 : _e.address) || 'NULL') +
            '{/}');
        if (((_f = infinityConsole.getCurrentAccount()) === null || _f === void 0 ? void 0 : _f.address) === undefined)
            (0, helpers_1.warning)('No connection to a network, please make sure you have a network running and that you have set the correct network in your InfinityMint config file');
        let scriptArguments = {};
        let script;
        let yargv = yield yargs_1.default.argv;
        let scriptName = (_h = (_g = yargv._) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.toString();
        if (scriptName) {
            scriptName = scriptName.replace(/_/g, ' ');
            script = infinityConsole.getScript(scriptName);
        }
        if (!script && !skipScripts) {
            //no script entry here
            let scripts = infinityConsole.getScripts();
            //filter duplicate scripts
            scripts = scripts.filter((script, index) => {
                return scripts.findIndex((s) => s.name === script.name) === index;
            });
            infinityConsole.log('\n{cyan-fg}{bold}Welcome to Infinity Console{/}\n');
            infinityConsole.log('{cyan-fg}InfinityMint Scripts{/}');
            scripts.forEach((script, index) => {
                infinityConsole.log(` [${index}] =>\n\t{bold}{underline}${script.name}{/}\n\t` +
                    (script.description || 'No Description Available...'));
            });
            infinityConsole.log('\n{cyan-fg}Hardhat Tasks{/}');
            Object.keys(hardhat_1.default.tasks).forEach((task, index) => {
                infinityConsole.log(`[${index}] => \n\t{bold}{underline}hardhat:${task}{/}\n\t`);
            });
        }
        else if (!skipScripts && script) {
            if (scriptName.indexOf('hardhat:') !== -1) {
                let script = scriptName.split('hardhat:')[1];
                let argv = yargv;
                argv._ = argv._.slice(1) || [];
                infinityConsole.log(`\n{cyan-fg}{bold}Running hardhat task => ${script}{/}`);
                let taskArguments = argv._.map((arg, index) => {
                    if (yargs_1.default.argv['$' + index])
                        return yargs_1.default.argv['$' + index];
                    return arg;
                });
                infinityConsole.log(`{gray-fg}{bold}Arguments{/}\n`);
                taskArguments.forEach((arg, index) => {
                    infinityConsole.log(`[${index}]  => ${arg}`);
                });
                yield hardhat_1.default.run(script, taskArguments);
                infinityConsole.log(`\n{green-fg}{bold}Task completed{/}\n`);
            }
            else {
                let argv = yargv;
                argv._ = argv._.slice(1);
                if (!script)
                    throw new Error(`Script ${scriptName} does not exist. Please check your spelling and try again.`);
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
                        scriptArguments[key].validator(scriptArguments[key].value) === false)
                        throw new Error('Invalid value for argument: ' +
                            key +
                            ' (failed validator)');
                });
                Object.keys(script.arguments).forEach((key) => {
                    let arg = script.arguments[key];
                    if (scriptArguments[arg.name] === undefined &&
                        arg.value !== undefined)
                        scriptArguments[arg.name] = Object.assign({}, arg);
                });
                //check for missing parameters
                Object.values(script.arguments).forEach((arg) => {
                    if (!arg.optional && !scriptArguments[arg.name])
                        throw new Error('Missing required argument: ' + arg.name);
                });
                yield (0, web3_1.executeScript)(script, infinityConsole.getEventEmitter(), {}, //gems when we get them
                scriptArguments, infinityConsole, !options.test, ((_j = scriptArguments['show-debug-logs']) === null || _j === void 0 ? void 0 : _j.value) ||
                    ((_k = scriptArguments['show-all-logs']) === null || _k === void 0 ? void 0 : _k.value) ||
                    false);
            }
        }
        stayOpenMethod();
    }))().catch((err) => {
        (0, colours_1.blessedLog)(`{red-fg}{bold}Error: ${err.message}{/}`);
        (0, colours_1.blessedLog)(`{red-fg}Stack: ${err.stack}{/}`);
        process.exit(1);
    });
});
//# sourceMappingURL=cli.js.map