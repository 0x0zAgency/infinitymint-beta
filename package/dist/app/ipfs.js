(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "web3.storage", "./helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getIPFSConfig = exports.isAllowingIPFS = exports.IPFS = void 0;
    const tslib_1 = require("tslib");
    const web3_storage_1 = require("web3.storage");
    const helpers_1 = require("./helpers");
    class IPFS {
        start() {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let config = (0, helpers_1.getConfigFile)();
                (0, helpers_1.log)(`{cyan-fg}Starting IPFS Integration{/}`);
                (0, helpers_1.log)(`{gray-fg}Checking IPFS Companion app is installed...{/}`);
                if (this.isKuboAvailable()) {
                    (0, helpers_1.log)(`\t => {underline}IPFS Kubo is available for use{/}`);
                    this.kuboAvailable = true;
                }
                if ((_b = (_a = config.ipfs) === null || _a === void 0 ? void 0 : _a.kubo) === null || _b === void 0 ? void 0 : _b.useAlways)
                    this.favourKubo = true;
                if ((_d = (_c = config.ipfs) === null || _c === void 0 ? void 0 : _c.web3Storage) === null || _d === void 0 ? void 0 : _d.useAlways)
                    this.favourWeb3Storage = true;
                if ((_f = (_e = config.ipfs) === null || _e === void 0 ? void 0 : _e.web3Storage) === null || _f === void 0 ? void 0 : _f.token) {
                    (0, helpers_1.log)(`{gray-fg}Creating Web3 Storage IPFS Controller{/}`);
                    this.web3Storage = new web3_storage_1.Web3Storage({
                        token: (_g = config.ipfs.web3Storage) === null || _g === void 0 ? void 0 : _g.token,
                    });
                    (0, helpers_1.log)(`\t => {underline}Web3Storage is available for use{/}`);
                }
                (0, helpers_1.log)(`{green-fg}{bold}IPFS Integration{/} => Enabled`);
                return this;
            });
        }
        add(data, fileName) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!this.kuboAvailable && !this.web3Storage) {
                    //try and fetch it via IPFS web2 endpoint
                }
                else if (this.kuboAvailable && !this.favourWeb3Storage) {
                }
                else {
                    let file = new web3_storage_1.File([data], fileName);
                    return yield this.web3Storage.put([file]);
                }
            });
        }
        uploadJson(obj, fileName = 'index.json') {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (typeof obj !== 'object')
                    throw new Error('IPFS uploadJson only accepts objects');
                let blob = new Blob([JSON.stringify(obj)], {
                    type: 'application/json', // or whatever your Content-Type is
                });
                if (!this.kuboAvailable && !this.web3Storage) {
                    throw new Error('No IPFS available');
                }
                else if (this.kuboAvailable && !this.favourWeb3Storage) {
                    throw new Error('Unsupported');
                }
                else {
                    let file = new web3_storage_1.File([blob], fileName);
                    return yield this.web3Storage.put([file]);
                }
            });
        }
        /**
         * Returns the CID as an array buffer
         * @param cid
         * @returns
         */
        get(cid) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!this.kuboAvailable && !this.web3Storage) {
                    //try and fetch it via IPFS web2 endpoint
                }
                else if (this.kuboAvailable && !this.favourWeb3Storage) {
                }
                else {
                    return yield (yield this.web3Storage.get(cid)).arrayBuffer();
                }
            });
        }
        isKuboAvailable() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return (yield (0, helpers_1.tcpPingPort)('localhost', 5001)).online === true;
            });
        }
    }
    exports.IPFS = IPFS;
    const isAllowingIPFS = () => {
        let config = (0, helpers_1.getConfigFile)();
        if (!config.ipfs)
            return false;
        return ((config.ipfs !== undefined && config.ipfs === true) ||
            Object.keys(config.ipfs).length > 0);
    };
    exports.isAllowingIPFS = isAllowingIPFS;
    const getIPFSConfig = () => {
        let config = (0, helpers_1.getConfigFile)();
        return config.ipfs;
    };
    exports.getIPFSConfig = getIPFSConfig;
});
//# sourceMappingURL=ipfs.js.map