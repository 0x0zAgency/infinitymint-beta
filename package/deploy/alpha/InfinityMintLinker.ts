import { InfinityMintLinkerDeployScript } from '@infinitymint-types/deployments';
import { InfinityMintCompiledLink } from '../../app/interfaces';
import { waitForTx } from '../../app/web3';
import { Dictionary } from '../../app/helpers';
import { ethers } from 'hardhat';

const InfinityMintLinker: InfinityMintLinkerDeployScript = {
    //going to give
    module: 'linker',
    index: 10, //should be after api
    deployArgs: ['storage', 'erc721'],
    solidityFolder: 'alpha',
    requestPermissions: ['storage', 'erc721'],
    update: async (params) => {
        await params.deployScript.cleanup(params);
        await params.deployScript.post(params);
        return params.deployment.write();
    },
    cleanup: async (params) => {
        if (params.deployment.hasDeployed()) {
            let contract = await params.deployment.write();
            await waitForTx(await contract.clearLinks(), 'clear links');
        }
    },
    post: async (params) => {
        let linkerContract = await params.deployment.write();
        let valuesContract = await params.deployments.values.write();
        let links = params.project
            .links as Dictionary<InfinityMintCompiledLink>;

        let linkKeys = Object.keys(links);

        //sort the link keys by index
        linkKeys.sort((a, b) => {
            return links[a].index - links[b].index;
        });

        let values = {};

        for (let i = 0; i < linkKeys.length; i++) {
            let link = links[linkKeys[i]];

            params.log('\n{magenta-fg}Adding InfinityLink{/} => ' + link.key);
            params.log(
                `\terc721 => ${link.erc721 === true ? 'true' : 'false'}`
            );
            params.log(
                `\tverified => ${link.verify === true ? 'true' : 'false'}`
            );
            params.log(
                `\tforced only => ${
                    link.forcedOnly === true ? 'true' : 'false'
                }`
            );
            params.log(`\tinterface id => ${link.interfaceId || '0x00000000'}`);

            await waitForTx(
                await linkerContract.addSupport(
                    i,
                    link.key,
                    ethers.utils.toUtf8Bytes(link.key),
                    link.erc721 === true,
                    link.verify === true,
                    link.forcedOnly === true,
                    false
                ),
                `add support for ${link.key}`
            );

            values[link.key] = i;
        }

        params.log('\n{cyan-fg}Setting Link Indexes in Values...{/}\n');

        Object.keys(values).forEach((key, index) =>
            params.log(
                `[${index}] ` +
                    'link' +
                    key.charAt(0).toUpperCase() +
                    key.slice(1) +
                    'Index => ' +
                    values[key]
            )
        );

        await waitForTx(
            await valuesContract.setValues(
                Object.keys(values).map(
                    (key) =>
                        'link' +
                        key.charAt(0).toUpperCase() +
                        key.slice(1) +
                        'Index'
                ),
                Object.values(values).map((value) => value.toString())
            ),
            'set link values'
        );

        params.deployment.setDefaultValues(values, true);
    },
};
export default InfinityMintLinker;
