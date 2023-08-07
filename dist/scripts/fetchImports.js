(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "fs", "../app/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const helpers_1 = require("../app/helpers");
    const fetchImports = {
        name: 'Fetch Imports Using IPFS',
        description: 'Fetches imports relating to a project  and write them to a destination or your current repository. The project must have uploaded its resources to IPFS',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            let destination = ((_a = script.args.destination) === null || _a === void 0 ? void 0 : _a.value) || (0, helpers_1.cwd)() + '/imports/';
            let targetProject;
            if ((_b = script.args.useCompiled) === null || _b === void 0 ? void 0 : _b.value)
                targetProject = script.project.compiledProject;
            else
                targetProject = script.project.getDeployedProject();
            //fetch paths
            let pathImports = {};
            Object.values([
                ...targetProject.paths,
                ...Object.values(targetProject.assets),
            ]).forEach((path) => {
                let getPath = (path) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                    if (!((_c = (_b = (_a = path === null || path === void 0 ? void 0 : path.export) === null || _a === void 0 ? void 0 : _a.external) === null || _b === void 0 ? void 0 : _b.ipfs) === null || _c === void 0 ? void 0 : _c.url) &&
                        !((_f = (_e = (_d = path === null || path === void 0 ? void 0 : path.export) === null || _d === void 0 ? void 0 : _d.external) === null || _e === void 0 ? void 0 : _e.web2) === null || _f === void 0 ? void 0 : _f.url))
                        return;
                    pathImports[path.fileName.toString()] =
                        ((_j = (_h = (_g = path === null || path === void 0 ? void 0 : path.export) === null || _g === void 0 ? void 0 : _g.external) === null || _h === void 0 ? void 0 : _h.ipfs) === null || _j === void 0 ? void 0 : _j.url) ||
                            ((_m = (_l = (_k = path === null || path === void 0 ? void 0 : path.export) === null || _k === void 0 ? void 0 : _k.external) === null || _l === void 0 ? void 0 : _l.web2) === null || _m === void 0 ? void 0 : _m.url);
                };
                getPath(path);
                if (path.content)
                    Object.values(path.content).forEach((path) => {
                        getPath(path);
                    });
            });
            //write all the path imports to the destination
            yield Promise.all(Object.keys(pathImports).map((path, index) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                var _c;
                let importPath = destination + path;
                if (fs_1.default.existsSync(importPath) && !((_c = script.args.force) === null || _c === void 0 ? void 0 : _c.value)) {
                    script.log(`[${index}] => Skipping ${path} as it already exists in ${destination}`);
                    return;
                }
                script.log(`[${index}] => Fetching ${path} from ${pathImports[path]}, writing to ${importPath}`);
                let fetched;
                try {
                    fetched = yield fetch(pathImports[path]);
                    if (!fetched.ok) {
                        throw new Error('failed to fetch');
                    }
                }
                catch (error) {
                    (0, helpers_1.warning)(`[${index}] => Failed to fetch ${path} from ${pathImports[path]}`);
                    return;
                }
                if (importPath[0] !== '/')
                    importPath = '/' + importPath;
                if (importPath.indexOf('/imports/') === -1)
                    importPath = `/imports${importPath}`;
                let content = yield fetched.text();
                (0, helpers_1.makeDirectories)((0, helpers_1.cwd)() + importPath);
                fs_1.default.writeFileSync((0, helpers_1.cwd)() + importPath, content);
            })));
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
            {
                name: 'network',
                type: 'string',
                optional: true,
            },
            {
                name: 'target',
                type: 'string',
                optional: true,
            },
            {
                name: 'force',
                type: 'boolean',
                optional: true,
            },
            {
                name: 'destination',
                type: 'string',
                optional: true,
            },
            {
                name: 'useCompiled',
                type: 'boolean',
                optional: true,
            },
        ],
    };
    exports.default = fetchImports;
});
//# sourceMappingURL=fetchImports.js.map