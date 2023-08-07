import { DefaultRoyaltyDeployScript } from '@infinitymint-types/deployments';
import { startingPrice } from './SplitRoyalty';

const DefaultRoyalty: DefaultRoyaltyDeployScript = {
    //going to give
    unique: true,
    module: 'royalty',
    index: 5,
    deployArgs: ['values'],
    solidityFolder: 'alpha',
    requestPermissions: ['erc721'],
    permissions: ['all', 'erc721', 'assets'],
    values: {
        startingPrice,
        baseTokenValue: 10 ** 18,
        stickerSplit: 20, //out of 100 percent
    },
};

export default DefaultRoyalty;
