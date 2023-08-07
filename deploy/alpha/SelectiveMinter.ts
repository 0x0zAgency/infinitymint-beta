import { InfinityMintDeploymentScript } from '../../app/interfaces';

const SelectiveMinter: InfinityMintDeploymentScript = {
    //going to give
    module: 'minter',
    index: 7, //should be after values
    solidityFolder: 'alpha',
    deployArgs: ['values', 'storage', 'assets', 'random'],
    permissions: ['erc721', 'assets'],
};
export default SelectiveMinter;
