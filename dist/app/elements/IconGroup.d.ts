import { BlessedElement, BlessedElementOptions, Dictionary } from '../helpers';
export interface IconGroupElement extends BlessedElement {
    icons: BlessedElement[];
    iconTitles: Dictionary<BlessedElement>;
    selectedIcon: any;
    selectedIconTitle: any;
    iconWidth: number;
    iconHeight: number;
    iconMargin: number;
    container: BlessedElement;
    renderIconTitles?: () => void;
    addIcon?: (element: BlessedElementOptions, title: string) => void;
    removeIcon?: (title: string) => void;
}
declare const IconGroup: IconGroupElement;
export default IconGroup;
//# sourceMappingURL=IconGroup.d.ts.map