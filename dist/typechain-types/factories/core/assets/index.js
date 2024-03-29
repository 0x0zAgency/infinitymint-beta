(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./RarityAny__factory", "./RarityImage__factory", "./RaritySVG__factory", "./SimpleAny__factory", "./SimpleImage__factory", "./SimpleSVG__factory", "./SimpleToken__factory"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimpleToken__factory = exports.SimpleSVG__factory = exports.SimpleImage__factory = exports.SimpleAny__factory = exports.RaritySVG__factory = exports.RarityImage__factory = exports.RarityAny__factory = void 0;
    /* Autogenerated file. Do not edit manually. */
    /* tslint:disable */
    /* eslint-disable */
    var RarityAny__factory_1 = require("./RarityAny__factory");
    Object.defineProperty(exports, "RarityAny__factory", { enumerable: true, get: function () { return RarityAny__factory_1.RarityAny__factory; } });
    var RarityImage__factory_1 = require("./RarityImage__factory");
    Object.defineProperty(exports, "RarityImage__factory", { enumerable: true, get: function () { return RarityImage__factory_1.RarityImage__factory; } });
    var RaritySVG__factory_1 = require("./RaritySVG__factory");
    Object.defineProperty(exports, "RaritySVG__factory", { enumerable: true, get: function () { return RaritySVG__factory_1.RaritySVG__factory; } });
    var SimpleAny__factory_1 = require("./SimpleAny__factory");
    Object.defineProperty(exports, "SimpleAny__factory", { enumerable: true, get: function () { return SimpleAny__factory_1.SimpleAny__factory; } });
    var SimpleImage__factory_1 = require("./SimpleImage__factory");
    Object.defineProperty(exports, "SimpleImage__factory", { enumerable: true, get: function () { return SimpleImage__factory_1.SimpleImage__factory; } });
    var SimpleSVG__factory_1 = require("./SimpleSVG__factory");
    Object.defineProperty(exports, "SimpleSVG__factory", { enumerable: true, get: function () { return SimpleSVG__factory_1.SimpleSVG__factory; } });
    var SimpleToken__factory_1 = require("./SimpleToken__factory");
    Object.defineProperty(exports, "SimpleToken__factory", { enumerable: true, get: function () { return SimpleToken__factory_1.SimpleToken__factory; } });
});
//# sourceMappingURL=index.js.map