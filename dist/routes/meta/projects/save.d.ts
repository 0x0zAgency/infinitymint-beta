import InfinityConsole from '../../../app/console';
import { Request, Response } from 'express';
import { ExpressError } from '../../../app/express';
export declare const post: (req: Request, res: Response, infinityConsole: InfinityConsole) => Promise<ExpressError | {
    success: boolean;
}>;
//# sourceMappingURL=save.d.ts.map