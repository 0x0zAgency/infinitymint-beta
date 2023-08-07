import express, { Application, Request, Response } from 'express';
import InfinityConsole from './console';
import { getLoadedGems } from './gems';
import fs from 'fs';
import crypto from 'node:crypto';
import {
    cwd,
    debugLog,
    Dictionary,
    getConfigFile,
    getEnv,
    getExpressConfig,
    isEnvTrue,
    isInfinityMint,
    isTypescript,
    returnSafeJson,
    safeGlobCB,
    tcpPingPort,
    log,
    warning,
} from './helpers';
import { InfinityMintExpressOptions } from './interfaces';

export interface ExpressEndpoint {
    path?: string;
    fileName?: string;
    post?: (
        req: any,
        res: any,
        infinityConsole?: InfinityConsole
    ) => ReturnType;
    get?: (req: any, res: any, infinityConsole?: InfinityConsole) => ReturnType;
    init?: () => Promise<void> | void;
    middleware: {
        get: HandlerType[];
        post: HandlerType[];
    };
}

export type ReturnObject = {
    code?: number;
    data?: any;
};
export type ReturnType = Promise<ReturnObject> | ReturnObject | void;
export type HandlerType = any;

export class ExpressError extends Error {
    public message: string;
    public status: number;
    constructor(message: string, status: number = 404) {
        super(message);
        this.message = message;
        this.status = status;
    }

    public sendError(res: Response) {
        res.status(this.status).send({
            success: false,
            message: this.message,
            status: this.status,
        });
    }
}

export abstract class ExpressRoute implements ExpressEndpoint {
    public infinityConsole: InfinityConsole;
    public path: string;
    public middleware: {
        get: HandlerType[];
        post: HandlerType[];
    } = {
        get: [],
        post: [],
    };

    constructor(infinityConsole: InfinityConsole) {
        this.infinityConsole = infinityConsole;
    }

    protected registerGetMiddleware(handler: HandlerType) {
        this.middleware['get'].push(handler);
    }

    protected registerPostMiddleware(handler: HandlerType) {
        this.middleware['post'].push(handler);
    }

    public abstract init(): Promise<void> | void;
    public abstract get(req: Request, res: Response, ...any: any): ReturnType;
    public abstract post(req: Request, res: Response, ...any: any): ReturnType;
}

export class ExpressServer {
    public app: Application;
    public routes: { [key: string]: ExpressEndpoint } = {};
    public infinityConsole: InfinityConsole;
    public server: any;
    private hotreloadInterval = null;
    private fileCheckInterval = null;
    private importChecksums: any = {};

    constructor(infinityConsole: InfinityConsole) {
        this.app = express();
        this.infinityConsole = infinityConsole;
    }

    public close() {
        clearInterval(this.hotreloadInterval);
        clearInterval(this.fileCheckInterval);
        return new Promise((resolve, reject) => this.server.close(resolve));
    }

    public async start() {
        let config = getConfigFile();

        if (!config.express) {
            warning('Not starting express server :(');
        } else {
            let express = getExpressConfig();
            let port = express?.port || getEnv('EXPRESS_PORT') || 1337;

            this.server = this.app.listen(port, () => {
                log(
                    `{magenta-fg}{bold}Express Server Online{/} => http://localhost:${port}`
                );
            });

            if (express.cors) {
                if (!require.resolve('cors'))
                    throw new Error(
                        'cors package not installed, please install it with npm i cors to use cors in your express server'
                    );
                const cors = require('cors');

                //allows CORS headers to work
                this.app.use((_, res, next) => {
                    res.header(
                        'Access-Control-Allow-Headers',
                        'Origin, X-Requested-With, Content-Type, Accept'
                    );

                    next();
                });

                this.app.use(
                    cors({
                        origin:
                            express.cors && express.cors.length !== 0
                                ? express.cors
                                : '*',
                    })
                );
            } else if (
                !express.cors ||
                express.cors.length === 0 ||
                express.cors[0] === '*'
            )
                this.app.use(function (req, res, next) {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.header(
                        'Access-Control-Allow-Headers',
                        'Origin, X-Requested-With, Content-Type, Accept'
                    );
                    next();
                });

            if (express.startup) {
                log(
                    `{cyan-fg}Running express startup method from config...{/cyan-fg}`,
                    'express'
                );
                await express.startup(this);
            }
        }

        await this.load();
    }

