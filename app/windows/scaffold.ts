import { InfinityMintWindow } from '../window';
import hre from 'hardhat';

const Scaffold = new InfinityMintWindow(
    'Scaffold',
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
Scaffold.initialize = async (window, frame, blessed) => {
    let form = window.createElement(
        'form',
        {
            label: '{bold}(Enter/Double-Click to select){/bold}',
            tags: true,
            top: 4,
            left: 0,
            width: '50%',
            height: '100%-' + (frame.bottom + frame.top + 4),
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

    let artifacts = await hre.artifacts.getAllFullyQualifiedNames();
    form.setItems(artifacts);
};
export default Scaffold;
