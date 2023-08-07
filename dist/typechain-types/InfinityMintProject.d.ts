import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export interface InfinityMintProjectInterface extends utils.Interface {
    functions: {
        "approvalCount()": FunctionFragment;
        "approved(address)": FunctionFragment;
        "deployer()": FunctionFragment;
        "getCurrentTag()": FunctionFragment;
        "getCurrentVersion()": FunctionFragment;
        "getProject()": FunctionFragment;
        "getUpdates()": FunctionFragment;
        "getVersion(uint256)": FunctionFragment;
        "getVersions()": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "multiRevoke(address[])": FunctionFragment;
        "setInitialProject(bytes)": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "setVersion(uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "updateProject(bytes,bytes,bool)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "approvalCount" | "approved" | "deployer" | "getCurrentTag" | "getCurrentVersion" | "getProject" | "getUpdates" | "getVersion" | "getVersions" | "isAuthenticated" | "multiApprove" | "multiRevoke" | "setInitialProject" | "setPrivilages" | "setVersion" | "transferOwnership" | "updateProject"): FunctionFragment;
    encodeFunctionData(functionFragment: "approvalCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCurrentTag", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCurrentVersion", values?: undefined): string;
    encodeFunctionData(functionFragment: "getProject", values?: undefined): string;
    encodeFunctionData(functionFragment: "getUpdates", values?: undefined): string;
    encodeFunctionData(functionFragment: "getVersion", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getVersions", values?: undefined): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "multiRevoke", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "setInitialProject", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setVersion", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "updateProject", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<boolean>
    ]): string;
    decodeFunctionResult(functionFragment: "approvalCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrentTag", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrentVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getProject", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getUpdates", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getVersions", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiRevoke", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setInitialProject", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateProject", data: BytesLike): Result;
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
export interface InfinityMintProject extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: InfinityMintProjectInterface;
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
        getCurrentTag(overrides?: CallOverrides): Promise<[string]>;
        getCurrentVersion(overrides?: CallOverrides): Promise<[BigNumber]>;
        getProject(overrides?: CallOverrides): Promise<[string]>;
        getUpdates(overrides?: CallOverrides): Promise<[string[]] & {
            updates: string[];
        }>;
        getVersion(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            string,
            string
        ] & {
            encodedProject: string;
            encodedTag: string;
            encodedInitialProject: string;
        }>;
        getVersions(overrides?: CallOverrides): Promise<[BigNumber]>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setInitialProject(project: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setVersion(version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        updateProject(project: PromiseOrValue<BytesLike>, tag: PromiseOrValue<BytesLike>, setAsCurrentVersion: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    deployer(overrides?: CallOverrides): Promise<string>;
    getCurrentTag(overrides?: CallOverrides): Promise<string>;
    getCurrentVersion(overrides?: CallOverrides): Promise<BigNumber>;
    getProject(overrides?: CallOverrides): Promise<string>;
    getUpdates(overrides?: CallOverrides): Promise<string[]>;
    getVersion(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        string,
        string,
        string
    ] & {
        encodedProject: string;
        encodedTag: string;
        encodedInitialProject: string;
    }>;
    getVersions(overrides?: CallOverrides): Promise<BigNumber>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setInitialProject(project: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setVersion(version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    updateProject(project: PromiseOrValue<BytesLike>, tag: PromiseOrValue<BytesLike>, setAsCurrentVersion: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        deployer(overrides?: CallOverrides): Promise<string>;
        getCurrentTag(overrides?: CallOverrides): Promise<string>;
        getCurrentVersion(overrides?: CallOverrides): Promise<BigNumber>;
        getProject(overrides?: CallOverrides): Promise<string>;
        getUpdates(overrides?: CallOverrides): Promise<string[]>;
        getVersion(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            string,
            string
        ] & {
            encodedProject: string;
            encodedTag: string;
            encodedInitialProject: string;
        }>;
        getVersions(overrides?: CallOverrides): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        setInitialProject(project: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setVersion(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        updateProject(project: PromiseOrValue<BytesLike>, tag: PromiseOrValue<BytesLike>, setAsCurrentVersion: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
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
        getCurrentTag(overrides?: CallOverrides): Promise<BigNumber>;
        getCurrentVersion(overrides?: CallOverrides): Promise<BigNumber>;
        getProject(overrides?: CallOverrides): Promise<BigNumber>;
        getUpdates(overrides?: CallOverrides): Promise<BigNumber>;
        getVersion(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getVersions(overrides?: CallOverrides): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setInitialProject(project: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setVersion(version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        updateProject(project: PromiseOrValue<BytesLike>, tag: PromiseOrValue<BytesLike>, setAsCurrentVersion: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        approvalCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCurrentTag(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCurrentVersion(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getProject(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getUpdates(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getVersion(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getVersions(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setInitialProject(project: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setVersion(version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        updateProject(project: PromiseOrValue<BytesLike>, tag: PromiseOrValue<BytesLike>, setAsCurrentVersion: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=InfinityMintProject.d.ts.map