(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "ganache", "@ethersproject/providers", "./helpers", "./web3", "./pipes"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.startGanache = exports.GanacheServer = void 0;
    const tslib_1 = require("tslib");
    const ganache_1 = tslib_1.__importDefault(require("ganache"));
    const providers_1 = require("@ethersproject/providers");
    const helpers_1 = require("./helpers");
    const web3_1 = require("./web3");
    const pipes_1 = require("./pipes");
    /**
     * ganache server
     */
    class GanacheServer {
        /**
         * stars the ganache server
         * @param options
         * @param port
         * @returns
         */
        start(options, port) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.options = options;
                this.port = parseInt((port || process.env.GANACHE_PORT || 8545).toString());
                if (yield (0, helpers_1.isGanacheAlive)(this.port)) {
                    console.log('{cyan-fg}{bold}Previous Ganache Server{/bold}{/cyan-fg} => http://localhost:' +
                        this.port);
                    this.provider = new providers_1.JsonRpcProvider('https://localhost:' + this.port);
                    return this.provider;
                }
                return yield this.createServer(options);
            });
        }
        /**
         * creates the ganache server and returns the provider
         * @param options
         * @returns
         */
        createServer(options) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield new Promise((resolve, reject) => {
                    //make sure to set
                    if (!options.wallet)
                        options.wallet = {
                            totalAccounts: 20,
                            defaultBalance: 69420,
                        };
                    //make sure to set default balance
                    if (!(options === null || options === void 0 ? void 0 : options.wallet.defaultBalance) ||
                        (options === null || options === void 0 ? void 0 : options.wallet.defaultBalance) <= 0)
                        options.wallet.defaultBalance = 69420;
                    this.server = ganache_1.default.server(options);
                    this.server.debug.enabled = false;
                    this.server.listen(this.port, (err) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        if (err)
                            throw err;
                        console.log('{green-fg}{bold}Ganache Online{/bold}{/green-fg} => http://localhost:' +
                            this.port);
                        resolve(true);
                    }));
                });
                this.provider = new providers_1.JsonRpcProvider('http://localhost:' + this.port);
                return this.provider;
            });
        }
        stop() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (this.server) {
                    yield this.server.close();
                    this.server = undefined;
                }
            });
        }
        /**
         * returns the ganache provider
         * @returns
         */
        getProvider() {
            if (this.provider == undefined)
                throw new Error('invalid ethers provider');
            return this.provider;
        }
    }
    exports.GanacheServer = GanacheServer;
    /**
     * creates a default ganache server instance
     */
    const GanacheServerInstance = new GanacheServer();
    /**
     * method to start ganache
     */
    const startGanache = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let session = (0, helpers_1.readGlobalSession)();
        let config = (0, helpers_1.getConfigFile)();
        //ask if they want to start ganache
        //start ganache here
        let obj = Object.assign({}, config.ganache);
        if (!obj.wallet)
            obj.wallet = {};
        if (!session.environment.ganacheMnemonic)
            throw new Error('no ganache mnemonic');
        obj.wallet.mnemonic = session.environment.ganacheMnemonic;
        (0, helpers_1.saveGlobalSessionFile)(session);
        (0, helpers_1.debugLog)('starting ganache with menomic of: ' + obj.wallet.mnemonic);
        //get private keys and save them to file
        let keys = (0, web3_1.getPrivateKeys)(session.environment.ganacheMnemonic);
        (0, helpers_1.debugLog)('found ' +
            keys.length +
            ' private keys for mnemonic: ' +
            session.environment.ganacheMnemonic);
        keys.forEach((key, index) => {
            (0, helpers_1.debugLog)(`[${index}] => ${key}`);
        });
        session.environment.ganachePrivateKeys = keys;
        (0, helpers_1.saveGlobalSessionFile)(session);
        //overwrite console.log so ganache instance uses another one which logs to the right pipe
        let _tempConsoleLog = console.log;
        console.log = (...msgs) => {
            pipes_1.defaultFactory.log(msgs.join('\n'), 'localhost');
        };
        yield GanacheServerInstance.start(config.ganache || {});
        console.log = _tempConsoleLog;
    });
    exports.startGanache = startGanache;
    exports.default = GanacheServerInstance;
});
//# sourceMappingURL=ganache.js.map