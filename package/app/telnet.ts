import {
    InfinityMintEventEmitter,
    InfinityMintTelnetOptions,
} from './interfaces';
import { createHash } from 'node:crypto';
import fs from 'fs';
import { BlessedElement, cwd, getConfigFile } from './helpers';
import InfinityConsole from './console';
import { Dictionary } from './helpers';
import { startInfinityConsole } from './web3';
import { PipeFactory } from './pipes';

/**
 * telnet2 library is used for the telnet server. It is a fork of the original telnet library that is no longer maintained. But this is fork now is also no longer maintained. So we will need to find a new telnet library. This library is used to create a telnet server that will allow users to login and use the console. It is also used to create a telnet client that will allow the console to connect to the telnet server and send commands to it. Its pretty cool. But I kinda wish it was more maintained. But it works for now. Maybe we can find a better library in the future. I will keep looking. Until then, this is what we have. I will also add a link to the telnet2 library in the readme. I like to give credit where credit is due. So here it is. So you can find it if you want to.
 */
const telnet = require('telnet2');

/**
 * The telnet server class
 */
export class TelnetServer {
    private clients: any;
    private consoles: Dictionary<InfinityConsole>;
    private online: Dictionary<boolean>;
    private eventEmitter: InfinityMintEventEmitter;

    /**
     * The telnet server constructor. Will read the users from the users.json file and also create a new event emitter.
     */
    constructor() {
        getUsernames(true);
        this.consoles = {};
        this.clients = {};
        this.online = {};
        this.eventEmitter = new InfinityMintEventEmitter();
    }

    /**
     * logs in a user by checking their credentials and creates a new telnet session on success
     * @param username
     * @param password
     * @param sessionId
     * @returns
     */
    public login(username: string, password: string, sessionId: string) {
        console.log('Logging in ' + username + ` <${sessionId}>`);
        try {
            loginUser(
                username,
                password,
                this.clients[sessionId].remoteAddress,
                sessionId
            );
            this.online[username] = true;
            this.consoles[sessionId].setTelnetUser(usernames[username]);
            this.consoles[sessionId].setTelnetSession(sessions[sessionId]);
        } catch (error) {
            return error.message;
        }

        return true;
    }

    /**
     * destroys a telnet session and logs out the user
     * @param sessionId
     * @returns
     */
    public logout(sessionId: string) {
        if (!sessions[sessionId]) return;

        console.log('Logging out ' + sessionId);

        let session = sessions[sessionId];
        this.online[session.username] = false;
        delete sessions[sessionId];
    }

    /**
     * Returns the session of a username, or unefined if none is found
     * @param username
     * @returns
     */
    public findSession(username: string) {
        let _sessions = Object.values(sessions);
        for (let i = 0; i < _sessions.length; i++) {
            if (_sessions[i].username === username) return _sessions[i];
        }
        return undefined;
    }

    /**
     *
     * @param userId
     * @returns
     */
    public getUser(userId: number) {
        let _usernames = Object.values(usernames);
        for (let i = 0; i < _usernames.length; i++) {
            if (_usernames[i].userId === userId) return _usernames[i];
        }

        return undefined;
    }

    /**
     * returns the telnet client of a session
     * @param sessionId
     * @returns
     */
    public getClient(sessionId: string) {
        return this.clients[sessionId];
    }

    /**
     * returns the InfinityConsole of a session. See {@link app/console.InfinityConsole}.
     * @param sessionId
     * @returns
     */
    public getConsole(sessionId: string) {
        return this.consoles[sessionId];
    }

    /**
     * registers a new user. Will check if the username is already taken and if the password is strong enough. Will also create a new user in the users.json file.
     * @param username
     * @param password
     * @param sessionId
     * @returns
     */
    public register(username: string, password: string, sessionId: string) {
        let options = getTelnetOptions();
        try {
            register(
                username,
                password,
                this.clients[sessionId],
                //make the first user admin
                Object.values(username).length === 0
                    ? 'admin'
                    : options.defaultGroup || 'user'
            );
            //save the usernames file
            saveUsernames();
        } catch (error) {
            return error.message;
        }
    }

