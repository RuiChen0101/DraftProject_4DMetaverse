import { getApp } from '../app';

import { User } from './user';

export const getUser = (): User => {
    const app = getApp();
    return app.getOrInitialize('user', (app) => new User(app));
}

export { IWeb3Wallet, IUser } from './entities';
export { UserCreateDto, UserUpdateDto } from './user';
export { User };