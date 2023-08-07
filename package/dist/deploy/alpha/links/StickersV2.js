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
    const StickersV2 = {
        //going to give
        index: 1,
        solidityFolder: 'alpha',
        important: false,
        /**
         * Means this deployment will be treat like an InfinityLink, see docs for more info.
         */
        link: {
            description: 'Sticers V2 Test',
            args: [
                'oracleDestination',
                'erc721',
                'tokenId',
                'tokenName',
                'tokenSymbol',
            ],
            key: 'eads_endpoint',
            erc721: true,
            verify: true,
        },
    };
    exports.default = StickersV2;
});
//# sourceMappingURL=StickersV2.js.map