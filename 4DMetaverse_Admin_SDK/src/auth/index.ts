import { getApp } from '../app';
import { Auth } from './auth';

export const getAuth = (): Auth => {
    const app = getApp();
    return app.getOrInitialize('auth', (app) => new Auth(app));
}

export { Auth };