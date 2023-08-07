(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "events"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InfinityMintEventEmitter = void 0;
    const events_1 = require("events");
    /**
     * Extends the default node event emitter to have our event names appear in auto completion making it easier to work with InfinityMint
     */
    class InfinityMintEventEmitter extends events_1.EventEmitter {
    }
    exports.InfinityMintEventEmitter = InfinityMintEventEmitter;
});
//# sourceMappingURL=interfaces.js.map