import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import {
    getCompiledProject,
    getDeployedProject,
    getProject,
    hasCompiledProject,
    hasDeployedProject,
} from '../../app/projects';

export const get = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    let source = req.query.source as string;
    let version = req.query.version as string;
    let network =
        (req.query.network as string) ||
        infinityConsole.getCurrentNetwork().name;
    let type = (req.query.type as string) || 'deployed';

    if (!source || !version || !type)
        return res.status(404).json({ error: 'missing parameters' });

    //remove special characters
    version = version.replace(/[^0-9.]/g, '');
    type = type.replace(/[^a-zA-Z0-9]/g, '');
    network = network.replace(/[^a-zA-Z0-9]/g, '');

    let project = getProject(source);

    if (!project)
        return res.status(404).json({ error: 'current project not deployed' });

    if (type === 'deployed' && !hasDeployedProject(project, network, version))
        return res.status(404).json({ error: 'project not deployed' });
    else if (type === 'deployed') {
        res.json(getDeployedProject(project, network, version));
    } else if (type === 'compiled' && !hasCompiledProject(project, version)) {
        return res.status(404).json({ error: 'project not compiled' });
    } else if (type === 'compiled') {
        res.json(getCompiledProject(project, version));
    } else return res.status(404).json({ error: 'unknown project type' });
};
