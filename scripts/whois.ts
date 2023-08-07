import { getProjectSource } from '../app/projects';
import fs from 'fs';
import { cwd, getPackageJson } from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';

const whois: InfinityMintScript = {
    name: 'WHOIS',
    description:
        'Attempts to pull information from an address about an InfinityMint',
    execute: async (script: InfinityMintScriptParameters) => {},
    arguments: [],
};

export default whois;
