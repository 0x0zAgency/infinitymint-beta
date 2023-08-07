import type { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export interface IntegrityInterfaceInterface extends utils.Interface {
    functions: {
        "getIntegrity()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getIntegrity"): FunctionFragment;
    encodeFunctionData(functionFragment: "getIntegrity", values?: undefined): string;
    decodeFunctionResult(functionFragment: "getIntegrity", data: BytesLike): Result;
    events: {};
}
export interface IntegrityInterface extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IntegrityInterfaceInterface;
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
        getIntegrity(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    getIntegrity(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
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
    };
    filters: {};
    estimateGas: {
        getIntegrity(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        getIntegrity(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=IntegrityInterface.d.ts.map