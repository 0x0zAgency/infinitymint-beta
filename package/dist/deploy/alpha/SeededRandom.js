(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const SeededRandom = {
        unique: true,
        module: 'random',
        index: 4,
        values: {
            seedNumber: 230,
            maxRandomNumber: 0xffffff,
        },
        deployArgs: ({ project }) => {
            return [project.settings.values.seedNumber.toString(), 'values'];
        },
        solidityFolder: 'alpha',
    };
    exports.default = SeededRandom;
});
//# sourceMappingURL=SeededRandom.js.map