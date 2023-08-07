import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export declare namespace InfinityMintLinker {
    type LinkStruct = {
        index: PromiseOrValue<BigNumberish>;
        versionType: PromiseOrValue<BytesLike>;
        interfaceId: PromiseOrValue<BytesLike>;
        key: PromiseOrValue<string>;
        erc721: PromiseOrValue<boolean>;
        verifyIntegrity: PromiseOrValue<boolean>;
        forcedOnly: PromiseOrValue<boolean>;
        permanent: PromiseOrValue<boolean>;
        active: PromiseOrValue<boolean>;
    };
    type LinkStructOutput = [
        BigNumber,
        string,
        string,
        string,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean
    ] & {
        index: BigNumber;
        versionType: string;
        interfaceId: string;
        key: string;
        erc721: boolean;
        verifyIntegrity: boolean;
        forcedOnly: boolean;
        permanent: boolean;
        active: boolean;
    };
}
export interface InfinityMintLinkerInterface extends utils.Interface {
    functions: {
        "addSupport(uint256,string,bytes,bool,bool,bool,bool)": FunctionFragment;
        "approvalCount()": FunctionFragment;
        "approved(address)": FunctionFragment;
        "changeLinkKey(string,string)": FunctionFragment;
        "clearLinks()": FunctionFragment;
        "deployer()": FunctionFragment;
        "erc721Location()": FunctionFragment;
        "forceLink(uint256,string,address)": FunctionFragment;
        "getLink(uint256)": FunctionFragment;
        "getLinkByKey(string)": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "multiRevoke(address[])": FunctionFragment;
        "setLink(uint256,string,address)": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "toggleSupport(uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "unlink(uint256,string)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "addSupport" | "approvalCount" | "approved" | "changeLinkKey" | "clearLinks" | "deployer" | "erc721Location" | "forceLink" | "getLink" | "getLinkByKey" | "isAuthenticated" | "multiApprove" | "multiRevoke" | "setLink" | "setPrivilages" | "toggleSupport" | "transferOwnership" | "unlink"): FunctionFragment;
    encodeFunctionData(functionFragment: "addSupport", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<boolean>,
        PromiseOrValue<boolean>,
        PromiseOrValue<boolean>,
        PromiseOrValue<boolean>
    ]): string;
    encodeFunctionData(functionFragment: "approvalCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "changeLinkKey", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "clearLinks", values?: undefined): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "erc721Location", values?: undefined): string;
    encodeFunctionData(functionFragment: "forceLink", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "getLink", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getLinkByKey", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "multiRevoke", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "setLink", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "toggleSupport", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "unlink", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "addSupport", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approvalCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeLinkKey", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "clearLinks", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "erc721Location", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "forceLink", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLink", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLinkByKey", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiRevoke", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setLink", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "toggleSupport", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unlink", data: BytesLike): Result;
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
export interface InfinityMintLinker extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: InfinityMintLinkerInterface;
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
        addSupport(index: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, versionType: PromiseOrValue<BytesLike>, isErc721: PromiseOrValue<boolean>, verifyIntegrity: PromiseOrValue<boolean>, forcedOnly: PromiseOrValue<boolean>, permanent: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        approvalCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        changeLinkKey(keyToChange: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        clearLinks(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        deployer(overrides?: CallOverrides): Promise<[string]>;
        erc721Location(overrides?: CallOverrides): Promise<[string]>;
        forceLink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, destination: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getLink(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[InfinityMintLinker.LinkStructOutput]>;
        getLinkByKey(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[InfinityMintLinker.LinkStructOutput]>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setLink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, destination: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        toggleSupport(index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        unlink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    addSupport(index: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, versionType: PromiseOrValue<BytesLike>, isErc721: PromiseOrValue<boolean>, verifyIntegrity: PromiseOrValue<boolean>, forcedOnly: PromiseOrValue<boolean>, permanent: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    changeLinkKey(keyToChange: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    clearLinks(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    deployer(overrides?: CallOverrides): Promise<string>;
    erc721Location(overrides?: CallOverrides): Promise<string>;
    forceLink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, destination: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getLink(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintLinker.LinkStructOutput>;
    getLinkByKey(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<InfinityMintLinker.LinkStructOutput>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setLink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, destination: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    toggleSupport(index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    unlink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        addSupport(index: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, versionType: PromiseOrValue<BytesLike>, isErc721: PromiseOrValue<boolean>, verifyIntegrity: PromiseOrValue<boolean>, forcedOnly: PromiseOrValue<boolean>, permanent: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        changeLinkKey(keyToChange: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        clearLinks(overrides?: CallOverrides): Promise<void>;
        deployer(overrides?: CallOverrides): Promise<string>;
        erc721Location(overrides?: CallOverrides): Promise<string>;
        forceLink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, destination: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        getLink(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintLinker.LinkStructOutput>;
        getLinkByKey(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<InfinityMintLinker.LinkStructOutput>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        setLink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, destination: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        toggleSupport(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        unlink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "PermissionChange(address,address,bool)"(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        PermissionChange(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        "TransferedOwnership(address,address)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
        TransferedOwnership(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
    };
    estimateGas: {
        addSupport(index: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, versionType: PromiseOrValue<BytesLike>, isErc721: PromiseOrValue<boolean>, verifyIntegrity: PromiseOrValue<boolean>, forcedOnly: PromiseOrValue<boolean>, permanent: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        changeLinkKey(keyToChange: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        clearLinks(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<BigNumber>;
        erc721Location(overrides?: CallOverrides): Promise<BigNumber>;
        forceLink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, destination: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getLink(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getLinkByKey(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setLink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, destination: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        toggleSupport(index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        unlink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        addSupport(index: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, versionType: PromiseOrValue<BytesLike>, isErc721: PromiseOrValue<boolean>, verifyIntegrity: PromiseOrValue<boolean>, forcedOnly: PromiseOrValue<boolean>, permanent: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        approvalCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        changeLinkKey(keyToChange: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        clearLinks(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        erc721Location(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        forceLink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, destination: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getLink(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getLinkByKey(key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setLink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, destination: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        toggleSupport(index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        unlink(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=InfinityMintLinker.d.ts.map