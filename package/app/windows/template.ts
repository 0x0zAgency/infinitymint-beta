import { InfinityMintWindow } from '../window';

const Templates = new InfinityMintWindow(
    'Templates',
    {
        fg: 'white',
        bg: 'grey',
        border: {
            fg: '#f0f0f0',
        },
    },
    {
        type: 'line',
    }
);

Templates.initialize = async (window, frame, blessed) => {};
export default Templates;
