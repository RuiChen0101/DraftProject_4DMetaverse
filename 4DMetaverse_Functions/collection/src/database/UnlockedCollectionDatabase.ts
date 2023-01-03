import IUnlockedCollection from '../share/entities/IUnlockedCollection';
import injector from '../share/utility/Injector'
import FetchProxy, { Response } from '../share/utility/FetchProxy'

export const CreateUnlockedCollection = (unlockedCollection: IUnlockedCollection): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/unlockedCollection/create`, {
        method: 'POST',
        body: JSON.stringify(unlockedCollection),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const DeleteUnlockedCollection = (id: number): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/unlockedCollection/${id}/delete`, {
        method: 'DELETE',
    });
}