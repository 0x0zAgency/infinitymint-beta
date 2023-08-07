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
    const CloseBox = new window_1.InfinityMintWindow('CloseBox', {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    });
    /**
     *
     * @param window
     * @param frame
     * @param blessed
     */
    CloseBox.initialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let content = '{red-bg}ARE YOU SURE YOU WANT TO CLOSE INFINITYMINT?{/red-bg}\nMake sure that you are done with your current ganache deployments as they could be lost when this window is closed.';
        window.createElement('text', {
            left: 'center',
            top: 'center',
            width: 'shrink',
            height: 'shrink',
            padding: 2,
            tags: true,
            content: content,
        });
        //create buttons
        let closeInfinityMint = window.createElement('close', {
            bottom: 2,
            left: 2,
            width: 'shrink',
            mouse: true,
            keyboard: true,
            height: 'shrink',
            padding: 1,
            content: 'Close InfinityMint',
            tags: true,
            border: {
                type: 'line',
            },
            style: {
                fg: 'white',
                bg: 'red',
                border: {
                    fg: '#ffffff',
                },
                hover: {
                    bg: 'grey',
                },
            },
        });
        closeInfinityMint.on('click', () => {
            process.exit(0);
        });
        let keepInfinityMint = window.createElement('keepOpen', {
            bottom: 2,
            right: 2,
            width: 'shrink',
            height: 'shrink',
            mouse: true,
            keyboard: true,
            padding: 1,
            content: 'Keep InfinityMint Open',
            tags: true,
            border: {
                type: 'line',
            },
            style: {
                fg: 'white',
                bg: 'green',
                border: {
                    fg: '#ffffff',
                },
                hover: {
                    bg: 'grey',
                },
            },
        });
        keepInfinityMint.on('click', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield window.openWindow(window.options.currentWindow || 'Menu');
        }));
    });
    CloseBox.setHideCloseButton(true);
    exports.default = CloseBox;
});
//# sourceMappingURL=closeBox.js.map