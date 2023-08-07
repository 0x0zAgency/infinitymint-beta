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
    exports.startingPrice = void 0;
    const tslib_1 = require("tslib");
    /**
     * Also imported by DefaultRoyalty, sets the price of the token
     * @param param0
     * @returns
     */
    const startingPrice = ({ project, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let price = project.price;
        if (typeof price === 'string') {
            //if its just a number then use that
            price = parseInt(price);
            if (isNaN(price)) {
                //then lets assume its a currency value and convert it
            }
        }
        if (price === undefined) {
            price = (_b = (_a = project.settings) === null || _a === void 0 ? void 0 : _a.royalty) === null || _b === void 0 ? void 0 : _b.startingPrice;
        }
        if (price === undefined) {
            price = 0;
        }
        return parseInt(price.toString());
    });
    exports.startingPrice = startingPrice;
    const SplitRoyalty = {
        //going to give
        unique: true,
        module: 'royalty',
        index: 5,
        deployArgs: ['values'],
        solidityFolder: 'alpha',
        permissions: ['erc721', 'assets', 'minter', 'all'],
        values: {
            startingPrice: exports.startingPrice,
            baseTokenValue: Math.pow(10, 18),
            stickerSplit: 20, //out of 100 percent
        },
        setup: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            //read royalty info and set up royalty
            let royalty = yield params.deployment.getSignedContract();
        }),
    };
    exports.default = SplitRoyalty;
});
//# sourceMappingURL=SplitRoyalty.js.map