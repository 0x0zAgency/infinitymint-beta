import {
    getCurrentProject,
    getProject,
    getProjectFullName,
    getDeployedProject,
    hasDeployedProject,
} from '../../app/projects'

import { exposeLogs, cwd, getExportLocation, isInfinityMint } from '../../app/helpers'
import { load } from '../../core'
import type InfinityConsole from '../../app/console'
import { InfinityMintCompiledProject, InfinityMintProject } from '../../app/interfaces'
import { expect, assert } from 'chai'
import exportProject from '../../scripts/exportProject'

describe('Produce Script tests', async () => {
    let infinityConsole: InfinityConsole

    infinityConsole = await load({
        scriptMode: true,
        test: true,
    })

    let compiledProject: InfinityMintCompiledProject
    let project: InfinityMintProject

    project = getCurrentProject() as InfinityMintProject

    if (!project) {
        throw new Error('\
            [ERR]: No current project is set! Set a project that has a deployed project file first,\
            then re-run this script.'
        )
    }

    if (
        infinityConsole.getCurrentNetwork().name === 'ethereum'
        || infinityConsole.getCurrentNetwork().name === 'polygon'
        || infinityConsole.getCurrentNetwork().name === 'mumbai'
    ) {
        throw new Error('\
            [GOOD ERR]: Whew! You almost deployed to a mainnet! Switch over to hardhat or Ganache first,\
            then try again.'
        )
    }

    // let exportScript = getExportLocation('');
    
})