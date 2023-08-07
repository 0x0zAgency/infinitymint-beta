import { BlessedElement, print } from '../helpers'

interface ProgressBarInterface extends BlessedElement {
    container?: BlessedElement
}

const ProgressBar: ProgressBarInterface = {
    postInitialize: (window, element: ProgressBarInterface, blessed) => {
        element.rotate = (el: BlessedElement) =>
            print(el.x *= Math.cos(el.x) - el.y * Math.sin(el.x))

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
        )
    },

    think: (window, element: ProgressBarInterface, blessed) => {
        element.rotate(element.image)
    },

    onHide: (window, element: ProgressBarInterface, blessed) => {
        // element.container.hide()
    }

}

export default ProgressBar
