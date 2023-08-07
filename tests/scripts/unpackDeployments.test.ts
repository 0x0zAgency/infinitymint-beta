import InfinityConsole from '../../app/console';
import { load } from '../../core';
import { expect, assert } from 'chai';

describe('Unpack Deployments', async () => {
    let infinityConsole: InfinityConsole;
    before(() => {
        return new Promise((resolve) => {
            load({
                test: true,
                onlyCurrentNetworkEvents: true,
                scriptMode: true,
                startExpress: false,
                startGanache: false,
                startWebSocket: false,
                network: 'hardhat',
            }).then((console) => {
                infinityConsole = console;
                resolve(console);
            });
        });
    });

    it('Does not ');
});
