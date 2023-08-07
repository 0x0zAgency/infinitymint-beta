import { Dictionary } from './helpers';
import { TransactionReceipt } from '@ethersproject/providers';
import { InfinityMintDeployedProject } from './interfaces';
export interface Report {
    gasUsage: number;
    averageGasPrice: number;
    wei: number;
    cost: string;
    transactions: number;
    receipts: TransactionReceipt[];
}
export type TokenPriceFunction = () => Promise<{
    usd: number;
}>;
export type GasPriceFunction = () => Promise<{
    slow: number;
    medium: number;
    fast: number;
}>;
export type NetworkHandler = {
    gas: GasPriceFunction[];
    price: TokenPriceFunction[];
};
export declare const handlers: Dictionary<NetworkHandler>;
export declare const registerGasPriceHandler: (network: string, handler: GasPriceFunction) => GasPriceFunction | TokenPriceFunction;
export declare const removeGasHandler: (network: string, handler?: GasPriceFunction) => void;
export declare const removeTokenPriceHandler: (network: string, handler?: GasPriceFunction) => void;
/**
 * Reads InfinityMint configuration file and and registers any gas and price handlers we have for each network
 * @param config
 */
export declare const registerGasAndPriceHandlers: () => void;
export declare const getTotalGasUsage: (receipts: TransactionReceipt[]) => number;
export declare const getReport: (receipts: TransactionReceipt[]) => Report;
export declare const hasReport: (project: InfinityMintDeployedProject) => boolean;
export declare const readReport: (projectName: string, version?: string, network?: string) => Report;
export declare const readProjectReport: (project: InfinityMintDeployedProject) => Report;
export declare const saveReport: (project: InfinityMintDeployedProject, report: Report) => void;
export declare const removeHandler: (network: string, type: 'gas' | 'price', handler: GasPriceFunction | TokenPriceFunction) => void;
export declare const registerHandler: (network: string, type: string, handler: TokenPriceFunction | GasPriceFunction) => GasPriceFunction | TokenPriceFunction;
export declare const registerTokenPriceHandler: (network: string, handler: TokenPriceFunction) => GasPriceFunction | TokenPriceFunction;
export declare const getTokenPriceHandlers: (network: string) => TokenPriceFunction[];
export declare const getGasPriceHandlers: (network: string) => GasPriceFunction[];
//# sourceMappingURL=gasAndPrices.d.ts.map