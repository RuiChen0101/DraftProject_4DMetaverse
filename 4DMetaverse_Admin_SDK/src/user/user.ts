import { IUser } from './entities';
import { App, EAuthLevel } from '../app';
import AdminSDKException from '../exception/admin-sdk-exception';

export interface UserCreateDto {
    name: string;
    email: string;
    password: string;
    role: number;
}

export interface UserUpdateDto {
    name: string;
    loginMethods?: number;
    phone?: string;
    role?: number;
    flag?: number;
    status?: number;
}

export class User {
    private readonly _app: App;

    constructor(app: App) {
        this._app = app;
    }

    public async create(createDto: UserCreateDto): Promise<string> {
        const res = await this._app.callApi({
            url: '{baseUrl}/user/create?method=email',
            method: 'POST',
            body: JSON.stringify(createDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Create user fail: response ${res.status}`);
        return await res.text();
    }

    public async update(id: string, updateDto: UserUpdateDto): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/user/update?userId=${id}`,
            method: 'PUT',
            body: JSON.stringify(updateDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Update user fail: response ${res.status}`);
    }

    public async get(id: string): Promise<IUser> {
        const res = await this._app.callApi({
            url: `{baseUrl}/user/get?userId=${id}`,
            method: 'GET',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Update user fail: response ${res.status}`);
        return await res.json();
    }
}