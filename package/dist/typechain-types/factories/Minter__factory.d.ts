import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Minter, MinterInterface } from "../Minter";
export declare class Minter__factory {
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
        readonly name: "assetController";
        readonly outputs: readonly [{
            readonly internalType: "contract Asset";
            readonly name: "";
            readonly type: "address";
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
            readonly internalType: "uint32";
            readonly name: "currentTokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "getPreview";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "previewCount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
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
            readonly name: "currentTokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "mintData";
            readonly type: "bytes";
        }];
        readonly name: "mint";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint32";
                readonly name: "pathId";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32";
                readonly name: "currentTokenId";
                readonly type: "uint32";
            }, {
                readonly internalType: "address";
                readonly name: "owner";
                readonly type: "address";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "colours";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "bytes";
                readonly name: "mintData";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "assets";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "names";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "address[]";
                readonly name: "destinations";
                readonly type: "address[]";
            }];
            readonly internalType: "struct InfinityMintObject.InfinityObject";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "index";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint32";
            readonly name: "currentTokenId";
            readonly type: "uint32";
        }, {
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }];
        readonly name: "mintPreview";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint32";
                readonly name: "pathId";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32";
                readonly name: "currentTokenId";
                readonly type: "uint32";
            }, {
                readonly internalType: "address";
                readonly name: "owner";
                readonly type: "address";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "colours";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "bytes";
                readonly name: "mintData";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "assets";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "uint32[]";
                readonly name: "names";
                readonly type: "uint32[]";
            }, {
                readonly internalType: "address[]";
                readonly name: "destinations";
                readonly type: "address[]";
            }];
            readonly internalType: "struct InfinityMintObject.InfinityObject";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "nonpayable";
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
        readonly name: "randomNumberController";
        readonly outputs: readonly [{
            readonly internalType: "contract RandomNumber";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "assetContract";
            readonly type: "address";
        }];
        readonly name: "setAssetController";
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
            readonly internalType: "address";
            readonly name: "randomNumberContract";
            readonly type: "address";
        }];
        readonly name: "setRandomNumberController";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "storageContract";
            readonly type: "address";
        }];
        readonly name: "setStorageController";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "storageController";
        readonly outputs: readonly [{
            readonly internalType: "contract InfinityMintStorage";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
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
    }, {
        readonly inputs: readonly [];
        readonly name: "valuesController";
        readonly outputs: readonly [{
            readonly internalType: "contract InfinityMintValues";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): MinterInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Minter;
}
//# sourceMappingURL=Minter__factory.d.ts.map