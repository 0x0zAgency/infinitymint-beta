import { InfinityMintWindow } from '../window';

const Creator = new InfinityMintWindow(
    'Creator',
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

Creator.initialize = async (window, frame, blessed) => {
    let list = window.createElement(
        'form',
        {
            label: '{bold}(Enter/Double-Click to select){/bold}',
            tags: true,
            top: 4,
            left: 0,
            width: '25%',
            height: '100%-4',
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
    let templates = window.getInfinityConsole().getTemplates();
    let names = Object.keys(templates).map((key) => {
        return templates[key].name || key;
    });
    list.setItems(names);

    window.createElement(
        'tabController',
        {
            top: frame.top + frame.bottom + 4,
            height: '100%-' + (frame.top + frame.bottom + 4),
            width: '75%+1',
            left: '25%',
            tags: true,
            border: {
                type: 'line',
                fg: 'white',
            },
        },
        'TabController'
    );
};

Creator.postInitialize = async (window, frame, blessed) => {
    let tabController = window.getElement('tabController');

    tabController.addTab(
        window.createChildElement({
            width: tabController.width,
            height: tabController.height,
            left: tabController.left,
            top: tabController.top,
            tags: true,
            border: {
                type: 'line',
                fg: 'white',
            },
        }),
        'test'
    );
    tabController.addTab(
        window.createChildElement({
            width: tabController.width,
            height: tabController.height,
            left: tabController.left,
            top: tabController.top,
            tags: true,
            style: {
                bg: 'red',
            },
            border: {
                type: 'line',
                fg: 'white',
            },
        }),
        'test_2'
    );
    tabController.addTab(
        window.createChildElement({
            width: tabController.width,
            height: tabController.height,
            left: tabController.left,
            top: tabController.top,
            tags: true,
            style: {
                bg: 'green',
            },
            border: {
                type: 'line',
                fg: 'white',
            },
        }),
        'test_3'
    );
    tabController.addTab(
        window.createChildElement({
            width: tabController.width,
            height: tabController.height,
            left: tabController.left,
            top: tabController.top,
            tags: true,
            style: {
                bg: 'cyan',
            },
            border: {
                type: 'line',
                fg: 'white',
            },
        }),
        'test_4'
    );
};

export default Creator;
