import { EADStickersDeployScript } from '@infinitymint-types/deployments';

const EADStickers: EADStickersDeployScript = {
    index: 1, //will be the second link
    solidityFolder: 'alpha',
    important: true, //will add this to every project that is deployed
    /**
     * Means this deployment will be treat like an InfinityLink, see docs for more info.
     */
    link: {
        description: 'Enables prototype ethereum ad service integration',
        args: ['tokenId', 'erc721'],
        key: 'stickers',
        erc721: true,
        verify: true,
    },
};
export default EADStickers;
