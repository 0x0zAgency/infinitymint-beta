import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
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
export interface InfinityMintApiInterface extends utils.Interface {
    functions: {
        "allTokens(address)": FunctionFragment;
        "assetController()": FunctionFragment;
        "erc721()": FunctionFragment;
        "get(uint32)": FunctionFragment;
        "getBalanceOfWallet(uint32)": FunctionFragment;
        "getBytes(uint32)": FunctionFragment;
        "getCurrentProject()": FunctionFragment;
        "getLink(uint32,uint256)": FunctionFragment;
        "getPreview(uint32)": FunctionFragment;
        "getPreviewCount(address)": FunctionFragment;
        "getPreviewTimestamp(address)": FunctionFragment;
        "getPreviews(address)": FunctionFragment;
        "getPrice()": FunctionFragment;
        "getProject(uint256)": FunctionFragment;
        "getStickerContract(uint32)": FunctionFragment;
        "getWalletContract(uint32)": FunctionFragment;
        "isPreviewBlocked(address)": FunctionFragment;
        "projectController()": FunctionFragment;
        "royaltyController()": FunctionFragment;
        "setFlag(string,bool)": FunctionFragment;
        "setOption(string,string)": FunctionFragment;
        "setTokenFlag(uint32,string,bool)": FunctionFragment;
        "storageController()": FunctionFragment;
        "totalMints()": FunctionFragment;
        "totalSupply()": FunctionFragment;
        "valuesController()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "allTokens" | "assetController" | "erc721" | "get" | "getBalanceOfWallet" | "getBytes" | "getCurrentProject" | "getLink" | "getPreview" | "getPreviewCount" | "getPreviewTimestamp" | "getPreviews" | "getPrice" | "getProject" | "getStickerContract" | "getWalletContract" | "isPreviewBlocked" | "projectController" | "royaltyController" | "setFlag" | "setOption" | "setTokenFlag" | "storageController" | "totalMints" | "totalSupply" | "valuesController"): FunctionFragment;
    encodeFunctionData(functionFragment: "allTokens", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "assetController", values?: undefined): string;
    encodeFunctionData(functionFragment: "erc721", values?: undefined): string;
    encodeFunctionData(functionFragment: "get", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getBalanceOfWallet", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getBytes", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getCurrentProject", values?: undefined): string;
    encodeFunctionData(functionFragment: "getLink", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getPreview", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getPreviewCount", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getPreviewTimestamp", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getPreviews", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "getProject", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getStickerContract", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getWalletContract", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isPreviewBlocked", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "projectController", values?: undefined): string;
    encodeFunctionData(functionFragment: "royaltyController", values?: undefined): string;
    encodeFunctionData(functionFragment: "setFlag", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setOption", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setTokenFlag", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<boolean>
    ]): string;
    encodeFunctionData(functionFragment: "storageController", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalMints", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "valuesController", values?: undefined): string;
    decodeFunctionResult(functionFragment: "allTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "assetController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "erc721", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBalanceOfWallet", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBytes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrentProject", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLink", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPreview", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPreviewCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPreviewTimestamp", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPreviews", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getProject", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStickerContract", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWalletContract", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isPreviewBlocked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "projectController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "royaltyController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFlag", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOption", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setTokenFlag", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "storageController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalMints", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "valuesController", data: BytesLike): Result;
    events: {};
}
export interface InfinityMintApi extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: InfinityMintApiInterface;
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
        allTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number[]] & {
            tokens: number[];
        }>;
        assetController(overrides?: CallOverrides): Promise<[string]>;
        erc721(overrides?: CallOverrides): Promise<[string]>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[InfinityMintObject.InfinityObjectStructOutput]>;
        getBalanceOfWallet(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getBytes(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getCurrentProject(overrides?: CallOverrides): Promise<[
            string,
            string,
            BigNumber
        ] & {
            encodedUrl: string;
            encodedTag: string;
            version: BigNumber;
        }>;
        getLink(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getPreview(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[InfinityMintObject.InfinityObjectStructOutput]>;
        getPreviewCount(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber] & {
            count: BigNumber;
        }>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getPreviews(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number[]]>;
        getPrice(overrides?: CallOverrides): Promise<[BigNumber]>;
        getProject(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            string,
            string
        ] & {
            encodedProject: string;
            encodedTag: string;
            encodedInitialProject: string;
        }>;
        getStickerContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getWalletContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        isPreviewBlocked(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        projectController(overrides?: CallOverrides): Promise<[string]>;
        royaltyController(overrides?: CallOverrides): Promise<[string]>;
        setFlag(key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setOption(key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setTokenFlag(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        storageController(overrides?: CallOverrides): Promise<[string]>;
        totalMints(overrides?: CallOverrides): Promise<[number]>;
        totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
        valuesController(overrides?: CallOverrides): Promise<[string]>;
    };
    allTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
    assetController(overrides?: CallOverrides): Promise<string>;
    erc721(overrides?: CallOverrides): Promise<string>;
    get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
    getBalanceOfWallet(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    getBytes(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getCurrentProject(overrides?: CallOverrides): Promise<[
        string,
        string,
        BigNumber
    ] & {
        encodedUrl: string;
        encodedTag: string;
        version: BigNumber;
    }>;
    getLink(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getPreview(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
    getPreviewCount(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getPreviews(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
    getPrice(overrides?: CallOverrides): Promise<BigNumber>;
    getProject(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        string,
        string,
        string
    ] & {
        encodedProject: string;
        encodedTag: string;
        encodedInitialProject: string;
    }>;
    getStickerContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getWalletContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    isPreviewBlocked(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    projectController(overrides?: CallOverrides): Promise<string>;
    royaltyController(overrides?: CallOverrides): Promise<string>;
    setFlag(key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setOption(key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setTokenFlag(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    storageController(overrides?: CallOverrides): Promise<string>;
    totalMints(overrides?: CallOverrides): Promise<number>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    valuesController(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        allTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
        assetController(overrides?: CallOverrides): Promise<string>;
        erc721(overrides?: CallOverrides): Promise<string>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
        getBalanceOfWallet(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getBytes(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getCurrentProject(overrides?: CallOverrides): Promise<[
            string,
            string,
            BigNumber
        ] & {
            encodedUrl: string;
            encodedTag: string;
            version: BigNumber;
        }>;
        getLink(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getPreview(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
        getPreviewCount(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreviews(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number[]>;
        getPrice(overrides?: CallOverrides): Promise<BigNumber>;
        getProject(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            string,
            string
        ] & {
            encodedProject: string;
            encodedTag: string;
            encodedInitialProject: string;
        }>;
        getStickerContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getWalletContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        isPreviewBlocked(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        projectController(overrides?: CallOverrides): Promise<string>;
        royaltyController(overrides?: CallOverrides): Promise<string>;
        setFlag(key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setOption(key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setTokenFlag(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        storageController(overrides?: CallOverrides): Promise<string>;
        totalMints(overrides?: CallOverrides): Promise<number>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        valuesController(overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        allTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        assetController(overrides?: CallOverrides): Promise<BigNumber>;
        erc721(overrides?: CallOverrides): Promise<BigNumber>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getBalanceOfWallet(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getBytes(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getCurrentProject(overrides?: CallOverrides): Promise<BigNumber>;
        getLink(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreview(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreviewCount(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPreviews(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPrice(overrides?: CallOverrides): Promise<BigNumber>;
        getProject(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getStickerContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getWalletContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isPreviewBlocked(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        projectController(overrides?: CallOverrides): Promise<BigNumber>;
        royaltyController(overrides?: CallOverrides): Promise<BigNumber>;
        setFlag(key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setOption(key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setTokenFlag(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        storageController(overrides?: CallOverrides): Promise<BigNumber>;
        totalMints(overrides?: CallOverrides): Promise<BigNumber>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        valuesController(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        allTokens(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        assetController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        erc721(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        get(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getBalanceOfWallet(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getBytes(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCurrentProject(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getLink(tokenId: PromiseOrValue<BigNumberish>, index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPreview(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPreviewCount(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPreviewTimestamp(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPreviews(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getProject(version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStickerContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getWalletContract(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isPreviewBlocked(sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        projectController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        royaltyController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setFlag(key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setOption(key: PromiseOrValue<string>, option: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setTokenFlag(tokenId: PromiseOrValue<BigNumberish>, key: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        storageController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalMints(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        valuesController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=InfinityMintApi.d.ts.map