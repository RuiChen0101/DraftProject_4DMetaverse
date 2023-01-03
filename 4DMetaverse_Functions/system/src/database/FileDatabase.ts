import injector from '../share/utility/Injector';
import FetchProxy, { Response } from '../share/utility/FetchProxy';

export const DeleteFile = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.STORAGE_SERVICE}/file/${id}/delete`, {
        method: 'DELETE'
    });
}

export const ListFileByDirId = (id: number): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.STORAGE_SERVICE}/file/list/dirId/${id}`);
}

export const ListFileByPathPrefix = (path: string): Promise<Response> => {
    const encoded = path === '' ? '%00' : encodeURIComponent(path);
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.STORAGE_SERVICE}/file/list/pathPrefix/${encoded}`);
}

export const GetFileMetadata = (value: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.STORAGE_SERVICE}/file/${value}/metadata`);
}