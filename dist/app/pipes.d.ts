/// <reference types="node" />
/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { Dictionary } from './helpers';
import { EventEmitter } from 'events';
/**
 * The log pipe class
 */
export declare class Pipe {
    logs: {
        message: string;
        pure: string;
        time: number;
        index: number;
    }[];
    errors: Error[];
    listen: boolean;
    save: boolean;
    appendDate?: boolean;
    private pipe;
    private created;
    logHandler: Function;
    errorHandler: Function;
    terminationHandler: Function;
    /**
     *
     * @param pipe
     */
    constructor(pipe: string);
    toString(): string;
    getCreation(): Date;
    log(msg: any): void;
    error(err: Error | string): void;
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
export declare class PipeFactory {
    /**
     * the logging outputs
     */
    pipes: Dictionary<Pipe>;
    /**
     * the pipefactory specific event emitter
     */
    emitter: EventEmitter;
    /**
     * the current default key, default is 'default'
     */
    currentPipeKey: string;
    constructor();
    setCurrentPipe(key: string): void;
    error(error: Error): void;
    messageToString(msg: any): any;
    addColoursToString(msg: string): string;
    log(msg: any, pipe?: string, dontHighlight?: boolean): any;
    getPipe(key: string): Pipe;
    registerSimplePipe(key: string, options?: PipeOptions): Pipe;
    deletePipe(pipe: string | Pipe): void;
    savePipe(pipe: string | Pipe): void;
    registerPipe(key: string, process: ChildProcess, options?: PipeOptions): Pipe;
    createPipe(key: string, options?: PipeOptions): Pipe;
}
export declare let defaultFactory: PipeFactory;
/**
 * creates the default factory. this MUST be called in index.ts or index.js before any other code is executed
 */
export declare const createDefaultFactory: () => PipeFactory;
/**
 * sets the default factory. the default factory is the one which will be used when console.log is called
 * @param newDefault
 */
export declare const setDefaultFactory: (newDefault: PipeFactory) => void;
//# sourceMappingURL=pipes.d.ts.map