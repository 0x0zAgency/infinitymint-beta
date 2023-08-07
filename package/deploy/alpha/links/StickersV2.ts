import { StickersV2DeployScript } from '@infinitymint-types/deployments';

const StickersV2: StickersV2DeployScript = {
    //going to give
    index: 1, //will be the second link
    solidityFolder: 'alpha',
    important: false, //will mean this is not added by default
    /**
     * Means this deployment will be treat like an InfinityLink, see docs for more info.
     */
    link: {
        description: 'Sticers V2 Test',
        args: [
            'oracleDestination',
            'erc721',
            'tokenId',
            'tokenName',
            'tokenSymbol',
        ],
        key: 'eads_endpoint',
        erc721: true,
        verify: true,
    },
};
export default StickersV2;
