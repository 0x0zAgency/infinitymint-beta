(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("../../app/helpers");
    const get = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let config = (0, helpers_1.getConfigFile)();
        delete config.hardhat;
        return Object.assign({}, config);
    });
    exports.get = get;
});
//# sourceMappingURL=config.js.map