import {
    InfinityMintConfig,
    InfinityMintExpressOptions,
} from 'infinitymint/dist/app/interfaces';
import {
    getConfigFile,
    readGlobalSession,
} from 'infinitymint/dist/app/helpers';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';

//the session
let session = readGlobalSession();
//please visit docs.infinitymint.app
const config: InfinityMintConfig = {
    console: {
        blessed: {
            fullUnicode: true,
        },
    },
    ipfs: true,
    express: {
        port: 1337,
        cors: ['https://localhost:1337', 'http://localhost:1337'],
        startup: async (server) => {
            let app = server.app;
            let config: InfinityMintExpressOptions;

            if (
                getConfigFile().express !== undefined &&
                typeof getConfigFile().express !== 'boolean'
            )
                config = getConfigFile().express as InfinityMintExpressOptions;
            else config = {};

            //helmet
            app.use(helmet());

            //allows CORS headers to work
            app.use((_, res, next) => {
                res.header(
                    'Access-Control-Allow-Headers',
                    'Origin, X-Requested-With, Content-Type, Accept'
                );
                next();
            });

            //the json body parser
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(
                cors({
                    origin:
                        config.cors && config.cors.length !== 0
                            ? config.cors
                            : '*',
                })
            );
        },
    },
    hardhat: {
        solidity: {
            version: '0.8.12',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 20,
                },
            },
        },
        networks: {
            hardhat: {},
            localhost: {
                url: 'http://127.0.0.1:1998',
            },
            ganache: {
                url: 'http://127.0.0.1:8545',
                accounts: {
                    mnemonic: session.environment?.ganacheMnemonic,
                },
            },
            ethereum: {
                url: 'https://mainnet.infura.io/v3/ef00c000f793483bbf8506235ba4439b',
                accounts: {
                    mnemonic:
                        process.env.DEFAULT_WALLET_MNEMONIC ||
                        session.environment?.ganacheMnemonic,
                },
            },
            goerli: {
                url: 'https://goerli.infura.io/v3/b893dc62f7a742198d70ba203081ae37',
                accounts: {
                    mnemonic:
                        process.env.DEFAULT_WALLET_MNEMONIC ||
                        session.environment?.ganacheMnemonic,
                },
            },
            polygon: {
                url: 'https://polygon-rpc.com',
                accounts: {
                    mnemonic:
                        process.env.DEFAULT_WALLET_MNEMONIC ||
                        session.environment?.ganacheMnemonic,
                },
            },
            mumbai: {
                url: 'https://matic-mumbai.chainstacklabs.com',
                accounts: {
                    mnemonic:
                        process.env.DEFAULT_WALLET_MNEMONIC ||
                        session.environment?.ganacheMnemonic,
                },
            },
        },
        paths: {
            tests: './tests',
        },
    },
    ganache: {
        chain: {
            chainId: 1337,
        },
        wallet: {
            totalAccounts: 20,
            defaultBalance: 69420,
        },
    },
    roots: ['../infinitymint-buildtools/'],
    settings: {
        networks: {
            hardhat: {
                defaultAccount: 0,
            },
            ganache: {
                writeMnemonic: true,
                defaultAccount: 0,
                handlers: {
                    gasPrice: async () => {
                        return {
                            slow: 1,
                            medium: 1,
                            fast: 1,
                        };
                    },
                    tokenPrice: async () => {
                        return {
                            usd: 0,
                        };
                    },
                },
            },
        },
        compile: {
            supportedExtensions: ['.flac'],
        },
        build: {},
        scripts: {
            disableMainExecution: ['/infinitymint-buildtools/'],
            classicScripts: ['/infinitymint-buildtools/'],
        },
        deploy: {},
    },
    export: {},
};

export default config;
