import hre from 'hardhat';
import dotEnv from 'dotenv';
import 'infinitymint/dist/app/cli';
let loadHre = hre.artifacts; // load hardhat runtime environment

dotEnv.config({
    override: false, //will not override already established environment variables
});
