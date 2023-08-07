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
    const Example = {
        postInitialize: (window, element, blessed) => {
            element.container = window.createChildElement({
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
            }, 'box', element);
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
    exports.default = Example;
});
//# sourceMappingURL=Example.js.map