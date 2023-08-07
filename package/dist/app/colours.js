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
    exports.blessedToAnsi = exports.blessedToHTML = exports.blessedLog = exports.underline = exports.dim = exports.bold = exports.white = exports.gray = exports.cyan = exports.magenta = exports.blue = exports.yellow = exports.red = exports.green = void 0;
    const colours = {
        Reset: '\x1b[0m',
        Bright: '\x1b[1m',
        Dim: '\x1b[2m',
        Underscore: '\x1b[4m',
        Underline: '\x1b[4m',
        Blink: '\x1b[5m',
        Reverse: '\x1b[7m',
        Hidden: '\x1b[8m',
        FgBlack: '\x1b[30m',
        FgRed: '\x1b[31m',
        Bold: '\u001b[1m',
        FgGreen: '\x1b[32m',
        FgYellow: '\x1b[33m',
        FgBlue: '\x1b[34m',
        FgMagenta: '\x1b[35m',
        FgCyan: '\x1b[36m',
        FgWhite: '\x1b[37m',
        FgGray: '\x1b[90m',
        BgBlack: '\x1b[40m',
        BgRed: '\x1b[41m',
        BgGreen: '\x1b[42m',
        BgYellow: '\x1b[43m',
        BgBlue: '\x1b[44m',
        BgMagenta: '\x1b[45m',
        BgCyan: '\x1b[46m',
        BgWhite: '\x1b[47m',
        BgGray: '\x1b[100m',
    };
    const green = (text) => {
        return colours['FgGreen'] + text + colours['Reset'];
    };
    exports.green = green;
    const red = (text) => {
        return colours['FgRed'] + text + colours['Reset'];
    };
    exports.red = red;
    const yellow = (text) => {
        return colours['FgYellow'] + text + colours['Reset'];
    };
    exports.yellow = yellow;
    const blue = (text) => {
        return colours['FgBlue'] + text + colours['Reset'];
    };
    exports.blue = blue;
    const magenta = (text) => {
        return colours['FgMagenta'] + text + colours['Reset'];
    };
    exports.magenta = magenta;
    const cyan = (text) => {
        return colours['FgCyan'] + text + colours['Reset'];
    };
    exports.cyan = cyan;
    const gray = (text) => {
        return colours['FgGray'] + text + colours['Reset'];
    };
    exports.gray = gray;
    const white = (text) => {
        return colours['FgWhite'] + text + colours['Reset'];
    };
    exports.white = white;
    const bold = (text) => {
        return colours['Bold'] + text + colours['Reset'];
    };
    exports.bold = bold;
    const dim = (text) => {
        return colours['Dim'] + text + colours['Reset'];
    };
    exports.dim = dim;
    const underline = (text) => {
        return colours['Underline'] + text + colours['Reset'];
    };
    exports.underline = underline;
    const blessedLog = (...any) => {
        const args = any.map((arg) => {
            if (arg instanceof Object) {
                return JSON.stringify(arg);
            }
            else {
                return arg;
            }
        });
        let results = args.join(' ');
        (console._log || console.log)((0, exports.blessedToAnsi)(results));
    };
    exports.blessedLog = blessedLog;
    Object.keys(colours).forEach((key) => {
        colours[key.toLowerCase()] = colours[key];
    });
    const blessedToHTML = (text) => {
        //capture everything between the { and } characters and replace it with the corresponding ansi code
        return text
            .replace(/\{(.*?)\}/g, (match) => {
            match = match.replace('{', '').replace('}', '');
            if (match[0] === '/')
                return '</span>';
            let texts = match.split('-');
            match = (texts[1] || '') + texts[0];
            if (match[0] === '/')
                return '</span>';
            if (colours[match]) {
                return `<span style="color: ${match
                    .toLowerCase()
                    .replace('fg', '')
                    .replace('bg', '')}">`;
            }
            else {
                return '';
            }
        })
            .replace(/\n/g, '<br>')
            .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    };
    exports.blessedToHTML = blessedToHTML;
    const blessedToAnsi = (text) => {
        text = text instanceof Array ? text.join(' ') : text;
        if (text instanceof Object)
            return JSON.stringify(text);
        //capture everything between the { and } characters and replace it with the corresponding ansi code
        return text.replace(/\{(.*?)\}/g, (match) => {
            match = match.replace('{', '').replace('}', '');
            if (match[0] === '/')
                return colours['Reset'];
            let texts = match.split('-');
            match = (texts[1] || '') + texts[0];
            if (match[0] === '/')
                return colours['Reset'];
            if (colours[match]) {
                return colours[match];
            }
            else {
                return '';
            }
        });
    };
    exports.blessedToAnsi = blessedToAnsi;
});
//# sourceMappingURL=colours.js.map