import { getProjectSource } from '../app/projects';
import fs from 'fs';
import { cwd, getPackageJson } from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';

const getToken: InfinityMintScript = {
    name: 'Get Token',
    description:
        'Pulls information about a token from the blockchain and displays it',
    execute: async (script: InfinityMintScriptParameters) => {
        let tokenId = script.args.tokenId.value;
        let result = await script.project.getToken(tokenId);

        script.log(''); //newline
        script.log(`name => ${result.name}`);
        script.log(`project => ${result.project.getNameAndVersion()}`);
        script.log(`network => ${result.project.network}`);
        script.log(`token id => ${result.tokenId}`);
        script.log(`rarity => ${result.getPath().rarity}%`);
        script.log(`path id => ${result.pathId} (${result.getPath().name})`);
        script.log(`assets => (${result.getAssets().length})`);

        result.getAssets().forEach((asset, index) => {
            script.log(
                `\t[${index}] => {grey-fg}${asset.name} <${asset.fileName}> (${script.project.deployedProject?.meta?.assets?.sections[index]}){/}`
            );
        });
        script.log(''); //newline
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
        {
            name: 'tokenId',
            type: 'number',
            optional: false,
        },
    ],
};

export default getToken;
