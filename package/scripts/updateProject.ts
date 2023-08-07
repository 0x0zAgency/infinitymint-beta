import { applyUpdate, getUpdate, hasUpdate } from '../app/updates';
import {
    InfinityMintCompiledProject,
    InfinityMintScript,
} from '../app/interfaces';
import { action, prepare } from '../app/web3';
import {
    cwd,
    getArgumentValues,
    getInfinityMintVersion,
    readGlobalSession,
} from '../app/helpers';
import fs from 'fs';
import {
    createTemporaryProject,
    getFullyQualifiedName,
    getProjectName,
    hasCompiledProject,
    hasDeployedProject,
    removeTempCompliledProject,
    removeTempDeployedProject,
} from '../app/projects';
import JSZip from 'jszip';
import { getImports } from '../app/imports';
import { isAllowingIPFS } from '../app/ipfs';

const updateProject: InfinityMintScript = {
    name: 'Update',
    description:
        'Updates a project by reading any changes which have occured and then setting them on chain',
    execute: async (script) => {
        await script.infinityConsole.loadUpdates();

        let newVersion = script.args.newVersion.value;

        let currentVersion =
            script.project.deployedProject?.version?.version ||
            script.project.compiledProject?.version?.version ||
            '1.0.0';

        let { useCompiled, save, uploadBundle } = getArgumentValues(
            script.args
        );

        if (newVersion === currentVersion)
            throw new Error(`Project is already at version ${newVersion}`);

        //check that currentVersion is not greater than newVersion
        let currentVersionDots = currentVersion.split('.');
        let newVersionDots = newVersion.split('.');
        for (let i = 0; i < currentVersionDots.length; i++) {
            if (parseInt(currentVersionDots[i]) > parseInt(newVersionDots[i]))
                throw new Error(
                    `Current version ${currentVersion} is greater than new version ${newVersion}`
                );
        }

        let project = createTemporaryProject(
            script,
            useCompiled ||
                !hasDeployedProject(
                    script.project.compiledProject,
                    script.infinityConsole.network.name
                )
                ? 'compiled'
                : 'deployed',
            null,
            null,
            newVersion
        );

        let update = await getUpdate(
            script.project.deployedProject || script.project.compiledProject,
            newVersion
        );

        if (!update)
            throw new Error(
                `Update ${newVersion} not read correctly. Could be the update file does not export anything or you need to restart IM`
            );

        update.oldVersion = {
            version: currentVersion,
            tag: script.project.deployedProject?.version?.tag,
        };

        if (
            useCompiled &&
            hasCompiledProject(
                script.project.compiledProject,
                update.version?.version
            )
        )
            throw new Error(
                `Compiled project for update ${update.version?.version} already exists`
            );

        if (
            !useCompiled &&
            hasDeployedProject(
                script.project.compiledProject,
                script.project.network || script.infinityConsole.network.name,
                update.version?.version
            )
        )
            throw new Error(
                `Deployed project for update ${update.version?.version} already exists`
            );

        await prepare(project, script, useCompiled ? 'compiled' : 'deployed');

        let updateAction = await action(
            'update_' + update.version?.version,
            async () => {
                project = await applyUpdate(
                    update,
                    project,
                    script.infinityConsole,
                    script.log
                );
                project.updates = project.updates || {};
                project.updates[update.version?.version || '2.0.0'] = update;
            }
        );

        if (updateAction !== true) throw updateAction;

        project.version = update.version;

        let buildImports = await action(
            'buildImports_' + project.version?.version,
            async () => {
                let imports =
                    (project as InfinityMintCompiledProject).imports || {};
                let keys = Object.keys(imports);
                let importCache = await getImports();

                if (keys.length === 0)
                    throw new Error('project has no imports this is weird!');
                //this is where we need to go over every file reference in the project and include all of them

                let files = {};
                Object.keys(imports).forEach((key) => {
                    if (!files[imports[key]])
                        files[imports[key]] = imports[key];
                });

                script.log(
                    `\n{cyan-fg}{bold}Packing ${
                        Object.keys(files).length
                    } imports...{/}`
                );

                project.bundles = {
                    version: getInfinityMintVersion(),
                    imports: {},
                };

                let rawBundle = {};
                //pack all the files
                await Promise.all(
                    Object.keys(files).map(async (file: string) => {
                        let path = importCache.database[importCache.keys[file]];

                        let location = (path.dir + '/' + path.base).split(
                            'imports'
                        )[1];
                        if (path === undefined || path.dir === undefined)
                            return;

                        project.bundles.imports[importCache.keys[file]] = path;
                        rawBundle[location] = await fs.promises.readFile(
                            path.dir + '/' + path.base
                        );
                        project.bundles.imports[importCache.keys[file]].bundle =
                            location;
                        script.log(`\t{cyan-fg}Read => ${location}{/}`);
                    })
                );

                //build a zip file out of each member of the raw bundle
                let zip = new JSZip();
                Object.keys(rawBundle).forEach((key) => {
                    script.log(`\t\t{green-fg}Zipping => ${key}{/}`);
                    zip.file(key, rawBundle[key]);
                });

                let projectFile = getProjectName(
                    project,
                    project.version?.version
                );
                script.log(`\t\t{green-fg}Zipping => ${projectFile}.json{/}`);
                zip.file(projectFile + '.json', JSON.stringify(project));
                let source = project.source.dir + '/' + project.source.base;
                script.log(
                    `\t\t{green-fg}Zipping => ${
                        project.name + project.source.ext
                    }{/}`
                );
                zip.file(
                    project.name + project.source.ext,
                    fs.readFileSync(source)
                );

                let zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

                script.log(`\t{cyan-fg}Saving Bundle...{/}`);
                if (!fs.existsSync(cwd() + '/projects/bundles/'))
                    fs.mkdirSync(cwd() + '/projects/bundles/');

                await fs.promises.writeFile(
                    `${cwd()}/projects/bundles/${getFullyQualifiedName(
                        project
                    )}.bundle`,
                    zipBuffer
                );
                let zippedSize = zipBuffer.length / 1024;
                script.log('{green-fg}Bundle Wrote Successfully{/}');
                script.log(
                    `\t{cyan-fg}Bundle Size  => ${(zippedSize / 1024).toFixed(
                        2
                    )}mb {/}`
                );
            }
        );

        if (buildImports !== true) throw buildImports;

        if (uploadBundle && isAllowingIPFS()) {
            let upload = await action(
                'uploadBundle_' + project.version?.version,
                async () => {
                    let bundle = await fs.promises.readFile(
                        `${cwd()}/projects/bundles/${getFullyQualifiedName(
                            project
                        )}.bundle`
                    );

                    let bundleHash = await script.infinityConsole.IPFS.add(
                        bundle,
                        'index.zip'
                    );

                    let session = readGlobalSession();

                    script.log(
                        `\n{cyan-fg}{bold}Uploaded Bundle to IPFS => ${bundleHash}{/}`
                    );
                    session.environment.bundles =
                        session.environment.bundles || {};
                    session.environment.bundles[
                        getFullyQualifiedName(project)
                    ] = {
                        hash: bundleHash,
                        size: bundle.length,
                    };

                    project.meta.bundle = bundleHash;
                }
            );

            if (upload !== true) throw upload;
        }

        if (save && useCompiled)
            fs.writeFileSync(
                cwd() +
                    '/projects/compiled/' +
                    project.name +
                    '@' +
                    project.version?.version +
                    '.json',
                JSON.stringify(project)
            );
        else if (save)
            fs.writeFileSync(
                cwd() +
                    '/projects/deployed/' +
                    project.network?.name +
                    '/' +
                    getFullyQualifiedName(project) +
                    '.json',
                JSON.stringify(project)
            );

        if (useCompiled) removeTempCompliledProject(project);
        else removeTempDeployedProject(project);

        await script.infinityConsole.loadProjects();

        script.log('\n{green-fg}{bold}Update successfully Applied{/}');
        script.log(`\tProject: ${update.name}`);
        script.log(
            `\tUpdated From => (${script.project.version}) to (${update.version?.version})`
        );
        script.log(
            `\tVersion: ${update.version.version} (${update.version.tag})\n` +
                (update.network
                    ? `\tNetwork: ${update.network.name} (chainId:${update.network.chainId})`
                    : '\tNetwork: global (all networks)')
        );

        if (!save)
            script.log(
                '\n{yellow-fg}{bold}Note: Project update was not saved to disk{/}'
            );
    },
    arguments: [
        {
            name: 'project',
            optional: true,
        },
        {
            name: 'save',
            type: 'boolean',
            optional: true,
            value: true,
        },
        {
            name: 'uploadBundle',
            type: 'boolean',
            optional: true,
            value: true,
        },
        {
            name: 'newVersion',
            type: 'string',
            optional: false,
        },
        {
            name: 'useCompiled',
            type: 'boolean',
            optional: true,
        },
    ],
};
export default updateProject;
