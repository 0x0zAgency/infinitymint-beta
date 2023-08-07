import express, { Application, Request, Response } from 'express';
import { glob } from 'glob';
import InfinityConsole from './console';
import { getLoadedGems } from './gems';
import fs from 'fs';
import crypto from 'crypto';
import {
    cwd,
    debugLog,
    Dictionary,
    getConfigFile,
    getEnv,
    getExpressConfig,
    isEnvSet,
    isInfinityMint,
    isTypescript,
    log,
    logDirect,
    safeGlobCB,
    setAllowPiping,
    warning,
} from './helpers';
import { InfinityMintExpressOptions } from './interfaces';
//used to ping stuff to see if its online
const { tcpPingPort } = require('tcp-ping-port');

export interface ExpressEndpoint {
    path?: string;
    post?: (console: InfinityConsole, req: any, res: any) => Promise<void>;
    get?: (console: InfinityConsole, req: any, res: any) => Promise<void>;
    init?: (console: InfinityConsole, server: ExpressServer) => Promise<void>;
}

export let expressServerInstance: ExpressServer;
export let hasExpress = false;
export let importChecksums = {};

export const getExpressServerInstance = () => {
    return expressServerInstance;
};

export const closeExpressServer = async () => {
    return new Promise((resolve, reject) => {
        if (expressServerInstance) {
            expressServerInstance.server.close(resolve);
            expressServerInstance = undefined;
        }
    });
};

export const startExpressServer = async () => {
    let config = getConfigFile();
    let express =
        typeof config.express === 'boolean'
            ? {}
            : (config.express as InfinityMintExpressOptions);
    let port = express?.port || getEnv('EXPRESS_PORT') || 1337;

    if ((await tcpPingPort('localhost', port)).online === true) {
        warning(
            'express server active on port ' +
                port +
                ' please either stop it or change the port in your config file, or add flag --start-express "false"'
        );
        return;
    }

    if (expressServerInstance) {
        warning('express already started');
        return;
    }

    expressServerInstance = new ExpressServer();
    await expressServerInstance.start();
    log(
        `{green-fg}{bold}InfinityMint API Online{/} => http://localhost:${port}`
    );
};

export class ExpressServer {
    public app: Application;
    public routes: { [key: string]: ExpressEndpoint } = {};
    public infinityConsole: InfinityConsole;
    public server: any;

    constructor() {
        this.app = express();
    }

    public async start() {
        let config = getConfigFile();

        if (!config.express) {
            warning('Not starting express server :(');
        } else {
            let express =
                typeof config.express === 'boolean'
                    ? {}
                    : (config.express as InfinityMintExpressOptions);

            let port = express?.port || getEnv('EXPRESS_PORT') || 1337;
            this.server = this.app.listen(port, () => {
                log(
                    `{green-fg}{bold}Express server listening on port ${port}{/}`,
                    'express'
                );
            });

            if (express.startup) {
                log(
                    `{cyan-fg}Running express startup method from config...{/cyan-fg}`,
                    'express'
                );
                await express.startup(this);
            }

            hasExpress = true;
        }
    }

    public async reload() {
        this.routes = {};
        await this.load(this.infinityConsole);
    }

    public async load(infinityConsole?: InfinityConsole) {
        //load all the routes
        let routes = await findExpressEndpoints();
        let routeKeys = Object.keys(routes);
        this.infinityConsole = infinityConsole;
        for (let routeKey of routeKeys) {
            try {
                let route = routes[routeKey];
                this.routes[routeKey] = route;

                log(
                    '{cyan-fg}{bold}Regitering route{/} => ' + routeKey,
                    'express'
                );

                if (this.app?._router?.stack)
                    this.app._router.stack = this.app._router?.stack?.filter(
                        (stack) => {
                            return stack?.route?.path !== route.path;
                        }
                    );

                if (route.init) {
                    log(`\tRunning init => ${route.path}`, 'express');
                    await route.init(infinityConsole, this);
                }

                if (route.post) {
                    log(`\tRegistered POST => ${route.path}`, 'express');
                    this.app.post(route.path, async (req, res) => {
                        log(`Executing POST => ${route.path}`, 'express');

                        try {
                            await route.post(infinityConsole, req, res);
                        } catch (error) {
                            log(
                                '{red-fg}Error executing POST => ' +
                                    routeKey +
                                    '{/}',
                                'express'
                            );
                            log(`{red-fg}${error.message}{/}`, 'express');
                            log(`{red-fg}${error.stack}{/}`, 'express');
                            this.infinityConsole
                                .getConsoleLogs()
                                .pipes['express'].error(error);
                            res.status(500).json({
                                error: {
                                    message: error.message,
                                    stack: error.stack,
                                },
                            });
                        }
                    });
                }
                if (route.get) {
                    log(`\tRegistered GET => ${route.path}`, 'express');

                    this.app.get(route.path, async (req, res) => {
                        log(`Executing GET => ${route.path}`, 'express');
                        try {
                            await route.get(infinityConsole, req, res);
                        } catch (error) {
                            log(
                                '{red-fg}Error executing GET => ' +
                                    routeKey +
                                    '{/}',
                                'express'
                            );
                            log(`{red-fg}${error.message}{/}`, 'express');
                            log(`{red-fg}${error.stack}{/}`, 'express');
                            this.infinityConsole
                                .getConsoleLogs()
                                .pipes['express'].error(error);
                            res.status(500).json({
                                error: {
                                    message: error.message,
                                    stack: error.stack,
                                },
                            });
                        }
                    });
                }
            } catch (error) {
                log(
                    '{red-fg}Error loading route => ' + routeKey + '{/}',
                    'express'
                );
                log(error.message, 'express');
                log(error.stack, 'express');
                this.infinityConsole
                    .getConsoleLogs()
                    .pipes['express'].error(error);
            }
        }
    }
}
let expressEndpoints: any = {};

