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
    const Settings = new window_1.InfinityMintWindow('Settings');
    exports.default = Settings;
});
//# sourceMappingURL=settings.js.map