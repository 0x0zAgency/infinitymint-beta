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
        name: '{cyan-fg}ERC721{/cyan-fg} - Media Platform',
        description: 'A Decentralized Web3 All Types Of Media Website',
        create: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }),
    };
    exports.default = basic;
});
//# sourceMappingURL=mediaPlatform.js.map