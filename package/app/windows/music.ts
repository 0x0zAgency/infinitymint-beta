import {
    Blessed,
    BlessedElement,
    getConfigFile,
    isInfinityMint,
    warning,
} from '../helpers';
import { InfinityMintWindow } from '../window';

/**
 * This is the interface for the music window
 */
export interface MusicWindow extends InfinityMintWindow {
    options: {
        clock: number;
        currentTrack: string;
    };
    initialize: (
        window: MusicWindow,
        frame: BlessedElement,
        blessed: Blessed
    ) => Promise<void>;
}

//tracks to play
export const tracks = ['contents.mp3', 'menu.mp3'].map((file) =>
    isInfinityMint()
        ? '/resources/ost/' + file
        : '/node_modules/infinitymint/resources/ost/' + file
);

/**
 * We then create a new instance of the window
 */
const Music = new InfinityMintWindow(
    'Music',
    {
        fg: 'white',
        bg: 'green',
        border: {
            fg: '#f0f0f0',
        },
    },
    {
        type: 'line',
    }
) as MusicWindow;

/**
 * will attempt to play the next track, keeping the tunes going. Will also update the clock. This is called when a track is finished. Also updates the title of the window. If the window is destroyed, it will stop the clock. And the tunes will stop playing. If the window is destroyed, it will stop the clock. And the tunes will stop playing. Uses the window.options.currentTrack to keep track of the current track. Plays a random track from the tracks array.
 * @param currentWindow
 * @returns
 */
const onFinished = async (currentWindow: InfinityMintWindow) => {
    if (!currentWindow.hasInfinityConsole()) return;
    //gets the music window
    let musicWindow = currentWindow
        .getInfinityConsole()
        .getWindow<MusicWindow>('Music');
    musicWindow.options.currentTrack =
        tracks[Math.floor(Math.random() * tracks.length)];
    musicWindow.options.clock = 0;

    //stops any audio
    if (currentWindow.getInfinityConsole().isAudioPlaying()) {
        await currentWindow.getInfinityConsole().stopAudio();
        if (!currentWindow.hasInfinityConsole()) return;
    }
    //plays audio
    currentWindow
        .getInfinityConsole()
        .playAudio(musicWindow.options.currentTrack, onFinished);

    if (currentWindow.getInfinityConsole().hasCurrentWindow())
        currentWindow
            .getInfinityConsole()
            .getCurrentWindow()
            ?.updateFrameTitle();
};

Music.initialize = async (window, frame, blessed) => {
    if (!getConfigFile().music) return;

    if (window.data.clockInterval) clearInterval(window.data.clockInterval);
    window.options.clock = 0;

    //key to stop audio
    window.key('m', (ch: string, key: string) => {
        window.getInfinityConsole().stopAudio();
    });

    window.data.clockInterval = setInterval(() => {
        if (!window.hasInfinityConsole()) return;

        try {
            window.options.clock = window.options.clock + 1;

            if (window.getInfinityConsole().hasCurrentWindow())
                window
                    .getInfinityConsole()
                    .getCurrentWindow()
                    .updateFrameTitle();
        } catch (error) {
            warning(error.message);
        }
    }, 1000);

    if (window.getInfinityConsole().isAudioPlaying()) {
        await window.getInfinityConsole().stopAudio();
        if (!window.hasInfinityConsole()) return;
    }

    window.options.currentTrack =
        tracks[Math.floor(Math.random() * tracks.length)];

    //continues playing tracks
    window
        .getInfinityConsole()
        .playAudio(window.options.currentTrack, onFinished);
    window.on('destroy', async () => {
        if (window.getInfinityConsole().isAudioPlaying())
            await window.getInfinityConsole().stopAudio();

        clearInterval(window.data.clockInterval);
    });
};
Music.setBackgroundThink(true);
Music.setShouldInstantiate(true);

export default Music;
