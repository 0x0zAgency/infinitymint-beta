import { getConfigFile, getExpressConfig, isEnvTrue } from '../app/helpers';
import InfinityConsole from '../app/console';
import { Request, Response } from 'express';

export const post = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    let expressConfig = getExpressConfig();
    return {
        alive: true,
        production: isEnvTrue('PRODUCTION'),
        developer: !isEnvTrue('PRODUCTION'),
        websockets: expressConfig.sockets !== undefined,
        meta: !isEnvTrue('PRODUCTION') && !expressConfig.disableMeta,
    };
};

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    return post(req, res, infinityConsole);
};
