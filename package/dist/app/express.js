(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "express", "./gems", "fs", "node:crypto", "./helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.startExpressServer = exports.ExpressServer = exports.ExpressRoute = exports.ExpressError = void 0;
    const tslib_1 = require("tslib");
    const express_1 = tslib_1.__importDefault(require("express"));
    const gems_1 = require("./gems");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const node_crypto_1 = tslib_1.__importDefault(require("node:crypto"));
    const helpers_1 = require("./helpers");
    class ExpressError extends Error {
        constructor(message, status = 404) {
            super(message);
            this.message = message;
            this.status = status;
        }
        sendError(res) {
            res.status(this.status).send({
                success: false,
                message: this.message,
                status: this.status,
            });
        }
    }
    exports.ExpressError = ExpressError;
    class ExpressRoute {
        constructor(infinityConsole) {
            this.middleware = {
                get: [],
                post: [],
            };
            this.infinityConsole = infinityConsole;
        }
        registerGetMiddleware(handler) {
            this.middleware['get'].push(handler);
        }
        registerPostMiddleware(handler) {
            this.middleware['post'].push(handler);
        }
    }
    exports.ExpressRoute = ExpressRoute;
    class ExpressServer {
        constructor(infinityConsole) {
            this.routes = {};
            this.hotreloadInterval = null;
            this.fileCheckInterval = null;
            this.importChecksums = {};
            this.findExpressEndpoints = (deleteCache = true, shouldLog = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                let expressEndpoints = {};
                let config = (0, helpers_1.getConfigFile)();
                let roots = [(0, helpers_1.cwd)() + '/routes/'];
                if ((0, helpers_1.isInfinityMint)() && !((_a = config === null || config === void 0 ? void 0 : config.dev) === null || _a === void 0 ? void 0 : _a.useLocalDist))
                    roots.push((0, helpers_1.cwd)() + '/app/routes/');
                else if ((_b = config === null || config === void 0 ? void 0 : config.dev) === null || _b === void 0 ? void 0 : _b.useLocalDist)
                    roots.push((0, helpers_1.cwd)() + '/dist/routes/');
                else
                    roots.push((0, helpers_1.cwd)() + '/node_modules/infinitymint/dist/routes/');
                let expressOptions = (0, helpers_1.getExpressConfig)();
                let results = yield Promise.all(roots.map((root) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    let ts = (0, helpers_1.isTypescript)() || !expressOptions.disableTypescript
                        ? yield new Promise((resolve, reject) => {
                            (0, helpers_1.safeGlobCB)(root + '**/*.ts', (err, files) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(files);
                            });
                        })
                        : [];
                    let js = yield new Promise((resolve, reject) => {
                        (0, helpers_1.safeGlobCB)(root + '**/*.js', (err, files) => {
                            if (err)
                                reject(err);
                            else
                                resolve(files);
                        });
                    });
                    return [...ts, ...js];
                })));
                let flat = results.flat();
                //also include gem custom elements
                flat = [
                    ...flat,
                    ...Object.values((0, gems_1.getLoadedGems)())
                        .map((x) => x.routes)
                        .flat(),
                ];
                flat = flat.filter((file) => !file.endsWith('.d.ts') && !file.endsWith('.type-extension.ts'));
                flat.forEach((file, index) => {
                    let name = file.split('/').pop().split('.')[0];
                    if (shouldLog)
                        (0, helpers_1.debugLog)(`[${index}] => Found ` + file + `<${name}> loading...`);
                    if (file.indexOf('/meta/') !== -1 &&
                        ((0, helpers_1.isEnvTrue)('PRODUCTION') || expressOptions.disableMeta)) {
                        if (shouldLog)
                            (0, helpers_1.debugLog)(`\t{gray-fg}Ignoring ` +
                                file +
                                `<${name}> as meta endpoint (prod is true or disableMeta in options is true){/}`);
                        return;
                    }
                    if (require.cache[file] && deleteCache) {
                        if (shouldLog)
                            (0, helpers_1.debugLog)(`\t{gray-fg}Found ` +
                                file +
                                `<${name}> in cache, deleting...{/}`);
                        delete require.cache[file];
                    }
                    try {
                        expressEndpoints[file] = require(file);
                        expressEndpoints[file] =
                            expressEndpoints[file].default || expressEndpoints[file];
                        if (!expressEndpoints[file].path)
                            expressEndpoints[file].path = file
                                .replace((0, helpers_1.cwd)(), '')
                                .split('/routes/')[1]
                                .split('.')[0];
                        if (expressEndpoints[file].path[0] !== '/')
                            expressEndpoints[file].path =
                                '/' + expressEndpoints[file].path;
                        expressEndpoints[file].name = name;
                        expressEndpoints[file].fileName = file;
                    }
                    catch (error) {
                        (0, helpers_1.log)('{red-fg}Error loading route => ' + file + '{/}', 'express');
                        (0, helpers_1.log)(error.message, 'express');
                        (0, helpers_1.log)(error.stack, 'express');
                    }
                });
                return expressEndpoints;
            });
            this.app = (0, express_1.default)();
            this.infinityConsole = infinityConsole;
        }
        close() {
            clearInterval(this.hotreloadInterval);
            clearInterval(this.fileCheckInterval);
            return new Promise((resolve, reject) => this.server.close(resolve));
        }
        start() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let config = (0, helpers_1.getConfigFile)();
                if (!config.express) {
                    (0, helpers_1.warning)('Not starting express server :(');
                }
                else {
                    let express = (0, helpers_1.getExpressConfig)();
                    let port = (express === null || express === void 0 ? void 0 : express.port) || (0, helpers_1.getEnv)('EXPRESS_PORT') || 1337;
                    this.server = this.app.listen(port, () => {
                        (0, helpers_1.log)(`{magenta-fg}{bold}Express Server Online{/} => http://localhost:${port}`);
                    });
                    if (express.cors) {
                        if (!require.resolve('cors'))
                            throw new Error('cors package not installed, please install it with npm i cors to use cors in your express server');
                        const cors = require('cors');
                        //allows CORS headers to work
                        this.app.use((_, res, next) => {
                            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                            next();
                        });
                        this.app.use(cors({
                            origin: express.cors && express.cors.length !== 0
                                ? express.cors
                                : '*',
                        }));
                    }
                    else if (!express.cors ||
                        express.cors.length === 0 ||
                        express.cors[0] === '*')
                        this.app.use(function (req, res, next) {
                            res.header('Access-Control-Allow-Origin', '*');
                            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                            next();
                        });
                    if (express.startup) {
                        (0, helpers_1.log)(`{cyan-fg}Running express startup method from config...{/cyan-fg}`, 'express');
                        yield express.startup(this);
                    }
                }
                yield this.load();
            });
        }
        reload() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.routes = {};
                yield this.load();
            });
        }
        load() {
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                //load all the routes
                let routes = yield this.findExpressEndpoints();
                let routeKeys = Object.keys(routes);
                for (let routeKey of routeKeys) {
                    try {
                        let route = routes[routeKey];
                        this.routes[routeKey] = route;
                        if (typeof route === typeof ExpressRoute)
                            route = new route(this.infinityConsole);
                        (0, helpers_1.log)('{cyan-fg}{bold}Regitering route{/} => ' + routeKey, 'express');
                        if ((_b = (_a = this.app) === null || _a === void 0 ? void 0 : _a._router) === null || _b === void 0 ? void 0 : _b.stack)
                            this.app._router.stack = (_d = (_c = this.app._router) === null || _c === void 0 ? void 0 : _c.stack) === null || _d === void 0 ? void 0 : _d.filter((stack) => {
                                var _a;
                                return ((_a = stack === null || stack === void 0 ? void 0 : stack.route) === null || _a === void 0 ? void 0 : _a.path) !== route.path;
                            });
                        if (route.init) {
                            (0, helpers_1.log)(`\tRunning init => ${route.path}`, 'express');
                            yield route.init();
                        }
                        let func = (req, res, method = 'GET') => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            (0, helpers_1.log)(`Executing ${method} => ${route.path}`, 'express');
                            try {
                                let result = yield route[method.toLowerCase()](req, res, this.infinityConsole);
                                if (!result)
                                    return;
                                if (result instanceof ExpressError) {
                                    res.status(result.status || 500).json({
                                        success: false,
                                        error: {
                                            message: result.message,
                                        },
                                    });
                                    return;
                                }
                                if (result.success === undefined)
                                    result.success = true;
                                if (typeof result === 'object')
                                    return (0, helpers_1.returnSafeJson)(res, result, (result === null || result === void 0 ? void 0 : result.status) || 200);
                            }
                            catch (error) {
                                (0, helpers_1.log)(`{red-fg}Error executing ${method} => ` +
                                    routeKey +
                                    '{/}', 'express');
                                (0, helpers_1.log)(`{red-fg}${error.message}{/}`, 'express');
                                (0, helpers_1.log)(`{red-fg}${error.stack}{/}`, 'express');
                                this.infinityConsole.PipeFactory.pipes['express'].error(error);
                                res.status(500).json({
                                    status: 500,
                                    success: false,
                                    error: {
                                        message: error.message,
                                        stack: error.stack,
                                    },
                                });
                            }
                        });
                        if (route.post) {
                            (0, helpers_1.log)(`\tRegistered POST => ${route.path}`, 'express');
                            this.app.post(route.path, ...(((_e = route.middleware) === null || _e === void 0 ? void 0 : _e['post']) || []), (res, req) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                yield func(res, req, 'POST');
                            }));
                        }
                        if (route.get) {
                            (0, helpers_1.log)(`\tRegistered GET => ${route.path}`, 'express');
                            this.app.get(route.path, ...(((_f = route.middleware) === null || _f === void 0 ? void 0 : _f['get']) || []), (res, req) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                yield func(res, req, 'GET');
                            }));
                        }
                    }
                    catch (error) {
                        (0, helpers_1.log)('{red-fg}Error loading route => ' + routeKey + '{/}', 'express');
                        (0, helpers_1.log)(error.message, 'express');
                        (0, helpers_1.log)(error.stack, 'express');
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
            });
        }
        startHotReload() {
            (0, helpers_1.log)(`🔥 Hot Reloading Web2 Endpoints`, 'express');
            this.hotreloadInterval = setInterval(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!this.checkImportChecksums()) {
                    (0, helpers_1.log)(`🔥 Reloading Web2 Endpoints`, 'express');
                    this.importChecksums = {};
                    yield this.reload();
                }
            }), 500);
            this.fileCheckInterval = setInterval(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                //check for new routes
                let routes = yield this.findExpressEndpoints(false, false);
                let routeKeys = Object.keys(routes);
                for (let routeKey of routeKeys) {
                    if (!this.routes[routeKey]) {
                        yield this.reload();
                        break;
                    }
                }
                //check for removed routes
                for (let routeKey of Object.keys(this.routes)) {
                    if (!routes[routeKey] ||
                        !fs_1.default.existsSync(routes[routeKey].fileName)) {
                        (0, helpers_1.log)(`{red-fg}{bold}Removed route{/} => ${routeKey}`, 'express');
                        yield this.reload();
                        break;
                    }
                }
            }), 4000);
        }
        checkImportChecksums() {
            for (let key in this.routes) {
                let endpoint = this.routes[key];
                if (!endpoint.fileName || !fs_1.default.existsSync(endpoint.fileName))
                    continue;
                let file = fs_1.default.readFileSync(endpoint.fileName, {
                    encoding: 'utf-8',
                });
                let checksum = node_crypto_1.default.createHash('md5').update(file).digest('hex');
                if (!this.importChecksums[key]) {
                    this.importChecksums[key] = checksum;
                    continue;
                }
                if (checksum !== this.importChecksums[key]) {
                    (0, helpers_1.log)(`Checksum changed  => ${key}`, 'express');
                    return false;
                }
            }
            return true;
        }
    }
    exports.ExpressServer = ExpressServer;
    const startExpressServer = (infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let config = (0, helpers_1.getConfigFile)();
        let express = typeof config.express === 'boolean'
            ? {}
            : config.express;
        let port = (express === null || express === void 0 ? void 0 : express.port) || (0, helpers_1.getEnv)('EXPRESS_PORT') || 1337;
        if ((yield (0, helpers_1.tcpPingPort)('localhost', parseInt(port.toString()))).online ===
            true) {
            (0, helpers_1.warning)('express server active on port ' +
                port +
                ' please either stop it or change the port in your config file, or add flag --start-express "false"');
            return;
        }
        let expressServerInstance = new ExpressServer(infinityConsole);
        yield expressServerInstance.start();
        expressServerInstance.startHotReload();
        return expressServerInstance;
    });
    exports.startExpressServer = startExpressServer;
});
//# sourceMappingURL=express.js.map