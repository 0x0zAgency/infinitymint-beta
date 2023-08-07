import InfinityConsole from './app/console';
import { InfinityMintConsoleOptions } from './app/interfaces';
import './infinitymint-types/index';
export declare let config: import("@app/interfaces").InfinityMintConfig;
export declare const getInfinityConsole: () => InfinityConsole;
/**
 * Starts InfinityMint
 * @param options
 * @returns
 */
export declare const load: (options?: InfinityMintConsoleOptions) => Promise<InfinityConsole>;
declare const infinitymint: () => InfinityConsole;
export default infinitymint;
//# sourceMappingURL=core.d.ts.map