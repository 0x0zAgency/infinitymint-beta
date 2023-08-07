import { waitForTx } from '../app/web3';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';
import { ContractTransaction } from 'ethers';
import { Receipt } from 'hardhat-deploy/dist/types';
import { warning } from '../app/helpers';

const call: InfinityMintScript = {
    name: 'Call Contract Method',
    description: 'Calls a method on a contract',
    execute: async (script: InfinityMintScriptParameters) => {
        let contractName =
            script.args.contract?.value || script.args.module?.value;

        if (
            script.args.contract &&
            script.args.contract?.value?.length === 0 &&
            script.args.module.value
        )
            contractName = script.args.module?.value;

        if (
            script.args.module &&
            script.args.module.value?.length === 0 &&
            script.args.script.value
        )
            contractName = script.args.cotract?.value;

        if (!contractName) contractName = 'erc721';

        let contract = script.project.deployments[contractName];

        if (!contract) throw new Error('contract not found => ' + contractName);

        let instance = await contract.getSignedContract();

        if (!instance[script.args.method?.value])
            throw new Error('invalid method => ' + script.args.method?.value);

        let bannedArgs = [
            'project',
            'contract',
            'method',
            'version',
            'network',
            'module',
        ];
        let cleanedArguments = [];

        Object.values(script.args).forEach((arg) =>
            !bannedArgs.includes(arg.name) &&
            arg.name !== '_' &&
            arg.name !== '$0'
                ? cleanedArguments.push(arg.value)
                : null
        );

        script.log(
            `\n{magenta-fg}{bold}Executing ${
                script.args.method.value
            } on {underline}${contract.getContractName()}{/underline} at <${contract.getAddress()}> with args{/} =>`
        );
        cleanedArguments.forEach((arg, index) =>
            script.log([`[${index}] => ${arg}`])
        );

        let tx: ContractTransaction | Promise<ContractTransaction> | Receipt;
        if (cleanedArguments.length === 0)
            tx = await instance[script.args.method.value]();

        if (cleanedArguments.length === 1)
            tx = await instance[script.args.method.value](cleanedArguments[0]);

        if (cleanedArguments.length === 2)
            tx = await instance[script.args.method.value](
                cleanedArguments[0],
                cleanedArguments[1]
            );

        if (cleanedArguments.length === 3)
            tx = await instance[script.args.method.value](
                cleanedArguments[0],
                cleanedArguments[1],
                cleanedArguments[2]
            );

        if (cleanedArguments.length === 4)
            tx = await instance[script.args.method.value](
                cleanedArguments[0],
                cleanedArguments[1],
                cleanedArguments[2],
                cleanedArguments[3]
            );

        if (cleanedArguments.length === 5)
            tx = await instance[script.args.method.value](
                cleanedArguments[0],
                cleanedArguments[1],
                cleanedArguments[2],
                cleanedArguments[3],
                cleanedArguments[4]
            );

        if (cleanedArguments.length === 6)
            tx = await instance[script.args.method.value](
                cleanedArguments[0],
                cleanedArguments[1],
                cleanedArguments[2],
                cleanedArguments[3],
                cleanedArguments[4],
                cleanedArguments[5]
            );

        if (cleanedArguments.length === 7)
            tx = await instance[script.args.method.value](
                cleanedArguments[0],
                cleanedArguments[1],
                cleanedArguments[2],
                cleanedArguments[3],
                cleanedArguments[4],
                cleanedArguments[5],
                cleanedArguments[6]
            );

        if (cleanedArguments.length === 8)
            tx = await instance[script.args.method.value](
                cleanedArguments[0],
                cleanedArguments[1],
                cleanedArguments[2],
                cleanedArguments[3],
                cleanedArguments[4],
                cleanedArguments[5],
                cleanedArguments[6],
                cleanedArguments[7]
            );

        try {
            tx = await waitForTx(
                tx,
                'call to ' +
                    contract.getContractName() +
                    ' method ' +
                    script.args.method.value
            );
            script.log(
                `\n{green-fg}{bold}Successfully Called ${
                    script.args.method.value
                } on ${contract.getContractName()}{/} => <${
                    tx.transactionHash
                }>\n{yellow-fg}gas used: ${tx.gasUsed.toString()}{/}\n`
            );
        } catch (error) {
            warning(
                `waiting for TX failed, did this return something other than a receipt?`
            );

            script.log(
                `\n{yellow-fg}{bold}Potentially Called ${
                    script.args.method.value
                } on ${contract.getContractName()}{/}`
            );
        }
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
        {
            name: 'contract',
            type: 'string',
            optional: true,
        },
        {
            name: 'method',
            type: 'string',
            optional: true,
        },
        {
            name: 'module',
            type: 'string',
            optional: true,
        },
    ],
};

export default call;
