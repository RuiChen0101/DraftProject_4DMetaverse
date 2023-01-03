import * as express from 'express';
import EUserRole from '../enum/EUserRole';
import { logger } from 'firebase-functions';

import IMiddleware from './IMiddleware';
import IAuth from '../entities/IAuth';
import EAuthType from '../enum/EAuthType';

class AnonymousAuthMiddleware implements IMiddleware {
    async middleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        if (req.loaded.auth !== undefined) {
            return next();
        }
        const auth: IAuth = {
            id: 'anonymous',
            name: 'anonymous',
            type: EAuthType.Access,
            allow: ['*'],
            role: EUserRole.Anonymous,
            flag: 0,
            status: 1,
            nonce: 'anonymous',
            exp: 0
        }
        req.loaded.auth = auth;
        logger.log(`Auth with anonymous, from ip: ${req.get('x-forwarded-for')}`);
        return next();
    }
}

export default AnonymousAuthMiddleware;