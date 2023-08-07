(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../app/projects", "../../app/express"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    const tslib_1 = require("tslib");
    const projects_1 = require("../../app/projects");
    const express_1 = require("../../app/express");
    const get = (req, res, infinityConsole) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let source = req.query.source;
        let version = req.query.version;
        let network = req.query.network || infinityConsole.network.name;
        let tokenId = parseInt(req.query.tokenId);
        if (isNaN(tokenId) || tokenId < 0)
            return new express_1.ExpressError('invalid token id');
        if (!source || !version || !tokenId)
            return new express_1.ExpressError('missing parameters');
        //remove special characters
        version = version.replace(/[^0-9.]/g, '');
        network = network.replace(/[^a-zA-Z0-9]/g, '');
        let projects = yield (0, projects_1.findProjects)();
        if (projects.length === 0)
            return new express_1.ExpressError('no projects found');
        let project = (0, projects_1.findProject)(source);
        if (!project)
            return new express_1.ExpressError('current project not deployed');
        if (!(0, projects_1.hasDeployedProject)(project, network, version))
            return new express_1.ExpressError('project not deployed');
        else {
            let projectClass = yield infinityConsole.getProject(project, network);
            let storage = yield projectClass.storage();
            let erc721 = yield projectClass.erc721();
            try {
                let tokenId = parseInt(req.params.id);
                let token = yield storage.get(tokenId);
                let uri = yield erc721.tokenURI(tokenId);
                //we use resJson to safely serialize the token and uri and return them
                return {
                    tokenId: tokenId,
                    token: token,
                    uri: uri,
                };
            }
            catch (error) {
                return new express_1.ExpressError('failed to fetch token data from blockchain');
            }
        }
    });
    exports.get = get;
});
//# sourceMappingURL=get.js.map