const hre = require('hardhat');
let loadHre = hre.artifacts; // load hardhat runtime environment
const dotEnv = require('dotenv');
dotEnv.config({
    override: false, //will not override already established environment variables
});
require('infinitymint/dist/app/cli');
