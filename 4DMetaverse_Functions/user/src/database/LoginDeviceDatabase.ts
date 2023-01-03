import injector from "../share/utility/Injector";
import ILoginDevice from "../share/entities/ILoginDevice";
import FetchProxy, { Response } from "../share/utility/FetchProxy";

export const CreateLoginDevice = (device: ILoginDevice): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/loginDevice/create`, {
        method: 'POST',
        body: JSON.stringify(device),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const UpdateLoginDevice = (id: string, device: ILoginDevice): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/loginDevice/${id}/update`, {
        method: 'PUT',
        body: JSON.stringify(device),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const UpdateLoginDeviceRefreshAt = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/loginDevice/${id}/update/refresh`, {
        method: 'PUT',
    });
}

export const DeleteLoginDevice = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/loginDevice/${id}/delete`, {
        method: 'DELETE',
    });
}