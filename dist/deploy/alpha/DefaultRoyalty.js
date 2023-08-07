(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./SplitRoyalty"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const SplitRoyalty_1 = require("./SplitRoyalty");
    const DefaultRoyalty = {
        //going to give
        unique: true,
        module: 'royalty',
        index: 5,
        deployArgs: ['values'],
        solidityFolder: 'alpha',
        requestPermissions: ['erc721'],
        permissions: ['all', 'erc721', 'assets'],
        values: {
            startingPrice: SplitRoyalty_1.startingPrice,
            baseTokenValue: Math.pow(10, 18),
            stickerSplit: 20, //out of 100 percent
        },
    };
    exports.default = DefaultRoyalty;
});
//# sourceMappingURL=DefaultRoyalty.js.map