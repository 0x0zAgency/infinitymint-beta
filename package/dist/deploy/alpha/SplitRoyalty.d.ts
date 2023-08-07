import { SplitRoyalty } from '@typechain-types/index';
import { SplitRoyaltyDeployScript } from '@infinitymint-types/deployments';
import { InfinityMintDeploymentParameters } from '../../app/interfaces';
/**
 * Also imported by DefaultRoyalty, sets the price of the token
 * @param param0
 * @returns
 */
export declare const startingPrice: ({ project, }: InfinityMintDeploymentParameters) => Promise<number>;
declare const SplitRoyalty: SplitRoyaltyDeployScript;
export default SplitRoyalty;
//# sourceMappingURL=SplitRoyalty.d.ts.map