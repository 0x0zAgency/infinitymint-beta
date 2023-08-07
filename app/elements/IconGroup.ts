import {
    BlessedElement,
    BlessedElementOptions,
    debugLog,
    log,
    print,
} from '../helpers';

const IconGroup: BlessedElement = {
    postInitialize: (window, element, blessed) => {
        element.icons = [];
        element.iconTitles = {};
        element.selectedIcon = null;
        element.selectedIconTitle = null;
        element.iconWidth = 20;
        element.iconHeight = 5;
        element.iconMargin = 1;
        //create a box to hold all the icons and then add methods to add and remove icons from the box
        element.container = window.createChildElement({
            width: element.width,
            height: element.height,
            hidden: true,
        });
        element.renderIconTitles = () => {
            Object.values(element.iconTitles).forEach(
                (iconTitle: BlessedElement) => {
                    iconTitle.destroy();
                }
            );
            element.iconTitles = {};

            let y = element.top + 2;
            let count = 0;
            let totalCols = Math.floor(
                parseInt(element.width.toString()) / element.iconWidth
            );

            if (totalCols <= 0) totalCols = 1;

            Object.values(element.icons).forEach((icon: any, index) => {
                let left = element.left + count * element.iconWidth + 2;

                if (element.iconTitles[icon.title] === undefined)
                    element.iconTitles[icon.title] = window.createChildElement(
                        {
                            width: element.iconWidth - element.iconMargin,
                            height: element.iconHeight,
                            left: left,
                            top: y,
                            padding: 1,
                            tags: true,
                            content:
                                element.selectedIconTitle === icon.title
                                    ? `[${index}] {bold}{white-fg}${
                                          icon.title || 'Untitled'
                                      }{/}`
                                    : `[${index}] ${icon.title || 'Untitled'}`,
                            style: {
                                hover: {
                                    bg: 'magenta',
                                },
                                fg: 'black',
                                bg:
                                    element.selectedIconTitle === icon.title
                                        ? 'gray'
                                        : 'cyan',
                            },
                        },
                        'box',
                        element.container
                    );

                element.iconTitles[icon.title].on('click', () => {
                    //double click
                    if (
                        element.selectedIcon !== null &&
                        element.selectedIcon.title === icon.title
                    ) {
                        element.selectedIcon = null;
                        element.selectedIconTitle = null;

                        if (icon.onClick)
                            icon.onClick(element, element.selectedIcon);
                    } else {
                        element.selectedIcon = icon;
                        element.selectedIconTitle = icon.title;
                        element.iconTitles[icon.title].focus();
                        element.renderIconTitles();
                    }
                });

                if (Math.floor(left / element.iconWidth) >= totalCols - 1) {
                    y += element.iconHeight + element.iconMargin;
                    count = 0;
                } else count++;
            });
        };

        element.addIcon = (_element: BlessedElementOptions, title: string) => {
            element.icons.push({
                ..._element,
                title: title || element.icons.length,
            });
        };

        element.removeIcon = (title: string) => {
            element.icons = element.icons.filter(
                (icon) => icon.title !== title
            );
            element.renderIconTitles();
        };
    },

    onHide: (window, element, blessed) => {
        Object.values(element.iconTitles).forEach(
            (iconTitle: BlessedElement) => {
                iconTitle.hide();
            }
        );
    },
    onShow: (window, element, blessed) => {
        Object.values(element.iconTitles).forEach(
            (iconTitle: BlessedElement) => {
                iconTitle.show();
            }
        );
    },
    onDestroy: (window, element, blessed) => {
        element.container.destroy();
        Object.values(element.iconTitles).forEach(
            (iconTitle: BlessedElement) => {
                iconTitle.destroy();
            }
        );
    },
};

export default IconGroup;
