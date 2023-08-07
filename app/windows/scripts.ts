import { BlessedElement, calculateWidth, cwd, warning } from '../helpers';
import { InfinityMintScript } from '../interfaces';
import { InfinityMintWindow } from '../window';

const Scripts = new InfinityMintWindow(
    'Scripts',
    {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    },
    {
        type: 'line',
    }
);

let lastPreviewScript: InfinityMintScript;
let updatePreview = (script: InfinityMintScript, preview: BlessedElement) => {
    lastPreviewScript = script;
    let parameters = Object.values(script.arguments || {}).map((arg, index) => {
        return `\n{black-fg}[{white-fg}${index}{/white-fg}]{/black-fg} => {white-fg}{underline}${
            arg.name
        }{/underline}{/white-fg}\ntype: ${arg.type || 'string'}\n${
            arg.value || '{yellow-fg}no default value{/yellow-fg}'
        }\noptional: ${
            arg.optional
                ? '{green-fg}true{/green-fg}'
                : '{red-fg}false{/red-fg}'
        }`;
    });
    preview.setContent(
        `{underline}{bold}{cyan-fg}${
            script.name
        }{/cyan-fg}{/bold}{/underline}\n{underline}${
            script.fileName
        }{/underline}\nsol folder: {magenta-fg}{bold}${
            script.solidityFolder || 'any'
        }{/magenta-fg}{/bold}\n\n{cyan-fg}{bold}{underline}Description:{/underline}{/bold}{/cyan-fg}\n{white-fg}${
            script.description || 'No Decription Available...'
        }{/white-fg}\n\n{cyan-fg}{bold}{underline}Authors:{/underline}{/bold}{/cyan-fg}{white-fg}\n${
            (script.author as any)?.name ||
            script.author?.[0]?.name ||
            'The 0x0zAgency Team'
        }\n${
            (script.author as any)?.twitter ||
            script.author?.[0]?.twitter ||
            '@0x0zAgency'
        }\n${
            (script.author as any)?.email ||
            script.author?.[0]?.email ||
            'llydia@0x0z.me'
        }{/white-fg}\n\n{cyan-fg}{bold}{underline}Parameters{/bold}{/underline} {black-fg}[{white-fg}${
            parameters.length
        }{/white-fg}]{/black-fg}:{/cyan-fg}\n${parameters.join('\n')}`
    );
};

Scripts.think = (window, frame, blessed) => {
    let scripts = window.getInfinityConsole().getScripts();
    let names = [...scripts].map((script) => script.name);

    if (!window.getElement('form')) return;
    if (!window.getElement('preview')) return;

    let script = scripts.filter(
        (script) => script.name === names[window.getElement('form').selected]
    )[0];

    if (lastPreviewScript !== script) {
        let preview = window.getElement('preview');
        updatePreview(script, preview);
        window.data.script = script;
        preview.focus();
    } else window.getElement('form').focus();
};

Scripts.initialize = async (window, frame, blessed) => {
    let form = window.createElement(
        'form',
        {
            label: ' {bold}{white-fg}Scripts{/white-fg} (Enter/Double-Click to select){/bold}',
            tags: true,
            top: 4,
            left: 0,
            width: '50%',
            height: '100%-' + (frame.bottom + frame.top + 8),
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
        },
        'list'
    );
    let preview = window.createElement('preview', {
        width: '50%+4',
        top: 4,
        right: 0,
        height: '100%-' + (frame.bottom + frame.top + 8),
        padding: 1,
        tags: true,
        scrollable: true,
        mouse: true,
        keyboard: true,
        scrollbar: {
            ch: ' ',
            track: {
                bg: 'black',
            },
            style: {
                inverse: true,
            },
        },
        border: {
            type: 'line',
        },
        style: {
            bg: 'grey',
            fg: 'white',
            item: {
                hover: {
                    bg: 'white',
                },
            },
            selected: {
                bg: 'white',
                bold: true,
            },
        },
    });

    let runButton = window.createElement('runButton', {
        width: 'shrink',
        bottom: 0,
        height: 5,
        left: 0,
        mouse: true,
        keys: true,
        padding: 1,
        content: 'Execute Script',
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
        border: 'line',
    });
    let runSelected = () => {
        window.hide();
        if (!window.data.script) {
            warning('no data');
            return;
        }
        let scriptData = window.data.script as InfinityMintScript;
        let script = window
            .getInfinityConsole()
            .getWindow('Script')
            .clone('Script_' + scriptData.name.replace(/ /g, '_'));
        //data of the script
        script.data.script = scriptData;
        script.setHiddenFromMenu(false);
        //show this script window, hiding this window
        window.getInfinityConsole().setWindow(script);
    };
    runButton.on('click', runSelected);

    let findScripts = window.createElement('findButton', {
        width: 'shrink',
        bottom: 0,
        height: 5,
        left: calculateWidth(runButton),
        keys: true,
        vi: true,
        mouse: true,
        padding: 1,
        content: 'Find Scripts',
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
        border: 'line',
    });

    let scripts = window.getInfinityConsole().getScripts();
    let names = [...scripts].map((script) => {
        let stub = `${
            script.javascript || script.fileName.split('.').pop() !== 'ts'
                ? `{yellow-fg}${script.fileName.split('.').pop()}{/yellow-fg}`
                : `{blue-fg}${script.fileName.split('.').pop()}{/blue-fg}`
        } {bold}${script.name}{/bold}`;

        if (
            script.fileName.indexOf('/mods/') !== -1 ||
            script.fileName.indexOf('/gems/') !== -1
        )
            stub = `${stub} {magenta-fg}{bold}GEM{/bold}{/}`;

        stub = stub + ` {gray-fg}(${script.fileName}){/gray-fg}`;

        return stub;
    });
    form.setItems(names);
    form.on('select', runSelected);
    form.focus();
};

Scripts.postInitialize = async (window) => {
    window.elements['findButton']?.enableMouse();
    window.elements['runButton']?.enableMouse();
};
export default Scripts;
