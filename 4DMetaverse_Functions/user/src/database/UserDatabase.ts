import IUser from '../share/entities/IUser';
import injector from '../share/utility/Injector'
import FetchProxy, { Response } from '../share/utility/FetchProxy'

export const CreateUser = (user: IUser): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/user/create`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const UpdateUser = (id: string, user: IUser): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/user/${id}/update`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const GetUser = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/user/${id}/get`);
}

export const GetUserByEmail = (email: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/user/get/email/${encodeURIComponent(email)}`);
}