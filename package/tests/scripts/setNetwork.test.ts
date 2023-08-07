import {
    readGlobalSession,
    saveGlobalSessionFile,
    warning,
} from '../../app/helpers';
import InfinityConsole from '../../app/console';
import { load } from '../../core';
import { assert } from 'chai';

describe('Set Network Script Test Casing', async () => {
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

    it('Sets the current network to hardhat', async () => {
        await infinityConsole.executeScript('setNetwork', {
            network: {
                name: 'hardhat',
                value: 'hardhat',
            },
        });

        let session = readGlobalSession();
        assert.equal(session.environment.defaultNetwork, 'hardhat');
    });

    // TODO: Your test casing here.
});
