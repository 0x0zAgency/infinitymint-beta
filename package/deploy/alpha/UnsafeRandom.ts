import { UnsafeRandomDeployScript } from '@infinitymint-types/deployments';

const UnsafeRandom: UnsafeRandomDeployScript = {
    unique: true,
    module: 'random',
    index: 4,
    values: {
        seedNumber: 230,
        maxRandomNumber: 0xffffff,
    },
    deployArgs: ({ project }) => {
        return [project.settings.values.seedNumber.toString(), 'values'];
    },
    solidityFolder: 'alpha',
};

export default UnsafeRandom;
