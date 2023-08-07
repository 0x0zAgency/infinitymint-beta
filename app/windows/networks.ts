import { InfinityMintWindow } from '../window';
import {
    getConfigFile,
    logDirect,
    readGlobalSession,
    saveGlobalSessionFile,
} from '../helpers';

const Networks = new InfinityMintWindow('Networks');

Networks.initialize = async (window, frame, blessed) => {
    let form = window.registerElement(
        'form',
        blessed.list({
            label: ' {bold}{white-fg}Select Network{/white-fg} (Enter/Double-Click to select){/bold}',
            tags: true,
            top: 'center',
            left: 'center',
            width: '95%',
            height: '60%',
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
        })
    );
    let keys = Object.keys(getConfigFile().hardhat.networks);
    form.setItems(keys);
    form.on('select', async (el: any, selected: any) => {
        let session = readGlobalSession();
        window.hide();
        await window.getInfinityConsole().changeNetwork(keys[selected]);
        session.environment.defaultNetwork = keys[selected];
        saveGlobalSessionFile(session);
    });
    form.focus();
};

export default Networks;
