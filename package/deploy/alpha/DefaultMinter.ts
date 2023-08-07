import { DefaultMinterDeployScript } from '@infinitymint-types/deployments';

const DefaultMinter: DefaultMinterDeployScript = {
    //going to give
    unique: true,
    module: 'minter',
    index: 7,
    deployArgs: ['values', 'storage', 'assets', 'random'],
    solidityFolder: 'alpha',
    requestPermissions: ['erc721'],
    permissions: ['all', 'erc721', 'assets'],
};

export default DefaultMinter;
