import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import { ExpressServer } from '../../app/express';
import {
    findProjects,
    getDeployedProject,
    getProject,
    hasDeployedProject,
} from '../../app/projects';
import fs from 'fs';
import { log, logDirect } from '../../app/helpers';

export const post = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {};

export const init = async (
    infinityConsole: InfinityConsole,
    server: ExpressServer
) => {};

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
    let contractName = req.query.contractName as string;

    if (!source || !version || !contractName)
        return res.status(404).json({ error: 'missing parameters' });

    //remove special characters
    version = version.replace(/[^0-9.]/g, '');
    network = network.replace(/[^a-zA-Z0-9]/g, '');
    contractName = contractName.replace(/[^a-zA-Z0-9]/g, '');

    let projects = await findProjects();

    if (projects.length === 0)
        return res.status(404).json({ error: 'no projects found' });

    let project = getProject(source);

    if (!project) return res.status(404).json({ error: 'project not found' });

    if (!hasDeployedProject(project, network, version))
        return res.status(404).json({ error: 'project not deployed' });

    let deployedProject = getDeployedProject(project, network, version);

    if (!deployedProject.deployments[contractName])
        return res.status(404).json({ error: 'contract not deployed' });

    return res.json(deployedProject.deployments[contractName]);
};
