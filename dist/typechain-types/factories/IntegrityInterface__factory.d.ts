import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IntegrityInterface, IntegrityInterfaceInterface } from "../IntegrityInterface";
export declare class IntegrityInterface__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "getIntegrity";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "versionType";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes4";
            readonly name: "intefaceId";
            readonly type: "bytes4";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IntegrityInterfaceInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IntegrityInterface;
}
//# sourceMappingURL=IntegrityInterface__factory.d.ts.map