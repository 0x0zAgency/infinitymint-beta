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
    const Deployments = new window_1.InfinityMintWindow('Deployments', {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    });
    Deployments.initialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let background = window.registerElement('console', blessed.box({
            width: '100%',
            height: '100%-8',
            padding: 1,
            top: 4,
            label: '{bold}{white-fg}Deployments{/white-fg}{/bold}',
            left: 'center',
            keys: true,
            tags: true,
            scrollable: true,
            mouse: true,
            scrollbar: window.getScrollbar(),
            border: 'line',
            style: {
                fg: 'white',
                bg: 'transparent',
                border: {
                    fg: '#f0f0f0',
                },
            },
        }));
        background.setBack();
    });
    exports.default = Deployments;
});
//# sourceMappingURL=deployments.js.map