    /**
     * stats the telnet server and waits for connections. You can break the server by pressing CTRL + C.
     * @param port
     */
    async start(port?: number) {
        let options = getTelnetOptions();
        let config = getConfigFile();

        //define these events
        if (config.events)
            Object.keys(config.events).forEach((event) => {
                console.log('new event registered => ' + event);
                try {
                    this.eventEmitter.off(event, config.events[event]);
                } catch (error) {}
                this.eventEmitter.on(event, config.events[event]);
            });

        //define these events
        let telnetEvents = options.events;
        if (telnetEvents)
            Object.keys(telnetEvents).forEach((event) => {
                console.log('new telnet event registered => ' + event);
                try {
                    this.eventEmitter.off(event, telnetEvents[event]);
                } catch (error) {}
                this.eventEmitter.on(event, telnetEvents[event]);
            });

        telnet({ tty: true }, (client) => {
            console.log(`\n🚀 New Client Detected`);
            (async () => {
                let screen: BlessedElement;
                let infinityConsole: InfinityConsole;
                let sessionId: string;

                if (
                    Object.values(this.clients).length >=
                    ((config.telnet as any).maxClients || 22)
                ) {
                    if (client.writable) {
                        client.write(
                            `⚠️  Too many clients connected. The maximum is ${
                                (config.telnet as any).maxClients || 22
                            }. Please try again later.\n`
                        );
                    }
                    if (client.writable) client.destroy();
                    console.log(
                        '⚠️ Client disconnected because of too many clients. Current clients: ' +
                            Object.values(this.clients).length
                    );
                    return;
                }

                try {
                    infinityConsole = await startInfinityConsole(
                        {
                            blessed: {
                                smartCSR: true,
                                input: client,
                                output: client,
                                terminal: 'xterm-256color',
                                fullUnicode: true,
                            },
                        },
                        new PipeFactory(),
                        this
                    );
                    sessionId = infinityConsole.getSessionId();
                    this.clients[sessionId] = client;
                    this.consoles[sessionId] = infinityConsole;
                    screen = infinityConsole.getScreen();
                    infinityConsole.setTelnetClient(client);

                    client.on('term', (terminal) => {
                        screen.terminal = terminal;
                        screen.render();
                    });

                    //when its resizes
                    client.on('size', (width, height) => {
                        client.columns = width;
                        client.rows = height;
                        client.emit('resize');
                    });

                    //when the client closes
                    client.on('close', () => {
                        this.consoles[sessionId].emit(
                            'disconnected',
                            this.clients[sessionId]
                        );

                        console.log(
                            `💀 Disconnected ${
                                client.remoteAddress ||
                                client.input.remoteAddress
                            }\n`
                        );

                        try {
                            if (this.clients || this.clients[sessionId])
                                delete this.clients[sessionId];

                            if (this.consoles || this.consoles[sessionId]) {
                                this.consoles[sessionId]?.destroy();
                                delete this.consoles[sessionId];
                            }
                        } catch (error) {
                            console.log('💥 warning: ' + error.message);
                        }
                    });

                    //screen on
                    screen.on('destroy', () => {
                        if (client.writable) {
                            client.destroy();
                        }

                        console.log(
                            `⚰️ Screen Destroyed ${
                                client.remoteAddress ||
                                client.input.remoteAddress
                            }`
                        );
                    });

                    if (!hasLoggedIn(client, sessionId) && !options.anonymous)
                        this.consoles[sessionId].setCurrentWindow('Login');

                    console.log(
                        `🦊 Successful Connection ${
                            client.remoteAddress ||
                            client.output.remoteAddress ||
                            client.input.remoteAddress
                        }<${sessionId}>`
                    );

                    this.consoles[sessionId].emit(
                        'connected',
                        this.clients[sessionId]
                    );
                } catch (error) {
                    console.log(
                        `💥 error<${client.input.remoteAddress}>:\n${error.stack}`
                    );

                    if (client.writable) {
                        client.destroy();
                    }
                }
            })();
        }).listen(options.port || port || 1337);
        console.log(
            '🟢 Telnet Server Online! enter line below to connect\n\tbrew install telnet && telnet localhost ' +
                options.port ||
                port ||
                1337
        );
    }
    reload() {}
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
export const register = (
    username: string,
    password: string,
    client: any,
    group?: string
) => {
    group = group || 'default';
    if (usernames[username])
        throw new Error('username already taken: ' + username);

    let salt = createHash('md5')
        .update(btoa((Math.random() * Math.random() * Date.now()).toString()))
        .digest('hex');

    let saltedPassword = createHash('sha512')
        .update(btoa(salt + password))
        .digest('hex');

    usernames[username] = {
        username,
        salt,
        password: saltedPassword,
        client: client,
        userId: Object.keys(usernames).length,
        group,
    } as UserEntry;

    return usernames[username];
};

/**
 * saves the usernames to the temp folder
 */
export const saveUsernames = () => {
    fs.writeFileSync(cwd() + '/temp/usernames.json', JSON.stringify(usernames));
};

/**
 * returns the telnet options from the config file
 * @returns
 */
export const getTelnetOptions = () => {
    return getConfigFile().telnet as InfinityMintTelnetOptions;
};

export interface SessionEntry {
    username: string;
    sessionId: string;
    creation: number;
    remoteAddress: string;
    group: string;
}

export let sessions: Dictionary<SessionEntry> = {};

/**
 * logs in a user by checking the password and salt against the stored password. If the user is already logged in, it throws an error. If the password is incorrect, it throws an error. If the user is not found, it throws an error. If the user is found, it returns the new session entry.
 * @param username
 * @param password
 * @param remoteAddress
 * @param sessionId
 * @returns
 */
export const loginUser = (
    username: string,
    password: string,
    remoteAddress: string,
    sessionId: string
) => {
    if (sessions[sessionId]) throw new Error('session has already begun');
    if (!usernames[username]) throw new Error('bad username or password');

    let user = usernames[username];

    let hash = createHash('sha512')
        .update(user.salt + password)
        .digest('hex');

    if (hash !== user.password) throw new Error('bad username or password');

    sessions[sessionId] = {
        username,
        remoteAddress,
        sessionId,
        group: user.group,
    } as SessionEntry;

    return sessions[sessionId];
};

/**
 * reads the username list from the temp folder
 * @returns
 */
export const readUsernameList = () => {
    if (!fs.existsSync(cwd() + '/temp/usernames.json'))
        return {} as typeof usernames;

    return JSON.parse(cwd() + '/temp/username.json');
};

export let usernames: Dictionary<UserEntry>;
/**
 * will get the usernames from the temp folder if they are not already loaded else will return current value in memory. If useFresh is true, it will read the usernames from the temp folder.
 * @param useFresh
 * @returns
 */
export const getUsernames = (useFresh?: boolean) => {
    if (!usernames || useFresh) {
        usernames = readUsernameList();
    }
    return usernames;
};

/**
 * returns true if the user is logged in
 * @param client
 * @param sessionId
 * @returns
 */
export const hasLoggedIn = (client: any, sessionId: any) => {
    return getSession(client, sessionId);
};

/**
 * gets the session entry for the client and sessionId by checking the remoteAddress and sessionId. If sessionId is not passed, it will return the first client to match the remoteAddress.
 * @param client
 * @param sessionId
 * @returns
 */
export const getSession = (client: any, sessionId?: any): SessionEntry => {
    return Object.values(sessions).filter(
        (entry) =>
            client.remoteAddress === entry.remoteAddress &&
            (sessionId ? entry.sessionId === sessionId : true)
    )[0];
};
