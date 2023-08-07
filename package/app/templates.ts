import {
    Dictionary,
    cwd,
    debugLog,
    getConfigFile,
    isInfinityMint,
    isTypescript,
    safeGlobCB,
} from './helpers';
import { InfinityMintTemplateScript } from './interfaces';
import path from 'path';

let templates: Dictionary<InfinityMintTemplateScript> = {};

export const findTemplates = async () => {
    let config = getConfigFile();
    let roots = [
        cwd() + '/templates/',
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
            return root + 'templates/';
        }),
    ];

    if (isInfinityMint()) roots.push(cwd() + '/app/templates/');
    else roots.push(cwd() + '/node_modules/infinitymint/dist/app/templates/');

    let results = await Promise.all(
        roots.map(async (root) => {
            debugLog('Searching for templates => ' + root);
            let ts =
                isTypescript() ||
                !config.settings?.templates?.disallowTypescript
                    ? await new Promise<string[]>((resolve, reject) => {
                          safeGlobCB(root + '**/*.ts', (err, files) => {
                              if (err) reject(err);
                              else resolve(files);
                          });
                      })
                    : [];
            let js = await new Promise<string[]>((resolve, reject) => {
                safeGlobCB(root + '**/*.js', (err, files) => {
                    if (err) reject(err);
                    else resolve(files);
                });
            });

            return [...ts, ...js];
        })
    );

    let flat = results.flat();
    flat = flat.filter(
        (file) =>
            !file.endsWith('.d.ts') && !file.endsWith('.type-extension.ts')
    );
    flat.forEach((file: string, index) => {
        let name = (file.split('/').pop() as string).split('.')[0];

        debugLog(
            `[${index}] => Found template ` + file + `<${name}> loading...`
        );

        if (require.cache[file]) {
            debugLog(
                `\t{gray-fg}Found ` +
                    file +
                    `<${name}> in cache, deleting...{/}`
            );
            delete require.cache[file];
        }

        try {
            let template = require(file);
            templates[name] = template;
            templates[name] = template.default || template;
            templates[name].path = path.parse(file);
        } catch (error) {
            debugLog(
                `\t{red-fg}Error loading template ` +
                    file +
                    `<${name}>: ${error.message}{/}`
            );
            return;
        }
    });

    return templates;
};

export const getTemplates = () => {
    return templates;
};
