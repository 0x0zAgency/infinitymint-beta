import { InfinityMintScript } from '../app/interfaces';

const restoreProject: InfinityMintScript = {
    name: 'Restore Project',
    description:
        'Takes a source project file. Will attempt to fetch the project from a contract location, then unpack its deployments to your deployments folder',
    execute: async (script) => {},
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
    ],
};
export default restoreProject;
