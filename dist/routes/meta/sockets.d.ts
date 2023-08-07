import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
export declare const get: (req: Request, res: Response, infinityConsole: InfinityConsole) => Promise<{
    online: boolean;
    config: {
        port?: number;
    };
}>;
//# sourceMappingURL=sockets.d.ts.map