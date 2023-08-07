(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/web3", "../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const web3_1 = require("../app/web3");
    const helpers_1 = require("../app/helpers");
    const call = {
        name: 'Call Contract Method',
        description: 'Calls a method on a contract',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            let contractName = ((_a = script.args.contract) === null || _a === void 0 ? void 0 : _a.value) || ((_b = script.args.module) === null || _b === void 0 ? void 0 : _b.value);
            if (script.args.contract &&
                ((_d = (_c = script.args.contract) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.length) === 0 &&
                script.args.module.value)
                contractName = (_e = script.args.module) === null || _e === void 0 ? void 0 : _e.value;
            if (script.args.module &&
                ((_f = script.args.module.value) === null || _f === void 0 ? void 0 : _f.length) === 0 &&
                script.args.script.value)
                contractName = (_g = script.args.cotract) === null || _g === void 0 ? void 0 : _g.value;
            if (!contractName)
                contractName = 'erc721';
            let contract = script.project.deployments[contractName];
            if (!contract)
                throw new Error('contract not found => ' + contractName);
            let instance = yield contract.getSignedContract();
            if (!instance[(_h = script.args.method) === null || _h === void 0 ? void 0 : _h.value])
                throw new Error('invalid method => ' + ((_j = script.args.method) === null || _j === void 0 ? void 0 : _j.value));
            let bannedArgs = [
                'project',
                'contract',
                'method',
                'version',
                'network',
                'module',
            ];
            let cleanedArguments = [];
            Object.values(script.args).forEach((arg) => !bannedArgs.includes(arg.name) &&
                arg.name !== '_' &&
                arg.name !== '$0'
                ? cleanedArguments.push(arg.value)
                : null);
            script.log(`\n{magenta-fg}{bold}Executing ${script.args.method.value} on {underline}${contract.getContractName()}{/underline} at <${contract.getAddress()}> with args{/} =>`);
            cleanedArguments.forEach((arg, index) => script.log([`[${index}] => ${arg}`]));
            let tx;
            if (cleanedArguments.length === 0)
                tx = yield instance[script.args.method.value]();
            if (cleanedArguments.length === 1)
                tx = yield instance[script.args.method.value](cleanedArguments[0]);
            if (cleanedArguments.length === 2)
                tx = yield instance[script.args.method.value](cleanedArguments[0], cleanedArguments[1]);
            if (cleanedArguments.length === 3)
                tx = yield instance[script.args.method.value](cleanedArguments[0], cleanedArguments[1], cleanedArguments[2]);
            if (cleanedArguments.length === 4)
                tx = yield instance[script.args.method.value](cleanedArguments[0], cleanedArguments[1], cleanedArguments[2], cleanedArguments[3]);
            if (cleanedArguments.length === 5)
                tx = yield instance[script.args.method.value](cleanedArguments[0], cleanedArguments[1], cleanedArguments[2], cleanedArguments[3], cleanedArguments[4]);
            if (cleanedArguments.length === 6)
                tx = yield instance[script.args.method.value](cleanedArguments[0], cleanedArguments[1], cleanedArguments[2], cleanedArguments[3], cleanedArguments[4], cleanedArguments[5]);
            if (cleanedArguments.length === 7)
                tx = yield instance[script.args.method.value](cleanedArguments[0], cleanedArguments[1], cleanedArguments[2], cleanedArguments[3], cleanedArguments[4], cleanedArguments[5], cleanedArguments[6]);
            if (cleanedArguments.length === 8)
                tx = yield instance[script.args.method.value](cleanedArguments[0], cleanedArguments[1], cleanedArguments[2], cleanedArguments[3], cleanedArguments[4], cleanedArguments[5], cleanedArguments[6], cleanedArguments[7]);
            try {
                tx = yield (0, web3_1.waitForTx)(tx, 'call to ' +
                    contract.getContractName() +
                    ' method ' +
                    script.args.method.value);
                script.log(`\n{green-fg}{bold}Successfully Called ${script.args.method.value} on ${contract.getContractName()}{/} => <${tx.transactionHash}>\n{yellow-fg}gas used: ${tx.gasUsed.toString()}{/}\n`);
            }
            catch (error) {
                (0, helpers_1.warning)(`waiting for TX failed, did this return something other than a receipt?`);
                script.log(`\n{yellow-fg}{bold}Potentially Called ${script.args.method.value} on ${contract.getContractName()}{/}`);
            }
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
            {
                name: 'contract',
                type: 'string',
                optional: true,
            },
            {
                name: 'method',
                type: 'string',
                optional: true,
            },
            {
                name: 'module',
                type: 'string',
                optional: true,
            },
        ],
    };
    exports.default = call;
});
//# sourceMappingURL=call.js.map