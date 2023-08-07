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

export const green = (text: string) => {
    return colours['FgGreen'] + text + colours['Reset'];
};

export const red = (text: string) => {
    return colours['FgRed'] + text + colours['Reset'];
};

export const yellow = (text: string) => {
    return colours['FgYellow'] + text + colours['Reset'];
};

export const blue = (text: string) => {
    return colours['FgBlue'] + text + colours['Reset'];
};

export const magenta = (text: string) => {
    return colours['FgMagenta'] + text + colours['Reset'];
};

export const cyan = (text: string) => {
    return colours['FgCyan'] + text + colours['Reset'];
};

export const gray = (text: string) => {
    return colours['FgGray'] + text + colours['Reset'];
};

export const white = (text: string) => {
    return colours['FgWhite'] + text + colours['Reset'];
};

export const bold = (text: string) => {
    return colours['Bold'] + text + colours['Reset'];
};

export const dim = (text: string) => {
    return colours['Dim'] + text + colours['Reset'];
};

export const underline = (text: string) => {
    return colours['Underline'] + text + colours['Reset'];
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

export const blessedToHTML = (text: string) => {
    //capture everything between the { and } characters and replace it with the corresponding ansi code
    return text
        .replace(/\{(.*?)\}/g, (match) => {
            match = match.replace('{', '').replace('}', '');

            if (match[0] === '/') return '</span>';

            let texts = match.split('-');
            match = (texts[1] || '') + texts[0];

            if (match[0] === '/') return '</span>';

            if (colours[match]) {
                return `<span style="color: ${match
                    .toLowerCase()
                    .replace('fg', '')
                    .replace('bg', '')}">`;
            } else {
                return '';
            }
        })
        .replace(/\n/g, '<br>')
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
};

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
