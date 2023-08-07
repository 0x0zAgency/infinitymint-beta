import { BlessedElement, print } from '../helpers';

const Example: BlessedElement = {
    postInitialize: (window, element, blessed) => {
        element.red = window.createChildElement(
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
        element.cyan = window.createChildElement(
            {
                width: '20%',
                height: 5,
                left: element.left + 2,
                top: element.top + 10,
                border: {
                    type: 'line',
                    fg: 'white',
                },
                style: {
                    bg: 'cyan',
                },
            },
            'box',
            element
        );
        element.yellow = window.createChildElement(
            {
                width: '20%',
                height: 5,
                top: element.top + 15,
                left: element.left + 2,
                border: {
                    type: 'line',
                    fg: 'white',
                },
                style: {
                    bg: 'yellow',
                },
            },
            'box',
            element
        );
        element.green = window.createChildElement(
            {
                width: '20%',
                height: 5,
                left: element.left + 2,
                top: element.top + 5,
                border: {
                    type: 'line',
                    fg: 'white',
                },
                style: {
                    bg: 'green',
                },
            },
            'box',
            element
        );
        element.blue = window.createChildElement(
            {
                width: '20%',
                height: 5,
                left: element.left + 2,
                top: element.top + 20,
                border: {
                    type: 'line',
                    fg: 'white',
                },
                style: {
                    bg: 'blue',
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
