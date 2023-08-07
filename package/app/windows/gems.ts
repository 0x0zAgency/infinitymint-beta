import { InfinityMintWindow } from '../window';

const Gems = new InfinityMintWindow(
    'Gems',
    {
        fg: 'white',
        bg: 'magenta',
        border: {
            fg: '#f0f0f0',
        },
    },
    {
        type: 'line',
    }
);

Gems.initialize = async (window, frame, blessed) => {
    let background = window.registerElement(
        'console',
        blessed.box({
            width: '100%',
            height: '100%-8',
            padding: 1,
            top: 4,
            label: '{bold}{white-fg}Gem{/white-fg}{/bold}',
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
export default Gems;
