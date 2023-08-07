import { Signer, ContractFactory, BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type { SeededRandom, SeededRandomInterface } from "../../../core/random/SeededRandom";
type SeededRandomConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class SeededRandom__factory extends ContractFactory {
    constructor(...args: SeededRandomConstructorParams);
    deploy(seedNumber: PromiseOrValue<BigNumberish>, valuesContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<SeededRandom>;
    getDeployTransaction(seedNumber: PromiseOrValue<BigNumberish>, valuesContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): SeededRandom;
    connect(signer: Signer): SeededRandom__factory;
    static readonly bytecode = "0x60806040526001805460ff1916815560025562be135560045534801561002457600080fd5b50604051610469380380610469833981016040819052610043916100f4565b600380546001600160a01b0319166001600160a01b03831690811790915560405163e7b6dac960e01b815260206004820152600f60248201526e3930b73237b6b2b9b9a330b1ba37b960891b604482015282919063e7b6dac990606401602060405180830381865afa1580156100bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100e19190610143565b600055505063ffffffff1660045561015c565b6000806040838503121561010757600080fd5b825163ffffffff8116811461011b57600080fd5b60208401519092506001600160a01b038116811461013857600080fd5b809150509250929050565b60006020828403121561015557600080fd5b5051919050565b6102fe8061016b6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806307aaf42d146100675780637881bab914610089578063a0d0ca0f146100aa578063bfa0b133146100bd578063ceb42337146100c6578063f2c9ecd8146100cf575b600080fd5b6001546100749060ff1681565b60405190151581526020015b60405180910390f35b61009c61009736600461025e565b6100d7565b604051908152602001610080565b61009c6100b8366004610280565b61016b565b61009c60025481565b61009c60005481565b61009c610184565b60008083116100e557600192505b6004546002546000805460408051602081019590955284018690526060840192909252608083018690523360a084015260c08301919091529060e0016040516020818303038152906040528051906020012060001c9050600080610149838761022d565b91509150811561015d579250610165915050565b600093505050505b92915050565b60028054600101908190556000906101659083906100d7565b60028054600101905560035460405163e7b6dac960e01b815260206004820152600f60248201526e36b0bc2930b73237b6a73ab6b132b960891b6044820152600091610228916001600160a01b039091169063e7b6dac990606401602060405180830381865afa1580156101fc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102209190610299565b6002546100d7565b905090565b6000808261024057506000905080610257565b6001838581610251576102516102b2565b06915091505b9250929050565b6000806040838503121561027157600080fd5b50508035926020909101359150565b60006020828403121561029257600080fd5b5035919050565b6000602082840312156102ab57600080fd5b5051919050565b634e487b7160e01b600052601260045260246000fdfea264697066735822122073f54d4e08d851585a9858679b024996956123f85edca4def2850840fe12941e64736f6c634300080c0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "seedNumber";
            readonly type: "uint32";
        }, {
            readonly internalType: "address";
            readonly name: "valuesContract";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "maxNumber";
            readonly type: "uint256";
        }];
        readonly name: "getMaxNumber";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getNumber";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "hasDeployed";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "randomnessFactor";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "salt";
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
            readonly name: "maxNumber";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_salt";
            readonly type: "uint256";
        }];
        readonly name: "unsafeNumber";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): SeededRandomInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): SeededRandom;
}
export {};
//# sourceMappingURL=SeededRandom__factory.d.ts.map