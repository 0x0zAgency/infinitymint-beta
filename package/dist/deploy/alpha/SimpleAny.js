(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./SimpleImage"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const SimpleImage_1 = tslib_1.__importDefault(require("./SimpleImage"));
    const SimpleAny = {
        //going to give
        unique: true,
        module: 'assets',
        index: 4,
        values: {
            mustGenerateName: true,
            nameCount: 3,
            colourChunkSize: 32,
            extraColours: 32,
            randomRarity: true,
            lowestRarity: true,
            highestRarity: false,
            stopDuplicateMint: false,
        },
        update: SimpleImage_1.default.update,
        cleanup: SimpleImage_1.default.cleanup,
        setup: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield SimpleImage_1.default.setup(params);
            //do SVG stuff
        }),
        deployArgs: ['%token_name%', 'values'],
        solidityFolder: 'alpha',
        permissions: ['erc721', 'minter'],
    };
    exports.default = SimpleAny;
});
//# sourceMappingURL=SimpleAny.js.map