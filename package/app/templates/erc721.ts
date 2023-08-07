const basic = {
    name: '{cyan-fg}ERC721{/cyan-fg} - InfinityMint',
    description: 'Basic template',
    settings: {
        allowModuleChoice: true,
        allowGemChoice: true,
        allowRoyalty: true,
        allowPathInput: true,
    },
    gems: {},
    inputs: [
        {
            name: 'name',
            type: 'string',
            tab: 'general',
            description: 'Name of the project',
        },
        {
            name: 'tokenSymbol',
            type: 'string',
            tab: 'token',
            description: 'Symbol of the token',
        },
        {
            name: 'tokenName',
            type: 'string',
            tab: 'token',
            description: 'Name of the token',
        },
        {
            name: 'maxSupply',
            type: 'number',
            tab: 'token',
            description: 'Max Supply',
        },
        {
            name: 'baseURI',
            type: 'string',
            tab: 'uri',
            description: 'Base URI for the token',
        },
    ],
    create: async (script) => {},
};

export default basic;
