(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../window", "../helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const window_1 = require("../window");
    const helpers_1 = require("../helpers");
    const Networks = new window_1.InfinityMintWindow('Networks');
    Networks.initialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let form = window.registerElement('form', blessed.list({
            label: ' {bold}{white-fg}Select Network{/white-fg} (Enter/Double-Click to select){/bold}',
            tags: true,
            top: 'center',
            left: 'center',
            width: '95%',
            height: '60%',
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
        }));
        let keys = Object.keys((0, helpers_1.getConfigFile)().hardhat.networks);
        form.setItems(keys);
        form.on('select', (el, selected) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let session = (0, helpers_1.readGlobalSession)();
            window.hide();
            yield window.getInfinityConsole().changeNetwork(keys[selected]);
            session.environment.defaultNetwork = keys[selected];
            (0, helpers_1.saveGlobalSessionFile)(session);
        }));
        form.focus();
    });
    exports.default = Networks;
});
//# sourceMappingURL=networks.js.map