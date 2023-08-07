import { readReport } from '@app/gasAndPrices';
import InfinityConsole from '../../app/console';
import { load } from '../../core';
import { expect, assert } from 'chai';

describe('Report - Generating project gas reports', async () => {
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

    it('Fails when there is no valid project set', () => {});
});
