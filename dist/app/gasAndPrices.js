(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./helpers", "fs", "path", "./projects", "hardhat"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getGasPriceHandlers = exports.getTokenPriceHandlers = exports.registerTokenPriceHandler = exports.registerHandler = exports.removeHandler = exports.saveReport = exports.readProjectReport = exports.readReport = exports.hasReport = exports.getReport = exports.getTotalGasUsage = exports.registerGasAndPriceHandlers = exports.removeTokenPriceHandler = exports.removeGasHandler = exports.registerGasPriceHandler = exports.handlers = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("./helpers");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const path_1 = tslib_1.__importDefault(require("path"));
    const projects_1 = require("./projects");
    const hardhat_1 = tslib_1.__importDefault(require("hardhat"));
    exports.handlers = {};
    const registerGasPriceHandler = (network, handler) => {
        return (0, exports.registerHandler)(network, 'gas', handler);
    };
    exports.registerGasPriceHandler = registerGasPriceHandler;
    const removeGasHandler = (network, handler) => {
        if (!handler)
            exports.handlers[network].gas = [];
        else
            (0, exports.removeHandler)(network, 'gas', handler);
    };
    exports.removeGasHandler = removeGasHandler;
    const removeTokenPriceHandler = (network, handler) => {
        if (!exports.handlers[network])
            exports.handlers[network].price = [];
        else
            (0, exports.removeHandler)(network, 'price', handler);
    };
    exports.removeTokenPriceHandler = removeTokenPriceHandler;
    /**
     * Reads InfinityMint configuration file and and registers any gas and price handlers we have for each network
     * @param config
     */
    const registerGasAndPriceHandlers = () => {
        var _a;
        let config = (0, helpers_1.getConfigFile)();
        Object.keys(((_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.networks) || {}).forEach((key) => {
            var _a;
            let network = (_a = config === null || config === void 0 ? void 0 : config.settings) === null || _a === void 0 ? void 0 : _a.networks[key];
            if (!network.handlers)
                return;
            if (network.handlers.gasPrice)
                (0, exports.registerGasPriceHandler)(key, network.handlers.gasPrice);
            if (network.handlers.tokenPrice)
                (0, exports.registerTokenPriceHandler)(key, network.handlers.tokenPrice);
        });
    };
    exports.registerGasAndPriceHandlers = registerGasAndPriceHandlers;
    const getTotalGasUsage = (receipts) => {
        let total = 0;
        receipts.forEach((receipt) => {
            total += receipt.gasUsed.toNumber();
        });
        return total;
    };
    exports.getTotalGasUsage = getTotalGasUsage;
    const getReport = (receipts) => {
        let report = {
            gasUsage: (0, exports.getTotalGasUsage)(receipts),
            averageGasPrice: 0,
            wei: 0,
            cost: '0.0',
            transactions: receipts.length,
            receipts: receipts,
        };
        //get the average gas price
        receipts.forEach((receipt) => {
            report.averageGasPrice += receipt.effectiveGasPrice.toNumber();
        });
        report.averageGasPrice /= receipts.length;
        report.wei = report.averageGasPrice * report.gasUsage;
        report.cost = (report.wei / Math.pow(10, 18)).toFixed(4);
        return report;
    };
    exports.getReport = getReport;
    const hasReport = (project) => {
        return fs_1.default.existsSync(path_1.default.join((0, helpers_1.cwd)(), '/projects/reports/', (0, projects_1.getFullyQualifiedName)(project) + '.report.json'));
    };
    exports.hasReport = hasReport;
    const readReport = (projectName, version, network) => {
        version = version || '1.0.0';
        network = network || hardhat_1.default.network.name;
        return JSON.parse(fs_1.default.readFileSync(path_1.default.join((0, helpers_1.cwd)(), '/projects/reports/', projectName + '@' + version + '_' + network + '.report.json'), 'utf-8'));
    };
    exports.readReport = readReport;
    const readProjectReport = (project) => {
        if (!(0, exports.hasReport)(project))
            return null;
        return JSON.parse(fs_1.default.readFileSync(path_1.default.join((0, helpers_1.cwd)(), '/projects/reports/', (0, projects_1.getFullyQualifiedName)(project) + '.report.json'), 'utf-8'));
    };
    exports.readProjectReport = readProjectReport;
    const saveReport = (project, report) => {
        (0, helpers_1.makeDirectories)(path_1.default.join((0, helpers_1.cwd)(), '/projects/reports/'));
        fs_1.default.writeFileSync(path_1.default.join((0, helpers_1.cwd)(), '/projects/reports/', (0, projects_1.getFullyQualifiedName)(project) + '.report.json'), JSON.stringify(report, null, 4));
    };
    exports.saveReport = saveReport;
    const removeHandler = (network, type, handler) => {
        if (!exports.handlers[network] || !exports.handlers[network][type])
            return;
        if (exports.handlers[network][type].length === 0)
            exports.handlers[network][type] = [];
        if (type === 'gas')
            exports.handlers[network]['gas'] = exports.handlers[network]['gas'].filter((thatHandler) => thatHandler.toString() !== handler.toString());
        else
            exports.handlers[network]['price'] = exports.handlers[network]['price'].filter((thatHandler) => thatHandler.toString() !== handler.toString());
    };
    exports.removeHandler = removeHandler;
    const registerHandler = (network, type, handler) => {
        if (!exports.handlers[network])
            exports.handlers[network] = {
                gas: [],
                price: [],
            };
        if (!exports.handlers[network][type])
            exports.handlers[network][type] = [];
        exports.handlers[network][type].push(handler);
        return handler;
    };
    exports.registerHandler = registerHandler;
    const registerTokenPriceHandler = (network, handler) => {
        return (0, exports.registerHandler)(network, 'price', handler);
    };
    exports.registerTokenPriceHandler = registerTokenPriceHandler;
    const getTokenPriceHandlers = (network) => {
        if (!exports.handlers[network] || !exports.handlers[network]['price'])
            return [
                () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    return {
                        usd: 0,
                    };
                }),
            ];
        return exports.handlers[network]['price'];
    };
    exports.getTokenPriceHandlers = getTokenPriceHandlers;
    const getGasPriceHandlers = (network) => {
        if (!exports.handlers[network] || !exports.handlers[network]['gas'])
            return [
                () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    return {
                        slow: 0,
                        medium: 0,
                        fast: 0,
                    };
                }),
            ];
        return exports.handlers[network]['gas'];
    };
    exports.getGasPriceHandlers = getGasPriceHandlers;
});
//# sourceMappingURL=gasAndPrices.js.map