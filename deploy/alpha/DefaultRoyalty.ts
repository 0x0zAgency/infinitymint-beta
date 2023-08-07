import { InfinityMintDeploymentScript } from '../../app/interfaces';

const DefaultRoyalty: InfinityMintDeploymentScript = {
    //going to give
    unique: true,
    module: 'royalty',
    index: 5,
    deployArgs: ['values'],
    solidityFolder: 'alpha',
    permissions: ['all', 'erc721', 'assets'],
};

export default DefaultRoyalty;
