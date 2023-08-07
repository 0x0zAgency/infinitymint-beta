import { SelectiveMinterDeployScript } from '@infinitymint-types/deployments';

const SelectiveMinter: SelectiveMinterDeployScript = {
    //going to give
    module: 'minter',
    index: 7, //should be after values
    solidityFolder: 'alpha',
    deployArgs: ['values', 'storage', 'assets', 'random'],
    permissions: ['erc721', 'assets'],
};
export default SelectiveMinter;
