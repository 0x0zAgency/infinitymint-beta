import InfinityConsole from '../../../app/console';
import { Request, Response } from 'express';
import fs from 'fs';

//needs to accept a project through post
//check that the project compiles okay
//if it does not then return an error
//this end point would only be made available to the admin as its very unsafe

export const post = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    res.json({
        status: 'success',
    });
};
