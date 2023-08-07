import { Application, Request, Response } from 'express';
import InfinityConsole from './console';
import { Dictionary } from './helpers';
export interface ExpressEndpoint {
    path?: string;
    fileName?: string;
    post?: (req: any, res: any, infinityConsole?: InfinityConsole) => ReturnType;
    get?: (req: any, res: any, infinityConsole?: InfinityConsole) => ReturnType;
    init?: () => Promise<void> | void;
    middleware: {
        get: HandlerType[];
        post: HandlerType[];
    };
}
export type ReturnObject = {
    code?: number;
    data?: any;
};
export type ReturnType = Promise<ReturnObject> | ReturnObject | void;
export type HandlerType = any;
export declare class ExpressError extends Error {
    message: string;
    status: number;
    constructor(message: string, status?: number);
    sendError(res: Response): void;
}
export declare abstract class ExpressRoute implements ExpressEndpoint {
    infinityConsole: InfinityConsole;
    path: string;
    middleware: {
        get: HandlerType[];
        post: HandlerType[];
    };
    constructor(infinityConsole: InfinityConsole);
    protected registerGetMiddleware(handler: HandlerType): void;
    protected registerPostMiddleware(handler: HandlerType): void;
    abstract init(): Promise<void> | void;
    abstract get(req: Request, res: Response, ...any: any): ReturnType;
    abstract post(req: Request, res: Response, ...any: any): ReturnType;
}
export declare class ExpressServer {
    app: Application;
    routes: {
        [key: string]: ExpressEndpoint;
    };
    infinityConsole: InfinityConsole;
    server: any;
    private hotreloadInterval;
    private fileCheckInterval;
    private importChecksums;
    constructor(infinityConsole: InfinityConsole);
    close(): Promise<unknown>;
    start(): Promise<void>;
    reload(): Promise<void>;
    load(): Promise<void>;
    startHotReload(): void;
    checkImportChecksums(): boolean;
    findExpressEndpoints: (deleteCache?: boolean, shouldLog?: boolean) => Promise<Dictionary<ExpressEndpoint | ExpressRoute>>;
}
export declare const startExpressServer: (infinityConsole: InfinityConsole) => Promise<ExpressServer>;
//# sourceMappingURL=express.d.ts.map