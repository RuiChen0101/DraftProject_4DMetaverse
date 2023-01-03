import * as express from 'express';

import injector from '../../share/utility/Injector';
import IFunction from '../../share/functions/IFunction';
import VerifySmsService from '../../service/VerifySmsService';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {POST} /verifysms/send?phone={phone} Send Verify Sms
 * @apiGroup Verify Sms
 * 
 * @apiDescription Send verify sms
 * 
 * @apiPermission Any user
 * 
 * @apiHeader {string} Authorization 
 * 
 * @apiParam {string} phone phone
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 429 too many sms send request
 */
class VerifySmsSend implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['phone'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return true;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const phone: string = req.query.phone as string;
        await injector.get<VerifySmsService>('VerifySmsService').send(phone);
        return res.sendStatus(204);
    }
}

export default VerifySmsSend;
