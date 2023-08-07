import { RarityImage } from '@typechain-types/index';
import { RarityImageDeployScript } from '@infinitymint-types/deployments';
import { waitForTx } from '../../app/web3';
import SimpleImage from './SimpleImage';
import { InfinityMintDeployedProject } from '../../app/interfaces';
import { getConfigFile } from '../../app/helpers';

const RarityImage: RarityImageDeployScript = {
    //only means one of these modules can be deployed
    unique: true,
    module: 'assets',
    index: 4,
    values: {
        mustGenerateName: true,
        nameCount: 3,
        colourChunkSize: 32,
        extraColours: 32,
        randomRarity: true,
        lowestRarity: true,
        highestRarity: false,
        stopDuplicateMint: false,
    },
    config: {
        paths: {
            rarityChunkSize: 64,
        },
    },
    update: SimpleImage.update,
    cleanup: SimpleImage.cleanup,
    setup: async (params) => {
        await SimpleImage.setup(params);
        let config = getConfigFile();
        let { deployment, project, log } = params;
        let assetContract = await deployment.write();

        log('{cyan-fg}{bold}\nSetting Path Rarities{/}');
        let rarities = Object.values(project.paths).map(
            (path) => path.rarity || 100
        );

        rarities.forEach((rarity, i) => {
            log(
                `{cyan-fg}{bold}[Path ${i}] ${project.paths[i].name} => ${rarity}%{/}`
            );
        });

        //split up rarities into chunks of 32
        let chunks = [];
        let chunkSize = config.settings.deploy.paths.rarityChunkSize;

        for (let i = 0; i < rarities.length; i += chunkSize) {
            chunks.push(rarities.slice(i, i + chunkSize));
        }

        for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];
            log(
                `\n{cyan-fg}{bold}Setting Chunk => ${chunk.length} <chunk ${i}>{/}`
            );
            await waitForTx(
                await assetContract.pushPathRarities(chunk),
                'push path rarities - chunk ' + i
            );
        }

        if (!(project as InfinityMintDeployedProject).meta)
            (project as InfinityMintDeployedProject).meta = {};

        //set that we are using rarities
        (project as InfinityMintDeployedProject).meta.usingRarity = true;
    },
    deployArgs: ['%token_name%', 'values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'minter'],
};

export default RarityImage;
