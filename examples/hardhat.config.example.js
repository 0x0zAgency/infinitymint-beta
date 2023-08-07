require('module-alias/register');

const {
    loadInfinityMint,
    prepareConfig,
    saveGlobalSessionFile,
    readGlobalSession,
    hasNodeModule,
    directlyLog,
    overwriteConsoleMethods,
} = require('infinitymint/dist/app/helpers');
//create the default pipe
const { createDefaultFactory } = require('infinitymint/dist/app/pipes');

//set as javascript session
let session = readGlobalSession();
session.environment.javascript = true;
saveGlobalSessionFile(session);

//Create Default Factory
createDefaultFactory();
//ovewrite console methods
overwriteConsoleMethods();
//Directly output logs until we have a chance to set the log level
setDirectlyOutputLogs(true);

//require dotenv if it exists
if (hasNodeModule('dotenv')) {
    directlyLog('🧱 Loading .env file');
    require('dotenv').config({
        override: false, //will not override already established environment variables
    });
}

//import our hardhat plugins
require('@nomicfoundation/hardhat-toolbox');
require('@nomiclabs/hardhat-ethers');
require('hardhat-change-network'); //allows hre.changeNetwork to occur

//load infinitymint
loadInfinityMint(true);

//return the infinitymint config file
let config = prepareConfig();
directlyLog('🧱 Loaded hardhat.config.js');
module.exports = config.hardhat; //export the infinity mint configuration file
