import { Request, Response } from 'express';
import { getConfigFile, readGlobalSession } from '../../app/helpers';
import { getPrivateKeys } from '../../app/web3';

export const get = async (req: Request, res: Response) => {
    let session = readGlobalSession();
    let config = getConfigFile();
    let accountLength = (config.ganache as any)?.wallet?.totalAccounts || 20;
    let mnemonic = session?.environment?.ganacheMnemonic;
    let keys = getPrivateKeys(mnemonic, accountLength);

    return {
        mnemonic: mnemonic,
        keys: keys,
    };
};
