import * as express from 'express';

import injector from '../../share/utility/Injector';
import IFunction from '../../share/functions/IFunction';
import TokenManager from '../../share/utility/TokenManager';
import { DeleteLoginDevice } from '../../database/LoginDeviceDatabase';

/**
 * @api {GET} /auth/logout Auth Logout
 * @apiGroup Auth
 * 
 * @apiDescription Invalidate token
 * 
 * @apiPermission Any user
 * 
 * @apiHeader {string} Authorization token
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 403 logout forbidden
 */
class AuthLogout implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return true;
    }

    async permission(req: express.Request): Promise<boolean> {
        return true;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        await injector.get<TokenManager>('TokenManager').deleteToken(req.loaded.auth);
        void DeleteLoginDevice(req.loaded.auth.nonce);
        return res.sendStatus(204)
    }
}

export default AuthLogout;
