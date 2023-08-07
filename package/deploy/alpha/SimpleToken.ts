import { SimpleTokenDeployScript } from '@infinitymint-types/deployments';
import SimpleImage from './SimpleImage';

const SimpleToken: SimpleTokenDeployScript = {
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
    update: SimpleImage.update,
    cleanup: SimpleImage.cleanup,
    setup: async (params) => {
        await SimpleImage.setup(params);
    },
    deployArgs: ['%token_name%', 'values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'minter'],
};

export default SimpleToken;
