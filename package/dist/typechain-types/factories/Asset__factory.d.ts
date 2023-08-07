import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Asset, AssetInterface } from "../Asset";
export declare class Asset__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "rarity";
            readonly type: "uint256";
        }];
        readonly name: "addAsset";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "pathId";
            readonly type: "uint32";
        }, {
            readonly internalType: "contract RandomNumber";
            readonly name: "randomNumberController";
            readonly type: "address";
        }];
        readonly name: "getColours";
        readonly outputs: readonly [{
            readonly internalType: "uint32[]";
            readonly name: "result";
            readonly type: "uint32[]";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "pathId";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint32";
            readonly name: "tokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "contract RandomNumber";
            readonly name: "randomNumberController";
            readonly type: "address";
        }];
        readonly name: "getMintData";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "nameCount";
            readonly type: "uint256";
        }, {
            readonly internalType: "contract RandomNumber";
            readonly name: "randomNumberController";
            readonly type: "address";
        }];
        readonly name: "getNames";
        readonly outputs: readonly [{
            readonly internalType: "uint32[]";
            readonly name: "results";
            readonly type: "uint32[]";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getNextPath";
        readonly outputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "";
            readonly type: "uint32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract RandomNumber";
            readonly name: "randomNumberController";
            readonly type: "address";
        }];
        readonly name: "getNextPathId";
        readonly outputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "";
            readonly type: "uint32";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "pathId";
            readonly type: "uint32";
        }];
        readonly name: "getPathSize";
        readonly outputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "";
            readonly type: "uint32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "pathId";
            readonly type: "uint32";
        }, {
            readonly internalType: "contract RandomNumber";
            readonly name: "randomNumberController";
            readonly type: "address";
        }];
        readonly name: "getRandomAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint32[]";
            readonly name: "assetsId";
            readonly type: "uint32[]";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "pathId";
            readonly type: "uint32";
        }];
        readonly name: "isValidPath";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "currentTokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "contract RandomNumber";
            readonly name: "randomNumberController";
            readonly type: "address";
        }];
        readonly name: "pickPath";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint32";
                readonly name: "pathId";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "assets";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "names";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "colours";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "bytes";
                readonly name: "mintData";
                readonly type: "bytes";
            }];
            readonly internalType: "struct Asset.PartialStruct";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "pathId";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint32";
            readonly name: "currentTokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "contract RandomNumber";
            readonly name: "randomNumberController";
            readonly type: "address";
        }];
        readonly name: "pickPath";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint32";
                readonly name: "pathId";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "assets";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "names";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "colours";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "bytes";
                readonly name: "mintData";
                readonly type: "bytes";
            }];
            readonly internalType: "struct Asset.PartialStruct";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "pathId";
            readonly type: "uint32";
        }];
        readonly name: "setLastPathId";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "pathId";
            readonly type: "uint32";
        }];
        readonly name: "setNextPathId";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): AssetInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Asset;
}
//# sourceMappingURL=Asset__factory.d.ts.map