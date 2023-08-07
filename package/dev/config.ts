import chalk from 'chalk';
import {
    InfinityMintConfig,
    InfinityMintExpressOptions,
    InfinityMintIPFSOptions,
} from '../app/interfaces';
import readline from 'readline';
import {
    cwd,
    hasHardhatConfig,
    isInfinityMint,
    safeGlob,
    getPackageJson,
    tcpPingPort,
    hasNodeModule,
    isTypescript,
} from '../app/helpers';
import fs from 'fs';
import path from 'path';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
import childProcess from 'child_process';
import { createEnv } from '../app/helpers';
import yargs, { argv } from 'yargs';

let isUsingDefault = false;

const menu = {
    basic: {
        key: 'Create Basic Config File',
        onSelected: async () => {
            console.log(chalk.cyanBright('\nCreating Basic Config File...'));
            await addNetworks();
            await addIPFS();
            await addExpress();
            await addGanache();
            await save();
            await endScreen();

            process.exit(0);
        },
    },
    advanced: {
        key: 'Create Advanced Config File',
        onSelected: async () => {
            console.log(chalk.cyanBright('\nCreating Advanced Config File...'));
            //let the user enter roots
            await addRoots();
            await addNetworks();
            await addIPFS();
            await addExpress();
            await addGanache();
            await save();
            await endScreen();

            process.exit(0);
        },
    },
    exit: {
        key: 'Exit',
        onSelected: async () => {
            process.exit(0);
        },
    },
};

const question = (query: string) => {
    console.log('\n');
    console.log(chalk.cyanBright(query));
    return new Promise<string>((resolve) => {
        rl.question('👌 ', (answer) => {
            if (answer.length === 0) return resolve(null);

            resolve(answer);
        });
    });
};

const confirm = (query: string) => {
    console.log(chalk.cyanBright(query));
    return new Promise<boolean>((resolve) => {
        rl.question('(y/n): ', (answer) => {
            if (
                answer.toLowerCase() === 'y' ||
                answer.toLowerCase() === 'yes' ||
                answer[0] === 'y'
            )
                return resolve(true);
            else if (
                answer.toLowerCase() === 'n' ||
                answer.toLowerCase() === 'no' ||
                answer[0] === 'n'
            )
                return resolve(false);
            else {
                console.log(chalk.redBright('Please enter either y/n'));
                return confirm(query).then((choice) => {
                    resolve(choice);
                });
            }
        });
    });
};

const choice = (query: string, choices: string[], help: string = '') => {
    let choiceString = choices
        .map((choice, index) => {
            return chalk.gray.underline(`${index + 1})`) + ` ${choice}`;
        })
        .join('\n');
    console.log('\n');
    console.log(chalk.cyanBright(query));
    console.log(choiceString);
    if (help) console.log(chalk.gray(help));

    return new Promise<number>((resolve) => {
        if (isUsingDefault) return resolve(0);

        rl.question('👌 ', (answer) => {
            let int = parseInt(answer);

            if (int > choices.length) {
                return errorAndClear('Invalid Choice').then(() => {
                    choice(query, choices).then((choice) => {
                        resolve(choice);
                    });
                });
            }
            if (isNaN(int))
                return resolve(
                    choices.indexOf(
                        choices.filter(
                            (choice) =>
                                choice
                                    .toLowerCase()
                                    .includes(answer.toLowerCase()) &&
                                answer.length >=
                                    Math.ceil(choice.length / 2) + 1
                        )[0]
                    )
                );
            else return resolve(int - 1);
        });
    });
};

const errorAndClear = async (error: string) => {
    console.log(chalk.redBright(error));
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 500);
    });
    console.clear();
};

