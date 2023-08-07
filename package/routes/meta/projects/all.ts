import { getProjectCache } from '../../../app/projects';
import { Request, Response } from 'express';

export const get = async (req: Request, res: Response) => {
    return getProjectCache();
};
