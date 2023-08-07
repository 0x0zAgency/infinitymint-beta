import { Blessed, BlessedElement } from '../helpers';
import { InfinityMintWindow } from '../window';
/**
 * This is the interface for the music window
 */
export interface MusicWindow extends InfinityMintWindow {
    options: {
        clock: number;
        currentTrack: string;
    };
    initialize: (window: MusicWindow, frame: BlessedElement, blessed: Blessed) => Promise<void>;
}
export declare const tracks: string[];
/**
 * We then create a new instance of the window
 */
declare const Music: MusicWindow;
export default Music;
//# sourceMappingURL=music.d.ts.map