export const endScreen = async () => {
    console.log(
        chalk.yellow(`\n
   ____     ____      _ __       __  ____      __ 
  /  _/__  / _(_)__  (_) /___ __/  |/  (_)__  / /_
 _/ // _ \\/ _/ / _ \\/ / __/ // / /|_/ / / _ \\/ __/
/___/_//_/_//_/_//_/_/\\__/\\_, /_/  /_/_/_//_/\\__/ 
                         /___/`)
    );
    console.log(
        chalk.green(
            `Welcome to InfinityMint! You are setup and ready to go!.\n`
        )
    );
    console.log(
        chalk.gray(
            'To use InfinityMint in the terminal, run the following command:\n'
        )
    );
    console.log(chalk.cyanBright('\tnpx infinitymint\n\n'));
    console.log(
        chalk.gray('To start the InfinityConsole, run the following command:\n')
    );
    console.log(chalk.cyanBright('\tnpx infinitymint --console\n\n'));
    console.log(
        chalk.gray(
            'To start the Ganache test chain (if you installed it), run the following command:\n'
        )
    );
    console.log(
        chalk.cyanBright(
            '\tnpx infinitymint --stay-open --start-ganache "true" --start-express "false" --start-web-socket "false"\n\n'
        )
    );
    console.log(
        chalk.gray(
            'To start the InfinityMint API Server (with Web Sockets), run the following command:\n'
        )
    );
    console.log(
        chalk.cyanBright(
            '\tnpx infinitymint --stay-open --start-ganache "false" --start-express "true" --start-web-socket "true"\n\n'
        )
    );
    console.log(
        chalk.gray(
            'To compile your Solidity smart contracts, run the following command:\n'
        )
    );
    console.log(chalk.cyanBright('\tnpx infinitymint --compileContracts\n\n'));
    console.log(
        chalk.gray(
            'Please check out our auto-generated documentation at ' +
                chalk.underline('https://docs.infinitymint.app')
        )
    );
    console.log(
        chalk.gray(
            'You can also hand written tutorials at ' +
                chalk.underline('https://guide.infinitymint.app')
        )
    );
};

//will let the user select a directory using the terminal
const selectDirectory = async () => {
    let selectedDir = cwd() + '/';
    let selectedChoice = await choice('Select a directory', [
        'Current Directory',
        'Enter Directory',
        'Find Directory',
        'Cancel',
    ]);

    if (selectedChoice === 0) return cwd() + '/';
    else if (selectedChoice == 1) {
        let dir = await question('Enter a directory');

        if (!fs.existsSync(dir))
            return errorAndClear('Directory does not exist').then(() => {
                return selectDirectory();
            });

        return dir;
    } else if (selectedChoice === 2) {
        //list the current directory
        let listDir = async (dir: string) => {
            let choices = await safeGlob(dir + '/*', false, false);
            choices = choices.map((choice) => {
                if (choice.endsWith('/')) choice = choice.slice(0, -1);
                return choice.split('/').slice(-1)[0];
            });
            choices = choices.filter(
                (choice) =>
                    choice !== 'node_modules' &&
                    fs.lstatSync(dir + '/' + choice).isDirectory()
            );
            choices.push(chalk.magenta('<Back>'));
            choices.push(chalk.cyan('<Use Current Directory>'));
            choices.push(chalk.red('<Cancel>'));

            let choiceIndex = await choice(
                'Select a directory',
                choices,
                '\nCurrent Directory: ' + dir + '\n'
            );
            if (choiceIndex === choices.length - 1) return null;

            if (choiceIndex === choices.length - 2) {
                return selectedDir;
            }
            if (choiceIndex === choices.length - 3) {
                return await listDir(
                    dir.split('/').slice(0, -2).join('/') + '/'
                );
            }

            selectedDir = dir + choices[choiceIndex];

            if (!selectedDir.endsWith('/')) selectedDir = selectedDir + '/';
            return await listDir(selectedDir);
        };

        return await listDir(selectedDir);
    } else if (selectedChoice === 3) return null;
};

