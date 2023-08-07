import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import { getConfigFile } from '../../app/helpers';

export const get = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    let network = infinityConsole.getCurrentNetwork();

    delete network.provider;
    delete network.config.accounts;

    let config = getConfigFile();

    if (config.settings && config.settings.networks) {
        //check if to expose RPC url
        if (
            !config.settings.networks[network.name] ||
            !config.settings.networks[network.name].exposeRpc
        ) {
            (network.config as any).url = undefined;
        }
    }

    //
    res.json({
        ...network,
        chainId: infinityConsole.getCurrentChainId(),
        rpc: (network.config as any).url,
    });
};
