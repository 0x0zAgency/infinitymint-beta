import { InfinityMintObject } from '@typechain-types/Minter';
import {
    InfinityMintCompiledProject,
    InfinityMintDeployedProject,
    InfinityMintProjectAsset,
    KeyValue,
} from './interfaces';
import { Project } from './projects';
import { waitForTx } from './web3';
import { Dictionary, getRandomNumber } from './helpers';
import { TransactionReceipt } from '@ethersproject/abstract-provider';

export class Token {
    constructor(
        public project: Project,
        public tokenId: number,
        protected raw?: InfinityMintObject.InfinityObjectStructOutput,
        public receipt: TransactionReceipt = null
    ) {}

    public async load() {
        this.raw = await this.get();
    }

    public get rarity() {
        let path = this.getPath();

        if (path.rarity) return path.rarity;

        //else, work out the precentage of getting this path from all the paths
        let paths = this.project.getDeployedProject().paths;
        let rarity = (100 / paths.length).toFixed(2);
        return rarity;
    }

    public get output() {
        return this.raw;
    }

    public async get(): Promise<InfinityMintObject.InfinityObjectStructOutput> {
        return (await this.project.storage()).get(this.tokenId);
    }

    public getPath(): InfinityMintDeployedProject['paths'][number] {
        return this.project.getDeployedProject().paths[this.raw.pathId];
    }

    public getAssets(): InfinityMintDeployedProject['assets'][number][] {
        return this.raw.assets.map((assetId) => {
            if (assetId === 0)
                return {
                    name: '{red-fg}skipped{/red-fg}',
                    fileName: 'None',
                };
            return this.project.getAsset(assetId);
        });
    }

    public colours(): string[] {
        return [];
    }

    public get owner() {
        return this.raw.owner;
    }

    public get name() {
        return this.getNames().join(' ');
    }

    public get pathId() {
        return this.raw.pathId;
    }

    public async transfer(to: string) {
        let erc721 = await this.project.erc721();

        let tx = await erc721.transferFrom(this.owner, to, this.tokenId);

        await waitForTx(
            tx,
            `transfer token ${this.tokenId} from ${this.owner} to ${to}`
        );

        //reload token
        await this.load();
    }

    public async isFlagTrue(flag: string): Promise<boolean> {
        let flags = await this.project.flags();
        return flags.isFlagTrue(this.tokenId, flag);
    }

    public async isGlobalFlag(flag: string): Promise<boolean> {
        let flags = await this.project.flags();
        return flags.isGlobalFlag(flag);
    }

    public async setFlag(flag: string, value: boolean) {
        let flags = await this.project.flags();
        let tx = await flags.setFlag(this.tokenId, flag, value);
        await waitForTx(tx, `set flag ${flag} to ${value}`);
    }

    public getNames(): string[] {
        let names = this.raw.names.map(
            (name: string | number) =>
                this.project.getDeployedProject().meta.names[name]
        );
        return names;
    }
}

export const generateToken = (
    project: InfinityMintDeployedProject | InfinityMintCompiledProject,
    pathId?: number
) => {
    let paths = project.paths;
    let rarity = project.meta?.usingRarity;
    pathId = pathId || getRandomNumber(paths.length);
    if (rarity) {
        let rarityIndex = Math.floor(Math.random() * 100);
        let rarities = {};
        paths.forEach((path) => {
            if (rarityIndex <= path.rarity) rarities[path.pathId] = path.rarity;
        });

        pathId =
            rarities[
                Math.floor(Math.random() * Object.values(rarities).length)
            ];

        if (project.settings.values.highestRarity) {
            //select the highest rarity on the object
            pathId = parseInt(
                Object.keys(rarities).reduce((a, b) =>
                    rarities[a] > rarities[b] ? a : b
                )
            );
        }

        if (project.settings.values.lowestRarity) {
            //select the lowest rarity on the object
            pathId = parseInt(
                Object.keys(rarities).reduce((a, b) =>
                    rarities[a] < rarities[b] ? a : b
                )
            );
        }
    }

    let assets = [];
    let assetSections: Dictionary<InfinityMintProjectAsset[]> = {};
    Object.values(project.meta.assets.sections).forEach((section) => {
        assetSections[section] = [];
        //find assets for sections
        Object.values(project.assets).forEach((asset) => {
            if (asset.section === section) assetSections[section].push(asset);
        });
    });

    Object.keys(assetSections).forEach((section) => {
        let assetSection = assetSections[section];
        let selection = [];

        Object.values(assetSection).forEach((asset) => {
            let assetRaityIndex = getRandomNumber(100);
            if (assetRaityIndex <= (asset.rarity || 100)) selection.push(asset);
        });

        if (selection.length === 0) {
            assets.push(0);
        } else {
            let asset = selection[getRandomNumber(selection.length)];
            assets.push(asset.assetId);
        }
    });

    let names = [];

    //if we are in matched mode, then make the name equal the path name and the token name
    if (project.settings.values.matchedMode) {
        names.push(pathId);
        names.push(0);
    } else {
        let nameCount =
            Math.floor(
                getRandomNumber(project.settings?.values?.nameCount || 4)
            ) + 1;

        for (let i = 0; i < nameCount; i++) {
            let nameId = Math.floor(
                Math.random() * Object.values(project.meta.names).length
            );
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
    } as InfinityMintObject.InfinityObjectStruct;
};

export interface InfinityMintToken
    extends InfinityMintObject.InfinityObjectStruct {
    minted?: boolean;
    name?: string;
    data?: KeyValue;
}

export const createToken = async (
    project?: InfinityMintDeployedProject
): Promise<InfinityMintToken> => {
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
};
