(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/web3", "../../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const web3_1 = require("../../app/web3");
    const helpers_1 = require("../../app/helpers");
    const SimpleImage = {
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
        cleanup: ({ deployment, project, log }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let assetContract = yield deployment.write();
            yield (0, web3_1.waitForTx)(yield assetContract.resetAssets(), 'resetting assets');
            yield (0, web3_1.waitForTx)(yield assetContract.resetNames(), 'resetting names');
            yield (0, web3_1.waitForTx)(yield assetContract.resetPaths(), 'resetting paths');
        }),
        update: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let assetContract = yield params.deployment.write();
            yield params.deployScript.cleanup(params);
            yield params.deployScript.setup(params);
            return assetContract;
        }),
        setup: ({ deployment, project, log }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            let assetContract = yield deployment.write();
            let pathCount = Object.values(project.paths).length;
            let config = (0, helpers_1.getConfigFile)();
            log(`\n{cyan-fg}{bold}Setting Path Count{/} => [${pathCount}]`);
            yield (0, web3_1.waitForTx)(yield assetContract.setPathCount(pathCount), 'path count');
            log(`\n{cyan-fg}{bold}Getting Asset Rarities{/}...`);
            let assetRarities = Object.values(project.assets || []).map((asset) => asset.rarity || 100);
            assetRarities.forEach((rarity, i) => {
                log(`{cyan-fg}{bold}[Asset ${i}] ${project.assets[i].name} => ${rarity}%{/}`);
            });
            log(`\n{cyan-fg}{bold}Setting Name Count{/}...`);
            let names = project.settings.names || [];
            if ((_a = project.settings) === null || _a === void 0 ? void 0 : _a.values.matchedMode) {
                names = project.paths.map((path) => path.name);
            }
            if (!names.includes((_b = project.information) === null || _b === void 0 ? void 0 : _b.tokenSingular))
                //insert at the start
                names.unshift((_c = project.information) === null || _c === void 0 ? void 0 : _c.tokenSingular);
            names.forEach((name, i) => log(`{yellow-fg}{bold}[Name ${i}]{/} ${name}`));
            yield (0, web3_1.waitForTx)(yield assetContract.setNameCount(names.length), 'name count');
            let objectNames = {};
            names.forEach((name, i) => {
                objectNames[i] = name;
            });
            project.meta = Object.assign(Object.assign({}, project.meta), { names: objectNames });
            if (project.assets && Object.values(project.assets).length !== 0) {
                log('\n{cyan-fg}{bold}Gathering Assets{/}');
                let sections = {};
                if (project.assets instanceof Array === true) {
                    project.assets.map((asset) => {
                        if (sections[(asset === null || asset === void 0 ? void 0 : asset.section) || 'default'] === undefined)
                            sections[(asset === null || asset === void 0 ? void 0 : asset.section) || 'default'] = [];
                        sections[(asset === null || asset === void 0 ? void 0 : asset.section) || 'default'].push(asset);
                        log(`\t{grey-fg}found ${asset.name} <${asset.fileName}> [${(asset === null || asset === void 0 ? void 0 : asset.section) ? asset === null || asset === void 0 ? void 0 : asset.section : 'default'}]{/}`);
                    });
                }
                else
                    Object.keys(project.assets).forEach((sectionKey) => {
                        if (sections[sectionKey] === undefined)
                            sections[sectionKey] = [];
                        project.assets[sectionKey].map((asset) => {
                            asset.section = sectionKey;
                            sections[sectionKey].push(asset);
                            log(`\t{grey-fg}[${sectionKey}]: ${asset.name} <${asset.fileName}>{/}`);
                        });
                    });
                let pathSections = {};
                Object.values(project.paths).forEach((path) => {
                    if (path.section) {
                        if (typeof path.section === 'string') {
                            if (sections[path.section])
                                pathSections[path.pathId] = [path.section];
                            else
                                path.section = Object.keys(sections);
                        }
                        else {
                            if (path.section instanceof Array === false)
                                throw new Error('Bad section must either be string or an array of strings referencing path sections');
                            let newSections = [];
                            path.section.map((section) => {
                                if (sections[section])
                                    newSections.push(section);
                            });
                            path.section = newSections;
                            pathSections[path.pathId] = path.section;
                        }
                    }
                });
                let newPathSections = [];
                Object.values(pathSections).forEach((path) => {
                    path.section.forEach((_s) => {
                        if (Object.keys(sections).indexOf(_s) === -1)
                            return;
                        if (newPathSections[Object.keys(sections).indexOf(_s)] === undefined)
                            newPathSections[Object.keys(sections).indexOf(_s)] =
                                [];
                        newPathSections[Object.keys(sections).indexOf(_s)].push(path.pathId);
                    });
                });
                log('{cyan-fg}{bold}\nSetting Path Sections{/}');
                let pathIds = Object.values(newPathSections).map((path) => path.pathId);
                Object.keys(sections).forEach((section, index) => {
                    log(`\t[${index}] => ${section}`);
                });
                //check if all path ids use the same sections
                let isFlatPacked = true;
                let lastSection;
                Object.values(project.paths).forEach((path) => {
                    if (!isFlatPacked)
                        return;
                    if (lastSection &&
                        path.section.join(',') !==
                            path.section.join(',')) {
                        isFlatPacked = false;
                        return;
                    }
                });
                if (!isFlatPacked)
                    yield (0, web3_1.waitForTx)(yield assetContract.setPathSections(pathIds, Object.keys(newPathSections)), 'path sections');
                else {
                    log('\t{gray-fg}is flat-packed!{/}');
                    yield (0, web3_1.waitForTx)(yield assetContract.flatPathSections(Object.keys(sections).map((val, index) => index)), 'flat path sections');
                }
                log('{cyan-fg}{bold}\nSetting Section Assets{/}');
                //means that all paths use the same sections
                let _vals = Object.values(sections);
                for (let index = 0; index < _vals.length; index++) {
                    let section = _vals[index];
                    log(`\t[${index}] => ${Object.keys(sections)[index]} <${section.length} assets>`);
                    yield (0, web3_1.waitForTx)(yield assetContract.pushSectionAssets(section.map((_section) => {
                        return _section.assetId;
                    })), 'push section assets');
                }
                //split up asset rarities into chunks of 64
                let chunks = [];
                let chunkSize = config.settings.deploy.assets.rarityChunkSize;
                for (let i = 0; i < assetRarities.length; i += chunkSize) {
                    chunks.push(assetRarities.slice(i, i + chunkSize));
                }
                for (let i = 0; i < chunks.length; i++) {
                    let chunk = chunks[i];
                    log(`\n{cyan-fg}{bold}Setting Chunk => ${chunk.length} <chunk ${i}>{/}`);
                    yield (0, web3_1.waitForTx)(yield assetContract.addAssets(chunk), 'push asset rarities - chunk ' + i);
                }
            }
        }),
        deployArgs: ['%token_name%', 'values'],
        solidityFolder: 'alpha',
        permissions: ['erc721', 'minter'],
    };
    exports.default = SimpleImage;
});
//# sourceMappingURL=SimpleImage.js.map