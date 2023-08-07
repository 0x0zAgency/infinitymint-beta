import {
    getCurrentCompiledProject,
    getCurrentDeployedProject,
    hasDeployedProject,
} from '../../app/projects';
import InfinityConsole from '../../app/console';
import { load } from '../../core';
import { expect, assert } from 'chai';
import { warning } from '@app/helpers';

describe('Mint Script Test Casing', async () => {
    //boilerplate
    let infinityConsole: InfinityConsole;
    before(() => {
        return new Promise((resolve) => {
            load({
                test: true,
                onlyCurrentNetworkEvents: true,
                startExpress: false,
                startGanache: false,
                startWebSocket: false,
                network: 'hardhat',
            })
                .then((console) => {
                    infinityConsole = console;
                    resolve(console);
                })
                .catch((e) => {
                    warning(
                        'Could not load Infinitymint testing environment. Please check your configuration.\nIf you are running this test in a CI environment, please make sure you have the correct configuration.'
                    );
                    warning(e.stack);
                });
        });
    });

    it('should check if the default project has been deployed, if it hasnt then deploy it', async () => {
        if (!getCurrentDeployedProject())
            await expect(
                infinityConsole.executeScript('make', {
                    redeploy: {
                        name: 'redeploy',
                        value: true,
                    },
                    recompile: {
                        name: 'recompile',
                        value: !getCurrentCompiledProject(),
                    },
                    save: {
                        name: 'save',
                        value: true,
                    },
                })
            ).to.not.be.rejectedWith(Error);
    });

    it('should check if mints are enabled, if they arent enable them', async () => {
        let project = await infinityConsole.getCurrentProject();
        let erc721 = await project.erc721();

        if (!(await erc721.mintsEnabled()))
            await expect(erc721.setMintsEnabled(true)).to.not.be.rejectedWith(
                Error
            );

        expect(await erc721.mintsEnabled()).to.be.true;
    });

    it('should mint a token, currentTokenId should be zero or greater, names should not be zero, pathID should be 0 or greater, assets should exist, owner should not be undefined', async () => {
        let project = await infinityConsole.getCurrentProject();
        let result = await project.mint();

        expect(result.tokenId).to.be.greaterThanOrEqual(0);
        expect(result.getNames().length).to.be.greaterThanOrEqual(0);
        expect(result.pathId).to.be.greaterThanOrEqual(0);
        expect(result.getAssets().length).to.be.greaterThanOrEqual(0);
        expect(result.owner).to.not.be.undefined;
    });
});
