(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "hardhat", "./app/console", "./app/helpers", "./app/pipes", "./app/web3", "./app/telnet", "./app/gems", "yargs", "./infinitymint-types/index"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.load = exports.getInfinityConsole = exports.config = void 0;
    const tslib_1 = require("tslib");
    const hardhat_1 = tslib_1.__importDefault(require("hardhat"));
    const console_1 = tslib_1.__importDefault(require("./app/console"));
    //import things we need
    const helpers_1 = require("./app/helpers");
    const pipes_1 = require("./app/pipes");
    const web3_1 = require("./app/web3");
    const telnet_1 = require("./app/telnet");
    const gems_1 = require("./app/gems");
    const yargs_1 = tslib_1.__importDefault(require("yargs"));
    require("./infinitymint-types/index");
    //error handler
    let errorHandler = (error) => {
        try {
            if (console._log)
                console.log = console._log.bind(console);
            if (console._error)
                console.error = console._error.bind(console);
            console.log('INFINITYMINT DIED!\n');
            console.log(error.message);
            console.log(error.stack);
            Object.keys(pipes_1.defaultFactory.pipes || {}).forEach((pipe) => {
                try {
                    pipes_1.defaultFactory.savePipe(pipe);
                }
                catch (error) {
                    console.log(error.stack);
                }
            });
        }
        catch (error) {
            process.exit(1);
        }
    };
    console.log('✨ Reading InfinityMint Config');
    //get the infinitymint config file and export it
    exports.config = (0, helpers_1.getConfigFile)();
    /**
     * if you spawned InfinityMint through load, then this is the current infinity console instance, this will be the instance of the admin InfinityConsole if you are running through telnet
     */
    let infinityConsole;
    const getInfinityConsole = () => infinityConsole;
    exports.getInfinityConsole = getInfinityConsole;
    /**
     * Starts InfinityMint
     * @param options
     * @returns
     */
    const load = (options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        var _c, _d, _e, _f, _g;
        //reload config
        exports.config = (0, helpers_1.getConfigFile)(true);
        //overwrite the console methods and pipe if test or dontPipe is fals
        options = options || {};
        if ((options.scriptMode || options.test) && infinityConsole)
            return infinityConsole;
        if (options.test) {
            (0, helpers_1.warning)('script mode is enabled in test mode');
            options.scriptMode = true;
        }
        try {
            if ((0, helpers_1.isInfinityMint)())
                (yield (_a = (0, helpers_1.cwd)() + '/dist/app/pipes', __syncRequire ? Promise.resolve().then(() => tslib_1.__importStar(require(_a))) : new Promise((resolve_1, reject_1) => { require([_a], resolve_1, reject_1); }).then(tslib_1.__importStar))).setDefaultFactory(pipes_1.defaultFactory);
            else
                (yield (_b = (0, helpers_1.cwd)() + '/node_modules/infinitymint/dist/app/pipes', __syncRequire ? Promise.resolve().then(() => tslib_1.__importStar(require(_b))) : new Promise((resolve_2, reject_2) => { require([_b], resolve_2, reject_2); }).then(tslib_1.__importStar))).setDefaultFactory(pipes_1.defaultFactory);
        }
        catch (error) {
            (0, helpers_1.warning)('could not link link dist to current default pipe. Dist is probably not present or no infinitymint package is present');
        }
        //register current network pipes
        (0, helpers_1.createNetworkPipes)();
        let session = (0, helpers_1.readGlobalSession)();
        options = Object.assign(Object.assign({}, (options || {})), (typeof (exports.config === null || exports.config === void 0 ? void 0 : exports.config.console) === 'object' ? exports.config.console : {}));
        if (session.environment.defaultNetwork === 'ganache' && !(0, helpers_1.isGanacheAlive)()) {
            (0, helpers_1.warning)(`Ganache is not alive but the default network is set to ganache, changing default network to hardhat`);
            session.environment.defaultNetwork = 'hardhat';
            (0, helpers_1.saveGlobalSessionFile)(session);
        }
        try {
            if ((0, helpers_1.isEnvTrue)('GANACHE_AUTORUN') &&
                !(0, helpers_1.isEnvTrue)('GANACHE_EXTERNAL') &&
                ((_d = (_c = exports.config.hardhat) === null || _c === void 0 ? void 0 : _c.networks) === null || _d === void 0 ? void 0 : _d.ganache)) {
                let result = yield __syncRequire ? Promise.resolve().then(() => tslib_1.__importStar(require('./app/ganache'))) : new Promise((resolve_3, reject_3) => { require(['./app/ganache'], resolve_3, reject_3); }).then(tslib_1.__importStar);
                yield result.startGanache();
            }
        }
        catch (error) {
            (0, helpers_1.warning)('could not start ganache: ' + error.stack);
        }
        //require NPM gems
        yield (0, gems_1.requireGems)();
        let network = options.network || session.environment.defaultNetwork || 'hardhat';
        if (!((_e = exports.config.hardhat) === null || _e === void 0 ? void 0 : _e.networks[network])) {
            (0, helpers_1.warning)(`Network ${network} is not defined in your hardhat config, please add it`);
            network = 'hardhat';
        }
        //set default ethers provider
        hardhat_1.default.changeNetwork(network);
        //create networks
        (0, web3_1.createProviders)();
        console.log('🧱 Current target network => {cyan-fg}{bold}' + network + '{/}');
        if ((0, helpers_1.isEnvTrue)('INFINITYMINT_CONSOLE') && options.dontDraw)
            options.dontDraw = false;
        if (!exports.config.express)
            exports.config.express = {};
        //if we arenttelnet
        if (!exports.config.telnet) {
            //do not start an InfinityConsole normally if we have nothing in config, run InfinityMint as NPM module in the back. Will not start express server
            if (exports.config.onlyInitialize || options.onlyInitialize) {
                infinityConsole = new console_1.default(Object.assign(Object.assign({ startExpress: options.startExpress
                        ? options.startExpress
                        : exports.config.express !== undefined &&
                            exports.config.express !== false }, (options || {})), { dontDraw: options.dontDraw ? options.dontDraw : true }), pipes_1.defaultFactory);
            }
            else
                infinityConsole = yield (0, web3_1.startInfinityConsole)(Object.assign({ startExpress: options.startExpress
                        ? options.startExpress
                        : exports.config.express !== undefined &&
                            exports.config.express !== false, startWebSocket: options.startWebSocket
                        ? options.startWebSocket
                        : ((_f = exports.config.express) === null || _f === void 0 ? void 0 : _f.sockets) !== undefined &&
                            ((_g = exports.config.express) === null || _g === void 0 ? void 0 : _g.sockets) !== false, dontDraw: options.dontDraw
                        ? options.dontDraw
                        : options.scriptMode ||
                            process.env.DONT_DRAW === 'true' ||
                            options.test }, (options || {})), pipes_1.defaultFactory);
            return infinityConsole;
        }
        else {
            yield new Promise((resolve, reject) => {
                var _a;
                console.log('🔷 Starting InfinityMint Telnet Server');
                let port = ((_a = exports.config === null || exports.config === void 0 ? void 0 : exports.config.telnet) === null || _a === void 0 ? void 0 : _a.port) || 1337;
                let telnet = new telnet_1.TelnetServer();
                telnet.start(port);
            })
                .catch(errorHandler)
                .then(() => {
                console.log('🔷 Destroying InfinityMint Telnet Server');
            });
        }
    });
    exports.load = load;
    const infinitymint = () => {
        return infinityConsole;
    };
    exports.default = infinitymint;
    //load infinitymint
    if ((0, helpers_1.isEnvTrue)('INFINITYMINT_LOAD') || yargs_1.default.argv['console'])
        (0, exports.load)()
            .catch(errorHandler)
            .then((result) => {
            infinityConsole = result;
        });
});
//# sourceMappingURL=core.js.map