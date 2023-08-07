import { InfinityMintUtilDeployScript } from '@infinitymint-types/deployments';

const InfinityMintUtil: InfinityMintUtilDeployScript = {
    //going to give
    module: 'utils',
    index: 1, //should be after values
    solidityFolder: 'alpha',
    library: true,
};
export default InfinityMintUtil;
