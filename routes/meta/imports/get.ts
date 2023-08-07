import { Request, Response } from 'express';
import { getImports } from '../../../app/imports';
import path from 'path';
import { ExpressError } from '../../../app/express';

export const get = async (req: Request, res: Response) => {
    let key = req.query.key as string;
    let importCache = await getImports();

    if (!importCache.database[key])
        return new ExpressError('Import not found: ' + key);

    res.sendFile(
        path.resolve(
            importCache.database[key].dir + '/' + importCache.database[key].base
        )
    );
};
