import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';
import { getArgumentValues } from '../app/helpers';
import { InfinityMintObject } from '@typechain-types/InfinityMintStorage';
import { Token } from '../app/token';

const version: InfinityMintScript = {
    name: 'Mint',
    description: 'Mints a new InfinityMint NFT',
    config: {
        mint: {
            mintChunkSize: 8,
        },
    },
    execute: async (script: InfinityMintScriptParameters) => {
        if (!script.project)
            throw new Error(
                'Please specify a project using the --project flag'
            );

        let count = script.args.count?.value ?? 1;
        let erc721 = await script.project.erc721();

        let { useImplicitMint, gasLimit, showReceipt } = getArgumentValues(
            script.args
        );

        if (!(await erc721.mintsEnabled()) && !useImplicitMint)
            throw new Error('Minting is not enabled for this project');

        if (count <= 1 && !useImplicitMint) {
            let result = await script.project.mint(null, gasLimit);

            if (showReceipt)
                script.log(
                    `{bold}Transaction Receipt{/}\n${JSON.stringify(
                        result,
                        null,
                        4
                    )}`
                );

            script.log(''); //newline
            script.log(`name => ${result.name}`);
            script.log(`project => ${result.project.getNameAndVersion()}`);
            script.log(`network => ${result.project.network}`);
            script.log(`token id => ${result.tokenId}`);
            script.log(
                `rarity => ${
                    result.getPath().rarity ||
                    (result.project.deployedProject.paths.length / 100) * 100
                }%`
            );
            script.log(
                `path id => ${result.pathId} (${result.getPath().name})`
            );
            script.log(`assets => (${result.getAssets().length})`);

            result.getAssets().forEach((asset, index) => {
                script.log(
                    `\t[${index}] => {grey-fg}${asset.name} (${asset.rarity}% rare) <${asset.fileName}> (${script.project.deployedProject?.meta?.assets?.sections[index]}){/}`
                );
            });
            script.log(''); //newline

            return; //end implicit mint
        } else if (count <= 1) count = 1;

        let currentTokenId = await erc721.currentTokenId();
        let tokens = [];

        for (let i = 0; i < count; i++) {
            tokens.push(script.project.createRandomToken().output);
        }

        let chunks: InfinityMintObject.InfinityObjectStructOutput[][] = [];
        let chunkSize = 8;

        for (let i = 0; i < tokens.length; i += chunkSize) {
            chunks.push(tokens.slice(i, i + chunkSize));
        }

        for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];

            script.log(
                `Minting ${chunk.length} tokens (${i + 1}/${chunks.length})`
            );

            let receipt = await script.project.mintMultiple(chunk);

            if (showReceipt)
                script.log(
                    `{bold}Transaction Receipt{/}\n${JSON.stringify(
                        receipt,
                        null,
                        4
                    )}`
                );

            chunk.forEach((token) => {
                token.currentTokenId = currentTokenId++;

                let result = new Token(
                    script.project,
                    token.currentTokenId,
                    token as any
                );

                script.log(''); //newline
                script.log(`name => ${result.name}`);
                script.log(`project => ${result.project.getNameAndVersion()}`);
                script.log(`network => ${result.project.network}`);
                script.log(`token id => ${result.tokenId}`);
                script.log(`rarity => ${result.rarity}%`);
                script.log(
                    `path id => ${result.pathId} (${result.getPath().name})`
                );
                script.log(`assets => (${result.getAssets().length})`);

                result.getAssets().forEach((asset, index) => {
                    script.log(
                        `\t[${index}] => {grey-fg}${asset.name} ${
                            asset.rarity ? `(${asset.rarity}% common)` : ''
                        } <${asset.fileName}> [${
                            script.project.deployedProject?.meta?.assets
                                ?.sections[index]
                        }]{/}`
                    );
                });
                script.log(''); //newline
            });
        }

        script.log(`\n{green-fg}{bold}Mint Successful{/}\n`);
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
        {
            name: 'useImplicitMint',
            type: 'boolean',
            optional: true,
            value: false,
        },
        {
            name: 'gasLimit',
            type: 'number',
            optional: true,
        },
        {
            name: 'count',
            type: 'number',
            optional: true,
            value: 1,
        },
        {
            name: 'to',
            type: 'string',
            optional: true,
        },
    ],
};
export default version;
