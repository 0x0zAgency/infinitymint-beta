(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/web3"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const web3_1 = require("../../app/web3");
    const Values = {
        setup: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let { project, debugLog, deployment, log, deployments } = params;
            if (project.settings === undefined) {
                project.settings = {
                    values: {},
                };
            }
            if (!project.settings.values)
                project.settings.values = {};
            let variables = Object.assign({}, (((_a = project.settings) === null || _a === void 0 ? void 0 : _a.values) || {}));
            //read all the deployments and get their default settings values
            for (let deployment of Object.values(deployments)) {
                if (deployment.getDeploymentScript().values === undefined)
                    continue;
                let values = {};
                yield Promise.all(Object.keys(deployment.getDeploymentScript().values).map((key) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    var _b, _c;
                    let value = deployment.getDeploymentScript().values[key];
                    if (((_b = project.settings) === null || _b === void 0 ? void 0 : _b.values[key]) !== undefined)
                        value = (_c = project.settings) === null || _c === void 0 ? void 0 : _c.values[key];
                    if (typeof value === 'function')
                        value = yield value(params);
                    if (!value)
                        return;
                    values[key] = value;
                })));
                Object.keys(values).forEach((key) => {
                    if (variables[key] === undefined)
                        variables[key] = values[key];
                });
            }
            let cleanedVariables = {};
            Object.keys(variables).forEach((key, index) => {
                let value = variables[key];
                if ((typeof value === 'boolean' || typeof value === 'number') &&
                    cleanedVariables[key] === undefined) {
                    if (typeof value === 'number')
                        cleanedVariables[key] = value.toString();
                    else
                        cleanedVariables[key] = value;
                }
            });
            project.settings.values = cleanedVariables;
            debugLog('found ' +
                Object.values(cleanedVariables).length +
                ' values to set on chain');
            log('{cyan-fg}{bold}Onchain Variables{/}');
            Object.keys(cleanedVariables).forEach((key) => log(`\t[${key}] => ${cleanedVariables[key]}`));
            let booleans = Object.keys(cleanedVariables).filter((key) => typeof cleanedVariables[key] === 'boolean');
            let numbers = Object.keys(cleanedVariables).filter((key) => typeof cleanedVariables[key] === 'string');
            let valuesContract = yield deployment.write();
            yield (0, web3_1.waitForTx)(yield valuesContract.setupValues(Object.values(numbers), Object.values(numbers).map((key) => cleanedVariables[key]), Object.values(booleans), Object.values(booleans).map((key) => cleanedVariables[key])), 'setting values on chain');
        }),
        /**
         * Add the on chain values to the deployment file
         * @param param0
         */
        post: ({ project, deployments }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            Object.values(deployments).forEach((deployment) => {
                if (deployment.getDeploymentScript().values === undefined)
                    return;
                let values = {};
                Object.keys(deployment.getDeploymentScript().values).forEach((key) => {
                    var _a, _b;
                    let value = deployment.getDeploymentScript().values[key];
                    if (((_a = project.settings) === null || _a === void 0 ? void 0 : _a.values[key]) !== undefined)
                        value = (_b = project.settings) === null || _b === void 0 ? void 0 : _b.values[key];
                    values[key] = value;
                });
                deployment.setDefaultValues(values, true);
            });
        }),
        static: true,
        //going to give
        instantlySetup: true,
        unique: true,
        important: true,
        module: 'values',
        permissions: ['all'],
        index: 1,
        solidityFolder: 'alpha',
    };
    exports.default = Values;
});
//# sourceMappingURL=InfinityMintValues.js.map