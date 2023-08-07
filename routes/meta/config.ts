import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import { getConfigFile } from '../../app/helpers';

export const get = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    let config = getConfigFile();

    delete config.hardhat;

    //
    //
    res.json({
        ...config,
    });
};
