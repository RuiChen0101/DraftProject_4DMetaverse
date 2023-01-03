import IShop from '../share/entities/IShop';
import injector from '../share/utility/Injector'
import FetchProxy, { Response } from '../share/utility/FetchProxy'

export const CreateShop = (shop: IShop): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/shop/create`, {
        method: 'POST',
        body: JSON.stringify(shop),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const UpdateShop = (id: string, shop: IShop): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/shop/${id}/update`, {
        method: 'PUT',
        body: JSON.stringify(shop),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const DeleteShop = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/shop/${id}/delete`, {
        method: 'DELETE',
    });
}

export const GetShop = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/shop/${id}/get`);
}