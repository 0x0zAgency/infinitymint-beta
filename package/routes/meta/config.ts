import { Request, Response } from 'express';
import { getConfigFile } from '../../app/helpers';

export const get = async (req: Request, res: Response) => {
    let config = getConfigFile();
    delete config.hardhat;

    return {
        ...config,
    };
};
