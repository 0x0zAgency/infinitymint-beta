import { RaritySVGDeployScript } from '@infinitymint-types/deployments';
import RarityImage from './RarityImage';

const RaitySVG: RaritySVGDeployScript = {
    //going to give
    unique: true,
    module: 'assets',
    index: 4,
    values: {
        mustGenerateName: true,
        nameCount: 3,
        colourChunkSize: 32,
        extraColours: 32,
        randomRarity: true,
        lowestRarity: true,
        highestRarity: false,
        stopDuplicateMint: false,
    },
    update: RarityImage.update,
    cleanup: RarityImage.cleanup,
    setup: async (params) => {
        //pass over to rarity image
        await RarityImage.setup(params);
    },
    deployArgs: ['%token_name%', 'values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'minter'],
};

export default RaitySVG;
