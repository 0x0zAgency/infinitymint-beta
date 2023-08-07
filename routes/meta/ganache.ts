import InfinityConsole from '../../app/console';
import { Request, Response } from 'express';
import { getConfigFile, readGlobalSession } from '../../app/helpers';
import { getPrivateKeys } from '../../app/ganache';

export const get = async (
    infinityConsole: InfinityConsole,
    req: Request,
    res: Response
) => {
    let session = readGlobalSession();
    let config = getConfigFile();
    let accountLength = (config.ganache as any).wallet?.totalAccounts || 20;
    let mnemonic = session.environment.ganacheMnemonic;
    let keys = getPrivateKeys(mnemonic, accountLength);
    res.json({
        mnemonic: mnemonic,
        keys: keys,
    });
};
