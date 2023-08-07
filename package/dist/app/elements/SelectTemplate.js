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
    const SelectTemplate = {
        postInitialize: (window, element, blessed) => {
            let selectMenu = window.registerElement('selectMenu', blessed.list({
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
            }));
            selectMenu.setContent('{bold}{white-fg}Select Network{/white-fg} (Enter/Double-Click to select){/bold}');
            selectMenu.setItems(['Hi!', 'Universe', '42']);
        },
    };
    exports.default = SelectTemplate;
});
//# sourceMappingURL=SelectTemplate.js.map