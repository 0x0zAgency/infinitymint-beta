import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export declare namespace StickerOracle {
    type RegistrationObjectStruct = {
        owner: PromiseOrValue<string>;
        balance: PromiseOrValue<BigNumberish>;
        lockedBalance: PromiseOrValue<BigNumberish>;
        valid: PromiseOrValue<boolean>;
    };
    type RegistrationObjectStructOutput = [
        string,
        BigNumber,
        BigNumber,
        boolean
    ] & {
        owner: string;
        balance: BigNumber;
        lockedBalance: BigNumber;
        valid: boolean;
    };
    type StickerDestinationStruct = {
        deployer: PromiseOrValue<string>;
        destination: PromiseOrValue<string>;
        activeStickers: PromiseOrValue<BigNumberish>;
        completedStickers: PromiseOrValue<BigNumberish>;
        deniedStickers: PromiseOrValue<BigNumberish>;
        timestamp: PromiseOrValue<BigNumberish>;
        valid: PromiseOrValue<boolean>;
    };
    type StickerDestinationStructOutput = [
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean
    ] & {
        deployer: string;
        destination: string;
        activeStickers: BigNumber;
        completedStickers: BigNumber;
        deniedStickers: BigNumber;
        timestamp: BigNumber;
        valid: boolean;
    };
}
export interface StickerOracleInterface extends utils.Interface {
    functions: {
        "addressRegistrations(address)": FunctionFragment;
        "approvalCount()": FunctionFragment;
        "approve(address,uint256)": FunctionFragment;
        "approved(address)": FunctionFragment;
        "balanceOf(address)": FunctionFragment;
        "canAfford(uint256,uint256,address)": FunctionFragment;
        "deployer()": FunctionFragment;
        "exists(uint256)": FunctionFragment;
        "findRegistration(address)": FunctionFragment;
        "getApproved(uint256)": FunctionFragment;
        "getRegistration(uint256)": FunctionFragment;
        "getStickerRegistration(uint256)": FunctionFragment;
        "hasStickerCompleted(address,uint256)": FunctionFragment;
        "isApprovedForAll(address,address)": FunctionFragment;
        "isApprovedOrOwner(address,uint256)": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "multiRevoke(address[])": FunctionFragment;
        "name()": FunctionFragment;
        "ownerOf(uint256)": FunctionFragment;
        "register()": FunctionFragment;
        "registerDeploymentWithOracle(uint256,address)": FunctionFragment;
        "registerSticker(uint256,uint256,uint256)": FunctionFragment;
        "registeredStickerDestinations(uint256)": FunctionFragment;
        "registrations(uint256)": FunctionFragment;
        "safeTransferFrom(address,address,uint256)": FunctionFragment;
        "safeTransferFrom(address,address,uint256,bytes)": FunctionFragment;
        "setApprovalForAll(address,bool)": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
        "symbol()": FunctionFragment;
        "tokenURI(uint256)": FunctionFragment;
        "topup()": FunctionFragment;
        "transferFrom(address,address,uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "verifyRegistration(uint256,address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "addressRegistrations" | "approvalCount" | "approve" | "approved" | "balanceOf" | "canAfford" | "deployer" | "exists" | "findRegistration" | "getApproved" | "getRegistration" | "getStickerRegistration" | "hasStickerCompleted" | "isApprovedForAll" | "isApprovedOrOwner" | "isAuthenticated" | "multiApprove" | "multiRevoke" | "name" | "ownerOf" | "register" | "registerDeploymentWithOracle" | "registerSticker" | "registeredStickerDestinations" | "registrations" | "safeTransferFrom(address,address,uint256)" | "safeTransferFrom(address,address,uint256,bytes)" | "setApprovalForAll" | "setPrivilages" | "supportsInterface" | "symbol" | "tokenURI" | "topup" | "transferFrom" | "transferOwnership" | "verifyRegistration"): FunctionFragment;
    encodeFunctionData(functionFragment: "addressRegistrations", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "approvalCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "approve", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "canAfford", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "exists", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "findRegistration", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getApproved", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getRegistration", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getStickerRegistration", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "hasStickerCompleted", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isApprovedForAll", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isApprovedOrOwner", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "multiRevoke", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "name", values?: undefined): string;
    encodeFunctionData(functionFragment: "ownerOf", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "register", values?: undefined): string;
    encodeFunctionData(functionFragment: "registerDeploymentWithOracle", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "registerSticker", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "registeredStickerDestinations", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "registrations", values: [PromiseOrValue<BigNumberish>]): string;
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
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokenURI", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "topup", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferFrom", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "verifyRegistration", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "addressRegistrations", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approvalCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "canAfford", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "exists", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "findRegistration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getApproved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRegistration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStickerRegistration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hasStickerCompleted", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isApprovedForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isApprovedOrOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiRevoke", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registerDeploymentWithOracle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registerSticker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registeredStickerDestinations", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registrations", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom(address,address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom(address,address,uint256,bytes)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setApprovalForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "topup", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyRegistration", data: BytesLike): Result;
    events: {
        "AddressRegistration(address,uint256,tuple)": EventFragment;
        "Approval(address,address,uint256)": EventFragment;
        "ApprovalForAll(address,address,bool)": EventFragment;
        "DeploymentRegistration(address,uint256,address,tuple)": EventFragment;
        "PermissionChange(address,address,bool)": EventFragment;
        "Transfer(address,address,uint256)": EventFragment;
        "TransferedOwnership(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AddressRegistration"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "DeploymentRegistration"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PermissionChange"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "TransferedOwnership"): EventFragment;
}
export interface AddressRegistrationEventObject {
    sender: string;
    oracleId: BigNumber;
    registraitonObject: StickerOracle.RegistrationObjectStructOutput;
}
export type AddressRegistrationEvent = TypedEvent<[
    string,
    BigNumber,
    StickerOracle.RegistrationObjectStructOutput
], AddressRegistrationEventObject>;
export type AddressRegistrationEventFilter = TypedEventFilter<AddressRegistrationEvent>;
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
export interface DeploymentRegistrationEventObject {
    sender: string;
    tokenId: BigNumber;
    stickersDestination: string;
    destinationObject: StickerOracle.StickerDestinationStructOutput;
}
export type DeploymentRegistrationEvent = TypedEvent<[
    string,
    BigNumber,
    string,
    StickerOracle.StickerDestinationStructOutput
], DeploymentRegistrationEventObject>;
export type DeploymentRegistrationEventFilter = TypedEventFilter<DeploymentRegistrationEvent>;
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
export interface StickerOracle extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: StickerOracleInterface;
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
        addressRegistrations(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[
            string,
            BigNumber,
            boolean
        ] & {
            owner: string;
            oracleId: BigNumber;
            valid: boolean;
        }>;
        approvalCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        approve(_to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        balanceOf(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        canAfford(pps: PromiseOrValue<BigNumberish>, duration: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        deployer(overrides?: CallOverrides): Promise<[string]>;
        exists(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        findRegistration(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[StickerOracle.RegistrationObjectStructOutput]>;
        getApproved(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getRegistration(thatOracleId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[StickerOracle.RegistrationObjectStructOutput]>;
        getStickerRegistration(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            StickerOracle.StickerDestinationStructOutput
        ] & {
            dest: StickerOracle.StickerDestinationStructOutput;
        }>;
        hasStickerCompleted(stickerDestination: PromiseOrValue<string>, stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isApprovedOrOwner(addr: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        name(overrides?: CallOverrides): Promise<[string]>;
        ownerOf(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        register(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        registerDeploymentWithOracle(tokenId: PromiseOrValue<BigNumberish>, stickersDestination: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        registerSticker(tokenId: PromiseOrValue<BigNumberish>, stickerId: PromiseOrValue<BigNumberish>, stickerEnd: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        registeredStickerDestinations(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            string,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            boolean
        ] & {
            deployer: string;
            destination: string;
            activeStickers: BigNumber;
            completedStickers: BigNumber;
            deniedStickers: BigNumber;
            timestamp: BigNumber;
            valid: boolean;
        }>;
        registrations(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            BigNumber,
            BigNumber,
            boolean
        ] & {
            owner: string;
            balance: BigNumber;
            lockedBalance: BigNumber;
            valid: boolean;
        }>;
        "safeTransferFrom(address,address,uint256)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "safeTransferFrom(address,address,uint256,bytes)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        symbol(overrides?: CallOverrides): Promise<[string]>;
        tokenURI(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        topup(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        verifyRegistration(tokenId: PromiseOrValue<BigNumberish>, stickersDestination: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
    };
    addressRegistrations(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[
        string,
        BigNumber,
        boolean
    ] & {
        owner: string;
        oracleId: BigNumber;
        valid: boolean;
    }>;
    approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
    approve(_to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    balanceOf(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    canAfford(pps: PromiseOrValue<BigNumberish>, duration: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    deployer(overrides?: CallOverrides): Promise<string>;
    exists(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    findRegistration(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<StickerOracle.RegistrationObjectStructOutput>;
    getApproved(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getRegistration(thatOracleId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<StickerOracle.RegistrationObjectStructOutput>;
    getStickerRegistration(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<StickerOracle.StickerDestinationStructOutput>;
    hasStickerCompleted(stickerDestination: PromiseOrValue<string>, stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isApprovedOrOwner(addr: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    name(overrides?: CallOverrides): Promise<string>;
    ownerOf(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    register(overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    registerDeploymentWithOracle(tokenId: PromiseOrValue<BigNumberish>, stickersDestination: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    registerSticker(tokenId: PromiseOrValue<BigNumberish>, stickerId: PromiseOrValue<BigNumberish>, stickerEnd: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    registeredStickerDestinations(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean
    ] & {
        deployer: string;
        destination: string;
        activeStickers: BigNumber;
        completedStickers: BigNumber;
        deniedStickers: BigNumber;
        timestamp: BigNumber;
        valid: boolean;
    }>;
    registrations(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        string,
        BigNumber,
        BigNumber,
        boolean
    ] & {
        owner: string;
        balance: BigNumber;
        lockedBalance: BigNumber;
        valid: boolean;
    }>;
    "safeTransferFrom(address,address,uint256)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "safeTransferFrom(address,address,uint256,bytes)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    symbol(overrides?: CallOverrides): Promise<string>;
    tokenURI(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    topup(overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    verifyRegistration(tokenId: PromiseOrValue<BigNumberish>, stickersDestination: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        addressRegistrations(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[
            string,
            BigNumber,
            boolean
        ] & {
            owner: string;
            oracleId: BigNumber;
            valid: boolean;
        }>;
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approve(_to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        balanceOf(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        canAfford(pps: PromiseOrValue<BigNumberish>, duration: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        deployer(overrides?: CallOverrides): Promise<string>;
        exists(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        findRegistration(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<StickerOracle.RegistrationObjectStructOutput>;
        getApproved(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getRegistration(thatOracleId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<StickerOracle.RegistrationObjectStructOutput>;
        getStickerRegistration(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<StickerOracle.StickerDestinationStructOutput>;
        hasStickerCompleted(stickerDestination: PromiseOrValue<string>, stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isApprovedOrOwner(addr: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        name(overrides?: CallOverrides): Promise<string>;
        ownerOf(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        register(overrides?: CallOverrides): Promise<void>;
        registerDeploymentWithOracle(tokenId: PromiseOrValue<BigNumberish>, stickersDestination: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        registerSticker(tokenId: PromiseOrValue<BigNumberish>, stickerId: PromiseOrValue<BigNumberish>, stickerEnd: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        registeredStickerDestinations(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            string,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            boolean
        ] & {
            deployer: string;
            destination: string;
            activeStickers: BigNumber;
            completedStickers: BigNumber;
            deniedStickers: BigNumber;
            timestamp: BigNumber;
            valid: boolean;
        }>;
        registrations(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            BigNumber,
            BigNumber,
            boolean
        ] & {
            owner: string;
            balance: BigNumber;
            lockedBalance: BigNumber;
            valid: boolean;
        }>;
        "safeTransferFrom(address,address,uint256)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        "safeTransferFrom(address,address,uint256,bytes)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        symbol(overrides?: CallOverrides): Promise<string>;
        tokenURI(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        topup(overrides?: CallOverrides): Promise<void>;
        transferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        verifyRegistration(tokenId: PromiseOrValue<BigNumberish>, stickersDestination: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {
        "AddressRegistration(address,uint256,tuple)"(sender?: PromiseOrValue<string> | null, oracleId?: null, registraitonObject?: null): AddressRegistrationEventFilter;
        AddressRegistration(sender?: PromiseOrValue<string> | null, oracleId?: null, registraitonObject?: null): AddressRegistrationEventFilter;
        "Approval(address,address,uint256)"(owner?: PromiseOrValue<string> | null, approved?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): ApprovalEventFilter;
        Approval(owner?: PromiseOrValue<string> | null, approved?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): ApprovalEventFilter;
        "ApprovalForAll(address,address,bool)"(owner?: PromiseOrValue<string> | null, operator?: PromiseOrValue<string> | null, approved?: null): ApprovalForAllEventFilter;
        ApprovalForAll(owner?: PromiseOrValue<string> | null, operator?: PromiseOrValue<string> | null, approved?: null): ApprovalForAllEventFilter;
        "DeploymentRegistration(address,uint256,address,tuple)"(sender?: PromiseOrValue<string> | null, tokenId?: null, stickersDestination?: PromiseOrValue<string> | null, destinationObject?: null): DeploymentRegistrationEventFilter;
        DeploymentRegistration(sender?: PromiseOrValue<string> | null, tokenId?: null, stickersDestination?: PromiseOrValue<string> | null, destinationObject?: null): DeploymentRegistrationEventFilter;
        "PermissionChange(address,address,bool)"(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        PermissionChange(sender?: PromiseOrValue<string> | null, changee?: PromiseOrValue<string> | null, value?: null): PermissionChangeEventFilter;
        "Transfer(address,address,uint256)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): TransferEventFilter;
        Transfer(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null, tokenId?: PromiseOrValue<BigNumberish> | null): TransferEventFilter;
        "TransferedOwnership(address,address)"(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
        TransferedOwnership(from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null): TransferedOwnershipEventFilter;
    };
    estimateGas: {
        addressRegistrations(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approve(_to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        balanceOf(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        canAfford(pps: PromiseOrValue<BigNumberish>, duration: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<BigNumber>;
        exists(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        findRegistration(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getApproved(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getRegistration(thatOracleId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getStickerRegistration(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        hasStickerCompleted(stickerDestination: PromiseOrValue<string>, stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedOrOwner(addr: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<BigNumber>;
        ownerOf(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        register(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        registerDeploymentWithOracle(tokenId: PromiseOrValue<BigNumberish>, stickersDestination: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        registerSticker(tokenId: PromiseOrValue<BigNumberish>, stickerId: PromiseOrValue<BigNumberish>, stickerEnd: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        registeredStickerDestinations(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        registrations(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        "safeTransferFrom(address,address,uint256)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "safeTransferFrom(address,address,uint256,bytes)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        symbol(overrides?: CallOverrides): Promise<BigNumber>;
        tokenURI(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        topup(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        verifyRegistration(tokenId: PromiseOrValue<BigNumberish>, stickersDestination: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        addressRegistrations(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approvalCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approve(_to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        balanceOf(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        canAfford(pps: PromiseOrValue<BigNumberish>, duration: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        exists(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        findRegistration(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getApproved(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRegistration(thatOracleId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStickerRegistration(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hasStickerCompleted(stickerDestination: PromiseOrValue<string>, stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isApprovedForAll(_owner: PromiseOrValue<string>, _operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isApprovedOrOwner(addr: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        ownerOf(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        register(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        registerDeploymentWithOracle(tokenId: PromiseOrValue<BigNumberish>, stickersDestination: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        registerSticker(tokenId: PromiseOrValue<BigNumberish>, stickerId: PromiseOrValue<BigNumberish>, stickerEnd: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        registeredStickerDestinations(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        registrations(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "safeTransferFrom(address,address,uint256)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "safeTransferFrom(address,address,uint256,bytes)"(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setApprovalForAll(_operator: PromiseOrValue<string>, _approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokenURI(_tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        topup(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferFrom(_from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _tokenId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        verifyRegistration(tokenId: PromiseOrValue<BigNumberish>, stickersDestination: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=StickerOracle.d.ts.map