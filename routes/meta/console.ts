import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import { ExpressServer } from '../../app/express';
import {
    getConfigFile,
    getCustomBlessedElements,
    readGlobalSession,
} from '../../app/helpers';

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

    let session = readGlobalSession();

    res.json({
        sessionId: infinityConsole.getSessionId(),
        network: network,
        windows: infinityConsole.getWindows().forEach((window) => window.name),
        elements: Object.keys(getCustomBlessedElements()),
        gems: infinityConsole.gems,
        defaultProject: session.environment.defaultProject || {},
        project: session.environment.project || undefined,
        defaultNetwork: session.environment.defaultNetwork,
        accounts: infinityConsole.getSigners().map((signer) => signer.address),
        scripts: infinityConsole.getScripts(),
        projects: infinityConsole.getProjects(),
    });
};
