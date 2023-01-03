import { getApp } from '../app';
import Database from './database';

export const getDatabase = (): Database => {
    const app = getApp();
    return app.getOrInitialize('database', (app) => new Database(app));
}

export { Query, IQueryResult } from './query';
export { RawQuery } from './raw-query';
export { Database };