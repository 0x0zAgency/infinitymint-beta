import { SplitRoyalty } from '@typechain-types/index';
import { SplitRoyaltyDeployScript } from '@infinitymint-types/deployments';
import { InfinityMintDeploymentParameters } from '../../app/interfaces';

/**
 * Also imported by DefaultRoyalty, sets the price of the token
 * @param param0
 * @returns
 */
export const startingPrice = async ({
    project,
}: InfinityMintDeploymentParameters) => {
    let price = project.price;

    if (typeof price === 'string') {
        //if its just a number then use that
        price = parseInt(price);

        if (isNaN(price)) {
            //then lets assume its a currency value and convert it
        }
    }

    if (price === undefined) {
        price = project.settings?.royalty?.startingPrice;
    }

    if (price === undefined) {
        price = 0;
    }

    return parseInt(price.toString());
};

const SplitRoyalty: SplitRoyaltyDeployScript = {
    //going to give
    unique: true,
    module: 'royalty',
    index: 5,
    deployArgs: ['values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'assets', 'minter', 'all'],
    values: {
        startingPrice,
        baseTokenValue: 10 ** 18,
        stickerSplit: 20, //out of 100 percent
    },
    setup: async (params) => {
        //read royalty info and set up royalty
        let royalty = await params.deployment.getSignedContract<SplitRoyalty>();
    },
};

export default SplitRoyalty;
