import Config from '../share/config/Config';
import injector from '../share/utility/Injector';

export const setupLocalInjector = () => {
    injector.setFactory('VerifyCodeCache', () => new (require('../share/utility/RedisClient')).default(Config.redis.verify_code_cache));
    injector.setFactory('VerifySmsService', () => new (require('../service/VerifySmsService')).default());
}