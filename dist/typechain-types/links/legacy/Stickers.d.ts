import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export interface StickersInterface extends utils.Interface {
    functions: {
        "acceptRequest(address,uint32)": FunctionFragment;
        "addRequest(bytes)": FunctionFragment;
        "approvalCount()": FunctionFragment;
        "approved(address)": FunctionFragment;
        "currentStickerId()": FunctionFragment;
        "currentTokenId()": FunctionFragment;
        "denyRequest(address,uint32)": FunctionFragment;
        "deployer()": FunctionFragment;
        "erc721()": FunctionFragment;
        "getIntegrity()": FunctionFragment;
        "getMyRequests()": FunctionFragment;
        "getRequestCount()": FunctionFragment;
        "getRequests()": FunctionFragment;
        "getSticker(uint32)": FunctionFragment;
        "getStickerCount()": FunctionFragment;
        "getStickers()": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "isStickerFlagged(uint32)": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "multiRevoke(address[])": FunctionFragment;
        "openRequests(uint256)": FunctionFragment;
        "profitWallet()": FunctionFragment;
        "setEnabled(bool)": FunctionFragment;
        "setFlaggedSticker(uint32,bool,string)": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "setStickerPrice(uint256)": FunctionFragment;
        "stickerPrice()": FunctionFragment;
        "totalSupply()": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "valuesController()": FunctionFragment;
        "verifyAuthenticity()": FunctionFragment;
        "versionType()": FunctionFragment;
        "withdrawRequest(uint32)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "acceptRequest" | "addRequest" | "approvalCount" | "approved" | "currentStickerId" | "currentTokenId" | "denyRequest" | "deployer" | "erc721" | "getIntegrity" | "getMyRequests" | "getRequestCount" | "getRequests" | "getSticker" | "getStickerCount" | "getStickers" | "isAuthenticated" | "isStickerFlagged" | "multiApprove" | "multiRevoke" | "openRequests" | "profitWallet" | "setEnabled" | "setFlaggedSticker" | "setPrivilages" | "setStickerPrice" | "stickerPrice" | "totalSupply" | "transferOwnership" | "valuesController" | "verifyAuthenticity" | "versionType" | "withdrawRequest"): FunctionFragment;
    encodeFunctionData(functionFragment: "acceptRequest", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "addRequest", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "approvalCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "currentStickerId", values?: undefined): string;
    encodeFunctionData(functionFragment: "currentTokenId", values?: undefined): string;
    encodeFunctionData(functionFragment: "denyRequest", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "erc721", values?: undefined): string;
    encodeFunctionData(functionFragment: "getIntegrity", values?: undefined): string;
    encodeFunctionData(functionFragment: "getMyRequests", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRequestCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRequests", values?: undefined): string;
    encodeFunctionData(functionFragment: "getSticker", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getStickerCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "getStickers", values?: undefined): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isStickerFlagged", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "multiRevoke", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "openRequests", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "profitWallet", values?: undefined): string;
    encodeFunctionData(functionFragment: "setEnabled", values: [PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setFlaggedSticker", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<boolean>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setStickerPrice", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "stickerPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "valuesController", values?: undefined): string;
    encodeFunctionData(functionFragment: "verifyAuthenticity", values?: undefined): string;
    encodeFunctionData(functionFragment: "versionType", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdrawRequest", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "acceptRequest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addRequest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approvalCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "currentStickerId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "currentTokenId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "denyRequest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "erc721", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getIntegrity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMyRequests", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRequestCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRequests", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSticker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStickerCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStickers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isStickerFlagged", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiRevoke", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "openRequests", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "profitWallet", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setEnabled", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFlaggedSticker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setStickerPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stickerPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "valuesController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyAuthenticity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "versionType", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawRequest", data: BytesLike): Result;
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
export interface Stickers extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: StickersInterface;
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
        acceptRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        addRequest(packed: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        approvalCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        currentStickerId(overrides?: CallOverrides): Promise<[number]>;
        currentTokenId(overrides?: CallOverrides): Promise<[number]>;
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        deployer(overrides?: CallOverrides): Promise<[string]>;
        erc721(overrides?: CallOverrides): Promise<[string]>;
        getIntegrity(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getMyRequests(overrides?: CallOverrides): Promise<[string[]] & {
            result: string[];
        }>;
        getRequestCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        getRequests(overrides?: CallOverrides): Promise<[string[]] & {
            result: string[];
        }>;
        getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string] & {
            result: string;
        }>;
        getStickerCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        getStickers(overrides?: CallOverrides): Promise<[number[]] & {
            result: number[];
        }>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isStickerFlagged(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean, string]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        openRequests(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        profitWallet(overrides?: CallOverrides): Promise<[string]>;
        setEnabled(isEnabled: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setFlaggedSticker(stickerId: PromiseOrValue<BigNumberish>, isFlagged: PromiseOrValue<boolean>, reason: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setStickerPrice(price: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        stickerPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
        totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        valuesController(overrides?: CallOverrides): Promise<[string]>;
        verifyAuthenticity(overrides?: CallOverrides): Promise<[boolean]>;
        versionType(overrides?: CallOverrides): Promise<[string]>;
        withdrawRequest(index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    acceptRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    addRequest(packed: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    currentStickerId(overrides?: CallOverrides): Promise<number>;
    currentTokenId(overrides?: CallOverrides): Promise<number>;
    denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    deployer(overrides?: CallOverrides): Promise<string>;
    erc721(overrides?: CallOverrides): Promise<string>;
    getIntegrity(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getMyRequests(overrides?: CallOverrides): Promise<string[]>;
    getRequestCount(overrides?: CallOverrides): Promise<BigNumber>;
    getRequests(overrides?: CallOverrides): Promise<string[]>;
    getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getStickerCount(overrides?: CallOverrides): Promise<BigNumber>;
    getStickers(overrides?: CallOverrides): Promise<number[]>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isStickerFlagged(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean, string]>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    openRequests(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    profitWallet(overrides?: CallOverrides): Promise<string>;
    setEnabled(isEnabled: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setFlaggedSticker(stickerId: PromiseOrValue<BigNumberish>, isFlagged: PromiseOrValue<boolean>, reason: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setStickerPrice(price: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    stickerPrice(overrides?: CallOverrides): Promise<BigNumber>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    valuesController(overrides?: CallOverrides): Promise<string>;
    verifyAuthenticity(overrides?: CallOverrides): Promise<boolean>;
    versionType(overrides?: CallOverrides): Promise<string>;
    withdrawRequest(index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        acceptRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        addRequest(packed: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        currentStickerId(overrides?: CallOverrides): Promise<number>;
        currentTokenId(overrides?: CallOverrides): Promise<number>;
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        deployer(overrides?: CallOverrides): Promise<string>;
        erc721(overrides?: CallOverrides): Promise<string>;
        getIntegrity(overrides?: CallOverrides): Promise<[
            string,
            string,
            BigNumber,
            string,
            string
        ] & {
            from: string;
            owner: string;
            tokenId: BigNumber;
            versionType: string;
            intefaceId: string;
        }>;
        getMyRequests(overrides?: CallOverrides): Promise<string[]>;
        getRequestCount(overrides?: CallOverrides): Promise<BigNumber>;
        getRequests(overrides?: CallOverrides): Promise<string[]>;
        getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getStickerCount(overrides?: CallOverrides): Promise<BigNumber>;
        getStickers(overrides?: CallOverrides): Promise<number[]>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isStickerFlagged(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean, string]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        openRequests(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        profitWallet(overrides?: CallOverrides): Promise<string>;
        setEnabled(isEnabled: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setFlaggedSticker(stickerId: PromiseOrValue<BigNumberish>, isFlagged: PromiseOrValue<boolean>, reason: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setStickerPrice(price: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        stickerPrice(overrides?: CallOverrides): Promise<BigNumber>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        valuesController(overrides?: CallOverrides): Promise<string>;
        verifyAuthenticity(overrides?: CallOverrides): Promise<boolean>;
        versionType(overrides?: CallOverrides): Promise<string>;
        withdrawRequest(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "PermissionChange(address,address,bool)"(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        PermissionChange(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        "TransferedOwnership(address,address)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
        TransferedOwnership(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
    };
    estimateGas: {
        acceptRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        addRequest(packed: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        currentStickerId(overrides?: CallOverrides): Promise<BigNumber>;
        currentTokenId(overrides?: CallOverrides): Promise<BigNumber>;
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<BigNumber>;
        erc721(overrides?: CallOverrides): Promise<BigNumber>;
        getIntegrity(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getMyRequests(overrides?: CallOverrides): Promise<BigNumber>;
        getRequestCount(overrides?: CallOverrides): Promise<BigNumber>;
        getRequests(overrides?: CallOverrides): Promise<BigNumber>;
        getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getStickerCount(overrides?: CallOverrides): Promise<BigNumber>;
        getStickers(overrides?: CallOverrides): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isStickerFlagged(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        openRequests(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        profitWallet(overrides?: CallOverrides): Promise<BigNumber>;
        setEnabled(isEnabled: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setFlaggedSticker(stickerId: PromiseOrValue<BigNumberish>, isFlagged: PromiseOrValue<boolean>, reason: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setStickerPrice(price: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        stickerPrice(overrides?: CallOverrides): Promise<BigNumber>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        valuesController(overrides?: CallOverrides): Promise<BigNumber>;
        verifyAuthenticity(overrides?: CallOverrides): Promise<BigNumber>;
        versionType(overrides?: CallOverrides): Promise<BigNumber>;
        withdrawRequest(index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        acceptRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        addRequest(packed: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        approvalCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        currentStickerId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        currentTokenId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        erc721(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getIntegrity(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getMyRequests(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRequestCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRequests(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStickerCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStickers(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isStickerFlagged(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        openRequests(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        profitWallet(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setEnabled(isEnabled: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setFlaggedSticker(stickerId: PromiseOrValue<BigNumberish>, isFlagged: PromiseOrValue<boolean>, reason: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setStickerPrice(price: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        stickerPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        valuesController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        verifyAuthenticity(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        versionType(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        withdrawRequest(index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=Stickers.d.ts.map