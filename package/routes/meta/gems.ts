import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    let gems = infinityConsole.getGems();
    return {
        gems,
    };
};
