import { InfinityMintScript } from '../app/interfaces';

const refreshImports: InfinityMintScript = {
    name: 'RefreshImports',
    description: 'Rebuilds your import cache',
    execute: async (script) => {
        await script.infinityConsole.loadImports(true);
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
    ],
};
export default refreshImports;
