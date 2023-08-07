import { executeScript, isInfinityMint, warning } from '../helpers';
import { InfinityMintWindow } from '../window';
import { InfinityMintScript } from '../interfaces';

const Script = new InfinityMintWindow(
    'Script',
    {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
    },
    {
        type: 'line',
    },
    {
        ch: ' ',
        track: {
            bg: 'black',
        },
        style: {
            inverse: true,
        },
    }
);

const execute = async (window: InfinityMintWindow) => {
    //run in the background
    window.data.processing = true;
    window.elements['retry'].hide();

    try {
        window
            .getInfinityConsole()
            .log(
                `{bold}{blue-fg}{underline}executing ${
                    (window.data.script as InfinityMintScript).fileName
                }{/}`
            );
        //set the default logger in the dist and node modules

        await executeScript(
            window.data.script,
            window.getInfinityConsole().getEventEmitter(),
            {},
            window.data.args || {},
            window.getInfinityConsole()
        );
        window
            .getInfinityConsole()
            .log('{bold}{green-fg}{underline}script executed successfully{/}');
        window.setHideCloseButton(false);
        window.elements['output'].setScrollPerc(100);
        window.elements['outputDebug'].setScrollPerc(100);
        window.elements['close'].show();
        setTimeout(() => {
            window.data.processing = false;
        }, 1000);
    } catch (error) {
        setTimeout(() => {
            window.data.processing = false;
        }, 1000);

        window
            .getInfinityConsole()
            .log('{red-fg}{bold}{underline}script failed exectuion{/}');

        window.elements['retry'].show();
        window.setHideCloseButton(false);
        window.elements['output'].setScrollPerc(100);
        window.elements['outputDebug'].setScrollPerc(100);

        window.getInfinityConsole().errorHandler(error);
    }
};

Script.initialize = async (window, frame, blessed) => {
    if (!window.data.script)
        throw new Error('must be instantated with script in data field');

    //when window.logs occur
    let cb = async (msg: string, pipe: string) => {
        if (pipe === 'debug') window.elements['outputDebug'].pushLine(msg);

        //keep showing debug
        if (pipe === 'default' && window.data.processing)
            window.elements['output'].pushLine(msg);

        window.getScreen().render();
    };

    window.getInfinityConsole().getConsoleLogs().emitter.on('log', cb);
    //when this window is destroyed, destroy the output emitter
    window.on('destroy', () => {
        window.getInfinityConsole().getConsoleLogs().emitter.off('log', cb);
    });

    window.think = async (window, element) => {
        if (window.data.processing === true) {
            output.setScrollPerc(100);
            outputDebug.setScrollPerc(100);
        }
    };

    let output = window.createElement('output', {
        height: '100%-8',
        width: '70%',
        padding: 1,
        top: 4,
        label: `{bold}{white-fg}Output: {/white-fg}{/bold}`,
        keys: true,
        tags: true,
        scrollable: true,
        vi: true,
        instantlyAppend: true,
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
    });
    let outputDebug = window.createElement('outputDebug', {
        height: '100%-8',
        width: '30%+2',
        padding: 1,
        right: 0,
        top: 4,
        label: `{bold}{white-fg}Debug: {/white-fg}{/bold}`,
        keys: true,
        tags: true,
        scrollable: true,
        vi: true,
        instantlyAppend: true,
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
    });

    let retry = window.createElement('retry', {
        bottom: 0,
        left: 0,
        shrink: true,
        width: 'shrink',
        alwaysFront: true,
        height: 'shrink',
        padding: 1,
        mouse: true,
        keys: true,
        content: 'Retry Script',
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
    retry.on('click', async () => {
        await window.getInfinityConsole().loadScripts();
        //set the new script
        outputDebug.setContent('');
        outputDebug.setScrollPerc(0);
        window.debugLog('{cyan-fg}retrying script{/cyan-fg}');

        //just for a bit of visual clarity
        setTimeout(() => {
            window.data.script =
                window
                    .getInfinityConsole()
                    .getScripts()
                    .filter(
                        (script) =>
                            script.fileName === window.data.script.fileName
                    )[0] || window.data.script;

            output.setContent('');
            output.setScrollPerc(0);
            setTimeout(() => {
                execute(window);
            }, 500);
        }, 500);
    });
    retry.hide();

    let close = window.createElement('close', {
        bottom: 0,
        left: 0,
        shrink: true,
        width: 'shrink',
        alwaysFront: true,
        height: 'shrink',
        mouse: true,
        keys: true,
        padding: 1,
        content: 'Close Script',
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
    close.on('click', () => {
        window.openWindow('Scripts');
        window.getInfinityConsole().destroyWindow(window);
    });
    close.hide();

    output.setContent(`{cyan-fg}Awaiting Execution...{/cyan-fg}`);
    setTimeout(async () => {
        await execute(window);
    }, 1000);
};

Script.setBackgroundThink(true);
Script.setHideRefreshButton(true);
Script.setHideCloseButton(true);
Script.setCanRefresh(false);
Script.setHiddenFromMenu(true);
export default Script;
