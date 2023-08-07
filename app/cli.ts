import yargs from 'yargs';
import { startGanache } from './ganache';
import {
    setAllowPiping,
    executeScript,
    getConfigFile,
    getInfinityMintVersion,
    isEnvSet,
    log,
    logDirect,
    readGlobalSession,
    registerNetworkLogs,
    setDebugLogDisabled,
    setDirectlyOutputLogs,
    setExposeConsoleHostMessage,
    setOnlyDefault,
    setScriptMode,
    warning,
    setAllowExpress,
    setAllowEmojis,
} from './helpers';
import { InfinityMintConsoleOptions, InfinityMintScript } from './interfaces';
//import things we need
import { defaultFactory } from './pipes';
import { blessedToAnsi, blessedLog } from './colours';
import { startInfinityConsole, exit } from './web3';
import hre from 'hardhat';
import { expressServerInstance, hasExpress } from './express';

let config = getConfigFile();
let options: InfinityMintConsoleOptions;

(async () => {
    setAllowEmojis(true);
    setScriptMode(true);
    setAllowPiping(true);

    if (yargs.argv['start-ganache'] && yargs.argv['start-ganache'] !== 'false')
        await startGanache();

    log(
        '🧱 {magenta-fg}You are running InfinityMint {bold}' +
            getInfinityMintVersion() +
            '{/}'
    );
    Object.keys(yargs.argv).forEach((key) => {
        if (key !== '_')
            log(
                '\t{gray-fg}Argument: ' +
                    key +
                    ' => ' +
                    yargs.argv[key].toString() +
                    '{/}'
            );
    });

    let shownSomething = false;
    if (
        (yargs.argv['show-all-logs'] &&
            yargs.argv['show-all-logs'] !== 'false' &&
            (yargs.argv['show-debug-logs'] === undefined ||
                yargs.argv['show-debug-logs'] !== 'false')) ||
        (yargs.argv['show-debug-logs'] &&
            yargs.argv['show-debug-logs'] !== 'false')
    ) {
        setDebugLogDisabled(false);
        shownSomething = true;
    } else {
        setDebugLogDisabled(true);
    }

    //sets the network through a flag
    let session = readGlobalSession();

    if (yargs.argv['network'] !== undefined)
        session.environment.defaultNetwork = yargs.argv['network'];

    if (
        yargs.argv['show-all-logs'] &&
        yargs.argv['show-all-logs'] !== 'false'
    ) {
        shownSomething = true;
        setDirectlyOutputLogs(true);
    }

    //if to show only default
    setOnlyDefault(!shownSomething);

    //alow express messages
    setAllowExpress(true);

    //register current network pipes
    registerNetworkLogs();

    //refresh the current network with the new network, this fixes ganache issues
    if (session.environment.defaultNetwork !== undefined)
        try {
            hre.changeNetwork(session.environment.defaultNetwork);
        } catch (error) {
            warning(`Bad Network ${session.environment.defaultNetwork}`);
        }

    options = {
        ...(options || {}),
        ...(typeof config?.console === 'object' ? config.console : {}),
    } as InfinityMintConsoleOptions;

    let startExpressBool =
        (config.express !== undefined &&
            config.express !== false &&
            yargs.argv['start-express'] !== 'false') ||
        (yargs.argv['start-express'] &&
            yargs.argv['start-express'] !== 'false');

    if (!yargs.argv['stay-open'] || yargs.argv['stay-open'] === 'false') {
        warning(`InfinityMint is not staying open! Not starting express...`);
        startExpressBool = false;
    }

    let infinityConsole = await startInfinityConsole({
        dontDraw: true,
        scriptMode: true,
        startExpress: startExpressBool,
    });

    log('🧱 {cyan-fg}Current network is ' + hre.network.name + '{/}');
    log(
        '🧱 {cyan-fg}Current account is ' +
            (infinityConsole.getCurrentAccount()?.address || 'NULL') +
            '{/}'
    );

    if (infinityConsole.getCurrentAccount()?.address === undefined)
        warning(
            'No connection to a network, please make sure you have a network running and that you have set the correct network in your InfinityMint config file'
        );

    let scriptArguments: any = {};
    let stayOpen = () => {
        if (yargs.argv['stay-open'] && yargs.argv['stay-open'] !== 'false') {
            setDirectlyOutputLogs(true);
            log(
                `{green-fg}{underline}{bold}InfinityMint ${getInfinityMintVersion()}{/}\nInfinityMint will now keep running until you end this process`
            );

            if (
                infinityConsole.getCurrentNetwork().name === 'hardhat' &&
                !scriptArguments?.save?.value
            )
                warning(
                    'Hardhat network is not a persistent network this could mean infinitymint-client. Please be aware that InfinityMint also would not have wrote to your deployments folder. If you want to save the deployments, please use the --save flag when running your script.'
                );

            if (
                yargs.argv['start-ganache'] !== undefined &&
                yargs.argv['start-ganache'] !== 'false' &&
                (yargs.argv['hide-ganache'] === undefined ||
                    yargs.argv['hide-ganache'] === 'false')
            ) {
                log('\n{cyan-fg}Exposing Ganache...{/}');
                setExposeConsoleHostMessage(true);

                log(
                    '\t{gray-fg}Printing output from ganache node into this console!{/}\n'
                );
            }

            //check if is ts-node instance, if so wait forever
            if (process.argv[0].indexOf('ts-node') !== -1) {
                warning(`stopping exit..`);
                function wait() {
                    setTimeout(() => {
                        wait();
                    }, 1000);
                }
                wait();
            }

            if (hasExpress) {
                let routes = expressServerInstance.routes;
                log(`\n{cyan-fg}Exposing Express...{/}`);
                log(`\t{gray-fg}Printing all routes{/}\n`);

                if (routes === undefined || Object.keys(routes).length === 0)
                    warning(`No routes have been registered\n`);

                Object.keys(routes).forEach((key) => {
                    let route = routes[key];
                    logDirect(
                        `{cyan-fg}Route => {bold}${route.path || key}{/} `
                    );

                    if (route.post) logDirect(`\t{green-fg}{bold}HAS POST{/} `);

                    if (route.get) logDirect(`\t{green-fg}{bold}HAS GET{/} `);
                });
            }

            log('\n{cyan-fg}Press CTRL+C to exit{/}\n');
        } else {
            if (
                infinityConsole.getCurrentNetwork().name === 'hardhat' &&
                (!yargs.argv['save'] || yargs.argv['save'] === 'false')
            )
                warning(
                    'No changes have been saved as you are using the hardhat network. If you want to save your changes, please use the --save flag when running your script.\n'
                );

            if (!infinityConsole.hasNetworkAccess())
                warning(
                    'No valid Web3 connection was made. Please make sure you have started the chain you are trying to access and check if you have entered the right network info in the config file.'
                );

            exit();
        }
    };
    let script: InfinityMintScript;
    let scriptName = yargs.argv._[0];
    if (scriptName) {
        scriptName = scriptName.replace(/_/g, ' ');
        script = infinityConsole.getScript(scriptName);
    }

    if (!script) {
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

        stayOpen();
    } else {
        if (scriptName.indexOf('hardhat:') !== -1) {
            let script = scriptName.split('hardhat:')[1];
            let argv = yargs.argv;
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
            let argv = yargs.argv;
            argv._ = argv._.slice(1);

            if (!script)
                throw new Error(
                    `Script ${scriptName} does not exist. Please check your spelling and try again.`
                );

            if (script.arguments === undefined) script.arguments = [];

            Object.keys(argv).map((key, index) => {
                let value = argv[key];

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
                            ' (failed validator'
                    );
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
                true,
                scriptArguments['show-debug-logs']?.value ||
                    scriptArguments['show-all-logs']?.value ||
                    false
            );

            stayOpen();
        }
    }
})().catch((err) => {
    blessedLog(`{red-fg}{bold}Error: ${err.message}{/}`);
    blessedLog(`{red-fg}Stack: ${err.stack}{/}`);
    process.exit(1);
});
