import injector from "../share/utility/Injector";
import IVerifySms from "../share/entities/IVerifySms";
import FetchProxy, { Response } from '../share/utility/FetchProxy'

export const CreateVerifySms = (record: IVerifySms): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/verifySms/create`, {
        method: 'POST',
        body: JSON.stringify(record),
        headers: { 'Content-Type': 'application/json' }
    });
}

export const UpdateSmsCodeUsed = (phone: string, verifyCode: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/verifySms/updateUsed/${phone}/${verifyCode}`, {
        method: 'PUT',
    });
}

export const GetVerifySmsByCode = (verifyCode: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.USER_DB}/get/verifyCode/${verifyCode}`);
}