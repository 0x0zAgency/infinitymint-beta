import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';

export const get = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    res.json({
        ...infinityConsole.getProjects(),
    });
};
