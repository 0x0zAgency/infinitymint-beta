(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./StickersReceiver__factory"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StickersReceiver__factory = void 0;
    /* Autogenerated file. Do not edit manually. */
    /* tslint:disable */
    /* eslint-disable */
    var StickersReceiver__factory_1 = require("./StickersReceiver__factory");
    Object.defineProperty(exports, "StickersReceiver__factory", { enumerable: true, get: function () { return StickersReceiver__factory_1.StickersReceiver__factory; } });
});
//# sourceMappingURL=index.js.map