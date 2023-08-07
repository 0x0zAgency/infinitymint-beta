import { getProjectSource } from '../app/projects';
import {
    getConfigFile,
    readGlobalSession,
    saveGlobalSessionFile,
} from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';

const setNetwork: InfinityMintScript = {
    name: 'Network',
    description: 'Displays the current working network',
    execute: async (script: InfinityMintScriptParameters) => {
        let session = readGlobalSession();
        script.log(session.environment.defaultNetwork);
    },
    arguments: [],
};
export default setNetwork;
