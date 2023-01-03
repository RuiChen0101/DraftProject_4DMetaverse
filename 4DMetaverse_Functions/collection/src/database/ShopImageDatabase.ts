import injector from '../share/utility/Injector'
import IShopImage from '../share/entities/IShopImage';
import FetchProxy, { Response } from '../share/utility/FetchProxy'

export const CreateShopImage = (shopImage: IShopImage): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/shopImage/create`, {
        method: 'POST',
        body: JSON.stringify(shopImage),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const SwitchCoverShopImage = (id: number): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/shopImage/${id}/switchCover`, {
        method: 'PUT',
    });
}

export const DeleteShopImage = (id: number): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/shopImage/${id}/delete`, {
        method: 'DELETE',
    });
}