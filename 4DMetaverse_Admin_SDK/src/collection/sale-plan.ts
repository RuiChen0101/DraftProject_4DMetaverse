import { App, EAuthLevel } from '../app';
import AdminSDKException from '../exception/admin-sdk-exception';
import { ISalePlan } from './entities';

export interface SalePlanCreateDto {
    shopId: string;
    name: string;
    price: string;
    isDefault?: boolean;
}

export interface SalePlanUpdateDto {
    name?: string;
    price?: number;
    status?: number;
}

export class SalePlan {
    private readonly _app: App;

    constructor(app: App) {
        this._app = app;
    }

    public async create(createDto: SalePlanCreateDto): Promise<string> {
        const res = await this._app.callApi({
            url: '{baseUrl}/saleplan/create',
            method: 'POST',
            body: JSON.stringify(createDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Create sale plan fail: response ${res.status}`);
        return await res.text();
    }

    public async update(id: string, updateDto: SalePlanUpdateDto): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/saleplan/update?planId=${id}`,
            method: 'PUT',
            body: JSON.stringify(updateDto),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Update sale plan fail: response ${res.status}`);
    }

    public async setCollections(id: string, collectionIds: string[]): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/saleplan/set-collections?planId=${id}`,
            method: 'PUT',
            body: JSON.stringify({ collectionIds: collectionIds }),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Set sale plan collection fail: response ${res.status}`);
    }

    public async switchDefault(id: string): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/saleplan/switch-default?planId=${id}`,
            method: 'PUT',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Switch default sale plan fail: response ${res.status}`);
    }

    public async delete(id: string): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/saleplan/delete?planId=${id}`,
            method: 'DELETE',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Delete sale plan fail: response ${res.status}`);
    }

    public async get(id: string): Promise<ISalePlan> {
        const res = await this._app.callApi({
            url: `{baseUrl}/saleplan/get?planId=${id}`,
            method: 'GET',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Get sale plan fail: response ${res.status}`);
        return await res.json();
    }
}