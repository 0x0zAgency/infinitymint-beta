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
    const Menu = new window_1.InfinityMintWindow('Menu', {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    });
    Menu.initialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        window.createElement('icons', {
            label: '{bold}Desktop{/bold}',
            tags: true,
            top: 4,
            left: 0,
            width: '100%',
            height: '100%-' + (frame.bottom + frame.top + 4),
            padding: 2,
            style: {
                bg: 'black',
            },
            border: {
                type: 'line',
                fg: 'white',
            },
            instantlyAppend: true,
            keys: true,
        }, 'IconGroup');
    });
    Menu.postInitialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let icons = window.getElement('icons');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Scripts');
            },
        }, 'Scripts');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Projects');
            },
        }, 'Projects');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Creator');
            },
        }, 'Create Project');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Networks');
            },
        }, 'Change Network');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Gems');
            },
        }, 'Gems');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Gems');
            },
        }, 'Deployments');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Gems');
            },
        }, 'Export');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Gems');
            },
        }, 'Template');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Gems');
            },
        }, 'Tutorial');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Music');
            },
        }, 'Music');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Imports');
            },
        }, 'Imports');
        icons.addIcon({
            onClick: () => {
                window.openWindow('IPFS');
            },
        }, 'IPFS');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Ganache');
            },
        }, 'Ganache');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Debug');
            },
        }, 'Debug');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Logs');
            },
        }, 'Logs');
        icons.addIcon({
            onClick: () => {
                window.openWindow('Settings');
            },
        }, 'Options');
        icons.addIcon({
            onClick: () => {
                window.openWindow('CloseBox');
            },
        }, 'Exit');
        icons.setBack();
        frame.setBack();
        icons.renderIconTitles();
    });
    exports.default = Menu;
});
//# sourceMappingURL=menu.js.map