import { InfinityMintWindow } from '../window';
import { BlessedElement, Blessed } from '../helpers';

export interface ProgressBar extends BlessedElement {
    container?: BlessedElement;
    postInitialize?: (
        window: InfinityMintWindow,
        element: ProgressBar,
        blessed: Blessed
    ) => void;
    onHide?: (
        window: InfinityMintWindow,
        element: ProgressBar,
        blessed: Blessed
    ) => void;
    onShow?: (
        window: InfinityMintWindow,
        element: ProgressBar,
        blessed: Blessed
    ) => void;
    onDestroy?: (
        window: InfinityMintWindow,
        element: ProgressBar,
        blessed: Blessed
    ) => void;
    think?: (
        window: InfinityMintWindow,
        element: ProgressBar,
        blessed: Blessed
    ) => void;
    [key: string]: any;
}

const ProgressBar: ProgressBar = {
    postInitialize: (window, element, blessed) => {
        element.container = window.createChildElement(
            {
                width: element.width,
                height: element.height,
                file: process.cwd() + '/resources/icons/loading.png',
                style: {
                    bg: 'gray',
                },
                border: {
                    type: 'line',
                    fg: 'white',
                },
            },
            'image',
            element
        );
    },

    think: (window, element, blessed) => {
        element.rotate(element.image);
    },

    onHide: (window, element, blessed) => {
        // element.container.hide()
    },
};

export default ProgressBar;
