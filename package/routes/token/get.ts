import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import {
    findProjects,
    findProject,
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
    let tokenId = parseInt(req.query.tokenId as string);

    if (isNaN(tokenId) || tokenId < 0)
        return new ExpressError('invalid token id');

    if (!source || !version || !tokenId)
        return new ExpressError('missing parameters');

    //remove special characters
    version = version.replace(/[^0-9.]/g, '');
    network = network.replace(/[^a-zA-Z0-9]/g, '');

    let projects = await findProjects();
    if (projects.length === 0) return new ExpressError('no projects found');

    let project = findProject(source);
    if (!project) return new ExpressError('current project not deployed');

    if (!hasDeployedProject(project, network, version))
        return new ExpressError('project not deployed');
    else {
        let projectClass = await infinityConsole.getProject(project, network);
        let storage = await projectClass.storage();
        let erc721 = await projectClass.erc721();

        try {
            let tokenId = parseInt(req.params.id);
            let token = await storage.get(tokenId);
            let uri = await erc721.tokenURI(tokenId);

            //we use resJson to safely serialize the token and uri and return them
            return {
                tokenId: tokenId,
                token: token,
                uri: uri,
            };
        } catch (error) {
            return new ExpressError(
                'failed to fetch token data from blockchain'
            );
        }
    }
};
