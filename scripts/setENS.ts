import { InfinityMintScript } from '../app/interfaces';

const setENS: InfinityMintScript = {
    name: 'SetENS',
    description:
        'Set your ENS content records to point to your uploaded InfinityMint projects on IPFS',
    execute: async () => {},
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
    ],
};
export default setENS;
