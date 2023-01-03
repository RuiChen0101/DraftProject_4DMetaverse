import IShopGroup from '../share/entities/IShopGroup';
import injector from '../share/utility/Injector'
import FetchProxy, { Response } from '../share/utility/FetchProxy'

export const CreateShopGroup = (shopGroup: IShopGroup): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/shopGroup/create`, {
        method: 'POST',
        body: JSON.stringify(shopGroup),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const UpdateShopGroup = (id: string, shopGroup: IShopGroup): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/shopGroup/${id}/update`, {
        method: 'PUT',
        body: JSON.stringify(shopGroup),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const DeleteShopGroup = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/shopGroup/${id}/delete`, {
        method: 'DELETE',
    });
}