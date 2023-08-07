import { InfinityMintIPFSOptions } from './interfaces';
export declare class IPFS {
    private kuboAvailable;
    private web3Storage;
    private favourKubo;
    private favourWeb3Storage;
    start(): Promise<this>;
    add(data: any, fileName: string): Promise<import("web3.storage/dist/src/lib/interface").CIDString>;
    uploadJson(obj: any, fileName?: string): Promise<import("web3.storage/dist/src/lib/interface").CIDString>;
    /**
     * Returns the CID as an array buffer
     * @param cid
     * @returns
     */
    get(cid: string): Promise<ArrayBuffer>;
    isKuboAvailable(): Promise<boolean>;
}
export declare const isAllowingIPFS: () => boolean;
export declare const getIPFSConfig: () => InfinityMintIPFSOptions;
//# sourceMappingURL=ipfs.d.ts.map