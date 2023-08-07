import { InfinityMintSVGSettings } from '@app/content';

const settings: InfinityMintSVGSettings = {
    transform: {
        scale: 0.2,
    },
    style: {
        filter: {
            type: 'sepia',
            unique: true,
        },
        css: ['/imports/css/example.asset.css'],
        unique: true,
    },
};
export default settings;
