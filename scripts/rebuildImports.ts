import { InfinityMintScript } from '../app/interfaces';

const refreshImports: InfinityMintScript = {
    name: 'Rebuild Imports',
    description:
        'Rebuilds your import cache which contains references to all the files you are using through out InfinityMint',
    execute: async (script) => {
        await script.infinityConsole.buildImports(true);
    },
    arguments: [],
};
export default refreshImports;
