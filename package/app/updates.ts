import InfinityConsole from './console';
import {
    Dictionary,
    cwd,
    debugLog,
    getConfigFile,
    isInfinityMint,
    isTypescript,
    log,
    mergeObjects,
    readGlobalSession,
    replaceSeperators,
    safeGlob,
    saveGlobalSessionFile,
    warning,
} from './helpers';
import { setupProjectImport, verifyImport } from './imports';
import {
    InfinityMintCompiledProject,
    InfinityMintDeployedProject,
    InfinityMintProjectAsset,
    InfinityMintProjectPath,
    InfinityMintProjectUpdate,
    InfinityMintProjectUpdateKey,
} from './interfaces';
import path from 'path';
import fs from 'fs';
import { waitForTx } from './web3';

export interface UpdateCache {
    database: Dictionary<path.ParsedPath>;
    keys?: Dictionary<string>;
    updates: string[];
    projects?: Dictionary<string[]>;
}

const UpdateCache: UpdateCache = {
    database: {},
    keys: {},
    updates: [],
    projects: {},
};

/**
 *
 * @param project
 * @returns
 */
export const getTemporaryUpdates = (
    project: InfinityMintDeployedProject
): Dictionary<InfinityMintProjectUpdate> => {
    let session = readGlobalSession();
    return session?.environment?.updates[project.name] || {};
};

/**
 *
 * @param project
 * @param update
 */
export const saveTemporaryUpdate = (
    project: InfinityMintDeployedProject,
    update: InfinityMintProjectUpdate
) => {
    let session = readGlobalSession();

    session.environment.updates = session.environment.updates || {};
    session.environment.updates[project.name] =
        session.environment.updates[project.name] || {};

    session.environment.updates[project.name][update.version.version] = update;

    saveGlobalSessionFile(session);
};

/**
 * Creates an update
 * @param project
 * @param version
 * @returns
 */
export const createTemporaryUpdate = (
    project: InfinityMintDeployedProject,
    version?: string,
    data: InfinityMintProjectUpdate = {}
): InfinityMintProjectUpdate => {
    version =
        version ||
        data?.version?.version ||
        parseInt(project.version.version.split('.')[0] || '1') + 1 + '.0.0';
    let update = {
        ...data,
        name: project.name,
        version: {
            version,
            tag: data?.version?.tag || version,
        },
    };

    saveTemporaryUpdate(project, update);
    return update;
};

export const getProjectVersions = (
    projectOrName:
        | string
        | InfinityMintDeployedProject
        | InfinityMintCompiledProject
): string[] => {
    let project =
        typeof projectOrName === 'string' ? projectOrName : projectOrName.name;
    return UpdateCache.projects[project];
};

export const formatCacheEntry = (
    update: InfinityMintProjectUpdate,
    newPath: path.ParsedPath,
    name?: string
) => {
    name =
        name ||
        (update.name || newPath.name) + '@' + newPath.dir + '/' + newPath.base;
    let newKeys: Dictionary<string> = {};
    let root: string | string[] = newPath.dir.split('projects');
    if (root.length > 2) root.slice(1).join('projects');
    else root = root[1];
    let nss = root[0] === '/' ? (root as string).substring(1) : root;
    let projectName =
        update.name || (update as any)?.description?.name || newPath.name;
    let network = update.network?.name || projectName.split('_')[1];

    newKeys[path.join(newPath.dir, newPath.base)] = name;
    newKeys[path.join(newPath.dir, newPath.name)] = name;
    newKeys[path.join('/', newPath.name)] = name;
    newKeys[path.join('/', newPath.base)] = name;
    newKeys[path.join('/projects/', newPath.name)] = name;
    newKeys[path.join('projects/', newPath.name)] = name;
    newKeys[path.join('/projects/', newPath.base)] = name;
    newKeys[path.join('projects/', newPath.base)] = name;
    newKeys[path.join(cwd(), newPath.name)] = name;
    newKeys[path.join(cwd(), newPath.base)] = name;
    newKeys[path.join(cwd(), '/projects/' + newPath.name)] = name;
    newKeys[path.join(cwd(), '/projects/' + newPath.base)] = name;
    newKeys[path.join(root as string, newPath.name)] = name;
    newKeys[path.join(root as string, newPath.base)] = name;
    newKeys[path.join(nss as string, newPath.name)] = name;
    newKeys[path.join(nss as string, newPath.base)] = name;
    newKeys[newPath.name] = name;
    name;
    newKeys[newPath.name + '@source'] = name;
    newKeys[newPath.base] = name;
    newKeys[projectName + (network ? `_${network}` : '')] = name;
    newKeys[projectName + '@source'] = name;
    newKeys[projectName + newPath.ext] = name;

    Object.keys(newKeys).forEach((key) => {
        newKeys['C:' + replaceSeperators(key, true)] = newKeys[key];
    });

    return newKeys;
};

