import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import { getConfigFile, makeJsonSafe } from '../../app/helpers';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    let network = infinityConsole.network;

    delete network.provider;
    delete network.config.accounts;

    let config = getConfigFile();

    //do network settings stuff
    if (config?.settings?.networks) {
        //check if to expose RPC url
        if (!config?.settings?.networks?.[network.name]?.exposeRpc) {
            (network.config as any).url = undefined;
        }
    }

    return {
        name: network.name,
        chainId: infinityConsole.getCurrentChainId(),
        rpc: (network.config as any).url,
        networkAccess: infinityConsole.hasNetworkAccess(),
        accounts: infinityConsole.hasNetworkAccess()
            ? infinityConsole.getSigners().map((signer) => signer.address)
            : [],
        config: makeJsonSafe(network.config),
    };
};
