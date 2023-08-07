# Testing InfinityMint

Testing InfinityMint requires a boilerplate in order to successfully launch the `InfinityConsole`
required for testing individual functions.

This boilerplate is below:

```js
import
{
    setDirectlyOutputLogs,
    setAllowPiping,
    setExposeConsoleHostMessage,
    logDirect,
    readGlobalSession,
} from '../../app/helpers'

import type InfinityConsole from '../../app/console'
import { load } from '../../core'

describe('Compile InfinityMint Projects', () =>
{
    let infinityConsole: InfinityConsole;

    it('Should load InfinityMint', async () =>
    {
        infinityConsole = await load({
            dontDraw: true,
            scriptMode: true
        })

        infinityConsole
            .getConsoleLogs()
            .emitter
            .on('log', msg =>
                logDirect(msg));
 
        // Output all loggging
        setAllowPiping(false)
        setDirectlyOutputLogs(true)
        setExposeConsoleHostMessage(true)
    })

    // TODO: Your test casing here.
})
```
