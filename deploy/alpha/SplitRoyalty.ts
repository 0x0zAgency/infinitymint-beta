import { InfinityMintDeploymentScript } from '../../app/interfaces';

const SplitRoyalty: InfinityMintDeploymentScript = {
    //going to give
    unique: true,
    module: 'royalty',
    index: 5,
    deployArgs: ['values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'assets', 'minter', 'all'],
    setup: async (params) => {
        //read royalty info and set up royalty
    },
};

export default SplitRoyalty;
