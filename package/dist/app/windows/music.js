(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../helpers", "../window"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tracks = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("../helpers");
    const window_1 = require("../window");
    //tracks to play
    exports.tracks = ['contents.mp3', 'menu.mp3'].map((file) => (0, helpers_1.isInfinityMint)()
        ? '/resources/ost/' + file
        : '/node_modules/infinitymint/resources/ost/' + file);
    /**
     * We then create a new instance of the window
     */
    const Music = new window_1.InfinityMintWindow('Music', {
        fg: 'white',
        bg: 'green',
        border: {
            fg: '#f0f0f0',
        },
    }, {
        type: 'line',
    });
    /**
     * will attempt to play the next track, keeping the tunes going. Will also update the clock. This is called when a track is finished. Also updates the title of the window. If the window is destroyed, it will stop the clock. And the tunes will stop playing. If the window is destroyed, it will stop the clock. And the tunes will stop playing. Uses the window.options.currentTrack to keep track of the current track. Plays a random track from the tracks array.
     * @param currentWindow
     * @returns
     */
    const onFinished = (currentWindow) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!currentWindow.hasInfinityConsole())
            return;
        //gets the music window
        let musicWindow = currentWindow
            .getInfinityConsole()
            .getWindow('Music');
        musicWindow.options.currentTrack =
            exports.tracks[Math.floor(Math.random() * exports.tracks.length)];
        musicWindow.options.clock = 0;
        //stops any audio
        if (currentWindow.getInfinityConsole().isAudioPlaying()) {
            yield currentWindow.getInfinityConsole().stopAudio();
            if (!currentWindow.hasInfinityConsole())
                return;
        }
        //plays audio
        currentWindow
            .getInfinityConsole()
            .playAudio(musicWindow.options.currentTrack, onFinished);
        if (currentWindow.getInfinityConsole().hasCurrentWindow())
            (_a = currentWindow
                .getInfinityConsole()
                .getCurrentWindow()) === null || _a === void 0 ? void 0 : _a.updateFrameTitle();
    });
    Music.initialize = (window, frame, blessed) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (!(0, helpers_1.getConfigFile)().music)
            return;
        if (window.data.clockInterval)
            clearInterval(window.data.clockInterval);
        window.options.clock = 0;
        //key to stop audio
        window.key('m', (ch, key) => {
            window.getInfinityConsole().stopAudio();
        });
        window.data.clockInterval = setInterval(() => {
            if (!window.hasInfinityConsole())
                return;
            try {
                window.options.clock = window.options.clock + 1;
                if (window.getInfinityConsole().hasCurrentWindow())
                    window
                        .getInfinityConsole()
                        .getCurrentWindow()
                        .updateFrameTitle();
            }
            catch (error) {
                (0, helpers_1.warning)(error.message);
            }
        }, 1000);
        if (window.getInfinityConsole().isAudioPlaying()) {
            yield window.getInfinityConsole().stopAudio();
            if (!window.hasInfinityConsole())
                return;
        }
        window.options.currentTrack =
            exports.tracks[Math.floor(Math.random() * exports.tracks.length)];
        //continues playing tracks
        window
            .getInfinityConsole()
            .playAudio(window.options.currentTrack, onFinished);
        window.on('destroy', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            if (window.getInfinityConsole().isAudioPlaying())
                yield window.getInfinityConsole().stopAudio();
            clearInterval(window.data.clockInterval);
        }));
    });
    Music.setBackgroundThink(true);
    Music.setShouldInstantiate(true);
    exports.default = Music;
});
//# sourceMappingURL=music.js.map