const addNetwork = async (
    networkName: string = '',
    customRPC: string = null,
    chainId: number = null,
    mnemonic: string = null
) => {
    if (networkName === '')
        networkName = await question('Enter a name for the network');

    let network = configFile?.hardhat?.networks?.[networkName] || {};
    let rpc: string;

    if (isUsingDefault || (customRPC && !(await confirm('Use a custom RPC?'))))
        rpc = customRPC;
    else {
        let hasRpc = false;

        while (!hasRpc) {
            rpc = await question('Enter the RPC URL');

            if (!(await pingRPC(rpc))) {
                await errorAndClear('Could not ping RPC');
                let cancel = await confirm('Cancel?');
                if (cancel) return;
            } else hasRpc = true;
        }
    }

    (network as any).url = rpc;

    chainId = chainId || parseInt(await question('Enter the chain ID'));
    (network as any).chainId = chainId;

    if (mnemonic && (await confirm('Use a custom mnemonic?'))) {
        let useSession = await confirm('Use a session env for mnemonic?');
        if (useSession) {
            let sessionName = await question('Enter the session key');
            (network as any).accounts = {
                mnemonic: `session:${sessionName}`,
            };
        } else {
            let useEnv = await confirm('Use an env for mnemonic?');
            if (useEnv) {
                let envName = await question('Enter the env key');
                (network as any).accounts = {
                    mnemonic: `env:${envName}`,
                };
            }
        }
    } else if (mnemonic) {
        (network as any).accounts = {
            mnemonic,
        };
    }

    configFile.hardhat.networks[networkName] = network;
};

const pingRPC = async (rpc: string) => {
    let port = 80;
    if (rpc.split(':').length > 2) {
        port = parseInt(rpc.split(':')[2]);
        rpc = rpc.split(':').slice(0, -1).join(':');
    }
    rpc = rpc.replace('http://', '');
    if (rpc.startsWith('https')) port = 443;
    rpc = rpc.replace('https://', '');
    rpc = rpc.split('/')[0];

    console.log(
        chalk.cyanBright('Pinging RPC') +
            ' ' +
            chalk.gray.underline(rpc) +
            ' ' +
            chalk.gray.underline(port)
    );
    return (await tcpPingPort(rpc, port)).online;
};

const runCommand = async (command: string) => {
    let args = command.split(' ');
    let cmd = args[0];
    args = args.slice(1);

    let child = childProcess.spawn(cmd, args, {
        stdio: 'inherit',
        shell: true,
    });

    return new Promise((resolve, reject) => {
        child.on('close', (code) => {
            if (code === 0) resolve(true);
            else reject(false);
        });
    });
};

const setupESM = async () => {
    let packageJson = getPackageJson();

    if (!packageJson?.type) return;

    console.log(chalk.bgRed.white('WARNING: You are using an ESM package!'));

    console.log(
        chalk.yellow(
            `Note: This is an ESM package. InfinityMint supports running inside an ESM package,\nbut the following changes will be made to your package.json:`
        )
    );

    console.log(
        chalk.gray(
            `To use InfinityMint, you must run the following commands (flags still work!):\n`
        )
    );
    console.log(
        chalk.green(`npm run console (instead of npx infinitymint --console)`)
    );
    console.log(
        chalk.green(`npm run cli -- <args> (instead of npx infinitymint)`)
    );

    !isUsingDefault ? await confirm('Please acknowledge this message!') : null;

    let consoleExample = fs.readFileSync(
        (__dirname + '/../examples/console.example.module.js').replace(
            '/dist',
            ''
        )
    );

    fs.writeFileSync(cwd() + '/console.js', consoleExample);

    let runExample = fs.readFileSync(
        (__dirname + '/../examples/run.example.module.js').replace('/dist', '')
    );

    fs.writeFileSync(cwd() + '/run.js', runExample);

    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.cli = 'node run.js';
    packageJson.scripts.console = 'node console.js';

    fs.writeFileSync(
        cwd() + '/package.json',
        JSON.stringify(packageJson, null, 4)
    );
};

