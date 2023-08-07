(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./helpers", "./projects", "hardhat", "./telnet"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InfinityMintWindow = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("./helpers");
    const projects_1 = require("./projects");
    const hardhat_1 = tslib_1.__importStar(require("hardhat"));
    const telnet_1 = require("./telnet");
    const { v4: uuidv4 } = require('uuid');
    /**
     * @experimental
     */
    class InfinityMintWindow {
        /**
         * the constructor for the window.
         * @param name
         * @param style
         * @param border
         * @param scrollbar
         * @param padding
         * @param options
         * @param data
         */
        constructor(name, style, border, scrollbar, padding, options, data) {
            this.name = name || this.constructor.name;
            this.destroyed = false;
            this.backgroundThink = false;
            this.initialized = false;
            this.destroyId = true;
            this._shouldInstantiate = false;
            this._canRefresh = true;
            this.options = options || {};
            this.data = data || {};
            this.initialCreation = Date.now();
            this.elements = {};
            this.permissions = ['all'];
            this.data.style = style || {};
            this.data.scrollbar = scrollbar || {};
            this.data.border = border || {};
            this.data.padding = padding || 1;
            this.id = this.generateId();
            this.initialize = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.log('window initialized');
            });
        }
        setBlessed(blessed) {
            this.blessed = blessed;
        }
        /**
         * sets the telnet permissions for this window
         * @param permissions
         */
        setPermissions(permissions) {
            this.permissions = permissions;
        }
        /**
         * returns true if the telnet user can access this window
         * @param user
         * @returns
         */
        canAccess(user) {
            return (this.permissions.filter((thatPerm) => thatPerm === 'all' ||
                thatPerm.toLowerCase() === user.group.toLowerCase()).length !== 0);
        }
        /**
         * creates the UI frame for the window
         */
        createFrame() {
            if (this.elements['frame']) {
                this.elements['frame'].free();
                this.elements['frame'].destroy();
                delete this.elements['frame'];
            }
            // Create the frame which all other components go into
            this.elements['frame'] = this.registerElement('frame', this.blessed.layout({
                top: this.getX(),
                left: this.getY(),
                width: this.getWidth(),
                height: this.getHeight(),
                layout: 'grid',
                tags: true,
                parent: this.screen,
                padding: 1,
                scrollbar: this.options.scrollbar || this.data.scrollbar || {},
                border: this.options.border || this.data.border || {},
                style: this.options.style || this.data.style || {},
            }), true);
            this.screen.append(this.elements['frame']);
            this.screen.render();
            //send frame to back
            this.elements['frame'].setBack();
        }
        /**
         * sets the file name of the window
         * @param fileName
         */
        setFileName(fileName) {
            this.fileName = fileName || __filename;
        }
        /**
         * gets the file name of the window
         * @returns
         */
        getFileName() {
            return this.fileName;
        }
        /**
         * sets if this window should be hidden from the menu
         * @param hidden
         */
        setHiddenFromMenu(hidden) {
            this.hideFromMenu = hidden;
        }
        /**
         * returns true if this window is hidden from the menu
         * @returns
         */
        isHiddenFromMenu() {
            return this.hideFromMenu;
        }
        /**
         * sets if to force this window open
         * @param forcedOpen
         */
        setForcedOpen(forcedOpen) {
            this.forcedOpen = forcedOpen;
        }
        /**
         * returns true if this window is forced open
         * @returns
         */
        isForcedOpen() {
            return this.forcedOpen;
        }
        /**
         * Will hide the close button if true, can be called when ever but be aware screen must be re-rendered in some circumstances.
         * @param hideCloseButton
         */
        setHideCloseButton(hideCloseButton) {
            this.hideCloseButton = hideCloseButton;
            if (!this.elements['closeButton'] && !this.elements['hideButton'])
                return;
            if (this.hideCloseButton) {
                this.elements['closeButton'].hide();
                this.elements['hideButton'].right = 0;
            }
            else {
                this.elements['closeButton'].show();
                this.elements['hideButton'].right =
                    (0, helpers_1.calculateWidth)(this.elements['closeButton']) + 2;
            }
        }
        /**
         * Will hide the minimize button if true, can be called when ever but be aware screen must be re-rendered in some circumstances
         * @param hideMinimizeButton
         */
        setHideMinimizeButton(hideMinimizeButton) {
            this.hideMinimizeButton = hideMinimizeButton;
            if (!this.elements['hideButton'])
                return;
        }
        /**
         * generates a unique id for the window
         * @returns
         */
        generateId() {
            return uuidv4();
        }
        /**
         * sets screen this window is on
         * @param screen
         */
        setScreen(screen) {
            if (this.screen)
                this.warning(`setting screen with out window object first`);
            this.screen = screen;
        }
        /**
         * sets scrollbars for the window
         * @param scrollbar
         */
        setScrollbar(scrollbar) {
            this.data.scrollbar = scrollbar;
        }
        /**
         * sets if the window should background think
         * @param backgroundThink
         */
        setBackgroundThink(backgroundThink) {
            this.backgroundThink = backgroundThink;
        }
        /**
         * sets if the window should instantiate instantly
         * @param instantiateInstantly
         */
        setShouldInstantiate(instantiateInstantly) {
            this._shouldInstantiate = instantiateInstantly;
        }
        /**
         * returns true if the window has a container
         * @returns
         */
        hasContainer() {
            return !!this.container;
        }
        /**
         * returns true if the window should instantiate instantly
         * @returns
         */
        shouldInstantiate() {
            return this._shouldInstantiate;
        }
        /**
         * returns true if the window should background think
         * @returns
         */
        shouldBackgroundThink() {
            return this.backgroundThink;
        }
        /**
         * sets if the window should destroy its id upon being destoryed. or have a persistant id.
         * @param shouldDestroyId
         */
        setDestroyId(shouldDestroyId) {
            this.destroyId = shouldDestroyId;
        }
        /**
         * Set the current window container / infinityconsole / terminal container for this window
         * @param container
         */
        setContainer(container) {
            if (this.container)
                throw new Error('cannot set container with out destroying window first');
            this.container = container;
        }
        /**
         * Opens another infinity mint window, closing this one.
         * @param name
         */
        openWindow(name) {
            var _a;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                (_a = this.container) === null || _a === void 0 ? void 0 : _a.setCurrentWindow(name);
            });
        }
        /**
         * gets the creation time of the window
         * @returns
         */
        getCreation() {
            return this.creation;
        }
        /**
         * gets the initial creation time of the window
         * @returns
         */
        getInitialCreation() {
            return this.initialCreation;
        }
        /**
         * Will log a message to the current InfinityConsoles logger. This is because in telnet mode InfinityMint would combine all log messages together. By default, always use the log, debugLog provided to you on the various console/script classes. If you use the import for log/debug the the log will only be seen by the defaultFactory
         * @param msg
         */
        debugLog(msg) {
            if (!this.hasInfinityConsole() &&
                this.hasInfinityConsole() &&
                this.getInfinityConsole().isTelnet())
                (0, helpers_1.debugLog)(msg);
            this.getInfinityConsole().debugLog(msg);
        }
        /**
         * A fully mutable object which can hold options which persist between InfinityMint terminal sessions. You can use this along with saveOptions to write variables to the .session file.
         *
         * See {@link app/interfaces.GlobalSessionEnvironment}
         * @param defaultOptions
         */
        loadOptions(defaultOptions, elementDefaultOptions) {
            let session = (0, helpers_1.readGlobalSession)();
            let settings = session.environment['Window_' + this.name] || {};
            this.options = Object.assign(Object.assign({}, this.options), settings);
            if (settings.style)
                this.setStyle(settings.style);
            if (settings.border)
                this.setBorder(settings.border);
            if (settings.scrollbar)
                this.setScrollbar(settings.scrollbar);
            Object.keys(defaultOptions || {}).forEach((key) => {
                if (!this.options[key])
                    this.options[key] = defaultOptions[key];
            });
            this.screen.render();
            Object.keys(this.elements).forEach((key) => {
                try {
                    let element = this.elements[key];
                    element.options =
                        session.environment['Window_' + this.name + '_' + key] ||
                            {};
                    if (elementDefaultOptions[key])
                        Object.keys(elementDefaultOptions[key] || {}).forEach((elementKey) => {
                            if (!element.options[elementKey])
                                element.options[elementKey] =
                                    elementDefaultOptions[key][elementKey];
                        });
                }
                catch (error) {
                    (0, helpers_1.warning)('cannot load settings for element: ' + error.message);
                }
            });
        }
        /**
         * saves the options to the session file
         */
        saveOptions() {
            let session = (0, helpers_1.readGlobalSession)();
            if (!this.options.style && this.data.style)
                this.options.style = this.data.style;
            if (!this.options.border && this.data.border)
                this.options.border = this.data.border;
            if (!this.options.scrollbar && this.data.scrollbar)
                this.options.scrollbar = this.data.scrollbar;
            if (this.options.padding == undefined && this.data.padding)
                this.options.padding = this.data.padding;
            session.environment['Window_' + this.name] = this.options;
            Object.keys(this.elements).forEach((key) => {
                let element = this.elements[key];
                let options = Object.assign({}, (element.options || {}));
                if (options.parent)
                    delete options.parent;
                try {
                    JSON.stringify(options);
                }
                catch (error) {
                    (0, helpers_1.warning)(`cannot stringify ${element.constructor.name}: ` +
                        error.message);
                    return;
                }
                session.environment['Window_' + this.name + '_' + key] = options;
            });
            this.log('saving window options');
            (0, helpers_1.saveGlobalSessionFile)(session);
        }
        /**
         * gets the current padding of the window from the data or the frame
         * @returns
         */
        getPadding() {
            var _a, _b;
            return ((_a = this.data) === null || _a === void 0 ? void 0 : _a.padding) || ((_b = this.elements['frame']) === null || _b === void 0 ? void 0 : _b.padding);
        }
        /**
         * Returns a clone of this window
         * @param options
         * @param data
         * @returns
         */
        clone(name, style, options, data) {
            let clone = new InfinityMintWindow(name || this.name, style || this.getStyle(), this.getBorder(), this.getScrollbar(), this.getPadding(), Object.assign(Object.assign({}, this.options), (options || {})));
            clone.setBlessed(this.blessed);
            clone.initialize = this.initialize;
            clone.think = this.think;
            clone.setBackgroundThink(this.backgroundThink);
            clone.setShouldInstantiate(this._shouldInstantiate);
            clone.setHideMinimizeButton(this.hideMinimizeButton);
            clone.setHideCloseButton(this.hideCloseButton);
            clone.setHideRefreshButton(this.hideRefreshButton);
            clone.setCanRefresh(this._canRefresh);
            clone.data = Object.assign(Object.assign({}, this.data), (data || {}));
            clone.data.clone = true;
            return clone;
        }
        /**
         * Returns true if this window can be refreshed
         * @returns
         */
        canRefresh() {
            return this._canRefresh;
        }
        /**
         * Sets if this window can be refreshed
         * @param canRefresh
         */
        setCanRefresh(canRefresh) {
            this._canRefresh = canRefresh;
        }
        /**
         * Returns true if we have an InfinityConole set on this window
         * @returns
         */
        hasInfinityConsole() {
            return !!this.container;
        }
        /**
         * Get the infinity console this window is contained in. Through the InfinityConsole you can change the network, refresh web3 and do a lot more!
         * @returns
         */
        getInfinityConsole() {
            if (!this.container)
                throw new Error('no infinityconsole associated with this window');
            return this.container;
        }
        /**
         * sets the border of the window
         * @param border
         */
        setBorder(border) {
            this.options.border = border;
            this.data.border = border;
        }
        /**
         * gets the border of the window
         * @returns
         */
        getBorder() {
            var _a, _b;
            return (((_a = this.data) === null || _a === void 0 ? void 0 : _a.border) ||
                ((_b = this.options) === null || _b === void 0 ? void 0 : _b.border) ||
                this.elements['frame'].border);
        }
        /**
         * sets the width of the window. Can be a number or a number with a px or % at the end.
         * @param num
         */
        setWidth(num) {
            this.elements['frame'].width = num;
            if (this.options.style)
                this.options.style.width = num;
            if (this.data.style)
                this.data.style.width = num;
        }
        /**
         * set the padding of the window. Can be a number or a number with a px or % at the end.
         * @param num
         */
        setPadding(num) {
            this.elements['frame'].padding = num;
        }
        /**
         * gets the guuid of the window
         * @returns
         */
        getId() {
            return this.id;
        }
        /**
         * is equal to another window, checks the guuid.
         * @param thatWindow
         * @returns
         */
        isEqual(thatWindow) {
            return this.id === thatWindow.id;
        }
        /**
         * returns the windows guuid
         * @returns
         */
        toString() {
            return this.id;
        }
        /**
         * returns the frame of the window
         * @returns
         */
        getFrame() {
            return this.elements['frame'];
        }
        /**
         * sets the height of the window. Can be a number or a number with a px or % at the end.
         * @param num
         */
        setHeight(num) {
            this.elements['frame'].height = num;
            if (this.options.style)
                this.options.style.height = num;
            if (this.data.style)
                this.data.style.height = num;
        }
        /**
         * gets a bounding box of the window to be used for collision detection.
         * @returns
         */
        getRectangle() {
            return {
                startX: this.getCalculatedX(),
                endX: this.getCalculatedX() + this.getCalculatedWidth(),
                startY: this.getCalculatedY(),
                endY: this.getCalculatedY() + this.getCalculatedHeight(),
                width: this.getCalculatedWidth(),
                height: this.getCalculatedHeight(),
                z: 1,
            };
        }
        /**
         * gets the style of the window
         * @returns
         */
        getStyle() {
            var _a, _b, _c;
            return (((_a = this.options) === null || _a === void 0 ? void 0 : _a.style) ||
                ((_b = this.data) === null || _b === void 0 ? void 0 : _b.style) ||
                ((_c = this === null || this === void 0 ? void 0 : this.elements['frame']) === null || _c === void 0 ? void 0 : _c.style) ||
                {});
        }
        /**
         * sets the style of the window
         * @param style
         */
        setStyle(style) {
            this.elements['frame'].style = style;
            this.options.style = style;
            this.data.style = style;
        }
        /**
         * gets the width of the window. Might be a number or a number with a px or % at the end.
         * @returns
         */
        getWidth() {
            var _a, _b, _c, _d;
            return ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.width) || ((_d = (_c = this.data) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.width) || '100%';
        }
        /**
         * gets the calculated width of a window. Unlike getWidth will always return a number.
         * @returns
         */
        getCalculatedWidth() {
            return this.elements['frame'].cols || 0;
        }
        /**
         * gets the calculated height of a window. Unlike getHeight will always return a number.
         * @returns
         */
        getCalculatedHeight() {
            return this.elements['frame'].rows || 0;
        }
        /**
         * gets the height of the window. Might be a number or a number with a px or % at the end.
         * @returns
         */
        getHeight() {
            var _a, _b, _c, _d;
            return (((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.height) || ((_d = (_c = this.data) === null || _c === void 0 ? void 0 : _c.style) === null || _d === void 0 ? void 0 : _d.height) || '100%');
        }
        /**
         * gets the calculated x (left) position of the window. Unlike getX will always return a number.
         * @returns
         */
        getCalculatedX() {
            return this.elements['frame'].left || 0;
        }
        /**
         * gets the calculated y (top) position of the window. Unlike getY will always return a number.
         * @returns
         */
        getCalculatedY() {
            return this.elements['frame'].top || 0;
        }
        /**
         * returns the x (left) position of the window. Might be a number or a number with a px or % at the end.
         * @returns
         */
        getX() {
            var _a, _b, _c, _d;
            return ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.left) || ((_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.left) || 0;
        }
        setGem(gem) {
            this.gem = gem;
        }
        getGem() {
            return this.gem;
        }
        isGem() {
            return this.gem !== undefined;
        }
        /**
         * returns the y (top) position of the window. Might be a number or a number with a px or % at the end.
         * @returns
         */
        getY() {
            var _a, _b, _c, _d;
            return ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.top) || ((_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.top) || 0;
        }
        /**
         * hides the window. Will also hide all child elements.
         */
        hide() {
            this.log('hiding');
            Object.values(this.elements).forEach((element) => {
                if (!element.hidden) {
                    element.shouldUnhide = true;
                    element.hide();
                    if (element.onHide)
                        element.onHide(this, element, this.blessed);
                }
            });
        }
        /**
         * shows the window. Will also show all child elements that were not hidden before the hide() function was called. Also updates the frame title.
         */
        show() {
            this.log(`showing`);
            Object.values(this.elements).forEach((element) => {
                if (element.shouldUnhide) {
                    element.shouldUnhide = false;
                    element.show();
                    if (element.onShow)
                        element.onShow(this, element, this.blessed);
                }
            });
            try {
                this.updateFrameTitle();
            }
            catch (error) {
                (0, helpers_1.warning)('ciuld not update frame title:' + error.message);
            }
        }
        /**
         * sets both the width and height of the window. Can be a number or a number with a px or % at the end.
         * @param width
         * @param height
         */
        setSize(width, height) {
            this.setWidth(width);
            this.setHeight(height);
        }
        /**
         * logs a message to the window pipe. If the window has no pipe, it will log to the default pipe.
         * @param string
         * @param window
         * @param returnString
         * @returns
         */
        log(string, window, returnString) {
            window = window || this;
            if (typeof string === typeof Array)
                string = string.join(' ');
            if (returnString)
                return string + ` => <${window.name}>[${window.getId()}]`;
            if (!this.hasInfinityConsole())
                (0, helpers_1.log)(string + ` => <${window.name}>[${window.getId()}]`, 'windows');
            else
                this.getInfinityConsole().log(string + ` => <${window.name}>[${window.getId()}]`, 'windows');
        }
        /**
         * logs a warning to the default pipe and not the window pipe.
         * @param string
         * @param window
         * @param returnString
         * @returns
         */
        warning(string, window, returnString) {
            window = window || this;
            if (typeof string === typeof Array)
                string = string.join(' ');
            if (returnString)
                return string + ` => <${window.name}>[${window.getId()}]`;
            (0, helpers_1.warning)(string + ` => <${window.name}>[${window.getId()}]`);
        }
        /**
         *
         * @param options
         * @param type
         * @param parent
         */
        createChildElement(options, type, parent) {
            type = type || 'box';
            if (!options.parent && parent)
                options.parent = parent;
            if (options.parent) {
                if (options.top === undefined)
                    options.top = parent.top;
                if (options.left === undefined)
                    options.left = parent.left;
                if (options.right === undefined)
                    options.right = parent.right;
            }
            let element = this.blessed[type](options);
            if (element.initialize)
                element.initialize(this, element, this.blessed);
            element.window = this;
            //does the same a above
            element.oldOn = element.on;
            element.on = (param1, cb) => {
                if (typeof cb === typeof Promise)
                    element.oldOn(param1, (...any) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            yield cb(...any);
                        }
                        catch (error) {
                            this.getInfinityConsole().errorHandler(error);
                        }
                    }));
                else
                    element.oldOn(param1, (...any) => {
                        try {
                            cb(...any);
                        }
                        catch (error) {
                            this.getInfinityConsole().errorHandler(error);
                        }
                    });
            };
            if (element === null || element === void 0 ? void 0 : element.options.parent)
                delete element.options.parent;
            if (element.focus)
                element === null || element === void 0 ? void 0 : element.focus();
            if (options.alwaysFront)
                element.alwaysFront = options.alwaysFront;
            if (options.alwaysBack)
                element.alwaysBack = options.alwaysBack;
            if (options.alwaysUpdate)
                element.alwaysUpdate = options.alwaysUpdate;
            if (options.think)
                element.think = options.think;
            if (options.alwaysFocus)
                element.alwaysFocus = options.alwaysFront;
            if (element.initialize)
                element.initialize(this, element, this.blessed);
            if (options.dontAutoCreate !== true) {
                this.screen.append(element);
                this.screen.render();
                if (element.postInitialize)
                    element.postInitialize(this, element, this.blessed);
            }
            return element;
        }
        /**
         * registers a new blessed element to the window. Do not use this function directly. Use the createElement function instead. Unless you know what you are doing.
         * @param key
         * @param element
         * @param dontRegister
         * @returns
         */
        registerElement(key, element, dontRegister) {
            if (this.elements[key])
                throw new Error('key already registered in window: ' + key);
            if (element.window)
                throw new Error(this.log('element (' +
                    element.constructor.name +
                    ') is already registered to ', null, true));
            if (this.elements['frame'] && !element.parent)
                element.parent = this.elements['frame'];
            this.log(`registering element [${element.type}](` +
                element.constructor.name +
                ')');
            element.window = this;
            //does the same a above
            element.oldOn = element.on;
            element.on = (param1, cb) => {
                if (typeof cb === typeof Promise)
                    this.elements[key].oldOn(param1, (...any) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            yield cb(...any);
                        }
                        catch (error) {
                            this.getInfinityConsole().errorHandler(error);
                        }
                    }));
                else
                    this.elements[key].oldOn(param1, (...any) => {
                        try {
                            cb(...any);
                        }
                        catch (error) {
                            this.getInfinityConsole().errorHandler(error);
                        }
                    });
            };
            if (element.focus)
                element === null || element === void 0 ? void 0 : element.focus();
            if (dontRegister)
                return element;
            this.elements[key] = element;
            return this.elements[key];
        }
        /**
         * returns the element with the given key
         * @param key
         * @returns
         */
        getElement(key) {
            return this.elements[key];
        }
        /**
         * returns the scrollbar option or the current scrollbar settings of the window.
         * @returns
         */
        getScrollbar() {
            return this.data.scrollbar || this.options.scrollbar || true;
        }
        /**
         * called every console tick. if there is a think function, it will call it.
         */
        update() {
            if (this.think) {
                this.think(this, this.getElement('frame'), this.blessed);
            }
        }
        /**
         * returns the screen of the window
         * @returns
         */
        getScreen() {
            return this.screen;
        }
        /**
         * destroys the window and all its elements
         */
        destroy() {
            this.log('destroying');
            this.destroyed = true;
            this.initialized = false;
            //save options on destroy
            this.saveOptions();
            //unkeys everything to do with the window
            if (this.inputKeys)
                Object.keys(this.inputKeys).forEach((key) => {
                    Object.values(this.inputKeys[key]).forEach((cb) => {
                        this.unkey(key, cb);
                    });
                });
            Object.keys(this.elements).forEach((index) => {
                this.log('destroying element (' +
                    this.elements[index].constructor.name +
                    ')');
                try {
                    if (this.elements[index].onDestroy)
                        this.elements[index].onDestroy(this, this.elements[index], this.blessed);
                    this.elements[index].free(); //unsubscribes to events saving memory
                    this.elements[index].destroy();
                }
                catch (error) { }
                delete this.elements[index];
            });
            this.container = undefined;
            this.screen = undefined;
            this.elements = {};
            //keep settings for this window saved
            this.options.style = this.data.style;
            this.options.scrollbar = this.data.scrollbar;
            this.options.padding = this.data.padding;
            this.options.border = this.data.border;
            //clear data
            this.data = {};
        }
        /**
         * Registers a key command to the window which then executes a function
         * @param key
         * @param cb
         */
        key(key, cb) {
            if (!this.inputKeys)
                this.inputKeys = {};
            this.getInfinityConsole().key(key, cb);
            if (!this.inputKeys[key])
                this.inputKeys[key] = [];
            this.inputKeys[key].push(cb);
        }
        /**
         * Removes a key bindi fng on the window, pass it a callback of the key to only remove that one. Else will remove all keys
         * @param key
         * @param cb
         * @returns
         */
        unkey(key, cb) {
            if (!this.inputKeys || !this.inputKeys[key])
                return;
            if (cb)
                this.getInfinityConsole().unkey(key, cb);
            else {
                //unmap all keys
                Object.values(this.inputKeys[key]).forEach((cb) => {
                    this.getInfinityConsole().unkey(key, cb);
                });
                this.inputKeys[key] = [];
                return;
            }
            if (this.inputKeys[key].length <= 1)
                this.inputKeys[key] = [];
            else {
                this.inputKeys[key] = this.inputKeys[key].filter((thatCb) => thatCb.toString() === cb.toString());
            }
        }
        /**
         * returns true if the window has been initialized and not destroyed
         * @returns
         */
        isAlive() {
            return this.initialized && !this.destroyed;
        }
        /**
         * returns true if the window has been initialized. Unlike isAlive, this will return true even if the window has been destroyed.
         * @returns
         */
        hasInitialized() {
            return this.initialized;
        }
        /**
         * will register a listener on the window frame. See the blessed documentation for more info on the possible events.
         * @param event
         * @param listener
         * @returns
         */
        on(event, listener) {
            if (!this.getElement('frame'))
                throw new Error('frame has not been created');
            return this.getElement('frame').on(event, listener);
        }
        /**
         * will remove a listener from the window frame. See the blessed documentation for more info on the possible events.
         * @param event
         * @param listener
         * @returns
         */
        off(event, listener) {
            if (!this.getElement('frame'))
                return;
            this.getElement('frame').off(event, listener);
        }
        /**
         * returns true if the window is visible. Is the same as checking if the frame is hidden or not.
         * @returns
         */
        isVisible() {
            var _a;
            return ((_a = this.getElement('frame')) === null || _a === void 0 ? void 0 : _a.hidden) === false;
        }
        /**
         * updates the title of the window to show the current network, account, and balance of the user.
         * @returns
         */
        updateFrameTitle() {
            var _a;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!this.hasInfinityConsole())
                    return;
                if (this.getInfinityConsole().isTelnet()) {
                    let telnetConfig = (0, telnet_1.getTelnetOptions)();
                    if (telnetConfig.hideFrameTitle) {
                        this.elements['frame'].setContent('');
                        return;
                    }
                    if (telnetConfig.frameTitle) {
                        if (typeof telnetConfig.frameTitle === 'string')
                            this.elements['frame'].setContent(telnetConfig.frameTitle);
                        else
                            this.elements['frame'].setContent(yield telnetConfig.frameTitle(this));
                        return;
                    }
                }
                let account = this.getInfinityConsole().getCurrentAccount();
                let balance = this.getInfinityConsole().getCurrentBalance();
                let etherBalance = hardhat_1.ethers.utils.formatEther(balance || 0);
                let musicOptions = this.getInfinityConsole().hasWindowName('Music')
                    ? this.getInfinityConsole().getWindow('Music').options
                    : {
                        currentTrack: 'nothing',
                    };
                let seconds = musicOptions.clock || 0;
                let minutes = seconds <= 0 ? 0 : Math.floor(musicOptions.clock / 60);
                this.elements['frame'].setContent(`{bold}${this.name}{/bold} {magenta-fg}=>{/magenta-fg} {yellow-fg}${hardhat_1.default.network.name}[${this.getInfinityConsole().getCurrentChainId()}] {underline}${account === null || account === void 0 ? void 0 : account.address.substring(0, 16)}...{/underline}{/yellow-fg} {black-bg}{white-fg}${((_a = (0, projects_1.getCurrentProjectPath)()) === null || _a === void 0 ? void 0 : _a.base) ||
                    '{red-fg}NO CURRENT PROJECT{red-fg}'}{/white-fg}{/black-bg} {white-fg}{bold}${etherBalance.substring(0, 8)} ETH ($${(parseFloat(etherBalance) * 2222).toFixed(2)}){/bold}{/white-fg} {black-bg}{red-fg}{bold}150.2 gwei{/bold}{/red-fg}{/black-bg} {black-bg}{yellow-fg}{bold}120.2 gwei{/bold}{/yellow-fg}{/black-bg} {black-bg}{green-fg}{bold}110.2 gwei{/bold}{/green-fg}{/black-bg} {bold}{cyan-fg}♫{/cyan-fg}{/bold} {underline}{cyan-fg}${!(0, helpers_1.getConfigFile)().music
                    ? 'music disabled'
                    : musicOptions.currentTrack}{/cyan-fg}{/underline} {black-bg}{white-fg}${(minutes % 60)
                    .toString()
                    .padStart(2, '0')}:${(seconds % 60)
                    .toString()
                    .padStart(2, '0')}{/white-fg}{/black-bg}`);
            });
        }
        /**
         * sets if to hide the refresh button or not. Will show or hide the button as well as set the hideRefreshButton property.
         * @param hideRefreshButton
         */
        setHideRefreshButton(hideRefreshButton) {
            this.hideRefreshButton = hideRefreshButton;
            if (this.elements['refreshButton']) {
                if (this.hideRefreshButton || !this.canRefresh)
                    this.elements['refreshButton'].hide();
                else {
                    this.elements['refreshButton'].show();
                }
            }
        }
        /**
         * Creates a new blessed element and registers it to the window. If the element already exists, it will be overwritten. All elements are created with the parent set to the screen unless otherwise specified.
         * @param key
         * @param options
         * @param type
         * @returns
         */
        createElement(key, options, type) {
            type = type || 'box';
            if (!options.parent)
                options.parent = this.screen;
            if (!this.blessed[type] || typeof this.blessed[type] !== 'function')
                throw new Error('bad blessed element: ' + type);
            let element = this.registerElement(key, this.blessed[type](options));
            if (element === null || element === void 0 ? void 0 : element.options.parent)
                delete element.options.parent;
            if (options.alwaysFront)
                element.alwaysFront = options.alwaysFront;
            if (options.alwaysBack)
                element.alwaysBack = options.alwaysBack;
            if (options.alwaysUpdate)
                element.alwaysUpdate = options.alwaysUpdate;
            if (options.think)
                element.think = options.think;
            if (options.alwaysFocus)
                element.alwaysFocus = options.alwaysFront;
            if (options.instantlyCreate || options.instantlyAppend) {
                if (element.initialize)
                    element.initialize(this, element, this.blessed);
                this.screen.append(element);
                this.screen.render();
                if (element.postInitialize)
                    element.postInitialize(this, element, this.blessed);
            }
            if (options.mouse || options.keys)
                element.enableInput();
            this.elements[key] = element;
            return element;
        }
        /**
         * creates the window and all of its elements.
         */
        create() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (this.initialized && this.destroyed === false)
                    throw new Error('already initialized');
                if (!this.screen)
                    throw new Error('cannot create window with undefined screen');
                if (this.initialized && this.destroyed && this.destroyId) {
                    let oldId = this.id;
                    this.id = this.generateId();
                    this.debugLog(`old id <${this.name}>[${oldId}] destroyed`);
                }
                this.destroyed = false;
                this.creation = Date.now();
                this.log('calling initialize');
                try {
                    //update the title and frame
                    this.elements['frame'].setFront();
                    yield this.initialize(this, this.elements['frame'], this.blessed);
                    this.initialized = true;
                }
                catch (error) {
                    this.getInfinityConsole().errorHandler(error);
                }
                //append each element
                yield Promise.all(Object.keys(this.elements).map((key) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    let element = this.elements[key];
                    try {
                        if (key !== 'frame' &&
                            !element.instantlyAppend &&
                            !element.instantlyCreate) {
                            if (element.initialize)
                                yield element.initialize(this, element, this.blessed);
                            this.screen.append(element);
                            this.screen.render();
                            if (element.postInitialize)
                                yield element.postInitialize(this, element, this.blessed);
                        }
                        if (element.shouldFocus)
                            element.focus();
                        if (element.alwaysBack)
                            element.setBack();
                        if (element.alwaysFront)
                            element.setFront();
                    }
                    catch (error) {
                        (0, helpers_1.warning)(error.message);
                    }
                })));
                //frame title
                yield this.updateFrameTitle();
                let closeButton = this.createElement('closeButton', {
                    top: -1,
                    right: 2,
                    width: 3,
                    height: 3,
                    shouldFocus: true,
                    tags: true,
                    padding: 0,
                    alwaysFront: true,
                    content: ' ',
                    border: 'line',
                    style: {
                        bg: 'red',
                        fg: 'white',
                        hover: {
                            bg: 'grey',
                        },
                    },
                });
                closeButton.on('click', () => {
                    this.getInfinityConsole().destroyWindow(this);
                });
                let hideButton = this.createElement('hideButton', {
                    top: -1,
                    right: this.hideCloseButton
                        ? 2
                        : (0, helpers_1.calculateWidth)(this.elements['closeButton']) + 2,
                    width: 3,
                    height: 3,
                    alwaysFront: true,
                    shouldFocus: true,
                    tags: true,
                    padding: 0,
                    instantlyAppend: true,
                    content: ' ',
                    border: 'line',
                    style: {
                        bg: 'yellow',
                        fg: 'white',
                        hover: {
                            bg: 'grey',
                        },
                    },
                });
                hideButton.on('click', () => {
                    this.hide();
                });
                let refreshButton = this.createElement('refreshButton', {
                    top: -1,
                    right: this.hideCloseButton
                        ? (0, helpers_1.calculateWidth)(this.elements['hideButton']) + 2
                        : (0, helpers_1.calculateWidth)(this.elements['hideButton'], this.elements['closeButton']) + 2,
                    width: 3,
                    height: 3,
                    alwaysFront: true,
                    shouldFocus: true,
                    instantlyAppend: true,
                    tags: true,
                    padding: 0,
                    content: ' ',
                    border: 'line',
                    style: {
                        bg: 'blue',
                        fg: 'white',
                        hover: {
                            bg: 'grey',
                        },
                    },
                });
                refreshButton.on('click', () => {
                    this.getInfinityConsole().reloadWindow(this);
                });
                if (this.hideCloseButton)
                    this.elements['closeButton'].hide();
                if (this.hideMinimizeButton)
                    this.elements['hideButton'].hide();
                if (this.hideRefreshButton || !this.canRefresh)
                    this.elements['refreshButton'].hide();
                this.elements['hideButton'].setFront();
                this.elements['closeButton'].setFront();
                //run post initialize
                if (this.postInitialize) {
                    this.log('calling post initialize');
                    yield this.postInitialize(this, this.elements['frame'], this.blessed);
                }
            });
        }
    }
    exports.InfinityMintWindow = InfinityMintWindow;
});
//# sourceMappingURL=window.js.map