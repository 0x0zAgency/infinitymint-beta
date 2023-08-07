import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    return {
        updates: infinityConsole.getUpdates(),
    };
};
