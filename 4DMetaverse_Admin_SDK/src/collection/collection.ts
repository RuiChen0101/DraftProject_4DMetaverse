import { App, EAuthLevel } from '../app';
import AdminSDKException from '../exception/admin-sdk-exception';
import { ICollection } from './entities';

export interface CollectionCreateDto {
    collectionPoolId: number;
    title: string;
    type: number;
    previewImageUrl: string;
    unlockedImageUrl: string;
    mediaUrl: string;
    data?: { [key: string]: any };
    available?: number;
}

export interface CollectionPoolCreateDto {
    name: string;
    coverImageUrl?: string;
}

export interface CollectionUpdateDto {
    title?: string;
    type?: number;
    previewImageUrl?: string;
    unlockedImageUrl?: string;
    mediaUrl?: string;
    status?: number;
    data?: { [key: string]: any };
    available?: number;
}

export interface CollectionPoolUpdateDto {
    name: string;
    coverImageUrl: string;
}

export class Collection {
    private readonly _app: App;

    constructor(app: App) {
        this._app = app;
    }

    public async create(createDto: CollectionCreateDto): Promise<string> {
        const res = await this._app.callApi({
            url: '{baseUrl}/collection/create',
            method: 'POST',
            body: JSON.stringify(createDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Create collection fail: response ${res.status}`);
        return await res.text();
    }

    public async createPool(createPoolDto: CollectionPoolCreateDto): Promise<number> {
        const res = await this._app.callApi({
            url: '{baseUrl}/collectionpool/create',
            method: 'POST',
            body: JSON.stringify(createPoolDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Create collection pool fail: response ${res.status}`);
        return parseInt(await res.text());
    }

    public async update(id: string, updateDto: CollectionUpdateDto): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/collection/update?collectionId=${id}`,
            method: 'PUT',
            body: JSON.stringify(updateDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Update collection fail: response ${res.status}`);
    }

    public async updatePool(id: number, updateDto: CollectionPoolUpdateDto): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/collectionpool/update?poolId=${id}`,
            method: 'PUT',
            body: JSON.stringify(updateDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Update collection pool fail: response ${res.status}`);
    }

    public async delete(id: string): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/collection/delete?collectionId=${id}`,
            method: 'DELETE',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Delete collection fail: response ${res.status}`);
    }

    public async deletePool(id: string): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/collectionpool/delete?collectionId=${id}`,
            method: 'DELETE',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Delete collection pool fail: response ${res.status}`);
    }

    public async get(id: string): Promise<ICollection> {
        const res = await this._app.callApi({
            url: `{baseUrl}/collection/get?collectionId=${id}`,
            method: 'GET',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Get collection fail: response ${res.status}`);
        return await res.json();
    }
}