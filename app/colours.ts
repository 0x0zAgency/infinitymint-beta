import { defaultFactory } from './pipes';

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

export const blessedLog = (...any: any[]) => {
    const args = any.map((arg) => {
        if (arg instanceof Object) {
            return JSON.stringify(arg);
        } else {
            return arg;
        }
    });

    let results = args.join(' ');
    ((console as any)._log || (console as any).log)(blessedToAnsi(results));
};

Object.keys(colours).forEach((key) => {
    colours[key.toLowerCase()] = colours[key];
});

export const blessedToAnsi = (text: string) => {
    text = (text as any) instanceof Array ? (text as any).join(' ') : text;
    if ((text as any) instanceof Object) return JSON.stringify(text);

    //capture everything between the { and } characters and replace it with the corresponding ansi code
    return text.replace(/\{(.*?)\}/g, (match) => {
        match = match.replace('{', '').replace('}', '');

        if (match[0] === '/') return colours['Reset'];

        let texts = match.split('-');
        match = (texts[1] || '') + texts[0];

        if (match[0] === '/') return colours['Reset'];

        if (colours[match]) {
            return colours[match];
        } else {
            return '';
        }
    });
};