export const writeUpdateCache = (cache: UpdateCache) => {
    fs.writeFileSync(cwd() + '/temp/update_cache.json', JSON.stringify(cache));
};

export const readUpdateCache = () => {
    if (fs.existsSync(cwd() + '/temp/update_cache.json')) {
        let cache = JSON.parse(
            fs.readFileSync(cwd() + '/temp/update_cache.json', 'utf-8')
        ) as UpdateCache;
        UpdateCache.database = cache.database;
        UpdateCache.keys = cache.keys;
        UpdateCache.updates = cache.updates;
        UpdateCache.projects = cache.projects;
    }
};

export const loadUpdates = async (roots = [], useFresh = false) => {
    if (!useFresh && fs.existsSync(cwd() + '/temp/update_cache.json')) {
        readUpdateCache();
        return UpdateCache;
    }
    await rebuildUpdateCache(roots);
    writeUpdateCache(UpdateCache);
    return UpdateCache;
};

export const rebuildUpdateCache = async (roots = []) => {
    let updates = await findUpdates(roots);

    let updateCache: UpdateCache = {
        database: {},
        keys: {},
        updates: [],
        projects: {},
    };

    await Promise.all(
        updates.map(async (update) => {
            let updateFile = (await import(
                update.dir + '/' + update.base
            )) as InfinityMintProjectUpdate;
            updateFile = (updateFile as any).default || updateFile;
            let network =
                updateFile?.network?.name || update.name.split('_')[1];
            let projectName = updateFile.name || update.name.split('@')[0];
            projectName = projectName.split('_')[0];

            let updateVersion =
                updateFile?.version?.version || update.name.split('@')[1];
            updateVersion = updateVersion.split('_')[0];

            let name =
                projectName +
                '@' +
                updateVersion +
                update.dir +
                '/' +
                update.base;
            if (!updateVersion) {
                warning(`Could not find version for ${update.name}`);
                return;
            }

            if (!updateFile.name) updateFile.name = projectName;

            let keys = formatCacheEntry(updateFile, update, name);
            updateCache.database[name] = update;
            updateCache.keys = { ...updateCache.keys, ...keys };
            updateCache.updates.push(
                projectName +
                    (network ? `_${network}` : '') +
                    '@' +
                    updateVersion
            );
            updateCache.projects[projectName + (network ? `_${network}` : '')] =
                updateCache.projects[
                    projectName + (network ? `_${network}` : '')
                ] || [];
            updateCache.projects[
                projectName + (network ? `_${network}` : '')
            ].push(updateVersion);
        })
    );

    UpdateCache.database = updateCache.database;
    UpdateCache.keys = updateCache.keys;
    UpdateCache.updates = updateCache.updates;
    UpdateCache.projects = updateCache.projects;

    //order updateCache.projects by version, so the latest version is first
    Object.keys(UpdateCache.projects).forEach((project) => {
        UpdateCache.projects[project] = UpdateCache.projects[project].sort(
            (a: string, b: string) => {
                let aVersion = a.split('.').map((v: string) => parseInt(v));
                let bVersion = b.split('.').map((v: string) => parseInt(v));
                for (let i = 0; i < aVersion.length; i++) {
                    if (aVersion[i] > bVersion[i]) return -1;
                    if (aVersion[i] < bVersion[i]) return 1;
                }
                return 0;
            }
        );
    });

    return UpdateCache;
};

/**
 *
 * @param updateOrVersion
 * @returns
 */
export const removeUpdate = (
    updateOrVersion: string | InfinityMintProjectUpdate
) => {
    let update: InfinityMintProjectUpdate;
    if (typeof updateOrVersion === 'string') {
        update = UpdateCache.database[updateOrVersion];
    } else {
        update = updateOrVersion;
    }

    if (!update) return;
    let projectName = update.name || update.name;
    let version = update.version.version;
    let name = projectName + '@' + version;
    delete UpdateCache.database[name];
    delete UpdateCache.keys[name];
    UpdateCache.updates = UpdateCache.updates.filter((u) => u !== name);
    UpdateCache.projects[projectName] = UpdateCache.projects[
        projectName
    ].filter((v: string) => v !== version);
};

/**
 *
 * @param projectOrName
 * @param version
 * @returns
 */
