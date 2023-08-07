(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const example = {
        name: '0x0zAgency Mounts',
        price: '$1',
        modules: {
            random: 'SeededRandom',
            assets: 'SimpleSVG',
            minter: 'DefaultMinter',
            royalty: 'DefaultRoyalty',
        },
        information: {
            tokenSymbol: '🟨',
            tokenSingular: '🟨',
        },
        permissions: {
            all: [],
        },
        settings: {
            erc721: {
                generateTokenURI: false,
            },
            values: {
                maxSupply: 1000,
                matchedMode: true,
            },
        },
        paths: [
            {
                name: '0xDorothy',
                fileName: '/imports/0x0z/0xDorothy.svg',
            },
            {
                name: '0xScarecrow',
                fileName: '/imports/0x0z/0xScarecrow.svg',
            },
            {
                name: '0xTinman',
                fileName: '/imports/0x0z/0xTinman.svg',
            },
            {
                name: '0xLionheart',
                fileName: '/imports/0x0z/0xLionheart.svg',
            },
            {
                name: '0xToto',
                fileName: '/imports/0x0z/0xToto.svg',
            },
            {
                name: '0xBadWitch',
                fileName: '/imports/0x0z/0xWitch-Bad.svg',
            },
            {
                name: '0xGoodWitch',
                fileName: '/imports/0x0z/0xWitch-Good.svg',
            },
            {
                name: '0xWizard',
                fileName: '/imports/0x0z/0xWizardof0z.svg',
            },
        ],
    };
    exports.default = example;
});
//# sourceMappingURL=example.js.map