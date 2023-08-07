import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
export declare const get: (req: Request, res: Response, infinityConsole: InfinityConsole) => Promise<{
    sessionId: string;
    chainId: number;
    network: string;
    networkAccess: boolean;
    windows: void;
    elements: string[];
    gems: import("../../app/helpers").Dictionary<import("@app/interfaces").Gem>;
    defaultProject: {};
    project: import("@app/interfaces").KeyValue;
    defaultNetwork: string;
    accounts: string[];
    scripts: import("@app/interfaces").InfinityMintScript[];
    projects: string[];
}>;
//# sourceMappingURL=console.d.ts.map