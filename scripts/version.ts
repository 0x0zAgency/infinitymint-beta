import { getProjectSource } from '../app/projects';
import fs from 'fs';
import {
    cwd,
    findLocalPackageJson,
    getConfigFile,
    readGlobalSession,
    saveGlobalSessionFile,
} from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';

const version: InfinityMintScript = {
    name: 'Version',
    description: 'Displays the current infinitymint version',
    execute: async (script: InfinityMintScriptParameters) => {
        let packageJson = findLocalPackageJson();

        if (packageJson.name === 'infinitymint')
            script.log(packageJson.version);
        else if (
            fs.existsSync(cwd() + '/node_modules/infinitymint/package.json')
        )
            script.log(
                JSON.parse(
                    fs.readFileSync(
                        cwd() + '/node_modules/infinitymint/package.json',
                        {
                            encoding: 'utf-8',
                        }
                    )
                ).version
            );
    },
    arguments: [],
};
export default version;
