import { getProjectSource } from '../app/projects';
import { readGlobalSession, saveGlobalSessionFile } from '../app/helpers';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';

const setProject: InfinityMintScript = {
    name: 'SetProject',
    description: 'Sets the current working project',
    execute: async (script: InfinityMintScriptParameters) => {
        let session = readGlobalSession();
        let project = getProjectSource(script.args.project.value);
        session.environment.project = project;
        session.environment.defaultProject = script.args.project.value;
        saveGlobalSessionFile(session);
        script.log('\nCurrent project set to => ' + script.args.project.value);
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: false,
        },
    ],
};
export default setProject;
