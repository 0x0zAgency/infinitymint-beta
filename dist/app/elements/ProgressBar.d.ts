import { InfinityMintWindow } from '../window';
import { BlessedElement, Blessed } from '../helpers';
export interface ProgressBar extends BlessedElement {
    container?: BlessedElement;
    postInitialize?: (window: InfinityMintWindow, element: ProgressBar, blessed: Blessed) => void;
    onHide?: (window: InfinityMintWindow, element: ProgressBar, blessed: Blessed) => void;
    onShow?: (window: InfinityMintWindow, element: ProgressBar, blessed: Blessed) => void;
    onDestroy?: (window: InfinityMintWindow, element: ProgressBar, blessed: Blessed) => void;
    think?: (window: InfinityMintWindow, element: ProgressBar, blessed: Blessed) => void;
    [key: string]: any;
}
declare const ProgressBar: ProgressBar;
export default ProgressBar;
//# sourceMappingURL=ProgressBar.d.ts.map