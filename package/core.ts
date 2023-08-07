import hre from 'hardhat';
import InfinityConsole from './app/console';
import os from 'os';
//import things we need
import {
    isEnvTrue,
    getConfigFile,
    isInfinityMint,
    warning,
    createNetworkPipes,
    cwd,
    readGlobalSession,
    isGanacheAlive,
    saveGlobalSessionFile,
} from './app/helpers';
import { defaultFactory } from './app/pipes';
import { createProviders, startInfinityConsole } from './app/web3';
import {
    InfinityMintConsoleOptions,
    InfinityMintTelnetOptions,
} from './app/interfaces';
import { TelnetServer } from './app/telnet';
import { requireGems } from './app/gems';
import yargs from 'yargs';
import './infinitymint-types/index';

//error handler
let errorHandler = (error: Error) => {
    try {
        if ((console as any)._log)
            console.log = (console as any)._log.bind(console);

        if ((console as any)._error)
            console.error = (console as any)._error.bind(console);

        console.log('INFINITYMINT DIED!\n');
        console.log(error.message);
        console.log(error.stack);
        Object.keys(defaultFactory.pipes || {}).forEach((pipe) => {
            try {
                defaultFactory.savePipe(pipe);
            } catch (error) {
                console.log(error.stack);
            }
        });
    } catch (error) {
        process.exit(1);
    }
};

console.log('✨ Reading InfinityMint Config');
//get the infinitymint config file and export it
export let config = getConfigFile();

/**
 * if you spawned InfinityMint through load, then this is the current infinity console instance, this will be the instance of the admin InfinityConsole if you are running through telnet
 */
let infinityConsole: InfinityConsole;
export const getInfinityConsole = (): InfinityConsole => infinityConsole;

/**
 * Starts InfinityMint
 * @param options
 * @returns
 */
export const load = async (
    options?: InfinityMintConsoleOptions
): Promise<InfinityConsole> => {
    //reload config
    config = getConfigFile(true);
    //overwrite the console methods and pipe if test or dontPipe is fals

    options = options || {};

    if ((options.scriptMode || options.test) && infinityConsole)
        return infinityConsole;

    if (options.test) {
        warning('script mode is enabled in test mode');
        options.scriptMode = true;
    }

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
            'could not link link dist to current default pipe. Dist is probably not present or no infinitymint package is present'
        );
    }

    //register current network pipes
    createNetworkPipes();

    let session = readGlobalSession();

    options = {
        ...(options || {}),
        ...(typeof config?.console === 'object' ? config.console : {}),
    } as InfinityMintConsoleOptions;

    if (session.environment.defaultNetwork === 'ganache' && !isGanacheAlive()) {
        warning(
            `Ganache is not alive but the default network is set to ganache, changing default network to hardhat`
        );
        session.environment.defaultNetwork = 'hardhat';
        saveGlobalSessionFile(session);
    }

    try {
        if (
            isEnvTrue('GANACHE_AUTORUN') &&
            !isEnvTrue('GANACHE_EXTERNAL') &&
            config.hardhat?.networks?.ganache
        ) {
            let result = await import('./app/ganache');
            await result.startGanache();
        }
    } catch (error) {
        warning('could not start ganache: ' + error.stack);
    }

    //require NPM gems
    await requireGems();

    let network =
        options.network || session.environment.defaultNetwork || 'hardhat';

    if (!config.hardhat?.networks[network]) {
        warning(
            `Network ${network} is not defined in your hardhat config, please add it`
        );

        network = 'hardhat';
    }
    //set default ethers provider
    hre.changeNetwork(network);
    //create networks
    createProviders();

    console.log(
        '🧱 Current target network => {cyan-fg}{bold}' + network + '{/}'
    );

    if (isEnvTrue('INFINITYMINT_CONSOLE') && options.dontDraw)
        options.dontDraw = false;

    if (!config.express) config.express = {} as any;

    //if we arenttelnet
    if (!config.telnet) {
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
                    startWebSocket: options.startWebSocket
                        ? options.startWebSocket
                        : (config.express as any)?.sockets !== undefined &&
                          (config.express as any)?.sockets !== false,
                    dontDraw: options.dontDraw
                        ? options.dontDraw
                        : options.scriptMode ||
                          process.env.DONT_DRAW === 'true' ||
                          options.test,
                    ...(options || {}),
                },
                defaultFactory
            );

        return infinityConsole;
    } else {
        await new Promise((resolve, reject) => {
            console.log('🔷 Starting InfinityMint Telnet Server');

            let port =
                (config?.telnet as InfinityMintTelnetOptions)?.port || 1337;
            let telnet = new TelnetServer();

            telnet.start(port);
        })
            .catch(errorHandler)
            .then(() => {
                console.log('🔷 Destroying InfinityMint Telnet Server');
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
