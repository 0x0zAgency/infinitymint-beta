import { InfinityMintObject } from '@typechain-types/Minter';
import { InfinityMintCompiledProject, InfinityMintDeployedProject, KeyValue } from './interfaces';
import { Project } from './projects';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
export declare class Token {
    project: Project;
    tokenId: number;
    protected raw?: InfinityMintObject.InfinityObjectStructOutput;
    receipt: TransactionReceipt;
    constructor(project: Project, tokenId: number, raw?: InfinityMintObject.InfinityObjectStructOutput, receipt?: TransactionReceipt);
    load(): Promise<void>;
    get rarity(): string | number;
    get output(): InfinityMintObject.InfinityObjectStructOutput;
    get(): Promise<InfinityMintObject.InfinityObjectStructOutput>;
    getPath(): InfinityMintDeployedProject['paths'][number];
    getAssets(): InfinityMintDeployedProject['assets'][number][];
    colours(): string[];
    get owner(): string;
    get name(): string;
    get pathId(): number;
    transfer(to: string): Promise<void>;
    isFlagTrue(flag: string): Promise<boolean>;
    isGlobalFlag(flag: string): Promise<boolean>;
    setFlag(flag: string, value: boolean): Promise<void>;
    getNames(): string[];
}
export declare const generateToken: (project: InfinityMintDeployedProject | InfinityMintCompiledProject, pathId?: number) => InfinityMintObject.InfinityObjectStruct;
export interface InfinityMintToken extends InfinityMintObject.InfinityObjectStruct {
    minted?: boolean;
    name?: string;
    data?: KeyValue;
}
export declare const createToken: (project?: InfinityMintDeployedProject) => Promise<InfinityMintToken>;
//# sourceMappingURL=token.d.ts.map