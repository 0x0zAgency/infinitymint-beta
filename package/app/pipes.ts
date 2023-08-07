import { ChildProcess } from 'child_process';
import { Dictionary, createPipes } from './helpers';
import { cwd, debugLog, getConfigFile, isEnvTrue, warning } from './helpers';
import fs from 'fs';
import { EventEmitter } from 'events';

/**
 * The log pipe class
 */
export class Pipe {
    public logs: {
        message: string;
        pure: string;
        time: number;
        index: number;
    }[];
    public errors: Error[];
    public listen: boolean;
    public save: boolean;
    public appendDate?: boolean;
    private pipe: string;
    private created: number;
    public logHandler: Function;
    public errorHandler: Function;
    public terminationHandler: Function;

    /**
     *
     * @param pipe
     */
    constructor(pipe: string) {
        this.logs = [];
        this.pipe = pipe;
        this.save = true;
        this.listen = false;
        this.errors = [];
        this.appendDate = false;
        this.created = Date.now();

        this.logHandler = (str: string) => {
            str = str.toString();

            if (this.listen) console.log(str);

            this.logs.push({
                message: str,
                pure: str.replace(/[^{\}]+(?=})/g, '').replace(/\{\}/g, ''),
                index: this.logs.length,
                time: Date.now(),
            });
        };
        this.errorHandler = (err: Error) => {
            this.errors.push(err);
        };
        this.terminationHandler = () => {};
    }

    toString() {
        return this.pipe;
    }

    getCreation() {
        return new Date(this.created);
    }

    log(msg: any) {
        msg = msg.toString();
        this.logHandler(msg);
    }

    error(err: Error | string) {
        this.errorHandler(err);
    }
}

/**
 * Interface for the log pipe options
 */
export interface PipeOptions {
    save?: boolean;
    listen?: boolean;
    setAsCurrentPipe?: boolean;
    appendDate?: boolean;
    cleanup?: boolean;
}

/**
 * allows for multiple logging handles to be created to store multiple different logs instead of just one through console.log
 */
export class PipeFactory {
    /**
     * the logging outputs
     */
    public pipes: Dictionary<Pipe>;
    /**
     * the pipefactory specific event emitter
     */
    public emitter: EventEmitter;
    /**
     * the current default key, default is 'default'
     */
    public currentPipeKey: string;
    constructor() {
        this.pipes = {};
        this.currentPipeKey = 'default';
        //registers the default pipe
        this.registerSimplePipe('default');
        this.emitter = new EventEmitter();
    }

    public setCurrentPipe(key: string) {
        if (!this.pipes[key]) throw new Error('undefined pipe key: ' + key);

        this.currentPipeKey = key;
    }

    public error(error: Error) {
        //go back to the default pipe
        if (!this.currentPipeKey || !this.pipes[this.currentPipeKey])
            this.currentPipeKey = 'default';

        this.emitter.emit(
            this.currentPipeKey + 'Error',
            error,
            this.currentPipeKey,
            this.pipes[this.currentPipeKey].errors.length
        );
        this.pipes[this.currentPipeKey].error(error);

        if (isEnvTrue('PIPE_LOG_ERRORS_TO_DEFAULT')) {
            console.log(`{red-fg}${error.message}{/}`);
            console.log(`{red-fg}${error.stack}{/}`);
        }
    }

    public messageToString(msg: any) {
        if (typeof msg === 'string') return msg;
        else if (!isNaN(msg)) return msg.toString();
        else return JSON.stringify(msg, null, 2);
    }

    public addColoursToString(msg: string) {
        return msg
            .replace(/\[/g, '{yellow-fg}[')
            .replace(/\]/g, ']{/yellow-fg}')
            .replace(/\</g, '{gray-fg}<')
            .replace(/\>/g, '>{/gray-fg}')
            .replace(/\(/g, '{cyan-fg}(')
            .replace(/\)/g, '){/cyan-fg}')
            .replace(/=>/g, '{magenta-fg}=>{/magenta-fg}');
    }

    public log(msg: any, pipe?: string, dontHighlight?: boolean) {
        let actualPipe = pipe || this.currentPipeKey;
        if (!this.pipes[actualPipe] && !this.pipes['default'])
            throw new Error('bad pipe: ' + actualPipe);
        else if (!this.pipes[actualPipe]) return this.log(msg, 'default');

        msg = this.messageToString(msg);
        msg = dontHighlight ? msg : this.addColoursToString(msg);

        this.emitter.emit(
            'log',
            msg,
            actualPipe,
            this.pipes[actualPipe].logs.length
        );
        this.pipes[actualPipe].log(msg);
    }

    public getPipe(key: string) {
        return this.pipes[key];
    }

    public registerSimplePipe(key: string, options?: PipeOptions): Pipe {
        if (this.pipes['debug'])
            this.log('creating simple pipe => (' + key + ')', 'debug');

        let pipe = this.createPipe(key, options);
        return pipe;
    }

    public deletePipe(pipe: string | Pipe) {
        if (this.pipes['debug'])
            this.log('deleting pipe => (' + pipe.toString() + ')', 'debug');

        delete this.pipes[pipe.toString()];
    }

    public savePipe(pipe: string | Pipe) {
        if (!this.pipes[pipe.toString()]) {
            if (isEnvTrue('THROW_ALL_ERRORS'))
                throw new Error('invalid pipe cannot save');

            if (this.pipes['debug'])
                warning('failed to delete pipe => (' + pipe.toString() + ')');

            return;
        }

        if (this.pipes['debug'])
            debugLog('saving pipe => (' + pipe.toString() + ')');

        fs.writeFileSync(
            cwd() + '/temp/pipes/' + pipe.toString() + `.${Date.now()}.json`,
            JSON.stringify({
                name: pipe.toString(),
                logs: this.pipes[pipe.toString()].logs,
                errors: this.pipes[pipe.toString()].errors,
            })
        );
    }

    public registerPipe(
        key: string,
        process: ChildProcess,
        options?: PipeOptions
    ): Pipe {
        let pipe = this.createPipe(key, options);

        if (this.pipes['debug'])
            this.log(
                `creating pipe to process ${process.pid}=> (` +
                    pipe.toString() +
                    ')',
                'debug'
            );

        process.stdout?.on('data', (str: string) => {
            pipe.log(str);
        });

        process.stderr?.on('data', (str: string) => {
            pipe.error(str);
        });

        process.stdout?.on('end', (code: number) => {
            if (code === 1) pipe.error('exited with code 1 probably error');

            pipe.log('execited with code: ' + code);
            if (options?.cleanup) this.deletePipe(pipe);
        });

        return pipe;
    }

    public createPipe(key: string, options?: PipeOptions): Pipe {
        this.pipes[key] = new Pipe(key);
        this.pipes[key].save = options?.save || true;
        this.pipes[key].listen = options?.listen || false;
        this.pipes[key].appendDate = options?.appendDate || true;

        if (this.currentPipeKey === '' || options?.setAsCurrentPipe)
            this.currentPipeKey = key;

        return this.pipes[key];
    }
}

export let defaultFactory: PipeFactory;
/**
 * creates the default factory. this MUST be called in index.ts or index.js before any other code is executed
 */
export const createDefaultFactory = () => {
    if (defaultFactory === undefined) {
        console.log('🛸 Creating Default Logger => ' + __filename);
        defaultFactory = new PipeFactory();
    }
    createPipes(defaultFactory);
    return defaultFactory;
};

/**
 * sets the default factory. the default factory is the one which will be used when console.log is called
 * @param newDefault
 */
export const setDefaultFactory = (newDefault: PipeFactory) => {
    defaultFactory = newDefault;
};
