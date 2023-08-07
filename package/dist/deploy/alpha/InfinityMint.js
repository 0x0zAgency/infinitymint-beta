(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const InfinityMint = {
        //going to give
        module: 'erc721',
        index: 8,
        settings: {
            //these are settings the end user can set in their project and
            //will come up in an autocomplete suggestion
            erc721: {
                generateTokenURI: false,
                pregenerateTokens: 100,
            },
        },
        values: {
            previewCount: 3,
            previewCooldownSeconds: 60 * 60 * 5,
            incrementalMode: false,
            matchedMode: false,
            disableMintArguments: false,
            byteMint: false,
            disableRegisteredTokens: false,
            maxSupply: 124,
            maxTokensPerWallet: 256,
        },
        config: {
            test: 'test',
        },
        deployArgs: [
            '%token_name%',
            '%token_symbol%',
            'storage',
            'values',
            'minter',
            'royalty',
        ],
        requestPermissions: ['storage', 'royalty'],
        solidityFolder: 'alpha',
        permissions: ['all'],
    };
    exports.default = InfinityMint;
});
//# sourceMappingURL=InfinityMint.js.map