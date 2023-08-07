(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../app/imports", "multer", "fs", "../../../app/imports", "../../../app/express"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.post = exports.middleware = void 0;
    const tslib_1 = require("tslib");
    const imports_1 = require("../../../app/imports");
    const multer_1 = tslib_1.__importDefault(require("multer"));
    const fs_1 = tslib_1.__importDefault(require("fs"));
    const imports_2 = require("../../../app/imports");
    const express_1 = require("../../../app/express");
    /**
     * Create a multer instance to handle file uploads
     */
    const upload = (0, multer_1.default)({ dest: 'temp/uploads/' });
    /**
     * This is middleware that is used to handle the post request
     */
    exports.middleware = {
        post: [upload.single('file')],
        get: [],
    };
    /**
     *
     * @param infinityConsole
     * @param req
     * @param res
     * @returns
     */
    const post = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let file = req.file;
        if (!file)
            return new express_1.ExpressError('No file uploaded');
        //check that the extension is valid
        let extension = file.originalname.split('.').pop().toLowerCase();
        if (!['png', 'jpg', 'jpeg', 'gif', 'mp4', 'mp3', 'wav'].includes(extension))
            return new express_1.ExpressError('Invalid file type');
        //write file to imports
        fs_1.default.copyFileSync(file.path, 'imports/' + file.originalname.replace(/ /g, '_'));
        //add to imports
        let importCache = (0, imports_1.addImport)('imports/' + file.originalname.replace(/ /g, '_'));
        (0, imports_2.saveImportCache)(importCache);
        let key = importCache.keys['imports/' + file.originalname.replace(/ /g, '_')];
        return {
            success: true,
            path: importCache.database[key],
            key,
        };
    });
    exports.post = post;
});
//# sourceMappingURL=upload.js.map