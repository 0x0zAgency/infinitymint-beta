import InfinityConsole from '../../../app/console';
import { Request, Response } from 'express';
import fs from 'fs';
import { getProject } from '../../../app/projects';

export const post = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    let source = req.body?.source as string;
    let blob = req.body?.blob as string;

    if (!source) return res.status(404).json({ error: 'missing parameters' });

    let project = getProject(source);
    if (!project) return res.status(404).json({ error: 'project not found' });

    let path = infinityConsole.getProjectPath(project);

    if (!fs.existsSync(path.dir + '/' + path.base))
        return res.status(404).json({ error: 'project source file not found' });

    fs.writeFileSync(path.dir + '/' + path.base, blob);
    return res.json({ status: 'success' });
};
