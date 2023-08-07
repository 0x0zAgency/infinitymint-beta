import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export declare namespace Asset {
    type PartialStructStruct = {
        pathId: PromiseOrValue<BigNumberish>;
        assets: PromiseOrValue<BigNumberish>[];
        names: PromiseOrValue<BigNumberish>[];
        colours: PromiseOrValue<BigNumberish>[];
        mintData: PromiseOrValue<BytesLike>;
    };
    type PartialStructStructOutput = [
        number,
        number[],
        number[],
        number[],
        string
    ] & {
        pathId: number;
        assets: number[];
        names: number[];
        colours: number[];
        mintData: string;
    };
}
export interface AssetInterface extends utils.Interface {
    functions: {
        "addAsset(uint256)": FunctionFragment;
        "getColours(uint32,address)": FunctionFragment;
        "getMintData(uint32,uint32,address)": FunctionFragment;
        "getNames(uint256,address)": FunctionFragment;
        "getNextPath()": FunctionFragment;
        "getNextPathId(address)": FunctionFragment;
        "getPathSize(uint32)": FunctionFragment;
        "getRandomAsset(uint32,address)": FunctionFragment;
        "isValidPath(uint32)": FunctionFragment;
        "pickPath(uint32,address)": FunctionFragment;
        "pickPath(uint32,uint32,address)": FunctionFragment;
        "setLastPathId(uint32)": FunctionFragment;
        "setNextPathId(uint32)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "addAsset" | "getColours" | "getMintData" | "getNames" | "getNextPath" | "getNextPathId" | "getPathSize" | "getRandomAsset" | "isValidPath" | "pickPath(uint32,address)" | "pickPath(uint32,uint32,address)" | "setLastPathId" | "setNextPathId"): FunctionFragment;
    encodeFunctionData(functionFragment: "addAsset", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getColours", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getMintData", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "getNames", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getNextPath", values?: undefined): string;
    encodeFunctionData(functionFragment: "getNextPathId", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getPathSize", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getRandomAsset", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isValidPath", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "pickPath(uint32,address)", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "pickPath(uint32,uint32,address)", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "setLastPathId", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setNextPathId", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "addAsset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getColours", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMintData", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNames", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNextPath", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNextPathId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPathSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRandomAsset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isValidPath", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pickPath(uint32,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pickPath(uint32,uint32,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setLastPathId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setNextPathId", data: BytesLike): Result;
    events: {};
}
export interface Asset extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: AssetInterface;
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
        addAsset(rarity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getColours(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getMintData(pathId: PromiseOrValue<BigNumberish>, tokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getNames(nameCount: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getNextPath(overrides?: CallOverrides): Promise<[number]>;
        getNextPathId(randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getPathSize(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[number]>;
        getRandomAsset(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        isValidPath(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        "pickPath(uint32,address)"(currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "pickPath(uint32,uint32,address)"(pathId: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setLastPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setNextPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    addAsset(rarity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getColours(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getMintData(pathId: PromiseOrValue<BigNumberish>, tokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getNames(nameCount: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getNextPath(overrides?: CallOverrides): Promise<number>;
    getNextPathId(randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getPathSize(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<number>;
    getRandomAsset(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    isValidPath(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    "pickPath(uint32,address)"(currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "pickPath(uint32,uint32,address)"(pathId: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setLastPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setNextPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        addAsset(rarity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        getColours(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
        getMintData(pathId: PromiseOrValue<BigNumberish>, tokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getNames(nameCount: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
        getNextPath(overrides?: CallOverrides): Promise<number>;
        getNextPathId(randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
        getPathSize(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<number>;
        getRandomAsset(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
        isValidPath(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        "pickPath(uint32,address)"(currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<Asset.PartialStructStructOutput>;
        "pickPath(uint32,uint32,address)"(pathId: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: CallOverrides): Promise<Asset.PartialStructStructOutput>;
        setLastPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setNextPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        addAsset(rarity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getColours(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getMintData(pathId: PromiseOrValue<BigNumberish>, tokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getNames(nameCount: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getNextPath(overrides?: CallOverrides): Promise<BigNumber>;
        getNextPathId(randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getPathSize(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getRandomAsset(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        isValidPath(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        "pickPath(uint32,address)"(currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "pickPath(uint32,uint32,address)"(pathId: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setLastPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setNextPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        addAsset(rarity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getColours(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getMintData(pathId: PromiseOrValue<BigNumberish>, tokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getNames(nameCount: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getNextPath(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getNextPathId(randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getPathSize(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRandomAsset(pathId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        isValidPath(pathId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "pickPath(uint32,address)"(currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "pickPath(uint32,uint32,address)"(pathId: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, randomNumberController: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setLastPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setNextPathId(pathId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=Asset.d.ts.map