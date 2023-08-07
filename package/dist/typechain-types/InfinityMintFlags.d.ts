import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export interface InfinityMintFlagsInterface extends utils.Interface {
    functions: {
        "approvalCount()": FunctionFragment;
        "approved(address)": FunctionFragment;
        "deployer()": FunctionFragment;
        "getOption(string)": FunctionFragment;
        "hasOption(string)": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "isFlagTrue(uint256,string)": FunctionFragment;
        "isGlobalFlag(string)": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "multiRevoke(address[])": FunctionFragment;
        "setFlag(uint256,string,bool)": FunctionFragment;
        "setGlobalFlag(string,bool)": FunctionFragment;
        "setOption(string,string)": FunctionFragment;
        "setOptions(string[],string[])": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "approvalCount" | "approved" | "deployer" | "getOption" | "hasOption" | "isAuthenticated" | "isFlagTrue" | "isGlobalFlag" | "multiApprove" | "multiRevoke" | "setFlag" | "setGlobalFlag" | "setOption" | "setOptions" | "setPrivilages" | "transferOwnership"): FunctionFragment;
    encodeFunctionData(functionFragment: "approvalCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "getOption", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "hasOption", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isFlagTrue", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isGlobalFlag", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "multiRevoke", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "setFlag", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<boolean>
    ]): string;
    encodeFunctionData(functionFragment: "setGlobalFlag", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setOption", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setOptions", values: [PromiseOrValue<string>[], PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "approvalCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOption", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hasOption", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isFlagTrue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isGlobalFlag", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiRevoke", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFlag", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setGlobalFlag", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOption", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOptions", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    events: {
        "PermissionChange(address,address,bool)": EventFragment;
        "TransferedOwnership(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "PermissionChange"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferedOwnership"): EventFragment;
}
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
export interface TransferedOwnershipEventObject {
    from: string;
    to: string;
}
export type TransferedOwnershipEvent = TypedEvent<[
    string,
    string
], TransferedOwnershipEventObject>;
export type TransferedOwnershipEventFilter = TypedEventFilter<TransferedOwnershipEvent>;
export interface InfinityMintFlags extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: InfinityMintFlagsInterface;
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
        deployer(overrides?: CallOverrides): Promise<[string]>;
        getOption(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        hasOption(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isFlagTrue(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isGlobalFlag(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setFlag(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setGlobalFlag(key: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setOption(key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setOptions(keys: PromiseOrValue<string>[], options: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    deployer(overrides?: CallOverrides): Promise<string>;
    getOption(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    hasOption(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isFlagTrue(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isGlobalFlag(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setFlag(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setGlobalFlag(key: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setOption(key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setOptions(keys: PromiseOrValue<string>[], options: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        deployer(overrides?: CallOverrides): Promise<string>;
        getOption(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        hasOption(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isFlagTrue(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isGlobalFlag(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        setFlag(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setGlobalFlag(key: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setOption(key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setOptions(keys: PromiseOrValue<string>[], options: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "PermissionChange(address,address,bool)"(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        PermissionChange(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        "TransferedOwnership(address,address)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
        TransferedOwnership(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
    };
    estimateGas: {
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<BigNumber>;
        getOption(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        hasOption(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isFlagTrue(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isGlobalFlag(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setFlag(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setGlobalFlag(key: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setOption(key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setOptions(keys: PromiseOrValue<string>[], options: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        approvalCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getOption(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hasOption(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isFlagTrue(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isGlobalFlag(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setFlag(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setGlobalFlag(key: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setOption(key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setOptions(keys: PromiseOrValue<string>[], options: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=InfinityMintFlags.d.ts.map