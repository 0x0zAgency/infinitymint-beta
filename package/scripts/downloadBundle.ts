import { getProjectSource } from '../app/projects';
import fs from 'fs';
import { cwd, getPackageJson } from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';

const downloadBundle: InfinityMintScript = {
    name: 'Download Bundle',
    description:
        'Downloads a project bundle and attempts to extract it to the current directory',
    execute: async (script: InfinityMintScriptParameters) => {},
    arguments: [],
};

export default downloadBundle;
