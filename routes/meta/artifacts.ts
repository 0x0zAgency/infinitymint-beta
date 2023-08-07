import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import hre from 'hardhat';

export const get = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    let artifacts = await hre.artifacts.getAllFullyQualifiedNames();

    //
    res.json({
        artifacts,
    });
};
