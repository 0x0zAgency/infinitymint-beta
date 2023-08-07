import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import {
    getConfigFile,
    getCustomBlessedElements,
    readGlobalSession,
} from '../../app/helpers';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    let network = infinityConsole.network;

    delete network.provider;
    delete network.config.accounts;

    let config = getConfigFile();
    if (config.settings?.networks) {
        //check if to expose RPC url
        if (!config.settings?.networks?.[network.name]?.exposeRpc) {
            (network.config as any).url = undefined;
        }
    }

    let session = readGlobalSession();

    return {
        sessionId: infinityConsole.getSessionId(),
        chainId: infinityConsole.getCurrentChainId(),
        network: infinityConsole.network.name,
        networkAccess: infinityConsole.hasNetworkAccess(),
        windows: infinityConsole.windows.forEach((window) => window.name),
        elements: Object.keys(getCustomBlessedElements()),
        gems: infinityConsole.getGems(),
        defaultProject: session.environment.defaultProject || {},
        project: session.environment.project || undefined,
        defaultNetwork: session.environment.defaultNetwork,
        accounts: infinityConsole.hasNetworkAccess()
            ? infinityConsole.getSigners().map((signer) => signer.address)
            : [],
        scripts: infinityConsole.getScripts(),
        projects: infinityConsole.getProjectNames(),
    };
};
