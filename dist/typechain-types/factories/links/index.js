(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./legacy", "./Account__factory", "./IAccount__factory", "./TokenAccount__factory"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TokenAccount__factory = exports.IAccount__factory = exports.Account__factory = exports.legacy = void 0;
    const tslib_1 = require("tslib");
    /* Autogenerated file. Do not edit manually. */
    /* tslint:disable */
    /* eslint-disable */
    exports.legacy = tslib_1.__importStar(require("./legacy"));
    var Account__factory_1 = require("./Account__factory");
    Object.defineProperty(exports, "Account__factory", { enumerable: true, get: function () { return Account__factory_1.Account__factory; } });
    var IAccount__factory_1 = require("./IAccount__factory");
    Object.defineProperty(exports, "IAccount__factory", { enumerable: true, get: function () { return IAccount__factory_1.IAccount__factory; } });
    var TokenAccount__factory_1 = require("./TokenAccount__factory");
    Object.defineProperty(exports, "TokenAccount__factory", { enumerable: true, get: function () { return TokenAccount__factory_1.TokenAccount__factory; } });
});
//# sourceMappingURL=index.js.map