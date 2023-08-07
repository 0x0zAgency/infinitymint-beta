import { InfinityMintWindow } from '../window';

const IPFS = new InfinityMintWindow(
    'IPFS',
    {
        fg: 'white',
        bg: 'yellow',
        border: {
            fg: '#f0f0f0',
        },
    },
    {
        type: 'line',
    }
);

IPFS.setBackgroundThink(true);
IPFS.setShouldInstantiate(true);
export default IPFS;
