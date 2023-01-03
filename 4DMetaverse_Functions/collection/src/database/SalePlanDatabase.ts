import injector from '../share/utility/Injector';
import ISalePlan from '../share/entities/ISalePlan';
import FetchProxy, { Response } from '../share/utility/FetchProxy';

export const CreateSalePlan = (salePlan: ISalePlan): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/salePlan/create`, {
        method: 'POST',
        body: JSON.stringify(salePlan),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const UpdateSalePlan = (id: string, salePlan: ISalePlan): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/salePlan/${id}/update`, {
        method: 'PUT',
        body: JSON.stringify(salePlan),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const SetCollectionSalePlan = (id: string, collectionIds: string[]): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/salePlan/${id}/setCollections`, {
        method: 'PUT',
        body: JSON.stringify({ collectionIds: collectionIds }),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const SwitchDefaultSalePlan = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/salePlan/${id}/switchDefault`, {
        method: 'PUT'
    });
}

export const DeleteSalePlan = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/salePlan/${id}/delete`, {
        method: 'DELETE',
    });
}

export const GetSalePlan = (id: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/salePlan/${id}/get`);
}