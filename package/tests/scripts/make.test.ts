import { warning } from '@app/helpers';
import InfinityConsole from '../../app/console';
import { load } from '../../core';
import { expect, assert } from 'chai';

describe('Make Script Test Casing', async () => {
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
    //boilerplate
    it('should throw at trying to make an invalid project', async () => {
        await expect(
            infinityConsole.executeScript('make', {
                project: {
                    name: 'project',
                    value: 'amogus_amogus_amogus_amogus',
                },
            })
        ).to.be.rejectedWith(Error);
    });

    it('should make the current project successfully with out needing a project flag, should redeploy and recompile. Should not export since we are on ganche.', async () => {
        await expect(
            infinityConsole.executeScript('make', {
                redeploy: {
                    name: 'redeploy',
                    value: true,
                },
                recompile: {
                    name: 'recompile',
                    value: true,
                },
                save: {
                    name: 'save',
                    value: true,
                },
            })
        ).to.not.be.rejectedWith(Error);
    });
});
