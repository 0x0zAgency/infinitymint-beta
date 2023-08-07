import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import {
    findProjects,
    getDeployedProject,
    getProject,
    getProjectFullName,
    hasDeployedProject,
} from '../../app/projects';
import fs from 'fs';

export const get = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    let source = req.query.source as string;
    let version = req.query.version as string;
    let key = req.query.key as string;
    if (!source || !version || !key)
        return res.status(404).json({ error: 'missing parameters' });

    //remove special characters
    version = version.replace(/[^0-9.]/g, '');

    let projects = await findProjects();

    if (projects.length === 0)
        return res.status(404).json({ error: 'no projects found' });

    let project;
    try {
        project = getProject(source);
    } catch (error) {
        return res.status(404).json({ error: 'project not found' });
    }

    if (!project)
        return res.status(404).json({ error: 'current project not deployed' });

    if (
        !hasDeployedProject(
            project,
            infinityConsole.getCurrentNetwork().name,
            version
        )
    )
        return res.status(404).json({ error: 'project not deployed' });

    let deployedProject = getDeployedProject(
        project,
        infinityConsole.getCurrentNetwork().name,
        version
    );

    let imports = infinityConsole.getImports();

    if (!deployedProject.imports[key])
        return res.status(404).json({ error: 'import not found in project' });

    let importItem = imports.database[deployedProject.imports[key]];

    if (!importItem) return res.status(404).json({ error: 'import not found' });
    //get the importItem from the pathLike object and serve it
    let path = importItem.dir + '/' + importItem.base;

    if (!fs.existsSync(path))
        return res.status(404).json({ error: 'import link not found' });

    res.sendFile(path);
};
