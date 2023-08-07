import {
    getCurrentProject,
    findProject,
    getFullyQualifiedName,
    getProjectSource,
} from '../app/projects';
import {
    cwd,
    getConfigFile,
    isScriptMode,
    readGlobalSession,
    readLocations,
    saveGlobalSessionFile,
    saveLocations,
} from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
    InfinityMintProject,
} from '../app/interfaces';
import path from 'path';

const setLocation: InfinityMintScript = {
    name: 'Set Export Location',
    description: 'Sets the export location of the current working project',
    execute: async (script: InfinityMintScriptParameters) => {
        let locations = readLocations();
        let location: string = script.args.location?.value;

        if (!location) location = cwd();
        if (location.startsWith('../') || location.startsWith('/../'))
            location = path.join(cwd(), location);

        //resolve it
        location = path.resolve(location);
        //remove new lines and tabs
        location = location.replace(/(\r\n|\n|\r|\t)/gm, '');
        location = location.trim();

        locations[script.project.getFullyQualifiedName()] = location;
        saveLocations();

        script.log(
            `\n{cyan-fg}{bold}Export location for ${script.project.getFullyQualifiedName()} set to{/} => ${
                locations[script.project.getFullyQualifiedName()]
            }\n`
        );
    },
    arguments: [
        {
            name: 'location',
            type: 'string',
            optional: true,
        },
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
    ],
};
export default setLocation;
