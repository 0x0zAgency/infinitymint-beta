(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../window"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const window_1 = require("../window");
    const Deploy = new window_1.InfinityMintWindow('Deploy');
    Deploy.setHiddenFromMenu(true);
    exports.default = Deploy;
});
//# sourceMappingURL=deploy.js.map