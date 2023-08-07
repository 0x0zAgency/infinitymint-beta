import { InfinityMintApiDeployScript } from '@infinitymint-types/deployments';

const InfinityMintApi: InfinityMintApiDeployScript = {
    //going to give
    module: 'api',
    index: 10, //should be after values
    deployArgs: ['erc721', 'storage', 'assets', 'values', 'royalty', 'project'],
    solidityFolder: 'alpha',
    requestPermissions: ['erc721', 'storage', 'flags', 'linker'],
};
export default InfinityMintApi;
