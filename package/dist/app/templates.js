(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./helpers", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTemplates = exports.findTemplates = void 0;
    const tslib_1 = require("tslib");
    const helpers_1 = require("./helpers");
    const path_1 = tslib_1.__importDefault(require("path"));
    let templates = {};
    const findTemplates = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let config = (0, helpers_1.getConfigFile)();
        let roots = [
            (0, helpers_1.cwd)() + '/templates/',
            ...(config.roots || []).map((root) => {
                if (root.startsWith('../') ||
                    root.startsWith('./') ||
                    root.startsWith('/../'))
                    root =
                        (0, helpers_1.cwd)() +
                            '/' +
                            (root.startsWith('/') ? root.substring(1) : root);
                if (!root.endsWith('/'))
                    root += '/';
                return root + 'templates/';
            }),
        ];
        if ((0, helpers_1.isInfinityMint)())
            roots.push((0, helpers_1.cwd)() + '/app/templates/');
        else
            roots.push((0, helpers_1.cwd)() + '/node_modules/infinitymint/dist/app/templates/');
        let results = yield Promise.all(roots.map((root) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            (0, helpers_1.debugLog)('Searching for templates => ' + root);
            let ts = (0, helpers_1.isTypescript)() ||
                !((_b = (_a = config.settings) === null || _a === void 0 ? void 0 : _a.templates) === null || _b === void 0 ? void 0 : _b.disallowTypescript)
                ? yield new Promise((resolve, reject) => {
                    (0, helpers_1.safeGlobCB)(root + '**/*.ts', (err, files) => {
                        if (err)
                            reject(err);
                        else
                            resolve(files);
                    });
                })
                : [];
            let js = yield new Promise((resolve, reject) => {
                (0, helpers_1.safeGlobCB)(root + '**/*.js', (err, files) => {
                    if (err)
                        reject(err);
                    else
                        resolve(files);
                });
            });
            return [...ts, ...js];
        })));
        let flat = results.flat();
        flat = flat.filter((file) => !file.endsWith('.d.ts') && !file.endsWith('.type-extension.ts'));
        flat.forEach((file, index) => {
            let name = file.split('/').pop().split('.')[0];
            (0, helpers_1.debugLog)(`[${index}] => Found template ` + file + `<${name}> loading...`);
            if (require.cache[file]) {
                (0, helpers_1.debugLog)(`\t{gray-fg}Found ` +
                    file +
                    `<${name}> in cache, deleting...{/}`);
                delete require.cache[file];
            }
            try {
                let template = require(file);
                templates[name] = template;
                templates[name] = template.default || template;
                templates[name].path = path_1.default.parse(file);
            }
            catch (error) {
                (0, helpers_1.debugLog)(`\t{red-fg}Error loading template ` +
                    file +
                    `<${name}>: ${error.message}{/}`);
                return;
            }
        });
        return templates;
    });
    exports.findTemplates = findTemplates;
    const getTemplates = () => {
        return templates;
    };
    exports.getTemplates = getTemplates;
});
//# sourceMappingURL=templates.js.map