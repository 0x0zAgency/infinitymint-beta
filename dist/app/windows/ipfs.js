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
    const IPFS = new window_1.InfinityMintWindow('IPFS', {
        fg: 'white',
        bg: 'yellow',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    });
    IPFS.setBackgroundThink(true);
    IPFS.setShouldInstantiate(true);
    exports.default = IPFS;
});
//# sourceMappingURL=ipfs.js.map