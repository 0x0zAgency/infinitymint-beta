import { readReport } from '../app/gasAndPrices';
import { InfinityMintScript } from '../app/interfaces';
import { ethers } from 'hardhat';

const report: InfinityMintScript = {
    name: 'View Report',
    description: 'View a report of your project deployment',
    execute: async (script) => {
        let report = readReport(
            script.project.getNameAndVersion(false),
            script.project.version,
            script.infinityConsole.network.name
        );

        script.log(
            `\n{cyan-fg}{underline}Report for {bold}${script.project?.getFullyQualifiedName()}{/}\n`
        );
        script.log(
            `{bold}Network:{/} {yellow-fg}${script.infinityConsole.network.name}{/}\n`
        );

        if (!report) {
            script.log(
                '{red-fg}{bold}No report found, please deploy your project first{/}'
            );

            return;
        }

        script.log(
            `{underline}Receipts{/}\n\n{bold}${report.receipts.length}{/} receipts\n`
        );

        report.receipts.forEach((receipt, index) => {
            script.log(
                `{bold}[${index + 1}]{/} => \nTransaction Hash: {bold}<${
                    receipt.transactionHash
                }>{/}\nGas Used: {bold}${Number(
                    (receipt.gasUsed as any).hex
                )}{/}\nGas Price: {bold}${(
                    Number((receipt.effectiveGasPrice as any).hex) / 1000000000
                ).toFixed(2)} gwei{/}\n`
            );
        });

        script.log(`{underline}Cost & Gas Statistics{/}\n`);

        script.log(
            `Gas Usage: {bold}${report.gasUsage.toString()}{/}\nAvg Gas Price: {bold}${(
                report.averageGasPrice / 1000000000
            ).toFixed(2)} gwei{/}\nAvg Gas Per Tx: {bold}${(
                report.gasUsage / report.receipts.length
            ).toFixed(
                2
            )} wei{/}\nAvg Cost Per Tx (in eth/matic/token): {bold}${ethers.utils.formatEther(
                Math.floor(report.wei / report.receipts.length)
            )}{/}\nCost (in wei): {bold}${
                report.wei
            }{/}\nCost (in gwei): {bold}${(report.wei / 1000000000).toFixed(
                2
            )}{/}\nCost (in eth/matic/token): {bold}${report.cost}{/}\n`
        );

        script.log('{underline}{cyan-fg}End of Report{/}\n');
    },
    arguments: [
        {
            name: 'project',
            optional: true,
        },
        {
            name: 'network',
            optional: true,
        },
    ],
};
export default report;
