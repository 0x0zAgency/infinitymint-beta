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
    name: 'SetNetwork',
    description: 'Sets the current working network',
    execute: async (script: InfinityMintScriptParameters) => {
        let session = readGlobalSession();
        let config = getConfigFile();

        if (config.hardhat.networks[script.args.network.value] === undefined)
            throw new Error(
                `bad network: ${script.args.network.value} is not a network defined in infinitymint.config`
            );

        session.environment.defaultNetwork = script.args.network.value;
        saveGlobalSessionFile(session);
        script.log('\nCurrent network set to => ' + script.args.network.value);
    },
    arguments: [
        {
            name: 'network',
            type: 'string',
            optional: false,
        },
    ],
};
export default setNetwork;
