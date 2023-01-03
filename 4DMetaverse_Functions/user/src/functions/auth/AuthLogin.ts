import { Base64 } from 'js-base64';
import * as express from 'express';
import { createHash } from 'crypto';

import IUser from '../../share/entities/IUser';
import EUserFlag from '../../share/enum/EUserFlag';
import injector from '../../share/utility/Injector';
import EUserStatus from '../../share/enum/EUserStatus';
import IFunction from '../../share/functions/IFunction';
import TokenManager from '../../share/utility/TokenManager';
import { GetUserByEmail } from '../../database/UserDatabase';
import RequestValidator from '../../share/utility/RequestValidator';
import { CreateLoginDevice } from '../../database/LoginDeviceDatabase';

/**
 * @api {GET} /auth/login Login
 * @apiGroup Auth
 * 
 * @apiDescription Login to get token. If user is enable 2fa, return phone and
 * temp token instead.
 * 
 * @apiPermission none
 * 
 * @apiHeader {string} Authorization basic or web3 signed token
 * 
 * @apiSuccess accessToken token for access api
 * @apiSuccess refreshToken token to refresh accessToken
 * @apiError 400 request validate fail
 * @apiError 404 user not found
 * @apiError 429 too many sms send request
 * @apiError 501 web3 login
 */
class AuthLogin implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            header: ["Authorization"]
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return true;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const authorization = req.get('Authorization')!;
        const [type, token] = authorization.split(' ');
        let user: IUser;
        if (type === 'Basic') {
            const [email, password] = Base64.decode(token).split(':');
            const hashPass = createHash('SHA256').update(password).digest('base64');
            const getRes = await GetUserByEmail(email);
            if (!getRes.ok) return res.status(404).send('user not found');
            user = await getRes.json() as IUser;
            if (user.password !== hashPass) return res.status(403).send('password check fail');
        } else {
            return res.status(501).send('web3 login not implement yet');
        }
        if (user.status !== EUserStatus.Active) {
            return res.status(403).send('user disabled');
        }
        if ((user.flag! & EUserFlag.Enable2FA) != 0) {
            const tempToken = injector.get<TokenManager>('TokenManager').createTempToken(user, ['GET:/auth/2fa_verify', `GET:/verifysms/send?phone=${user.phone}`]);
            return res.status(200).json({
                phone: user.phone,
                tempToken: tempToken
            });
        }
        const [nonce, access, refresh] = await injector.get<TokenManager>('TokenManager').createToken(user);
        void CreateLoginDevice({
            id: nonce,
            userId: user.id,
        });
        return res.status(200).json({
            accessToken: access,
            refreshToken: refresh
        });
    }
}

export default AuthLogin;
