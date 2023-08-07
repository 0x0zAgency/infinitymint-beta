import { InfinityMintWindow } from '../window';

const Ganache = new InfinityMintWindow(
    'Ganache',
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

Ganache.setBackgroundThink(true);
Ganache.setShouldInstantiate(true);
export default Ganache;
