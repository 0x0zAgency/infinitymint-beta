import { InfinityMintDeploymentScript } from '../../app/interfaces';
import RarityImage from './RarityImage';

const RaitySVG: InfinityMintDeploymentScript = {
    //going to give
    unique: true,
    module: 'assets',
    index: 4,
    setup: async (params) => {
        //pass over to rarity image
        await RarityImage.setup(params);
    },
    deployArgs: ['%token_name%', 'values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'minter'],
};

export default RaitySVG;