const addNetworks = async () => {
    console.log(chalk.cyanBright('\nInfinityMint Network'));
    console.log(
        chalk.gray('Networks are used to connect to blockchains and testnets.')
    );
    console.log(chalk.magenta('\nCurrent Networks: '));
    Object.keys(configFile?.hardhat?.networks || []).forEach((network) => {
        let val = configFile.hardhat.networks[network] as any;
        console.log(
            chalk.gray.underline(network) +
                ' - ' +
                chalk.gray.underline(val.url) +
                ' - ' +
                chalk.gray.underline(val.chainId) +
                ' - ' +
                chalk.gray.underline(val.accounts?.mnemonic)
        );
    });

    configFile.hardhat.networks = configFile.hardhat.networks || {};

    let choices = [
        'Add Ethereum',
        'Add Polygon',
        'Add Mumbai',
        'Add Goerli',
        'Add Polygon zkEVM',
        'Add Arbitrum',
        'Add Optimism',
        'Add Custom Network',
        'Remove Network',
        'Finished',
    ];

    let choiceIndex;

    if (!isUsingDefault)
        choiceIndex = await choice('Select an option', choices);
    else choiceIndex = 9;

    if (choiceIndex === 0) {
        await addNetwork(
            'ethereum',
            'https://eth.llamarpc.com',
            1,
            'env:ETH_MNEMONIC||session:ganacheMnemonic'
        );
        return await addNetworks();
    }

    if (choiceIndex === 1) {
        await addNetwork(
            'polygon',
            'https://polygon-rpc.com',
            137,
            'env:POLYGON_MNEMONIC||session:ganacheMnemonic'
        );
        return await addNetworks();
    }

    if (choiceIndex === 2) {
        await addNetwork(
            'mumbai',
            'https://rpc-mumbai.maticvigil.com',
            80001,
            'env:MUMBAI_MNEMONIC||session:ganacheMnemonic'
        );
        return await addNetworks();
    }

    if (choiceIndex === 3) {
        await addNetwork(
            'goerli',
            'https://ethereum-goerli.publicnode.com',
            5,
            'env:GOERLI_MNEMONIC||session:ganacheMnemonic'
        );
        return await addNetworks();
    }

    if (choiceIndex === 4) {
        await addNetwork(
            'polygon_zksync',
            'https://zkevm-rpc.com',
            1101,
            'env:POLYGON_ZKSYNC_MNEMONIC||session:ganacheMnemonic'
        );
        return await addNetworks();
    }

    if (choiceIndex === 5) {
        await addNetwork(
            'arbitrum',
            'https://endpoints.omniatech.io/v1/arbitrum/one/public',
            42161,
            'env:ARBITRUM_MNEMONIC||session:ganacheMnemonic'
        );
        return await addNetworks();
    }

    if (choiceIndex === 6) {
        await addNetwork(
            'optimism',
            'https://endpoints.omniatech.io/v1/op/mainnet/public',
            10,
            'env:OPTIMISM_MNEMONIC||session:ganacheMnemonic'
        );
        return await addNetworks();
    }

    if (choiceIndex === 7) {
        await addNetwork();
        return await addNetworks();
    }

    if (choiceIndex === 8) {
        let networkName = await question(
            'Enter the name of the network to remove'
        );

        if (!configFile.hardhat.networks[networkName])
            return errorAndClear('Network does not exist').then(() => {
                return addNetworks();
            });

        delete configFile.hardhat.networks[networkName];
        return await addNetworks();
    }

    if (choiceIndex === 9) {
        if (!configFile.hardhat.networks) {
            let continueWithout = await confirm(
                'No networks are configured. Continue without adding any?'
            );
            if (!continueWithout) return await addNetworks();
        }
        return null;
    }
};

const addRoots = async () => {
    console.log(chalk.cyanBright('\nInfinityMint Roots'));
    console.log(
        chalk.gray(
            'Roots are directories other than the current one that InfinityMint will use to find imports, projects and scripts.\nGems will also be included from the root.'
        )
    );
    console.log(chalk.magenta('\nCurrent Roots: '));
    console.log(configFile.roots || []);
    console.log('');

    if (configFile.settings.scripts?.disableMainExecution) {
        console.log(
            chalk.redBright(
                'Scripts in the following roots will not be automatically required by InfinityMint:'
            )
        );
        console.log(configFile.settings.scripts.disableMainExecution);
        console.log(
            chalk.gray(
                'You can undo this by adding the root again and choosing "n" when prompted'
            )
        );
        console.log('');
    }

    let choice = await confirm('Do you want to add an external root?');

    if (choice) {
        let root = await selectDirectory();
        if (root) {
            configFile.roots = configFile.roots || [];
            if (!configFile.roots.includes(root)) configFile.roots.push(root);

            let choice = await confirm(
                'Does the scripts folder in that root have scripts which are automatically executed if required? (main executable scripts)'
            );

            if (choice) {
                configFile.settings.scripts = configFile.settings.scripts || {};
                configFile.settings.scripts.disableMainExecution = [
                    ...(configFile.settings.scripts.disableMainExecution || []),
                    root,
                ];
                configFile.settings.scripts.classicScripts = [
                    ...(configFile.settings.scripts.classicScripts || []),
                    root,
                ];
            } else if (configFile.settings?.scripts?.disableMainExecution) {
                configFile.settings.scripts.disableMainExecution =
                    configFile.settings.scripts.disableMainExecution.filter(
                        (thatRoot) => thatRoot !== root
                    );
            }
        }

        return await addRoots();
    }
};

