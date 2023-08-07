import {
	getCurrentProject,
	getProject,
	getProjectFullName,
	hasCompiledProject,
	hasDeployedProject,
	getCompiledProject,
	getDeployedProject,
	deleteCompiledProject,
	deleteDeployedProject
} from '../../app/projects'

import { exposeLogs } from '../../app/helpers'
import { load } from '../../core'
import type InfinityConsole from '../../app/console'
import { InfinityMintCompiledProject, InfinityMintProject } from '../../app/interfaces'
import { expect, assert } from 'chai'

describe('Produce Script tests', async () => {
	let infinityConsole: InfinityConsole

	infinityConsole = await load({
		scriptMode: true,
		test: true,
	})

	let project: InfinityMintProject
	let compiledProject: InfinityMintCompiledProject
	let verion = project.version || '1.0.0'

	if (getCurrentProject()) {
		project = getCurrentProject() as InfinityMintProject
	}

	if (hasCompiledProject(project)) {
		deleteCompiledProject(getCompiledProject(project))
	}

	await infinityConsole.executeScript('compile', {})
	compiledProject = getCompiledProject(project)

	// * Currently these are the only chains InfinityMint officially supports,
	// * so it's what we'll test.
	if (
		infinityConsole.getCurrentNetwork().name.toLocaleLowerCase() === 'ethereum'
		|| infinityConsole.getCurrentNetwork().name.toLocaleLowerCase() === 'polygon'
		|| infinityConsole.getCurrentNetwork().name.toLocaleLowerCase() === 'mumbai'
	) {
		throw new Error(
			'[GOOD ERR]: Whew! You almost tested on a real chain.\
			Switch to hardhat or ganache first, then try again.'
		)
	}

	if (hasDeployedProject(project, infinityConsole.getCurrentNetwork().name)) {
		deleteDeployedProject(project, infinityConsole.getCurrentNetwork().name)
	}

	await infinityConsole.executeScript('deploy', {});

	it('Produces a full InfinityMint project, compiled, deployed & exported.', () => {

	})
})

describe('Produce Script tests', () => {
	it("Does *something*, I suppose. Produces stuff. If it ain't it's broke.", () => {})
})
