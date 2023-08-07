import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import { getExpressConfig } from '../../app/helpers';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    let express = getExpressConfig();

    return {
        online: infinityConsole.hasWebSockets(),
        config: express?.sockets || {},
    };
};
