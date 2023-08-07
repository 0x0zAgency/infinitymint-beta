import {
    deleteDeployedProject,
    getCurrentProject,
    hasDeployedProject,
} from '../../app/projects';

import { InfinityMintProject } from '../../app/interfaces';
import { exposeLogs } from '../../app/helpers';
import type InfinityConsole from '../../app/console';
import { load } from '../../core';

/**
 * Deploy InfinityMint projects.
 * Each project is of course determined by the project file.
 * If a deployment fails, it will show an error why it failed.
 * If not, then pass.
 * All errors are shown as to why they failed either before compilation or during deployment.
 */
describe('Deploy InfinityMint Projects', () => {
    let infinityConsole: InfinityConsole;

    it('Should load InfinityMint', async () => {
        infinityConsole = await load({
            scriptMode: true,
            test: true,
        });
    });

    it('Deploys an InfinityMint Project', async () => {
        let project = getCurrentProject() as InfinityMintProject;

        if (!project) {
            throw new Error(
                '[ERR]: No current project set! Set one prior to testing.'
            );
        }

        // * Currently these are the only chains InfinityMint officially supports,
        // * so it's what we'll test.
        if (
            // ? Probabbly unnecesary conversion to lowercase? Oh well!
            infinityConsole.getCurrentNetwork().name.toLocaleLowerCase() ===
                'ethereum' ||
            infinityConsole.getCurrentNetwork().name.toLocaleLowerCase() ===
                'polygon' ||
            infinityConsole.getCurrentNetwork().name.toLocaleLowerCase() ===
                'mumbai'
        ) {
            throw new Error(
                '[GOOD ERR]: Whew! You almost tested on a real chain.\
				Switch to hardhat or ganache first, then try again.'
            );
        }

        if (
            hasDeployedProject(
                project,
                infinityConsole.getCurrentNetwork().name
            )
        ) {
            deleteDeployedProject(
                project,
                infinityConsole.getCurrentNetwork().name
            );
        }

        await infinityConsole.executeScript('deploy', {});
        // No further testing required. It either deploys or it doesn't.
    });
});
