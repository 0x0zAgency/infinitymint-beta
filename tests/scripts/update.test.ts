import { warning } from '@app/helpers';
import InfinityConsole from '../../app/console';
import { load } from '../../core';
import { expect, assert } from 'chai';
import { getCurrentCompiledProject } from '../../app/projects';

describe('Update Script Test Casing', async () => {
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
        if (!getCurrentCompiledProject())
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
});
