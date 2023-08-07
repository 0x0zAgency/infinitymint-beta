//Copy this file then replace 'Example' with the name of the element you want to create
import { InfinityMintWindow } from '../window';
import { Blessed, BlessedElement } from '../helpers';

export interface Example extends BlessedElement {
    container?: BlessedElement;
    postInitialize?: (
        window: InfinityMintWindow,
        element: Example,
        blessed: Blessed
    ) => void;
    onHide?: (
        window: InfinityMintWindow,
        element: Example,
        blessed: Blessed
    ) => void;
    onShow?: (
        window: InfinityMintWindow,
        element: Example,
        blessed: Blessed
    ) => void;
    onDestroy?: (
        window: InfinityMintWindow,
        element: Example,
        blessed: Blessed
    ) => void;
    think?: (
        window: InfinityMintWindow,
        element: Example,
        blessed: Blessed
    ) => void;
    [key: string]: any;
}

const Example: Example = {
    postInitialize: (window, element, blessed) => {
        element.container = window.createChildElement(
            {
                width: '20%',
                top: element.top,
                left: element.left + 2,
                height: 5,
                border: {
                    type: 'line',
                    fg: 'white',
                },
                style: {
                    bg: 'red',
                },
            },
            'box',
            element
        );
    },
    onDestroy: (window, element, blessed) => {
        element.red.destroy();
        element.cyan.destroy();
        element.yellow.destroy();
        element.green.destroy();
        element.blue.destroy();
    },
    onHide: (window, element, blessed) => {
        element.red.hide();
        element.cyan.hide();
        element.yellow.hide();
        element.green.hide();
        element.blue.hide();
    },
    onShow: (window, element, blessed) => {
        element.red.show();
        element.cyan.show();
        element.yellow.show();
        element.green.show();
        element.blue.show();
    },
};

export default Example;
