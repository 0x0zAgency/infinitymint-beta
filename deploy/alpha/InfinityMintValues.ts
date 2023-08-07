import { InfinityMintDeploymentScript } from '../../app/interfaces';
import { logTransaction } from '../../app/web3';
import { InfinityMintValues } from '../../typechain-types';

const DefaultValues = {
    maxSupply: 10,
    randomessFactor: 100,
    maxRandomNumber: 0xffffff,
    previewCount: 0,
    nameCount: 1,
    linkWalletIndex: 0,
    linkStickersIndex: 1,
};

const Values: InfinityMintDeploymentScript = {
    setup: async ({ project, debugLog, deployment, log }) => {
        if (project.settings === undefined) {
            project.settings = {};
        }

        let variables = {
            ...DefaultValues,
            ...(project.settings?.values || {}),
        };

        let cleanedVariables = {};
        Object.keys(variables).forEach((key, index) => {
            let value = variables[key];
            if (
                (typeof value === 'boolean' || typeof value === 'number') &&
                cleanedVariables[key] === undefined &&
                key !== 'baseTokenValue'
            ) {
                cleanedVariables[key] = value;
            }
        });

        debugLog(
            'found ' +
                Object.values(cleanedVariables).length +
                ' values to set on chain'
        );

        log('{cyan-fg}{bold}Onchain Variables{/}');
        Object.keys(cleanedVariables).forEach((key) =>
            log(`\t[${key}] => ${cleanedVariables[key]}`)
        );

        let booleans = Object.keys(cleanedVariables).filter(
            (key) => typeof cleanedVariables[key] === 'boolean'
        );

        let numbers = Object.keys(cleanedVariables).filter(
            (key) => typeof cleanedVariables[key] === 'number'
        );
        let contract =
            (await deployment.getSignedContract()) as InfinityMintValues;

        await logTransaction(
            await contract.setupValues(
                Object.values(numbers),
                Object.values(numbers).map((key) => cleanedVariables[key]),
                Object.values(booleans),
                Object.values(booleans).map((key) => cleanedVariables[key])
            ),
            'setting values on chain'
        );
    },
    static: true,
    //going to give
    instantlySetup: true, //will run the set up for this contract instantly and not after everything else has deployed
    unique: true,
    important: true,
    module: 'values',
    permissions: ['all'],
    index: 1, //nothing should be before values
    solidityFolder: 'alpha',
};
export default Values;
