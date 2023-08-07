import { InfinityMintDeploymentScript } from '../../app/interfaces';

const InfinityMintStorage: InfinityMintDeploymentScript = {
    //going to give
    module: 'storage',
    index: 3, //should be after values
    solidityFolder: 'alpha',
    permissions: ['erc721', 'api', 'assets', 'minter'],
};
export default InfinityMintStorage;
