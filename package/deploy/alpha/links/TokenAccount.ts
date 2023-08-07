import { TokenAccountDeployScript } from '@infinitymint-types/deployments';
import { InfinityMintDeploymentScript } from '../../../app/interfaces';

const TokenAccount: TokenAccountDeployScript = {
    index: 0, //will be the first link
    solidityFolder: 'alpha',
    important: true,
    /**
     * Means this deployment will be treat like an InfinityLink, see docs for more info.
     */
    link: {
        description:
            'A smart-contract wallet account capable of holding ERC-20 tokens and ERC-721 tokens',
        args: ['tokenId', 'erc721'],
        key: 'wallet',
        verify: true,
    },
};
export default TokenAccount;
