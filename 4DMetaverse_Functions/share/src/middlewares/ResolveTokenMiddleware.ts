import * as express from 'express';
import { logger } from 'firebase-functions';

import IMiddleware from './IMiddleware';

import injector from '../utility/Injector';
import TokenManager from '../utility/TokenManager';
import ForbiddenException from '../exceptions/ForbiddenException';

// verify jwt token in the header and preform
// token validation check then load auth data to request body
class ResolveTokenMiddleware implements IMiddleware {
    async middleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        if ((req.get('Authorization') === undefined && req.query.accessToken === undefined) || req.loaded.user !== undefined) {
            return next();
        }
        const accessToken: string = req.get('Authorization')?.split(' ')[1] ?? (req.query.accessToken as string);
        try {
            const requestUrl: string = `/${process.env.FUNCTION_TARGET!}${req.originalUrl}`;
            const auth = await injector.get<TokenManager>('TokenManager').resolveToken(accessToken, req.method, requestUrl);
            logger.log(`Auth with ${auth.id}-${auth.name} role:${auth.role}`, auth);
            req.loaded.auth = auth;
        } catch (e: any) {
            req.loaded.user = undefined;
            logger.error(`Token resolve fail: ${e.message}`);
            if (e instanceof ForbiddenException) {
                return res.status(403).send(e.message);
            }
        }
        return next();
    }
}

export default ResolveTokenMiddleware;