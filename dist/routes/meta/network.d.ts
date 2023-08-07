import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
export declare const get: (req: Request, res: Response, infinityConsole: InfinityConsole) => Promise<{
    name: string;
    chainId: number;
    rpc: any;
    networkAccess: boolean;
    accounts: string[];
    config: any;
}>;
//# sourceMappingURL=network.d.ts.map