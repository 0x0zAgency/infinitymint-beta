import { toTempProject } from '../../app/helpers';
import { InfinityMintDeploymentScript } from '../../app/interfaces';
import { RarityImage } from '@typechain-types/index';
import { logTransaction } from '../../app/web3';
import SimpleImage from './SimpleImage';
const RarityImage: InfinityMintDeploymentScript = {
    //only means one of these modules can be deployed
    unique: true,
    module: 'assets',
    index: 4,
    setup: async (params) => {
        await SimpleImage.setup(params);

        let { deployments, project, log } = params;
        let tempProject = toTempProject(project);
        let assetContract = (await deployments[
            'assets'
        ].getSignedContract()) as RarityImage;

        log('{cyan-fg}{bold}\nSetting Path Rarities{/}');
        Object.values(tempProject.paths)
            .map((path) => path.rarity || 100)
            .forEach((rarity, index) => {
                log(`\t[${index}] => ${rarity}`);
            });

        await logTransaction(
            await assetContract.pushPathRarities(
                Object.values(tempProject.paths).map(
                    (path) => path.rarity || 100
                )
            )
        );
    },
    deployArgs: ['%token_name%', 'values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'minter'],
};

export default RarityImage;
