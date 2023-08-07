import hre from 'hardhat';
let loadHre = hre.artifacts; // load hardhat runtime environment
import dotEnv from 'dotenv';
dotEnv.config({
    override: false, //will not override already established environment variables
});
import { isEnvTrue } from './app/helpers';

if (!isEnvTrue('PRODUCTION')) require('./app/cli');
else require('./dist/app/cli');
