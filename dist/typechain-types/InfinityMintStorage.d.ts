import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export declare namespace InfinityMintObject {
    type InfinityObjectStruct = {
        pathId: PromiseOrValue<BigNumberish>;
        currentTokenId: PromiseOrValue<BigNumberish>;
        owner: PromiseOrValue<string>;
        colours: PromiseOrValue<BigNumberish>[];
        mintData: PromiseOrValue<BytesLike>;
        assets: PromiseOrValue<BigNumberish>[];
        names: PromiseOrValue<BigNumberish>[];
        destinations: PromiseOrValue<string>[];
    };
    type InfinityObjectStructOutput = [
        number,
        number,
        string,
        number[],
        string,
        number[],
        number[],
        string[]
    ] & {
        pathId: number;
        currentTokenId: number;
        owner: string;
        colours: number[];
        mintData: string;
        assets: number[];
        names: number[];
        destinations: string[];
    };
}
export interface InfinityMintStorageInterface extends utils.Interface {
    functions: {
        "addToRegisteredTokens(address,uint32)": FunctionFragment;
        "approvalCount()": FunctionFragment;
        "approved(address)": FunctionFragment;
        "deleteFromRegisteredTokens(address,uint32)": FunctionFragment;
        "deleteOption(address,string)": FunctionFragment;
        "deletePreview(address,uint256)": FunctionFragment;
        "deployer()": FunctionFragment;
        "findPreviews(address,uint256)": FunctionFragment;
        "flag(address,string)": FunctionFragment;
        "flag(uint256,string)": FunctionFragment;
        "get(uint32)": FunctionFragment;
        "getAllRegisteredTokens(address)": FunctionFragment;
        "getOption(address,string)": FunctionFragment;
        "getOwner(uint32)": FunctionFragment;
        "getPreviewAt(address,uint256)": FunctionFragment;
        "getPreviewTimestamp(address)": FunctionFragment;
        "getRegisteredTokenCount(address)": FunctionFragment;
        "hasDestinaton(uint32,uint256)": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "multiRevoke(address[])": FunctionFragment;
        "previewTimestamp(address)": FunctionFragment;
        "previews(address,uint256)": FunctionFragment;
        "set(uint32,(uint32,uint32,address,uint32[],bytes,uint32[],uint32[],address[]))": FunctionFragment;
        "setFlag(address,string,bool)": FunctionFragment;
        "setOption(address,string,string)": FunctionFragment;
        "setPreview(address,uint256,(uint32,uint32,address,uint32[],bytes,uint32[],uint32[],address[]))": FunctionFragment;
        "setPreviewTimestamp(address,uint256)": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "setTokenFlag(uint256,string,bool)": FunctionFragment;
        "setUnsafe(uint32,bytes)": FunctionFragment;
        "tokenFlag(uint32,string)": FunctionFragment;
        "tokenFlags(uint256,string)": FunctionFragment;
        "transfer(address,uint32)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "validDestination(uint32,uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "addToRegisteredTokens" | "approvalCount" | "approved" | "deleteFromRegisteredTokens" | "deleteOption" | "deletePreview" | "deployer" | "findPreviews" | "flag(address,string)" | "flag(uint256,string)" | "get" | "getAllRegisteredTokens" | "getOption" | "getOwner" | "getPreviewAt" | "getPreviewTimestamp" | "getRegisteredTokenCount" | "hasDestinaton" | "isAuthenticated" | "multiApprove" | "multiRevoke" | "previewTimestamp" | "previews" | "set" | "setFlag" | "setOption" | "setPreview" | "setPreviewTimestamp" | "setPrivilages" | "setTokenFlag" | "setUnsafe" | "tokenFlag" | "tokenFlags" | "transfer" | "transferOwnership" | "validDestination"): FunctionFragment;
    encodeFunctionData(functionFragment: "addToRegisteredTokens", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "approvalCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "deleteFromRegisteredTokens", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "deleteOption", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "deletePreview", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "findPreviews", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "flag(address,string)", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "flag(uint256,string)", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "get", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getAllRegisteredTokens", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getOption", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getOwner", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getPreviewAt", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getPreviewTimestamp", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getRegisteredTokenCount", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "hasDestinaton", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "multiRevoke", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "previewTimestamp", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "previews", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "set", values: [
        PromiseOrValue<BigNumberish>,
        InfinityMintObject.InfinityObjectStruct
    ]): string;
    encodeFunctionData(functionFragment: "setFlag", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<boolean>
    ]): string;
    encodeFunctionData(functionFragment: "setOption", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "setPreview", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        InfinityMintObject.InfinityObjectStruct
    ]): string;
    encodeFunctionData(functionFragment: "setPreviewTimestamp", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setTokenFlag", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<boolean>
    ]): string;
    encodeFunctionData(functionFragment: "setUnsafe", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "tokenFlag", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "tokenFlags", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "transfer", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "validDestination", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "addToRegisteredTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approvalCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deleteFromRegisteredTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deleteOption", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deletePreview", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "findPreviews", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "flag(address,string)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "flag(uint256,string)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAllRegisteredTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOption", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPreviewAt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPreviewTimestamp", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRegisteredTokenCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hasDestinaton", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiRevoke", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "previewTimestamp", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "previews", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "set", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFlag", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOption", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPreview", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPreviewTimestamp", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setTokenFlag", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setUnsafe", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenFlag", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenFlags", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validDestination", data: BytesLike): Result;
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
export interface InfinityMintStorage extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: InfinityMintStorageInterface;
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
        addToRegisteredTokens(owner: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        approvalCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        deleteFromRegisteredTokens(owner: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        deleteOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        deletePreview(owner: PromiseOrValue<string>, previewCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        deployer(overrides?: CallOverrides): Promise<[string]>;
        findPreviews(owner: PromiseOrValue<string>, previewCount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[InfinityMintObject.InfinityObjectStructOutput[]]>;
        "flag(address,string)"(addr: PromiseOrValue<string>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        "flag(uint256,string)"(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[InfinityMintObject.InfinityObjectStructOutput]>;
        getAllRegisteredTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number[]]>;
        getOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getOwner(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getPreviewAt(owner: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[InfinityMintObject.InfinityObjectStructOutput]>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getRegisteredTokenCount(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        hasDestinaton(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        previewTimestamp(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        previews(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            number,
            number,
            string,
            string
        ] & {
            pathId: number;
            currentTokenId: number;
            owner: string;
            mintData: string;
        }>;
        set(tokenId: PromiseOrValue<BigNumberish>, data: InfinityMintObject.InfinityObjectStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setFlag(addr: PromiseOrValue<string>, _flag: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPreview(owner: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, data: InfinityMintObject.InfinityObjectStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPreviewTimestamp(addr: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setTokenFlag(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setUnsafe(tokenId: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        tokenFlag(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        tokenFlags(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        transfer(to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        validDestination(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
    };
    addToRegisteredTokens(owner: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    deleteFromRegisteredTokens(owner: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    deleteOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    deletePreview(owner: PromiseOrValue<string>, previewCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    deployer(overrides?: CallOverrides): Promise<string>;
    findPreviews(owner: PromiseOrValue<string>, previewCount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput[]>;
    "flag(address,string)"(addr: PromiseOrValue<string>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    "flag(uint256,string)"(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
    getAllRegisteredTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
    getOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getOwner(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getPreviewAt(owner: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
    getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getRegisteredTokenCount(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    hasDestinaton(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    previewTimestamp(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    previews(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        number,
        number,
        string,
        string
    ] & {
        pathId: number;
        currentTokenId: number;
        owner: string;
        mintData: string;
    }>;
    set(tokenId: PromiseOrValue<BigNumberish>, data: InfinityMintObject.InfinityObjectStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setFlag(addr: PromiseOrValue<string>, _flag: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPreview(owner: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, data: InfinityMintObject.InfinityObjectStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPreviewTimestamp(addr: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setTokenFlag(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setUnsafe(tokenId: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    tokenFlag(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    tokenFlags(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    transfer(to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    validDestination(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        addToRegisteredTokens(owner: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        deleteFromRegisteredTokens(owner: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        deleteOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        deletePreview(owner: PromiseOrValue<string>, previewCount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        deployer(overrides?: CallOverrides): Promise<string>;
        findPreviews(owner: PromiseOrValue<string>, previewCount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput[]>;
        "flag(address,string)"(addr: PromiseOrValue<string>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        "flag(uint256,string)"(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
        getAllRegisteredTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
        getOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getOwner(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getPreviewAt(owner: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getRegisteredTokenCount(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        hasDestinaton(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        previewTimestamp(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        previews(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            number,
            number,
            string,
            string
        ] & {
            pathId: number;
            currentTokenId: number;
            owner: string;
            mintData: string;
        }>;
        set(tokenId: PromiseOrValue<BigNumberish>, data: InfinityMintObject.InfinityObjectStruct, overrides?: CallOverrides): Promise<void>;
        setFlag(addr: PromiseOrValue<string>, _flag: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPreview(owner: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, data: InfinityMintObject.InfinityObjectStruct, overrides?: CallOverrides): Promise<void>;
        setPreviewTimestamp(addr: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setTokenFlag(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setUnsafe(tokenId: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        tokenFlag(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        tokenFlags(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        transfer(to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        validDestination(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {
        "PermissionChange(address,address,bool)"(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        PermissionChange(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        "TransferedOwnership(address,address)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
        TransferedOwnership(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
    };
    estimateGas: {
        addToRegisteredTokens(owner: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        deleteFromRegisteredTokens(owner: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        deleteOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        deletePreview(owner: PromiseOrValue<string>, previewCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<BigNumber>;
        findPreviews(owner: PromiseOrValue<string>, previewCount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        "flag(address,string)"(addr: PromiseOrValue<string>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        "flag(uint256,string)"(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getAllRegisteredTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getOwner(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreviewAt(owner: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getRegisteredTokenCount(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        hasDestinaton(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        previewTimestamp(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        previews(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        set(tokenId: PromiseOrValue<BigNumberish>, data: InfinityMintObject.InfinityObjectStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setFlag(addr: PromiseOrValue<string>, _flag: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPreview(owner: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, data: InfinityMintObject.InfinityObjectStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPreviewTimestamp(addr: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setTokenFlag(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setUnsafe(tokenId: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        tokenFlag(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        tokenFlags(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        transfer(to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        validDestination(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        addToRegisteredTokens(owner: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        approvalCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deleteFromRegisteredTokens(owner: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        deleteOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        deletePreview(owner: PromiseOrValue<string>, previewCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        findPreviews(owner: PromiseOrValue<string>, previewCount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "flag(address,string)"(addr: PromiseOrValue<string>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "flag(uint256,string)"(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getAllRegisteredTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getOwner(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPreviewAt(owner: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRegisteredTokenCount(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hasDestinaton(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        previewTimestamp(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        previews(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        set(tokenId: PromiseOrValue<BigNumberish>, data: InfinityMintObject.InfinityObjectStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setFlag(addr: PromiseOrValue<string>, _flag: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setOption(addr: PromiseOrValue<string>, key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPreview(owner: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, data: InfinityMintObject.InfinityObjectStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPreviewTimestamp(addr: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setTokenFlag(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, position: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setUnsafe(tokenId: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        tokenFlag(tokenId: PromiseOrValue<BigNumberish>, _flag: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokenFlags(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transfer(to: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        validDestination(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=InfinityMintStorage.d.ts.map