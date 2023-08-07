# Testing InfinityMint

Testing InfinityMint requires a boilerplate in order to successfully launch the `InfinityConsole`
required for testing individual functions.

This boilerplate is below:

```js
import InfinityConsole from '../../app/console';
import { load } from '../../core';
import { expect, assert } from 'chai';

describe('My test case', async () => {
    //boilerplate
    let infinityConsole: InfinityConsole;
    before(() => {
        return new Promise((resolve) => {
            load({
                test: true, // Enable testing mode
                onlyCurrentNetworkEvents: true, // Use only the network events registered
                startExpress: false, // Do not enable the express server unless being tested!
                startGanache: false, // Run ganache separately from the tests.
                startWebSocket: false, // Do not enable websockets unless being tested!
                network: 'hardhat', // Hardhat should be your default testing network
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
    // TODO: Your test casing here.
});
```
