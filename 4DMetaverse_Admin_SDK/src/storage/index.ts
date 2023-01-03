import { getApp } from '../app';

import { Storage } from './storage';

export const getStorage = (): Storage => {
    const app = getApp();
    return app.getOrInitialize('store', (app) => new Storage(app));
}

export { IFile, IDirectory } from './entities';
export { ListDirDto } from './storage';
export { Storage };