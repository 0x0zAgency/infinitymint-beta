import {
    calculateWidth,
    getInfinityMintVersion,
    getSolidityFolder,
    isEnvTrue,
    isInfinityMint,
    isTypescript,
} from '../helpers';
import { getCurrentProjectPath } from '../projects';
import { InfinityMintWindow } from '../window';
import hre from 'hardhat';
import { getDefaultAccountIndex } from '../web3';
import { importCount } from '../imports';
import { cwd } from '../helpers';

const ClassicMenu = new InfinityMintWindow(
    'ClassicMenu',
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

/**
 * creates the buttons for the menu
 * @param window
 */
let createButtons = (window: InfinityMintWindow) => {
    let projects = window.createElement('deploy', {
        bottom: 0,
        left: 0,
        shrink: true,
        width: 'shrink',
        alwaysFront: true,
        height: 'shrink',
        mouse: true,
        keys: true,
        padding: 1,
        content: 'View Projects',
        tags: true,
        border: {
            type: 'line',
        },
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
    });
    projects.on('click', async () => {
        await window.openWindow('Projects');
    });

    let browser = window.createElement('browser', {
        bottom: 0,
        left: calculateWidth(projects),
        shrink: true,
        alwaysFront: true,
        width: 'shrink',
        mouse: true,
        keys: true,
        height: 'shrink',
        padding: 1,
        content: 'Web3 Browser',
        tags: true,
        border: {
            type: 'line',
        },
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
    });
    browser.on('click', async () => {
        await window.openWindow('Browser');
    });

    let scripts = window.createElement('scripts', {
        bottom: 0,
        left: calculateWidth(projects, browser),
        shrink: true,
        width: 'shrink',
        alwaysFront: true,
        mouse: true,
        keys: true,
        height: 'shrink',
        padding: 1,
        content: 'Execute Scripts',
        tags: true,
        border: {
            type: 'line',
        },
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
    });
    scripts.on('click', async () => {
        await window.openWindow('Scripts');
    });

    let deployments = window.createElement('deployments', {
        bottom: 0,
        left: calculateWidth(projects, browser, scripts),
        shrink: true,
        width: 'shrink',
        height: 'shrink',
        alwaysFront: true,
        padding: 1,
        mouse: true,
        keys: true,
        content: 'View Deployments',
        tags: true,
        border: {
            type: 'line',
        },
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
    });
    deployments.on('click', async () => {
        await window.openWindow('Deployments');
    });

    let networks = window.createElement('networks', {
        bottom: 0,
        right: 0,
        shrink: true,
        width: 'shrink',
        alwaysFront: true,
        height: 'shrink',
        padding: 1,
        mouse: true,
        keys: true,
        content: 'Set Network',
        tags: true,
        border: {
            type: 'line',
        },
        style: {
            fg: 'white',
            bg: 'cyan',
            border: {
                fg: '#ffffff',
            },
            hover: {
                bg: 'grey',
            },
        },
    });
    networks.on('click', async () => {
        await window.openWindow('Networks');
    });
};

/**
 * the images for the menu
 */
const files = [
    '/resources/logos/fractal.gif',
    '/resources/logos/hypercube.gif',
    '/resources/logos/sectionz.png',
    '/resources/logos/pizza.gif',
    '/resources/logos/techno.gif',
    '/resources/logos/bio.gif',
    '/resources/logos/audio.gif',
    '/resources/logos/2032.gif',
];

/**
 * the think function for the menu, called every console tick
 * @param window
 * @param frame
 * @param blessed
 */
ClassicMenu.think = (window, frame, blessed) => {
    if (window.getElement('timeLabel')) {
        window
            .getElement('timeLabel')
            .setContent(
                `{white-bg}{black-fg}${new Date(
                    Date.now()
                ).toString()}{/black-fg}{/white-bg}`
            );
    }
};

ClassicMenu.initialize = async (window, frame, blessed) => {
    let background = window.createElement('background', {
        width: '100%',
        height: '100%-8',
        top: 4,
        padding: 1,
        label: '{bold}{white-fg}Menu{/white-fg}{/bold}',
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
    });
    background.setBack();

    let packageVersion = '1.0.1';
    try {
        packageVersion = getInfinityMintVersion();
    } catch (error) {
        if (isEnvTrue('THROW_ALL_ERRORS')) throw error;

        window.warning('could not get package json: ' + error.name);
    }

    let container = window.createElement('container', {
        width: '100%-3',
        height: '100%-10',
        top: 5,
        left: 2,
        style: {
            fg: 'white',
            bg: 'black',
        },
    });

    let logoWidth = Math.floor(
        Math.floor(
            Math.floor(150 / 1.61803398875) +
                parseInt(container.width.toString()) *
                    parseInt(container.height.toString()) *
                    0.0125
        ) / 2.75
    );
    let logoHeight = Math.floor(logoWidth / 2.45);
    //hide logo if screen too small
    if (parseInt(container.width.toString()) > 120)
        window.createElement(
            'logo',
            {
                top: 6,
                parent: container,
                left: 12,
                draggable: true,
                width: logoWidth,
                height: Math.max(
                    6,
                    Math.min(
                        parseInt(container.height.toString()) - 4,
                        logoHeight + 1
                    )
                ),
                padding: 0,
                file: isInfinityMint()
                    ? cwd() + files[Math.floor(Math.random() * files.length)]
                    : cwd() +
                      '/node_modules/infinitymint' +
                      files[Math.floor(Math.random() * files.length)],
                animate: true,
                style: {
                    bg: 'gray',
                    border: {
                        fg: '#f0f0f0',
                    },
                },
                border: window.getBorder(),
                alwaysFocus: true,
            },
            'image'
        );

    window.createElement('stripe', {
        width: 8,
        height: '100%-' + (frame.top + frame.bottom + 10),
        left: 1,
        top: 5,
        style: {
            fg: 'white',
            bg: 'gray',
        },
    });

    if (parseInt(container.height.toString()) > 16) {
        window.createElement(
            'title',
            {
                right: container.right,
                bottom: container.bottom + 3,
                width: 'shrink',
                height: 'shrink',
                tags: true,
                style: {
                    fg: 'green',
                    bg: 'black',
                },
                content: `∞mint`,
            },
            'bigtext'
        );
    } else
        window.createElement('tinyTitle', {
            right: container.right,
            bottom: container.bottom + 3,
            width: 'shrink',
            height: 'shrink',
            tags: true,
            bold: true,
            style: {
                fg: 'white',
            },
            content: `{bold}{green-fg}I N F I N I T Y  M I N T by {underline}0x0zAgency{/underline}{/green-fg}{/bold}`,
        });

    window.createElement('versionLabel', {
        right: container.right,
        bottom: container.bottom + 2,
        width: 'shrink',
        height: 'shrink',
        tags: true,
        bold: true,
        style: {
            fg: 'white',
        },
        content: `version ${packageVersion}`,
    });

    window.createElement('networkLabel', {
        right: container.right,
        bottom: container.bottom + 1,
        width: 'shrink',
        height: 'shrink',
        tags: true,
        bold: true,
        style: {
            fg: 'white',
        },
        content: `{white-bg}{black-fg}${hre.network.name}{/black-fg}{/white-bg}`,
    });

    window.createElement('timeLabel', {
        right: container.right,
        bottom: container.bottom,
        width: 'shrink',
        height: 'shrink',
        tags: true,
        bold: true,
        style: {
            fg: 'white',
        },
        content: `{white-bg}{black-fg}${new Date(
            Date.now()
        ).toString()}{/black-fg}{/white-bg}`,
    });

    if (parseInt(container.height.toString()) > 8)
        window.createElement('infoLabel', {
            left: 4,
            bottom: 6,
            parent: container,
            width: 'shrink',
            height: 'shrink',
            tags: true,
            alwaysFront: true,
            bold: true,
            padding: 0,
            style: {
                border: {
                    fg: '#f0f0f0',
                },
            },
            border: window.getBorder(),
            content: `{gray-bg}{magenta-fg}cwd =>{/magenta-fg} {white-fg}${cwd()}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}solidity_folder =>{/magenta-fg} {white-fg}${getSolidityFolder()}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}default_account =>{/magenta-fg} {white-fg}${getDefaultAccountIndex()}{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}loaded_scripts =>{/magenta-fg} {white-fg}${
                window.getInfinityConsole().getScripts().length
            }{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}typescript =>{/magenta-fg} {white-fg}${
                isTypescript() ? 'true' : 'false'
            }{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}hardhat_tasks =>{/magenta-fg} {white-fg}${
                Object.keys(hre.tasks).length
            }{/white-fg}{/gray-bg}\n{gray-bg}{magenta-fg}imports =>{/magenta-fg} {white-fg}${importCount(
                window.getInfinityConsole().getImports()
            )}{/white-fg}{/gray-bg}`,
        });

    let noProject = window.createElement('noProjectWarning', {
        top: 'center',
        right: 4,
        width: 'shrink',
        height: 'shrink',
        tags: true,
        alwaysFront: true,
        bold: true,
        padding: 1,
        style: {
            fg: 'black',
            bg: 'red',
            border: {
                fg: 'red',
            },
            hover: {
                fg: 'red',
                bg: 'black',
            },
        },
        border: window.getBorder(),
        content: `{bold}{underline}warning!{/underline}{/bold}\nno current project is set!\nclick me to set one...`,
    });
    noProject.on('click', () => {
        window.openWindow('Projects');
    });

    createButtons(window);
};

/**
 * called after the window is initialized
 * @param window
 */
ClassicMenu.postInitialize = async (window) => {
    let noProject = window.getElement('noProjectWarning');
    window.on('hide', () => {
        if (!getCurrentProjectPath()) noProject.show();
        else noProject.hide();
    });
    window.on('show', () => {
        if (!getCurrentProjectPath()) noProject.show();
        else noProject.hide();
    });
    window.on('focus', () => {
        if (!getCurrentProjectPath()) noProject.show();
        else noProject.hide();
    });

    if (!getCurrentProjectPath()) noProject.show();
    else noProject.hide();
};

export default ClassicMenu;
