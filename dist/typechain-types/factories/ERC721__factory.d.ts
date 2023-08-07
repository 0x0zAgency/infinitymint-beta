import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { ERC721, ERC721Interface } from "../ERC721";
type ERC721ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ERC721__factory extends ContractFactory {
    constructor(...args: ERC721ConstructorParams);
    deploy(tokenName: PromiseOrValue<string>, tokenSymbol: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ERC721>;
    getDeployTransaction(tokenName: PromiseOrValue<string>, tokenSymbol: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): ERC721;
    connect(signer: Signer): ERC721__factory;
    static readonly bytecode = "0x60806040523480156200001157600080fd5b506040516200105b3803806200105b8339810160408190526200003491620001db565b81516200004990600590602085019062000068565b5080516200005f90600690602084019062000068565b50505062000282565b828054620000769062000245565b90600052602060002090601f0160209004810192826200009a5760008555620000e5565b82601f10620000b557805160ff1916838001178555620000e5565b82800160010185558215620000e5579182015b82811115620000e5578251825591602001919060010190620000c8565b50620000f3929150620000f7565b5090565b5b80821115620000f35760008155600101620000f8565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200013657600080fd5b81516001600160401b03808211156200015357620001536200010e565b604051601f8301601f19908116603f011681019082821181831017156200017e576200017e6200010e565b816040528381526020925086838588010111156200019b57600080fd5b600091505b83821015620001bf5785820183015181830184015290820190620001a0565b83821115620001d15760008385830101525b9695505050505050565b60008060408385031215620001ef57600080fd5b82516001600160401b03808211156200020757600080fd5b620002158683870162000124565b935060208501519150808211156200022c57600080fd5b506200023b8582860162000124565b9150509250929050565b600181811c908216806200025a57607f821691505b602082108114156200027c57634e487b7160e01b600052602260045260246000fd5b50919050565b610dc980620002926000396000f3fe608060405234801561001057600080fd5b50600436106100c55760003560e01c806301ffc9a7146100ca57806306fdde03146100f2578063081812fc14610107578063095ea7b31461013257806323b872dd1461014757806342842e0e1461015a578063430c20811461016d5780634f558e79146101805780636352211e1461019357806370a08231146101a657806395d89b41146101dd578063a22cb465146101e5578063b88d4fde146101f8578063c87b56dd1461020b578063e985e9c51461021e575b600080fd5b6100dd6100d8366004610a1e565b610231565b60405190151581526020015b60405180910390f35b6100fa610283565b6040516100e99190610a8f565b61011a610115366004610aa2565b610315565b6040516001600160a01b0390911681526020016100e9565b610145610140366004610ad7565b610330565b005b610145610155366004610b01565b610485565b610145610168366004610b01565b6105f5565b6100dd61017b366004610ad7565b610615565b6100dd61018e366004610aa2565b610674565b61011a6101a1366004610aa2565b610691565b6101cf6101b4366004610b3d565b6001600160a01b031660009081526004602052604090205490565b6040519081526020016100e9565b6100fa6106f6565b6101456101f3366004610b58565b610705565b610145610206366004610baa565b610771565b6100fa610219366004610aa2565b610783565b6100dd61022c366004610c86565b610825565b60006001600160e01b031982166380ac58cd60e01b148061026257506001600160e01b03198216635b5e139f60e01b145b8061027d57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606005805461029290610cb9565b80601f01602080910402602001604051908101604052809291908181526020018280546102be90610cb9565b801561030b5780601f106102e05761010080835404028352916020019161030b565b820191906000526020600020905b8154815290600101906020018083116102ee57829003601f168201915b5050505050905090565b6000908152600260205260409020546001600160a01b031690565b600061033b82610691565b9050806001600160a01b0316836001600160a01b0316141561039b5760405162461bcd60e51b815260206004820152601460248201527331b0b73737ba1030b8383937bb329037bbb732b960611b60448201526064015b60405180910390fd5b336001600160a01b03821614806103b757506103b78133610825565b6104295760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c0000006064820152608401610392565b60008281526002602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b61048f3382610615565b6104d35760405162461bcd60e51b81526020600482015260156024820152743737ba1030b8383937bb32b21037b91037bbb732b960591b6044820152606401610392565b6001600160a01b0383166105235760405162461bcd60e51b815260206004820152601760248201527673656e64696e6720746f206e756c6c206164647265737360481b6044820152606401610392565b600081815260026020908152604080832080546001600160a01b03191690556001600160a01b038616835260049091528120805460019290610566908490610d0a565b90915550506001600160a01b0382166000908152600460205260408120805460019290610594908490610d21565b909155505060008181526020819052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b61061083838360405180602001604052806000815250610853565b505050565b60008061062183610691565b9050806001600160a01b0316846001600160a01b0316148061064857506106488185610825565b8061066c5750836001600160a01b031661066184610315565b6001600160a01b0316145b949350505050565b6000908152602081905260409020546001600160a01b0316151590565b600061069c82610674565b6106da5760405162461bcd60e51b815260206004820152600f60248201526e1a5b9d985b1a59081d1bdad95b9259608a1b6044820152606401610392565b506000908152602081905260409020546001600160a01b031690565b60606006805461029290610cb9565b3360008181526003602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61077d84848484610853565b50505050565b60008181526001602052604090208054606091906107a090610cb9565b80601f01602080910402602001604051908101604052809291908181526020018280546107cc90610cb9565b80156108195780601f106107ee57610100808354040283529160200191610819565b820191906000526020600020905b8154815290600101906020018083116107fc57829003601f168201915b50505050509050919050565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205460ff1690565b61085e848484610485565b61086b33858585856108c3565b61077d5760405162461bcd60e51b815260206004820152602360248201527f45524337323120526563656976657220436f6e6669726d6174696f6e2049732060448201526210985960ea1b6064820152608401610392565b6000833b6108d3575060016109fc565b604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610905908990899088908890600401610d39565b6020604051808303816000875af1925050508015610940575060408051601f3d908101601f1916820190925261093d91810190610d76565b60015b6109e6573d80801561096e576040519150601f19603f3d011682016040523d82523d6000602084013e610973565b606091505b5080516109de5760405162461bcd60e51b815260206004820152603360248201527f5468697320636f6e747261637420646f6573206e6f7420696d706c656d656e746044820152721030b71024a2a9219b9918a932b1b2b4bb32b960691b6064820152608401610392565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490505b95945050505050565b6001600160e01b031981168114610a1b57600080fd5b50565b600060208284031215610a3057600080fd5b8135610a3b81610a05565b9392505050565b6000815180845260005b81811015610a6857602081850181015186830182015201610a4c565b81811115610a7a576000602083870101525b50601f01601f19169290920160200192915050565b602081526000610a3b6020830184610a42565b600060208284031215610ab457600080fd5b5035919050565b80356001600160a01b0381168114610ad257600080fd5b919050565b60008060408385031215610aea57600080fd5b610af383610abb565b946020939093013593505050565b600080600060608486031215610b1657600080fd5b610b1f84610abb565b9250610b2d60208501610abb565b9150604084013590509250925092565b600060208284031215610b4f57600080fd5b610a3b82610abb565b60008060408385031215610b6b57600080fd5b610b7483610abb565b915060208301358015158114610b8957600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b60008060008060808587031215610bc057600080fd5b610bc985610abb565b9350610bd760208601610abb565b925060408501359150606085013567ffffffffffffffff80821115610bfb57600080fd5b818701915087601f830112610c0f57600080fd5b813581811115610c2157610c21610b94565b604051601f8201601f19908116603f01168101908382118183101715610c4957610c49610b94565b816040528281528a6020848701011115610c6257600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b60008060408385031215610c9957600080fd5b610ca283610abb565b9150610cb060208401610abb565b90509250929050565b600181811c90821680610ccd57607f821691505b60208210811415610cee57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b600082821015610d1c57610d1c610cf4565b500390565b60008219821115610d3457610d34610cf4565b500190565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090610d6c90830184610a42565b9695505050505050565b600060208284031215610d8857600080fd5b8151610a3b81610a0556fea26469706673582212202b71d2af335c8a05e1e1bae941a0a5eac8a3fd1c48ab9e304424e5f35353652a64736f6c634300080c0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "tokenName";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "tokenSymbol";
            readonly type: "string";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "approved";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "approved";
            readonly type: "bool";
        }];
        readonly name: "ApprovalForAll";
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
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "exists";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "getApproved";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_operator";
            readonly type: "address";
        }];
        readonly name: "isApprovedForAll";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly name: "isApprovedOrOwner";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "ownerOf";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "safeTransferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly name: "safeTransferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_operator";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "_approved";
            readonly type: "bool";
        }];
        readonly name: "setApprovalForAll";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes4";
            readonly name: "interfaceId";
            readonly type: "bytes4";
        }];
        readonly name: "supportsInterface";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "tokenURI";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_tokenId";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): ERC721Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): ERC721;
}
export {};
//# sourceMappingURL=ERC721__factory.d.ts.map