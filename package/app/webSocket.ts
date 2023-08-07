import { blessedToHTML } from './colours';
import InfinityConsole from './console';
import {
    Dictionary,
    getExpressConfig,
    log,
    tcpPingPort,
    warning,
} from './helpers';
import WebSocket from 'ws';
import { InfinityMintScriptArguments } from './interfaces';

export const startWebSocket = async (infinityConsole: InfinityConsole) => {
    let express = getExpressConfig();
    let port = express?.sockets?.port || 8080;

    if (
        (await tcpPingPort('localhost', parseInt(port.toString()))).online ===
        true
    ) {
        warning(
            'web socket active on port ' +
                port +
                ' please either stop it or change the port in your config file, or add flag --start-web-socket "false"'
        );
        return;
    }

    let webSocketInstance = new WebSocketController(infinityConsole);
    webSocketInstance.startSocket();
    return webSocketInstance;
};

export class WebSocketController {
    public infinityConsole: InfinityConsole;
    public WebSocket: WebSocket.Server;
    public sockets: any[] = [];
    public messages: Dictionary<string[]> = {};

    constructor(infinityConsole: InfinityConsole) {
        this.infinityConsole = infinityConsole;
    }

    public createSocket(port: number) {
        return new Promise((resolve, reject) => {
            this.WebSocket = new WebSocket.Server(
                {
                    port,
                },
                () => {
                    log(
                        `{magenta-fg}{bold}Web Socket Online{/} => http://localhost:${port}`
                    );
                    resolve(true);
                }
            );
        });
    }

    public close() {
        this.WebSocket.close();
    }

    public async startSocket(port = 8080) {
        let express = getExpressConfig();
        port = express?.sockets?.port || port || 8080;

        await this.createSocket(port);

        //og output
        this.infinityConsole.PipeFactory.emitter.on('log', (msg, pipe) => {
            let html = blessedToHTML(msg);
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
    }

    public sendMessages() {
        this.sockets.forEach((socket) => {
            let settings = this.getSocketSettings(socket) || {};
            let pipe = settings.currentPipe || 'default';
            let msgs = this.messages[pipe] || [];
            if (msgs.length === 0) return;
            socket.send(JSON.stringify(msgs));
        });

        this.messages = {};
    }

    public async onMessage(
        msg: {
            command?: string;
            args?: Dictionary<InfinityMintScriptArguments>;
        },
        socket: WebSocket.WebSocket
    ) {
        try {
            await this.infinityConsole.executeScript(msg.command, msg.args);
        } catch (error) {
            socket.send(
                JSON.stringify([
                    '<h2><span style="color: red"><b>Error</b></span> ' +
                        error.message +
                        '</h2><br/><pre>' +
                        error.stack +
                        '</pre>',
                ])
            );
            return;
        }
    }

    public getSocketSettings(socket: WebSocket.WebSocket): {
        [key: string]: any;
        currentPipe?: string;
        showDebug?: boolean;
    } {
        return (socket as any).settings;
    }

    public setSocketSettings(socket: WebSocket.WebSocket, settings: any) {
        (socket as any).settings = settings;
    }

    public onConnection(socket: WebSocket.WebSocket) {
        // When you receive a message, send that message to every socket.
        socket.on('message', (msg) => {
            if (msg.toString().length > 10000) return socket.close();

            if (msg.toString().startsWith('settings:')) {
                let settings = JSON.parse(
                    msg.toString().replace('settings:', '')
                );
                this.setSocketSettings(socket, settings);
                return;
            }

            if (msg.toString() === 'ping')
                return socket.send(
                    JSON.stringify({
                        success: true,
                    })
                );

            let parsedMessage: any;
            try {
                parsedMessage = JSON.parse(msg.toString());
            } catch (error) {
                socket.send(
                    JSON.stringify([
                        '<h2><span style="color: red"><b>Error</b></span> ' +
                            (error.message || 'Internal Server Error') +
                            '</h2><br/><pre>' +
                            error.stack +
                            '</pre>',
                    ])
                );
                return;
            }
            log(
                `{green-fg}{bold}Web Socket message{/} => ${JSON.stringify(
                    parsedMessage,
                    null,
                    2
                )}`,
                'express'
            );
            this.onMessage(parsedMessage, socket).catch((e) => {
                log(`{red-fg}{bold}Error in socket message{/} => ${e}`);
            });
        });

        socket.on('close', () => {
            this.sockets = this.sockets.filter(
                (val, i) => i !== this.sockets.indexOf(val)
            );
        });
    }
}
