import * as express from 'express';

import IUser from '../../share/entities/IUser';
import EAuthType from '../../share/enum/EAuthType';
import injector from '../../share/utility/Injector';
import { GetUser } from '../../database/UserDatabase';
import EUserStatus from '../../share/enum/EUserStatus';
import IFunction from '../../share/functions/IFunction';
import TokenManager from '../../share/utility/TokenManager';
import { UpdateLoginDeviceRefreshAt } from '../../database/LoginDeviceDatabase';

/**
 * @api {GET} /auth/refresh Refresh Token
 * @apiGroup Auth
 * 
 * @apiDescription Get new access token by refresh token
 * 
 * @apiPermission Any user
 * 
 * @apiHeader {string} Authorization refresh token
 * 
 * @apiSuccess accessToken token for access api
 * @apiSuccess refreshToken token to refresh accessToken
 * @apiError 400 request validate fail
 * @apiError 403 refresh forbidden
 */
class AuthRefresh implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return true;
    }

    async permission(req: express.Request): Promise<boolean> {
        return req.loaded.auth.type === EAuthType.Refresh;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        try {
            const user: IUser = await (await GetUser(req.loaded.auth.id)).json() as IUser;
            if (user.status !== EUserStatus.Active) return res.status(403).send('user disabled');
            const [access, refresh] = await injector.get<TokenManager>('TokenManager').refreshingToken(req.loaded.auth, user);
            void UpdateLoginDeviceRefreshAt(req.loaded.auth.nonce);
            return res.status(200).json({
                accessToken: access,
                refreshToken: refresh
            });
        } catch (e: any) {
            return res.status(403).send(e.message);
        }
    }
}

export default AuthRefresh;
