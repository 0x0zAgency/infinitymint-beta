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
    postInitialize?: (window: InfinityMintWindow, element: TabController, blessed: Blessed) => void;
    onHide?: (window: InfinityMintWindow, element: TabController, blessed: Blessed) => void;
    onShow?: (window: InfinityMintWindow, element: TabController, blessed: Blessed) => void;
    onDestroy?: (window: InfinityMintWindow, element: TabController, blessed: Blessed) => void;
    think?: (window: InfinityMintWindow, element: TabController, blessed: Blessed) => void;
    [key: string]: any;
}
declare const TabController: TabController;
export default TabController;
//# sourceMappingURL=TabController.d.ts.map