import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export interface StickerInterfaceInterface extends utils.Interface {
    functions: {
        "acceptRequest(address,uint32)": FunctionFragment;
        "addRequest(bytes)": FunctionFragment;
        "denyRequest(address,uint32)": FunctionFragment;
        "getMyRequests()": FunctionFragment;
        "getRequestCount()": FunctionFragment;
        "getRequests()": FunctionFragment;
        "getSticker(uint32)": FunctionFragment;
        "getStickerCount()": FunctionFragment;
        "getStickers()": FunctionFragment;
        "verifyAuthenticity()": FunctionFragment;
        "withdrawRequest(uint32)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "acceptRequest" | "addRequest" | "denyRequest" | "getMyRequests" | "getRequestCount" | "getRequests" | "getSticker" | "getStickerCount" | "getStickers" | "verifyAuthenticity" | "withdrawRequest"): FunctionFragment;
    encodeFunctionData(functionFragment: "acceptRequest", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "addRequest", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "denyRequest", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getMyRequests", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRequestCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRequests", values?: undefined): string;
    encodeFunctionData(functionFragment: "getSticker", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getStickerCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "getStickers", values?: undefined): string;
    encodeFunctionData(functionFragment: "verifyAuthenticity", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdrawRequest", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "acceptRequest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addRequest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "denyRequest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMyRequests", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRequestCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRequests", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSticker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStickerCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStickers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyAuthenticity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawRequest", data: BytesLike): Result;
    events: {};
}
export interface StickerInterface extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: StickerInterfaceInterface;
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
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
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
        verifyAuthenticity(overrides?: CallOverrides): Promise<[boolean]>;
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
    denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getMyRequests(overrides?: CallOverrides): Promise<string[]>;
    getRequestCount(overrides?: CallOverrides): Promise<BigNumber>;
    getRequests(overrides?: CallOverrides): Promise<string[]>;
    getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getStickerCount(overrides?: CallOverrides): Promise<BigNumber>;
    getStickers(overrides?: CallOverrides): Promise<number[]>;
    verifyAuthenticity(overrides?: CallOverrides): Promise<boolean>;
    withdrawRequest(index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        acceptRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        addRequest(packed: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        getMyRequests(overrides?: CallOverrides): Promise<string[]>;
        getRequestCount(overrides?: CallOverrides): Promise<BigNumber>;
        getRequests(overrides?: CallOverrides): Promise<string[]>;
        getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getStickerCount(overrides?: CallOverrides): Promise<BigNumber>;
        getStickers(overrides?: CallOverrides): Promise<number[]>;
        verifyAuthenticity(overrides?: CallOverrides): Promise<boolean>;
        withdrawRequest(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        acceptRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        addRequest(packed: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getMyRequests(overrides?: CallOverrides): Promise<BigNumber>;
        getRequestCount(overrides?: CallOverrides): Promise<BigNumber>;
        getRequests(overrides?: CallOverrides): Promise<BigNumber>;
        getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getStickerCount(overrides?: CallOverrides): Promise<BigNumber>;
        getStickers(overrides?: CallOverrides): Promise<BigNumber>;
        verifyAuthenticity(overrides?: CallOverrides): Promise<BigNumber>;
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
        denyRequest(sender: PromiseOrValue<string>, index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getMyRequests(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRequestCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRequests(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSticker(stickerId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStickerCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStickers(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        verifyAuthenticity(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        withdrawRequest(index: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=StickerInterface.d.ts.map