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
import { InfinityMintDeploymentLive_Facade } from '@infinitymint-types/deployments';

const setNetwork: InfinityMintScript = {
    name: 'Project',
    description: 'Displays the current working project',
    execute: async (script: InfinityMintScriptParameters) => {
        let session = readGlobalSession();
        script.log(session.environment.defaultProject);
    },
    arguments: [],
};
export default setNetwork;
