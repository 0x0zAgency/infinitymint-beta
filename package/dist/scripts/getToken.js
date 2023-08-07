(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const getToken = {
        name: 'Get Token',
        description: 'Pulls information about a token from the blockchain and displays it',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let tokenId = script.args.tokenId.value;
            let result = yield script.project.getToken(tokenId);
            script.log(''); //newline
            script.log(`name => ${result.name}`);
            script.log(`project => ${result.project.getNameAndVersion()}`);
            script.log(`network => ${result.project.network}`);
            script.log(`token id => ${result.tokenId}`);
            script.log(`rarity => ${result.getPath().rarity}%`);
            script.log(`path id => ${result.pathId} (${result.getPath().name})`);
            script.log(`assets => (${result.getAssets().length})`);
            result.getAssets().forEach((asset, index) => {
                var _a, _b, _c;
                script.log(`\t[${index}] => {grey-fg}${asset.name} <${asset.fileName}> (${(_c = (_b = (_a = script.project.deployedProject) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.assets) === null || _c === void 0 ? void 0 : _c.sections[index]}){/}`);
            });
            script.log(''); //newline
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
            {
                name: 'tokenId',
                type: 'number',
                optional: false,
            },
        ],
    };
    exports.default = getToken;
});
//# sourceMappingURL=getToken.js.map