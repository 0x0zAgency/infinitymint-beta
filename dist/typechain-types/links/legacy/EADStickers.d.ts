import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export interface EADStickersInterface extends utils.Interface {
    functions: {
        "acceptRequest(address,uint32)": FunctionFragment;
        "addRequest(bytes)": FunctionFragment;
        "approvalCount()": FunctionFragment;
        "approve(address,uint256)": FunctionFragment;
        "approved(address)": FunctionFragment;
        "balanceOf(address)": FunctionFragment;
        "burn(uint32)": FunctionFragment;
        "currentStickerId()": FunctionFragment;
        "currentTokenId()": FunctionFragment;
        "denyRequest(address,uint32)": FunctionFragment;
        "deployer()": FunctionFragment;
        "erc721()": FunctionFragment;
        "erc721TokenId()": FunctionFragment;
        "exists(uint256)": FunctionFragment;
        "getApproved(uint256)": FunctionFragment;
        "getIntegrity()": FunctionFragment;
        "getMyRequests()": FunctionFragment;
        "getRequestCount()": FunctionFragment;
        "getRequests()": FunctionFragment;
        "getSticker(uint32)": FunctionFragment;
        "getStickerCount()": FunctionFragment;
        "getStickers()": FunctionFragment;
        "isApprovedForAll(address,address)": FunctionFragment;
        "isApprovedOrOwner(address,uint256)": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "isStickerFlagged(uint32)": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "multiRevoke(address[])": FunctionFragment;
        "name()": FunctionFragment;
        "openRequests(uint256)": FunctionFragment;
        "ownerOf(uint256)": FunctionFragment;
        "profitWallet()": FunctionFragment;
        "safeTransferFrom(address,address,uint256)": FunctionFragment;
        "safeTransferFrom(address,address,uint256,bytes)": FunctionFragment;
        "setApprovalForAll(address,bool)": FunctionFragment;
        "setEnabled(bool)": FunctionFragment;
        "setFlaggedSticker(uint32,bool,string)": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "setProfitWallet(address)": FunctionFragment;
        "setStickerPrice(uint256)": FunctionFragment;
        "stickerPrice()": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
        "symbol()": FunctionFragment;
        "tokenURI(uint256)": FunctionFragment;
        "totalSupply()": FunctionFragment;
        "transferFrom(address,address,uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "transferOwnershipToTokenOwner()": FunctionFragment;
        "updateSticker(uint32,bytes)": FunctionFragment;
        "valuesController()": FunctionFragment;
        "verifyAuthenticity()": FunctionFragment;
        "versionType()": FunctionFragment;
        "withdrawRequest(uint32)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "acceptRequest" | "addRequest" | "approvalCount" | "approve" | "approved" | "balanceOf" | "burn" | "currentStickerId" | "currentTokenId" | "denyRequest" | "deployer" | "erc721" | "erc721TokenId" | "exists" | "getApproved" | "getIntegrity" | "getMyRequests" | "getRequestCount" | "getRequests" | "getSticker" | "getStickerCount" | "getStickers" | "isApprovedForAll" | "isApprovedOrOwner" | "isAuthenticated" | "isStickerFlagged" | "multiApprove" | "multiRevoke" | "name" | "openRequests" | "ownerOf" | "profitWallet" | "safeTransferFrom(address,address,uint256)" | "safeTransferFrom(address,address,uint256,bytes)" | "setApprovalForAll" | "setEnabled" | "setFlaggedSticker" | "setPrivilages" | "setProfitWallet" | "setStickerPrice" | "stickerPrice" | "supportsInterface" | "symbol" | "tokenURI" | "totalSupply" | "transferFrom" | "transferOwnership" | "transferOwnershipToTokenOwner" | "updateSticker" | "valuesController" | "verifyAuthenticity" | "versionType" | "withdrawRequest"): FunctionFragment;
    encodeFunctionData(functionFragment: "acceptRequest", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "addRequest", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "approvalCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "approve", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "burn", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "currentStickerId", values?: undefined): string;
    encodeFunctionData(functionFragment: "currentTokenId", values?: undefined): string;
    encodeFunctionData(functionFragment: "denyRequest", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "erc721", values?: undefined): string;
    encodeFunctionData(functionFragment: "erc721TokenId", values?: undefined): string;
    encodeFunctionData(functionFragment: "exists", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getApproved", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getIntegrity", values?: undefined): string;
    encodeFunctionData(functionFragment: "getMyRequests", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRequestCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRequests", values?: undefined): string;
    encodeFunctionData(functionFragment: "getSticker", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getStickerCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "getStickers", values?: undefined): string;
    encodeFunctionData(functionFragment: "isApprovedForAll", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isApprovedOrOwner", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isStickerFlagged", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "multiRevoke", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "name", values?: undefined): string;
    encodeFunctionData(functionFragment: "openRequests", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "ownerOf", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "profitWallet", values?: undefined): string;
    encodeFunctionData(functionFragment: "safeTransferFrom(address,address,uint256)", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "safeTransferFrom(address,address,uint256,bytes)", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "setApprovalForAll", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setEnabled", values: [PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setFlaggedSticker", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<boolean>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setProfitWallet", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setStickerPrice", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "stickerPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokenURI", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferFrom", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "transferOwnershipToTokenOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "updateSticker", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "valuesController", values?: undefined): string;
    encodeFunctionData(functionFragment: "verifyAuthenticity", values?: undefined): string;
    encodeFunctionData(functionFragment: "versionType", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdrawRequest", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "acceptRequest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addRequest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approvalCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "currentStickerId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "currentTokenId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "denyRequest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "erc721", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "erc721TokenId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "exists", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getApproved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getIntegrity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMyRequests", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRequestCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRequests", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSticker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStickerCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStickers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isApprovedForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isApprovedOrOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isStickerFlagged", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiRevoke", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "openRequests", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "profitWallet", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom(address,address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom(address,address,uint256,bytes)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setApprovalForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setEnabled", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFlaggedSticker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setProfitWallet", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setStickerPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stickerPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnershipToTokenOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateSticker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "valuesController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyAuthenticity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "versionType", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawRequest", data: BytesLike): Result;
    events: {
        "Approval(address,address,uint256)": EventFragment;
        "ApprovalForAll(address,address,bool)": EventFragment;
        "EASRequestAccepted(uint32,address,uint256,bytes)": EventFragment;
        "EASRequestAdded(uint32,address,uint256,bytes)": EventFragment;
        "EASRequestDenied(uint32,address,uint256,bytes)": EventFragment;
        "EASRequestWithdrew(uint32,address,uint256,bytes)": EventFragment;
        "EASStickerUpdated(uint32,address,uint256,bytes)": EventFragment;
        "PermissionChange(address,address,bool)": EventFragment;
        "Transfer(address,address,uint256)": EventFragment;
        "TransferedOwnership(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "EASRequestAccepted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "EASRequestAdded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "EASRequestDenied"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "EASRequestWithdrew"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "EASStickerUpdated"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PermissionChange"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferedOwnership"): EventFragment;
}
export interface ApprovalEventObject {
    owner: string;
    approved: string;
    tokenId: BigNumber;
}
export type ApprovalEvent = TypedEvent<[
    string,
    string,
    BigNumber
], ApprovalEventObject>;
export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;
export interface ApprovalForAllEventObject {
    owner: string;
    operator: string;
    approved: boolean;
}
export type ApprovalForAllEvent = TypedEvent<[
    string,
    string,
    boolean
], ApprovalForAllEventObject>;
export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;
export interface EASRequestAcceptedEventObject {
    stickerId: number;
    sender: string;
    price: BigNumber;
    packed: string;
}
export type EASRequestAcceptedEvent = TypedEvent<[
    number,
    string,
    BigNumber,
    string
], EASRequestAcceptedEventObject>;
export type EASRequestAcceptedEventFilter = TypedEventFilter<EASRequestAcceptedEvent>;
export interface EASRequestAddedEventObject {
    requestId: number;
    sender: string;
    price: BigNumber;
    packed: string;
}
export type EASRequestAddedEvent = TypedEvent<[
    number,
    string,
    BigNumber,
    string
], EASRequestAddedEventObject>;
export type EASRequestAddedEventFilter = TypedEventFilter<EASRequestAddedEvent>;
export interface EASRequestDeniedEventObject {
    requestId: number;
    sender: string;
    price: BigNumber;
    packed: string;
}
export type EASRequestDeniedEvent = TypedEvent<[
    number,
    string,
    BigNumber,
    string
], EASRequestDeniedEventObject>;
export type EASRequestDeniedEventFilter = TypedEventFilter<EASRequestDeniedEvent>;
export interface EASRequestWithdrewEventObject {
    requestId: number;
    sender: string;
    price: BigNumber;
    packed: string;
}
export type EASRequestWithdrewEvent = TypedEvent<[
    number,
    string,
    BigNumber,
    string
], EASRequestWithdrewEventObject>;
export type EASRequestWithdrewEventFilter = TypedEventFilter<EASRequestWithdrewEvent>;
export interface EASStickerUpdatedEventObject {
    requestId: number;
    sender: string;
    price: BigNumber;
    packed: string;
}
export type EASStickerUpdatedEvent = TypedEvent<[
    number,
    string,
    BigNumber,
    string
], EASStickerUpdatedEventObject>;
export type EASStickerUpdatedEventFilter = TypedEventFilter<EASStickerUpdatedEvent>;
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
    from: string;
    to: string;
    tokenId: BigNumber;
}
export type TransferEvent = TypedEvent<[
    string,
    string,
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
export interface EADStickers extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: EADStickersInterface;
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
        approve(_to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        balanceOf(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        burn(stickerId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        currentStickerId(overrides?: CallOverrides): Promise<[number]>;
        currentTokenId(overrides?: CallOverrides): Promise<[number]>;
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        deployer(overrides?: CallOverrides): Promise<[string]>;
        erc721(overrides?: CallOverrides): Promise<[string]>;
        erc721TokenId(overrides?: CallOverrides): Promise<[BigNumber]>;
        exists(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        getApproved(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getIntegrity(overrides?: CallOverrides): Promise<[string, string, BigNumber, string, string]>;
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
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isApprovedOrOwner(addr: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isStickerFlagged(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean, string]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        name(overrides?: CallOverrides): Promise<[string]>;
        openRequests(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        ownerOf(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        profitWallet(overrides?: CallOverrides): Promise<[string]>;
        "safeTransferFrom(address,address,uint256)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "safeTransferFrom(address,address,uint256,bytes)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setEnabled(isEnabled: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setFlaggedSticker(stickerId: PromiseOrValue<BigNumberish>, isFlagged: PromiseOrValue<boolean>, reason: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setProfitWallet(profitWalletAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setStickerPrice(price: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        stickerPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        symbol(overrides?: CallOverrides): Promise<[string]>;
        tokenURI(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
        transferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnershipToTokenOwner(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        updateSticker(stickerId: PromiseOrValue<BigNumberish>, packed: PromiseOrValue<BytesLike>, overrides?: Overrides & {
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
    approve(_to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    balanceOf(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    burn(stickerId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    currentStickerId(overrides?: CallOverrides): Promise<number>;
    currentTokenId(overrides?: CallOverrides): Promise<number>;
    denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    deployer(overrides?: CallOverrides): Promise<string>;
    erc721(overrides?: CallOverrides): Promise<string>;
    erc721TokenId(overrides?: CallOverrides): Promise<BigNumber>;
    exists(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    getApproved(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getIntegrity(overrides?: CallOverrides): Promise<[string, string, BigNumber, string, string]>;
    getMyRequests(overrides?: CallOverrides): Promise<string[]>;
    getRequestCount(overrides?: CallOverrides): Promise<BigNumber>;
    getRequests(overrides?: CallOverrides): Promise<string[]>;
    getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getStickerCount(overrides?: CallOverrides): Promise<BigNumber>;
    getStickers(overrides?: CallOverrides): Promise<number[]>;
    isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isApprovedOrOwner(addr: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isStickerFlagged(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean, string]>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    name(overrides?: CallOverrides): Promise<string>;
    openRequests(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    ownerOf(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    profitWallet(overrides?: CallOverrides): Promise<string>;
    "safeTransferFrom(address,address,uint256)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "safeTransferFrom(address,address,uint256,bytes)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setEnabled(isEnabled: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setFlaggedSticker(stickerId: PromiseOrValue<BigNumberish>, isFlagged: PromiseOrValue<boolean>, reason: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setProfitWallet(profitWalletAddress: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setStickerPrice(price: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    stickerPrice(overrides?: CallOverrides): Promise<BigNumber>;
    supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    symbol(overrides?: CallOverrides): Promise<string>;
    tokenURI(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnershipToTokenOwner(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    updateSticker(stickerId: PromiseOrValue<BigNumberish>, packed: PromiseOrValue<BytesLike>, overrides?: Overrides & {
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
        approve(_to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        balanceOf(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        burn(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        currentStickerId(overrides?: CallOverrides): Promise<number>;
        currentTokenId(overrides?: CallOverrides): Promise<number>;
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        deployer(overrides?: CallOverrides): Promise<string>;
        erc721(overrides?: CallOverrides): Promise<string>;
        erc721TokenId(overrides?: CallOverrides): Promise<BigNumber>;
        exists(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        getApproved(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getIntegrity(overrides?: CallOverrides): Promise<[string, string, BigNumber, string, string]>;
        getMyRequests(overrides?: CallOverrides): Promise<string[]>;
        getRequestCount(overrides?: CallOverrides): Promise<BigNumber>;
        getRequests(overrides?: CallOverrides): Promise<string[]>;
        getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getStickerCount(overrides?: CallOverrides): Promise<BigNumber>;
        getStickers(overrides?: CallOverrides): Promise<number[]>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isApprovedOrOwner(addr: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isStickerFlagged(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean, string]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        name(overrides?: CallOverrides): Promise<string>;
        openRequests(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        ownerOf(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        profitWallet(overrides?: CallOverrides): Promise<string>;
        "safeTransferFrom(address,address,uint256)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        "safeTransferFrom(address,address,uint256,bytes)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setEnabled(isEnabled: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setFlaggedSticker(stickerId: PromiseOrValue<BigNumberish>, isFlagged: PromiseOrValue<boolean>, reason: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setProfitWallet(profitWalletAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setStickerPrice(price: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        stickerPrice(overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        symbol(overrides?: CallOverrides): Promise<string>;
        tokenURI(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        transferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        transferOwnershipToTokenOwner(overrides?: CallOverrides): Promise<void>;
        updateSticker(stickerId: PromiseOrValue<BigNumberish>, packed: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        valuesController(overrides?: CallOverrides): Promise<string>;
        verifyAuthenticity(overrides?: CallOverrides): Promise<boolean>;
        versionType(overrides?: CallOverrides): Promise<string>;
        withdrawRequest(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "Approval(address,address,uint256)"(owner?: PromiseOrValue<string> | null, approved?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): ApprovalEventFilter;
        Approval(owner?: PromiseOrValue<string> | null, approved?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): ApprovalEventFilter;
        "ApprovalForAll(address,address,bool)"(owner?: PromiseOrValue<string> | null, operator?: PromiseOrValue<string> | null, approved?: null): ApprovalForAllEventFilter;
        ApprovalForAll(owner?: PromiseOrValue<string> | null, operator?: PromiseOrValue<string> | null, approved?: null): ApprovalForAllEventFilter;
        "EASRequestAccepted(uint32,address,uint256,bytes)"(stickerId?: null, sender?: PromiseOrValue<string> | null, price?: null, packed?: null): EASRequestAcceptedEventFilter;
        EASRequestAccepted(stickerId?: null, sender?: PromiseOrValue<string> | null, price?: null, packed?: null): EASRequestAcceptedEventFilter;
        "EASRequestAdded(uint32,address,uint256,bytes)"(requestId?: null, sender?: PromiseOrValue<string> | null, price?: null, packed?: null): EASRequestAddedEventFilter;
        EASRequestAdded(requestId?: null, sender?: PromiseOrValue<string> | null, price?: null, packed?: null): EASRequestAddedEventFilter;
        "EASRequestDenied(uint32,address,uint256,bytes)"(requestId?: null, sender?: PromiseOrValue<string> | null, price?: null, packed?: null): EASRequestDeniedEventFilter;
        EASRequestDenied(requestId?: null, sender?: PromiseOrValue<string> | null, price?: null, packed?: null): EASRequestDeniedEventFilter;
        "EASRequestWithdrew(uint32,address,uint256,bytes)"(requestId?: null, sender?: PromiseOrValue<string> | null, price?: null, packed?: null): EASRequestWithdrewEventFilter;
        EASRequestWithdrew(requestId?: null, sender?: PromiseOrValue<string> | null, price?: null, packed?: null): EASRequestWithdrewEventFilter;
        "EASStickerUpdated(uint32,address,uint256,bytes)"(requestId?: null, sender?: PromiseOrValue<string> | null, price?: null, packed?: null): EASStickerUpdatedEventFilter;
        EASStickerUpdated(requestId?: null, sender?: PromiseOrValue<string> | null, price?: null, packed?: null): EASStickerUpdatedEventFilter;
        "PermissionChange(address,address,bool)"(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        PermissionChange(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        "Transfer(address,address,uint256)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): TransferEventFilter;
        Transfer(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): TransferEventFilter;
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
        approve(_to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        balanceOf(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        burn(stickerId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        currentStickerId(overrides?: CallOverrides): Promise<BigNumber>;
        currentTokenId(overrides?: CallOverrides): Promise<BigNumber>;
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<BigNumber>;
        erc721(overrides?: CallOverrides): Promise<BigNumber>;
        erc721TokenId(overrides?: CallOverrides): Promise<BigNumber>;
        exists(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getApproved(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getIntegrity(overrides?: CallOverrides): Promise<BigNumber>;
        getMyRequests(overrides?: CallOverrides): Promise<BigNumber>;
        getRequestCount(overrides?: CallOverrides): Promise<BigNumber>;
        getRequests(overrides?: CallOverrides): Promise<BigNumber>;
        getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getStickerCount(overrides?: CallOverrides): Promise<BigNumber>;
        getStickers(overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedOrOwner(addr: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isStickerFlagged(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<BigNumber>;
        openRequests(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        ownerOf(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        profitWallet(overrides?: CallOverrides): Promise<BigNumber>;
        "safeTransferFrom(address,address,uint256)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "safeTransferFrom(address,address,uint256,bytes)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setEnabled(isEnabled: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setFlaggedSticker(stickerId: PromiseOrValue<BigNumberish>, isFlagged: PromiseOrValue<boolean>, reason: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setProfitWallet(profitWalletAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setStickerPrice(price: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        stickerPrice(overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        symbol(overrides?: CallOverrides): Promise<BigNumber>;
        tokenURI(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        transferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnershipToTokenOwner(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        updateSticker(stickerId: PromiseOrValue<BigNumberish>, packed: PromiseOrValue<BytesLike>, overrides?: Overrides & {
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
        approve(_to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        balanceOf(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        burn(stickerId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        currentStickerId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        currentTokenId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        erc721(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        erc721TokenId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        exists(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getApproved(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getIntegrity(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getMyRequests(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRequestCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRequests(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStickerCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStickers(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isApprovedOrOwner(addr: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isStickerFlagged(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        openRequests(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        ownerOf(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        profitWallet(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "safeTransferFrom(address,address,uint256)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "safeTransferFrom(address,address,uint256,bytes)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setEnabled(isEnabled: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setFlaggedSticker(stickerId: PromiseOrValue<BigNumberish>, isFlagged: PromiseOrValue<boolean>, reason: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setProfitWallet(profitWalletAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setStickerPrice(price: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        stickerPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokenURI(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnershipToTokenOwner(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        updateSticker(stickerId: PromiseOrValue<BigNumberish>, packed: PromiseOrValue<BytesLike>, overrides?: Overrides & {
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
//# sourceMappingURL=EADStickers.d.ts.map