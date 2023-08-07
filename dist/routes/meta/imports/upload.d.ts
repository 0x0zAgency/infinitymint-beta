/// <reference types="qs" />
import { Request, Response } from 'express';
import { ExpressError } from '../../../app/express';
/**
 * This is middleware that is used to handle the post request
 */
export declare const middleware: {
    post: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
    get: any[];
};
/**
 *
 * @param infinityConsole
 * @param req
 * @param res
 * @returns
 */
export declare const post: (req: Request, res: Response) => Promise<ExpressError | {
    success: boolean;
    path: import("../../../app/imports").ImportType;
    key: string;
}>;
//# sourceMappingURL=upload.d.ts.map