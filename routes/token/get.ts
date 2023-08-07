import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import { ExpressServer } from '../../app/express';
import {
    findProjects,
    getCompiledProject,
    getDeployedProject,
    getProject,
    hasCompiledProject,
    hasDeployedProject,
} from '../../app/projects';
import { InfinityMint } from '@typechain-types/InfinityMint';
import { InfinityMintStorage } from '@typechain-types/InfinityMintStorage';

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
    let tokenId = parseInt(req.query.tokenId as string);

    if (isNaN(tokenId) || tokenId < 0)
        return res.status(404).json({ error: 'invalid token id' });

    if (!source || !version || !tokenId)
        return res.status(404).json({ error: 'missing parameters' });

    //remove special characters
    version = version.replace(/[^0-9.]/g, '');
    network = network.replace(/[^a-zA-Z0-9]/g, '');

    let projects = await findProjects();

    if (projects.length === 0)
        return res.status(404).json({ error: 'no projects found' });

    let project = getProject(source);

    if (!project)
        return res.status(404).json({ error: 'current project not deployed' });

    if (!hasDeployedProject(project, network, version))
        return res.status(404).json({ error: 'project not deployed' });
    else {
        let deployments = await infinityConsole.getProjectDeploymentClasses(
            getDeployedProject(project, network, version)
        );
        let infinityMint = (await deployments[
            'InfinityMint'
        ].getSignedContract()) as InfinityMint;
        let storage = (await deployments[
            'InfinityMintStorage'
        ].getSignedContract()) as InfinityMintStorage;
        try {
            let tokenId = parseInt(req.params.id);
            let token = await storage.get(tokenId);
            let uri = await infinityMint.tokenURI(tokenId);
            return res.json({
                tokenId: tokenId,
                token: token,
                uri: uri,
            });
        } catch (error) {
            return res.status(404).json({ error: 'invalid token id' });
        }
    }
};
