import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import { ExpressError } from '../../app/express';
export declare const get: (req: Request, res: Response, infinityConsole: InfinityConsole) => Promise<ExpressError | {
    tokenId: number;
    token: import("../../typechain-types/InfinityMintStorage").InfinityMintObject.InfinityObjectStructOutput;
    uri: string;
}>;
//# sourceMappingURL=get.d.ts.map