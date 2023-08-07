import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
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
export interface DefaultMinterInterface extends utils.Interface {
    functions: {
        "approvalCount()": FunctionFragment;
        "approved(address)": FunctionFragment;
        "assetController()": FunctionFragment;
        "deployer()": FunctionFragment;
        "getPreview(uint32,address)": FunctionFragment;
        "isAuthenticated(address)": FunctionFragment;
        "mint(uint32,address,bytes)": FunctionFragment;
        "mintPreview(uint32,uint32,address)": FunctionFragment;
        "multiApprove(address[])": FunctionFragment;
        "multiRevoke(address[])": FunctionFragment;
        "randomNumberController()": FunctionFragment;
        "setAssetController(address)": FunctionFragment;
        "setPrivilages(address,bool)": FunctionFragment;
        "setRandomNumberController(address)": FunctionFragment;
        "setStorageController(address)": FunctionFragment;
        "storageController()": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "valuesController()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "approvalCount" | "approved" | "assetController" | "deployer" | "getPreview" | "isAuthenticated" | "mint" | "mintPreview" | "multiApprove" | "multiRevoke" | "randomNumberController" | "setAssetController" | "setPrivilages" | "setRandomNumberController" | "setStorageController" | "storageController" | "transferOwnership" | "valuesController"): FunctionFragment;
    encodeFunctionData(functionFragment: "approvalCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "approved", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "assetController", values?: undefined): string;
    encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
    encodeFunctionData(functionFragment: "getPreview", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isAuthenticated", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "mint", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "mintPreview", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "multiApprove", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "multiRevoke", values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: "randomNumberController", values?: undefined): string;
    encodeFunctionData(functionFragment: "setAssetController", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setPrivilages", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setRandomNumberController", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setStorageController", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "storageController", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "valuesController", values?: undefined): string;
    decodeFunctionResult(functionFragment: "approvalCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "assetController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPreview", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isAuthenticated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintPreview", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiRevoke", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "randomNumberController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setAssetController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrivilages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRandomNumberController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setStorageController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "storageController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "valuesController", data: BytesLike): Result;
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
export interface DefaultMinter extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: DefaultMinterInterface;
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
        assetController(overrides?: CallOverrides): Promise<[string]>;
        deployer(overrides?: CallOverrides): Promise<[string]>;
        getPreview(currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        mint(currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, arg2: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        mintPreview(index: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[InfinityMintObject.InfinityObjectStructOutput]>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        randomNumberController(overrides?: CallOverrides): Promise<[string]>;
        setAssetController(assetContract: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setRandomNumberController(randomNumberContract: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setStorageController(storageContract: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        storageController(overrides?: CallOverrides): Promise<[string]>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        valuesController(overrides?: CallOverrides): Promise<[string]>;
    };
    approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
    approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    assetController(overrides?: CallOverrides): Promise<string>;
    deployer(overrides?: CallOverrides): Promise<string>;
    getPreview(currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    mint(currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, arg2: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    mintPreview(index: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
    multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    randomNumberController(overrides?: CallOverrides): Promise<string>;
    setAssetController(assetContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setRandomNumberController(randomNumberContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setStorageController(storageContract: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    storageController(overrides?: CallOverrides): Promise<string>;
    transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    valuesController(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        approvalCount(overrides?: CallOverrides): Promise<BigNumber>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        assetController(overrides?: CallOverrides): Promise<string>;
        deployer(overrides?: CallOverrides): Promise<string>;
        getPreview(currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        mint(currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, arg2: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
        mintPreview(index: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<InfinityMintObject.InfinityObjectStructOutput>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        randomNumberController(overrides?: CallOverrides): Promise<string>;
        setAssetController(assetContract: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setRandomNumberController(randomNumberContract: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setStorageController(storageContract: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        storageController(overrides?: CallOverrides): Promise<string>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        valuesController(overrides?: CallOverrides): Promise<string>;
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
        assetController(overrides?: CallOverrides): Promise<BigNumber>;
        deployer(overrides?: CallOverrides): Promise<BigNumber>;
        getPreview(currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        mint(currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, arg2: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        mintPreview(index: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        randomNumberController(overrides?: CallOverrides): Promise<BigNumber>;
        setAssetController(assetContract: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setRandomNumberController(randomNumberContract: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setStorageController(storageContract: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        storageController(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        valuesController(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        approvalCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approved(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        assetController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPreview(currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        isAuthenticated(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mint(currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, arg2: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        mintPreview(index: PromiseOrValue<BigNumberish>, currentTokenId: PromiseOrValue<BigNumberish>, sender: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiApprove(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        multiRevoke(addrs: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        randomNumberController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setAssetController(assetContract: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrivilages(addr: PromiseOrValue<string>, value: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setRandomNumberController(randomNumberContract: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setStorageController(storageContract: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        storageController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        valuesController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=DefaultMinter.d.ts.map