(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "hardhat", "chalk", "../app/helpers", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const hardhat_1 = tslib_1.__importDefault(require("hardhat"));
    const chalk_1 = tslib_1.__importDefault(require("chalk"));
    const helpers_1 = require("../app/helpers");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    (() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        console.log(chalk_1.default.yellow(`\n
   ____     ____      _ __       __  ____      __ 
  /  _/__  / _(_)__  (_) /___ __/  |/  (_)__  / /_
 _/ // _ \\/ _/ / _ \\/ / __/ // / /|_/ / / _ \\/ __/
/___/_//_/_//_/_//_/_/\\__/\\_, /_/  /_/_/_//_/\\__/ 
                         /___/`));
        console.log(chalk_1.default.cyanBright('\nCompile Script v1'));
        console.log(chalk_1.default.underline.gray('This script checks that all of InfinityMints contracts compile through solc correctly\n'));
        let config = (0, helpers_1.getConfigFile)();
        let solidityFolder = (0, helpers_1.getSolidityFolder)();
        console.log(chalk_1.default.magenta(`Using solidity folder: ${solidityFolder}`));
        //lets check that the config stuff is okay
        let sources = (0, helpers_1.cwd)() + '/contracts/';
        if ((_a = config.hardhat.paths) === null || _a === void 0 ? void 0 : _a.sources) {
            sources = config.hardhat.paths.sources;
            if (!sources.endsWith('/')) {
                sources = sources + '/';
            }
            if (!sources.startsWith((0, helpers_1.cwd)()))
                sources = (0, helpers_1.cwd)() + '/' + sources;
        }
        console.log(chalk_1.default.magenta(`Sources folder: ${sources}`));
        if (!fs_1.default.existsSync(sources)) {
            console.log(`The sources directory ${sources} does not exist. This means that no contracts will be compiled. Please check your config file.`);
            if (!(0, helpers_1.isEnvTrue)('SOLIDITY_USE_NODE_MODULE')) {
                console.log('If you want to use InfinityMints contracts from the node module, please set the SOLIDITY_USE_NODE_MODULE environment variable to true.');
            }
            process.exit(1);
        }
        //first lets clean
        console.log(chalk_1.default.cyanBright('\nCleaning Artifacts...'));
        yield hardhat_1.default.run('clean');
        console.log(chalk_1.default.green('Successfully Cleaned Artifacts!\n'));
        console.log(chalk_1.default.cyanBright('Compiling Artifacts...\n'));
        //then, lets compile
        yield hardhat_1.default.run('compile');
        console.log(chalk_1.default.green('Successfully Compiled Contracts!\n'));
        //check that the artifacts are there
        let artifacts = (0, helpers_1.cwd)() + '/artifacts/';
        if ((_b = config.hardhat.paths) === null || _b === void 0 ? void 0 : _b.artifacts) {
            artifacts = config.hardhat.paths.artifacts;
            if (!artifacts.endsWith('/')) {
                artifacts = artifacts + '/';
            }
            if (!artifacts.startsWith((0, helpers_1.cwd)()))
                artifacts = (0, helpers_1.cwd)() + '/' + artifacts;
        }
        console.log(chalk_1.default.magenta(`Artifacts folder: ${artifacts}`));
        if (!fs_1.default.existsSync(artifacts)) {
            console.log(`The artifacts directory ${artifacts} does not exist. This means that no contracts were compiled. Please check your config file.`);
            process.exit(1);
        }
        //check that its not empty
        let files = fs_1.default.readdirSync(artifacts);
        if (files.length == 0) {
            console.log(`The artifacts directory ${artifacts} is empty. This means that no contracts were compiled. Please check your config file.`);
            process.exit(1);
        }
        if (solidityFolder === 'alpha' || solidityFolder === 'beta') {
            console.log(chalk_1.default.cyanBright('\nChecking Compiled Artifacts...\n'));
            //check that all the contracts from the InfinityMint node module are there even if we are not using them
            let contractSourceFiles = (0, helpers_1.cwd)() + '/node_modules/infinitymint/' + solidityFolder + '/';
            //if we are working on the node module, then the solidity folder is in the root
            if ((0, helpers_1.isInfinityMint)())
                contractSourceFiles = (0, helpers_1.cwd)() + '/' + solidityFolder + '/';
            if (!fs_1.default.existsSync(contractSourceFiles)) {
                console.log(`The InfinityMint node module does not have the solidity folder ${solidityFolder} in it. Please check your config file.`);
                process.exit(1);
            }
            let artifactNames = yield hardhat_1.default.artifacts.getAllFullyQualifiedNames();
            //check that for all the contracts in the solidity folder, there is a corresponding artifact
            let contractFiles = fs_1.default.readdirSync(contractSourceFiles);
            let errors = [];
            for (let i = 0; i < contractFiles.length; i++) {
                let contractFile = contractFiles[i];
                if (contractFile.endsWith('.sol')) {
                    let contractName = contractFile.replace('.sol', '');
                    //check that the artifact exists
                    if (artifactNames.filter((name) => name.indexOf(contractName) !== -1).length === 0) {
                        errors.push(`${chalk_1.default.magenta(`❌  => `)}` +
                            chalk_1.default.red(`${contractName} does not have a corresponding artifact. Please check your config file.`));
                    }
                    else
                        console.log(chalk_1.default.magenta(`✅ => `) +
                            chalk_1.default.gray(`${contractName} has a corresponding artifact.`));
                }
            }
            if (errors.length !== 0) {
                console.log(chalk_1.default.redBright(`\nThere were ${errors.length} errors while checking the compiled artifacts.\n`));
                for (let i = 0; i < errors.length; i++)
                    console.log(errors[i]);
                process.exit(1);
            }
            else
                console.log(chalk_1.default.greenBright(`\nThere were no errors while checking the compiled artifacts.\n`));
            console.log(chalk_1.default.cyanBright('\nCompiled Artifacts...\n'));
        }
    }))();
});
//# sourceMappingURL=compile.js.map