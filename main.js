#! /usr/bin/env node
//requires ts-node
require('ts-node').register();
//dot env
require('dotenv').config({
    override: false, //will not override already established environment variables
});
//checks if console key is present, if it is then run the console not the cli
let varArgs = process.argv.filter((arg, index) =>
    arg.indexOf('--') !== -1 ? process.argv.slice(index, 1) : false
);

const isInfinityMint = () => {
    let fs = require('fs');
    let path = require('path');
    let packageJson = fs.readFileSync(
        path.join(process.cwd(), 'package.json'),
        'utf8'
    );
    packageJson = JSON.parse(packageJson);
    if (packageJson.name === 'infinitymint') return true;
    else return false;
};

if (
    isInfinityMint() &&
    (varArgs.length < 0 ||
        varArgs.filter((arg) => arg === '--force-npm').length === 0)
) {
    let { readGlobalSession, saveGlobalSessionFile } = require(process.cwd() +
        '/dist/app/helpers');
    let { createDefaultFactory } = require(process.cwd() + '/dist/app/pipes');
    createDefaultFactory();
    let session = readGlobalSession();
    session.environment.javascript = true;
    saveGlobalSessionFile(session);

    if (
        varArgs.length > 0 &&
        varArgs.filter((arg) => arg === '--console').length !== 0
    )
        require(process.cwd() + '/dist/core.js');
    else require(process.cwd() + '/dist/app/cli.js');
} else {
    try {
        let {
            readGlobalSession,
            saveGlobalSessionFile,
        } = require(process.cwd() +
            '/node_modules/infinitymint/dist/app/helpers');
        let { createDefaultFactory } = require(process.cwd() +
            '/node_modules/infinitymint/dist/app/pipes');
        createDefaultFactory();
        let session = readGlobalSession();
        session.environment.javscript = true;
        saveGlobalSessionFile(session);
    } catch (error) {
        console.log('Could not set environment to javascript');
        console.log(error);
    }
    if (
        varArgs.length > 0 &&
        varArgs.filter((arg) => arg === '--console').length !== 0
    )
        require(process.cwd() + '/node_modules/infinitymint/dist/core.js');
    else require(process.cwd() + '/node_modules/infinitymint/dist/app/cli.js');
}
