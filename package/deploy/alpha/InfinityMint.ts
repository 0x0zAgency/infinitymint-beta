import { InfinityMintDeployScript } from '@infinitymint-types/deployments';

const InfinityMint: InfinityMintDeployScript = {
    //going to give
    module: 'erc721',
    index: 8, //should be after values
    settings: {
        //these are settings the end user can set in their project and
        //will come up in an autocomplete suggestion
        erc721: {
            generateTokenURI: false,
            pregenerateTokens: 100,
        },
    },
    values: {
        previewCount: 3,
        previewCooldownSeconds: 60 * 60 * 5, //5 mins default
        incrementalMode: false,
        matchedMode: false,
        disableMintArguments: false,
        byteMint: false,
        disableRegisteredTokens: false,
        maxSupply: 124,
        maxTokensPerWallet: 256,
    },
    config: {
        test: 'test',
    },
    deployArgs: [
        '%token_name%',
        '%token_symbol%',
        'storage',
        'values',
        'minter',
        'royalty',
    ],
    requestPermissions: ['storage', 'royalty'],
    solidityFolder: 'alpha',
    permissions: ['all'],
};
export default InfinityMint;
