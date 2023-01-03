import * as express from 'express';

import IAuth from '../../share/entities/IAuth';
import EUserFlag from '../../share/enum/EUserFlag';
import injector from '../../share/utility/Injector';
import IFunction from '../../share/functions/IFunction';
import { UpdateUser } from '../../database/UserDatabase';
import VerifySmsService from '../../service/VerifySmsService';
import RequestValidator from '../../share/utility/RequestValidator';

/**
 * @api {PUT} /user/2fa_enable Enable 2FA
 * @apiGroup User
 * 
 * @apiDescription Enable 2FA
 * 
 * @apiPermission Any user
 * 
 * @apiHeader {string} Authorization 
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} phone phone
 * @apiParam {string} verifyCode verify code send via sms
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 403 verify fail
 */
class UserEnable2FA implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            require: ['phone', 'verifyCode'],
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return true;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const auth: IAuth = req.loaded.auth;
        const verifySmsService = injector.get<VerifySmsService>('VerifySmsService');
        if (!(await verifySmsService.verify(req.body.phone, req.body.verifyCode))) {
            return res.sendStatus(403);
        }
        const updateRes = await UpdateUser(auth.id, {
            phone: req.body.phone,
            flag: auth.flag | EUserFlag.Enable2FA,
            updateBy: auth.id
        });
        if (!updateRes.ok) return res.sendStatus(updateRes.status);
        return res.sendStatus(204);
    }
}

export default UserEnable2FA;
