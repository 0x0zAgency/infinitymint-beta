import { InfinityMintDeploymentScript, InfinityMintDeploymentParameters, InfinityMintDeploymentLocal, InfinityMintDeploymentLive, ValuesReturnType } from '@app/interfaces';
import { Dictionary } from '@app/helpers';
import { InfinityMintDeployment } from '@app/deployments';
import { Contract } from '@ethersproject/contracts';
import { DefaultMinter as DefaultMinterContract } from '@typechain-types/index';
import { DefaultRoyalty as DefaultRoyaltyContract } from '@typechain-types/index';
import { InfinityMint as InfinityMintContract } from '@typechain-types/index';
import { InfinityMintApi as InfinityMintApiContract } from '@typechain-types/index';
import { InfinityMintFlags as InfinityMintFlagsContract } from '@typechain-types/index';
import { InfinityMintLinker as InfinityMintLinkerContract } from '@typechain-types/index';
import { InfinityMintProject as InfinityMintProjectContract } from '@typechain-types/index';
import { InfinityMintStorage as InfinityMintStorageContract } from '@typechain-types/index';
import { InfinityMintValues as InfinityMintValuesContract } from '@typechain-types/index';
import { RarityAny as RarityAnyContract } from '@typechain-types/index';
import { RarityImage as RarityImageContract } from '@typechain-types/index';
import { RaritySVG as RaritySVGContract } from '@typechain-types/index';
import { SeededRandom as SeededRandomContract } from '@typechain-types/index';
import { SelectiveMinter as SelectiveMinterContract } from '@typechain-types/index';
import { SimpleAny as SimpleAnyContract } from '@typechain-types/index';
import { SimpleImage as SimpleImageContract } from '@typechain-types/index';
import { SimpleSVG as SimpleSVGContract } from '@typechain-types/index';
import { SimpleToken as SimpleTokenContract } from '@typechain-types/index';
import { SplitRoyalty as SplitRoyaltyContract } from '@typechain-types/index';
import { UnsafeRandom as UnsafeRandomContract } from '@typechain-types/index';
export declare abstract class DefaultMinterDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends DefaultMinterDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): DefaultMinterContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<DefaultMinterContract>;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        DefaultMinter?: DefaultMinterDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        DefaultMinter?: DefaultMinterDeploymentLive_Facade;
    }
}
export interface DefaultMinterDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface DefaultMinterScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: DefaultMinterDeploymentClass;
    deployScript?: DefaultMinterDeployScript;
}
export type DefaultMinterDeployArgType = (params: DefaultMinterScriptParameters) => Promise<string[]> | string[];
export interface DefaultMinterDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: DefaultMinterScriptParameters) => Promise<void>;
    cleanup?: (script: DefaultMinterScriptParameters) => Promise<void | string[]>;
    update?: (script: DefaultMinterScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: DefaultMinterScriptParameters) => Promise<void>;
    deploy?: (script: DefaultMinterScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: DefaultMinterScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | DefaultMinterDeployArgType;
}
export declare const DefaultMinter: DefaultMinterDeployScript;
export declare abstract class DefaultRoyaltyDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends DefaultRoyaltyDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): DefaultRoyaltyContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<DefaultRoyaltyContract>;
    get values(): DefaultRoyaltyOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        DefaultRoyalty?: DefaultRoyaltyDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        DefaultRoyalty?: DefaultRoyaltyDeploymentLive_Facade;
    }
}
export interface DefaultRoyaltyDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: DefaultRoyaltyOnChainValues;
}
export interface DefaultRoyaltyScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: DefaultRoyaltyDeploymentClass;
    deployScript?: DefaultRoyaltyDeployScript;
}
export type DefaultRoyaltyDeployArgType = (params: DefaultRoyaltyScriptParameters) => Promise<string[]> | string[];
export interface DefaultRoyaltyDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: DefaultRoyaltyScriptParameters) => Promise<void>;
    cleanup?: (script: DefaultRoyaltyScriptParameters) => Promise<void | string[]>;
    update?: (script: DefaultRoyaltyScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: DefaultRoyaltyScriptParameters) => Promise<void>;
    deploy?: (script: DefaultRoyaltyScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: DefaultRoyaltyScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | DefaultRoyaltyDeployArgType;
    values?: DefaultRoyaltyOnChainValues;
}
export declare const DefaultRoyalty: DefaultRoyaltyDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        startingPrice?: ValuesReturnType;
        baseTokenValue?: number;
        stickerSplit?: number;
    }
}
export interface DefaultRoyaltyOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    startingPrice?: ValuesReturnType;
    baseTokenValue?: number;
    stickerSplit?: number;
}
export declare abstract class InfinityMintDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends InfinityMintDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): InfinityMintContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<InfinityMintContract>;
    get values(): InfinityMintOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        InfinityMint?: InfinityMintDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        InfinityMint?: InfinityMintDeploymentLive_Facade;
    }
}
export interface InfinityMintDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: InfinityMintOnChainValues;
}
export interface InfinityMintScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: InfinityMintDeploymentClass;
    deployScript?: InfinityMintDeployScript;
}
export type InfinityMintDeployArgType = (params: InfinityMintScriptParameters) => Promise<string[]> | string[];
export interface InfinityMintDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: InfinityMintScriptParameters) => Promise<void>;
    cleanup?: (script: InfinityMintScriptParameters) => Promise<void | string[]>;
    update?: (script: InfinityMintScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: InfinityMintScriptParameters) => Promise<void>;
    deploy?: (script: InfinityMintScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: InfinityMintScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | InfinityMintDeployArgType;
    values?: InfinityMintOnChainValues;
}
export declare const InfinityMint: InfinityMintDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsERC721 {
        generateTokenURI?: boolean;
        pregenerateTokens?: number;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintConfigSettingsDeploy {
        test?: string;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        previewCount?: number;
        previewCooldownSeconds?: number;
        incrementalMode?: boolean;
        matchedMode?: boolean;
        disableMintArguments?: boolean;
        byteMint?: boolean;
        disableRegisteredTokens?: boolean;
        maxSupply?: number;
        maxTokensPerWallet?: number;
    }
}
export interface InfinityMintOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    previewCount?: number;
    previewCooldownSeconds?: number;
    incrementalMode?: boolean;
    matchedMode?: boolean;
    disableMintArguments?: boolean;
    byteMint?: boolean;
    disableRegisteredTokens?: boolean;
    maxSupply?: number;
    maxTokensPerWallet?: number;
}
export declare abstract class InfinityMintApiDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends InfinityMintApiDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): InfinityMintApiContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<InfinityMintApiContract>;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        InfinityMintApi?: InfinityMintApiDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        InfinityMintApi?: InfinityMintApiDeploymentLive_Facade;
    }
}
export interface InfinityMintApiDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface InfinityMintApiScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: InfinityMintApiDeploymentClass;
    deployScript?: InfinityMintApiDeployScript;
}
export type InfinityMintApiDeployArgType = (params: InfinityMintApiScriptParameters) => Promise<string[]> | string[];
export interface InfinityMintApiDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: InfinityMintApiScriptParameters) => Promise<void>;
    cleanup?: (script: InfinityMintApiScriptParameters) => Promise<void | string[]>;
    update?: (script: InfinityMintApiScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: InfinityMintApiScriptParameters) => Promise<void>;
    deploy?: (script: InfinityMintApiScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: InfinityMintApiScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | InfinityMintApiDeployArgType;
}
export declare const InfinityMintApi: InfinityMintApiDeployScript;
export declare abstract class InfinityMintFlagsDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends InfinityMintFlagsDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): InfinityMintFlagsContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<InfinityMintFlagsContract>;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        InfinityMintFlags?: InfinityMintFlagsDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        InfinityMintFlags?: InfinityMintFlagsDeploymentLive_Facade;
    }
}
export interface InfinityMintFlagsDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface InfinityMintFlagsScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: InfinityMintFlagsDeploymentClass;
    deployScript?: InfinityMintFlagsDeployScript;
}
export type InfinityMintFlagsDeployArgType = (params: InfinityMintFlagsScriptParameters) => Promise<string[]> | string[];
export interface InfinityMintFlagsDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: InfinityMintFlagsScriptParameters) => Promise<void>;
    cleanup?: (script: InfinityMintFlagsScriptParameters) => Promise<void | string[]>;
    update?: (script: InfinityMintFlagsScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: InfinityMintFlagsScriptParameters) => Promise<void>;
    deploy?: (script: InfinityMintFlagsScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: InfinityMintFlagsScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | InfinityMintFlagsDeployArgType;
}
export declare const InfinityMintFlags: InfinityMintFlagsDeployScript;
export declare abstract class InfinityMintLinkerDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends InfinityMintLinkerDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): InfinityMintLinkerContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<InfinityMintLinkerContract>;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        InfinityMintLinker?: InfinityMintLinkerDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        InfinityMintLinker?: InfinityMintLinkerDeploymentLive_Facade;
    }
}
export interface InfinityMintLinkerDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface InfinityMintLinkerScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: InfinityMintLinkerDeploymentClass;
    deployScript?: InfinityMintLinkerDeployScript;
}
export type InfinityMintLinkerDeployArgType = (params: InfinityMintLinkerScriptParameters) => Promise<string[]> | string[];
export interface InfinityMintLinkerDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: InfinityMintLinkerScriptParameters) => Promise<void>;
    cleanup?: (script: InfinityMintLinkerScriptParameters) => Promise<void | string[]>;
    update?: (script: InfinityMintLinkerScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: InfinityMintLinkerScriptParameters) => Promise<void>;
    deploy?: (script: InfinityMintLinkerScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: InfinityMintLinkerScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | InfinityMintLinkerDeployArgType;
}
export declare const InfinityMintLinker: InfinityMintLinkerDeployScript;
export declare abstract class InfinityMintProjectDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends InfinityMintProjectDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): InfinityMintProjectContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<InfinityMintProjectContract>;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        InfinityMintProject?: InfinityMintProjectDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        InfinityMintProject?: InfinityMintProjectDeploymentLive_Facade;
    }
}
export interface InfinityMintProjectDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface InfinityMintProjectScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: InfinityMintProjectDeploymentClass;
    deployScript?: InfinityMintProjectDeployScript;
}
export type InfinityMintProjectDeployArgType = (params: InfinityMintProjectScriptParameters) => Promise<string[]> | string[];
export interface InfinityMintProjectDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: InfinityMintProjectScriptParameters) => Promise<void>;
    cleanup?: (script: InfinityMintProjectScriptParameters) => Promise<void | string[]>;
    update?: (script: InfinityMintProjectScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: InfinityMintProjectScriptParameters) => Promise<void>;
    deploy?: (script: InfinityMintProjectScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: InfinityMintProjectScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | InfinityMintProjectDeployArgType;
}
export declare const InfinityMintProject: InfinityMintProjectDeployScript;
export declare abstract class InfinityMintStorageDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends InfinityMintStorageDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): InfinityMintStorageContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<InfinityMintStorageContract>;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        InfinityMintStorage?: InfinityMintStorageDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        InfinityMintStorage?: InfinityMintStorageDeploymentLive_Facade;
    }
}
export interface InfinityMintStorageDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface InfinityMintStorageScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: InfinityMintStorageDeploymentClass;
    deployScript?: InfinityMintStorageDeployScript;
}
export type InfinityMintStorageDeployArgType = (params: InfinityMintStorageScriptParameters) => Promise<string[]> | string[];
export interface InfinityMintStorageDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: InfinityMintStorageScriptParameters) => Promise<void>;
    cleanup?: (script: InfinityMintStorageScriptParameters) => Promise<void | string[]>;
    update?: (script: InfinityMintStorageScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: InfinityMintStorageScriptParameters) => Promise<void>;
    deploy?: (script: InfinityMintStorageScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: InfinityMintStorageScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | InfinityMintStorageDeployArgType;
}
export declare const InfinityMintStorage: InfinityMintStorageDeployScript;
export declare abstract class InfinityMintUtilDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends InfinityMintUtilDeployScript>(): T;
}
export interface InfinityMintUtilDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface InfinityMintUtilScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: InfinityMintUtilDeploymentClass;
    deployScript?: InfinityMintUtilDeployScript;
}
export type InfinityMintUtilDeployArgType = (params: InfinityMintUtilScriptParameters) => Promise<string[]> | string[];
export interface InfinityMintUtilDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: InfinityMintUtilScriptParameters) => Promise<void>;
    cleanup?: (script: InfinityMintUtilScriptParameters) => Promise<void | string[]>;
    update?: (script: InfinityMintUtilScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: InfinityMintUtilScriptParameters) => Promise<void>;
    deploy?: (script: InfinityMintUtilScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: InfinityMintUtilScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | InfinityMintUtilDeployArgType;
}
export declare const InfinityMintUtil: InfinityMintUtilDeployScript;
export declare abstract class InfinityMintValuesDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends InfinityMintValuesDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): InfinityMintValuesContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<InfinityMintValuesContract>;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        InfinityMintValues?: InfinityMintValuesDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        InfinityMintValues?: InfinityMintValuesDeploymentLive_Facade;
    }
}
export interface InfinityMintValuesDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface InfinityMintValuesScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: InfinityMintValuesDeploymentClass;
    deployScript?: InfinityMintValuesDeployScript;
}
export type InfinityMintValuesDeployArgType = (params: InfinityMintValuesScriptParameters) => Promise<string[]> | string[];
export interface InfinityMintValuesDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: InfinityMintValuesScriptParameters) => Promise<void>;
    cleanup?: (script: InfinityMintValuesScriptParameters) => Promise<void | string[]>;
    update?: (script: InfinityMintValuesScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: InfinityMintValuesScriptParameters) => Promise<void>;
    deploy?: (script: InfinityMintValuesScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: InfinityMintValuesScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | InfinityMintValuesDeployArgType;
}
export declare const InfinityMintValues: InfinityMintValuesDeployScript;
export declare abstract class EADStickersDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends EADStickersDeployScript>(): T;
}
export interface EADStickersDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface EADStickersScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: EADStickersDeploymentClass;
    deployScript?: EADStickersDeployScript;
}
export type EADStickersDeployArgType = (params: EADStickersScriptParameters) => Promise<string[]> | string[];
export interface EADStickersDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: EADStickersScriptParameters) => Promise<void>;
    cleanup?: (script: EADStickersScriptParameters) => Promise<void | string[]>;
    update?: (script: EADStickersScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: EADStickersScriptParameters) => Promise<void>;
    deploy?: (script: EADStickersScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: EADStickersScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | EADStickersDeployArgType;
}
export declare const EADStickers: EADStickersDeployScript;
export declare abstract class StickersV2DeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends StickersV2DeployScript>(): T;
}
export interface StickersV2DeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface StickersV2ScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: StickersV2DeploymentClass;
    deployScript?: StickersV2DeployScript;
}
export type StickersV2DeployArgType = (params: StickersV2ScriptParameters) => Promise<string[]> | string[];
export interface StickersV2DeployScript extends InfinityMintDeploymentScript {
    setup?: (script: StickersV2ScriptParameters) => Promise<void>;
    cleanup?: (script: StickersV2ScriptParameters) => Promise<void | string[]>;
    update?: (script: StickersV2ScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: StickersV2ScriptParameters) => Promise<void>;
    deploy?: (script: StickersV2ScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: StickersV2ScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | StickersV2DeployArgType;
}
export declare const StickersV2: StickersV2DeployScript;
export declare abstract class TokenAccountDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends TokenAccountDeployScript>(): T;
}
export interface TokenAccountDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface TokenAccountScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: TokenAccountDeploymentClass;
    deployScript?: TokenAccountDeployScript;
}
export type TokenAccountDeployArgType = (params: TokenAccountScriptParameters) => Promise<string[]> | string[];
export interface TokenAccountDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: TokenAccountScriptParameters) => Promise<void>;
    cleanup?: (script: TokenAccountScriptParameters) => Promise<void | string[]>;
    update?: (script: TokenAccountScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: TokenAccountScriptParameters) => Promise<void>;
    deploy?: (script: TokenAccountScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: TokenAccountScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | TokenAccountDeployArgType;
}
export declare const TokenAccount: TokenAccountDeployScript;
export declare abstract class RarityAnyDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends RarityAnyDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): RarityAnyContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<RarityAnyContract>;
    get values(): RarityAnyOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        RarityAny?: RarityAnyDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        RarityAny?: RarityAnyDeploymentLive_Facade;
    }
}
export interface RarityAnyDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: RarityAnyOnChainValues;
}
export interface RarityAnyScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: RarityAnyDeploymentClass;
    deployScript?: RarityAnyDeployScript;
}
export type RarityAnyDeployArgType = (params: RarityAnyScriptParameters) => Promise<string[]> | string[];
export interface RarityAnyDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: RarityAnyScriptParameters) => Promise<void>;
    cleanup?: (script: RarityAnyScriptParameters) => Promise<void | string[]>;
    update?: (script: RarityAnyScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: RarityAnyScriptParameters) => Promise<void>;
    deploy?: (script: RarityAnyScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: RarityAnyScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | RarityAnyDeployArgType;
    values?: RarityAnyOnChainValues;
}
export declare const RarityAny: RarityAnyDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        mustGenerateName?: boolean;
        nameCount?: number;
        colourChunkSize?: number;
        extraColours?: number;
        randomRarity?: boolean;
        lowestRarity?: boolean;
        highestRarity?: boolean;
        stopDuplicateMint?: boolean;
    }
}
export interface RarityAnyOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    mustGenerateName?: boolean;
    nameCount?: number;
    colourChunkSize?: number;
    extraColours?: number;
    randomRarity?: boolean;
    lowestRarity?: boolean;
    highestRarity?: boolean;
    stopDuplicateMint?: boolean;
}
export declare abstract class RarityImageDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends RarityImageDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): RarityImageContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<RarityImageContract>;
    get values(): RarityImageOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        RarityImage?: RarityImageDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        RarityImage?: RarityImageDeploymentLive_Facade;
    }
}
export interface RarityImageDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: RarityImageOnChainValues;
}
export interface RarityImageScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: RarityImageDeploymentClass;
    deployScript?: RarityImageDeployScript;
}
export type RarityImageDeployArgType = (params: RarityImageScriptParameters) => Promise<string[]> | string[];
export interface RarityImageDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: RarityImageScriptParameters) => Promise<void>;
    cleanup?: (script: RarityImageScriptParameters) => Promise<void | string[]>;
    update?: (script: RarityImageScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: RarityImageScriptParameters) => Promise<void>;
    deploy?: (script: RarityImageScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: RarityImageScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | RarityImageDeployArgType;
    values?: RarityImageOnChainValues;
}
export declare const RarityImage: RarityImageDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintConfigSettingsDeploy {
        paths?: {
            rarityChunkSize?: number;
        };
    }
}
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        mustGenerateName?: boolean;
        nameCount?: number;
        colourChunkSize?: number;
        extraColours?: number;
        randomRarity?: boolean;
        lowestRarity?: boolean;
        highestRarity?: boolean;
        stopDuplicateMint?: boolean;
    }
}
export interface RarityImageOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    mustGenerateName?: boolean;
    nameCount?: number;
    colourChunkSize?: number;
    extraColours?: number;
    randomRarity?: boolean;
    lowestRarity?: boolean;
    highestRarity?: boolean;
    stopDuplicateMint?: boolean;
}
export declare abstract class RaritySVGDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends RaritySVGDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): RaritySVGContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<RaritySVGContract>;
    get values(): RaritySVGOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        RaritySVG?: RaritySVGDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        RaritySVG?: RaritySVGDeploymentLive_Facade;
    }
}
export interface RaritySVGDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: RaritySVGOnChainValues;
}
export interface RaritySVGScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: RaritySVGDeploymentClass;
    deployScript?: RaritySVGDeployScript;
}
export type RaritySVGDeployArgType = (params: RaritySVGScriptParameters) => Promise<string[]> | string[];
export interface RaritySVGDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: RaritySVGScriptParameters) => Promise<void>;
    cleanup?: (script: RaritySVGScriptParameters) => Promise<void | string[]>;
    update?: (script: RaritySVGScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: RaritySVGScriptParameters) => Promise<void>;
    deploy?: (script: RaritySVGScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: RaritySVGScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | RaritySVGDeployArgType;
    values?: RaritySVGOnChainValues;
}
export declare const RaritySVG: RaritySVGDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        mustGenerateName?: boolean;
        nameCount?: number;
        colourChunkSize?: number;
        extraColours?: number;
        randomRarity?: boolean;
        lowestRarity?: boolean;
        highestRarity?: boolean;
        stopDuplicateMint?: boolean;
    }
}
export interface RaritySVGOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    mustGenerateName?: boolean;
    nameCount?: number;
    colourChunkSize?: number;
    extraColours?: number;
    randomRarity?: boolean;
    lowestRarity?: boolean;
    highestRarity?: boolean;
    stopDuplicateMint?: boolean;
}
export declare abstract class SeededRandomDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends SeededRandomDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): SeededRandomContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<SeededRandomContract>;
    get values(): SeededRandomOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        SeededRandom?: SeededRandomDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        SeededRandom?: SeededRandomDeploymentLive_Facade;
    }
}
export interface SeededRandomDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: SeededRandomOnChainValues;
}
export interface SeededRandomScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: SeededRandomDeploymentClass;
    deployScript?: SeededRandomDeployScript;
}
export type SeededRandomDeployArgType = (params: SeededRandomScriptParameters) => Promise<string[]> | string[];
export interface SeededRandomDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: SeededRandomScriptParameters) => Promise<void>;
    cleanup?: (script: SeededRandomScriptParameters) => Promise<void | string[]>;
    update?: (script: SeededRandomScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: SeededRandomScriptParameters) => Promise<void>;
    deploy?: (script: SeededRandomScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: SeededRandomScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | SeededRandomDeployArgType;
    values?: SeededRandomOnChainValues;
}
export declare const SeededRandom: SeededRandomDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        seedNumber?: number;
        maxRandomNumber?: number;
    }
}
export interface SeededRandomOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    seedNumber?: number;
    maxRandomNumber?: number;
}
export declare abstract class SelectiveMinterDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends SelectiveMinterDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): SelectiveMinterContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<SelectiveMinterContract>;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        SelectiveMinter?: SelectiveMinterDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        SelectiveMinter?: SelectiveMinterDeploymentLive_Facade;
    }
}
export interface SelectiveMinterDeploymentLive_Facade extends InfinityMintDeploymentLive {
}
export interface SelectiveMinterScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: SelectiveMinterDeploymentClass;
    deployScript?: SelectiveMinterDeployScript;
}
export type SelectiveMinterDeployArgType = (params: SelectiveMinterScriptParameters) => Promise<string[]> | string[];
export interface SelectiveMinterDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: SelectiveMinterScriptParameters) => Promise<void>;
    cleanup?: (script: SelectiveMinterScriptParameters) => Promise<void | string[]>;
    update?: (script: SelectiveMinterScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: SelectiveMinterScriptParameters) => Promise<void>;
    deploy?: (script: SelectiveMinterScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: SelectiveMinterScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | SelectiveMinterDeployArgType;
}
export declare const SelectiveMinter: SelectiveMinterDeployScript;
export declare abstract class SimpleAnyDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends SimpleAnyDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): SimpleAnyContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<SimpleAnyContract>;
    get values(): SimpleAnyOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        SimpleAny?: SimpleAnyDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        SimpleAny?: SimpleAnyDeploymentLive_Facade;
    }
}
export interface SimpleAnyDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: SimpleAnyOnChainValues;
}
export interface SimpleAnyScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: SimpleAnyDeploymentClass;
    deployScript?: SimpleAnyDeployScript;
}
export type SimpleAnyDeployArgType = (params: SimpleAnyScriptParameters) => Promise<string[]> | string[];
export interface SimpleAnyDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: SimpleAnyScriptParameters) => Promise<void>;
    cleanup?: (script: SimpleAnyScriptParameters) => Promise<void | string[]>;
    update?: (script: SimpleAnyScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: SimpleAnyScriptParameters) => Promise<void>;
    deploy?: (script: SimpleAnyScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: SimpleAnyScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | SimpleAnyDeployArgType;
    values?: SimpleAnyOnChainValues;
}
export declare const SimpleAny: SimpleAnyDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        mustGenerateName?: boolean;
        nameCount?: number;
        colourChunkSize?: number;
        extraColours?: number;
        randomRarity?: boolean;
        lowestRarity?: boolean;
        highestRarity?: boolean;
        stopDuplicateMint?: boolean;
    }
}
export interface SimpleAnyOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    mustGenerateName?: boolean;
    nameCount?: number;
    colourChunkSize?: number;
    extraColours?: number;
    randomRarity?: boolean;
    lowestRarity?: boolean;
    highestRarity?: boolean;
    stopDuplicateMint?: boolean;
}
export declare abstract class SimpleImageDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends SimpleImageDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): SimpleImageContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<SimpleImageContract>;
    get values(): SimpleImageOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        SimpleImage?: SimpleImageDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        SimpleImage?: SimpleImageDeploymentLive_Facade;
    }
}
export interface SimpleImageDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: SimpleImageOnChainValues;
}
export interface SimpleImageScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: SimpleImageDeploymentClass;
    deployScript?: SimpleImageDeployScript;
}
export type SimpleImageDeployArgType = (params: SimpleImageScriptParameters) => Promise<string[]> | string[];
export interface SimpleImageDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: SimpleImageScriptParameters) => Promise<void>;
    cleanup?: (script: SimpleImageScriptParameters) => Promise<void | string[]>;
    update?: (script: SimpleImageScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: SimpleImageScriptParameters) => Promise<void>;
    deploy?: (script: SimpleImageScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: SimpleImageScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | SimpleImageDeployArgType;
    values?: SimpleImageOnChainValues;
}
export declare const SimpleImage: SimpleImageDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintConfigSettingsDeploy {
        assets?: {
            rarityChunkSize?: number;
        };
    }
}
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        mustGenerateName?: boolean;
        nameCount?: number;
        colourChunkSize?: number;
        extraColours?: number;
        randomRarity?: boolean;
        lowestRarity?: boolean;
        highestRarity?: boolean;
        stopDuplicateMint?: boolean;
    }
}
export interface SimpleImageOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    mustGenerateName?: boolean;
    nameCount?: number;
    colourChunkSize?: number;
    extraColours?: number;
    randomRarity?: boolean;
    lowestRarity?: boolean;
    highestRarity?: boolean;
    stopDuplicateMint?: boolean;
}
export declare abstract class SimpleSVGDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends SimpleSVGDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): SimpleSVGContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<SimpleSVGContract>;
    get values(): SimpleSVGOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        SimpleSVG?: SimpleSVGDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        SimpleSVG?: SimpleSVGDeploymentLive_Facade;
    }
}
export interface SimpleSVGDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: SimpleSVGOnChainValues;
}
export interface SimpleSVGScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: SimpleSVGDeploymentClass;
    deployScript?: SimpleSVGDeployScript;
}
export type SimpleSVGDeployArgType = (params: SimpleSVGScriptParameters) => Promise<string[]> | string[];
export interface SimpleSVGDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: SimpleSVGScriptParameters) => Promise<void>;
    cleanup?: (script: SimpleSVGScriptParameters) => Promise<void | string[]>;
    update?: (script: SimpleSVGScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: SimpleSVGScriptParameters) => Promise<void>;
    deploy?: (script: SimpleSVGScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: SimpleSVGScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | SimpleSVGDeployArgType;
    values?: SimpleSVGOnChainValues;
}
export declare const SimpleSVG: SimpleSVGDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        mustGenerateName?: boolean;
        nameCount?: number;
        colourChunkSize?: number;
        extraColours?: number;
        randomRarity?: boolean;
        lowestRarity?: boolean;
        highestRarity?: boolean;
        stopDuplicateMint?: boolean;
    }
}
export interface SimpleSVGOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    mustGenerateName?: boolean;
    nameCount?: number;
    colourChunkSize?: number;
    extraColours?: number;
    randomRarity?: boolean;
    lowestRarity?: boolean;
    highestRarity?: boolean;
    stopDuplicateMint?: boolean;
}
export declare abstract class SimpleTokenDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends SimpleTokenDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): SimpleTokenContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<SimpleTokenContract>;
    get values(): SimpleTokenOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        SimpleToken?: SimpleTokenDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        SimpleToken?: SimpleTokenDeploymentLive_Facade;
    }
}
export interface SimpleTokenDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: SimpleTokenOnChainValues;
}
export interface SimpleTokenScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: SimpleTokenDeploymentClass;
    deployScript?: SimpleTokenDeployScript;
}
export type SimpleTokenDeployArgType = (params: SimpleTokenScriptParameters) => Promise<string[]> | string[];
export interface SimpleTokenDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: SimpleTokenScriptParameters) => Promise<void>;
    cleanup?: (script: SimpleTokenScriptParameters) => Promise<void | string[]>;
    update?: (script: SimpleTokenScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: SimpleTokenScriptParameters) => Promise<void>;
    deploy?: (script: SimpleTokenScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: SimpleTokenScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | SimpleTokenDeployArgType;
    values?: SimpleTokenOnChainValues;
}
export declare const SimpleToken: SimpleTokenDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        mustGenerateName?: boolean;
        nameCount?: number;
        colourChunkSize?: number;
        extraColours?: number;
        randomRarity?: boolean;
        lowestRarity?: boolean;
        highestRarity?: boolean;
        stopDuplicateMint?: boolean;
    }
}
export interface SimpleTokenOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    mustGenerateName?: boolean;
    nameCount?: number;
    colourChunkSize?: number;
    extraColours?: number;
    randomRarity?: boolean;
    lowestRarity?: boolean;
    highestRarity?: boolean;
    stopDuplicateMint?: boolean;
}
export declare abstract class SplitRoyaltyDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends SplitRoyaltyDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): SplitRoyaltyContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<SplitRoyaltyContract>;
    get values(): SplitRoyaltyOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        SplitRoyalty?: SplitRoyaltyDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        SplitRoyalty?: SplitRoyaltyDeploymentLive_Facade;
    }
}
export interface SplitRoyaltyDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: SplitRoyaltyOnChainValues;
}
export interface SplitRoyaltyScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: SplitRoyaltyDeploymentClass;
    deployScript?: SplitRoyaltyDeployScript;
}
export type SplitRoyaltyDeployArgType = (params: SplitRoyaltyScriptParameters) => Promise<string[]> | string[];
export interface SplitRoyaltyDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: SplitRoyaltyScriptParameters) => Promise<void>;
    cleanup?: (script: SplitRoyaltyScriptParameters) => Promise<void | string[]>;
    update?: (script: SplitRoyaltyScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: SplitRoyaltyScriptParameters) => Promise<void>;
    deploy?: (script: SplitRoyaltyScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: SplitRoyaltyScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | SplitRoyaltyDeployArgType;
    values?: SplitRoyaltyOnChainValues;
}
export declare const SplitRoyalty: SplitRoyaltyDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        startingPrice?: ValuesReturnType;
        baseTokenValue?: number;
        stickerSplit?: number;
    }
}
export interface SplitRoyaltyOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    startingPrice?: ValuesReturnType;
    baseTokenValue?: number;
    stickerSplit?: number;
}
export declare abstract class UnsafeRandomDeploymentClass extends InfinityMintDeployment {
    getDeploymentScript<T extends UnsafeRandomDeployScript>(): T;
    /**
     *  Returns a read only contract which you can use to read values on chain
     *  @returns
     */
    get read(): UnsafeRandomContract;
    /**
     * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
     * @returns
     */
    write(): Promise<UnsafeRandomContract>;
    get values(): UnsafeRandomOnChainValues;
}
declare module '@app/interfaces' {
    interface InfinityMintDeployments {
        UnsafeRandom?: UnsafeRandomDeploymentClass;
    }
}
declare module '@app/interfaces' {
    interface InfinityMintLiveDeployments {
        UnsafeRandom?: UnsafeRandomDeploymentLive_Facade;
    }
}
export interface UnsafeRandomDeploymentLive_Facade extends InfinityMintDeploymentLive {
    values?: UnsafeRandomOnChainValues;
}
export interface UnsafeRandomScriptParameters extends InfinityMintDeploymentParameters {
    deployment?: UnsafeRandomDeploymentClass;
    deployScript?: UnsafeRandomDeployScript;
}
export type UnsafeRandomDeployArgType = (params: UnsafeRandomScriptParameters) => Promise<string[]> | string[];
export interface UnsafeRandomDeployScript extends InfinityMintDeploymentScript {
    setup?: (script: UnsafeRandomScriptParameters) => Promise<void>;
    cleanup?: (script: UnsafeRandomScriptParameters) => Promise<void | string[]>;
    update?: (script: UnsafeRandomScriptParameters) => Promise<Contract | Contract[]>;
    post?: (script: UnsafeRandomScriptParameters) => Promise<void>;
    deploy?: (script: UnsafeRandomScriptParameters) => Promise<{
        contract: Contract | Contract[];
        localDeployment: InfinityMintDeploymentLocal;
    }>;
    switch?: (script: UnsafeRandomScriptParameters) => Promise<Contract | Contract[]>;
    deployArgs?: string[] | UnsafeRandomDeployArgType;
    values?: UnsafeRandomOnChainValues;
}
export declare const UnsafeRandom: UnsafeRandomDeployScript;
declare module '@app/interfaces' {
    interface InfinityMintProjectSettingsValues {
        seedNumber?: number;
        maxRandomNumber?: number;
    }
}
export interface UnsafeRandomOnChainValues extends Dictionary<number | boolean | ValuesReturnType> {
    [key: string]: number | boolean | ValuesReturnType;
    seedNumber?: number;
    maxRandomNumber?: number;
}
//# sourceMappingURL=deployments.d.ts.map