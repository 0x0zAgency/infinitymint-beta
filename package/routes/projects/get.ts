import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import {
    getCompiledProject,
    getDeployedProject,
    findProject,
    hasCompiledProject,
    hasDeployedProject,
} from '../../app/projects';
import { ExpressError } from '../../app/express';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    let source = req.query.source as string;
    let version = req.query.version as string;
    let network = (req.query.network as string) || infinityConsole.network.name;
    let type = (req.query.type as string) || 'deployed';

    if (!source || !version || !type)
        return new ExpressError('missing parameters');

    //remove special characters
    version = version.replace(/[^0-9.]/g, '');
    type = type.replace(/[^a-zA-Z0-9]/g, '');
    network = network.replace(/[^a-zA-Z0-9]/g, '');

    let project = findProject(source);

    if (!project) return new ExpressError('current project not deployed');

    if (type === 'deployed' && !hasDeployedProject(project, network, version))
        return new ExpressError('project not deployed');
    else if (type === 'deployed') {
        return getDeployedProject(project, network, version);
    } else if (type === 'compiled' && !hasCompiledProject(project, version)) {
        return new ExpressError('project not compiled');
    } else if (type === 'compiled') {
        return getCompiledProject(project, version);
    } else return new ExpressError('unknown project type');
};
