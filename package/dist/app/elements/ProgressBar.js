(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ProgressBar = {
        postInitialize: (window, element, blessed) => {
            element.container = window.createChildElement({
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
            }, 'image', element);
        },
        think: (window, element, blessed) => {
            element.rotate(element.image);
        },
        onHide: (window, element, blessed) => {
            // element.container.hide()
        },
    };
    exports.default = ProgressBar;
});
//# sourceMappingURL=ProgressBar.js.map