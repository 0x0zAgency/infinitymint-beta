import { InfinityMintWindow } from '../window';
import { Blessed, BlessedElement, Dictionary } from '../helpers';

export interface TabController extends BlessedElement {
    tabs?: Dictionary<BlessedElement>;
    tabTitles?: Dictionary<BlessedElement>;
    selectedTab?: BlessedElement;
    selectedTabTitle?: string;
    container?: BlessedElement;
    alert?: BlessedElement;
    renderTabTitles?: () => void;
    addTab?: (tab: BlessedElement, title: string) => void;
    selectTab?: (title: string) => void;
    removeTab?: (title: string) => void;
    getTab?: (title: string) => BlessedElement;
    getTabTitle?: (title: string) => BlessedElement;
    hideTabs?: () => void;
    showTabs?: () => void;
    postInitialize?: (
        window: InfinityMintWindow,
        element: TabController,
        blessed: Blessed
    ) => void;
    onHide?: (
        window: InfinityMintWindow,
        element: TabController,
        blessed: Blessed
    ) => void;
    onShow?: (
        window: InfinityMintWindow,
        element: TabController,
        blessed: Blessed
    ) => void;
    onDestroy?: (
        window: InfinityMintWindow,
        element: TabController,
        blessed: Blessed
    ) => void;
    think?: (
        window: InfinityMintWindow,
        element: TabController,
        blessed: Blessed
    ) => void;
    [key: string]: any;
}

const TabController: TabController = {
    postInitialize: (window, element, blessed) => {
        element.tabs = {};
        element.tabTitles = {};
        element.selectedTab = null;
        element.selectedTabTitle = null;
        element.container = window.createChildElement(
            {
                width: element.width,
                height: element.height,
                style: {
                    bg: 'gray',
                },
                border: {
                    type: 'line',
                    fg: 'white',
                },
            },
            'box',
            element
        );

        element.renderTabTitles = () => {
            Object.values(element.tabTitles).forEach(
                (tabTitle: BlessedElement) => {
                    tabTitle.destroy();
                }
            );
            element.tabTitles = {};
            Object.keys(element.tabs).forEach((tabTitle, index) => {
                element.tabTitles[tabTitle] = window.createChildElement({
                    width: 16,
                    height: 'shrink',
                    left: element.left + index * 16,
                    top: element.top,
                    padding: 1,
                    border: {
                        type: 'line',
                        fg: 'white',
                    },
                    content: tabTitle,
                    style: {
                        bg:
                            element.selectedTabTitle === tabTitle
                                ? 'green'
                                : 'cyan',
                    },
                });

                element.tabTitles[tabTitle].on('click', () => {
                    element.selectTab(tabTitle);
                    element.renderTabTitles();
                    element.selectedTab.focus();
                });
            });
        };

        element.addTab = (_element: BlessedElement, title: string) => {
            element.tabs[title] = _element;
            _element.hide();
            element.renderTabTitles();
            window.getScreen().render();
        };
        element.selectTab = (title: string) => {
            element.hideTabs();
            element.selectedTab = element.tabs[title];
            element.selectedTabTitle = title;

            if (element.selectedTab.onShow !== undefined)
                element.selectedTab.onShow(
                    window,
                    element.selectedTab,
                    blessed
                );

            element.selectedTab.show();
            window.getScreen().render();
        };
        element.removeTab = (title: string) => {
            if (element.selectedTabTitle === title) element.selectedTab = null;
            delete element.tabs[title];
            element.renderTabTitles();
            window.getScreen().render();
        };

        element.hideTabs = () => {
            Object.values(element.tabs).forEach((tab: BlessedElement) => {
                if (tab.onHide !== undefined) tab.onHide(window, tab, blessed);
                tab.hide();
            });
        };

        element.alert = window.createChildElement({
            width: 24,
            height: 5,
            top: element.top + 5,
            left: element.left + 5,
            tags: true,
            padding: 1,
            content: '{bold}{white-fg}Please Select A Tab{/}',
            border: {
                type: 'line',
                fg: 'white',
            },
            style: {
                bg: 'red',
            },
        });

        if (element.selectedTab === null) element.alert.show();
        else element.alert.hide();
    },
    think: (window, element, blessed) => {
        element.alert.top =
            element.top +
            8 +
            Math.floor(Math.sin(window.getInfinityConsole().getTick() / 2) * 2);
        element.alert.left =
            element.left +
            20 +
            Math.floor(Math.sin(window.getInfinityConsole().getTick() * 2) * 4);
    },
    onHide: (window, element, blessed) => {
        element.container.hide();
        element.alert.hide();
        element.hideTabs();
        Object.values(element.tabTitles).forEach((tabTitle: BlessedElement) => {
            tabTitle.hide();
        });
    },

    onDestroy: (window, element, blessed) => {
        element.container.destroy();
        element.alert.hide();
        Object.values(element.tabs).forEach((tab: BlessedElement) => {
            tab.destroy();
        });
        Object.values(element.tabTitles).forEach((tabTitle: BlessedElement) => {
            tabTitle.destroy();
        });
    },

    onShow: (window, element, blessed) => {
        element.container.show();

        if (element.selectedTab === null) element.alert.show();
        else {
            element.alert.hide();

            if (element.selectedTab.onShow !== undefined)
                element.selectedTab.onShow(
                    window,
                    element.selectedTab,
                    blessed
                );

            element.selectedTab.show();
        }

        Object.values(element.tabTitles).forEach((tabTitle: BlessedElement) => {
            tabTitle.show();
        });
    },
};
export default TabController;
