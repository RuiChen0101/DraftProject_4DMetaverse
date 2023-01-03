import { App, EAuthLevel } from '../app';
import AdminSDKException from '../exception/admin-sdk-exception';

export interface ShopGroupCreateDto {
    title: string;
    tags?: string[];
    coverImageUrl?: string;
}

export interface ShopGroupUpdateDto {
    title?: string;
    tags?: string[];
    coverImageUrl?: string;
    status?: number;
}

export class ShopGroup {
    private readonly _app: App;

    constructor(app: App) {
        this._app = app;
    }

    public async create(createDto: ShopGroupCreateDto): Promise<string> {
        const res = await this._app.callApi({
            url: '{baseUrl}/shopGroup/create',
            method: 'POST',
            body: JSON.stringify(createDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Create shop group fail: response ${res.status}`);
        return await res.text();
    }

    public async update(id: string, updateDto: ShopGroupUpdateDto): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/shopGroup/update?groupId=${id}`,
            method: 'PUT',
            body: JSON.stringify(updateDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Update shop group fail: response ${res.status}`);
    }

    public async delete(id: string): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/shopGroup/delete?groupId=${id}`,
            method: 'DELETE',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Delete shop group fail: response ${res.status}`);
    }
}