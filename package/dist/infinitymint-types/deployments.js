(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@app/deployments"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnsafeRandom = exports.UnsafeRandomDeploymentClass = exports.SplitRoyalty = exports.SplitRoyaltyDeploymentClass = exports.SimpleToken = exports.SimpleTokenDeploymentClass = exports.SimpleSVG = exports.SimpleSVGDeploymentClass = exports.SimpleImage = exports.SimpleImageDeploymentClass = exports.SimpleAny = exports.SimpleAnyDeploymentClass = exports.SelectiveMinter = exports.SelectiveMinterDeploymentClass = exports.SeededRandom = exports.SeededRandomDeploymentClass = exports.RaritySVG = exports.RaritySVGDeploymentClass = exports.RarityImage = exports.RarityImageDeploymentClass = exports.RarityAny = exports.RarityAnyDeploymentClass = exports.TokenAccount = exports.TokenAccountDeploymentClass = exports.StickersV2 = exports.StickersV2DeploymentClass = exports.EADStickers = exports.EADStickersDeploymentClass = exports.InfinityMintValues = exports.InfinityMintValuesDeploymentClass = exports.InfinityMintUtil = exports.InfinityMintUtilDeploymentClass = exports.InfinityMintStorage = exports.InfinityMintStorageDeploymentClass = exports.InfinityMintProject = exports.InfinityMintProjectDeploymentClass = exports.InfinityMintLinker = exports.InfinityMintLinkerDeploymentClass = exports.InfinityMintFlags = exports.InfinityMintFlagsDeploymentClass = exports.InfinityMintApi = exports.InfinityMintApiDeploymentClass = exports.InfinityMint = exports.InfinityMintDeploymentClass = exports.DefaultRoyalty = exports.DefaultRoyaltyDeploymentClass = exports.DefaultMinter = exports.DefaultMinterDeploymentClass = void 0;
    const tslib_1 = require("tslib");
    const deployments_1 = require("@app/deployments");
    class DefaultMinterDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
    }
    exports.DefaultMinterDeploymentClass = DefaultMinterDeploymentClass;
    exports.DefaultMinter = {
        "unique": true,
        "module": "minter",
        "index": 7,
        "deployArgs": [
            "values",
            "storage",
            "assets",
            "random"
        ],
        "solidityFolder": "alpha",
        "requestPermissions": [
            "erc721"
        ],
        "permissions": [
            "all",
            "erc721",
            "assets"
        ],
        "key": "DefaultMinter"
    };
    class DefaultRoyaltyDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.DefaultRoyaltyDeploymentClass = DefaultRoyaltyDeploymentClass;
    exports.DefaultRoyalty = {
        "unique": true,
        "module": "royalty",
        "index": 5,
        "deployArgs": [
            "values"
        ],
        "solidityFolder": "alpha",
        "requestPermissions": [
            "erc721"
        ],
        "permissions": [
            "all",
            "erc721",
            "assets"
        ],
        "values": {
            "baseTokenValue": 1000000000000000000,
            "stickerSplit": 20
        },
        "key": "DefaultRoyalty"
    };
    class InfinityMintDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.InfinityMintDeploymentClass = InfinityMintDeploymentClass;
    exports.InfinityMint = {
        "module": "erc721",
        "index": 8,
        "settings": {
            "erc721": {
                "generateTokenURI": false,
                "pregenerateTokens": 100
            }
        },
        "values": {
            "previewCount": 3,
            "previewCooldownSeconds": 18000,
            "incrementalMode": false,
            "matchedMode": false,
            "disableMintArguments": false,
            "byteMint": false,
            "disableRegisteredTokens": false,
            "maxSupply": 124,
            "maxTokensPerWallet": 256
        },
        "config": {
            "test": "test"
        },
        "deployArgs": [
            "%token_name%",
            "%token_symbol%",
            "storage",
            "values",
            "minter",
            "royalty"
        ],
        "requestPermissions": [
            "storage",
            "royalty"
        ],
        "solidityFolder": "alpha",
        "permissions": [
            "all"
        ],
        "key": "InfinityMint"
    };
    class InfinityMintApiDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
    }
    exports.InfinityMintApiDeploymentClass = InfinityMintApiDeploymentClass;
    exports.InfinityMintApi = {
        "module": "api",
        "index": 10,
        "deployArgs": [
            "erc721",
            "storage",
            "assets",
            "values",
            "royalty",
            "project"
        ],
        "solidityFolder": "alpha",
        "requestPermissions": [
            "erc721",
            "storage",
            "flags",
            "linker"
        ],
        "key": "InfinityMintApi"
    };
    class InfinityMintFlagsDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
    }
    exports.InfinityMintFlagsDeploymentClass = InfinityMintFlagsDeploymentClass;
    exports.InfinityMintFlags = {
        "module": "flags",
        "index": 10,
        "deployArgs": [
            "storage",
            "erc721"
        ],
        "solidityFolder": "alpha",
        "requestPermissions": [
            "storage"
        ],
        "key": "InfinityMintFlags"
    };
    class InfinityMintLinkerDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
    }
    exports.InfinityMintLinkerDeploymentClass = InfinityMintLinkerDeploymentClass;
    exports.InfinityMintLinker = {
        "module": "linker",
        "index": 10,
        "deployArgs": [
            "storage",
            "erc721"
        ],
        "solidityFolder": "alpha",
        "requestPermissions": [
            "storage",
            "erc721"
        ],
        "key": "InfinityMintLinker"
    };
    class InfinityMintProjectDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
    }
    exports.InfinityMintProjectDeploymentClass = InfinityMintProjectDeploymentClass;
    exports.InfinityMintProject = {
        "module": "project",
        "index": 8,
        "solidityFolder": "alpha",
        "permissions": [
            "all"
        ],
        "key": "InfinityMintProject"
    };
    class InfinityMintStorageDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
    }
    exports.InfinityMintStorageDeploymentClass = InfinityMintStorageDeploymentClass;
    exports.InfinityMintStorage = {
        "module": "storage",
        "index": 3,
        "solidityFolder": "alpha",
        "key": "InfinityMintStorage"
    };
    class InfinityMintUtilDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
    }
    exports.InfinityMintUtilDeploymentClass = InfinityMintUtilDeploymentClass;
    exports.InfinityMintUtil = {
        "module": "utils",
        "index": 1,
        "solidityFolder": "alpha",
        "library": true,
        "key": "InfinityMintUtil"
    };
    class InfinityMintValuesDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
    }
    exports.InfinityMintValuesDeploymentClass = InfinityMintValuesDeploymentClass;
    exports.InfinityMintValues = {
        "static": true,
        "instantlySetup": true,
        "unique": true,
        "important": true,
        "module": "values",
        "permissions": [
            "all"
        ],
        "index": 1,
        "solidityFolder": "alpha",
        "key": "InfinityMintValues"
    };
    class EADStickersDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
    }
    exports.EADStickersDeploymentClass = EADStickersDeploymentClass;
    exports.EADStickers = {
        "index": 1,
        "solidityFolder": "alpha",
        "important": true,
        "link": {
            "description": "Enables prototype ethereum ad service integration",
            "args": [
                "tokenId",
                "erc721"
            ],
            "key": "stickers",
            "erc721": true,
            "verify": true
        },
        "key": "EADStickers"
    };
    class StickersV2DeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
    }
    exports.StickersV2DeploymentClass = StickersV2DeploymentClass;
    exports.StickersV2 = {
        "index": 1,
        "solidityFolder": "alpha",
        "important": false,
        "link": {
            "description": "Sticers V2 Test",
            "args": [
                "oracleDestination",
                "erc721",
                "tokenId",
                "tokenName",
                "tokenSymbol"
            ],
            "key": "eads_endpoint",
            "erc721": true,
            "verify": true
        },
        "key": "StickersV2"
    };
    class TokenAccountDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
    }
    exports.TokenAccountDeploymentClass = TokenAccountDeploymentClass;
    exports.TokenAccount = {
        "index": 0,
        "solidityFolder": "alpha",
        "important": true,
        "link": {
            "description": "A smart-contract wallet account capable of holding ERC-20 tokens and ERC-721 tokens",
            "args": [
                "tokenId",
                "erc721"
            ],
            "key": "wallet",
            "verify": true
        },
        "key": "TokenAccount"
    };
    class RarityAnyDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.RarityAnyDeploymentClass = RarityAnyDeploymentClass;
    exports.RarityAny = {
        "unique": true,
        "module": "assets",
        "index": 4,
        "values": {
            "mustGenerateName": true,
            "nameCount": 3,
            "colourChunkSize": 32,
            "extraColours": 32,
            "randomRarity": true,
            "lowestRarity": true,
            "highestRarity": false,
            "stopDuplicateMint": false
        },
        "deployArgs": [
            "%token_name%",
            "values"
        ],
        "solidityFolder": "alpha",
        "permissions": [
            "erc721",
            "minter"
        ],
        "key": "RarityAny"
    };
    class RarityImageDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.RarityImageDeploymentClass = RarityImageDeploymentClass;
    exports.RarityImage = {
        "unique": true,
        "module": "assets",
        "index": 4,
        "values": {
            "mustGenerateName": true,
            "nameCount": 3,
            "colourChunkSize": 32,
            "extraColours": 32,
            "randomRarity": true,
            "lowestRarity": true,
            "highestRarity": false,
            "stopDuplicateMint": false
        },
        "config": {
            "paths": {
                "rarityChunkSize": 64
            }
        },
        "deployArgs": [
            "%token_name%",
            "values"
        ],
        "solidityFolder": "alpha",
        "permissions": [
            "erc721",
            "minter"
        ],
        "key": "RarityImage"
    };
    class RaritySVGDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.RaritySVGDeploymentClass = RaritySVGDeploymentClass;
    exports.RaritySVG = {
        "unique": true,
        "module": "assets",
        "index": 4,
        "values": {
            "mustGenerateName": true,
            "nameCount": 3,
            "colourChunkSize": 32,
            "extraColours": 32,
            "randomRarity": true,
            "lowestRarity": true,
            "highestRarity": false,
            "stopDuplicateMint": false
        },
        "deployArgs": [
            "%token_name%",
            "values"
        ],
        "solidityFolder": "alpha",
        "permissions": [
            "erc721",
            "minter"
        ],
        "key": "RaritySVG"
    };
    class SeededRandomDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.SeededRandomDeploymentClass = SeededRandomDeploymentClass;
    exports.SeededRandom = {
        "unique": true,
        "module": "random",
        "index": 4,
        "values": {
            "seedNumber": 230,
            "maxRandomNumber": 16777215
        },
        "solidityFolder": "alpha",
        "key": "SeededRandom"
    };
    class SelectiveMinterDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
    }
    exports.SelectiveMinterDeploymentClass = SelectiveMinterDeploymentClass;
    exports.SelectiveMinter = {
        "module": "minter",
        "index": 7,
        "solidityFolder": "alpha",
        "deployArgs": [
            "values",
            "storage",
            "assets",
            "random"
        ],
        "permissions": [
            "erc721",
            "assets"
        ],
        "key": "SelectiveMinter"
    };
    class SimpleAnyDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.SimpleAnyDeploymentClass = SimpleAnyDeploymentClass;
    exports.SimpleAny = {
        "unique": true,
        "module": "assets",
        "index": 4,
        "values": {
            "mustGenerateName": true,
            "nameCount": 3,
            "colourChunkSize": 32,
            "extraColours": 32,
            "randomRarity": true,
            "lowestRarity": true,
            "highestRarity": false,
            "stopDuplicateMint": false
        },
        "deployArgs": [
            "%token_name%",
            "values"
        ],
        "solidityFolder": "alpha",
        "permissions": [
            "erc721",
            "minter"
        ],
        "key": "SimpleAny"
    };
    class SimpleImageDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.SimpleImageDeploymentClass = SimpleImageDeploymentClass;
    exports.SimpleImage = {
        "unique": true,
        "module": "assets",
        "index": 4,
        "config": {
            "assets": {
                "rarityChunkSize": 64
            }
        },
        "values": {
            "mustGenerateName": true,
            "nameCount": 3,
            "colourChunkSize": 32,
            "extraColours": 32,
            "randomRarity": true,
            "lowestRarity": true,
            "highestRarity": false,
            "stopDuplicateMint": false
        },
        "deployArgs": [
            "%token_name%",
            "values"
        ],
        "solidityFolder": "alpha",
        "permissions": [
            "erc721",
            "minter"
        ],
        "key": "SimpleImage"
    };
    class SimpleSVGDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.SimpleSVGDeploymentClass = SimpleSVGDeploymentClass;
    exports.SimpleSVG = {
        "unique": true,
        "module": "assets",
        "index": 4,
        "values": {
            "mustGenerateName": true,
            "nameCount": 3,
            "colourChunkSize": 32,
            "extraColours": 32,
            "randomRarity": true,
            "lowestRarity": true,
            "highestRarity": false,
            "stopDuplicateMint": false
        },
        "deployArgs": [
            "%token_name%",
            "values"
        ],
        "solidityFolder": "alpha",
        "permissions": [
            "erc721",
            "minter"
        ],
        "key": "SimpleSVG"
    };
    class SimpleTokenDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.SimpleTokenDeploymentClass = SimpleTokenDeploymentClass;
    exports.SimpleToken = {
        "unique": true,
        "module": "assets",
        "index": 4,
        "values": {
            "mustGenerateName": true,
            "nameCount": 3,
            "colourChunkSize": 32,
            "extraColours": 32,
            "randomRarity": true,
            "lowestRarity": true,
            "highestRarity": false,
            "stopDuplicateMint": false
        },
        "deployArgs": [
            "%token_name%",
            "values"
        ],
        "solidityFolder": "alpha",
        "permissions": [
            "erc721",
            "minter"
        ],
        "key": "SimpleToken"
    };
    class SplitRoyaltyDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.SplitRoyaltyDeploymentClass = SplitRoyaltyDeploymentClass;
    exports.SplitRoyalty = {
        "unique": true,
        "module": "royalty",
        "index": 5,
        "deployArgs": [
            "values"
        ],
        "solidityFolder": "alpha",
        "permissions": [
            "erc721",
            "assets",
            "minter",
            "all"
        ],
        "values": {
            "baseTokenValue": 1000000000000000000,
            "stickerSplit": 20
        },
        "key": "SplitRoyalty"
    };
    class UnsafeRandomDeploymentClass extends deployments_1.InfinityMintDeployment {
        getDeploymentScript() {
            return this.deploymentScript;
        }
        /**
         *  Returns a read only contract which you can use to read values on chain
         *  @returns
         */
        get read() {
            return super.getContract();
        }
        /**
         * Returns a signed contract which you can use to change values on chain. The signer is the current default signer. Call getSignedContract for more control on who is the signer!
         * @returns
         */
        write() {
            const _super = Object.create(null, {
                getSignedContract: { get: () => super.getSignedContract }
            });
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return _super.getSignedContract.call(this);
            });
        }
        get values() {
            return this.deploymentScript.values;
        }
    }
    exports.UnsafeRandomDeploymentClass = UnsafeRandomDeploymentClass;
    exports.UnsafeRandom = {
        "unique": true,
        "module": "random",
        "index": 4,
        "values": {
            "seedNumber": 230,
            "maxRandomNumber": 16777215
        },
        "solidityFolder": "alpha",
        "key": "UnsafeRandom"
    };
});
//# sourceMappingURL=deployments.js.map