(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./web3", "./helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createToken = exports.generateToken = exports.Token = void 0;
    const tslib_1 = require("tslib");
    const web3_1 = require("./web3");
    const helpers_1 = require("./helpers");
    class Token {
        constructor(project, tokenId, raw, receipt = null) {
            this.project = project;
            this.tokenId = tokenId;
            this.raw = raw;
            this.receipt = receipt;
        }
        load() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.raw = yield this.get();
            });
        }
        get rarity() {
            let path = this.getPath();
            if (path.rarity)
                return path.rarity;
            //else, work out the precentage of getting this path from all the paths
            let paths = this.project.getDeployedProject().paths;
            let rarity = (100 / paths.length).toFixed(2);
            return rarity;
        }
        get output() {
            return this.raw;
        }
        get() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return (yield this.project.storage()).get(this.tokenId);
            });
        }
        getPath() {
            return this.project.getDeployedProject().paths[this.raw.pathId];
        }
        getAssets() {
            return this.raw.assets.map((assetId) => {
                if (assetId === 0)
                    return {
                        name: '{red-fg}skipped{/red-fg}',
                        fileName: 'None',
                    };
                return this.project.getAsset(assetId);
            });
        }
        colours() {
            return [];
        }
        get owner() {
            return this.raw.owner;
        }
        get name() {
            return this.getNames().join(' ');
        }
        get pathId() {
            return this.raw.pathId;
        }
        transfer(to) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let erc721 = yield this.project.erc721();
                let tx = yield erc721.transferFrom(this.owner, to, this.tokenId);
                yield (0, web3_1.waitForTx)(tx, `transfer token ${this.tokenId} from ${this.owner} to ${to}`);
                //reload token
                yield this.load();
            });
        }
        isFlagTrue(flag) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let flags = yield this.project.flags();
                return flags.isFlagTrue(this.tokenId, flag);
            });
        }
        isGlobalFlag(flag) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let flags = yield this.project.flags();
                return flags.isGlobalFlag(flag);
            });
        }
        setFlag(flag, value) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                let flags = yield this.project.flags();
                let tx = yield flags.setFlag(this.tokenId, flag, value);
                yield (0, web3_1.waitForTx)(tx, `set flag ${flag} to ${value}`);
            });
        }
        getNames() {
            let names = this.raw.names.map((name) => this.project.getDeployedProject().meta.names[name]);
            return names;
        }
    }
    exports.Token = Token;
    const generateToken = (project, pathId) => {
        var _a, _b, _c;
        let paths = project.paths;
        let rarity = (_a = project.meta) === null || _a === void 0 ? void 0 : _a.usingRarity;
        pathId = pathId || (0, helpers_1.getRandomNumber)(paths.length);
        if (rarity) {
            let rarityIndex = Math.floor(Math.random() * 100);
            let rarities = {};
            paths.forEach((path) => {
                if (rarityIndex <= path.rarity)
                    rarities[path.pathId] = path.rarity;
            });
            pathId =
                rarities[Math.floor(Math.random() * Object.values(rarities).length)];
            if (project.settings.values.highestRarity) {
                //select the highest rarity on the object
                pathId = parseInt(Object.keys(rarities).reduce((a, b) => rarities[a] > rarities[b] ? a : b));
            }
            if (project.settings.values.lowestRarity) {
                //select the lowest rarity on the object
                pathId = parseInt(Object.keys(rarities).reduce((a, b) => rarities[a] < rarities[b] ? a : b));
            }
        }
        let assets = [];
        let assetSections = {};
        Object.values(project.meta.assets.sections).forEach((section) => {
            assetSections[section] = [];
            //find assets for sections
            Object.values(project.assets).forEach((asset) => {
                if (asset.section === section)
                    assetSections[section].push(asset);
            });
        });
        Object.keys(assetSections).forEach((section) => {
            let assetSection = assetSections[section];
            let selection = [];
            Object.values(assetSection).forEach((asset) => {
                let assetRaityIndex = (0, helpers_1.getRandomNumber)(100);
                if (assetRaityIndex <= (asset.rarity || 100))
                    selection.push(asset);
            });
            if (selection.length === 0) {
                assets.push(0);
            }
            else {
                let asset = selection[(0, helpers_1.getRandomNumber)(selection.length)];
                assets.push(asset.assetId);
            }
        });
        let names = [];
        //if we are in matched mode, then make the name equal the path name and the token name
        if (project.settings.values.matchedMode) {
            names.push(pathId);
            names.push(0);
        }
        else {
            let nameCount = Math.floor((0, helpers_1.getRandomNumber)(((_c = (_b = project.settings) === null || _b === void 0 ? void 0 : _b.values) === null || _c === void 0 ? void 0 : _c.nameCount) || 4)) + 1;
            for (let i = 0; i < nameCount; i++) {
                let nameId = Math.floor(Math.random() * Object.values(project.meta.names).length);
                names.push(nameId);
            }
            names.push(0);
        }
        //do colours
        //do mint data
        return {
            pathId,
            names,
            assets,
            owner: '0x0000000000000000000000000000000000000000',
            destinations: [],
            mintData: [],
            colours: [],
            currentTokenId: 0,
        };
    };
    exports.generateToken = generateToken;
    const createToken = (project) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return {
            minted: false,
            pathId: 0,
            names: [],
            currentTokenId: 0,
            colours: [],
            owner: '',
            mintData: [],
            assets: [],
            destinations: [],
        };
    });
    exports.createToken = createToken;
});
//# sourceMappingURL=token.js.map