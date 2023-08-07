declare const basic: {
    name: string;
    description: string;
    settings: {
        allowModuleChoice: boolean;
        allowGemChoice: boolean;
        allowRoyalty: boolean;
        allowPathInput: boolean;
    };
    gems: {};
    inputs: {
        name: string;
        type: string;
        tab: string;
        description: string;
    }[];
    create: (script: any) => Promise<void>;
};
export default basic;
//# sourceMappingURL=erc721.d.ts.map