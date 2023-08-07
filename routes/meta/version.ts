import {
    getInfinityMintClientVersion,
    getInfinityMintVersion,
} from '../../app/helpers';
import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    return {
        success: true,
        server: getInfinityMintVersion(),
        client: getInfinityMintClientVersion(),
    };
};
