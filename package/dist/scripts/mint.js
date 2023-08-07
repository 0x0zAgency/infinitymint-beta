(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/helpers", "../app/token"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../app/helpers");
    const token_1 = require("../app/token");
    const version = {
        name: 'Mint',
        description: 'Mints a new InfinityMint NFT',
        config: {
            mint: {
                mintChunkSize: 8,
            },
        },
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (!script.project)
                throw new Error('Please specify a project using the --project flag');
            let count = (_b = (_a = script.args.count) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 1;
            let erc721 = yield script.project.erc721();
            let { useImplicitMint, gasLimit, showReceipt } = (0, helpers_1.getArgumentValues)(script.args);
            if (!(yield erc721.mintsEnabled()) && !useImplicitMint)
                throw new Error('Minting is not enabled for this project');
            if (count <= 1 && !useImplicitMint) {
                let result = yield script.project.mint(null, gasLimit);
                if (showReceipt)
                    script.log(`{bold}Transaction Receipt{/}\n${JSON.stringify(result, null, 4)}`);
                script.log(''); //newline
                script.log(`name => ${result.name}`);
                script.log(`project => ${result.project.getNameAndVersion()}`);
                script.log(`network => ${result.project.network}`);
                script.log(`token id => ${result.tokenId}`);
                script.log(`rarity => ${result.getPath().rarity ||
                    (result.project.deployedProject.paths.length / 100) * 100}%`);
                script.log(`path id => ${result.pathId} (${result.getPath().name})`);
                script.log(`assets => (${result.getAssets().length})`);
                result.getAssets().forEach((asset, index) => {
                    var _a, _b, _c;
                    script.log(`\t[${index}] => {grey-fg}${asset.name} (${asset.rarity}% rare) <${asset.fileName}> (${(_c = (_b = (_a = script.project.deployedProject) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.assets) === null || _c === void 0 ? void 0 : _c.sections[index]}){/}`);
                });
                script.log(''); //newline
                return; //end implicit mint
            }
            else if (count <= 1)
                count = 1;
            let currentTokenId = yield erc721.currentTokenId();
            let tokens = [];
            for (let i = 0; i < count; i++) {
                tokens.push(script.project.createRandomToken().output);
            }
            let chunks = [];
            let chunkSize = 8;
            for (let i = 0; i < tokens.length; i += chunkSize) {
                chunks.push(tokens.slice(i, i + chunkSize));
            }
            for (let i = 0; i < chunks.length; i++) {
                let chunk = chunks[i];
                script.log(`Minting ${chunk.length} tokens (${i + 1}/${chunks.length})`);
                let receipt = yield script.project.mintMultiple(chunk);
                if (showReceipt)
                    script.log(`{bold}Transaction Receipt{/}\n${JSON.stringify(receipt, null, 4)}`);
                chunk.forEach((token) => {
                    token.currentTokenId = currentTokenId++;
                    let result = new token_1.Token(script.project, token.currentTokenId, token);
                    script.log(''); //newline
                    script.log(`name => ${result.name}`);
                    script.log(`project => ${result.project.getNameAndVersion()}`);
                    script.log(`network => ${result.project.network}`);
                    script.log(`token id => ${result.tokenId}`);
                    script.log(`rarity => ${result.rarity}%`);
                    script.log(`path id => ${result.pathId} (${result.getPath().name})`);
                    script.log(`assets => (${result.getAssets().length})`);
                    result.getAssets().forEach((asset, index) => {
                        var _a, _b, _c;
                        script.log(`\t[${index}] => {grey-fg}${asset.name} ${asset.rarity ? `(${asset.rarity}% common)` : ''} <${asset.fileName}> [${(_c = (_b = (_a = script.project.deployedProject) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.assets) === null || _c === void 0 ? void 0 : _c.sections[index]}]{/}`);
                    });
                    script.log(''); //newline
                });
            }
            script.log(`\n{green-fg}{bold}Mint Successful{/}\n`);
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
            {
                name: 'useImplicitMint',
                type: 'boolean',
                optional: true,
                value: false,
            },
            {
                name: 'gasLimit',
                type: 'number',
                optional: true,
            },
            {
                name: 'count',
                type: 'number',
                optional: true,
                value: 1,
            },
            {
                name: 'to',
                type: 'string',
                optional: true,
            },
        ],
    };
    exports.default = version;
});
//# sourceMappingURL=mint.js.map