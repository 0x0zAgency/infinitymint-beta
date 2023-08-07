import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import {
    findProjects,
    getDeployedProject,
    findProject,
    hasDeployedProject,
} from '../../app/projects';
import fs from 'fs';
import { ExpressError } from '../../app/express';
import path from 'path';

export const get = async (
    req: Request,
    res: Response,
    infinityConsole: InfinityConsole
) => {
    let source = req.query.source as string;
    let version = req.query.version as string;
    let key = req.query.key as string;
    if (!source || !version || !key)
        return new ExpressError('missing parameters');

    //remove special characters
    version = version.replace(/[^0-9.]/g, '');

    let projects = await findProjects();

    if (projects.length === 0) return new ExpressError('no projects found');

    let project;
    try {
        project = findProject(source);
    } catch (error) {
        return new ExpressError('project not found');
    }

    if (!project) return new ExpressError('current project not deployed');

    if (!hasDeployedProject(project, infinityConsole.network.name, version))
        return new ExpressError('project not deployed');

    let deployedProject = getDeployedProject(
        project,
        infinityConsole.network.name,
        version
    );

    let imports = infinityConsole.getImports();

    if (!deployedProject.imports[key])
        return new ExpressError('import not found in project');

    let importItem = imports.database[deployedProject.imports[key]];

    if (!importItem) return new ExpressError('import not found');
    //get the importItem from the pathLike object and serve it
    if (!fs.existsSync(importItem.dir + '/' + importItem.base))
        return new ExpressError('import link not found');

    res.sendFile(path.resolve(importItem.dir + '/' + importItem.base));
};
