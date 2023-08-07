(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "chalk", "readline", "../app/helpers", "fs", "path", "child_process", "../app/helpers", "yargs"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.endScreen = void 0;
    const tslib_1 = require("tslib");
    const chalk_1 = tslib_1.__importDefault(require("chalk"));
    const readline_1 = tslib_1.__importDefault(require("readline"));
    const helpers_1 = require("../app/helpers");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const path_1 = tslib_1.__importDefault(require("path"));
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const child_process_1 = tslib_1.__importDefault(require("child_process"));
    const helpers_2 = require("../app/helpers");
    const yargs_1 = tslib_1.__importDefault(require("yargs"));
    let isUsingDefault = false;
    const menu = {
        basic: {
            key: 'Create Basic Config File',
            onSelected: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                console.log(chalk_1.default.cyanBright('\nCreating Basic Config File...'));
                yield addNetworks();
                yield addIPFS();
                yield addExpress();
                yield addGanache();
                yield save();
                yield (0, exports.endScreen)();
                process.exit(0);
            }),
        },
        advanced: {
            key: 'Create Advanced Config File',
            onSelected: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                console.log(chalk_1.default.cyanBright('\nCreating Advanced Config File...'));
                //let the user enter roots
                yield addRoots();
                yield addNetworks();
                yield addIPFS();
                yield addExpress();
                yield addGanache();
                yield save();
                yield (0, exports.endScreen)();
                process.exit(0);
            }),
        },
        exit: {
            key: 'Exit',
            onSelected: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                process.exit(0);
            }),
        },
    };
    const question = (query) => {
        console.log('\n');
        console.log(chalk_1.default.cyanBright(query));
        return new Promise((resolve) => {
            rl.question('👌 ', (answer) => {
                if (answer.length === 0)
                    return resolve(null);
                resolve(answer);
            });
        });
    };
    const confirm = (query) => {
        console.log(chalk_1.default.cyanBright(query));
        return new Promise((resolve) => {
            rl.question('(y/n): ', (answer) => {
                if (answer.toLowerCase() === 'y' ||
                    answer.toLowerCase() === 'yes' ||
                    answer[0] === 'y')
                    return resolve(true);
                else if (answer.toLowerCase() === 'n' ||
                    answer.toLowerCase() === 'no' ||
                    answer[0] === 'n')
                    return resolve(false);
                else {
                    console.log(chalk_1.default.redBright('Please enter either y/n'));
                    return confirm(query).then((choice) => {
                        resolve(choice);
                    });
                }
            });
        });
    };
    const choice = (query, choices, help = '') => {
        let choiceString = choices
            .map((choice, index) => {
            return chalk_1.default.gray.underline(`${index + 1})`) + ` ${choice}`;
        })
            .join('\n');
        console.log('\n');
        console.log(chalk_1.default.cyanBright(query));
        console.log(choiceString);
        if (help)
            console.log(chalk_1.default.gray(help));
        return new Promise((resolve) => {
            if (isUsingDefault)
                return resolve(0);
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
                    return resolve(choices.indexOf(choices.filter((choice) => choice
                        .toLowerCase()
                        .includes(answer.toLowerCase()) &&
                        answer.length >=
                            Math.ceil(choice.length / 2) + 1)[0]));
                else
                    return resolve(int - 1);
            });
        });
    };
    const errorAndClear = (error) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        console.log(chalk_1.default.redBright(error));
        yield new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 500);
        });
        console.clear();
    });
    const endScreen = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        console.log(chalk_1.default.yellow(`\n
   ____     ____      _ __       __  ____      __ 
  /  _/__  / _(_)__  (_) /___ __/  |/  (_)__  / /_
 _/ // _ \\/ _/ / _ \\/ / __/ // / /|_/ / / _ \\/ __/
/___/_//_/_//_/_//_/_/\\__/\\_, /_/  /_/_/_//_/\\__/ 
                         /___/`));
        console.log(chalk_1.default.green(`Welcome to InfinityMint! You are setup and ready to go!.\n`));
        console.log(chalk_1.default.gray('To use InfinityMint in the terminal, run the following command:\n'));
        console.log(chalk_1.default.cyanBright('\tnpx infinitymint\n\n'));
        console.log(chalk_1.default.gray('To start the InfinityConsole, run the following command:\n'));
        console.log(chalk_1.default.cyanBright('\tnpx infinitymint --console\n\n'));
        console.log(chalk_1.default.gray('To start the Ganache test chain (if you installed it), run the following command:\n'));
        console.log(chalk_1.default.cyanBright('\tnpx infinitymint --stay-open --start-ganache "true" --start-express "false" --start-web-socket "false"\n\n'));
        console.log(chalk_1.default.gray('To start the InfinityMint API Server (with Web Sockets), run the following command:\n'));
        console.log(chalk_1.default.cyanBright('\tnpx infinitymint --stay-open --start-ganache "false" --start-express "true" --start-web-socket "true"\n\n'));
        console.log(chalk_1.default.gray('To compile your Solidity smart contracts, run the following command:\n'));
        console.log(chalk_1.default.cyanBright('\tnpx infinitymint --compileContracts\n\n'));
        console.log(chalk_1.default.gray('Please check out our auto-generated documentation at ' +
            chalk_1.default.underline('https://docs.infinitymint.app')));
        console.log(chalk_1.default.gray('You can also hand written tutorials at ' +
            chalk_1.default.underline('https://guide.infinitymint.app')));
    });
    exports.endScreen = endScreen;
    //will let the user select a directory using the terminal
    const selectDirectory = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let selectedDir = (0, helpers_1.cwd)() + '/';
        let selectedChoice = yield choice('Select a directory', [
            'Current Directory',
            'Enter Directory',
            'Find Directory',
            'Cancel',
        ]);
        if (selectedChoice === 0)
            return (0, helpers_1.cwd)() + '/';
        else if (selectedChoice == 1) {
            let dir = yield question('Enter a directory');
            if (!fs_1.default.existsSync(dir))
                return errorAndClear('Directory does not exist').then(() => {
                    return selectDirectory();
                });
            return dir;
        }
        else if (selectedChoice === 2) {
            //list the current directory
            let listDir = (dir) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                let choices = yield (0, helpers_1.safeGlob)(dir + '/*', false, false);
                choices = choices.map((choice) => {
                    if (choice.endsWith('/'))
                        choice = choice.slice(0, -1);
                    return choice.split('/').slice(-1)[0];
                });
                choices = choices.filter((choice) => choice !== 'node_modules' &&
                    fs_1.default.lstatSync(dir + '/' + choice).isDirectory());
                choices.push(chalk_1.default.magenta('<Back>'));
                choices.push(chalk_1.default.cyan('<Use Current Directory>'));
                choices.push(chalk_1.default.red('<Cancel>'));
                let choiceIndex = yield choice('Select a directory', choices, '\nCurrent Directory: ' + dir + '\n');
                if (choiceIndex === choices.length - 1)
                    return null;
                if (choiceIndex === choices.length - 2) {
                    return selectedDir;
                }
                if (choiceIndex === choices.length - 3) {
                    return yield listDir(dir.split('/').slice(0, -2).join('/') + '/');
                }
                selectedDir = dir + choices[choiceIndex];
                if (!selectedDir.endsWith('/'))
                    selectedDir = selectedDir + '/';
                return yield listDir(selectedDir);
            });
            return yield listDir(selectedDir);
        }
        else if (selectedChoice === 3)
            return null;
    });
    const addNetwork = (networkName = '', customRPC = null, chainId = null, mnemonic = null) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (networkName === '')
            networkName = yield question('Enter a name for the network');
        let network = ((_b = (_a = configFile === null || configFile === void 0 ? void 0 : configFile.hardhat) === null || _a === void 0 ? void 0 : _a.networks) === null || _b === void 0 ? void 0 : _b[networkName]) || {};
        let rpc;
        if (isUsingDefault || (customRPC && !(yield confirm('Use a custom RPC?'))))
            rpc = customRPC;
        else {
            let hasRpc = false;
            while (!hasRpc) {
                rpc = yield question('Enter the RPC URL');
                if (!(yield pingRPC(rpc))) {
                    yield errorAndClear('Could not ping RPC');
                    let cancel = yield confirm('Cancel?');
                    if (cancel)
                        return;
                }
                else
                    hasRpc = true;
            }
        }
        network.url = rpc;
        chainId = chainId || parseInt(yield question('Enter the chain ID'));
        network.chainId = chainId;
        if (mnemonic && (yield confirm('Use a custom mnemonic?'))) {
            let useSession = yield confirm('Use a session env for mnemonic?');
            if (useSession) {
                let sessionName = yield question('Enter the session key');
                network.accounts = {
                    mnemonic: `session:${sessionName}`,
                };
            }
            else {
                let useEnv = yield confirm('Use an env for mnemonic?');
                if (useEnv) {
                    let envName = yield question('Enter the env key');
                    network.accounts = {
                        mnemonic: `env:${envName}`,
                    };
                }
            }
        }
        else if (mnemonic) {
            network.accounts = {
                mnemonic,
            };
        }
        configFile.hardhat.networks[networkName] = network;
    });
    const pingRPC = (rpc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let port = 80;
        if (rpc.split(':').length > 2) {
            port = parseInt(rpc.split(':')[2]);
            rpc = rpc.split(':').slice(0, -1).join(':');
        }
        rpc = rpc.replace('http://', '');
        if (rpc.startsWith('https'))
            port = 443;
        rpc = rpc.replace('https://', '');
        rpc = rpc.split('/')[0];
        console.log(chalk_1.default.cyanBright('Pinging RPC') +
            ' ' +
            chalk_1.default.gray.underline(rpc) +
            ' ' +
            chalk_1.default.gray.underline(port));
        return (yield (0, helpers_1.tcpPingPort)(rpc, port)).online;
    });
    const runCommand = (command) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let args = command.split(' ');
        let cmd = args[0];
        args = args.slice(1);
        let child = child_process_1.default.spawn(cmd, args, {
            stdio: 'inherit',
            shell: true,
        });
        return new Promise((resolve, reject) => {
            child.on('close', (code) => {
                if (code === 0)
                    resolve(true);
                else
                    reject(false);
            });
        });
    });
    const setupESM = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let packageJson = (0, helpers_1.getPackageJson)();
        if (!(packageJson === null || packageJson === void 0 ? void 0 : packageJson.type))
            return;
        console.log(chalk_1.default.bgRed.white('WARNING: You are using an ESM package!'));
        console.log(chalk_1.default.yellow(`Note: This is an ESM package. InfinityMint supports running inside an ESM package,\nbut the following changes will be made to your package.json:`));
        console.log(chalk_1.default.gray(`To use InfinityMint, you must run the following commands (flags still work!):\n`));
        console.log(chalk_1.default.green(`npm run console (instead of npx infinitymint --console)`));
        console.log(chalk_1.default.green(`npm run cli -- <args> (instead of npx infinitymint)`));
        !isUsingDefault ? yield confirm('Please acknowledge this message!') : null;
        let consoleExample = fs_1.default.readFileSync((__dirname + '/../examples/console.example.module.js').replace('/dist', ''));
        fs_1.default.writeFileSync((0, helpers_1.cwd)() + '/console.js', consoleExample);
        let runExample = fs_1.default.readFileSync((__dirname + '/../examples/run.example.module.js').replace('/dist', ''));
        fs_1.default.writeFileSync((0, helpers_1.cwd)() + '/run.js', runExample);
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts.cli = 'node run.js';
        packageJson.scripts.console = 'node console.js';
        fs_1.default.writeFileSync((0, helpers_1.cwd)() + '/package.json', JSON.stringify(packageJson, null, 4));
    });
    const addNetworks = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _c;
        console.log(chalk_1.default.cyanBright('\nInfinityMint Network'));
        console.log(chalk_1.default.gray('Networks are used to connect to blockchains and testnets.'));
        console.log(chalk_1.default.magenta('\nCurrent Networks: '));
        Object.keys(((_c = configFile === null || configFile === void 0 ? void 0 : configFile.hardhat) === null || _c === void 0 ? void 0 : _c.networks) || []).forEach((network) => {
            var _a;
            let val = configFile.hardhat.networks[network];
            console.log(chalk_1.default.gray.underline(network) +
                ' - ' +
                chalk_1.default.gray.underline(val.url) +
                ' - ' +
                chalk_1.default.gray.underline(val.chainId) +
                ' - ' +
                chalk_1.default.gray.underline((_a = val.accounts) === null || _a === void 0 ? void 0 : _a.mnemonic));
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
            choiceIndex = yield choice('Select an option', choices);
        else
            choiceIndex = 9;
        if (choiceIndex === 0) {
            yield addNetwork('ethereum', 'https://eth.llamarpc.com', 1, 'env:ETH_MNEMONIC||session:ganacheMnemonic');
            return yield addNetworks();
        }
        if (choiceIndex === 1) {
            yield addNetwork('polygon', 'https://polygon-rpc.com', 137, 'env:POLYGON_MNEMONIC||session:ganacheMnemonic');
            return yield addNetworks();
        }
        if (choiceIndex === 2) {
            yield addNetwork('mumbai', 'https://rpc-mumbai.maticvigil.com', 80001, 'env:MUMBAI_MNEMONIC||session:ganacheMnemonic');
            return yield addNetworks();
        }
        if (choiceIndex === 3) {
            yield addNetwork('goerli', 'https://ethereum-goerli.publicnode.com', 5, 'env:GOERLI_MNEMONIC||session:ganacheMnemonic');
            return yield addNetworks();
        }
        if (choiceIndex === 4) {
            yield addNetwork('polygon_zksync', 'https://zkevm-rpc.com', 1101, 'env:POLYGON_ZKSYNC_MNEMONIC||session:ganacheMnemonic');
            return yield addNetworks();
        }
        if (choiceIndex === 5) {
            yield addNetwork('arbitrum', 'https://endpoints.omniatech.io/v1/arbitrum/one/public', 42161, 'env:ARBITRUM_MNEMONIC||session:ganacheMnemonic');
            return yield addNetworks();
        }
        if (choiceIndex === 6) {
            yield addNetwork('optimism', 'https://endpoints.omniatech.io/v1/op/mainnet/public', 10, 'env:OPTIMISM_MNEMONIC||session:ganacheMnemonic');
            return yield addNetworks();
        }
        if (choiceIndex === 7) {
            yield addNetwork();
            return yield addNetworks();
        }
        if (choiceIndex === 8) {
            let networkName = yield question('Enter the name of the network to remove');
            if (!configFile.hardhat.networks[networkName])
                return errorAndClear('Network does not exist').then(() => {
                    return addNetworks();
                });
            delete configFile.hardhat.networks[networkName];
            return yield addNetworks();
        }
        if (choiceIndex === 9) {
            if (!configFile.hardhat.networks) {
                let continueWithout = yield confirm('No networks are configured. Continue without adding any?');
                if (!continueWithout)
                    return yield addNetworks();
            }
            return null;
        }
    });
    const addRoots = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f;
        console.log(chalk_1.default.cyanBright('\nInfinityMint Roots'));
        console.log(chalk_1.default.gray('Roots are directories other than the current one that InfinityMint will use to find imports, projects and scripts.\nGems will also be included from the root.'));
        console.log(chalk_1.default.magenta('\nCurrent Roots: '));
        console.log(configFile.roots || []);
        console.log('');
        if ((_d = configFile.settings.scripts) === null || _d === void 0 ? void 0 : _d.disableMainExecution) {
            console.log(chalk_1.default.redBright('Scripts in the following roots will not be automatically required by InfinityMint:'));
            console.log(configFile.settings.scripts.disableMainExecution);
            console.log(chalk_1.default.gray('You can undo this by adding the root again and choosing "n" when prompted'));
            console.log('');
        }
        let choice = yield confirm('Do you want to add an external root?');
        if (choice) {
            let root = yield selectDirectory();
            if (root) {
                configFile.roots = configFile.roots || [];
                if (!configFile.roots.includes(root))
                    configFile.roots.push(root);
                let choice = yield confirm('Does the scripts folder in that root have scripts which are automatically executed if required? (main executable scripts)');
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
                }
                else if ((_f = (_e = configFile.settings) === null || _e === void 0 ? void 0 : _e.scripts) === null || _f === void 0 ? void 0 : _f.disableMainExecution) {
                    configFile.settings.scripts.disableMainExecution =
                        configFile.settings.scripts.disableMainExecution.filter((thatRoot) => thatRoot !== root);
                }
            }
            return yield addRoots();
        }
    });
    const addExpress = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let useExpress = isUsingDefault
            ? true
            : yield confirm('Do you want to enable the InfinityMint API Server?');
        if (useExpress) {
            let port = isUsingDefault
                ? null
                : yield question('Enter the port to run the server on (leave blank for 1337)');
            configFile.express = { port: parseInt(port) || 1337 };
            let setCORS = isUsingDefault
                ? false
                : yield confirm('Do you want to set CORS?');
            if (setCORS) {
                let cors = (shouldEnter = true) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    configFile.express.cors =
                        configFile.express.cors ||
                            [];
                    if (shouldEnter) {
                        console.log(chalk_1.default.magenta('\nCurrent CORS origins'));
                        console.log(configFile.express.cors);
                        let origin = yield question('Enter the origin');
                        configFile.express.cors.push(origin);
                    }
                    console.log(chalk_1.default.magenta('\nCurrent CORS origins'));
                    console.log(configFile.express.cors);
                    let choiceIndex = yield choice('Select an option', [
                        'Add Another Origin',
                        'Delete Origin',
                        'Finished',
                    ]);
                    if (choiceIndex === 0)
                        yield cors();
                    if (choiceIndex === 1) {
                        let origin = yield question('Enter the origin to delete').then((origin) => origin.toLowerCase());
                        configFile.express.cors = configFile.express.cors.filter((thatOrigin) => thatOrigin.toLowerCase() !== origin);
                        yield cors(false);
                    }
                    return;
                });
                let makeAll = yield confirm('Do you want to allow all origins?');
                if (makeAll)
                    configFile.express.cors = ['*'];
                else
                    yield cors();
            }
            let useSockets = isUsingDefault
                ? false
                : yield confirm('Do you want to enable web sockets?');
            if (useSockets) {
                configFile.express = configFile.express || {};
                if (!configFile.express.sockets)
                    configFile.express.sockets = {};
                configFile.express.sockets.port = parseInt((yield question('Enter the port to run the socket server on (leave blank for 8080)')) || '8080');
            }
        }
    });
    const addGanache = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let useGanache = isUsingDefault
            ? false
            : yield confirm('Do you want to use Ganache?');
        if (useGanache) {
            if (!fs_1.default.existsSync((0, helpers_1.cwd)() + '/node_modules/ganache/')) {
                console.log(chalk_1.default.redBright('Ganache not found. Installing...'));
                yield runCommand('npm i -D ganache');
                console.log(chalk_1.default.greenBright('Ganache installed and added to dev depencencies!'));
            }
            let chainId = yield question('Enter the chain ID to use (leave blank for 1337)');
            let totalAccounts = yield question('Enter the number of accounts to create (leave blank for 10)');
            let defaultBalance = yield question('Enter the default balance of each account (leave blank for 69420 tokens)');
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
                url: (yield question('Enter the URL of the Ganache server (leave blank for http://localhost:8545)')) || 'http://127.0.0.1:8545',
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
    });
    const writeInfinityMintConfig = (type = 'typescript') => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _g;
        let header = `import { InfinityMintConfig } from 'infinitymint/dist/app/interfaces';
`;
        if (type === 'typescript' && (0, helpers_1.isInfinityMint)())
            header = `import { InfinityMintConfig } from './app/interfaces';
`;
        if (type === 'javascript')
            header = `\n`;
        let extension = type === 'typescript' ? 'ts' : 'js';
        if ((0, helpers_1.getPackageJson)().type === 'module')
            extension = 'cjs';
        let configPath = path_1.default.join(process.cwd(), 'infinitymint.config.' + extension);
        if (fs_1.default.existsSync(configPath)) {
            console.log(chalk_1.default.red('Config file already exists!'));
            let choiceIndex = yield choice('Select an option', [
                'Overwrite (default)',
                'Merge',
                'Cancel',
            ]);
            if (choiceIndex === 0) {
                fs_1.default.unlinkSync(configPath);
            }
            if (choiceIndex === 1) {
                let config = yield __syncRequire ? (_g = configPath, Promise.resolve().then(() => tslib_1.__importStar(require(_g)))) : new Promise((resolve_1, reject_1) => { require([configPath], resolve_1, reject_1); }).then(tslib_1.__importStar);
                config = config.default || config;
                let merge = (obj1, obj2) => {
                    for (let key in obj2) {
                        if (obj1[key] === undefined)
                            obj1[key] = obj2[key];
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
                console.log(chalk_1.default.red('Cancelled'));
                return false;
            }
        }
        console.log(chalk_1.default.magenta('\nWriting config file'));
        let file = `${header}
const config: InfinityMintConfig = ${JSON.stringify(configFile, null, 4)};
export default config; `;
        if (type === 'javascript')
            file = file
                .replace('export default config;', 'module.exports = config;')
                .replace('config: InfinityMintConfig', 'config');
        fs_1.default.writeFileSync(configPath, file);
        console.log(chalk_1.default.green('Config file written successfully!'));
        return true;
    });
    const addIPFS = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let useIPFS = isUsingDefault
            ? false
            : yield confirm('Do you want to use IPFS?');
        if (useIPFS) {
            configFile.ipfs = configFile.ipfs || {};
            let usingWeb3Storage = yield confirm('Do you want to use Web3.Storage?');
            if (usingWeb3Storage) {
                configFile.ipfs = {
                    web3Storage: {
                        token: yield question('Enter your Web3.Storage token'),
                        useAlways: yield confirm('Do you want to use Web3.Storage for all uploads?'),
                    },
                };
            }
            else
                configFile.ipfs = true;
        }
    });
    let configFile = {
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
    const save = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let choiceIndex;
        if (!isUsingDefault)
            choiceIndex = yield choice('Select a type of config file to create', [
                'Typescript (using Import)',
                'Javascript (using Require)',
            ]);
        else if (isUsingDefault)
            choiceIndex = 0;
        else
            choiceIndex = 1;
        let type = choiceIndex === 0 ? 'typescript' : 'javascript';
        if ((0, helpers_1.getPackageJson)().type === 'module' && type === 'typescript') {
            console.log(chalk_1.default.red('Typescript config files are not supported in ESM projects! Reverting back to Javascript config file...'));
            type = 'javascript';
        }
        if (yield writeInfinityMintConfig(type)) {
            console.log(chalk_1.default.green('Basic config file created successfully! You can now run infinitymint with npx infinitymint'));
            let runCompile = isUsingDefault
                ? false
                : yield confirm('Do you want to compile your contracts now?');
            if (runCompile) {
                console.log(chalk_1.default.cyanBright('\nCompiling contracts...'));
                if ((0, helpers_1.isInfinityMint)())
                    yield runCommand('node main.js --compileContracts');
                else
                    yield runCommand('npx infinitymint --compileContracts');
            }
        }
        else
            console.log(chalk_1.default.red('Basic config file creation failed! Please try again!'));
    });
    const createHardhatConfig = (type = 'javascript') => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        //copy from node modules
        let hardhatConfigPath = path_1.default.join(process.cwd(), 'node_modules/infinitymint/examples/');
        if ((0, helpers_1.isInfinityMint)())
            hardhatConfigPath = path_1.default.join(process.cwd(), 'examples/');
        let packageJson = (0, helpers_1.getPackageJson)();
        let extension = type === 'typescript' ? '.ts' : '.js';
        if (packageJson.type === 'module')
            extension = '.cjs';
        hardhatConfigPath += 'hardhat.config.example' + extension;
        let hardhatConfig = fs_1.default.readFileSync(hardhatConfigPath, {
            encoding: 'utf-8',
        });
        fs_1.default.writeFileSync(path_1.default.join(process.cwd(), 'hardhat.config' + extension), hardhatConfig);
        console.log(chalk_1.default.green('Hardhat config file created successfully!'));
        console.log(chalk_1.default.gray(path_1.default.join(process.cwd(), 'hardhat.config' + extension)));
    });
    //makes an infinitymint.config.ts file
    (() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        console.clear();
        console.log(chalk_1.default.yellow(`\n
   ____     ____      _ __       __  ____      __ 
  /  _/__  / _(_)__  (_) /___ __/  |/  (_)__  / /_
 _/ // _ \\/ _/ / _ \\/ / __/ // / /|_/ / / _ \\/ __/
/___/_//_/_//_/_//_/_/\\__/\\_, /_/  /_/_/_//_/\\__/ 
                         /___/`));
        let argv = yield yargs_1.default.argv;
        if (argv.y)
            isUsingDefault = true;
        if (!fs_1.default.existsSync('.env'))
            (0, helpers_2.createEnv)();
        if (!(0, helpers_1.hasHardhatConfig)()) {
            let choiceIndex;
            if (!isUsingDefault)
                choiceIndex = yield choice('No hardhat config file found. Select an option', [
                    'Create a Typescript hardhat config file',
                    'Create a Javascript hardhat config file',
                    'Exit',
                ]);
            else if ((0, helpers_1.isTypescript)())
                choiceIndex = 0;
            else
                choiceIndex = 1;
            if (choiceIndex === 0) {
                yield createHardhatConfig('typescript');
            }
            if (choiceIndex === 1) {
                yield createHardhatConfig('javascript');
            }
            if (choiceIndex === 2) {
                process.exit(0);
            }
        }
        if ((0, helpers_1.getPackageJson)().type === 'module')
            yield setupESM();
        let menuFunc = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            console.log(chalk_1.default.cyanBright('\nInfinityMint Config Script Maker'));
            console.log(chalk_1.default.underline.gray('This script will help you create an infinitymint configuration file'));
            if (!fs_1.default.existsSync(path_1.default.join(process.cwd(), '.gitignore'))) {
                let makeGitIgnore = yield confirm('Do you want to create a .gitignore file?');
                if (makeGitIgnore) {
                    fs_1.default.writeFileSync(path_1.default.join(process.cwd(), '.gitignore'), fs_1.default.readFileSync(path_1.default.join(process.cwd(), (0, helpers_1.isInfinityMint)()
                        ? 'examples'
                        : 'node_modules/infinitymint/examples/', '.example.gitignore'), {
                        encoding: 'utf-8',
                    }));
                    console.log(chalk_1.default.green('.gitignore file created successfully!'));
                }
            }
            let menuVal = Object.values(menu);
            let menuOption = yield choice('What type of config file do you want to create?', menuVal.map((option) => option.key));
            let selectedOption = menuVal[menuOption];
            if (!selectedOption) {
                yield errorAndClear('Invalid Option');
            }
            else {
                yield selectedOption.onSelected();
                yield errorAndClear('');
            }
        });
        while (true) {
            yield menuFunc();
        }
    }))();
});
//# sourceMappingURL=config.js.map