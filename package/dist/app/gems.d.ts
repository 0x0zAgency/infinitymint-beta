import { Dictionary } from './helpers';
import { Gem } from './interfaces';
import InfinityConsole from './console';
export declare const getLoadedGems: () => Dictionary<Gem>;
/**
 * Loads all gems from the config file which are NPM packages
 */
export declare const requireGems: () => Promise<void>;
/**
 * Completely reloads a gem, deleting the cache and reloading it
 * @param name
 * @returns
 */
export declare const reloadGem: (name: string, infinityConsole?: InfinityConsole) => Promise<Gem>;
/**
 *
 * @param name
 * @returns
 */
export declare const hasGem: (name: string) => boolean;
/**
 *
 * @param name
 * @returns
 */
export declare const getGem: (name: string) => Gem;
/**
 *
 * @returns
 */
export declare const includeGems: (reload?: string) => Promise<Dictionary<Gem>>;
export declare const loadGems: (infinityConsole: InfinityConsole) => Promise<void>;
/**
 *
 * @returns
 */
export declare const findGems: () => Promise<any[]>;
//# sourceMappingURL=gems.d.ts.map