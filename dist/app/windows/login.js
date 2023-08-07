(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../telnet", "../helpers", "../window"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const telnet_1 = require("../telnet");
    const helpers_1 = require("../helpers");
    const window_1 = require("../window");
    const Login = new window_1.InfinityMintWindow('Login', {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    });
    Login.initialize = (window, frame, bessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (!window.getInfinityConsole().isTelnet())
            throw new Error('Login window only for telnet mode');
        let telnetOptions = (0, telnet_1.getTelnetOptions)();
        let title = telnetOptions.title ||
            `InfinityMint ${(0, helpers_1.getInfinityMintVersion)()} {underline}Telnet Server{/underline}`;
        window.createElement('form', {
            width: 'shrink',
            height: 'shrink',
            left: 'center',
            top: 'center',
            padding: 2,
            tags: true,
            content: `${title}\n\n{white-fg}Please Login:{/white-fg}`,
            border: 'line',
            style: {
                fg: 'green',
                bg: 'black',
                border: {
                    fg: 'green',
                },
            },
        });
        window.key('C-c', () => {
            //destroys the InfinityConsole
            window.getInfinityConsole().destroy();
        });
    });
    Login.setForcedOpen(true);
    Login.setHideRefreshButton(true);
    Login.setHideMinimizeButton(true);
    Login.setHideCloseButton(true);
    Login.setHiddenFromMenu(true);
    exports.default = Login;
});
//# sourceMappingURL=login.js.map