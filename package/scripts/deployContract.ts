import { getArgumentValues } from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';
import { deployAnonContract } from '../app/web3';
import fs from 'fs';

const deployContract: InfinityMintScript = {
    name: 'DeployContract',
    description:
        'Deploy a contract to the current network, the deployment will be saved in the __@any folder in the deployments folder (relative to your network)',
    execute: async (script: InfinityMintScriptParameters) => {
        let { contract } = getArgumentValues(script.args);

        script.log(
            '\n{underline}deploying {yellow-fg}{bold}' + contract + '{/}'
        );
        let deployment = await deployAnonContract(contract);

        script.log(
            '\n{green-fg}successfully deployed {cyan-fg}{bold}' +
                contract +
                '{/} => ' +
                deployment.address
        );
        script.log('cleaning up...');
        fs.unlinkSync(
            './deployments/' +
                script.infinityConsole.network.name +
                '/' +
                deployment.contractName +
                '.json'
        );
    },
    arguments: [
        {
            name: 'contractName',
            type: 'string',
            optional: false,
        },
    ],
};

export default deployContract;
