(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/gasAndPrices", "hardhat"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const gasAndPrices_1 = require("../app/gasAndPrices");
    const hardhat_1 = require("hardhat");
    const report = {
        name: 'View Report',
        description: 'View a report of your project deployment',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let report = (0, gasAndPrices_1.readReport)(script.project.getNameAndVersion(false), script.project.version, script.infinityConsole.network.name);
            script.log(`\n{cyan-fg}{underline}Report for {bold}${(_a = script.project) === null || _a === void 0 ? void 0 : _a.getFullyQualifiedName()}{/}\n`);
            script.log(`{bold}Network:{/} {yellow-fg}${script.infinityConsole.network.name}{/}\n`);
            if (!report) {
                script.log('{red-fg}{bold}No report found, please deploy your project first{/}');
                return;
            }
            script.log(`{underline}Receipts{/}\n\n{bold}${report.receipts.length}{/} receipts\n`);
            report.receipts.forEach((receipt, index) => {
                script.log(`{bold}[${index + 1}]{/} => \nTransaction Hash: {bold}<${receipt.transactionHash}>{/}\nGas Used: {bold}${Number(receipt.gasUsed.hex)}{/}\nGas Price: {bold}${(Number(receipt.effectiveGasPrice.hex) / 1000000000).toFixed(2)} gwei{/}\n`);
            });
            script.log(`{underline}Cost & Gas Statistics{/}\n`);
            script.log(`Gas Usage: {bold}${report.gasUsage.toString()}{/}\nAvg Gas Price: {bold}${(report.averageGasPrice / 1000000000).toFixed(2)} gwei{/}\nAvg Gas Per Tx: {bold}${(report.gasUsage / report.receipts.length).toFixed(2)} wei{/}\nAvg Cost Per Tx (in eth/matic/token): {bold}${hardhat_1.ethers.utils.formatEther(Math.floor(report.wei / report.receipts.length))}{/}\nCost (in wei): {bold}${report.wei}{/}\nCost (in gwei): {bold}${(report.wei / 1000000000).toFixed(2)}{/}\nCost (in eth/matic/token): {bold}${report.cost}{/}\n`);
            script.log('{underline}{cyan-fg}End of Report{/}\n');
        }),
        arguments: [
            {
                name: 'project',
                optional: true,
            },
            {
                name: 'network',
                optional: true,
            },
        ],
    };
    exports.default = report;
});
//# sourceMappingURL=report.js.map