export const hasUpdate = (
    projectOrName:
        | string
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject,
    version?: string,
    network?: string
) => {
    if (!network)
        network =
            typeof projectOrName !== 'string'
                ? (projectOrName as any)?.network?.name
                : (projectOrName as string).split('_')[1] || null;
    if (!version) version = (projectOrName as string).split('@')[1] || '1.0.0';
    if (projectOrName !== 'string') projectOrName = (projectOrName as any).name;
    projectOrName =
        projectOrName + '@' + version + (network ? `_${network}` : '');

    if (!UpdateCache.projects[projectOrName as string]) return false;

    return UpdateCache.projects[projectOrName as string].includes(version);
};

export const getUpdate = async (
    projectOrName:
        | string
        | InfinityMintCompiledProject
        | InfinityMintDeployedProject,
    version?: string,
    network?: string
) => {
    if (!network)
        network =
            typeof projectOrName !== 'string'
                ? (projectOrName as any)?.network?.name
                : (projectOrName as string).split('_')[1] || null;
    if (!version) version = (projectOrName as string).split('@')[1] || '1.0.0';
    if (projectOrName !== 'string') projectOrName = (projectOrName as any).name;
    projectOrName =
        projectOrName + '@' + version + (network ? `_${network}` : '');

    let path = UpdateCache.database[UpdateCache.keys[projectOrName]];

    if (!path) throw new Error(`Could not find update for ${projectOrName}`);

    let update: InfinityMintProjectUpdate;
    if (path.ext === '.json')
        update = JSON.parse(
            fs.readFileSync(path.dir + '/' + path.base, {
                encoding: 'utf8',
            })
        );
    else update = await require(path.dir + '/' + path.base).default;

    return update as InfinityMintProjectUpdate;
};

/**
 * Creates a new update
 * @param project
 * @param newVersion
 * @param newTag
 * @param save
 * @returns
 */
export const createUpdate = (
    project: InfinityMintCompiledProject | InfinityMintDeployedProject,
    newVersion: string,
    newTag?: string,
    network?: string,
    save = true,
    createTypeScriptFile = true
) => {
    if (!newTag) newTag = newVersion;

    let update: InfinityMintProjectUpdate = {
        name: project.name,
        version: {
            version: newVersion,
            tag: newTag,
        },
        network: {
            name: network || project.network.name || null,
            chainId: project.network.chainId || null,
        },
    };

    let projectName =
        update.name + (update.network?.name ? `_${update.network.name}` : null);

    if (save && !createTypeScriptFile)
        fs.writeFileSync(
            cwd() +
                '/projects/updates/' +
                project.name +
                '@' +
                update.version.version +
                (update.network?.name ? `_${update.network.name}` : null) +
                '.json',
            JSON.stringify(update, null, 2)
        );
    else {
        let tsFile = `import { InfinityMintProjectUpdate } from '${
            isInfinityMint()
                ? '../../app/interfaces'
                : 'infinitymint/dist/app/interfaces'
        }';

const update: InfinityMintProjectUpdate = ${JSON.stringify(update, null, 2)};
export default update;
`;

        fs.writeFileSync(
            cwd() +
                '/projects/updates/' +
                project.name +
                '@' +
                update.version.version +
                (update.network?.name ? `_${update.network.name}` : null) +
                '.ts',
            tsFile
        );
    }

    //add to update cahe
    let keys = formatCacheEntry(update, {
        dir: cwd() + '/projects/updates/',
        base: project.name + '@' + update.version.version + '.json',
        name: project.name + '@' + update.version.version,
        root: cwd() + '/projects/updates/',
        ext: '.json',
    });

    UpdateCache.database[project.name + '@' + update.version.version] = {
        dir: cwd() + '/projects/updates/',
        base: project.name + '@' + update.version.version + '.json',
        name: project.name + '@' + update.version.version,
        root: cwd() + '/projects/updates/',
        ext: '.json',
    };

    UpdateCache.keys = { ...UpdateCache.keys, ...keys };
    UpdateCache.updates.push(update.name + '@' + update.version.version);

    UpdateCache.projects[projectName] = UpdateCache.projects[projectName] || [];
    UpdateCache.projects[projectName].push(update.version.version);

    //save file
    writeUpdateCache(UpdateCache);

    return update;
};

/**
 *
 * @param roots
 * @returns
 */
