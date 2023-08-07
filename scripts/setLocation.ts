import {
    getProject,
    getProjectFullName,
    getProjectSource,
} from '../app/projects';
import {
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
const setLocation: InfinityMintScript = {
    name: 'SetLocation',
    description: 'Sets the export location of a project',
    execute: async (script: InfinityMintScriptParameters) => {
        let session = readGlobalSession();
        let config = getConfigFile();

        let project: InfinityMintProject;
        if (script.args.project)
            project = getProject(script.args.project.value);
        else project = script.project;

        if (!script.args.location) {
            //open thing finder if script mode
            if (isScriptMode()) {
            } else {
            }
        }

        let locations = readLocations();
        locations[getProjectFullName(project)] = script.args.location.value;
        saveLocations();

        script.log(
            `\n{cyan-fg}{bold}Export location for ${getProjectFullName(
                project
            )}{/} => ${locations[getProjectFullName(project)]}\n`
        );
    },
    arguments: [
        {
            name: 'location',
            type: 'string',
            optional: true,
        },
    ],
};
export default setLocation;
