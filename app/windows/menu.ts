import { InfinityMintWindow } from '../window';
import { debugLog, print } from '../helpers';

const Menu = new InfinityMintWindow(
    'Menu',
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
Menu.initialize = async (window, frame, blessed) => {
    let icons = window.createElement(
        'icons',
        {
            label: '{bold}Desktop{/bold}',
            tags: true,
            top: 4,
            left: 0,
            width: '100%',
            height: '100%-' + (frame.bottom + frame.top + 4),
            padding: 2,
            style: {
                bg: 'black',
            },
            border: {
                type: 'line',
                fg: 'white',
            },
            instantlyAppend: true,
            keys: true,
        },
        'IconGroup'
    );
};

Menu.postInitialize = async (window, frame, blessed) => {
    let icons = window.getElement('icons');
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Scripts');
            },
        },
        'Scripts'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Projects');
            },
        },
        'Projects'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Creator');
            },
        },
        'Create Project'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Networks');
            },
        },
        'Change Network'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Gems');
            },
        },
        'Gems'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Gems');
            },
        },
        'Deployments'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Gems');
            },
        },
        'Export'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Gems');
            },
        },
        'Template'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Gems');
            },
        },
        'Tutorial'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Music');
            },
        },
        'Music'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Imports');
            },
        },
        'Imports'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('IPFS');
            },
        },
        'IPFS'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Ganache');
            },
        },
        'Ganache'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Debug');
            },
        },
        'Debug'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Logs');
            },
        },
        'Logs'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('Settings');
            },
        },
        'Options'
    );
    icons.addIcon(
        {
            onClick: () => {
                window.openWindow('CloseBox');
            },
        },
        'Exit'
    );
    icons.setBack();
    frame.setBack();
    icons.renderIconTitles();
};

export default Menu;
