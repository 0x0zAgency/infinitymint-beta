import { InfinityMintEnvironmentVariables } from '@app/interfaces';

/**
 * this file is what is used in creating the default .env variables for infinity mint, not all of the environment variables are listed here. Its interface is defined in the interfaces file, see {@link app/interfaces.InfinityMintEnvironment}.
 */
const envs: InfinityMintEnvironmentVariables = {
    INFINITYMINT_PROJECT: undefined,
    ETHERSCAN_API_KEY: undefined,
    POLYGONSCAN_API_KEY: undefined,
    PIPE_ECHO_DEFAULT: false,
    PIPE_ECHO_DEBUG: false,
    PIPE_ECHO_ERRORS: false,
    PIPE_ECHO_WARNINGS: false,
    PIPE_LOG_ERRORS_TO_DEFAULT: true,
    PIPE_LOG_ERRORS_TO_DEBUG: false,
    PIPE_SILENCE_UNDEFINED_PIPE: false,
    PIPE_SILENCE: false,
    PIPE_SILENCE_DEBUG: false,
    PIPE_SEPERATE_WARNINGS: false,
    PIPE_IGNORE_CONSOLE: false,
    INFINITYMINT_TELNET: false,
    GANACHE_PORT: 8545,
    EXPRESS_PORT: 3000,
    INFINITYMINT_LOAD: false,
    THROW_ALL_ERRORS: false,
    INFINITYMINT_CONSOLE: false,
    INFINITYMINT_INCLUDE_DEPLOY: true,
    DEFAULT_SOLIDITY_FOLDER: 'alpha',
    GANACHE_EXTERNAL: false,
    INFINITYMINT_INCLUDE_SCRIPTS: true,
    SOLIDITY_CLEAN_NAMESPACE: false,
    SOLIDITY_USE_NODE_MODULE: true,
    DEFAULT_WALLET_MNEMONIC: undefined,
    BACKUP_WALLET_MNEMONIC: undefined,
};
export default envs;
