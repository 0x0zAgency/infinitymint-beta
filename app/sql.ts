import { readGlobalSession } from './helpers';
import { db } from '../core';

//gets all the window settings
export const allWindowSettings = async (uuid?: string) => {
    if (uuid === undefined)
        uuid = readGlobalSession().environment?.globalUserId;

    if (uuid === undefined) throw new Error('uuid is undefined');

    let result = await db.get(
        'SELECT * FROM window_settings WHERE uuid = ?',
        uuid
    );

    return result;
};

export const allProjects = async (
    uuid?: string,
    type?: 'all' | 'temp' | 'compiled' | 'deployed'
) => {};

export const allImports = async (uuid?: string) => {};

export const migrateGlobalUser = async (newId: string) => {};

//gets all the deployments
export const allDeployments = async (uuid?: string) => {
    if (uuid === undefined)
        uuid = readGlobalSession().environment?.globalUserId;

    if (uuid === undefined) throw new Error('uuid is undefined');

    let result = await db.get('SELECT * FROM deployments WHERE uuid = ?', uuid);

    return result;
};

//gets the settings for the window
export const allTransactions = async (uuid?: string, project?: string) => {
    if (uuid === undefined)
        uuid = readGlobalSession().environment?.globalUserId;

    if (uuid === undefined) throw new Error('uuid is undefined');

    let result = await db.get(
        'SELECT * FROM transactions WHERE uuid = ?',
        uuid
    );

    return result;
};
