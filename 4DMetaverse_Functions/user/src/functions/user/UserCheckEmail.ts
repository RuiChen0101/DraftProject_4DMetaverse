import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { GetUserByEmail } from '../../database/UserDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {GET} /user/check/email?email={email} Get User
 * @apiGroup User
 * 
 * @apiDescription Get user data
 * 
 * @apiPermission Admin or User itself
 * 
 * @apiHeader {string} Authorization 
 * 
 * @apiParam {string} email email of user
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 403 forbidden
 * @apiError 404 email not use
 */
class UserCheckEmail implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['email'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return true;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const email: string = decodeURIComponent(req.query.email as string);
        const getRes = await GetUserByEmail(email);
        if (!getRes.ok) return res.sendStatus(getRes.status);
        return res.sendStatus(204);
    }
}

export default UserCheckEmail;
