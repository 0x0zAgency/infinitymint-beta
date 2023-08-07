import {
	setDirectlyOutputLogs,
	setAllowPiping,
	setExposeConsoleHostMessage,
	logDirect,
	readGlobalSession,
} from '../../app/helpers'

import type InfinityConsole from '../../app/console'
import { load } from '../../core'
import { assert } from 'chai'

describe('Set new InfinityMint Project', async () => {
	let infinityConsole: InfinityConsole

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

	it('Sets a new InfinityMintProject', () => {
		let session = readGlobalSession()
		let network = session.environment.defaultNetwork
		let project = session.environment.project

	})
})
