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
    const TokenAccount = {
        index: 0,
        solidityFolder: 'alpha',
        important: true,
        /**
         * Means this deployment will be treat like an InfinityLink, see docs for more info.
         */
        link: {
            description: 'A smart-contract wallet account capable of holding ERC-20 tokens and ERC-721 tokens',
            args: ['tokenId', 'erc721'],
            key: 'wallet',
            verify: true,
        },
    };
    exports.default = TokenAccount;
});
//# sourceMappingURL=TokenAccount.js.map