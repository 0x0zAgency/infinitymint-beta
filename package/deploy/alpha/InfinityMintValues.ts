import { InfinityMintValuesDeployScript } from '@infinitymint-types/deployments';
import { waitForTx } from '../../app/web3';

const Values: InfinityMintValuesDeployScript = {
    setup: async (params) => {
        let { project, debugLog, deployment, log, deployments } = params;
        if (project.settings === undefined) {
            project.settings = {
                values: {},
            };
        }

        if (!project.settings.values) project.settings.values = {};

        let variables = {
            ...(project.settings?.values || {}),
        };

        //read all the deployments and get their default settings values
        for (let deployment of Object.values(deployments)) {
            if (deployment.getDeploymentScript().values === undefined) continue;
            let values = {};
            await Promise.all(
                Object.keys(deployment.getDeploymentScript().values).map(
                    async (key) => {
                        let value =
                            deployment.getDeploymentScript().values[key];

                        if (project.settings?.values[key] !== undefined)
                            value = project.settings?.values[key];

                        if (typeof value === 'function')
                            value = await value(params);

                        if (!value) return;

                        values[key] = value;
                    }
                )
            );

            Object.keys(values).forEach((key) => {
                if (variables[key] === undefined) variables[key] = values[key];
            });
        }

        let cleanedVariables = {};
        Object.keys(variables).forEach((key, index) => {
            let value = variables[key];
            if (
                (typeof value === 'boolean' || typeof value === 'number') &&
                cleanedVariables[key] === undefined
            ) {
                if (typeof value === 'number')
                    cleanedVariables[key] = value.toString();
                else cleanedVariables[key] = value;
            }
        });
        project.settings.values = cleanedVariables;

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
            (key) => typeof cleanedVariables[key] === 'string'
        );

        let valuesContract = await deployment.write();

        await waitForTx(
            await valuesContract.setupValues(
                Object.values(numbers),
                Object.values(numbers).map((key) => cleanedVariables[key]),
                Object.values(booleans),
                Object.values(booleans).map((key) => cleanedVariables[key])
            ),
            'setting values on chain'
        );
    },
    /**
     * Add the on chain values to the deployment file
     * @param param0
     */
    post: async ({ project, deployments }) => {
        Object.values(deployments).forEach((deployment) => {
            if (deployment.getDeploymentScript().values === undefined) return;
            let values = {};

            Object.keys(deployment.getDeploymentScript().values).forEach(
                (key) => {
                    let value = deployment.getDeploymentScript().values[key];
                    if (project.settings?.values[key] !== undefined)
                        value = project.settings?.values[key];

                    values[key] = value;
                }
            );

            deployment.setDefaultValues(values, true);
        });
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
