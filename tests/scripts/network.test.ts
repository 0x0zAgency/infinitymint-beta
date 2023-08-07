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

describe('Deploy InfinityMint Projects', () =>
{
	let infinityConsole: InfinityConsole

	it('Should load InfinityMint', async () =>
	{
		infinityConsole = await load({
			dontDraw: true,
			scriptMode: true,
		});

		infinityConsole
			.getConsoleLogs()
			.emitter
			.on('log', message => {
				logDirect(message);
			});

		// Output all loggging
		setAllowPiping(false);
		setDirectlyOutputLogs(true);
		setExposeConsoleHostMessage(true);
	})

    it('Finds the current network', () =>
    {
        let session = readGlobalSession()
        console.info!(session.environment.defaultNetwork)
    })
})