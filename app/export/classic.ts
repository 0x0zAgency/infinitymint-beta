import { cwd, getUUID, logDirect } from '../helpers';
import { InfinityMintExportScript } from '../interfaces';
import Default from './default';
import fs from 'fs';
export const classicExport: InfinityMintExportScript = {
    name: 'Cassic',
    export: async (script) => {
        await Default.export(script);

        let contracts = {};
        Object.keys(script.project.deployments).map((key) => {
            contracts[key] = script.project.deployments[key].address;
        });
        //write deploy info
        let deployInfo = {
            chainId: script.project.network.chainId,
            network: script.project.network.name,
            project: script.project.name,
            deployer: script.project.deployer,
            modules: script.project.modules,
            id: getUUID(),
            contracts: contracts,
        };

        let location = script.location;
        if (location[location.length - 1] !== '/') location = location + '/';
        let deployInfoLocation = location + 'src/Deployments/deployInfo.json';
        let chainIdLocation = location + 'src/Deployments/.chainId';

        if (deployInfoLocation.indexOf(cwd()) === -1)
            deployInfoLocation = cwd() + '/' + deployInfoLocation;

        if (chainIdLocation.indexOf(cwd()) === -1)
            chainIdLocation = cwd() + '/' + chainIdLocation;

        script.log('Writing deploy info to ' + deployInfoLocation);
        fs.writeFileSync(deployInfoLocation, JSON.stringify(deployInfo));

        script.log('Writing chainId to ' + chainIdLocation);
        fs.writeFileSync(
            chainIdLocation,
            script.project.network.chainId.toString()
        );
    },
    roots: [
        {
            type: 'imports',
            usePublic: true,
            location: 'imports/',
        },
        {
            type: 'projects',
            location: 'Deployments/projects/',
            onlyName: true,
            useRoot: true,
        },
        {
            type: 'deployedProjects',
            useRoot: true,
            onlyName: true,
            location: 'Deployments/projects/',
        },
        {
            type: 'public',
            location: '/public/',
        },
        {
            type: 'assets',
            usePublic: true,
            location: 'assets/%projectName%@%projectVersion%/',
        },
        {
            type: 'paths',
            usePublic: true,
            location: 'assets/%projectName%@%projectVersion%/paths/',
        },
        {
            type: 'deployments',
            useRoot: true,
            location: 'Deployments/',
        },
        {
            type: 'gemDeployments',
            useRoot: true,
            location: 'Deployments/',
        },
        {
            type: 'components',
            location: '/src/Components/',
        },
        {
            type: 'pages',
            location: '/src/Pages/',
        },
        {
            type: 'styles',
            useRoot: true,
            location: 'Styles/',
        },
        {
            type: 'root',
            location: 'src/',
        },
        {
            type: 'images',
            useRoot: true,
            location: 'Images/',
        },
        {
            type: 'gems',
            useRoot: true,
            location: 'mods/',
        },
        {
            type: 'gemPages',
            useRoot: true,
            location: 'gems/%gemName%/Pages',
        },
        {
            type: 'gemComponents',
            useRoot: true,
            location: 'gems/%gemName%/Components',
        },
        {
            type: 'gemResources',
            useRoot: true,
            location: 'gems/%gemName%/Resources',
        },
        {
            type: 'gemStyles',
            useRoot: true,
            location: 'gems/%gemName%/Styles',
        },
        {
            type: 'fonts',
            useRoot: true,
            location: 'Fonts/',
        },
    ],
    description: 'Default export script',
};
Default.roots = classicExport.roots;
export default classicExport;
