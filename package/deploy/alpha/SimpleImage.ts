import {
    InfinityMintDeployedProject,
    InfinityMintProjectAsset,
    InfinityMintProjectPath,
} from '../../app/interfaces';
import { SimpleImage } from '@typechain-types/index';
import { deploy, waitForTx } from '../../app/web3';
import { SimpleImageDeployScript } from '@infinitymint-types/deployments';
import { getConfigFile } from '../../app/helpers';

const SimpleImage: SimpleImageDeployScript = {
    //going to give
    unique: true,
    module: 'assets',
    index: 4,
    config: {
        assets: {
            rarityChunkSize: 64,
        },
    },
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
    cleanup: async ({ deployment, project, log }) => {
        let assetContract = await deployment.write();

        await waitForTx(await assetContract.resetAssets(), 'resetting assets');
        await waitForTx(await assetContract.resetNames(), 'resetting names');
        await waitForTx(await assetContract.resetPaths(), 'resetting paths');
    },
    update: async (params) => {
        let assetContract = await params.deployment.write();
        await params.deployScript.cleanup(params);
        await params.deployScript.setup(params);
        return assetContract;
    },
    setup: async ({ deployment, project, log }) => {
        let assetContract = await deployment.write();
        let pathCount = Object.values(project.paths).length;
        let config = getConfigFile();

        log(`\n{cyan-fg}{bold}Setting Path Count{/} => [${pathCount}]`);
        await waitForTx(
            await assetContract.setPathCount(pathCount),
            'path count'
        );

        log(`\n{cyan-fg}{bold}Getting Asset Rarities{/}...`);

        let assetRarities = Object.values<InfinityMintProjectAsset>(
            (project.assets as InfinityMintProjectAsset[]) || []
        ).map((asset) => asset.rarity || 100);

        assetRarities.forEach((rarity, i) => {
            log(
                `{cyan-fg}{bold}[Asset ${i}] ${
                    (project.assets[i] as InfinityMintProjectAsset).name
                } => ${rarity}%{/}`
            );
        });

        log(`\n{cyan-fg}{bold}Setting Name Count{/}...`);

        let names = project.settings.names || [];

        if (project.settings?.values.matchedMode) {
            names = project.paths.map((path) => path.name);
        }

        if (!names.includes(project.information?.tokenSingular))
            //insert at the start
            names.unshift(project.information?.tokenSingular);

        names.forEach((name, i) =>
            log(`{yellow-fg}{bold}[Name ${i}]{/} ${name}`)
        );

        await waitForTx(
            await assetContract.setNameCount(names.length),
            'name count'
        );

        let objectNames = {};
        names.forEach((name, i) => {
            objectNames[i] = name;
        });

        (project as InfinityMintDeployedProject).meta = {
            ...(project as InfinityMintDeployedProject).meta,
            names: objectNames,
        };

        if (project.assets && Object.values(project.assets).length !== 0) {
            log('\n{cyan-fg}{bold}Gathering Assets{/}');
            let sections = {};
            if (project.assets instanceof Array === true) {
                (project.assets as Array<InfinityMintProjectAsset>).map(
                    (asset) => {
                        if (sections[asset?.section || 'default'] === undefined)
                            sections[asset?.section || 'default'] = [];

                        sections[asset?.section || 'default'].push(asset);
                        log(
                            `\t{grey-fg}found ${asset.name} <${
                                asset.fileName
                            }> [${
                                asset?.section ? asset?.section : 'default'
                            }]{/}`
                        );
                    }
                );
            } else
                Object.keys(project.assets).forEach((sectionKey) => {
                    if (sections[sectionKey] === undefined)
                        sections[sectionKey] = [];

                    project.assets[sectionKey].map(
                        (asset: {
                            section: string;
                            name: any;
                            fileName: any;
                        }) => {
                            asset.section = sectionKey;
                            sections[sectionKey].push(asset);
                            log(
                                `\t{grey-fg}[${sectionKey}]: ${asset.name} <${asset.fileName}>{/}`
                            );
                        }
                    );
                });

            let pathSections = {};
            Object.values(project.paths).forEach((path) => {
                if (path.section) {
                    if (typeof path.section === 'string') {
                        if (sections[path.section])
                            pathSections[path.pathId] = [path.section];
                        else path.section = Object.keys(sections);
                    } else {
                        if ((path.section as any) instanceof Array === false)
                            throw new Error(
                                'Bad section must either be string or an array of strings referencing path sections'
                            );

                        let newSections = [];
                        path.section.map((section) => {
                            if (sections[section]) newSections.push(section);
                        });
                        path.section = newSections;
                        pathSections[path.pathId] = path.section;
                    }
                }
            });

            let newPathSections = [];
            Object.values(pathSections).forEach(
                (path: InfinityMintProjectPath) => {
                    (path.section as string[]).forEach((_s) => {
                        if (Object.keys(sections).indexOf(_s) === -1) return;

                        if (
                            newPathSections[
                                Object.keys(sections).indexOf(_s)
                            ] === undefined
                        )
                            newPathSections[Object.keys(sections).indexOf(_s)] =
                                [];

                        newPathSections[Object.keys(sections).indexOf(_s)].push(
                            path.pathId
                        );
                    });
                }
            );

            log('{cyan-fg}{bold}\nSetting Path Sections{/}');
            let pathIds = Object.values(newPathSections).map(
                (path: InfinityMintProjectPath) => path.pathId
            );

            Object.keys(sections).forEach((section, index) => {
                log(`\t[${index}] => ${section}`);
            });

            //check if all path ids use the same sections
            let isFlatPacked = true;
            let lastSection: any;
            Object.values(project.paths).forEach((path) => {
                if (!isFlatPacked) return;

                if (
                    lastSection &&
                    (path.section as string[]).join(',') !==
                        (path.section as string[]).join(',')
                ) {
                    isFlatPacked = false;
                    return;
                }
            });

            if (!isFlatPacked)
                await waitForTx(
                    await assetContract.setPathSections(
                        pathIds,
                        Object.keys(newPathSections) as any[]
                    ),
                    'path sections'
                );
            else {
                log('\t{gray-fg}is flat-packed!{/}');
                await waitForTx(
                    await assetContract.flatPathSections(
                        Object.keys(sections).map((val, index) => index)
                    ),
                    'flat path sections'
                );
            }

            log('{cyan-fg}{bold}\nSetting Section Assets{/}');
            //means that all paths use the same sections
            let _vals = Object.values(sections);
            for (let index = 0; index < _vals.length; index++) {
                let section = _vals[index] as any;
                log(
                    `\t[${index}] => ${Object.keys(sections)[index]} <${
                        section.length
                    } assets>`
                );
                await waitForTx(
                    await assetContract.pushSectionAssets(
                        section.map((_section: { assetId: any }) => {
                            return _section.assetId;
                        })
                    ),
                    'push section assets'
                );
            }

            //split up asset rarities into chunks of 64
            let chunks = [];
            let chunkSize = config.settings.deploy.assets.rarityChunkSize;

            for (let i = 0; i < assetRarities.length; i += chunkSize) {
                chunks.push(assetRarities.slice(i, i + chunkSize));
            }

            for (let i = 0; i < chunks.length; i++) {
                let chunk = chunks[i];
                log(
                    `\n{cyan-fg}{bold}Setting Chunk => ${chunk.length} <chunk ${i}>{/}`
                );
                await waitForTx(
                    await assetContract.addAssets(chunk),
                    'push asset rarities - chunk ' + i
                );
            }
        }
    },
    deployArgs: ['%token_name%', 'values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'minter'],
};

export default SimpleImage;
