import InfinityConsole from '../app/console';
import { Request, Response } from 'express';
export declare const post: (req: Request, res: Response, infinityConsole: InfinityConsole) => Promise<{
    alive: boolean;
    production: boolean;
    developer: boolean;
    websockets: boolean;
    meta: boolean;
}>;
export declare const get: (req: Request, res: Response, infinityConsole: InfinityConsole) => Promise<{
    alive: boolean;
    production: boolean;
    developer: boolean;
    websockets: boolean;
    meta: boolean;
}>;
//# sourceMappingURL=alive.d.ts.map