export const findUpdates = async (roots = []) => {
    let config = getConfigFile();
    roots = roots || [];

    //require JS files always
    roots.push(cwd() + '/projects/updates/');
    roots = [
        ...roots,
        ...(config.roots || []).map((root: string) => {
            if (
                root.startsWith('../') ||
                root.startsWith('./') ||
                root.startsWith('/../')
            )
                root =
                    cwd() +
                    '/' +
                    (root.startsWith('/') ? root.substring(1) : root);

            if (!root.endsWith('/')) root += '/';
            return path.resolve(root + 'projects/updates/');
        }),
    ];

    let files = (
        await Promise.all(
            roots.map(async (root) => {
                let results = [
                    ...(await safeGlob(root + '**/*.json')),
                    ...(await safeGlob(root + '**/*.js')),
                    ...(await safeGlob(root + '**/*.mjs')),
                    ...(await safeGlob(root + '**/*.cjs')),
                ];
                if (
                    isTypescript() ||
                    !config.settings?.updates?.disallowTypescript
                ) {
                    results = [
                        ...results,
                        ...(await safeGlob(root + '**/*.ts')),
                    ];
                    results = results.filter(
                        (x) =>
                            !x.endsWith('.d.ts') &&
                            !x.endsWith('.type-extension.ts')
                    );
                }

                return results;
            })
        )
    ).flat();

    return files.map((fullPath) => {
        debugLog('Found update => ' + fullPath);
        return path.parse(fullPath);
    });
};

export const updateProjectContent = async (
    project: InfinityMintDeployedProject,
    update: InfinityMintProjectUpdateKey,
    infinityConsole?: InfinityConsole,
    debugLog?: (message: string, pipe?: string) => void
) => {
    //update paths
    if (update.paths) {
        debugLog(
            'Updating path data <' + Object.values(update.paths).length + '>'
        );

        await Promise.all(
            Object.values(update.paths).map(async (path) => {
                let projectPath = project.paths.find(
                    (p) => p.pathId === path.pathId
                );
                let newPath = mergeObjects(
                    projectPath,
                    path
                ) as InfinityMintProjectPath;

                debugLog(
                    'Updating path => ' +
                        projectPath.pathId +
                        ' ' +
                        projectPath.name
                );

                if (projectPath.fileName !== newPath.fileName) {
                    let pathErrors = verifyImport(
                        newPath,
                        'path',
                        project,
                        debugLog
                    );

                    if (pathErrors !== true)
                        throw new Error(
                            pathErrors.map((e) => e.message || e).join('\n')
                        );

                    let newImports = await setupProjectImport(
                        project,
                        newPath,
                        infinityConsole,
                        debugLog
                    );

                    project.imports = {
                        ...project.imports,
                        ...newImports,
                    };
                }

                project.paths = project.paths.map((p) =>
                    p.pathId === path.pathId ? newPath : p
                );
            })
        );
    }

    //update assets
    if (update.assets) {
        debugLog(
            'Updating assets <' + Object.values(update.paths).length + '>'
        );

        await Promise.all(
            Object.values(update.assets).map(async (asset) => {
                let projectAsset = Object.values(project.assets).find(
                    (p) => p.assetId === asset.assetId
                );

                //deep merge asset with project asset
                let newAsset = mergeObjects(
                    projectAsset,
                    asset
                ) as InfinityMintProjectAsset;

                debugLog(
                    'Updating asset => ' +
                        newAsset.assetId +
                        ' ' +
                        newAsset.name
                );

                if (newAsset.fileName !== projectAsset.fileName) {
                    let pathErrors = verifyImport(
                        newAsset,
                        'asset',
                        project,
                        debugLog
                    );

                    if (pathErrors !== true)
                        throw new Error(
                            pathErrors.map((e) => e.message || e).join('\n')
                        );

                    let newImports = await setupProjectImport(
                        project,
                        newAsset,
                        infinityConsole,
                        debugLog
                    );

                    project.imports = {
                        ...project.imports,
                        ...newImports,
                    };
                }

                project.assets = Object.values(project.assets).map((p) =>
                    p.assetId === asset.assetId ? newAsset : p
                );
            })
        );
    }
};

export const updateProjectProcedure = async (
    project: InfinityMintDeployedProject,
    projectUpdate: InfinityMintProjectUpdate,
    infinityConsole?: InfinityConsole,
    debugLog?: (message: string, pipe?: string) => void
) => {
    let { update } = projectUpdate;

    if (update.assets || update.paths)
        await updateProjectContent(project, update, infinityConsole, debugLog);
};

