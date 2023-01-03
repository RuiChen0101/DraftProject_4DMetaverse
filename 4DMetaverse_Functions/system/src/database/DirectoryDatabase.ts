import injector from '../share/utility/Injector';
import FetchProxy, { Response } from '../share/utility/FetchProxy';
import IDirectory from '../share/entities/IDirectory';

export const EnsureDirectoryPath = (path: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.STORAGE_SERVICE}/directory/ensurePath`, {
        method: 'POST',
        body: JSON.stringify({ path: path }),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const UpdateDirectory = (id: number, dir: IDirectory): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.STORAGE_SERVICE}/directory/${id}/update`, {
        method: 'PUT',
        body: JSON.stringify(dir),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const DeleteDirectory = (id: number): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.STORAGE_SERVICE}/directory/${id}/delete`, {
        method: 'DELETE'
    });
}

export const GetDirectory = (id: number): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.STORAGE_SERVICE}/directory/${id}/get`);
}

export const ListDirByParentId = (id: number): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.STORAGE_SERVICE}/directory/list/parentId/${id}`);
}

export const ListDirByPathPrefix = (path: string): Promise<Response> => {
    const encoded = path === '' ? '%00' : encodeURIComponent(path);
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.STORAGE_SERVICE}/directory/list/pathPrefix/${encoded}`);
}