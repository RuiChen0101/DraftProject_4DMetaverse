import IPurchaseRecord from '../share/entities/IPurchaseRecord';
import injector from '../share/utility/Injector'
import FetchProxy, { Response } from '../share/utility/FetchProxy'

export const CreatePurchaseRecord = (purchaseRecord: IPurchaseRecord): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.MAIN_DB}/purchaseRecord/create`, {
        method: 'POST',
        body: JSON.stringify(purchaseRecord),
        headers: { 'Content-Type': 'application/json' }
    });
}