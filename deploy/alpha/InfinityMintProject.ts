import { InfinityMintProject } from '@typechain-types/InfinityMintProject';
import { toTempProject, warning } from '../../app/helpers';
import { InfinityMintDeploymentScript } from '../../app/interfaces';
import { ipfs, isAllowingIPFS } from '../../app/ipfs';
import { ethers } from 'hardhat';
import { logTransaction } from '../../app/web3';

const InfinityMintProject: InfinityMintDeploymentScript = {
    //going to give
    module: 'project',
    index: 8, //should be after values
    solidityFolder: 'alpha',
    permissions: ['all'],
    post: async (params) => {
        let { deployments, project, log } = params;
        let tempProject = toTempProject(project);
        let projectContract = (await deployments[
            'InfinityMintProject'
        ].getSignedContract()) as InfinityMintProject;

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
                            name: tempProject.name,
                            version: tempProject.version,
                        })
                )
            );
            await logTransaction(
                await projectContract.setInitialProject(bytes)
            );
            return;
        } else {
            let bytes = ethers.utils.hexlify(
                ethers.utils.toUtf8Bytes(
                    '%CID%' + (await ipfs.uploadJson(tempProject))
                )
            );

            await logTransaction(
                await projectContract.setInitialProject(bytes)
            );
        }
    },
};
export default InfinityMintProject;
