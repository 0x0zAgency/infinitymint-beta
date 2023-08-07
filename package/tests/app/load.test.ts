import { warning } from '../../app/helpers';
import InfinityConsole from '../../app/console';
import { load } from '../../core';
import { expect } from 'chai';

describe('Load Infinitymint Testing Environment', async () => {
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

    it('should have loaded InfinityMint', async () => {
        expect(infinityConsole).to.not.be.undefined;
    });

    it('should have loaded the current network and it should equal hardhat', async () => {
        expect(infinityConsole.network).to.not.be.undefined;
        expect(infinityConsole.network.name).to.equal('hardhat');
    });

    it('should have a current project, if it does not it should error', async () => {
        let currentProject = await infinityConsole.getCurrentProject();
        if (!currentProject) expect(currentProject).to.be.null;

        expect(currentProject).to.not.be.undefined;
    });

    it('should have loaded some scripts', async () => {
        expect(infinityConsole.getScripts().length).to.be.greaterThan(0);
    });

    it('should have loaded some projects', async () => {
        expect(infinityConsole.getProjects()).to.not.be.undefined;
        expect(infinityConsole.getProjects().projects.length).to.be.greaterThan(
            0
        );
    });
});
