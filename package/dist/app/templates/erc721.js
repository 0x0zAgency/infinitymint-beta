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
    const basic = {
        name: '{cyan-fg}ERC721{/cyan-fg} - InfinityMint',
        description: 'Basic template',
        settings: {
            allowModuleChoice: true,
            allowGemChoice: true,
            allowRoyalty: true,
            allowPathInput: true,
        },
        gems: {},
        inputs: [
            {
                name: 'name',
                type: 'string',
                tab: 'general',
                description: 'Name of the project',
            },
            {
                name: 'tokenSymbol',
                type: 'string',
                tab: 'token',
                description: 'Symbol of the token',
            },
            {
                name: 'tokenName',
                type: 'string',
                tab: 'token',
                description: 'Name of the token',
            },
            {
                name: 'maxSupply',
                type: 'number',
                tab: 'token',
                description: 'Max Supply',
            },
            {
                name: 'baseURI',
                type: 'string',
                tab: 'uri',
                description: 'Base URI for the token',
            },
        ],
        create: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
    };
    exports.default = basic;
});
//# sourceMappingURL=erc721.js.map