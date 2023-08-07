import InfinityConsole from '../../../app/console';
import { Request, Response } from 'express';
import fs from 'fs';
import { findProject } from '../../../app/projects';
import { ExpressError } from '../../../app/express';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    let source = req.query.source as string;

    if (!source) return new ExpressError('missing parameters');

    let project = findProject(source);
    if (!project) return new ExpressError('project not found');

    let path = infinityConsole.getProjectPath(project);

    if (!fs.existsSync(path.dir + '/' + path.base))
        return new ExpressError('project source file not found');

    return res.sendFile(path.dir + '/' + path.base);
};