export const createProjectContent = async (
    project: InfinityMintDeployedProject | InfinityMintCompiledProject,
    update: InfinityMintProjectUpdateKey,
    infinityConsole?: InfinityConsole,
    debugLog?: (message: string, pipe?: string) => void,
    oldVersion?: string
) => {
    //add path to project
    if (update.paths) {
        await Promise.all(
            Object.values(update.paths).map(async (path) => {
                let newPath = {
                    ...path,
                    pathId: project.paths.length,
                };

                let pathErrors = verifyImport(
                    newPath,
                    'path',
                    project,
                    debugLog
                );

                if (pathErrors !== true)
                    throw new Error(
                        pathErrors.map((e) => e.message || e).join('\n')
                    );

                let newImports = await setupProjectImport(
                    project,
                    newPath,
                    infinityConsole,
                    debugLog
                );

                project.imports = {
                    ...project.imports,
                    ...newImports,
                };

                debugLog(
                    'Adding path => ' + newPath.pathId + ' ' + newPath.name
                );

                project.paths.push(newPath);

                return newPath;
            })
        );
    }

    if (update.assets) {
        await Promise.all(
            Object.values(update.assets).map(async (path) => {
                let newAsset = {
                    ...path,
                    asetId: Object.values(project.assets).length + 1,
                };

                let pathErrors = verifyImport(
                    newAsset,
                    'asset',
                    project,
                    debugLog
                );

                if (pathErrors !== true)
                    throw new Error(
                        pathErrors.map((e) => e.message || e).join('\n')
                    );

                let newImports = await setupProjectImport(
                    project,
                    newAsset,
                    infinityConsole,
                    debugLog
                );

                project.imports = {
                    ...project.imports,
                    ...newImports,
                };

                debugLog(
                    'Adding path => ' + newAsset.pathId + ' ' + newAsset.name
                );

                project.assets = {
                    ...project.assets,
                    [newAsset.assetId]: newAsset,
                };

                return newAsset;
            })
        );
    }

    //call asset controller execute method
    if ((project as InfinityMintDeployedProject).deployed) {
        let projectClass = await infinityConsole.getProject(
            project,
            project.network.name,
            oldVersion
        );

        await projectClass.deployments.assets.execute(
            'update',
            {
                project: project,
                deployments: projectClass.deployments,
                contracts: projectClass.deployments,
                deployScript:
                    projectClass.deployments.assets.getDeploymentScript(),
            },
            infinityConsole
        );
    }
};

export const createProjectProcedure = async (
    project: InfinityMintDeployedProject | InfinityMintCompiledProject,
    projectUpdate: InfinityMintProjectUpdate,
    infinityConsole?: InfinityConsole,
    debugLog?: (message: string, pipe?: string) => void,
    oldVersion?: string
) => {
    let { create } = projectUpdate;

    if (create.assets || create.paths)
        await createProjectContent(
            project,
            create,
            infinityConsole,
            debugLog,
            oldVersion
        );
};

export const updateProcedures = {
    update: updateProjectProcedure,
    create: createProjectProcedure,
    remove: async (
        project: InfinityMintDeployedProject | InfinityMintCompiledProject,
        projectUpdate: InfinityMintProjectUpdate,
        infinityConsole?: InfinityConsole,
        debugLog?: (message: string, pipe?: string) => void
    ) => {
        debugLog('Removing data => ' + project.version.version);
    },
};

export const applyUpdate = async (
    update: InfinityMintProjectUpdate,
    project: InfinityMintDeployedProject | InfinityMintCompiledProject,
    infinityConsole?: InfinityConsole,
    debugLog?: (message: string, pipe?: string) => void
): Promise<InfinityMintDeployedProject> => {
    let newProject = { ...project };
    debugLog = debugLog || log;

    newProject.version = update.version;

    debugLog('Applying update => ' + update.version.version);

    if (update.remove) {
        debugLog('Removing data => ' + update.version.version);

        await updateProcedures.remove(
            newProject,
            update,
            infinityConsole,
            debugLog
        );
    }

    if (update.create) {
        debugLog('Creating data => ' + update.version.version);
        await updateProcedures.create(
            newProject,
            update,
            infinityConsole,
            debugLog,
            update.oldVersion?.version || '1.0.0'
        );
    }

    if (update.update) {
        debugLog('Updating Project assets => ' + update.version.version);
        await updateProcedures.update(
            newProject,
            update,
            infinityConsole,
            debugLog
        );
    }

    if (update.merge) {
        debugLog('Merging Project assets => ' + update.version.version);
        newProject = mergeObjects(
            newProject,
            update.merge
        ) as InfinityMintDeployedProject;
    }

    if (update.delete) {
        debugLog('Deleting Project assets => ' + update.version.version);
        update.delete.forEach((key) => {
            delete newProject[key];
        });
    }

    debugLog('Update Complete => ' + update.version.version);
    return newProject;
};
