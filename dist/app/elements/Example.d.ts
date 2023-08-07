import { InfinityMintWindow } from '../window';
import { Blessed, BlessedElement } from '../helpers';
export interface Example extends BlessedElement {
    container?: BlessedElement;
    postInitialize?: (window: InfinityMintWindow, element: Example, blessed: Blessed) => void;
    onHide?: (window: InfinityMintWindow, element: Example, blessed: Blessed) => void;
    onShow?: (window: InfinityMintWindow, element: Example, blessed: Blessed) => void;
    onDestroy?: (window: InfinityMintWindow, element: Example, blessed: Blessed) => void;
    think?: (window: InfinityMintWindow, element: Example, blessed: Blessed) => void;
    [key: string]: any;
}
declare const Example: Example;
export default Example;
//# sourceMappingURL=Example.d.ts.map