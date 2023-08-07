import InfinityConsole from './console';
import { Dictionary } from './helpers';
import WebSocket from 'ws';
import { InfinityMintScriptArguments } from './interfaces';
export declare const startWebSocket: (infinityConsole: InfinityConsole) => Promise<WebSocketController>;
export declare class WebSocketController {
    infinityConsole: InfinityConsole;
    WebSocket: WebSocket.Server;
    sockets: any[];
    messages: Dictionary<string[]>;
    constructor(infinityConsole: InfinityConsole);
    createSocket(port: number): Promise<unknown>;
    close(): void;
    startSocket(port?: number): Promise<void>;
    sendMessages(): void;
    onMessage(msg: {
        command?: string;
        args?: Dictionary<InfinityMintScriptArguments>;
    }, socket: WebSocket.WebSocket): Promise<void>;
    getSocketSettings(socket: WebSocket.WebSocket): {
        [key: string]: any;
        currentPipe?: string;
        showDebug?: boolean;
    };
    setSocketSettings(socket: WebSocket.WebSocket, settings: any): void;
    onConnection(socket: WebSocket.WebSocket): void;
}
//# sourceMappingURL=webSocket.d.ts.map