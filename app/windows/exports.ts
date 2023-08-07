import { InfinityMintWindow } from '../window';

const Exports = new InfinityMintWindow(
    'Exports',
    {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
    },
    {
        type: 'line',
    }
);

Exports.initialize = async (window, frame, blessed) => {
    let form = window.createElement(
        'form',
        {
            label: ' {bold}{white-fg}Scripts{/white-fg} (Enter/Double-Click to select){/bold}',
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

    let solutions = window.getInfinityConsole().getExportSolutions();
    form.setItems(
        Object.values(solutions).map((solution: any) => {
            return solution.name || solution.path;
        })
    );
};

export default Exports;
