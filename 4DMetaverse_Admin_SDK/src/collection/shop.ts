import { IShop } from './entities';
import { App, EAuthLevel } from '../app';
import AdminSDKException from '../exception/admin-sdk-exception';

export interface ShopCreateDto {
    seriesId: string;
    title: string;
    description?: string;
}

export interface ShopQuickCreateDto {
    seriesId: string;
    collectionPoolId: number;
    shopTitle: string;
    shopCoverImage: string;
    collectionTitle: string;
    collectionType: number;
    previewImageUrl: string;
    unlockedImageUrl: string;
    mediaUrl: string;
    salePlanName: string;
    salePrice: number;
    shopDescription?: string;
    collectionAvailable?: number;
}

export interface ShopImageCreateDto {
    shopId: string;
    imageUrl: string;
    isCover?: boolean;
}

export interface ShopUpdateDto {
    title?: string;
    description?: string;
    status?: number;
}

export class Shop {
    private readonly _app: App;

    constructor(app: App) {
        this._app = app;
    }

    public async create(createDto: ShopCreateDto): Promise<string> {
        const res = await this._app.callApi({
            url: '{baseUrl}/shop/create',
            method: 'POST',
            body: JSON.stringify(createDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Create shop fail: response ${res.status}`);
        return await res.text();
    }

    public async quickCreate(quickCreateDto: ShopQuickCreateDto): Promise<string> {
        const res = await this._app.callApi({
            url: '{baseUrl}/shop/quick-create',
            method: 'POST',
            body: JSON.stringify(quickCreateDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Quick create shop fail: response ${res.status}`);
        return await res.text();
    }

    public async imageCreate(imageCreateDto: ShopImageCreateDto): Promise<void> {
        const res = await this._app.callApi({
            url: '{baseUrl}/shopimage/create',
            method: 'POST',
            body: JSON.stringify(imageCreateDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Create shop image fail: response ${res.status}`);
    }

    public async update(id: string, updateDto: ShopUpdateDto): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/shop/update?shopId=${id}`,
            method: 'PUT',
            body: JSON.stringify(updateDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Update shop fail: response ${res.status}`);
    }

    public async switchCoverImage(imageId: number): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/shopimage/switch-cover?imageId=${imageId}`,
            method: 'PUT',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Switch shop cover fail: response ${res.status}`);
    }

    public async get(id: string): Promise<IShop> {
        const res = await this._app.callApi({
            url: `{baseUrl}/shop/get?shopId=${id}`,
            method: 'GET',
            auth: EAuthLevel.Optional
        });
        if (!res.ok) throw new AdminSDKException(`Get shop fail: response ${res.status}`);
        return await res.json();
    }

    public async delete(id: string): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/shop/delete?shopId=${id}`,
            method: 'DELETE',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Delete shop fail: response ${res.status}`);
    }

    public async deleteImage(imageId: number): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/shopimage/delete?imageId=${imageId}`,
            method: 'DELETE',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Delete shop image fail: response ${res.status}`);
    }
}