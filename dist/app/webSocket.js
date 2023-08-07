(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./colours", "./helpers", "ws"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebSocketController = exports.startWebSocket = void 0;
    const tslib_1 = require("tslib");
    const colours_1 = require("./colours");
    const helpers_1 = require("./helpers");
    const ws_1 = tslib_1.__importDefault(require("ws"));
    const startWebSocket = (infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let express = (0, helpers_1.getExpressConfig)();
        let port = ((_a = express === null || express === void 0 ? void 0 : express.sockets) === null || _a === void 0 ? void 0 : _a.port) || 8080;
        if ((yield (0, helpers_1.tcpPingPort)('localhost', parseInt(port.toString()))).online ===
            true) {
            (0, helpers_1.warning)('web socket active on port ' +
                port +
                ' please either stop it or change the port in your config file, or add flag --start-web-socket "false"');
            return;
        }
        let webSocketInstance = new WebSocketController(infinityConsole);
        webSocketInstance.startSocket();
        return webSocketInstance;
    });
    exports.startWebSocket = startWebSocket;
    class WebSocketController {
        constructor(infinityConsole) {
            this.sockets = [];
            this.messages = {};
            this.infinityConsole = infinityConsole;
        }
        createSocket(port) {
            return new Promise((resolve, reject) => {
                this.WebSocket = new ws_1.default.Server({
                    port,
                }, () => {
                    (0, helpers_1.log)(`{magenta-fg}{bold}Web Socket Online{/} => http://localhost:${port}`);
                    resolve(true);
                });
            });
        }
        close() {
            this.WebSocket.close();
        }
        startSocket(port = 8080) {
            var _a;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let express = (0, helpers_1.getExpressConfig)();
                port = ((_a = express === null || express === void 0 ? void 0 : express.sockets) === null || _a === void 0 ? void 0 : _a.port) || port || 8080;
                yield this.createSocket(port);
                //og output
                this.infinityConsole.PipeFactory.emitter.on('log', (msg, pipe) => {
                    let html = (0, colours_1.blessedToHTML)(msg);
                    this.messages[pipe] = this.messages[pipe] || [];
                    this.messages[pipe].push(html);
                });
                //on connection
                this.WebSocket.on('connection', (socket, req) => {
                    this.sockets.push(socket);
                    this.onConnection(socket);
                });
                //every second send messages
                setInterval(() => {
                    this.sendMessages();
                }, 1000);
            });
        }
        sendMessages() {
            this.sockets.forEach((socket) => {
                let settings = this.getSocketSettings(socket) || {};
                let pipe = settings.currentPipe || 'default';
                let msgs = this.messages[pipe] || [];
                if (msgs.length === 0)
                    return;
                socket.send(JSON.stringify(msgs));
            });
            this.messages = {};
        }
        onMessage(msg, socket) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.infinityConsole.executeScript(msg.command, msg.args);
                }
                catch (error) {
                    socket.send(JSON.stringify([
                        '<h2><span style="color: red"><b>Error</b></span> ' +
                            error.message +
                            '</h2><br/><pre>' +
                            error.stack +
                            '</pre>',
                    ]));
                    return;
                }
            });
        }
        getSocketSettings(socket) {
            return socket.settings;
        }
        setSocketSettings(socket, settings) {
            socket.settings = settings;
        }
        onConnection(socket) {
            // When you receive a message, send that message to every socket.
            socket.on('message', (msg) => {
                if (msg.toString().length > 10000)
                    return socket.close();
                if (msg.toString().startsWith('settings:')) {
                    let settings = JSON.parse(msg.toString().replace('settings:', ''));
                    this.setSocketSettings(socket, settings);
                    return;
                }
                if (msg.toString() === 'ping')
                    return socket.send(JSON.stringify({
                        success: true,
                    }));
                let parsedMessage;
                try {
                    parsedMessage = JSON.parse(msg.toString());
                }
                catch (error) {
                    socket.send(JSON.stringify([
                        '<h2><span style="color: red"><b>Error</b></span> ' +
                            (error.message || 'Internal Server Error') +
                            '</h2><br/><pre>' +
                            error.stack +
                            '</pre>',
                    ]));
                    return;
                }
                (0, helpers_1.log)(`{green-fg}{bold}Web Socket message{/} => ${JSON.stringify(parsedMessage, null, 2)}`, 'express');
                this.onMessage(parsedMessage, socket).catch((e) => {
                    (0, helpers_1.log)(`{red-fg}{bold}Error in socket message{/} => ${e}`);
                });
            });
            socket.on('close', () => {
                this.sockets = this.sockets.filter((val, i) => i !== this.sockets.indexOf(val));
            });
        }
    }
    exports.WebSocketController = WebSocketController;
});
//# sourceMappingURL=webSocket.js.map