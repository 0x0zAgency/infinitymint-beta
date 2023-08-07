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
    const EADStickers = {
        index: 1,
        solidityFolder: 'alpha',
        important: true,
        /**
         * Means this deployment will be treat like an InfinityLink, see docs for more info.
         */
        link: {
            description: 'Enables prototype ethereum ad service integration',
            args: ['tokenId', 'erc721'],
            key: 'stickers',
            erc721: true,
            verify: true,
        },
    };
    exports.default = EADStickers;
});
//# sourceMappingURL=EADStickers.js.map