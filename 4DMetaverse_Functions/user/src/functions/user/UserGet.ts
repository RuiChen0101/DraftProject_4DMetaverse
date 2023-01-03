import * as express from 'express';

import { GetUser } from '../../database/UserDatabase';
import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {POST} /user/get?userId={userId} Get User
 * @apiGroup User
 * 
 * @apiDescription Get user data
 * 
 * @apiPermission Admin or User itself
 * 
 * @apiHeader {string} Authorization 
 * 
 * @apiParam {string} userId id of user
 * 
 * @apiSuccess {json} user
 * @apiError 400 request validate fail
 * @apiError 403 forbidden
 * @apiError 404 user not found
 */
class UserGet implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['userId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return req.loaded.auth.id === req.query.userId || isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const userId: string = req.query.userId as string;
        const getRes = await GetUser(userId);
        if (!getRes.ok) return res.sendStatus(getRes.status);
        return res.status(200).json(await getRes.json());
    }
}

export default UserGet;