const addExpress = async () => {
    let useExpress = isUsingDefault
        ? true
        : await confirm('Do you want to enable the InfinityMint API Server?');

    if (useExpress) {
        let port = isUsingDefault
            ? null
            : await question(
                  'Enter the port to run the server on (leave blank for 1337)'
              );
        configFile.express = { port: parseInt(port) || 1337 };

        let setCORS = isUsingDefault
            ? false
            : await confirm('Do you want to set CORS?');
        if (setCORS) {
            let cors = async (shouldEnter = true) => {
                (configFile.express as InfinityMintExpressOptions).cors =
                    (configFile.express as InfinityMintExpressOptions).cors ||
                    [];

                if (shouldEnter) {
                    console.log(chalk.magenta('\nCurrent CORS origins'));
                    console.log(
                        (configFile.express as InfinityMintExpressOptions).cors
                    );

                    let origin = await question('Enter the origin');

                    (
                        configFile.express as InfinityMintExpressOptions
                    ).cors.push(origin);
                }

                console.log(chalk.magenta('\nCurrent CORS origins'));
                console.log(
                    (configFile.express as InfinityMintExpressOptions).cors
                );

                let choiceIndex = await choice('Select an option', [
                    'Add Another Origin',
                    'Delete Origin',
                    'Finished',
                ]);

                if (choiceIndex === 0) await cors();
                if (choiceIndex === 1) {
                    let origin = await question(
                        'Enter the origin to delete'
                    ).then((origin) => origin.toLowerCase());
                    (configFile.express as InfinityMintExpressOptions).cors = (
                        configFile.express as InfinityMintExpressOptions
                    ).cors.filter(
                        (thatOrigin) => thatOrigin.toLowerCase() !== origin
                    );
                    await cors(false);
                }
                return;
            };

            let makeAll = await confirm('Do you want to allow all origins?');
            if (makeAll)
                (configFile.express as InfinityMintExpressOptions).cors = ['*'];
            else await cors();
        }

        let useSockets = isUsingDefault
            ? false
            : await confirm('Do you want to enable web sockets?');
        if (useSockets) {
            configFile.express = configFile.express || {};

            if (!configFile.express.sockets) configFile.express.sockets = {};
            configFile.express.sockets.port = parseInt(
                (await question(
                    'Enter the port to run the socket server on (leave blank for 8080)'
                )) || '8080'
            );
        }
    }
};

const addGanache = async () => {
    let useGanache = isUsingDefault
        ? false
        : await confirm('Do you want to use Ganache?');

    if (useGanache) {
        if (!fs.existsSync(cwd() + '/node_modules/ganache/')) {
            console.log(chalk.redBright('Ganache not found. Installing...'));
            await runCommand('npm i -D ganache');
            console.log(
                chalk.greenBright(
                    'Ganache installed and added to dev depencencies!'
                )
            );
        }

        let chainId = await question(
            'Enter the chain ID to use (leave blank for 1337)'
        );

        let totalAccounts = await question(
            'Enter the number of accounts to create (leave blank for 10)'
        );

        let defaultBalance = await question(
            'Enter the default balance of each account (leave blank for 69420 tokens)'
        );

        configFile.ganache = configFile.ganache || {
            chain: {},
            wallet: {},
        };
        configFile.ganache.chain.chainId = parseInt(chainId) || 1337;
        configFile.ganache.wallet.totalAccounts = parseInt(totalAccounts) || 10;
        configFile.ganache.wallet.defaultBalance = defaultBalance || '69420';

        //add to networks
        configFile.hardhat.networks = configFile.hardhat.networks || {};
        configFile.hardhat.networks.ganache = {
            chainId: configFile.ganache.chain.chainId,
            url:
                (await question(
                    'Enter the URL of the Ganache server (leave blank for http://localhost:8545)'
                )) || 'http://127.0.0.1:8545',
        };
        configFile.hardhat.networks.ganache.accounts = {
            mnemonic: 'env:GANACHE_MNEMONIC||session:ganacheMnemonic',
        };

        //settings
        configFile.settings.networks = configFile.settings.networks || {};
        configFile.settings.networks.ganache =
            configFile.settings.networks.ganache || {};
        configFile.settings.networks.ganache.writeMnemonic = true;
    }
};

