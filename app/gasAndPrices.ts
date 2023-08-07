import { Dictionary } from './helpers';
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
