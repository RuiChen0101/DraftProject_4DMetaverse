import { App, EAuthLevel } from '../app';
import { IDirectory, IFile } from './entities';
import AdminSDKException from '../exception/admin-sdk-exception';

export interface ListDirDto {
    dirs: IDirectory[],
    files: IFile[]
}

export class Storage {
    private readonly _app: App;

    constructor(app: App) {
        this._app = app;
    }

    public async upload(file: File, path: string, supplementData?: { [key: string]: any }): Promise<void> {
        const formData = new window.FormData();
        formData.append('file', file);
        formData.append('path', path);
        if (supplementData !== undefined) {
            formData.append('supplementData', JSON.stringify(supplementData));
        }
        const res = await this._app.callApi({
            url: '{storageBaseUrl}/file/upload',
            method: 'POST',
            body: formData,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`File upload fail: response ${res.status}`);
    }

    public async ensurePath(path: string): Promise<void> {
        const res = await this._app.callApi({
            url: '{baseUrl}/directory/ensure-path',
            method: 'POST',
            body: JSON.stringify({ path: path }),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Ensure path fail: response ${res.status}`);
    }

    public async updateDirLocking(id: number, locking: boolean): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/directory/update/locking?dirId=${id}`,
            method: 'POST',
            body: JSON.stringify({ isLocked: locking }),
            json: true,
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Update dir locking fail: response ${res.status}`);
    }

    public async deleteDir(id: number): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/directory/delete?dirId=${id}`,
            method: 'DELETE',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Delete dir fail: response ${res.status}`);
    }

    public async deleteFile(id: number): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/file/delete?fileId=${id}`,
            method: 'DELETE',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Delete file fail: response ${res.status}`);
    }

    public async listDir(dirId: number): Promise<ListDirDto> {
        const res = await this._app.callApi({
            url: `{baseUrl}/directory/list?dirId=${dirId}`,
            method: 'GET',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`List dir fail: response ${res.status}`);
        return await res.json();
    }

    public async listDirByPath(path: string): Promise<ListDirDto> {
        const res = await this._app.callApi({
            url: `{baseUrl}/directory/list/by-path?path=${encodeURIComponent(path)}`,
            method: 'GET',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`List dir by path fail: response ${res.status}`);
        return await res.json();
    }

    public async metadata(fileId: string): Promise<IFile> {
        const res = await this._app.callApi({
            url: `{baseUrl}/file/metadata?fileId=${fileId}`,
            method: 'GET',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`Get metadata fail: response ${res.status}`);
        return await res.json();
    }

    public async download(fileUrl: string): Promise<Blob> {
        const res = await this._app.callApi({
            url: fileUrl,
            method: 'GET',
            auth: EAuthLevel.Require
        });
        if (!res.ok) throw new AdminSDKException(`File download fail: response ${res.status}`);
        return await res.blob();
    }
}