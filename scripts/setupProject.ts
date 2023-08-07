import { InfinityMintScript } from '../app/interfaces';

const setupProject: InfinityMintScript = {
    name: 'Setup/Relaunch Project',
    description:
        'Will resetup your project, calling clean up methods on all the deployments contained in the project and then reinitializing them on the block chain',
    execute: async () => {},
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
    ],
};
export default setupProject;
