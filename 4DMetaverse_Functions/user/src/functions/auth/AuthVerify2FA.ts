import * as express from 'express';

import IUser from '../../share/entities/IUser';
import { GetUser } from '../../database/UserDatabase';
import injector from '../../share/utility/Injector';
import IFunction from '../../share/functions/IFunction';
import VerifySmsService from '../../service/VerifySmsService';
import TokenManager from '../../share/utility/TokenManager';
import { CreateLoginDevice } from '../../database/LoginDeviceDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {GET} /auth/2fa_verify?verifyCode={verifyCode} 2FA Verify
 * @apiGroup Auth
 * 
 * @apiDescription Verify 2 step authorization
 * 
 * @apiPermission Any user
 * 
 * @apiHeader {string} Authorization 
 * 
 * @apiParam {string} verifyCode verify code send via sms
 * 
 * @apiSuccess accessToken token for access api
 * @apiSuccess refreshToken token to refresh accessToken
 * @apiError 400 request validate fail
 * @apiError 403 verify fail
 * @apiError 404 verifyCode not found
 */
class AuthVerify2FA implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['verifyCode'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return true;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const verifyCode = req.query.verifyCode as string;
        const verifySmsService = injector.get<VerifySmsService>('VerifySmsService');
        const user: IUser = await (await GetUser(req.loaded.auth.id)).json() as IUser;
        if (!(await verifySmsService.verify(user.phone!, verifyCode))) {
            return res.sendStatus(403);
        }
        const [nonce, access, refresh] = await injector.get<TokenManager>('TokenManager').createToken(user);
        await CreateLoginDevice({
            id: nonce,
            userId: user.id,
        })
        return res.status(200).json({
            accessToken: access,
            refreshToken: refresh
        });
    }
}

export default AuthVerify2FA;
