import { InfinityMintDeploymentScript } from '../../app/interfaces';

const DefaultMinter: InfinityMintDeploymentScript = {
    //going to give
    unique: true,
    module: 'minter',
    index: 7,
    deployArgs: ['values', 'storage', 'assets', 'random'],
    solidityFolder: 'alpha',
    permissions: ['approved', 'erc721', 'assets'],
};

export default DefaultMinter;
