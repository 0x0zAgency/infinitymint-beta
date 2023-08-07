import { Request, Response } from 'express';
import { addImport } from '../../../app/imports';
import multer from 'multer';
import fs from 'fs';
import { saveImportCache } from '../../../app/imports';
import { ExpressError } from '../../../app/express';

/**
 * Create a multer instance to handle file uploads
 */
const upload = multer({ dest: 'temp/uploads/' });

/**
 * This is middleware that is used to handle the post request
 */
export const middleware = {
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
export const post = async (req: Request, res: Response) => {
    let file = req.file;

    if (!file) return new ExpressError('No file uploaded');

    //check that the extension is valid
    let extension = file.originalname.split('.').pop().toLowerCase();
    if (!['png', 'jpg', 'jpeg', 'gif', 'mp4', 'mp3', 'wav'].includes(extension))
        return new ExpressError('Invalid file type');

    //write file to imports
    fs.copyFileSync(
        file.path,
        'imports/' + file.originalname.replace(/ /g, '_')
    );
    //add to imports
    let importCache = addImport(
        'imports/' + file.originalname.replace(/ /g, '_')
    );
    saveImportCache(importCache);

    let key =
        importCache.keys['imports/' + file.originalname.replace(/ /g, '_')];

    return {
        success: true,
        path: importCache.database[key],
        key,
    };
};
