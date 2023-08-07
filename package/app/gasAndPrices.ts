import { Dictionary, cwd, getConfigFile, makeDirectories } from './helpers';
import { TransactionReceipt } from '@ethersproject/providers';
import fs from 'fs';
import path from 'path';
import { InfinityMintDeployedProject } from './interfaces';
import { getFullyQualifiedName } from './projects';
import hre from 'hardhat';

export interface Report {
    gasUsage: number;
    averageGasPrice: number;
    wei: number;
    cost: string;
    transactions: number;
    receipts: TransactionReceipt[];
}

export type TokenPriceFunction = () => Promise<{ usd: number }>;
export type GasPriceFunction = () => Promise<{
    slow: number;
    medium: number;
    fast: number;
}>;
export type NetworkHandler = {
    gas: GasPriceFunction[];
    price: TokenPriceFunction[];
};

export const handlers = {} as Dictionary<NetworkHandler>;

export const registerGasPriceHandler = (
    network: string,
    handler: GasPriceFunction
) => {
    return registerHandler(network, 'gas', handler);
};

export const removeGasHandler = (
    network: string,
    handler?: GasPriceFunction
) => {
    if (!handler) handlers[network].gas = [];
    else removeHandler(network, 'gas', handler);
};

export const removeTokenPriceHandler = (
    network: string,
    handler?: GasPriceFunction
) => {
    if (!handlers[network]) handlers[network].price = [];
    else removeHandler(network, 'price', handler);
};

/**
 * Reads InfinityMint configuration file and and registers any gas and price handlers we have for each network
 * @param config
 */
export const registerGasAndPriceHandlers = () => {
    let config = getConfigFile();
    Object.keys(config?.settings?.networks || {}).forEach((key) => {
        let network = config?.settings?.networks[key];
        if (!network.handlers) return;

        if (network.handlers.gasPrice)
            registerGasPriceHandler(key, network.handlers.gasPrice);

        if (network.handlers.tokenPrice)
            registerTokenPriceHandler(key, network.handlers.tokenPrice);
    });
};

export const getTotalGasUsage = (receipts: TransactionReceipt[]) => {
    let total = 0;

    receipts.forEach((receipt) => {
        total += receipt.gasUsed.toNumber();
    });

    return total;
};

export const getReport = (receipts: TransactionReceipt[]): Report => {
    let report: Report = {
        gasUsage: getTotalGasUsage(receipts),
        averageGasPrice: 0,
        wei: 0,
        cost: '0.0',
        transactions: receipts.length,
        receipts: receipts,
    };

    //get the average gas price
    receipts.forEach((receipt) => {
        report.averageGasPrice += receipt.effectiveGasPrice.toNumber();
    });

    report.averageGasPrice /= receipts.length;
    report.wei = report.averageGasPrice * report.gasUsage;
    report.cost = (report.wei / 10 ** 18).toFixed(4);

    return report;
};

export const hasReport = (project: InfinityMintDeployedProject) => {
    return fs.existsSync(
        path.join(
            cwd(),
            '/projects/reports/',
            getFullyQualifiedName(project) + '.report.json'
        )
    );
};

export const readReport = (
    projectName: string,
    version?: string,
    network?: string
) => {
    version = version || '1.0.0';
    network = network || hre.network.name;
    return JSON.parse(
        fs.readFileSync(
            path.join(
                cwd(),
                '/projects/reports/',
                projectName + '@' + version + '_' + network + '.report.json'
            ),
            'utf-8'
        )
    ) as Report;
};

export const readProjectReport = (project: InfinityMintDeployedProject) => {
    if (!hasReport(project)) return null;

    return JSON.parse(
        fs.readFileSync(
            path.join(
                cwd(),
                '/projects/reports/',
                getFullyQualifiedName(project) + '.report.json'
            ),
            'utf-8'
        )
    ) as Report;
};

export const saveReport = (
    project: InfinityMintDeployedProject,
    report: Report
) => {
    makeDirectories(path.join(cwd(), '/projects/reports/'));

    fs.writeFileSync(
        path.join(
            cwd(),
            '/projects/reports/',
            getFullyQualifiedName(project) + '.report.json'
        ),
        JSON.stringify(report, null, 4)
    );
};

export const removeHandler = (
    network: string,
    type: 'gas' | 'price',
    handler: GasPriceFunction | TokenPriceFunction
) => {
    if (!handlers[network] || !handlers[network][type]) return;

    if (handlers[network][type].length === 0) handlers[network][type] = [];

    if (type === 'gas')
        handlers[network]['gas'] = handlers[network]['gas'].filter(
            (thatHandler) => thatHandler.toString() !== handler.toString()
        );
    else
        handlers[network]['price'] = handlers[network]['price'].filter(
            (thatHandler) => thatHandler.toString() !== handler.toString()
        );
};

export const registerHandler = (
    network: string,
    type: string,
    handler: TokenPriceFunction | GasPriceFunction
) => {
    if (!handlers[network])
        handlers[network] = {
            gas: [],
            price: [],
        };
    if (!handlers[network][type]) handlers[network][type] = [];

    handlers[network][type].push(handler as any);

    return handler;
};

export const registerTokenPriceHandler = (
    network: string,
    handler: TokenPriceFunction
) => {
    return registerHandler(network, 'price', handler);
};

export const getTokenPriceHandlers = (network: string) => {
    if (!handlers[network] || !handlers[network]['price'])
        return [
            async () => {
                return {
                    usd: 0,
                };
            },
        ];

    return handlers[network]['price'];
};

export const getGasPriceHandlers = (network: string) => {
    if (!handlers[network] || !handlers[network]['gas'])
        return [
            async () => {
                return {
                    slow: 0,
                    medium: 0,
                    fast: 0,
                };
            },
        ];

    return handlers[network]['gas'];
};
