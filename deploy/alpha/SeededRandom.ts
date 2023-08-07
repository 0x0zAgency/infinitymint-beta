import { deploy } from '../../app/web3';
import {
    InfinityMintDeploymentScript,
    InfinityMintTempProject,
} from '../../app/interfaces';
import { toTempProject } from '../../app/helpers';

const SeededRandom: InfinityMintDeploymentScript = {
    unique: true,
    module: 'random',
    index: 4,
    deploy: async ({ project, debugLog, deployment, log, contracts }) => {
        let tempProject = toTempProject(project);
        let seedNumber =
            tempProject.settings?.values?.seedNumber ||
            Math.floor(Math.random() * 10000);

        log('{magenta-fg}> Using seed number <' + seedNumber + '>{/}');
        return await deploy(
            deployment.getContractName(),
            tempProject,
            [seedNumber, contracts['values'].address],
            await deployment.getLibaries()
        );
    },
    solidityFolder: 'alpha',
};

export default SeededRandom;
