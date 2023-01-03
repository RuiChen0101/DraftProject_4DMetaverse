import injector from '../share/utility/Injector';
import ICollection from '../share/entities/ICollection';
import FetchProxy, { Response } from '../share/utility/FetchProxy';

export const CreateCollection = (collection: ICollection): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/collection/create`, {
        method: 'POST',
        body: JSON.stringify(collection),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const UpdateCollection = (id: string, collection: ICollection): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/collection/${id}/update`, {
        method: 'PUT',
        body: JSON.stringify(collection),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const DeleteCollection = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/collection/${id}/delete`, {
        method: 'DELETE',
    });
}

export const GetCollection = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/collection/${id}/get`);
}