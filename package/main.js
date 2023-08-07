#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const process = require('process');

//requires ts-node if it is installed
if (fs.existsSync(path.join(process.cwd(), '/node_modules/ts-node/')))
    require('ts-node').register();

//dot env if it is installed
if (fs.existsSync(path.join(process.cwd(), '/node_modules/dot-env/')))
    require('dotenv').config({
        override: false, //will not override already established environment variables
    });

//checks if console key is present, if it is then run the console not the cli
let varArgs = process.argv.filter((arg, index) =>
    arg.indexOf('--') !== -1 ? process.argv.slice(index, 1) : false
);

//
const isInfinityMint = () => {
    let packageJson = fs.readFileSync(
        path.join(process.cwd(), 'package.json'),
        'utf8'
    );
    packageJson = JSON.parse(packageJson);
    if (packageJson.name === 'infinitymint') return true;
    else return false;
};

const hasInfinityMintConfig = (
    extensions = ['ts', 'js', 'mjs', 'cjs', 'json']
) => {
    let hasConfig = false;

    extensions.forEach((extension) => {
        if (fs.existsSync(process.cwd() + `/infinitymint.config.${extension}`))
            hasConfig = true;
    });

    return hasConfig;
};

const hasHardhatConfig = (extensions = ['ts', 'js', 'mjs', 'cjs']) => {
    let hasConfig = false;
    extensions.forEach((extension) => {
        if (fs.existsSync(process.cwd() + `/hardhat.config.${extension}`))
            hasConfig = true;
    });

    return hasConfig;
};

if (
    isInfinityMint() &&
    (varArgs.length < 0 ||
        varArgs.filter((arg) => arg === '--force-npm').length === 0)
) {
    if (
        varArgs.length > 0 &&
        varArgs.filter((arg) => arg === '--compileContracts').length !== 0
    ) {
        require(process.cwd() + '/dev/compile.ts');
        return;
    }

    if (
        (varArgs.length > 0 &&
            varArgs.filter((arg) => arg === '--createConfig').length !== 0) ||
        !hasInfinityMintConfig() ||
        !hasHardhatConfig()
    ) {
        require(process.cwd() + '/dev/config.ts');
        return;
    }

    let { readGlobalSession, saveGlobalSessionFile } = require(process.cwd() +
        '/app/helpers.ts');
    let { createDefaultFactory } = require(process.cwd() + '/app/pipes.ts');
    createDefaultFactory();

    let session = readGlobalSession();
    session.environment.javascript = false;
    saveGlobalSessionFile(session);

    if (
        varArgs.length > 0 &&
        varArgs.filter((arg) => arg === '--console').length !== 0
    )
        require(process.cwd() + '/core.ts');
    else require(process.cwd() + '/app/cli.ts');
} else {
    try {
        if (
            varArgs.length > 0 &&
            varArgs.filter((arg) => arg === '--compileContracts').length !== 0
        ) {
            require(process.cwd() +
                '/node_modules/infinitymint/dist/dev/compile');
            return;
        }

        if (
            (varArgs.length > 0 &&
                varArgs.filter((arg) => arg === '--createConfig').length !==
                    0) ||
            !hasInfinityMintConfig() ||
            !hasHardhatConfig()
        ) {
            require(process.cwd() +
                '/node_modules/infinitymint/dist/dev/config');
            return;
        }

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
