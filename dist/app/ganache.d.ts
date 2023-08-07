import { Server, ServerOptions } from 'ganache';
import { JsonRpcProvider } from '@ethersproject/providers';
/**
 * ganache server
 */
export declare class GanacheServer {
    server?: Server;
    options?: ServerOptions;
    port?: number;
    provider: JsonRpcProvider;
    /**
     * stars the ganache server
     * @param options
     * @param port
     * @returns
     */
    start(options: ServerOptions, port?: number): Promise<JsonRpcProvider>;
    /**
     * creates the ganache server and returns the provider
     * @param options
     * @returns
     */
    createServer(options: ServerOptions<'ethereum'>): Promise<JsonRpcProvider>;
    stop(): Promise<void>;
    /**
     * returns the ganache provider
     * @returns
     */
    getProvider(): JsonRpcProvider;
}
/**
 * creates a default ganache server instance
 */
declare const GanacheServerInstance: GanacheServer;
/**
 * method to start ganache
 */
export declare const startGanache: () => Promise<void>;
export default GanacheServerInstance;
//# sourceMappingURL=ganache.d.ts.map