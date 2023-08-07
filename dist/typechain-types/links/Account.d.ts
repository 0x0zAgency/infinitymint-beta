import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface AccountInterface extends utils.Interface {
    functions: {
        "approvalCount()": FunctionFragment;
        "approved(address)": FunctionFragment;
        "availableBalance()": FunctionFragment;
        "call(address,bytes)": FunctionFragment;
        "call(address,uint256,bytes)": FunctionFragment;
        "delegateCall(address,bytes)": FunctionFragment;
        "deployer()": FunctionFragment;
        "deposit()": FunctionFragment;
        "empty()": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "multiRevoke(address[])": FunctionFragment;
        "onERC721Received(address,address,uint256,bytes)": FunctionFragment;
        "send(address,uint256)": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "staticCall(address,bytes)": FunctionFragment;
        "transfer(address,address,uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "withdraw(uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "approvalCount" | "approved" | "availableBalance" | "call(address,bytes)" | "call(address,uint256,bytes)" | "delegateCall" | "deployer" | "deposit" | "empty" | "isAuthenticated" | "multiApprove" | "multiRevoke" | "onERC721Received" | "send" | "setPrivilages" | "staticCall" | "transfer" | "transferOwnership" | "withdraw"): FunctionFragment;
    encodeFunctionData(functionFragment: "approvalCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "availableBalance", values?: undefined): string;
    encodeFunctionData(functionFragment: "call(address,bytes)", values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "call(address,uint256,bytes)", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "delegateCall", values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "deposit", values?: undefined): string;
    encodeFunctionData(functionFragment: "empty", values?: undefined): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "multiRevoke", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "onERC721Received", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "send", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "staticCall", values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "transfer", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "withdraw", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "approvalCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "availableBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "call(address,bytes)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "call(address,uint256,bytes)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "delegateCall", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "empty", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiRevoke", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC721Received", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "staticCall", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
    events: {
        "Deposit(address,uint256,uint256)": EventFragment;
        "PermissionChange(address,address,bool)": EventFragment;
        "Transfer(address,uint256,uint256)": EventFragment;
        "TransferedOwnership(address,address)": EventFragment;
        "Withdraw(address,uint256,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PermissionChange"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferedOwnership"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}
export interface DepositEventObject {
    sender: string;
    amount: BigNumber;
    newTotal: BigNumber;
}
export type DepositEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], DepositEventObject>;
export type DepositEventFilter = TypedEventFilter<DepositEvent>;
export interface PermissionChangeEventObject {
    sender: string;
    changee: string;
    value: boolean;
}
export type PermissionChangeEvent = TypedEvent<[
    string,
    string,
    boolean
], PermissionChangeEventObject>;
export type PermissionChangeEventFilter = TypedEventFilter<PermissionChangeEvent>;
export interface TransferEventObject {
    sender: string;
    amount: BigNumber;
    newTotal: BigNumber;
}
export type TransferEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], TransferEventObject>;
export type TransferEventFilter = TypedEventFilter<TransferEvent>;
export interface TransferedOwnershipEventObject {
    from: string;
    to: string;
}
export type TransferedOwnershipEvent = TypedEvent<[
    string,
    string
], TransferedOwnershipEventObject>;
export type TransferedOwnershipEventFilter = TypedEventFilter<TransferedOwnershipEvent>;
export interface WithdrawEventObject {
    sender: string;
    amount: BigNumber;
    newTotal: BigNumber;
}
export type WithdrawEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], WithdrawEventObject>;
export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;
export interface Account extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: AccountInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        approvalCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        availableBalance(overrides?: CallOverrides): Promise<[BigNumber]>;
        "call(address,bytes)"(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "call(address,uint256,bytes)"(to: PromiseOrValue<string>, value: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        delegateCall(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        deployer(overrides?: CallOverrides): Promise<[string]>;
        deposit(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        empty(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        onERC721Received(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<string>, arg2: PromiseOrValue<BigNumberish>, arg3: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        send(to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        staticCall(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean, string]>;
        transfer(erc721Destination: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdraw(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    availableBalance(overrides?: CallOverrides): Promise<BigNumber>;
    "call(address,bytes)"(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "call(address,uint256,bytes)"(to: PromiseOrValue<string>, value: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    delegateCall(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    deployer(overrides?: CallOverrides): Promise<string>;
    deposit(overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    empty(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    onERC721Received(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<string>, arg2: PromiseOrValue<BigNumberish>, arg3: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    send(to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    staticCall(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean, string]>;
    transfer(erc721Destination: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdraw(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        availableBalance(overrides?: CallOverrides): Promise<BigNumber>;
        "call(address,bytes)"(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean, string]>;
        "call(address,uint256,bytes)"(to: PromiseOrValue<string>, value: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean, string]>;
        delegateCall(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean, string]>;
        deployer(overrides?: CallOverrides): Promise<string>;
        deposit(overrides?: CallOverrides): Promise<void>;
        empty(overrides?: CallOverrides): Promise<void>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        onERC721Received(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<string>, arg2: PromiseOrValue<BigNumberish>, arg3: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        send(to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        staticCall(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean, string]>;
        transfer(erc721Destination: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        withdraw(amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "Deposit(address,uint256,uint256)"(sender?: PromiseOrValue<string> | null, amount?: null, newTotal?: null): DepositEventFilter;
        Deposit(sender?: PromiseOrValue<string> | null, amount?: null, newTotal?: null): DepositEventFilter;
        "PermissionChange(address,address,bool)"(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        PermissionChange(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        "Transfer(address,uint256,uint256)"(sender?: PromiseOrValue<string> | null, amount?: null, newTotal?: null): TransferEventFilter;
        Transfer(sender?: PromiseOrValue<string> | null, amount?: null, newTotal?: null): TransferEventFilter;
        "TransferedOwnership(address,address)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
        TransferedOwnership(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
        "Withdraw(address,uint256,uint256)"(sender?: PromiseOrValue<string> | null, amount?: null, newTotal?: null): WithdrawEventFilter;
        Withdraw(sender?: PromiseOrValue<string> | null, amount?: null, newTotal?: null): WithdrawEventFilter;
    };
    estimateGas: {
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        availableBalance(overrides?: CallOverrides): Promise<BigNumber>;
        "call(address,bytes)"(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "call(address,uint256,bytes)"(to: PromiseOrValue<string>, value: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        delegateCall(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<BigNumber>;
        deposit(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        empty(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        onERC721Received(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<string>, arg2: PromiseOrValue<BigNumberish>, arg3: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        send(to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        staticCall(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        transfer(erc721Destination: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdraw(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        approvalCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        availableBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "call(address,bytes)"(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "call(address,uint256,bytes)"(to: PromiseOrValue<string>, value: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        delegateCall(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deposit(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        empty(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        onERC721Received(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<string>, arg2: PromiseOrValue<BigNumberish>, arg3: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        send(to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        staticCall(to: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transfer(erc721Destination: PromiseOrValue<string>, to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdraw(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=Account.d.ts.map