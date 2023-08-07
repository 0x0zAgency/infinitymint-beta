import { InfinityMintWindow } from '../window';

const Themes = new InfinityMintWindow(
    'Themes',
    {
        fg: 'white',
        bg: 'blue',
        border: {
            fg: '#f0f0f0',
        },
    },
    {
        type: 'line',
    }
);

Themes.initialize = async (window, frame, blessed) => {
    let background = window.registerElement(
        'console',
        blessed.box({
            width: '100%',
            height: '100%-8',
            padding: 1,
            top: 4,
            label: '{bold}{white-fg}Themes{/white-fg}{/bold}',
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
        })
    );
    background.setBack();
};
export default Themes;
