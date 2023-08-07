(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../window"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const window_1 = require("../window");
    const Templates = new window_1.InfinityMintWindow('Templates', {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    });
    Templates.initialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { });
    exports.default = Templates;
});
//# sourceMappingURL=template.js.map