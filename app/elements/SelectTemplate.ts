import { BlessedElement, print } from '../helpers';

const SelectTemplate: BlessedElement = {
    postInitialize: (window, element, blessed) => {
        let selectMenu = window.registerElement(
            'selectMenu',
            blessed.list({
                width: '50%',
                height: '80%',
                top: element.top + 5,
                border: {
                    type: 'line',
                    fg: 'white',
                },
                style: {
                    bg: 'red',
                },
            })
        );

        selectMenu.setContent(
            '{bold}{white-fg}Select Network{/white-fg} (Enter/Double-Click to select){/bold}'
        );
        selectMenu.setItems(['Hi!', 'Universe', '42']);
    },
};

export default SelectTemplate;
