import {
    getCompiledProject,
    getFullyQualifiedName,
    getProjectName,
    getProjectSource,
    createTemporaryProject,
    hasCompiledProject,
    removeTempCompliledProject,
} from '../app/projects';
import {
    InfinityMintCompiledLink,
    InfinityMintProject,
    InfinityMintProjectAsset,
    InfinityMintProjectPath,
    InfinityMintProjectSettingsLink,
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../app/interfaces';
import {
    getInfinityMintVersion,
    cwd,
    getConfigFile,
    Dictionary,
    getArgumentValues,
    readGlobalSession,
} from '../app/helpers';
import { setupProjectImport, getImports, verifyImport } from '../app/imports';
import fs from 'fs';
import { InfinityMintCompiledProject } from '../app/interfaces';
import JSZip from 'jszip';
import {
    InfinityMintDeployment,
    loadProjectDeploymentLinks,
} from '../app/deployments';
import { prepare, action, always } from '../app/web3';
import { isAllowingIPFS } from '../app/ipfs';

const compile: InfinityMintScript = {
    name: 'Compile',
    description:
        'Compile an InfinityMint project ready for deployment. The compiled file will garuntee that all the assets used in the minter are uploaded to IPFS and accessible at all times.',
    execute: async (script: InfinityMintScriptParameters) => {
        let tempProject = createTemporaryProject(
            script,
            'compiled',
            null,
            null,
            script.args.target?.value
        ); //gets a temporary project file if there is one for a compilation, if not will just return the source project aka the .ts file or .js file
        let config = getConfigFile();
        let { continuePrevious, recompile, uploadBundle } = getArgumentValues(
            script.args
        );

        if (!continuePrevious) {
            script.log(
                `{red-fg}Not continuing with previous compilation. Making new temp file{/}`
            );
            tempProject = createTemporaryProject(script, 'source');
        }

        if (recompile && hasCompiledProject(tempProject)) {
            let compiledProject = getCompiledProject(tempProject);
            script.log(
                `Removing compiled project: ${getFullyQualifiedName(
                    tempProject,
                    compiledProject.version.version
                )}`
            );
            fs.unlinkSync(
                cwd() +
                    '/projects/compiled/' +
                    getFullyQualifiedName(
                        tempProject,
                        compiledProject.version.version
                    ) +
                    '.json'
            );
            //reset the project back to the source
            tempProject = createTemporaryProject(script, 'source');
        }

        if (!tempProject.version)
            tempProject.version = {
                version: '1.0.0',
                tag: 'initial',
            };

        //sets the project and script to be the one used by the action method. Must be called before any action is called or any always is called
        prepare(tempProject, script, 'compile');

        //rechange the modules over if they have changed
        if (script.project.source.modules)
            tempProject.modules = script.project.source.modules;

        //sets where this project is stored locally
        tempProject.source = getProjectSource(tempProject);

        //if the project is a classic project from InfinityMint alpha make it classic
        Object.values(config.settings?.projects?.classicProjects || []).forEach(
            (location) => {
                if (tempProject.source.dir.includes(location.toString()))
                    (tempProject as any).classic = true;
            }
        );

        if (
            (tempProject as any).javascript &&
            (tempProject as any).classic === true
        ) {
            let upgrade = await action('upgrade', async () => {
                script.log(
                    `{cyan-fg}{bold}Upgrading ${tempProject.name}@${
                        tempProject.version.version
                    } with InfinityMint@${getInfinityMintVersion()}{/}`
                );
                tempProject.information = {
                    ...((tempProject as any)?.description || {}),
                    ...(tempProject.information || {}),
                };

                tempProject.settings = {
                    ...((tempProject as any)?.settings || {}),
                };

                if ((tempProject as any).names && !tempProject.settings?.names)
                    tempProject.settings.names = (tempProject as any).names;

                let javaScriptProject = tempProject as any;
                tempProject.information.tokenSingular =
                    javaScriptProject.description.token;
                tempProject.information.tokenMultiple =
                    javaScriptProject.description.tokenPlural;

                tempProject.price =
                    tempProject.price ||
                    javaScriptProject.deployment.startingPrice.toString() ||
                    0;

                if ((tempProject as any).description)
                    delete (tempProject as any).description;

                tempProject.modules = {
                    ...javaScriptProject.modules,
                    assets: javaScriptProject.modules.controller,
                } as any;

                if (tempProject.settings === undefined)
                    tempProject.settings = {};

                //move deployment variables to the settings
                if (javaScriptProject.deployment) {
                    tempProject.settings.values = javaScriptProject.deployment;

                    if ((tempProject as any).deployment)
                        delete (tempProject as any).deployment;
                }

                if (javaScriptProject.royalties) {
                    tempProject.settings.royalty =
                        javaScriptProject.royalties as any;

                    if ((tempProject as any).royalties)
                        delete (tempProject as any).royalties;
                }

                if (javaScriptProject.approved)
                    tempProject.permissions = {
                        ...(tempProject.permissions || {}),
                        all: javaScriptProject.approved,
                    };
                if (javaScriptProject.mods) {
                    (tempProject as any).gems = javaScriptProject.mods;
                    if ((tempProject as any).mods)
                        delete (tempProject as any).mods;
                }

                if (javaScriptProject.paths?.indexes)
                    javaScriptProject.paths = Object.values(
                        javaScriptProject.paths?.indexes
                    ).map((path: any) => {
                        //do a deep copy of the default path and merge it with the path
                        let newObj = {
                            ...(javaScriptProject.paths?.default || {}),
                            ...path,
                        };

                        newObj.content = {
                            ...path.content,
                            ...(javaScriptProject.paths?.default || {}).content,
                        };

                        return newObj;
                    });
            });
            if (upgrade !== true) throw upgrade;
        }

        const deploymentLinks = await loadProjectDeploymentLinks(
            tempProject,
            script.infinityConsole,
            null,
            true
        );

        let result = await always('compile', async () => {
            if (hasCompiledProject(tempProject) && !recompile) {
                script.log(`\n{red-fg}Using previous compliation...{/}`);
                return;
            }
            script.log(
                `{cyan-fg}{bold}Compiling Project ${tempProject.name}@${
                    tempProject.version.version
                } with InfinityMint@${getInfinityMintVersion()}{/}\n`
            );

            let verify = await always('verify', async () => {
                let errors: string[] = [];

                let tempPaths =
                    (tempProject as InfinityMintProject).javascript &&
                    (tempProject as any).old
                        ? (tempProject as any)?.paths?.indexes ||
                          (tempProject as any)?.paths ||
                          []
                        : tempProject.paths;
                tempPaths = Object.values(tempPaths || {});

                let basePath =
                    (tempProject as InfinityMintProject).javascript &&
                    (tempProject as any).old
                        ? (tempProject as any)?.paths?.default ||
                          (script.project.source as InfinityMintProject)
                              ?.basePath ||
                          {}
                        : (script.project.source as InfinityMintProject)
                              ?.basePath || ({} as InfinityMintProjectPath);

                let tempAssets: InfinityMintProjectAsset[] = [];

                //unpack the assets array adding the section key
                if (tempProject.assets instanceof Array) {
                    tempAssets = tempProject.assets || [];
                } else {
                    Object.keys(tempProject.assets || {}).forEach((section) => {
                        Object.values(
                            tempProject.assets
                                ? (tempProject.assets[
                                      section
                                  ] as InfinityMintProjectAsset[])
                                : {}
                        ).forEach((asset: InfinityMintProjectAsset) => {
                            tempAssets.push({ ...asset, section: section });
                        });
                    });
                }

                let baseAsset =
                    (script.project.source as InfinityMintProject)?.baseAsset ||
                    ({} as InfinityMintProjectAsset);

                for (let i = 0; i < tempPaths.length; i++) {
                    let path = tempPaths[i];

                    path = {
                        ...basePath,
                        ...path,
                    };
                    path.content = {
                        ...(basePath.content || {}),
                        ...(path.content || {}),
                    };
                    path.valid = false;
                    script.log(
                        `[Path ${i}] {yellow-fg}Verifying...{/yellow-fg}`
                    );
                    script.infinityConsole.emit('preVerify', path, typeof path);
                    let pathErrors = verifyImport(
                        path,
                        'path',
                        tempProject,
                        script.log
                    );
                    if (pathErrors !== true) {
                        script.log(`[Path ${i}] {red-fg}ERROR OCCURED{/}`);
                        errors = [...errors, ...pathErrors];
                    } else {
                        path.valid = true;
                        script.log(`[Path ${i}] {green-fg}VERIFIED{/}`);
                    }
                    script.infinityConsole.emit(
                        'postVerify',
                        path,
                        typeof path
                    );

                    tempPaths[i] = path as InfinityMintProjectPath;
                }

                for (let i = 0; i < tempAssets.length; i++) {
                    let asset = tempAssets[i];
                    asset = {
                        ...baseAsset,
                        ...asset,
                    };

                    asset.content = {
                        ...(baseAsset.content || {}),
                        ...(asset.content || {}),
                    };
                    asset.valid = false;
                    script.log(
                        `{yellow-fg}[Asset ${i}] Verifying...{/yellow-fg}`
                    );
                    script.infinityConsole.emit(
                        'preVerify',
                        asset,
                        typeof asset
                    );
                    let assetErrors = verifyImport(
                        asset,
                        'asset',
                        tempProject,
                        script.log
                    );

                    if (assetErrors !== true) {
                        script.log(`{red-fg}[Asset ${i}] ERROR OCCURED{/}`);
                        errors = [...errors, ...assetErrors];
                    } else {
                        asset.valid = true;
                        script.log(`{green-fg}[Asset ${i}] VERIFIED{/}`);
                    }
                    script.infinityConsole.emit(
                        'postVerify',
                        asset,
                        typeof asset
                    );

                    tempAssets[i] = asset as InfinityMintProjectAsset;
                }

                //if errors are not length of zero then throw them!
                if (errors.length !== 0) throw errors;

                //set it
                tempProject.paths = tempPaths;
                tempProject.assets = tempAssets;
            });

            if (verify !== true) {
                if (verify instanceof Array !== true) throw verify as Error;

                throw new Error(
                    'failed verification of assets/paths. please check errors below.\n' +
                        (verify as Error[]).join('\n')
                );
            }

            let setup = await always('setup', async () => {
                let imports = tempProject.imports || {};

                //here we need to loop through paths and see if we find settings
                for (let i = 0; i < tempProject.paths.length; i++) {
                    script.infinityConsole.emit(
                        'preCompileSetup',
                        tempProject.paths[i],
                        typeof tempProject.paths[i]
                    );
                    script.log(`[Path ${i}] {yellow-fg}Setting up...{/}`);
                    imports = {
                        ...imports,
                        ...(await setupProjectImport(
                            tempProject,
                            tempProject.paths[i],
                            script.infinityConsole,
                            script.log
                        )),
                    };
                    script.log(`[Path ${i}] {green-fg}VERIFIED{/}`);
                    tempProject.paths[i].pathId = i;
                    tempProject.paths[i].compiled = true;
                    script.infinityConsole.emit(
                        'postCompileSetup',
                        tempProject.paths[i],
                        typeof tempProject.paths[i]
                    );
                }

                //here we need to loop through assets as well
                if (tempProject.assets) {
                    if (tempProject.assets instanceof Array) {
                        for (let i = 0; i < tempProject.assets.length; i++) {
                            script.infinityConsole.emit(
                                'preCompileSetup',
                                tempProject.assets[i],
                                typeof tempProject.assets[i]
                            );
                            script.log(
                                `[Asset ${i}] {yellow-fg}Setting up...{/}`
                            );
                            imports = {
                                ...imports,
                                ...(await setupProjectImport(
                                    tempProject,
                                    tempProject.assets[i],
                                    script.infinityConsole,
                                    script.log
                                )),
                            };
                            script.log(`[Asset ${i}] {green-fg}VERIFIED{/}`);
                            tempProject.assets[i].assetId = i + 1; //asset ids start counting from 1 as asset id 0 is null asset
                            tempProject.assets[i].compiled = true; //asset ids start counting from 1 as asset id 0 is null asset
                            script.infinityConsole.emit(
                                'postCompileSetup',
                                tempProject.assets[i],
                                typeof tempProject.assets[i]
                            );
                        }
                    } else {
                        throw new Error('assets should be flat by this point');
                    }
                }

                //replace double slashes with single slashes in each member of imports
                Object.keys(imports).forEach((key) => {
                    imports[key] = imports[key].replace(/\/\//g, '/');
                });

                tempProject.imports = imports;
                tempProject.compiled = true;
            });

            if (setup !== true) throw setup;
        });
        if (result !== true) throw result;

        let links = await action('buildLinks', async () => {
            script.log(`\n{cyan-fg}{bold}Compiling Links...{/}\n`);

            let projectLinks = tempProject.links || {};
            let newLinks = deploymentLinks.filter((link) => link.isImportant());

            //find links from the project links
            Object.values(projectLinks).forEach((value) => {
                let link = value as InfinityMintProjectSettingsLink;
                if (link === null) return;
                if (link === undefined) return;

                //if the link is already in the default links
                if (
                    deploymentLinks.filter(
                        (defaultLink) => defaultLink.getLinkKey() === link.key
                    ).length > 0
                ) {
                    let newLink = deploymentLinks.filter(
                        (defaultLink) => defaultLink.getLinkKey() === link.key
                    )[0];
                    newLink.setLink({
                        ...newLink.getLink(),
                        ...link,
                    });
                    //add the link to the new links
                    newLinks.push(newLink);
                } else {
                    //adding implicit deployment links
                    script.log(
                        `\t{cyan-fg}Adding Implicit Deployment Link => ${
                            link.contract || link.key
                        }{/}`
                    );

                    let newLink = new InfinityMintDeployment(
                        null,
                        link.contract || link.key,
                        script.infinityConsole.network.name,
                        tempProject,
                        script.infinityConsole
                    );

                    newLink.setLink(link);
                    newLinks.push(newLink);
                }
            });

            newLinks.sort((a, b) => b.getIndex() - a.getIndex());

            script.log(
                `\n{cyan-fg}{bold}Compiling ${
                    Object.keys(newLinks).length
                } InfinityLinks...{/}`
            );

            //compile all the links
            for (let i = 0; i < newLinks.length; i++) {
                let link = newLinks[i];
                let artifact = await link.getArtifact();

                tempProject.links = tempProject.links || {};
                (tempProject.links as Dictionary<InfinityMintCompiledLink>)[
                    link.getLinkKey()
                ] = {
                    ...link.getLink(),
                    contract: link.getContractName(),
                    index: i,
                    name: link.getLink().name || link.getContractName(),
                    abi: artifact.abi,
                    bytecode: artifact.bytecode,
                };

                script.log(
                    `\t{cyan-fg}new link => ${link.getLinkKey()}[${i}]{/}`
                );
            }
        });

        if (links !== true) throw links;

        let post = await action('post', async () => {
            let sectionKeys = [];

            if (!tempProject.meta)
                tempProject.meta = {
                    names: {},
                    assets: {
                        sections: [],
                    },
                };

            //get all the section keys
            if (tempProject.assets instanceof Array) {
                tempProject.assets.forEach((asset) => {
                    if (sectionKeys.includes(asset.section)) return;
                    sectionKeys.push(asset.section);
                });
            } else {
                Object.keys(tempProject.assets || {}).forEach((section) => {
                    if (sectionKeys.includes(section)) return;
                    sectionKeys.push(section);
                });
            }

            let names = {};
            tempProject.settings?.names?.forEach((name) => {
                names[name] = name;
            });
            tempProject.meta.names = names;
            tempProject.meta.assets.sections = sectionKeys;
        });

        if (post !== true) throw post;

        let buildImports = await action('buildImports', async () => {
            let imports =
                (tempProject as InfinityMintCompiledProject).imports || {};
            let keys = Object.keys(imports);
            let importCache = await getImports();

            if (keys.length === 0)
                throw new Error('project has no imports this is weird!');
            //this is where we need to go over every file reference in the project and include all of them

            let files = {};
            Object.keys(imports).forEach((key) => {
                if (!files[imports[key]]) files[imports[key]] = imports[key];
            });

            script.log(
                `\n{cyan-fg}{bold}Packing ${
                    Object.keys(files).length
                } imports...{/}`
            );

            tempProject.bundles = {
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
                    if (path === undefined || path.dir === undefined) return;

                    tempProject.bundles.imports[importCache.keys[file]] = path;
                    rawBundle[location] = await fs.promises.readFile(
                        path.dir + '/' + path.base
                    );
                    tempProject.bundles.imports[importCache.keys[file]].bundle =
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
                tempProject,
                tempProject.version?.version
            );
            script.log(`\t\t{green-fg}Zipping => ${projectFile}.json{/}`);
            zip.file(projectFile + '.json', JSON.stringify(tempProject));
            let source = tempProject.source.dir + '/' + tempProject.source.base;
            zip.file(
                tempProject.name + tempProject.source.ext,
                fs.readFileSync(source)
            );
            script.log(
                `\t\t{green-fg}Zipping => ${
                    projectFile + tempProject.source.ext
                }{/}`
            );

            let zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

            script.log(`\t{cyan-fg}Saving Bundle...{/}`);
            if (!fs.existsSync(cwd() + '/projects/bundles/'))
                fs.mkdirSync(cwd() + '/projects/bundles/');

            await fs.promises.writeFile(
                `${cwd()}/projects/bundles/${getFullyQualifiedName(
                    tempProject
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
        });

        if (buildImports !== true) throw buildImports;

        if (uploadBundle && isAllowingIPFS()) {
            let upload = await action('uploadBundle', async () => {
                let bundle = await fs.promises.readFile(
                    `${cwd()}/projects/bundles/${getFullyQualifiedName(
                        tempProject
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
                session.environment.bundles = session.environment.bundles || {};
                session.environment.bundles[
                    getFullyQualifiedName(tempProject)
                ] = {
                    hash: bundleHash,
                    size: bundle.length,
                };

                tempProject.meta.bundle = bundleHash;
            });

            if (upload !== true) throw upload;
        }

        //copy the project from the temp projects folder to the projects folder, will always run regardless of it calling action and not always
        let copy = await action('copyProject', async () => {
            script.log('\n{cyan-fg}Copying Project...{/}');

            let projectLocation = `${cwd()}/projects/compiled/${getFullyQualifiedName(
                tempProject
            )}.json`;
            let tempLocation = `${cwd()}/temp/projects/${getFullyQualifiedName(
                tempProject
            )}.compiled.temp.json`;
            fs.copyFileSync(tempLocation, projectLocation);
            script.log(`\t => ${projectLocation}{/}`);
        });

        //everything changed in the project past the copy action will not be saved to disk
        if (copy !== true) throw copy;

        script.log(`\n{cyan-fg}{bold}Removing Temp Project File{/}\n`);
        removeTempCompliledProject(tempProject, tempProject.version?.version);

        if (uploadBundle && tempProject.meta.bundle) {
            script.log(
                `\n{green-fg}{bold}Bundle Uploaded To IPFS => ${tempProject.meta.bundle}{/}`
            );
            script.log(
                `You can now access this bundle (and share it with others) from\n\thttps://ipfs.ip/ips/${tempProject.meta.bundle}}`
            );
            script.log(
                `You can also execute\n\tnpx infinitymint downloadBundle --hash ${tempProject.meta.bundle}\n\t\t{gray-fg}to download the bundle to your local machine and install it into InfinityMint.{/gray-fg}`
            );
        }

        script.log('\n{green-fg}{bold}Compilation Successful{/}');
        script.log(`\tProject: ${tempProject.name}`);
        script.log(
            `\tVersion: ${tempProject.version.version} (${tempProject.version.tag})`
        );

        script.log(
            '{gray-fg}{bold}You can now go ahead and {cyan-fg}deploy this project!{/}'
        );

        return true;
    },
    arguments: [
        {
            name: 'project',
            type: 'string',
            optional: true,
        },
        {
            name: 'uploadBundle',
            type: 'boolean',
            value: true,
            optional: true,
        },
        {
            name: 'continuePrevious',
            type: 'boolean',
            value: true,
            optional: true,
        },
        {
            name: 'recompile',
            type: 'boolean',
            value: false,
            optional: true,
        },
    ],
};
export default compile;
