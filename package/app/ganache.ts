import ganache, { Server, ServerOptions } from 'ganache';
import { JsonRpcProvider } from '@ethersproject/providers';
import {
    debugLog,
    getConfigFile,
    isGanacheAlive,
    readGlobalSession,
    saveGlobalSessionFile,
} from './helpers';
import { getPrivateKeys } from './web3';
import { defaultFactory } from './pipes';

/**
 * ganache server
 */
export class GanacheServer {
    public server?: Server;
    public options?: ServerOptions;
    public port?: number;
    public provider: JsonRpcProvider;

    /**
     * stars the ganache server
     * @param options
     * @param port
     * @returns
     */
    async start(
        options: ServerOptions,
        port?: number
    ): Promise<JsonRpcProvider> {
        this.options = options;

        this.port = parseInt(
            (port || process.env.GANACHE_PORT || 8545).toString()
        );

        if (await isGanacheAlive(this.port)) {
            console.log(
                '{cyan-fg}{bold}Previous Ganache Server{/bold}{/cyan-fg} => http://localhost:' +
                    this.port
            );
            this.provider = new JsonRpcProvider(
                'https://localhost:' + this.port
            ) as any;
            return this.provider;
        }

        return await this.createServer(options);
    }

    /**
     * creates the ganache server and returns the provider
     * @param options
     * @returns
     */
    async createServer(
        options: ServerOptions<'ethereum'>
    ): Promise<JsonRpcProvider> {
        await new Promise((resolve, reject) => {
            //make sure to set
            if (!(options as any).wallet)
                (options as any).wallet = {
                    totalAccounts: 20,
                    defaultBalance: 69420,
                };

            //make sure to set default balance
            if (
                !(options as any)?.wallet.defaultBalance ||
                (options as any)?.wallet.defaultBalance <= 0
            )
                (options as any).wallet.defaultBalance = 69420;

            this.server = ganache.server(options);
            this.server.debug.enabled = false;
            this.server.listen(this.port, async (err: any) => {
                if (err) throw err;
                console.log(
                    '{green-fg}{bold}Ganache Online{/bold}{/green-fg} => http://localhost:' +
                        this.port
                );

                resolve(true);
            });
        });

        this.provider = new JsonRpcProvider(
            'http://localhost:' + this.port
        ) as any;
        return this.provider;
    }

    async stop() {
        if (this.server) {
            await this.server.close();
            this.server = undefined;
        }
    }

    /**
     * returns the ganache provider
     * @returns
     */
    getProvider() {
        if (this.provider == undefined)
            throw new Error('invalid ethers provider');
        return this.provider;
    }
}

/**
 * creates a default ganache server instance
 */
const GanacheServerInstance = new GanacheServer();

/**
 * method to start ganache
 */
export const startGanache = async () => {
    let session = readGlobalSession();
    let config = getConfigFile();
    //ask if they want to start ganache
    //start ganache here
    let obj = { ...config.ganache } as any;
    if (!obj.wallet) obj.wallet = {};
    if (!session.environment.ganacheMnemonic)
        throw new Error('no ganache mnemonic');

    obj.wallet.mnemonic = session.environment.ganacheMnemonic;
    saveGlobalSessionFile(session);
    debugLog('starting ganache with menomic of: ' + obj.wallet.mnemonic);

    //get private keys and save them to file
    let keys = getPrivateKeys(session.environment.ganacheMnemonic);
    debugLog(
        'found ' +
            keys.length +
            ' private keys for mnemonic: ' +
            session.environment.ganacheMnemonic
    );
    keys.forEach((key, index) => {
        debugLog(`[${index}] => ${key}`);
    });
    session.environment.ganachePrivateKeys = keys;
    saveGlobalSessionFile(session);

    //overwrite console.log so ganache instance uses another one which logs to the right pipe
    let _tempConsoleLog = console.log;
    console.log = (...msgs: string[]) => {
        defaultFactory.log(msgs.join('\n'), 'localhost');
    };
    await GanacheServerInstance.start(config.ganache || {});
    console.log = _tempConsoleLog;
};

export default GanacheServerInstance;
