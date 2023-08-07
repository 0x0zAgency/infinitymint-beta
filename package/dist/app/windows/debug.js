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
    const Debug = new window_1.InfinityMintWindow('Debug', {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    });
    Debug.initialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        window.getInfinityConsole();
    });
    Debug.postInitialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let loading = '█';
        setInterval(() => {
            loading += '█';
            list.setContent(loading);
        }, 100);
        let list = window.createElement('box', {
            label: '{bold}Loading, please wait :){/bold}',
            content: loading,
            draggable: true,
            tags: true,
            top: '40%',
            left: '5%',
            width: '90%',
            height: '12%+6',
            padding: 2,
            keys: true,
            vi: true,
            mouse: true,
            border: 'line',
            style: {
                bg: 'black',
                fg: 'red',
            },
        }, 'box');
    });
    exports.default = Debug;
});
//# sourceMappingURL=debug.js.map