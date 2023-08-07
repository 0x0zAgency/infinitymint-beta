import {
	deleteDeployedProject,
	getCurrentProject,
	hasDeployedProject,
} from '../../app/projects'

import { InfinityMintProject } from '../../app/interfaces'
import { exposeLogs } from '../../app/helpers'
import type InfinityConsole from '../../app/console'
import { load } from '../../core'
import { assert } from 'chai'

describe('Setting the location of InfinityMintProjects', async () => {
	let infinityConsole: InfinityConsole

	infinityConsole = await load({
		scriptMode: true,
		test: true,
	})

	let project: InfinityMintProject
	let verion = project.version || '1.0.0'

	if (getCurrentProject()) {
		project = getCurrentProject() as InfinityMintProject
	}

	it('Asserts that the project is set to the currently selected project', () => {
		assert(project === getCurrentProject())
	})
})