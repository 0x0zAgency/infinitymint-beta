(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./RarityImage"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const RarityImage_1 = tslib_1.__importDefault(require("./RarityImage"));
    const RaitySVG = {
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
        update: RarityImage_1.default.update,
        cleanup: RarityImage_1.default.cleanup,
        setup: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            //pass over to rarity image
            yield RarityImage_1.default.setup(params);
        }),
        deployArgs: ['%token_name%', 'values'],
        solidityFolder: 'alpha',
        permissions: ['erc721', 'minter'],
    };
    exports.default = RaitySVG;
});
//# sourceMappingURL=RaritySVG.js.map