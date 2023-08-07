import { File, Web3Storage } from 'web3.storage';
import { getConfigFile, log, tcpPingPort } from './helpers';
import { InfinityMintIPFSOptions } from './interfaces';

export class IPFS {
    private kuboAvailable: boolean;
    private web3Storage: Web3Storage;

    private favourKubo: boolean;
    private favourWeb3Storage: boolean;

    public async start() {
        let config = getConfigFile();
        log(`{cyan-fg}Starting IPFS Integration{/}`);
        log(`{gray-fg}Checking IPFS Companion app is installed...{/}`);
        if (this.isKuboAvailable()) {
            log(`\t => {underline}IPFS Kubo is available for use{/}`);
            this.kuboAvailable = true;
        }

        if ((config.ipfs as InfinityMintIPFSOptions)?.kubo?.useAlways)
            this.favourKubo = true;

        if ((config.ipfs as InfinityMintIPFSOptions)?.web3Storage?.useAlways)
            this.favourWeb3Storage = true;

        if ((config.ipfs as InfinityMintIPFSOptions)?.web3Storage?.token) {
            log(`{gray-fg}Creating Web3 Storage IPFS Controller{/}`);
            this.web3Storage = new Web3Storage({
                token: (config.ipfs as InfinityMintIPFSOptions).web3Storage
                    ?.token,
            });
            log(`\t => {underline}Web3Storage is available for use{/}`);
        }

        log(`{green-fg}{bold}IPFS Integration{/} => Enabled`);

        return this;
    }

    public async add(data: any, fileName: string) {
        if (!this.kuboAvailable && !this.web3Storage) {
            //try and fetch it via IPFS web2 endpoint
        } else if (this.kuboAvailable && !this.favourWeb3Storage) {
        } else {
            let file = new File([data], fileName);
            return await this.web3Storage.put([file]);
        }
    }

    public async uploadJson(obj: any, fileName: string = 'index.json') {
        if (typeof obj !== 'object')
            throw new Error('IPFS uploadJson only accepts objects');

        let blob = new Blob([JSON.stringify(obj)], {
            type: 'application/json', // or whatever your Content-Type is
        });

        if (!this.kuboAvailable && !this.web3Storage) {
            throw new Error('No IPFS available');
        } else if (this.kuboAvailable && !this.favourWeb3Storage) {
            throw new Error('Unsupported');
        } else {
            let file = new File([blob], fileName);
            return await this.web3Storage.put([file]);
        }
    }

    /**
     * Returns the CID as an array buffer
     * @param cid
     * @returns
     */
    public async get(cid: string) {
        if (!this.kuboAvailable && !this.web3Storage) {
            //try and fetch it via IPFS web2 endpoint
        } else if (this.kuboAvailable && !this.favourWeb3Storage) {
        } else {
            return await (await this.web3Storage.get(cid)).arrayBuffer();
        }
    }

    public async isKuboAvailable() {
        return (await tcpPingPort('localhost', 5001)).online === true;
    }
}

export const isAllowingIPFS = () => {
    let config = getConfigFile();

    if (!config.ipfs) return false;

    return (
        (config.ipfs !== undefined && (config.ipfs as boolean) === true) ||
        Object.keys(config.ipfs).length > 0
    );
};

export const getIPFSConfig = () => {
    let config = getConfigFile();
    return config.ipfs as InfinityMintIPFSOptions;
};
