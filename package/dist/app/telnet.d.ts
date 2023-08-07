import { InfinityMintTelnetOptions } from './interfaces';
import InfinityConsole from './console';
import { Dictionary } from './helpers';
/**
 * The telnet server class
 */
export declare class TelnetServer {
    private clients;
    private consoles;
    private online;
    private eventEmitter;
    /**
     * The telnet server constructor. Will read the users from the users.json file and also create a new event emitter.
     */
    constructor();
    /**
     * logs in a user by checking their credentials and creates a new telnet session on success
     * @param username
     * @param password
     * @param sessionId
     * @returns
     */
    login(username: string, password: string, sessionId: string): any;
    /**
     * destroys a telnet session and logs out the user
     * @param sessionId
     * @returns
     */
    logout(sessionId: string): void;
    /**
     * Returns the session of a username, or unefined if none is found
     * @param username
     * @returns
     */
    findSession(username: string): SessionEntry;
    /**
     *
     * @param userId
     * @returns
     */
    getUser(userId: number): UserEntry;
    /**
     * returns the telnet client of a session
     * @param sessionId
     * @returns
     */
    getClient(sessionId: string): any;
    /**
     * returns the InfinityConsole of a session. See {@link app/console.InfinityConsole}.
     * @param sessionId
     * @returns
     */
    getConsole(sessionId: string): InfinityConsole;
    /**
     * registers a new user. Will check if the username is already taken and if the password is strong enough. Will also create a new user in the users.json file.
     * @param username
     * @param password
     * @param sessionId
     * @returns
     */
    register(username: string, password: string, sessionId: string): any;
    /**
     * stats the telnet server and waits for connections. You can break the server by pressing CTRL + C.
     * @param port
     */
    start(port?: number): Promise<void>;
    reload(): void;
}
export interface UserEntry {
    username: string;
    password: string;
    salt: string;
    client: any;
    userId: number;
    group: string;
}
/**
 * a method to register a new user by creating an md5 salt and a sha512 password from the password parameter. Can be passed a group to assign the user to. The client is the telnet client object.
 * @param username
 * @param password
 * @param client
 * @param group
 * @returns
 */
export declare const register: (username: string, password: string, client: any, group?: string) => UserEntry;
/**
 * saves the usernames to the temp folder
 */
export declare const saveUsernames: () => void;
/**
 * returns the telnet options from the config file
 * @returns
 */
export declare const getTelnetOptions: () => InfinityMintTelnetOptions;
export interface SessionEntry {
    username: string;
    sessionId: string;
    creation: number;
    remoteAddress: string;
    group: string;
}
export declare let sessions: Dictionary<SessionEntry>;
/**
 * logs in a user by checking the password and salt against the stored password. If the user is already logged in, it throws an error. If the password is incorrect, it throws an error. If the user is not found, it throws an error. If the user is found, it returns the new session entry.
 * @param username
 * @param password
 * @param remoteAddress
 * @param sessionId
 * @returns
 */
export declare const loginUser: (username: string, password: string, remoteAddress: string, sessionId: string) => SessionEntry;
/**
 * reads the username list from the temp folder
 * @returns
 */
export declare const readUsernameList: () => any;
export declare let usernames: Dictionary<UserEntry>;
/**
 * will get the usernames from the temp folder if they are not already loaded else will return current value in memory. If useFresh is true, it will read the usernames from the temp folder.
 * @param useFresh
 * @returns
 */
export declare const getUsernames: (useFresh?: boolean) => Dictionary<UserEntry>;
/**
 * returns true if the user is logged in
 * @param client
 * @param sessionId
 * @returns
 */
export declare const hasLoggedIn: (client: any, sessionId: any) => SessionEntry;
/**
 * gets the session entry for the client and sessionId by checking the remoteAddress and sessionId. If sessionId is not passed, it will return the first client to match the remoteAddress.
 * @param client
 * @param sessionId
 * @returns
 */
export declare const getSession: (client: any, sessionId?: any) => SessionEntry;
//# sourceMappingURL=telnet.d.ts.map