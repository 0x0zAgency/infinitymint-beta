import InfinityConsole from '../../../app/console';
import { Request, Response } from 'express';
import fs from 'fs';
import {
    findProject,
    getCompiledProject,
    getDeployedProject,
} from '../../../app/projects';
import { ExpressError } from '../../../app/express';
import { createUpdate, hasUpdate } from '../../../app/updates';
import { InfinityMintCompiledProject } from '../../../app/interfaces';
import { isTypescript } from '../../../app/helpers';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    let source = req.query.source as string;
    let useCompiled = req.query.useCompiled as string;
    let network = req.query.network as string;
    let version = req.query.version as string;
    let tag = req.query.tag as string;

    if (!source) return new ExpressError('missing parameters');
    if (!version) return new ExpressError('missing version');
    if (!tag) tag = version;

    let project = findProject(source);
    if (!project) return new ExpressError('project not found');

    if (useCompiled) project = getCompiledProject(source);
    else if (network)
        project = getDeployedProject(
            project,
            network || infinityConsole.network.name
        );

    if (hasUpdate(project as InfinityMintCompiledProject, version, network))
        return new ExpressError('update already exists for verison ' + version);

    let update = createUpdate(
        project as InfinityMintCompiledProject,
        version,
        tag,
        network,
        true,
        isTypescript()
    );

    return update;
};
