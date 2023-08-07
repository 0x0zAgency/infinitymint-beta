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
    const IconGroup = {
        icons: [],
        iconTitles: {},
        selectedIcon: null,
        selectedIconTitle: null,
        container: null,
        iconWidth: 20,
        iconHeight: 5,
        iconMargin: 1,
        postInitialize: (window, element, blessed) => {
            //create a box to hold all the icons and then add methods to add and remove icons from the box
            element.container = window.createChildElement({
                width: element.width,
                height: element.height,
                hidden: true,
            });
            element.renderIconTitles = () => {
                Object.values(element.iconTitles).forEach((iconTitle) => {
                    iconTitle.destroy();
                });
                element.iconTitles = {};
                let y = element.top + 2;
                let count = 0;
                let totalCols = Math.floor(parseInt(element.width.toString()) / element.iconWidth);
                if (totalCols <= 0)
                    totalCols = 1;
                Object.values(element.icons).forEach((icon, index) => {
                    let left = element.left + count * element.iconWidth + 2;
                    if (element.iconTitles[icon.title] === undefined)
                        element.iconTitles[icon.title] = window.createChildElement({
                            width: element.iconWidth - element.iconMargin,
                            height: element.iconHeight,
                            left: left,
                            top: y,
                            padding: 1,
                            tags: true,
                            content: element.selectedIconTitle === icon.title
                                ? `[${index}] {bold}{white-fg}${icon.title || 'Untitled'}{/}`
                                : `[${index}] ${icon.title || 'Untitled'}`,
                            style: {
                                hover: {
                                    bg: 'magenta',
                                },
                                fg: 'black',
                                bg: element.selectedIconTitle === icon.title
                                    ? 'gray'
                                    : 'cyan',
                            },
                        }, 'box', element.container);
                    element.iconTitles[icon.title].on('click', () => {
                        //double click
                        if (element.selectedIcon !== null &&
                            element.selectedIcon.title === icon.title) {
                            element.selectedIcon = null;
                            element.selectedIconTitle = null;
                            if (icon.onClick)
                                icon.onClick(element, element.selectedIcon);
                        }
                        else {
                            element.selectedIcon = icon;
                            element.selectedIconTitle = icon.title;
                            element.iconTitles[icon.title].focus();
                            element.renderIconTitles();
                        }
                    });
                    if (Math.floor(left / element.iconWidth) >= totalCols - 1) {
                        y += element.iconHeight + element.iconMargin;
                        count = 0;
                    }
                    else
                        count++;
                });
            };
            element.addIcon = (_element, title) => {
                element.icons.push(Object.assign(Object.assign({}, _element), { title: title || element.icons.length }));
            };
            element.removeIcon = (title) => {
                element.icons = element.icons.filter((icon) => icon.title !== title);
                element.renderIconTitles();
            };
        },
        onHide: (window, element, blessed) => {
            Object.values(element.iconTitles).forEach((iconTitle) => {
                iconTitle.hide();
            });
        },
        onShow: (window, element, blessed) => {
            Object.values(element.iconTitles).forEach((iconTitle) => {
                iconTitle.show();
            });
        },
        onDestroy: (window, element, blessed) => {
            element.container.destroy();
            Object.values(element.iconTitles).forEach((iconTitle) => {
                iconTitle.destroy();
            });
        },
    };
    exports.default = IconGroup;
});
//# sourceMappingURL=IconGroup.js.map