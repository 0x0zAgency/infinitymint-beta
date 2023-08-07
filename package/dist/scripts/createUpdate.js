(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../app/helpers", "../app/updates"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../app/helpers");
    const updates_1 = require("../app/updates");
    const createUpdate = {
        name: 'Create Update',
        description: 'Creates a new update for an InfinityMint project.',
        execute: (script) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            yield script.infinityConsole.loadUpdates();
            let version = (_b = (_a = script.args) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.value;
            if (!version) {
                let versions = (0, updates_1.getProjectVersions)(script.project.deployedProject);
                if (versions.length === 0 || !versions)
                    version = '1.0.0';
                else {
                    let dots = versions[0].split('.');
                    version = parseInt(dots[0] + 1) + dots.slice(1).join('.');
                }
            }
            if (!version)
                throw new Error('no version specified, please specify with --target <version>');
            //make sure version conforms to semver
            if (!version.match(/\d+\.\d+\.\d+/))
                throw new Error('bad version format, must be semver (eg: ');
            let project = ((_c = script.project) === null || _c === void 0 ? void 0 : _c.deployedProject) || script.project.compiledProject;
            if ((0, updates_1.hasUpdate)(project, version, ((_e = (_d = script.args) === null || _d === void 0 ? void 0 : _d.global) === null || _e === void 0 ? void 0 : _e.value)
                ? null
                : ((_f = project.network) === null || _f === void 0 ? void 0 : _f.name) ||
                    ((_g = script.infinityConsole.network) === null || _g === void 0 ? void 0 : _g.name)))
                throw new Error(`
            update ${version} already exists for project ${project.name} ${((_j = (_h = script.args) === null || _h === void 0 ? void 0 : _h.global) === null || _j === void 0 ? void 0 : _j.value)
                    ? 'globally'
                    : 'on network ' +
                        (((_k = project.network) === null || _k === void 0 ? void 0 : _k.name) ||
                            ((_l = script.infinityConsole.network) === null || _l === void 0 ? void 0 : _l.name))}
            `);
            let update = (0, updates_1.createUpdate)(project, version, (_o = (_m = script.args) === null || _m === void 0 ? void 0 : _m.tag) === null || _o === void 0 ? void 0 : _o.value, ((_q = (_p = script === null || script === void 0 ? void 0 : script.args) === null || _p === void 0 ? void 0 : _p.network) === null || _q === void 0 ? void 0 : _q.value)
                ? null ||
                    script.project.network ||
                    script.infinityConsole.network.name
                : null, !((_s = (_r = script.args) === null || _r === void 0 ? void 0 : _r.dontSave) === null || _s === void 0 ? void 0 : _s.value), (0, helpers_1.isTypescript)());
            script.log('\n{green-fg}{bold}Succesfully Created Update{/}');
            script.log(`\tProject: ${update.name}`);
            script.log(`\tUpdate Tag: ${(_t = update.version) === null || _t === void 0 ? void 0 : _t.tag}`);
            script.log(`\tVersion: ${update.version.version} (${update.version.tag})\n` +
                (update.network
                    ? `\tNetwork: ${update.network.name} (chainId:${update.network.chainId})`
                    : '\tNetwork: global (all networks)'));
            script.log(`\n{gray-fg}You can now edit your update in the /projects/update/ folder, then when you are ready you can run the update script to apply it{/}`);
        }),
        arguments: [
            {
                name: 'project',
                type: 'string',
                optional: true,
            },
            {
                name: 'target',
                type: 'string',
                optional: true,
            },
            {
                name: 'global',
                type: 'boolean',
                optional: true,
            },
            {
                name: 'network',
                type: 'string',
                optional: true,
            },
            {
                name: 'tag',
                type: 'string',
                optional: true,
            },
        ],
    };
    exports.default = createUpdate;
});
//# sourceMappingURL=createUpdate.js.map