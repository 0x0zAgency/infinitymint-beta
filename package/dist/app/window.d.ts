import { Dictionary } from './helpers';
import { Rectangle, BlessedElementOptions } from './helpers';
import { BlessedElement, Blessed } from './helpers';
import InfinityConsole from './console';
import { Gem, KeyValue } from './interfaces';
import { UserEntry } from './telnet';
/**
 * @experimental
 */
export declare class InfinityMintWindow {
    /**
     *
     */
    blessed: Blessed;
    /**
     * a function which is called when the window is initialized
     */
    initialize: (window: InfinityMintWindow, element: BlessedElement, blessed: Blessed) => Promise<void>;
    /**
     * a function which is called after the window is initialized
     */
    postInitialize: (window: InfinityMintWindow, element: BlessedElement, blessed: Blessed) => Promise<void>;
    /**
     * a function which is called every console tick
     */
    think: (window: InfinityMintWindow, element: BlessedElement, blessed: Blessed) => void;
    /**
     * the name of the window
     */
    name: string;
    /**
     * the gem associated with this window
     */
    gem: Gem;
    /**
     * a dictionary of all elements. the elements inside of the dictionary are of type BlessedElement.
     */
    elements: Dictionary<BlessedElement>;
    /**
     * data which is saved to session file
     */
    options: KeyValue;
    /**
     * data which is not saved
     */
    data: KeyValue;
    /**
     * if the close button should be hidden
     */
    protected hideCloseButton: boolean;
    /**
     * if the minimize button should be hidden
     */
    protected hideMinimizeButton: boolean;
    /**
     * if the refresh button should be hidden
     */
    protected hideRefreshButton: boolean;
    /**
     * if the window should be hidden from the menu
     */
    protected hideFromMenu: boolean;
    /**
     * is this window can be refreshed
     */
    protected _canRefresh: boolean;
    /**
     * the screen this window is on
     */
    protected screen: BlessedElement;
    /**
     * the InfinityConsole this window is on
     */
    protected container?: InfinityConsole;
    /**
     * the key bindings for this window
     */
    protected inputKeys?: Dictionary<Array<Function>>;
    /**
     * the telnet permissions for this window
     */
    protected permissions: Array<string>;
    /**
     * the guid of the window
     */
    private id;
    /**
     * if the window is destroyed
     */
    private destroyed;
    /**
     * if the window should think in the background
     */
    private backgroundThink;
    /**
     * if this window should destroy the id when it is destroyed
     */
    private destroyId;
    /**
     * if this window is forced open
     */
    private forcedOpen;
    /**
     * if this window is initialized
     */
    private initialized;
    /**
     * the time this window was created
     */
    private creation;
    /**
     * the time this window was last refreshed
     */
    private initialCreation;
    /**
     * if this window should be instantiated
     */
    private _shouldInstantiate;
    /**
     * the file name of the window, the filename is in reference to the file which contains the window
     */
    private fileName;
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
    constructor(name?: string, style?: KeyValue, border?: KeyValue | string, scrollbar?: KeyValue, padding?: number | string, options?: KeyValue, data?: KeyValue);
    setBlessed(blessed: Blessed): void;
    /**
     * sets the telnet permissions for this window
     * @param permissions
     */
    setPermissions(permissions: string[]): void;
    /**
     * returns true if the telnet user can access this window
     * @param user
     * @returns
     */
    canAccess(user: UserEntry): boolean;
    /**
     * creates the UI frame for the window
     */
    createFrame(): void;
    /**
     * sets the file name of the window
     * @param fileName
     */
    setFileName(fileName?: string): void;
    /**
     * gets the file name of the window
     * @returns
     */
    getFileName(): string;
    /**
     * sets if this window should be hidden from the menu
     * @param hidden
     */
    setHiddenFromMenu(hidden: boolean): void;
    /**
     * returns true if this window is hidden from the menu
     * @returns
     */
    isHiddenFromMenu(): boolean;
    /**
     * sets if to force this window open
     * @param forcedOpen
     */
    setForcedOpen(forcedOpen: boolean): void;
    /**
     * returns true if this window is forced open
     * @returns
     */
    isForcedOpen(): boolean;
    /**
     * Will hide the close button if true, can be called when ever but be aware screen must be re-rendered in some circumstances.
     * @param hideCloseButton
     */
    setHideCloseButton(hideCloseButton: boolean): void;
    /**
     * Will hide the minimize button if true, can be called when ever but be aware screen must be re-rendered in some circumstances
     * @param hideMinimizeButton
     */
    setHideMinimizeButton(hideMinimizeButton: boolean): void;
    /**
     * generates a unique id for the window
     * @returns
     */
    private generateId;
    /**
     * sets screen this window is on
     * @param screen
     */
    setScreen(screen: BlessedElement): void;
    /**
     * sets scrollbars for the window
     * @param scrollbar
     */
    setScrollbar(scrollbar: any): void;
    /**
     * sets if the window should background think
     * @param backgroundThink
     */
    setBackgroundThink(backgroundThink: boolean): void;
    /**
     * sets if the window should instantiate instantly
     * @param instantiateInstantly
     */
    setShouldInstantiate(instantiateInstantly: boolean): void;
    /**
     * returns true if the window has a container
     * @returns
     */
    hasContainer(): boolean;
    /**
     * returns true if the window should instantiate instantly
     * @returns
     */
    shouldInstantiate(): boolean;
    /**
     * returns true if the window should background think
     * @returns
     */
    shouldBackgroundThink(): boolean;
    /**
     * sets if the window should destroy its id upon being destoryed. or have a persistant id.
     * @param shouldDestroyId
     */
    setDestroyId(shouldDestroyId: boolean): void;
    /**
     * Set the current window container / infinityconsole / terminal container for this window
     * @param container
     */
    setContainer(container: InfinityConsole): void;
    /**
     * Opens another infinity mint window, closing this one.
     * @param name
     */
    openWindow(name: string): Promise<void>;
    /**
     * gets the creation time of the window
     * @returns
     */
    getCreation(): any;
    /**
     * gets the initial creation time of the window
     * @returns
     */
    getInitialCreation(): any;
    /**
     * Will log a message to the current InfinityConsoles logger. This is because in telnet mode InfinityMint would combine all log messages together. By default, always use the log, debugLog provided to you on the various console/script classes. If you use the import for log/debug the the log will only be seen by the defaultFactory
     * @param msg
     */
    debugLog(msg: string): void;
    /**
     * A fully mutable object which can hold options which persist between InfinityMint terminal sessions. You can use this along with saveOptions to write variables to the .session file.
     *
     * See {@link app/interfaces.GlobalSessionEnvironment}
     * @param defaultOptions
     */
    loadOptions(defaultOptions?: Dictionary<any>, elementDefaultOptions?: Dictionary<KeyValue>): void;
    /**
     * saves the options to the session file
     */
    saveOptions(): void;
    /**
     * gets the current padding of the window from the data or the frame
     * @returns
     */
    getPadding(): any;
    /**
     * Returns a clone of this window
     * @param options
     * @param data
     * @returns
     */
    clone(name?: string, style?: {}, options?: {}, data?: {}): InfinityMintWindow;
    /**
     * Returns true if this window can be refreshed
     * @returns
     */
    canRefresh(): boolean;
    /**
     * Sets if this window can be refreshed
     * @param canRefresh
     */
    setCanRefresh(canRefresh: boolean): void;
    /**
     * Returns true if we have an InfinityConole set on this window
     * @returns
     */
    hasInfinityConsole(): boolean;
    /**
     * Get the infinity console this window is contained in. Through the InfinityConsole you can change the network, refresh web3 and do a lot more!
     * @returns
     */
    getInfinityConsole(): InfinityConsole;
    /**
     * sets the border of the window
     * @param border
     */
    setBorder(border: any): void;
    /**
     * gets the border of the window
     * @returns
     */
    getBorder(): any;
    /**
     * sets the width of the window. Can be a number or a number with a px or % at the end.
     * @param num
     */
    setWidth(num: number | string): void;
    /**
     * set the padding of the window. Can be a number or a number with a px or % at the end.
     * @param num
     */
    setPadding(num: number | string): void;
    /**
     * gets the guuid of the window
     * @returns
     */
    getId(): string;
    /**
     * is equal to another window, checks the guuid.
     * @param thatWindow
     * @returns
     */
    isEqual(thatWindow: InfinityMintWindow): boolean;
    /**
     * returns the windows guuid
     * @returns
     */
    toString(): any;
    /**
     * returns the frame of the window
     * @returns
     */
    getFrame(): BlessedElement;
    /**
     * sets the height of the window. Can be a number or a number with a px or % at the end.
     * @param num
     */
    setHeight(num: number | string): void;
    /**
     * gets a bounding box of the window to be used for collision detection.
     * @returns
     */
    getRectangle(): Rectangle;
    /**
     * gets the style of the window
     * @returns
     */
    getStyle(): object;
    /**
     * sets the style of the window
     * @param style
     */
    setStyle(style: any): void;
    /**
     * gets the width of the window. Might be a number or a number with a px or % at the end.
     * @returns
     */
    getWidth(): number | string;
    /**
     * gets the calculated width of a window. Unlike getWidth will always return a number.
     * @returns
     */
    getCalculatedWidth(): number;
    /**
     * gets the calculated height of a window. Unlike getHeight will always return a number.
     * @returns
     */
    getCalculatedHeight(): number;
    /**
     * gets the height of the window. Might be a number or a number with a px or % at the end.
     * @returns
     */
    getHeight(): number | string;
    /**
     * gets the calculated x (left) position of the window. Unlike getX will always return a number.
     * @returns
     */
    getCalculatedX(): number;
    /**
     * gets the calculated y (top) position of the window. Unlike getY will always return a number.
     * @returns
     */
    getCalculatedY(): number;
    /**
     * returns the x (left) position of the window. Might be a number or a number with a px or % at the end.
     * @returns
     */
    getX(): number | string;
    setGem(gem: Gem): void;
    getGem(): Gem;
    isGem(): boolean;
    /**
     * returns the y (top) position of the window. Might be a number or a number with a px or % at the end.
     * @returns
     */
    getY(): number | string;
    /**
     * hides the window. Will also hide all child elements.
     */
    hide(): void;
    /**
     * shows the window. Will also show all child elements that were not hidden before the hide() function was called. Also updates the frame title.
     */
    show(): void;
    /**
     * sets both the width and height of the window. Can be a number or a number with a px or % at the end.
     * @param width
     * @param height
     */
    setSize(width: number | string, height: number | string): void;
    /**
     * logs a message to the window pipe. If the window has no pipe, it will log to the default pipe.
     * @param string
     * @param window
     * @param returnString
     * @returns
     */
    log(string?: string | string[], window?: any, returnString?: boolean): string;
    /**
     * logs a warning to the default pipe and not the window pipe.
     * @param string
     * @param window
     * @param returnString
     * @returns
     */
    warning(string?: string | string[], window?: any, returnString?: boolean): string;
    /**
     *
     * @param options
     * @param type
     * @param parent
     */
    createChildElement(options: BlessedElementOptions, type?: string, parent?: BlessedElement): any;
    /**
     * registers a new blessed element to the window. Do not use this function directly. Use the createElement function instead. Unless you know what you are doing.
     * @param key
     * @param element
     * @param dontRegister
     * @returns
     */
    registerElement(key: string, element: BlessedElement, dontRegister?: boolean): BlessedElement;
    /**
     * returns the element with the given key
     * @param key
     * @returns
     */
    getElement<T extends BlessedElement>(key: string): T;
    /**
     * returns the scrollbar option or the current scrollbar settings of the window.
     * @returns
     */
    getScrollbar(): any;
    /**
     * called every console tick. if there is a think function, it will call it.
     */
    update(): void;
    /**
     * returns the screen of the window
     * @returns
     */
    getScreen(): BlessedElement;
    /**
     * destroys the window and all its elements
     */
    destroy(): void;
    /**
     * Registers a key command to the window which then executes a function
     * @param key
     * @param cb
     */
    key(key: string, cb: Function): void;
    /**
     * Removes a key bindi fng on the window, pass it a callback of the key to only remove that one. Else will remove all keys
     * @param key
     * @param cb
     * @returns
     */
    unkey(key: string, cb?: Function): void;
    /**
     * returns true if the window has been initialized and not destroyed
     * @returns
     */
    isAlive(): boolean;
    /**
     * returns true if the window has been initialized. Unlike isAlive, this will return true even if the window has been destroyed.
     * @returns
     */
    hasInitialized(): boolean;
    /**
     * will register a listener on the window frame. See the blessed documentation for more info on the possible events.
     * @param event
     * @param listener
     * @returns
     */
    on(event: string, listener: Function): Function;
    /**
     * will remove a listener from the window frame. See the blessed documentation for more info on the possible events.
     * @param event
     * @param listener
     * @returns
     */
    off(event: string, listener?: Function): void;
    /**
     * returns true if the window is visible. Is the same as checking if the frame is hidden or not.
     * @returns
     */
    isVisible(): boolean;
    /**
     * updates the title of the window to show the current network, account, and balance of the user.
     * @returns
     */
    updateFrameTitle(): Promise<void>;
    /**
     * sets if to hide the refresh button or not. Will show or hide the button as well as set the hideRefreshButton property.
     * @param hideRefreshButton
     */
    setHideRefreshButton(hideRefreshButton?: boolean): void;
    /**
     * Creates a new blessed element and registers it to the window. If the element already exists, it will be overwritten. All elements are created with the parent set to the screen unless otherwise specified.
     * @param key
     * @param options
     * @param type
     * @returns
     */
    createElement(key: string, options: BlessedElementOptions, type?: string): BlessedElement;
    /**
     * creates the window and all of its elements.
     */
    create(): Promise<void>;
}
//# sourceMappingURL=window.d.ts.map