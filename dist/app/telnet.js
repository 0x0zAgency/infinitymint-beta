(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./interfaces", "node:crypto", "fs", "./helpers", "./web3", "./pipes"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSession = exports.hasLoggedIn = exports.getUsernames = exports.usernames = exports.readUsernameList = exports.loginUser = exports.sessions = exports.getTelnetOptions = exports.saveUsernames = exports.register = exports.TelnetServer = void 0;
    const tslib_1 = require("tslib");
    const interfaces_1 = require("./interfaces");
    const node_crypto_1 = require("node:crypto");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const helpers_1 = require("./helpers");
    const web3_1 = require("./web3");
    const pipes_1 = require("./pipes");
    /**
     * telnet2 library is used for the telnet server. It is a fork of the original telnet library that is no longer maintained. But this is fork now is also no longer maintained. So we will need to find a new telnet library. This library is used to create a telnet server that will allow users to login and use the console. It is also used to create a telnet client that will allow the console to connect to the telnet server and send commands to it. Its pretty cool. But I kinda wish it was more maintained. But it works for now. Maybe we can find a better library in the future. I will keep looking. Until then, this is what we have. I will also add a link to the telnet2 library in the readme. I like to give credit where credit is due. So here it is. So you can find it if you want to.
     */
    const telnet = require('telnet2');
    /**
     * The telnet server class
     */
    class TelnetServer {
        /**
         * The telnet server constructor. Will read the users from the users.json file and also create a new event emitter.
         */
        constructor() {
            (0, exports.getUsernames)(true);
            this.consoles = {};
            this.clients = {};
            this.online = {};
            this.eventEmitter = new interfaces_1.InfinityMintEventEmitter();
        }
        /**
         * logs in a user by checking their credentials and creates a new telnet session on success
         * @param username
         * @param password
         * @param sessionId
         * @returns
         */
        login(username, password, sessionId) {
            console.log('Logging in ' + username + ` <${sessionId}>`);
            try {
                (0, exports.loginUser)(username, password, this.clients[sessionId].remoteAddress, sessionId);
                this.online[username] = true;
                this.consoles[sessionId].setTelnetUser(exports.usernames[username]);
                this.consoles[sessionId].setTelnetSession(exports.sessions[sessionId]);
            }
            catch (error) {
                return error.message;
            }
            return true;
        }
        /**
         * destroys a telnet session and logs out the user
         * @param sessionId
         * @returns
         */
        logout(sessionId) {
            if (!exports.sessions[sessionId])
                return;
            console.log('Logging out ' + sessionId);
            let session = exports.sessions[sessionId];
            this.online[session.username] = false;
            delete exports.sessions[sessionId];
        }
        /**
         * Returns the session of a username, or unefined if none is found
         * @param username
         * @returns
         */
        findSession(username) {
            let _sessions = Object.values(exports.sessions);
            for (let i = 0; i < _sessions.length; i++) {
                if (_sessions[i].username === username)
                    return _sessions[i];
            }
            return undefined;
        }
        /**
         *
         * @param userId
         * @returns
         */
        getUser(userId) {
            let _usernames = Object.values(exports.usernames);
            for (let i = 0; i < _usernames.length; i++) {
                if (_usernames[i].userId === userId)
                    return _usernames[i];
            }
            return undefined;
        }
        /**
         * returns the telnet client of a session
         * @param sessionId
         * @returns
         */
        getClient(sessionId) {
            return this.clients[sessionId];
        }
        /**
         * returns the InfinityConsole of a session. See {@link app/console.InfinityConsole}.
         * @param sessionId
         * @returns
         */
        getConsole(sessionId) {
            return this.consoles[sessionId];
        }
        /**
         * registers a new user. Will check if the username is already taken and if the password is strong enough. Will also create a new user in the users.json file.
         * @param username
         * @param password
         * @param sessionId
         * @returns
         */
        register(username, password, sessionId) {
            let options = (0, exports.getTelnetOptions)();
            try {
                (0, exports.register)(username, password, this.clients[sessionId], 
                //make the first user admin
                Object.values(username).length === 0
                    ? 'admin'
                    : options.defaultGroup || 'user');
                //save the usernames file
                (0, exports.saveUsernames)();
            }
            catch (error) {
                return error.message;
            }
        }
        /**
         * stats the telnet server and waits for connections. You can break the server by pressing CTRL + C.
         * @param port
         */
        start(port) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let options = (0, exports.getTelnetOptions)();
                let config = (0, helpers_1.getConfigFile)();
                //define these events
                if (config.events)
                    Object.keys(config.events).forEach((event) => {
                        console.log('new event registered => ' + event);
                        try {
                            this.eventEmitter.off(event, config.events[event]);
                        }
                        catch (error) { }
                        this.eventEmitter.on(event, config.events[event]);
                    });
                //define these events
                let telnetEvents = options.events;
                if (telnetEvents)
                    Object.keys(telnetEvents).forEach((event) => {
                        console.log('new telnet event registered => ' + event);
                        try {
                            this.eventEmitter.off(event, telnetEvents[event]);
                        }
                        catch (error) { }
                        this.eventEmitter.on(event, telnetEvents[event]);
                    });
                telnet({ tty: true }, (client) => {
                    console.log(`\n🚀 New Client Detected`);
                    (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        let screen;
                        let infinityConsole;
                        let sessionId;
                        if (Object.values(this.clients).length >=
                            (config.telnet.maxClients || 22)) {
                            if (client.writable) {
                                client.write(`⚠️  Too many clients connected. The maximum is ${config.telnet.maxClients || 22}. Please try again later.\n`);
                            }
                            if (client.writable)
                                client.destroy();
                            console.log('⚠️ Client disconnected because of too many clients. Current clients: ' +
                                Object.values(this.clients).length);
                            return;
                        }
                        try {
                            infinityConsole = yield (0, web3_1.startInfinityConsole)({
                                blessed: {
                                    smartCSR: true,
                                    input: client,
                                    output: client,
                                    terminal: 'xterm-256color',
                                    fullUnicode: true,
                                },
                            }, new pipes_1.PipeFactory(), this);
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
                                var _a;
                                this.consoles[sessionId].emit('disconnected', this.clients[sessionId]);
                                console.log(`💀 Disconnected ${client.remoteAddress ||
                                    client.input.remoteAddress}\n`);
                                try {
                                    if (this.clients || this.clients[sessionId])
                                        delete this.clients[sessionId];
                                    if (this.consoles || this.consoles[sessionId]) {
                                        (_a = this.consoles[sessionId]) === null || _a === void 0 ? void 0 : _a.destroy();
                                        delete this.consoles[sessionId];
                                    }
                                }
                                catch (error) {
                                    console.log('💥 warning: ' + error.message);
                                }
                            });
                            //screen on
                            screen.on('destroy', () => {
                                if (client.writable) {
                                    client.destroy();
                                }
                                console.log(`⚰️ Screen Destroyed ${client.remoteAddress ||
                                    client.input.remoteAddress}`);
                            });
                            if (!(0, exports.hasLoggedIn)(client, sessionId) && !options.anonymous)
                                this.consoles[sessionId].setCurrentWindow('Login');
                            console.log(`🦊 Successful Connection ${client.remoteAddress ||
                                client.output.remoteAddress ||
                                client.input.remoteAddress}<${sessionId}>`);
                            this.consoles[sessionId].emit('connected', this.clients[sessionId]);
                        }
                        catch (error) {
                            console.log(`💥 error<${client.input.remoteAddress}>:\n${error.stack}`);
                            if (client.writable) {
                                client.destroy();
                            }
                        }
                    }))();
                }).listen(options.port || port || 1337);
                console.log('🟢 Telnet Server Online! enter line below to connect\n\tbrew install telnet && telnet localhost ' +
                    options.port ||
                    port ||
                    1337);
            });
        }
        reload() { }
    }
    exports.TelnetServer = TelnetServer;
    /**
     * a method to register a new user by creating an md5 salt and a sha512 password from the password parameter. Can be passed a group to assign the user to. The client is the telnet client object.
     * @param username
     * @param password
     * @param client
     * @param group
     * @returns
     */
    const register = (username, password, client, group) => {
        group = group || 'default';
        if (exports.usernames[username])
            throw new Error('username already taken: ' + username);
        let salt = (0, node_crypto_1.createHash)('md5')
            .update(btoa((Math.random() * Math.random() * Date.now()).toString()))
            .digest('hex');
        let saltedPassword = (0, node_crypto_1.createHash)('sha512')
            .update(btoa(salt + password))
            .digest('hex');
        exports.usernames[username] = {
            username,
            salt,
            password: saltedPassword,
            client: client,
            userId: Object.keys(exports.usernames).length,
            group,
        };
        return exports.usernames[username];
    };
    exports.register = register;
    /**
     * saves the usernames to the temp folder
     */
    const saveUsernames = () => {
        fs_1.default.writeFileSync((0, helpers_1.cwd)() + '/temp/usernames.json', JSON.stringify(exports.usernames));
    };
    exports.saveUsernames = saveUsernames;
    /**
     * returns the telnet options from the config file
     * @returns
     */
    const getTelnetOptions = () => {
        return (0, helpers_1.getConfigFile)().telnet;
    };
    exports.getTelnetOptions = getTelnetOptions;
    exports.sessions = {};
    /**
     * logs in a user by checking the password and salt against the stored password. If the user is already logged in, it throws an error. If the password is incorrect, it throws an error. If the user is not found, it throws an error. If the user is found, it returns the new session entry.
     * @param username
     * @param password
     * @param remoteAddress
     * @param sessionId
     * @returns
     */
    const loginUser = (username, password, remoteAddress, sessionId) => {
        if (exports.sessions[sessionId])
            throw new Error('session has already begun');
        if (!exports.usernames[username])
            throw new Error('bad username or password');
        let user = exports.usernames[username];
        let hash = (0, node_crypto_1.createHash)('sha512')
            .update(user.salt + password)
            .digest('hex');
        if (hash !== user.password)
            throw new Error('bad username or password');
        exports.sessions[sessionId] = {
            username,
            remoteAddress,
            sessionId,
            group: user.group,
        };
        return exports.sessions[sessionId];
    };
    exports.loginUser = loginUser;
    /**
     * reads the username list from the temp folder
     * @returns
     */
    const readUsernameList = () => {
        if (!fs_1.default.existsSync((0, helpers_1.cwd)() + '/temp/usernames.json'))
            return {};
        return JSON.parse((0, helpers_1.cwd)() + '/temp/username.json');
    };
    exports.readUsernameList = readUsernameList;
    /**
     * will get the usernames from the temp folder if they are not already loaded else will return current value in memory. If useFresh is true, it will read the usernames from the temp folder.
     * @param useFresh
     * @returns
     */
    const getUsernames = (useFresh) => {
        if (!exports.usernames || useFresh) {
            exports.usernames = (0, exports.readUsernameList)();
        }
        return exports.usernames;
    };
    exports.getUsernames = getUsernames;
    /**
     * returns true if the user is logged in
     * @param client
     * @param sessionId
     * @returns
     */
    const hasLoggedIn = (client, sessionId) => {
        return (0, exports.getSession)(client, sessionId);
    };
    exports.hasLoggedIn = hasLoggedIn;
    /**
     * gets the session entry for the client and sessionId by checking the remoteAddress and sessionId. If sessionId is not passed, it will return the first client to match the remoteAddress.
     * @param client
     * @param sessionId
     * @returns
     */
    const getSession = (client, sessionId) => {
        return Object.values(exports.sessions).filter((entry) => client.remoteAddress === entry.remoteAddress &&
            (sessionId ? entry.sessionId === sessionId : true))[0];
    };
    exports.getSession = getSession;
});
//# sourceMappingURL=telnet.js.map