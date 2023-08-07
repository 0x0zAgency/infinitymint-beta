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
    const ERC721 = {
        setup: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
        //going to give
        solidityFolder: 'beta',
        permissions: ['approved'],
    };
    exports.default = ERC721;
});
//# sourceMappingURL=erc721.js.map