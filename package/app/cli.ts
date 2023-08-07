import yargs from 'yargs';
import {
    getConfigFile,
    getInfinityMintVersion,
    readGlobalSession,
    createNetworkPipes,
    setDebugLogDisabled,
    setIgnorePipeFactory,
    setExposeConsoleHostMessage,
    setOnlyDefaultLogs,
    setScriptMode,
    warning,
    setAllowExpressLogs,
    setAllowEmojis,
    cwd,
    getFlags,
    isEnvTrue,
    isInfinityMint,
} from './helpers';
import { InfinityMintConsoleOptions, InfinityMintScript } from './interfaces';
//import things we need
import { blessedLog } from './colours';
import { createProviders, executeScript, startInfinityConsole } from './web3';
import hre from 'hardhat';
import fs from 'fs';
import { buildImports, hasImportCache } from './imports';
import { defaultFactory } from './pipes';

let config = getConfigFile();
let options: InfinityMintConsoleOptions;

yargs.parserConfiguration({
    'short-option-groups': true,
    'camel-case-expansion': true,
    'dot-notation': true,
    'parse-numbers': false,
    'boolean-negation': true,
});

(async () => {
    setAllowEmojis(true);
    setScriptMode(true);

    Object.keys(yargs.argv).forEach((key) => {
        if (key !== '_')
            console.log(
                '\t{gray-fg}Argument: ' +
                    key +
                    ' => ' +
                    yargs.argv[key].toString() +
                    '{/}'
            );
    });

    let {
        startGanache,
        hideGanache,
        skipScripts,
        dontInitialize,
        showAllLogs,
        showDebugLogs,
        startExpress,
        startWebSocket,
        stayOpen,
        production,
        onlyCurrentNetworkEvents,
        disableNetworkEvents,
    } = getFlags(await yargs.argv);

    const stayOpenMethod = () => {
        if (stayOpen) {
            console.log(
                `{green-fg}{underline}{bold}InfinityMint ${getInfinityMintVersion()}{/}\nInfinityMint will now keep running until you end this process`
            );

            if (
                infinityConsole.network?.name === 'hardhat' &&
                !scriptArguments?.save?.value
            )
                warning(
                    'Hardhat network is not a persistent network this could mean infinitymint-client. Please be aware that InfinityMint also would not have wrote to your deployments folder. If you want to save the deployments, please use the --save flag when running your script.'
                );

            if (startGanache && !hideGanache) {
                console.log('\n{cyan-fg}Exposing Ganache Private Keys...{/}');
                setExposeConsoleHostMessage(true);

                let session = readGlobalSession();
                let ganachePrivateKeys = session.environment.ganachePrivateKeys;

                if (ganachePrivateKeys === undefined)
                    warning(`No ganache private keys to display`);
                else
                    ganachePrivateKeys.forEach((key, index) => {
                        console.log(
                            `\t[${index}] => ${key}${
                                index === 0 ? ' (deployer)' : ''
                            }`
                        );
                    });

                console.log(
                    '\n{cyan-fg}{bold}Note: {/}{gray-fg}You will see logs being printed below once Ganache gets some action.\nYou can adjust your ganache filters in your config if you would like to limit a message.{/}\n'
                );
            }

            //check if is ts-node instance, if so wait forever
            if (process.argv[0].indexOf('ts-node') !== -1) {
                warning(`stopping exit (ran in ts-node)..`);
                function wait() {
                    setTimeout(() => {
                        wait();
                    }, 1000);
                }
                wait();
            }

            if (startExpress) {
                let routes = infinityConsole.ExpressServer.routes;

                infinityConsole.log(`\n{cyan-fg}Exposing Express...{/}`);
                console.log(`\t{gray-fg}Printing all routes{/}\n`);

                if (routes === undefined || Object.keys(routes).length === 0)
                    warning(`No routes have been registered\n`);

                Object.keys(routes).forEach((key) => {
                    let route = routes[key];
                    console.log(
                        `{cyan-fg}Route => {bold}${route.path || key}{/} `
                    );

                    if (route.post)
                        console.log(`\t{green-fg}{bold}HAS POST{/} `);

                    if (route.get) console.log(`\t{green-fg}{bold}HAS GET{/} `);
                });

                setAllowExpressLogs(true);
            }

            if (isEnvTrue('PRODUCTION')) {
                infinityConsole.log(
                    '\n{yellow-fg}{bold}InfinityMint is in {underline}production{/} {yellow-fg}{bold}mode!{/}'
                );
            }

            console.log('\n{cyan-fg}Press CTRL+C to exit{/}\n');
        } else {
            if (
                infinityConsole.network.name === 'hardhat' &&
                (!yargs.argv['save'] || yargs.argv['save'] === 'false')
            )
                warning(
                    'No changes have been saved as you are using the hardhat network. If you want to save your changes, please use the --save flag when running your script.\n'
                );

            if (!infinityConsole.hasNetworkAccess())
                warning(
                    'No valid Web3 connection was made. Please make sure you have started the chain you are trying to access and check if you have entered the right network info in the config file.'
                );

            process.exit(0);
        }
    };

    try {
        if (isInfinityMint())
            (await import(cwd() + '/dist/app/pipes')).setDefaultFactory(
                defaultFactory as any
            );
        else
            (
                await import(
                    cwd() + '/node_modules/infinitymint/dist/app/pipes'
                )
            ).setDefaultFactory(defaultFactory as any);
    } catch (error) {
        warning(
            'could not change default logger in node_modules, this is probably because dist doesnt exist or infinitymint package doesnt exist'
        );
    }

    console.log(
        '🧱 {magenta-fg}You are running InfinityMint {bold}' +
            getInfinityMintVersion() +
            '{/}'
    );

    //register current network pipes
    createNetworkPipes();

    if (production && !isEnvTrue('PRODUCTION')) {
        process.env.PRODUCTION = 'true';
        console.log('{yellow-fg}Forcing production to true{/u}');
    }

    if (showAllLogs && !showDebugLogs) showDebugLogs = true;

    setDebugLogDisabled(!showDebugLogs);
    setIgnorePipeFactory(showAllLogs);
    //if to show only default
    setOnlyDefaultLogs(!showDebugLogs && !showAllLogs);

    //start ganache
    if (startGanache) {
        if (!fs.existsSync(cwd() + '/node_modules/ganache/'))
            throw new Error(
                'Ganache has not been installed, please type npm i ganache'
            );

        try {
            let result = await import('../app/ganache');
            await result.startGanache();
        } catch (error) {
            warning('could not start ganache: ' + error.stack);
        }
    }

    //create our Json RPC Providers
    createProviders();

    options = {
        ...(options || {}),
        ...(typeof config?.console === 'object' ? config.console : {}),
    } as InfinityMintConsoleOptions;

    //if we aren't staying open then we don't need to start express or web socket
    if (!stayOpen && startExpress) {
        warning(
            `InfinityMint is not staying open! Not starting express... add --stay-open flag!`
        );
        startExpress = false;
    }

    if (!stayOpen && startWebSocket) {
        warning(
            `InfinityMint is not staying open! Not starting web socket... add --stay-open flag!`
        );
        startWebSocket = false;
    }

    //sets the network through a flag
    let session = readGlobalSession();

    if (!options.network)
        options.network =
            yargs.argv['network'] ||
            session.environment.defaultNetwork ||
            'hardhat';

    hre.changeNetwork(options.network);

    let infinityConsole = await startInfinityConsole({
        dontDraw: true,
        scriptMode: true,
        startExpress,
        startWebSocket,
        onlyCurrentNetworkEvents,
        disableNetworkEvents,
        dontInitialize: dontInitialize,
    });

    if (!hasImportCache()) {
        console.log('\n{cyan-fg}{bold}Building Imports{/}...');

        await buildImports(
            config.settings?.imports?.supportedExtensions,
            infinityConsole
        );
    }

    console.log(
        '🧱 {cyan-fg}Current target network is ' + hre.network.name + '{/}'
    );
    console.log(
        '🧱 {cyan-fg}Current account is ' +
            (infinityConsole.getCurrentAccount()?.address || 'NULL') +
            '{/}'
    );

    if (infinityConsole.getCurrentAccount()?.address === undefined)
        warning(
            'No connection to a network, please make sure you have a network running and that you have set the correct network in your InfinityMint config file'
        );

    let scriptArguments: any = {};
    let script: InfinityMintScript;
    let yargv = await yargs.argv;
    let scriptName = yargv._?.[0]?.toString();

    if (scriptName) {
        scriptName = scriptName.replace(/_/g, ' ');
        script = infinityConsole.getScript(scriptName);
    }

    if (!script && !skipScripts) {
        //no script entry here
        let scripts = infinityConsole.getScripts();
        //filter duplicate scripts
        scripts = scripts.filter((script, index) => {
            return scripts.findIndex((s) => s.name === script.name) === index;
        });

        infinityConsole.log(
            '\n{cyan-fg}{bold}Welcome to Infinity Console{/}\n'
        );
        infinityConsole.log('{cyan-fg}InfinityMint Scripts{/}');
        scripts.forEach((script, index) => {
            infinityConsole.log(
                ` [${index}] =>\n\t{bold}{underline}${script.name}{/}\n\t` +
                    (script.description || 'No Description Available...')
            );
        });
        infinityConsole.log('\n{cyan-fg}Hardhat Tasks{/}');
        Object.keys(hre.tasks).forEach((task, index) => {
            infinityConsole.log(
                `[${index}] => \n\t{bold}{underline}hardhat:${task}{/}\n\t`
            );
        });
    } else if (!skipScripts && script) {
        if (scriptName.indexOf('hardhat:') !== -1) {
            let script = scriptName.split('hardhat:')[1];
            let argv = yargv;
            argv._ = argv._.slice(1) || [];

            infinityConsole.log(
                `\n{cyan-fg}{bold}Running hardhat task => ${script}{/}`
            );
            let taskArguments = argv._.map((arg, index) => {
                if (yargs.argv['$' + index]) return yargs.argv['$' + index];
                return arg;
            });
            infinityConsole.log(`{gray-fg}{bold}Arguments{/}\n`);
            taskArguments.forEach((arg, index) => {
                infinityConsole.log(`[${index}]  => ${arg}`);
            });
            await hre.run(script, taskArguments);

            infinityConsole.log(`\n{green-fg}{bold}Task completed{/}\n`);
        } else {
            let argv = yargv;
            argv._ = argv._.slice(1);

            if (!script)
                throw new Error(
                    `Script ${scriptName} does not exist. Please check your spelling and try again.`
                );

            if (script.arguments === undefined) script.arguments = [];

            Object.keys(argv).map((key, index) => {
                let value = argv[key] as any;

                if (!value || value.length === 0) value = true;

                if (key[0] === '_') return;
                if (key[0] === '$' && argv._.length !== 0) {
                    let index = key.split('$')[1];
                    if (index === undefined) return;
                    key = script.arguments[index].name;
                    value = argv._[parseInt(index)] || '';
                }

                if (script.arguments[key] === undefined)
                    scriptArguments[key] = {
                        ...(script.arguments[key] || {}),
                        name: key,
                        value: value,
                    };

                if (scriptArguments[key].type === 'boolean') {
                    if (value === 'true' || value === '')
                        scriptArguments[key].value = true;
                    else if (value === 'false')
                        scriptArguments[key].value = false;
                    else
                        throw new Error(
                            'Invalid value for boolean argument: ' +
                                key +
                                ' (expected true or false)'
                        );
                }

                if (scriptArguments[key].type === 'number') {
                    if (isNaN(value))
                        throw new Error(
                            'Invalid value for number argument: ' +
                                key +
                                ' (expected number)'
                        );
                    else scriptArguments[key].value = parseInt(value);
                }

                if (
                    scriptArguments[key].validator &&
                    scriptArguments[key].validator(
                        scriptArguments[key].value
                    ) === false
                )
                    throw new Error(
                        'Invalid value for argument: ' +
                            key +
                            ' (failed validator)'
                    );
            });

            Object.keys(script.arguments).forEach((key) => {
                let arg = script.arguments[key];
                if (
                    scriptArguments[arg.name] === undefined &&
                    arg.value !== undefined
                )
                    scriptArguments[arg.name] = {
                        ...arg,
                    };
            });

            //check for missing parameters
            Object.values(script.arguments).forEach((arg) => {
                if (!arg.optional && !scriptArguments[arg.name])
                    throw new Error('Missing required argument: ' + arg.name);
            });

            await executeScript(
                script,
                infinityConsole.getEventEmitter(),
                {}, //gems when we get them
                scriptArguments,
                infinityConsole,
                !options.test,
                scriptArguments['show-debug-logs']?.value ||
                    scriptArguments['show-all-logs']?.value ||
                    false
            );
        }
    }

    stayOpenMethod();
})().catch((err) => {
    blessedLog(`{red-fg}{bold}Error: ${err.message}{/}`);
    blessedLog(`{red-fg}Stack: ${err.stack}{/}`);
    process.exit(1);
});
