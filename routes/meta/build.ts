import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import hre from 'hardhat';

export const get = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    let artifactName = req.query.artifactName as string;

    if (!artifactName)
        return res.status(400).json({
            error: 'Artifact name not provided.',
        });

    let artifacts = await hre.artifacts.getAllFullyQualifiedNames();
    if (!artifacts.includes(artifactName))
        return res.status(400).json({
            error: 'Artifact name not found.',
        });

    let artifact = await hre.artifacts.readArtifact(artifactName);
    res.json({
        artifact,
    });
};
