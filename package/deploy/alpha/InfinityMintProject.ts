import { InfinityMintProject } from '@typechain-types/InfinityMintProject';
import { InfinityMintProjectDeployScript } from '@infinitymint-types/deployments';
import { warning } from '../../app/helpers';
import { isAllowingIPFS } from '../../app/ipfs';
import { ethers } from 'hardhat';
import { getFullyQualifiedName } from '../../app/projects';

const InfinityMintProject: InfinityMintProjectDeployScript = {
    //going to give
    module: 'project',
    index: 8, //should be after IM minter
    solidityFolder: 'alpha',
    permissions: ['all'],
    post: async (params) => {
        let { deployment, project, log, infinityConsole } = params;
        let projectContract = await deployment.write();

        //this is where we would upload to IPFS
        if (!isAllowingIPFS()) {
            warning(
                `IPFS is not enabled, skipping upload and setting initial project to be local true`
            );

            let bytes = ethers.utils.hexlify(
                ethers.utils.toUtf8Bytes(
                    '%JSON%' +
                        JSON.stringify({
                            local: true,
                            name: project.name,
                            version: project.version,
                        })
                )
            );

            await projectContract.setInitialProject(bytes),
                'Set Initial Project';

            return;
        } else {
            log(`{cyan-fg}{bold}Uploading project to IPFS...{/}`);
            let cid = await infinityConsole.IPFS.uploadJson(
                project,
                getFullyQualifiedName(
                    project,
                    null,
                    infinityConsole.network.name
                ) + '.json'
            );

            log(
                '{green-fg}{bold}Uploaded project to IPFS to path{/} => ' +
                    cid +
                    '/' +
                    getFullyQualifiedName(
                        project,
                        null,
                        infinityConsole.network.name
                    )
            );
            let bytes = ethers.utils.hexlify(
                ethers.utils.toUtf8Bytes('%CID%' + cid)
            );

            await projectContract.setInitialProject(bytes),
                'Set Initial project';
        }
    },
};
export default InfinityMintProject;
