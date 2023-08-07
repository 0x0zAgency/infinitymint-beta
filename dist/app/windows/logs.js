(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../helpers", "../window"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../helpers");
    const window_1 = require("../window");
    let lastLogMessage;
    /**
     * called in the initialize function of the window. Used to update the scrollbox element to the latest logs.
     * @param window
     */
    let updateContent = (window) => {
        var _a, _b;
        window.data.log.enableInput();
        window.data.log.focus();
        if ((_b = (_a = window.getInfinityConsole()) === null || _a === void 0 ? void 0 : _a.PipeFactory) === null || _b === void 0 ? void 0 : _b.pipes[window.data.log.options.pipe])
            window.data.log.setContent(window
                .getInfinityConsole()
                .PipeFactory.pipes[window.data.log.options.pipe].logs.map((log, index) => {
                if (lastLogMessage && lastLogMessage === log.message)
                    return (lineNumber(index, true) +
                        `{grey-fg}${log.pure}{/grey-fg}`);
                else {
                    lastLogMessage = log.message;
                    return lineNumber(index) + log.message;
                }
            })
                .join('\n'));
    };
    /**
     * returns the line number for the log
     * @param indexCount
     * @param gray
     * @returns
     */
    let lineNumber = (indexCount, gray) => {
        return `${gray ? '{white-bg}' : '{white-bg}'}{black-fg}${indexCount
            .toString()
            .padEnd(6, ' ')}{/black-fg}${gray ? '{/white-bg}' : '{/white-bg}'} `;
    };
    /**
     * is used to update the styles on the scrollUpdate button.
     * @param window
     * @param alwaysScroll
     */
    let alwaysScrollUpdate = (window, alwaysScroll) => {
        window.data.log.setLabel('{bold}{white-fg}Pipe: {/white-fg}' +
            window.data.log.options.pipe +
            '{/bold}');
        //change style
        alwaysScroll.style.bg = window.data.log.options.alwaysScroll
            ? 'green'
            : 'red';
        alwaysScroll.setContent('Auto Scroll [' +
            (window.data.log.options.alwaysScroll ? 'O' : 'X') +
            ']');
    };
    /**
     * Allows you to view the output of pipes
     */
    const Logs = new window_1.InfinityMintWindow('Logs', {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    }, {
        ch: ' ',
        track: {
            bg: 'black',
        },
        style: {
            inverse: true,
        },
    });
    //initializes the logging window.
    Logs.initialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        //register the console first
        let consoleStyle = {
            height: '100%-' + (frame.top + frame.bottom + 8),
            padding: 0,
            top: 4,
            label: `{bold}{white-fg}Pipe: {/white-fg}${'(LOADING)'}{/bold}`,
            keys: true,
            tags: true,
            scrollable: true,
            vi: true,
            mouse: true,
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'black',
                },
                style: {
                    inverse: true,
                },
            },
            border: 'line',
            style: {
                fg: 'white',
                bg: 'transparent',
                border: {
                    fg: '#f0f0f0',
                },
            },
        };
        let logs = [window.createElement('console0', consoleStyle)];
        logs.forEach((log) => {
            log.enableInput();
        });
        window.data.log = logs[0];
        //load the options with default values
        window.loadOptions(null, {
            console0: {
                alwaysScroll: true,
                scrollToSelectedLine: false,
                showDuplicateEntries: false,
                pipe: 'default',
                selectedLine: 0,
            },
        });
        if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.data.log) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.pipe))
            window.data.log.options.pipe = 'default';
        //create buttons
        let alwaysScroll = window.createElement('alwaysScroll', {
            bottom: 0,
            left: 0,
            width: 'shrink',
            height: 'shrink',
            mouse: true,
            keys: true,
            padding: 1,
            content: 'Auto Scroll [' +
                (window.data.log.options.alwaysScroll ? 'O' : 'X') +
                ']',
            tags: true,
            border: {
                type: 'line',
            },
            style: {
                fg: 'white',
                bg: window.data.log.options.alwaysScroll ? 'green' : 'red',
                border: {
                    fg: '#ffffff',
                },
                hover: {
                    bg: 'grey',
                },
            },
        });
        alwaysScroll.on('click', () => {
            //save option
            window.data.log.options.alwaysScroll =
                !window.data.log.options.alwaysScroll;
            window.data.log.options.scrollToSelectedLine = false;
            alwaysScrollUpdate(window, alwaysScroll);
            window.getScreen().render();
            window.saveOptions();
        });
        alwaysScroll.setFront();
        let save = window.createElement('save', {
            top: 3,
            right: 2,
            width: 'shrink',
            height: 'shrink',
            padding: 0,
            mouse: true,
            keys: true,
            content: 'Save',
            tags: true,
            border: {
                type: 'line',
            },
            style: {
                fg: 'white',
                bg: 'black',
                border: {
                    fg: '#ffffff',
                },
                hover: {
                    bg: 'grey',
                },
            },
        });
        //create buttons
        let changePipe = window.createElement('changePipe', {
            top: 3,
            right: (0, helpers_1.calculateWidth)(save) + 2,
            width: 'shrink',
            height: 'shrink',
            mouse: true,
            keys: true,
            padding: 0,
            content: 'Edit',
            tags: true,
            border: {
                type: 'line',
            },
            style: {
                fg: 'white',
                bg: 'black',
                border: {
                    fg: '#ffffff',
                },
                hover: {
                    bg: 'grey',
                },
            },
        });
        //create buttons
        let newPipe = window.createElement('newPipe', {
            top: 3,
            right: (0, helpers_1.calculateWidth)(save, changePipe) + 2,
            width: 'shrink',
            mouse: true,
            keys: true,
            height: 'shrink',
            padding: 0,
            content: 'Split',
            tags: true,
            border: {
                type: 'line',
            },
            style: {
                fg: 'white',
                bg: 'black',
                border: {
                    fg: '#ffffff',
                },
                hover: {
                    bg: 'grey',
                },
            },
        });
        let deletePipe = window.createElement('delete', {
            top: 3,
            right: (0, helpers_1.calculateWidth)(changePipe, save, newPipe) + 2,
            width: 'shrink',
            height: 'shrink',
            padding: 0,
            mouse: true,
            keys: true,
            content: 'Delete',
            tags: true,
            border: {
                type: 'line',
            },
            style: {
                fg: 'white',
                bg: 'black',
                border: {
                    fg: '#ffffff',
                },
                hover: {
                    bg: 'grey',
                },
            },
        });
        let form = window.createElement('form', {
            label: ` {bold}{white-fg}${((_c = window.data.log.options) === null || _c === void 0 ? void 0 : _c.pipe) || '(loading)'}{/white-fg} (Enter/Double-Click to select){/bold}`,
            tags: true,
            top: 'center',
            left: 'center',
            width: '100%-4',
            height: '100%-12',
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
        let keys = Object.keys(window.getInfinityConsole().PipeFactory.pipes);
        form.setItems(keys);
        form.on('select', (el, selected) => {
            window.data.log.options.pipe = keys[selected];
            window.data.log.setScroll(0);
            window.data.log.focus();
            window.data.log.setLabel('{bold}{white-fg}Pipe: {/white-fg}' +
                window.data.log.options.pipe +
                '{/bold}');
            updateContent(window);
            form.hide();
        });
        form.hide();
        deletePipe.on('click', () => {
            window
                .getInfinityConsole()
                .PipeFactory.getPipe(window.data.log.options.pipe).logs = [];
            window
                .getInfinityConsole()
                .PipeFactory.getPipe(window.data.log.options.pipe)
                .log('{red-fg}pipe deleted{/red-fg}');
            window.data.log.setLabel('{bold}{white-fg}Pipe: {/white-fg}' +
                window.data.log.options.pipe +
                '{/bold}');
            window.data.log.setContent('');
            form.hide();
        });
        let onChangePipe = () => {
            if (!window.isVisible())
                return;
            form.setFront();
            form.toggle();
            form.focus();
        };
        changePipe.setFront();
        changePipe.on('click', onChangePipe);
        window.key('p', onChangePipe);
        updateContent(window);
        window.data.log.setLabel('{bold}{white-fg}Pipe: {/white-fg}' +
            window.data.log.options.pipe +
            '{/bold}');
    });
    //runs after all elements have been appended and screen has been rendered
    Logs.postInitialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let cb = (msg, pipe, index) => {
            if (!window.isVisible())
                return;
            if (!window.data.log)
                return;
            if (pipe === window.data.log.options.pipe) {
                window.data.log.setLabel('{bold}{white-fg}Pipe: {/white-fg}' +
                    window.data.log.options.pipe +
                    '{/bold}');
                if (window.data.log.options.alwaysScroll)
                    window.data.log.setScrollPerc(100);
                if (lastLogMessage === msg)
                    window.data.log.pushLine(lineNumber(index, true) +
                        `{gray-fg}${blessed.cleanTags(msg)}{/gray-fg}`);
                else
                    window.data.log.pushLine(lineNumber(index) + msg);
                lastLogMessage = msg;
            }
        };
        window.getInfinityConsole().PipeFactory.emitter.on('log', cb);
        //save when the window is destroyed
        window.on('destroy', () => {
            window.getInfinityConsole().PipeFactory.emitter.off('log', cb);
        });
        //save when the window is hidden
        window.on('hide', () => {
            window.saveOptions();
        });
        //focus the log when the window is shown
        window.on('show', () => {
            window.data.log.focus();
        });
        window.unkey('up');
        window.key('up', (ch, key) => {
            let console = window.data.log;
            if (!console)
                return;
            //don't if we are invisible
            if (window.isVisible() === false)
                return;
            if (window.data.log.options.alwaysScroll) {
                window.data.log.options.alwaysScroll = false;
                window.saveOptions();
                alwaysScrollUpdate(window, window.elements['alwaysScroll']);
            }
            window.data.log.options.selectedLine = Math.max(0, window.data.log.options.selectedLine - 1);
        });
        //various keyboard commands
        window.unkey('down');
        window.key('down', (ch, key) => {
            var _a;
            let console = window.data.log;
            if (!console)
                return;
            if (window.isVisible() === false)
                return;
            window.data.log.options.selectedLine = Math.min((((_a = window.getInfinityConsole().PipeFactory.pipes[window.data.log.options.pipe]) === null || _a === void 0 ? void 0 : _a.logs) || ['']).length - 1, window.data.log.options.selectedLine + 1);
            alwaysScrollUpdate(window, window.elements['alwaysScroll']);
        });
        //centers the scroll of the console to the selected line position when you do Control-Q
        window.unkey('C-q');
        window.key('C-q', (ch, key) => {
            var _a;
            let console = window.data.log;
            if (!console)
                return;
            if (window.isVisible() === false)
                return;
            let selectedLinePosition = [
                ...(((_a = window.getInfinityConsole().PipeFactory.pipes[window.data.log.options.pipe]) === null || _a === void 0 ? void 0 : _a.logs) || ['']),
            ]
                .slice(0, window.data.log.options.selectedLine)
                .join('\n')
                .split('\n').length;
            console.setScroll(selectedLinePosition);
        });
        if (window.data.log.options.alwaysScroll)
            window.data.log.setScrollPerc(100);
        window.data.log.setScroll(0);
        window.data.log.focus();
        window.data.log.setLabel('{bold}{white-fg}Pipe: {/white-fg}' +
            window.data.log.options.pipe +
            '{/bold}');
        updateContent(window);
    });
    exports.default = Logs;
});
//# sourceMappingURL=logs.js.map