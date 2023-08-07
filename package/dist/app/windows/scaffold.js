(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../window", "hardhat"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const window_1 = require("../window");
    const hardhat_1 = tslib_1.__importDefault(require("hardhat"));
    const Scaffold = new window_1.InfinityMintWindow('Scaffold', {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    });
    Scaffold.initialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let form = window.createElement('form', {
            label: '{bold}(Enter/Double-Click to select){/bold}',
            tags: true,
            top: 4,
            left: 0,
            width: '50%',
            height: '100%-' + (frame.bottom + frame.top + 4),
            padding: 2,
            keys: true,
            vi: true,
            mouse: true,
            border: 'line',
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'black',
                },
                style: {
                    inverse: true,
                },
            },
            style: {
                bg: 'black',
                fg: 'white',
                item: {
                    hover: {
                        bg: 'green',
                        fg: 'black',
                    },
                },
                selected: {
                    bg: 'grey',
                    fg: 'green',
                    bold: true,
                },
            },
        }, 'list');
        let artifacts = yield hardhat_1.default.artifacts.getAllFullyQualifiedNames();
        form.setItems(artifacts);
    });
    exports.default = Scaffold;
});
//# sourceMappingURL=scaffold.js.map