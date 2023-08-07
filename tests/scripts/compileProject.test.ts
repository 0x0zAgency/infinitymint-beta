import {
    deleteCompiledProject,
    getCompiledProject,
    getCurrentProject,
    getProjectFullName,
    hasCompiledProject,
} from '../../app/projects'

import {
    InfinityMintProject,
    InfinityMintCompiledProject,
} from '../../app/interfaces'

import fs from 'node:fs'

import { assert } from 'chai'
import type InfinityConsole from '../../app/console'
import { load } from '../../core'

/**
 * InfinityMint should compile a project within the `/projects` folder.
 * The result will be a JSON file with at *least* a `static` key.
 * If neither of these conditions are met, the test fails.
 */
describe('Compile InfinityMint Projects', () => {
    let infinityConsole: InfinityConsole
    it('Should load InfinityMint', async () => {
        infinityConsole = await load({
            scriptMode: true,
            test: true,
        })
    })

    let compiledProject: InfinityMintCompiledProject
    let project: InfinityMintProject
    
    it('Should compile the current project.', async () => {
        project = getCurrentProject() as InfinityMintProject

        if (!project) throw new Error('no current project')

        if (hasCompiledProject(project)) {
            deleteCompiledProject(getCompiledProject(project))
        }

        await infinityConsole.executeScript('compile', {})
        compiledProject = getCompiledProject(project)
    })

    it('Ensures that the required keys exist within the newly compiled project', () => {
        assert.isNotNull(
            compiledProject,
            "[ERR]: Spooky. The compiled project doesn't exist after compilation."
        )
        assert.strictEqual(
            compiledProject.name,
            project.name,
            '[ERR]: Project does not have a name!'
        )
        assert.isTrue(
            compiledProject.compiled,
            '[ERR]: Project is not compiled!'
        )
        assert.isNotNull(
            compiledProject.imports,
            '[ERR]: Project is missing imports!'
        )
        assert.isNotNull(
            compiledProject.name,
            '[ERR]: Project does not have a name!'
        )
    })
})
