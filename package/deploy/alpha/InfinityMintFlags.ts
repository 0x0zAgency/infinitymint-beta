import { InfinityMintFlagsDeployScript } from '@infinitymint-types/deployments';

const InfinitMintFlags: InfinityMintFlagsDeployScript = {
    //going to give
    module: 'flags',
    index: 10, //should be after linker
    deployArgs: ['storage', 'erc721'],
    solidityFolder: 'alpha',
    requestPermissions: ['storage'],
};
export default InfinitMintFlags;
