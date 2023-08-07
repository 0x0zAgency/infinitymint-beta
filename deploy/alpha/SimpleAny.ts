import { InfinityMintDeploymentScript } from '../../app/interfaces';
import SimpleImage from './SimpleImage';
const SimpleAny: InfinityMintDeploymentScript = {
    //going to give
    unique: true,
    module: 'assets',
    index: 4,
    setup: async (params) => {
        await SimpleImage.setup(params);

        //do SVG stuff
    },
    deployArgs: ['%token_name%', 'values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'minter'],
};

export default SimpleAny;
