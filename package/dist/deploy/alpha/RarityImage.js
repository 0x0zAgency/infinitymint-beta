(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/web3", "./SimpleImage", "../../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const web3_1 = require("../../app/web3");
    const SimpleImage_1 = tslib_1.__importDefault(require("./SimpleImage"));
    const helpers_1 = require("../../app/helpers");
    const RarityImage = {
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
        update: SimpleImage_1.default.update,
        cleanup: SimpleImage_1.default.cleanup,
        setup: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            yield SimpleImage_1.default.setup(params);
            let config = (0, helpers_1.getConfigFile)();
            let { deployment, project, log } = params;
            let assetContract = yield deployment.write();
            log('{cyan-fg}{bold}\nSetting Path Rarities{/}');
            let rarities = Object.values(project.paths).map((path) => path.rarity || 100);
            rarities.forEach((rarity, i) => {
                log(`{cyan-fg}{bold}[Path ${i}] ${project.paths[i].name} => ${rarity}%{/}`);
            });
            //split up rarities into chunks of 32
            let chunks = [];
            let chunkSize = config.settings.deploy.paths.rarityChunkSize;
            for (let i = 0; i < rarities.length; i += chunkSize) {
                chunks.push(rarities.slice(i, i + chunkSize));
            }
            for (let i = 0; i < chunks.length; i++) {
                let chunk = chunks[i];
                log(`\n{cyan-fg}{bold}Setting Chunk => ${chunk.length} <chunk ${i}>{/}`);
                yield (0, web3_1.waitForTx)(yield assetContract.pushPathRarities(chunk), 'push path rarities - chunk ' + i);
            }
            if (!project.meta)
                project.meta = {};
            //set that we are using rarities
            project.meta.usingRarity = true;
        }),
        deployArgs: ['%token_name%', 'values'],
        solidityFolder: 'alpha',
        permissions: ['erc721', 'minter'],
    };
    exports.default = RarityImage;
});
//# sourceMappingURL=RarityImage.js.map