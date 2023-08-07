import { createDeploymentsTypes, createScriptTypes } from '../app/types';
import { InfinityMintScript } from '../app/interfaces';
import fs from 'fs';
import path from 'path';
import {
    cwd,
    getInfinityMintVersion,
    isTypescript,
    makeDirectories,
} from '../app/helpers';
const generateTypeExtensions: InfinityMintScript = {
    name: 'Generate Type Extensions',
    description: 'Generates type extensions for the current InfinityMint',
    execute: async (script) => {
        if (!isTypescript())
            throw new Error(
                'You must be using typescript to generate type extensions'
            );

        script.log(
            '\n{magenta-fg}{bold}Generating type extensions for InfinityMint{/} => ' +
                getInfinityMintVersion()
        );

        makeDirectories(cwd() + '/infinitymint-types/');

        script.log('\nCreating script types...');

        let scriptTypes = createScriptTypes(
            script.infinityConsole.getScripts()
        );

        script.log('Creating deployment types...');

        fs.writeFileSync(
            path.join(cwd(), '/infinitymint-types/scripts.ts'),
            scriptTypes
        );

        let deploymentTypes = await createDeploymentsTypes();

        fs.writeFileSync(
            path.join(cwd(), '/infinitymint-types/deployments.ts'),
            deploymentTypes
        );

        script.log('Creating index...');

        //make index
        let index = `//this file is auto-generated by the InfinityMint CLI
//do not modify this file directly

export * from './scripts';
export * from './deployments';
`;

        fs.writeFileSync(
            path.join(cwd(), '/infinitymint-types/index.ts'),
            index
        );

        script.log('\n{green-fg}{bold}Done!{/}');
        script.log(
            '{gray-fg}If you ran this inside of the console you might need to restart the console for changes to be noticable!{/}\n'
        );
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
    ],
};
export default generateTypeExtensions;