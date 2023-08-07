import { InfinityMintWindow } from '../window';

const Debug = new InfinityMintWindow(
    'Debug',
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

Debug.initialize = async (window, frame, blessed) => {
    window.getInfinityConsole();
};

Debug.postInitialize = async (window, frame, blessed) => {
    let loading = '█';
    setInterval(() => {
        loading += '█';
        list.setContent(loading);
    }, 100);
    let list = window.createElement(
        'box',
        {
            label: '{bold}Loading, please wait :){/bold}',
            content: loading,
            draggable: true,
            tags: true,
            top: '40%',
            left: '5%',
            width: '90%',
            height: '12%+6',
            padding: 2,
            keys: true,
            vi: true,
            mouse: true,
            border: 'line',
            style: {
                bg: 'black',
                fg: 'red',
            },
        },
        'box'
    );
};

export default Debug;
