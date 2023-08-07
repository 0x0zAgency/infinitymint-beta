import { InfinityMintScript } from '../app/interfaces';

const updateProject: InfinityMintScript = {
    name: 'Update',
    description:
        'Updates a project by reading any changes which have occured and then setting them on chain',
    execute: async () => {},
    arguments: [
        {
            name: 'project',
            optional: true,
        },
    ],
};
export default updateProject;