const writeInfinityMintConfig = async (
    type: 'typescript' | 'javascript' = 'typescript'
) => {
    let header = `import { InfinityMintConfig } from 'infinitymint/dist/app/interfaces';
`;

    if (type === 'typescript' && isInfinityMint())
        header = `import { InfinityMintConfig } from './app/interfaces';
`;

    if (type === 'javascript') header = `\n`;

    let extension = type === 'typescript' ? 'ts' : 'js';
    if (getPackageJson().type === 'module') extension = 'cjs';

    let configPath = path.join(
        process.cwd(),
        'infinitymint.config.' + extension
    );

    if (fs.existsSync(configPath)) {
        console.log(chalk.red('Config file already exists!'));
        let choiceIndex = await choice('Select an option', [
            'Overwrite (default)',
            'Merge',
            'Cancel',
        ]);

        if (choiceIndex === 0) {
            fs.unlinkSync(configPath);
        }

        if (choiceIndex === 1) {
            let config = await import(configPath);
            config = config.default || config;

            let merge = (obj1: any, obj2: any) => {
                for (let key in obj2) {
                    if (obj1[key] === undefined) obj1[key] = obj2[key];
                    else if (obj2[key] instanceof Object)
                        Object.assign(obj2[key], merge(obj1[key], obj2[key]));
                }

                Object.assign(obj1 || {}, obj2);
                return obj1;
            };
            //perform a deep merge
            configFile = merge(configFile, config);
        }

        if (choiceIndex === 2) {
            console.log(chalk.red('Cancelled'));
            return false;
        }
    }

    console.log(chalk.magenta('\nWriting config file'));

    let file = `${header}
const config: InfinityMintConfig = ${JSON.stringify(configFile, null, 4)};
export default config; `;

    if (type === 'javascript')
        file = file
            .replace('export default config;', 'module.exports = config;')
            .replace('config: InfinityMintConfig', 'config');

    fs.writeFileSync(configPath, file);
    console.log(chalk.green('Config file written successfully!'));
    return true;
};

const addIPFS = async () => {
    let useIPFS = isUsingDefault
        ? false
        : await confirm('Do you want to use IPFS?');

    if (useIPFS) {
        configFile.ipfs = configFile.ipfs || {};
        let usingWeb3Storage = await confirm(
            'Do you want to use Web3.Storage?'
        );
        if (usingWeb3Storage) {
            (configFile.ipfs as InfinityMintIPFSOptions) = {
                web3Storage: {
                    token: await question('Enter your Web3.Storage token'),
                    useAlways: await confirm(
                        'Do you want to use Web3.Storage for all uploads?'
                    ),
                },
            };
        } else configFile.ipfs = true;
    }
};

let configFile: InfinityMintConfig = {
    hardhat: {
        networks: {
            hardhat: {},
            localhost: {
                url: 'http://127.0.0.1:8545',
            },
        },
        solidity: {
            version: '0.8.12',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 20,
                },
            },
        },
    },
    ganache: {
        chain: {},
        wallet: {},
    },
    settings: {},
};

const save = async () => {
    let choiceIndex;

    if (!isUsingDefault)
        choiceIndex = await choice('Select a type of config file to create', [
            'Typescript (using Import)',
            'Javascript (using Require)',
        ]);
    else if (isUsingDefault) choiceIndex = 0;
    else choiceIndex = 1;
    let type: 'javascript' | 'typescript' =
        choiceIndex === 0 ? 'typescript' : 'javascript';

    if (getPackageJson().type === 'module' && type === 'typescript') {
        console.log(
            chalk.red(
                'Typescript config files are not supported in ESM projects! Reverting back to Javascript config file...'
            )
        );
        type = 'javascript';
    }

    if (await writeInfinityMintConfig(type)) {
        console.log(
            chalk.green(
                'Basic config file created successfully! You can now run infinitymint with npx infinitymint'
            )
        );

        let runCompile = isUsingDefault
            ? false
            : await confirm('Do you want to compile your contracts now?');

        if (runCompile) {
            console.log(chalk.cyanBright('\nCompiling contracts...'));
            if (isInfinityMint())
                await runCommand('node main.js --compileContracts');
            else await runCommand('npx infinitymint --compileContracts');
        }
    } else
        console.log(
            chalk.red('Basic config file creation failed! Please try again!')
        );
};