    public async reload() {
        this.routes = {};
        await this.load();
    }

    public async load() {
        //load all the routes
        let routes = await this.findExpressEndpoints();
        let routeKeys = Object.keys(routes);

        for (let routeKey of routeKeys) {
            try {
                let route = routes[routeKey];
                this.routes[routeKey] = route;

                if (typeof route === typeof ExpressRoute)
                    route = new (route as any)(this.infinityConsole);

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
                    await route.init();
                }

                let func = async (
                    req: Request,
                    res: Response,
                    method: 'GET' | 'POST' = 'GET'
                ) => {
                    log(`Executing ${method} => ${route.path}`, 'express');
                    try {
                        let result = await route[method.toLowerCase()](
                            req,
                            res,
                            this.infinityConsole
                        );

                        if (!result) return;

                        if (result instanceof ExpressError) {
                            res.status(result.status || 500).json({
                                success: false,
                                error: {
                                    message: result.message,
                                },
                            });
                            return;
                        }

                        if (result.success === undefined) result.success = true;
                        if (typeof result === 'object')
                            return returnSafeJson(
                                res,
                                result,
                                result?.status || 200
                            );
                    } catch (error) {
                        log(
                            `{red-fg}Error executing ${method} => ` +
                                routeKey +
                                '{/}',
                            'express'
                        );
                        log(`{red-fg}${error.message}{/}`, 'express');
                        log(`{red-fg}${error.stack}{/}`, 'express');
                        this.infinityConsole.PipeFactory.pipes['express'].error(
                            error
                        );
                        res.status(500).json({
                            status: 500,
                            success: false,
                            error: {
                                message: error.message,
                                stack: error.stack,
                            },
                        });
                    }
                };

                if (route.post) {
                    log(`\tRegistered POST => ${route.path}`, 'express');
                    this.app.post(
                        route.path,
                        ...(route.middleware?.['post'] || []),
                        async (res, req) => {
                            await func(res, req, 'POST');
                        }
                    );
                }
                if (route.get) {
                    log(`\tRegistered GET => ${route.path}`, 'express');

                    this.app.get(
                        route.path,
                        ...(route.middleware?.['get'] || []),
                        async (res, req) => {
                            await func(res, req, 'GET');
                        }
                    );
                }
            } catch (error) {
                log(
                    '{red-fg}Error loading route => ' + routeKey + '{/}',
                    'express'
                );
                log(error.message, 'express');
                log(error.stack, 'express');
                this.infinityConsole.PipeFactory.pipes['express'].error(error);
            }
        }

