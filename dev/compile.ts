import hre from 'hardhat';
import chalk from 'chalk';
import {
    cwd,
    getConfigFile,
    getEnv,
    getSolidityFolder,
    isEnvTrue,
    isInfinityMint,
} from '../app/helpers';
import fs from 'fs';

(async () => {
    console.log(
        chalk.yellow(`\n
   ____     ____      _ __       __  ____      __ 
  /  _/__  / _(_)__  (_) /___ __/  |/  (_)__  / /_
 _/ // _ \\/ _/ / _ \\/ / __/ // / /|_/ / / _ \\/ __/
/___/_//_/_//_/_//_/_/\\__/\\_, /_/  /_/_/_//_/\\__/ 
                         /___/`)
    );
    console.log(chalk.cyanBright('\nCompile Script v1'));
    console.log(
        chalk.underline.gray(
            'This script checks that all of InfinityMints contracts compile through solc correctly\n'
        )
    );

    let config = getConfigFile();
    let solidityFolder = getSolidityFolder();

    console.log(chalk.magenta(`Using solidity folder: ${solidityFolder}`));

    //lets check that the config stuff is okay

    let sources = cwd() + '/contracts/';
    if (config.hardhat.paths?.sources) {
        sources = config.hardhat.paths.sources;
        if (!sources.endsWith('/')) {
            sources = sources + '/';
        }

        if (!sources.startsWith(cwd())) sources = cwd() + '/' + sources;
    }

    console.log(chalk.magenta(`Sources folder: ${sources}`));

    if (!fs.existsSync(sources)) {
        console.log(
            `The sources directory ${sources} does not exist. This means that no contracts will be compiled. Please check your config file.`
        );

        if (!isEnvTrue('SOLIDITY_USE_NODE_MODULE')) {
            console.log(
                'If you want to use InfinityMints contracts from the node module, please set the SOLIDITY_USE_NODE_MODULE environment variable to true.'
            );
        }

        process.exit(1);
    }

    //first lets clean
    console.log(chalk.cyanBright('\nCleaning Artifacts...'));
    await hre.run('clean');
    console.log(chalk.green('Successfully Cleaned Artifacts!\n'));
    console.log(chalk.cyanBright('Compiling Artifacts...\n'));
    //then, lets compile
    await hre.run('compile');
    console.log(chalk.green('Successfully Compiled Contracts!\n'));

    //check that the artifacts are there
    let artifacts = cwd() + '/artifacts/';

    if (config.hardhat.paths?.artifacts) {
        artifacts = config.hardhat.paths.artifacts;
        if (!artifacts.endsWith('/')) {
            artifacts = artifacts + '/';
        }

        if (!artifacts.startsWith(cwd())) artifacts = cwd() + '/' + artifacts;
    }

    console.log(chalk.magenta(`Artifacts folder: ${artifacts}`));

    if (!fs.existsSync(artifacts)) {
        console.log(
            `The artifacts directory ${artifacts} does not exist. This means that no contracts were compiled. Please check your config file.`
        );
        process.exit(1);
    }

    //check that its not empty
    let files = fs.readdirSync(artifacts);
    if (files.length == 0) {
        console.log(
            `The artifacts directory ${artifacts} is empty. This means that no contracts were compiled. Please check your config file.`
        );
        process.exit(1);
    }

    if (solidityFolder === 'alpha' || solidityFolder === 'beta') {
        console.log(chalk.cyanBright('\nChecking Compiled Artifacts...\n'));
        //check that all the contracts from the InfinityMint node module are there even if we are not using them
        let contractSourceFiles =
            cwd() + '/node_modules/infinitymint/' + solidityFolder + '/';

        //if we are working on the node module, then the solidity folder is in the root
        if (isInfinityMint())
            contractSourceFiles = cwd() + '/' + solidityFolder + '/';

        if (!fs.existsSync(contractSourceFiles)) {
            console.log(
                `The InfinityMint node module does not have the solidity folder ${solidityFolder} in it. Please check your config file.`
            );
            process.exit(1);
        }

        let artifactNames = await hre.artifacts.getAllFullyQualifiedNames();
        //check that for all the contracts in the solidity folder, there is a corresponding artifact
        let contractFiles = fs.readdirSync(contractSourceFiles);
        let errors: string[] = [];
        for (let i = 0; i < contractFiles.length; i++) {
            let contractFile = contractFiles[i];
            if (contractFile.endsWith('.sol')) {
                let contractName = contractFile.replace('.sol', '');

                //check that the artifact exists
                if (
                    artifactNames.filter(
                        (name) => name.indexOf(contractName) !== -1
                    ).length === 0
                ) {
                    errors.push(
                        `${chalk.magenta(`❌  => `)}` +
                            chalk.red(
                                `${contractName} does not have a corresponding artifact. Please check your config file.`
                            )
                    );
                } else
                    console.log(
                        chalk.magenta(`✅ => `) +
                            chalk.gray(
                                `${contractName} has a corresponding artifact.`
                            )
                    );
            }
        }

        if (errors.length !== 0) {
            console.log(
                chalk.redBright(
                    `\nThere were ${errors.length} errors while checking the compiled artifacts.\n`
                )
            );
            for (let i = 0; i < errors.length; i++) console.log(errors[i]);
            process.exit(1);
        } else
            console.log(
                chalk.greenBright(
                    `\nThere were no errors while checking the compiled artifacts.\n`
                )
            );

        console.log(chalk.cyanBright('\nCompiled Artifacts...\n'));
    }
})();
