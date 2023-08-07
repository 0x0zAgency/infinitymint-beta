import { InfinityMintDeploymentScript } from '../../app/interfaces';

const UnsafeRandom: InfinityMintDeploymentScript = {
    //going to give
    unique: true,
    module: 'random',
    index: 4,
    deployArgs: [50, 'values'],
    solidityFolder: 'alpha',
};

export default UnsafeRandom;
