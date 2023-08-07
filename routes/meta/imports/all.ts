import { Request, Response } from 'express';
import { getImports } from '../../../app/imports';

export const get = async (req: Request, res: Response) => {
    let page = parseInt(req.query.page as string) || 1;
    let search = req.query.search as string;

    if (search?.length < 2) search = null;

    let importCache = await getImports();
    let keys = Object.keys(importCache.database);

    if (search && search.length > 0) {
        keys = keys.filter(
            (key) =>
                key.includes(search) ||
                importCache.database[key].name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                importCache.database[key].base
                    .toLowerCase()
                    .includes(search.toLowerCase())
        );
    }

    let imports = keys.slice((page - 1) * 100, page * 100);

    let newImports = {};
    imports.forEach((key) => (newImports[key] = importCache.database[key]));
    return {
        imports: newImports,
        page,
        count: keys.length,
        pages: Math.ceil(keys.length / 100),
    };
};
