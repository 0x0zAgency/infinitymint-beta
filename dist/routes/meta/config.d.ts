/// <reference types="node" />
import { Request, Response } from 'express';
export declare const get: (req: Request, res: Response) => Promise<{
    dev?: {
        useLocalDist?: boolean;
    };
    gems?: string[];
    project?: string;
    express?: boolean | import("@app/interfaces").InfinityMintExpressOptions;
    console?: boolean | import("@app/interfaces").InfinityMintConsoleOptions;
    logging?: {
        ganache?: {
            blockedMessages: string[];
            ethereumMessages: string[];
        };
    };
    telnet?: boolean | import("@app/interfaces").InfinityMintTelnetOptions;
    music?: boolean;
    onlyInitialize?: boolean;
    hardhat: import("hardhat/types").HardhatUserConfig;
    events?: import("@app/interfaces").InfinityMintConfigEvents;
    ipfs?: boolean | import("@app/interfaces").InfinityMintIPFSOptions;
    ganache?: any;
    imports?: import("fs").PathLike[];
    roots?: import("fs").PathLike[];
    settings?: import("@app/interfaces").InfinityMintConfigSettings;
    export?: {
        putGems?: (gems: import("@app/interfaces").Gem[], infinityConsole: import("../../app/console").InfinityConsole) => Promise<void>;
        putTokenRenderScripts?: (scripts: any, infinityConsole: import("../../app/console").InfinityConsole) => Promise<void>;
        putDeployments?: (deployments: import("../../app/deployments").InfinityMintDeployment[], project: import("@app/interfaces").InfinityMintDeployedProject, infinityConsole: import("../../app/console").InfinityConsole) => Promise<void>;
        putProject?: (deployedProject: import("@app/interfaces").InfinityMintDeployedProject, compiledProject: import("@app/interfaces").InfinityMintCompiledProject, project: import("@app/interfaces").InfinityMintProject, infinityConsole: import("../../app/console").InfinityConsole) => Promise<void>;
        putImages?: (images: import("../../app/helpers").Dictionary<string>, infinityConsole: import("../../app/console").InfinityConsole) => Promise<void>;
        putStyles?: (styles: import("../../app/helpers").Dictionary<string>, infinityConsole: import("../../app/console").InfinityConsole) => Promise<void>;
        putResources?: (resources: import("../../app/helpers").Dictionary<string>, infinityConsole: import("../../app/console").InfinityConsole) => Promise<void>;
    };
}>;
//# sourceMappingURL=config.d.ts.map