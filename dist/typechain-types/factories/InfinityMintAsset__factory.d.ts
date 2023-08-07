import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { InfinityMintAsset, InfinityMintAssetInterface } from "../InfinityMintAsset";
export declare class InfinityMintAsset__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "changee";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "value";
            readonly type: "bool";
        }];
        readonly name: "PermissionChange";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }];
        readonly name: "TransferedOwnership";
        readonly type: "event";
    }, {
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
            readonly internalType: "uint256[]";
            readonly name: "rarities";
            readonly type: "uint256[]";
        }];
        readonly name: "addAssets";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "approvalCount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "approved";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "assetId";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "assetsType";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "deployer";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32[]";
            readonly name: "pathIds";
            readonly type: "uint32[]";
        }];
        readonly name: "flatPathSections";
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
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint32";
            readonly name: "";
            readonly type: "uint32";
        }, {
            readonly internalType: "contract RandomNumber";
            readonly name: "";
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
            readonly name: "_nameCount";
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
        readonly stateMutability: "view";
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
            readonly internalType: "uint256";
            readonly name: "pathId";
            readonly type: "uint256";
        }];
        readonly name: "getPathSections";
        readonly outputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }];
        readonly stateMutability: "view";
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
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "sectionId";
            readonly type: "uint256";
        }];
        readonly name: "getSectionAssets";
        readonly outputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "isAuthenticated";
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
            readonly internalType: "address[]";
            readonly name: "addrs";
            readonly type: "address[]";
        }];
        readonly name: "multiApprove";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "addrs";
            readonly type: "address[]";
        }];
        readonly name: "multiRevoke";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "nameCount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
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
            readonly internalType: "uint256[]";
            readonly name: "_assets";
            readonly type: "uint256[]";
        }];
        readonly name: "pushSectionAssets";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "resetAssets";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "resetNames";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "resetPaths";
        readonly outputs: readonly [];
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
            readonly internalType: "uint256";
            readonly name: "_nameCount";
            readonly type: "uint256";
        }];
        readonly name: "setNameCount";
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
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "newPathCount";
            readonly type: "uint256";
        }];
        readonly name: "setPathCount";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "pathId";
            readonly type: "uint32";
        }, {
            readonly internalType: "bool";
            readonly name: "value";
            readonly type: "bool";
        }];
        readonly name: "setPathDisabled";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32[]";
            readonly name: "pathIds";
            readonly type: "uint32[]";
        }, {
            readonly internalType: "uint256[][]";
            readonly name: "_sections";
            readonly type: "uint256[][]";
        }];
        readonly name: "setPathSections";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "pathId";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint32";
            readonly name: "pathSize";
            readonly type: "uint32";
        }];
        readonly name: "setPathSize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32[]";
            readonly name: "newPathSizes";
            readonly type: "uint32[]";
        }];
        readonly name: "setPathSizes";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "value";
            readonly type: "bool";
        }];
        readonly name: "setPrivilages";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "sectionId";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "_assets";
            readonly type: "uint256[]";
        }];
        readonly name: "setSectionAssets";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): InfinityMintAssetInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): InfinityMintAsset;
}
//# sourceMappingURL=InfinityMintAsset__factory.d.ts.map