import injector from '../share/utility/Injector';
import RedisClient from '../share/utility/RedisClient';
import { CreateVerifySms, UpdateSmsCodeUsed } from "../database/VerifySmsDatabase";
import FunctionExecutionFailException from "../share/exceptions/FunctionExecutionFailException";

export default class VerifySmsService {
    public async send(phone: string): Promise<void> {
        const verifyCodeCache = injector.get<RedisClient>('VerifyCodeCache');
        if (await verifyCodeCache.exist(phone)) {
            throw new FunctionExecutionFailException(429);
        }
        const verifyCode: string = '111111';
        await verifyCodeCache.set(phone, verifyCode);
        void verifyCodeCache.expire(phone, 180);
        void CreateVerifySms({
            phone: phone,
            verifyCode: verifyCode
        })
        // send real sms message
    }

    public async verify(phone: string, verifyCode: string): Promise<boolean> {
        const verifyCodeCache = injector.get<RedisClient>('VerifyCodeCache')
        const cachedCode = await verifyCodeCache.get(phone);
        if (cachedCode === null || cachedCode !== verifyCode) return false;
        void verifyCodeCache.del(phone);
        void UpdateSmsCodeUsed(phone, verifyCode);
        return true;
    }
}