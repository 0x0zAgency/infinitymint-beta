(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./helpers", "./helpers", "fs", "events"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setDefaultFactory = exports.createDefaultFactory = exports.defaultFactory = exports.PipeFactory = exports.Pipe = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("./helpers");
    const helpers_2 = require("./helpers");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const events_1 = require("events");
    /**
     * The log pipe class
     */
    class Pipe {
        /**
         *
         * @param pipe
         */
        constructor(pipe) {
            this.logs = [];
            this.pipe = pipe;
            this.save = true;
            this.listen = false;
            this.errors = [];
            this.appendDate = false;
            this.created = Date.now();
            this.logHandler = (str) => {
                str = str.toString();
                if (this.listen)
                    console.log(str);
                this.logs.push({
                    message: str,
                    pure: str.replace(/[^{\}]+(?=})/g, '').replace(/\{\}/g, ''),
                    index: this.logs.length,
                    time: Date.now(),
                });
            };
            this.errorHandler = (err) => {
                this.errors.push(err);
            };
            this.terminationHandler = () => { };
        }
        toString() {
            return this.pipe;
        }
        getCreation() {
            return new Date(this.created);
        }
        log(msg) {
            msg = msg.toString();
            this.logHandler(msg);
        }
        error(err) {
            this.errorHandler(err);
        }
    }
    exports.Pipe = Pipe;
    /**
     * allows for multiple logging handles to be created to store multiple different logs instead of just one through console.log
     */
    class PipeFactory {
        constructor() {
            this.pipes = {};
            this.currentPipeKey = 'default';
            //registers the default pipe
            this.registerSimplePipe('default');
            this.emitter = new events_1.EventEmitter();
        }
        setCurrentPipe(key) {
            if (!this.pipes[key])
                throw new Error('undefined pipe key: ' + key);
            this.currentPipeKey = key;
        }
        error(error) {
            //go back to the default pipe
            if (!this.currentPipeKey || !this.pipes[this.currentPipeKey])
                this.currentPipeKey = 'default';
            this.emitter.emit(this.currentPipeKey + 'Error', error, this.currentPipeKey, this.pipes[this.currentPipeKey].errors.length);
            this.pipes[this.currentPipeKey].error(error);
            if ((0, helpers_2.isEnvTrue)('PIPE_LOG_ERRORS_TO_DEFAULT')) {
                console.log(`{red-fg}${error.message}{/}`);
                console.log(`{red-fg}${error.stack}{/}`);
            }
        }
        messageToString(msg) {
            if (typeof msg === 'string')
                return msg;
            else if (!isNaN(msg))
                return msg.toString();
            else
                return JSON.stringify(msg, null, 2);
        }
        addColoursToString(msg) {
            return msg
                .replace(/\[/g, '{yellow-fg}[')
                .replace(/\]/g, ']{/yellow-fg}')
                .replace(/\</g, '{gray-fg}<')
                .replace(/\>/g, '>{/gray-fg}')
                .replace(/\(/g, '{cyan-fg}(')
                .replace(/\)/g, '){/cyan-fg}')
                .replace(/=>/g, '{magenta-fg}=>{/magenta-fg}');
        }
        log(msg, pipe, dontHighlight) {
            let actualPipe = pipe || this.currentPipeKey;
            if (!this.pipes[actualPipe] && !this.pipes['default'])
                throw new Error('bad pipe: ' + actualPipe);
            else if (!this.pipes[actualPipe])
                return this.log(msg, 'default');
            msg = this.messageToString(msg);
            msg = dontHighlight ? msg : this.addColoursToString(msg);
            this.emitter.emit('log', msg, actualPipe, this.pipes[actualPipe].logs.length);
            this.pipes[actualPipe].log(msg);
        }
        getPipe(key) {
            return this.pipes[key];
        }
        registerSimplePipe(key, options) {
            if (this.pipes['debug'])
                this.log('creating simple pipe => (' + key + ')', 'debug');
            let pipe = this.createPipe(key, options);
            return pipe;
        }
        deletePipe(pipe) {
            if (this.pipes['debug'])
                this.log('deleting pipe => (' + pipe.toString() + ')', 'debug');
            delete this.pipes[pipe.toString()];
        }
        savePipe(pipe) {
            if (!this.pipes[pipe.toString()]) {
                if ((0, helpers_2.isEnvTrue)('THROW_ALL_ERRORS'))
                    throw new Error('invalid pipe cannot save');
                if (this.pipes['debug'])
                    (0, helpers_2.warning)('failed to delete pipe => (' + pipe.toString() + ')');
                return;
            }
            if (this.pipes['debug'])
                (0, helpers_2.debugLog)('saving pipe => (' + pipe.toString() + ')');
            fs_1.default.writeFileSync((0, helpers_2.cwd)() + '/temp/pipes/' + pipe.toString() + `.${Date.now()}.json`, JSON.stringify({
                name: pipe.toString(),
                logs: this.pipes[pipe.toString()].logs,
                errors: this.pipes[pipe.toString()].errors,
            }));
        }
        registerPipe(key, process, options) {
            var _a, _b, _c;
            let pipe = this.createPipe(key, options);
            if (this.pipes['debug'])
                this.log(`creating pipe to process ${process.pid}=> (` +
                    pipe.toString() +
                    ')', 'debug');
            (_a = process.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (str) => {
                pipe.log(str);
            });
            (_b = process.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (str) => {
                pipe.error(str);
            });
            (_c = process.stdout) === null || _c === void 0 ? void 0 : _c.on('end', (code) => {
                if (code === 1)
                    pipe.error('exited with code 1 probably error');
                pipe.log('execited with code: ' + code);
                if (options === null || options === void 0 ? void 0 : options.cleanup)
                    this.deletePipe(pipe);
            });
            return pipe;
        }
        createPipe(key, options) {
            this.pipes[key] = new Pipe(key);
            this.pipes[key].save = (options === null || options === void 0 ? void 0 : options.save) || true;
            this.pipes[key].listen = (options === null || options === void 0 ? void 0 : options.listen) || false;
            this.pipes[key].appendDate = (options === null || options === void 0 ? void 0 : options.appendDate) || true;
            if (this.currentPipeKey === '' || (options === null || options === void 0 ? void 0 : options.setAsCurrentPipe))
                this.currentPipeKey = key;
            return this.pipes[key];
        }
    }
    exports.PipeFactory = PipeFactory;
    /**
     * creates the default factory. this MUST be called in index.ts or index.js before any other code is executed
     */
    const createDefaultFactory = () => {
        if (exports.defaultFactory === undefined) {
            console.log('🛸 Creating Default Logger => ' + __filename);
            exports.defaultFactory = new PipeFactory();
        }
        (0, helpers_1.createPipes)(exports.defaultFactory);
        return exports.defaultFactory;
    };
    exports.createDefaultFactory = createDefaultFactory;
    /**
     * sets the default factory. the default factory is the one which will be used when console.log is called
     * @param newDefault
     */
    const setDefaultFactory = (newDefault) => {
        exports.defaultFactory = newDefault;
    };
    exports.setDefaultFactory = setDefaultFactory;
});
//# sourceMappingURL=pipes.js.map