export const checkImportChecksums = () => {
    for (let key in expressEndpoints) {
        let endpoint = expressEndpoints[key];

        if (!endpoint.fileName || !fs.existsSync(endpoint.fileName)) continue;

        let file = fs.readFileSync(endpoint.fileName, {
            encoding: 'utf-8',
        });
        let checksum = crypto.createHash('md5').update(file).digest('hex');

        if (!importChecksums[key]) {
            importChecksums[key] = checksum;
            continue;
        }

        if (checksum !== importChecksums[key]) {
            log(`Checksum changed for ${key}`, 'express');
            return false;
        }
    }

    return true;
};

//will reload currently opened express endpoints
export const startHotReloadLoop = () => {
    log(`🔥 Hot Reloading Web2 Endpoints`, 'express');
    let interval = setInterval(async () => {
        if (!checkImportChecksums()) {
            log(`🔥 Reloading Web2 Endpoints`, 'express');
            importChecksums = {};
            await expressServerInstance.reload();
        }
    }, 500);
};

export const findExpressEndpoints = async (): Promise<
    Dictionary<ExpressEndpoint>
> => {
    let config = getConfigFile();
    let roots = [cwd() + '/routes/'];
    if (isInfinityMint() && !config?.dev?.useLocalDist)
        roots.push(cwd() + '/app/routes/');
    else if (config?.dev?.useLocalDist) roots.push(cwd() + '/dist/routes/');
    else roots.push(cwd() + '/node_modules/infinitymint/dist/routes/');

    let expressOptions = getExpressConfig();
    let results = await Promise.all(
        roots.map(async (root) => {
            debugLog('Searching for express routes => ' + root);
            let ts =
                isTypescript() || !expressOptions.disableTypescript
                    ? await new Promise<string[]>((resolve, reject) => {
                          safeGlobCB(root + '**/*.ts', (err, files) => {
                              if (err) reject(err);
                              else resolve(files);
                          });
                      })
                    : [];
            let js = await new Promise<string[]>((resolve, reject) => {
                safeGlobCB(root + '**/*.js', (err, files) => {
                    if (err) reject(err);
                    else resolve(files);
                });
            });

            return [...ts, ...js];
        })
    );

    let flat = results.flat();
    //also include gem custom elements
    flat = [
        ...flat,
        ...Object.values(getLoadedGems())
            .map((x) => x.routes)
            .flat(),
    ];
    flat = flat.filter((file) => !file.endsWith('.d.ts'));
    flat.forEach((file, index) => {
        let name = file.split('/').pop().split('.')[0];
        debugLog(`[${index}] => Found ` + file + `<${name}> loading...`);

        if (require.cache[file]) {
            debugLog(
                `\t{gray-fg}Found ` +
                    file +
                    `<${name}> in cache, deleting...{/}`
            );
            delete require.cache[file];
        }

        try {
            expressEndpoints[file] = require(file);
            expressEndpoints[file] =
                expressEndpoints[file].default || expressEndpoints[file];

            if (!expressEndpoints[file].path)
                expressEndpoints[file].path = file
                    .replace(cwd(), '')
                    .split('/routes/')[1]
                    .split('.')[0];

            if (expressEndpoints[file].path[0] !== '/')
                expressEndpoints[file].path = '/' + expressEndpoints[file].path;

            expressEndpoints[file].name = name;
            expressEndpoints[file].fileName = file;
        } catch (error) {
            log('{red-fg}Error loading route => ' + file + '{/}', 'express');
            log(error.message, 'express');
            log(error.stack, 'express');
        }
    });

    return expressEndpoints;
};