const createHardhatConfig = async (
    type: 'typescript' | 'javascript' = 'javascript'
) => {
    //copy from node modules
    let hardhatConfigPath = path.join(
        process.cwd(),
        'node_modules/infinitymint/examples/'
    );

    if (isInfinityMint())
        hardhatConfigPath = path.join(process.cwd(), 'examples/');

    let packageJson = getPackageJson();
    let extension = type === 'typescript' ? '.ts' : '.js';
    if (packageJson.type === 'module') extension = '.cjs';

    hardhatConfigPath += 'hardhat.config.example' + extension;
    let hardhatConfig = fs.readFileSync(hardhatConfigPath, {
        encoding: 'utf-8',
    });

    fs.writeFileSync(
        path.join(process.cwd(), 'hardhat.config' + extension),
        hardhatConfig
    );

    console.log(chalk.green('Hardhat config file created successfully!'));
    console.log(
        chalk.gray(path.join(process.cwd(), 'hardhat.config' + extension))
    );
};

//makes an infinitymint.config.ts file
(async () => {
    console.clear();

    console.log(
        chalk.yellow(`\n
   ____     ____      _ __       __  ____      __ 
  /  _/__  / _(_)__  (_) /___ __/  |/  (_)__  / /_
 _/ // _ \\/ _/ / _ \\/ / __/ // / /|_/ / / _ \\/ __/
/___/_//_/_//_/_//_/_/\\__/\\_, /_/  /_/_/_//_/\\__/ 
                         /___/`)
    );

    let argv = await yargs.argv;
    if (argv.y) isUsingDefault = true;
    if (!fs.existsSync('.env')) createEnv();

    if (!hasHardhatConfig()) {
        let choiceIndex;

        if (!isUsingDefault)
            choiceIndex = await choice(
                'No hardhat config file found. Select an option',
                [
                    'Create a Typescript hardhat config file',
                    'Create a Javascript hardhat config file',
                    'Exit',
                ]
            );
        else if (isTypescript()) choiceIndex = 0;
        else choiceIndex = 1;

        if (choiceIndex === 0) {
            await createHardhatConfig('typescript');
        }

        if (choiceIndex === 1) {
            await createHardhatConfig('javascript');
        }

        if (choiceIndex === 2) {
            process.exit(0);
        }
    }

    if (getPackageJson().type === 'module') await setupESM();

    let menuFunc = async () => {
        console.log(chalk.cyanBright('\nInfinityMint Config Script Maker'));
        console.log(
            chalk.underline.gray(
                'This script will help you create an infinitymint configuration file'
            )
        );

        if (!fs.existsSync(path.join(process.cwd(), '.gitignore'))) {
            let makeGitIgnore = await confirm(
                'Do you want to create a .gitignore file?'
            );
            if (makeGitIgnore) {
                fs.writeFileSync(
                    path.join(process.cwd(), '.gitignore'),
                    fs.readFileSync(
                        path.join(
                            process.cwd(),
                            isInfinityMint()
                                ? 'examples'
                                : 'node_modules/infinitymint/examples/',
                            '.example.gitignore'
                        ),
                        {
                            encoding: 'utf-8',
                        }
                    )
                );
                console.log(
                    chalk.green('.gitignore file created successfully!')
                );
            }
        }

        let menuVal = Object.values(menu);
        let menuOption = await choice(
            'What type of config file do you want to create?',
            menuVal.map((option) => option.key)
        );
        let selectedOption = menuVal[menuOption];

        if (!selectedOption) {
            await errorAndClear('Invalid Option');
        } else {
            await selectedOption.onSelected();
            await errorAndClear('');
        }
    };

    while (true) {
        await menuFunc();
    }
})();
