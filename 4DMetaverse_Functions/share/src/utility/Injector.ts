import Config from '../config/Config';
import FetchProxy from './FetchProxy';
import InjectionHandler from './InjectionHandler';
import RedisClient from './RedisClient';
import TokenManager from './TokenManager';

const injector = new InjectionHandler({
    "FetchProxy": new FetchProxy(),
    "TokenManager": new TokenManager(),
    "TokenCache": new RedisClient(Config.redis.token_cache)
}, {
    "Timer": () => new (require('./time/Timer')).default(),
    "IdGenerator": () => new (require('./IdGenerator')).default()
})

export default injector;