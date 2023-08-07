import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import { ExpressError } from '../../app/express';
import {
    findProjects,
    getDeployedProject,
    findProject,
    hasDeployedProject,
} from '../../app/projects';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    let source = req.query.source as string;
    let version = req.query.version as string;
    let network = (req.query.network as string) || infinityConsole.network.name;
    let contractName = req.query.contractName as string;

    if (!source || !version || !contractName)
        return new ExpressError('missing parameters');

    //remove special characters
    version = version.replace(/[^0-9.]/g, '');
    network = network.replace(/[^a-zA-Z0-9]/g, '');
    contractName = contractName.replace(/[^a-zA-Z0-9]/g, '');

    let projects = await findProjects();

    if (projects.length === 0) return new ExpressError('no projects found');

    let project = findProject(source);
    if (!project) return new ExpressError('project not found');

    if (!hasDeployedProject(project, network, version))
        return new ExpressError('project not deployed');

    let deployedProject = getDeployedProject(project, network, version);

    if (!deployedProject.deployments[contractName])
        return new ExpressError('contract not deployed');

    return deployedProject.deployments[contractName];
};
