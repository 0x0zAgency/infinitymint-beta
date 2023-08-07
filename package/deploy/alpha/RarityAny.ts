import { RarityAny } from '@typechain-types/index';
import { RarityAnyDeployScript } from '@infinitymint-types/deployments';
import RarityImage from './RarityImage';

const RarityAny: RarityAnyDeployScript = {
    //only means one of these modules can be deployed
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
        await RarityImage.setup(params);
    },
    deployArgs: ['%token_name%', 'values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'minter'],
};

export default RarityAny;
