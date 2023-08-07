import { getProjectSource } from '../app/projects';
import fs from 'fs';
import { cwd, getPackageJson } from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';

const convertProject: InfinityMintScript = {
    name: 'Convert Project',
    description: 'Converts a deployed project to a source file',
    execute: async (script: InfinityMintScriptParameters) => {},
    arguments: [],
};
export default convertProject;
