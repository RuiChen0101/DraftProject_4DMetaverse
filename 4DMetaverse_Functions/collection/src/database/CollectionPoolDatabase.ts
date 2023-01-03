import injector from '../share/utility/Injector';
import ICollectionPool from '../share/entities/ICollectionPool';
import FetchProxy, { Response } from '../share/utility/FetchProxy';

export const CreateCollectionPool = (collectionPool: ICollectionPool): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/collectionPool/create`, {
        method: 'POST',
        body: JSON.stringify(collectionPool),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const UpdateCollectionPool = (id: number, collectionPool: ICollectionPool): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/collectionPool/${id}/update`, {
        method: 'PUT',
        body: JSON.stringify(collectionPool),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const DeleteCollectionPool = (id: number): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/collectionPool/${id}/delete`, {
        method: 'DELETE',
    });
}