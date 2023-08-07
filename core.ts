import hre from 'hardhat';
import InfinityConsole from './app/console';
import os from 'os';
//import things we need
import {
    isEnvTrue,
    getConfigFile,
    logDirect,
    isInfinityMint,
    warning,
    registerNetworkLogs,
    cwd,
    readGlobalSession,
    setAllowPiping,
    ovewriteConsoleMethods,
    setAllowExpress,
} from './app/helpers';
import { defaultFactory } from './app/pipes';
import { initializeInfinityMint, startInfinityConsole } from './app/web3';
import {
    InfinityMintConfig,
    InfinityMintConsoleOptions,
    InfinityMintTelnetOptions,
} from './app/interfaces';
import { TelnetServer } from './app/telnet';
import { isGanacheAlive, startGanache } from './app/ganache';
import { exit } from './app/web3';

//sqlite storage
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { requireGems } from './app/gems';
import { startExpressServer } from './app/express';

//export helpers
export * as Helpers from './app/helpers';

import yargs from 'yargs';

//error handler
let errorHandler = (error: Error) => {
    try {
        if ((console as any)._log) (console as any)._log(error);
        else console.log(error);
        Object.keys(defaultFactory.pipes || {}).forEach((pipe) => {
            try {
                defaultFactory.savePipe(pipe);
            } catch (error) {}
        });
    } catch (error) {
        process.exit(1);
    }
};

logDirect('✨ Reading InfinityMint Config');
//get the infinitymint config file and export it
export const config = getConfigFile();

//sqllite DB
export let db: Database<sqlite3.Database, sqlite3.Statement>;

/**
 * if you spawned InfinityMint through load, then this is the current infinity console instance, this will be the instance of the admin InfinityConsole if you are running through telnet
 */
let infinityConsole: InfinityConsole;
export const getInfinityConsole = (): InfinityConsole => infinityConsole;

/**
 * Starts infinitymint in the background with no UI drawing
 */
export const load = async (
    options?: InfinityMintConsoleOptions
): Promise<InfinityConsole> => {
    options = options || {};

    if (options.scriptMode && infinityConsole) return infinityConsole;

    //overwrite the console methods
    if (!isEnvTrue('PIPE_IGNORE_CONSOLE') && !options.test)
        if (
            !isEnvTrue('PIPE_IGNORE_CONSOLE') &&
            !config.telnet &&
            !options.test
        ) {
            setAllowPiping(true);

            if (!options.test) {
                ovewriteConsoleMethods();
            }
        }

    //register current network pipes
    registerNetworkLogs();

    //start ganache
    if (
        options.startGanache !== undefined
            ? options.startGanache
            : config.hardhat?.networks?.ganache !== undefined
    )
        await startGanache();
    else
        warning(
            'Ganache instance has not been initialized. No connection to ganache testnet.'
        );

    //start the seqllite DB server
    db = await open({
        filename:
            os.platform() === 'win32'
                ? 'C:\\infinitymint_database.db'
                : '/tmp/infinitymint_database.db',
        driver: sqlite3.Database,
    });

    let session = readGlobalSession();

    options = {
        ...(options || {}),
        ...(typeof config?.console === 'object' ? config.console : {}),
    } as InfinityMintConsoleOptions;

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
            'could not change default logger in node_modules: ' + error.stack
        );
    }

    //change the network to the current network, this fixes ganache issues
    if (session.environment.defaultNetwork !== undefined) {
        if (
            session.environment.defaultNetwork === 'ganache' &&
            !isGanacheAlive()
        ) {
            warning(
                `Ganache is not alive but the default network is set to ganache, changing default network to hardhat`
            );
            session.environment.defaultNetwork = 'hardhat';
        }

        hre.changeNetwork(session.environment.defaultNetwork);
    }

    //require NPM gems
    await requireGems();

    if (isEnvTrue('INFINITYMINT_CONSOLE') && options.dontDraw)
        options.dontDraw = false;

    //if we arenttelnet
    if (!config.telnet) {
        await initializeInfinityMint(
            config,
            config.hardhat?.networks?.ganache !== undefined
        );

        //do not start an InfinityConsole normally if we have nothing in config, run InfinityMint as NPM module in the back. Will not start express server
        if (config.onlyInitialize || options.onlyInitialize) {
            infinityConsole = new InfinityConsole(
                {
                    startExpress: options.startExpress
                        ? options.startExpress
                        : config.express !== undefined &&
                          config.express !== false,
                    ...(options || {}),
                    dontDraw: options.dontDraw ? options.dontDraw : true,
                },
                defaultFactory
            );
        } else
            infinityConsole = await startInfinityConsole(
                {
                    startExpress: options.startExpress
                        ? options.startExpress
                        : config.express !== undefined &&
                          config.express !== false,
                    dontDraw: options.dontDraw
                        ? options.dontDraw
                        : options.scriptMode ||
                          process.env.DONT_DRAW === 'true',
                    ...(options || {}),
                },
                defaultFactory
            );

        return infinityConsole;
    } else {
        if (
            options.startExpress ||
            (config.express !== undefined && config.express !== false)
        ) {
            setAllowExpress(true);
            await startExpressServer();
        }

        await new Promise((resolve, reject) => {
            logDirect('🔷 Starting InfinityMint Telnet Server');

            initializeInfinityMint(
                config.console as any,
                config.hardhat?.networks?.ganache !== undefined
            ).then((config: InfinityMintConfig) => {
                let port =
                    (config?.telnet as InfinityMintTelnetOptions)?.port || 1337;
                let telnet = new TelnetServer();
                telnet.start(port);
            });
        })
            .catch(errorHandler)
            .then(() => {
                logDirect('🔷 Destroying InfinityMint Telnet Server');

                //
                exit();
            });
    }
};

const infinitymint = () => {
    return infinityConsole;
};
export default infinitymint;

//load infinitymint

if (isEnvTrue('INFINITYMINT_LOAD') || yargs.argv['console'])
    load()
        .catch(errorHandler)
        .then((result: InfinityConsole) => {
            infinityConsole = result;
        });
