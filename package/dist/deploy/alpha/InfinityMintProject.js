(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/helpers", "../../app/ipfs", "hardhat", "../../app/projects"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const helpers_1 = require("../../app/helpers");
    const ipfs_1 = require("../../app/ipfs");
    const hardhat_1 = require("hardhat");
    const projects_1 = require("../../app/projects");
    const InfinityMintProject = {
        //going to give
        module: 'project',
        index: 8,
        solidityFolder: 'alpha',
        permissions: ['all'],
        post: (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            let { deployment, project, log, infinityConsole } = params;
            let projectContract = yield deployment.write();
            //this is where we would upload to IPFS
            if (!(0, ipfs_1.isAllowingIPFS)()) {
                (0, helpers_1.warning)(`IPFS is not enabled, skipping upload and setting initial project to be local true`);
                let bytes = hardhat_1.ethers.utils.hexlify(hardhat_1.ethers.utils.toUtf8Bytes('%JSON%' +
                    JSON.stringify({
                        local: true,
                        name: project.name,
                        version: project.version,
                    })));
                yield projectContract.setInitialProject(bytes),
                    'Set Initial Project';
                return;
            }
            else {
                log(`{cyan-fg}{bold}Uploading project to IPFS...{/}`);
                let cid = yield infinityConsole.IPFS.uploadJson(project, (0, projects_1.getFullyQualifiedName)(project, null, infinityConsole.network.name) + '.json');
                log('{green-fg}{bold}Uploaded project to IPFS to path{/} => ' +
                    cid +
                    '/' +
                    (0, projects_1.getFullyQualifiedName)(project, null, infinityConsole.network.name));
                let bytes = hardhat_1.ethers.utils.hexlify(hardhat_1.ethers.utils.toUtf8Bytes('%CID%' + cid));
                yield projectContract.setInitialProject(bytes),
                    'Set Initial project';
            }
        }),
    };
    exports.default = InfinityMintProject;
});
//# sourceMappingURL=InfinityMintProject.js.map