import { InfinityMintSVGSettings } from '@app/content';

const settings: InfinityMintSVGSettings = {
    viewbox: '0 0 120 120',
    padding: '2%',
    outerPadding: '1%',
    style: {
        filter: {
            type: 'hue-rotate',
            unique: true,
        },
        css: [
            '/imports/css/example.red.css',
            '/imports/css/example.blue.css',
            '/imports/css/example.green.css',
        ],
        unique: true,
    },
    background: {
        image: '/imports/backgrounds/example-background.jpg',
    },
};
export default settings;
