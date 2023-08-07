import { logDirect, toTempProject } from '../../app/helpers';
import {
    InfinityMintDeploymentScript,
    InfinityMintProjectAsset,
    InfinityMintProjectPath,
} from '../../app/interfaces';
import { SimpleImage } from '@typechain-types/index';
import { logTransaction } from '../../app/web3';

const SimpleImage: InfinityMintDeploymentScript = {
    //going to give
    unique: true,
    module: 'assets',
    index: 4,
    setup: async ({ deployments, project, log }) => {
        let tempProject = toTempProject(project);

        let assetContract = (await deployments[
            'assets'
        ].getSignedContract()) as SimpleImage;
        let pathCount = Object.values(tempProject.paths).length;

        log(`\n{cyan-fg}{bold}Setting Path Count{/} => [${pathCount}]`);
        await logTransaction(await assetContract.setPathCount(pathCount));

        if (
            tempProject.assets &&
            Object.values(tempProject.assets).length !== 0
        ) {
            log('\n{cyan-fg}{bold}Gathering Assets{/}');
            let sections = {};
            if (tempProject.assets instanceof Array === true) {
                (tempProject.assets as Array<InfinityMintProjectAsset>).map(
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
                Object.keys(tempProject.assets).forEach((sectionKey) => {
                    if (sections[sectionKey] === undefined)
                        sections[sectionKey] = [];

                    tempProject.assets[sectionKey].map(
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
            Object.values(tempProject.paths).forEach((path) => {
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
            let pathIds = Object.values(pathSections).map(
                (path: InfinityMintProjectPath) => path.pathId
            );
            Object.keys(sections).forEach((section, index) => {
                log(`\t[${index}] => ${section}`);
            });

            //check if all path ids use the same sections
            let isFlatPacked = true;
            let lastSection: any;
            Object.values(tempProject.paths).forEach((path) => {
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
                await logTransaction(
                    await assetContract.setPathSections(
                        pathIds,
                        Object.keys(newPathSections) as any[]
                    )
                );
            else {
                log('\t{gray-fg}is flat-packed!{/}');
                await logTransaction(
                    await assetContract.flatPathSections(pathIds)
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
                await logTransaction(
                    await assetContract.pushSectionAssets(
                        section.map((_section) => {
                            return _section.assetId;
                        })
                    )
                );
            }
        }
    },
    deployArgs: ['%token_name%', 'values'],
    solidityFolder: 'alpha',
    permissions: ['erc721', 'minter'],
};

export default SimpleImage;