        this.app.get('/', (req, res) => {
            //print out all the routes
            let routeKeys = Object.keys(this.routes);
            let response = ``;

            let getRoutes = routeKeys.filter((key) => {
                return this.routes[key].get;
            });

            let postRoutes = routeKeys.filter((key) => {
                return this.routes[key].post;
            });

            response += `<h1>InfinityMint API</h1>`;
            response += `<h2>GET Routes</h2>`;
            for (let routeKey of getRoutes) {
                let route = this.routes[routeKey];
                response += `👌 <a href="${route.path}">${route.path}</a><br>`;
            }
            response += `<h2>POST Routes</h2>`;
            for (let routeKey of postRoutes) {
                let route = this.routes[routeKey];
                response += `👌 <u>${route.path}</u><br>`;
            }

            res.send(response);
        });
    }

    public startHotReload() {
        log(`🔥 Hot Reloading Web2 Endpoints`, 'express');
        this.hotreloadInterval = setInterval(async () => {
            if (!this.checkImportChecksums()) {
                log(`🔥 Reloading Web2 Endpoints`, 'express');
                this.importChecksums = {};
                await this.reload();
            }
        }, 500);

        this.fileCheckInterval = setInterval(async () => {
            //check for new routes
            let routes = await this.findExpressEndpoints(false, false);
            let routeKeys = Object.keys(routes);

            for (let routeKey of routeKeys) {
                if (!this.routes[routeKey]) {
                    await this.reload();
                    break;
                }
            }

            //check for removed routes
            for (let routeKey of Object.keys(this.routes)) {
                if (
                    !routes[routeKey] ||
                    !fs.existsSync(
                        (routes[routeKey] as ExpressEndpoint).fileName
                    )
                ) {
                    log(
                        `{red-fg}{bold}Removed route{/} => ${routeKey}`,
                        'express'
                    );
                    await this.reload();
                    break;
                }
            }
        }, 4000);
    }

    public checkImportChecksums() {
        for (let key in this.routes) {
            let endpoint = this.routes[key];

            if (!endpoint.fileName || !fs.existsSync(endpoint.fileName))
                continue;

            let file = fs.readFileSync(endpoint.fileName, {
                encoding: 'utf-8',
            });
            let checksum = crypto.createHash('md5').update(file).digest('hex');

            if (!this.importChecksums[key]) {
                this.importChecksums[key] = checksum;
                continue;
            }

            if (checksum !== this.importChecksums[key]) {
                log(`Checksum changed  => ${key}`, 'express');
                return false;
            }
        }

        return true;
    }

    findExpressEndpoints = async (
        deleteCache = true,
        shouldLog = true
    ): Promise<Dictionary<ExpressEndpoint | ExpressRoute>> => {
        let expressEndpoints: any = {};
        let config = getConfigFile();
        let roots = [cwd() + '/routes/'];
        if (isInfinityMint() && !config?.dev?.useLocalDist)
            roots.push(cwd() + '/app/routes/');
        else if (config?.dev?.useLocalDist) roots.push(cwd() + '/dist/routes/');
        else roots.push(cwd() + '/node_modules/infinitymint/dist/routes/');

        let expressOptions = getExpressConfig();
        let results = await Promise.all(
            roots.map(async (root) => {
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
        flat = flat.filter(
            (file) =>
                !file.endsWith('.d.ts') && !file.endsWith('.type-extension.ts')
        );
        flat.forEach((file, index) => {
            let name = file.split('/').pop().split('.')[0];

            if (shouldLog)
                debugLog(
                    `[${index}] => Found ` + file + `<${name}> loading...`
                );

            if (
                file.indexOf('/meta/') !== -1 &&
                (isEnvTrue('PRODUCTION') || expressOptions.disableMeta)
            ) {
                if (shouldLog)
                    debugLog(
                        `\t{gray-fg}Ignoring ` +
                            file +
                            `<${name}> as meta endpoint (prod is true or disableMeta in options is true){/}`
                    );
                return;
            }

            if (require.cache[file] && deleteCache) {
                if (shouldLog)
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
                    expressEndpoints[file].path =
                        '/' + expressEndpoints[file].path;

                expressEndpoints[file].name = name;
                expressEndpoints[file].fileName = file;
            } catch (error) {
                log(
                    '{red-fg}Error loading route => ' + file + '{/}',
                    'express'
                );
                log(error.message, 'express');
                log(error.stack, 'express');
            }
        });

        return expressEndpoints;
    };
}

export const startExpressServer = async (infinityConsole: InfinityConsole) => {
    let config = getConfigFile();
    let express =
        typeof config.express === 'boolean'
            ? {}
            : (config.express as InfinityMintExpressOptions);
    let port = express?.port || getEnv('EXPRESS_PORT') || 1337;

    if (
        (await tcpPingPort('localhost', parseInt(port.toString()))).online ===
        true
    ) {
        warning(
            'express server active on port ' +
                port +
                ' please either stop it or change the port in your config file, or add flag --start-express "false"'
        );
        return;
    }

    let expressServerInstance = new ExpressServer(infinityConsole);
    await expressServerInstance.start();
    expressServerInstance.startHotReload();
    return expressServerInstance;
};
