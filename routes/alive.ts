import InfinityConsole from '../app/console';
import { Request, Response } from 'express';

export const post = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    res.json({
        status: 'success',
    });
};

export const get = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    res.json({
        status: 'success',
    });
};
