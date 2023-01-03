import * as express from 'express';

import { UpdateUser } from '../../database/UserDatabase';
import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import RequestValidator, { ProtectedFieldValidator } from '../../share/utility/RequestValidator';

/**
 * @api {PUT} /user/update?userId={userId} Update User
 * @apiGroup User
 * 
 * @apiDescription Update user data
 * 
 * @apiPermission Admin or User itself
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json 
 * 
 * @apiParam {string} userId id of user
 * @apiParam {string} [name] name of user
 * @apiParam {number} [loginMethods] loginMethods
 * @apiParam {string} [phone] phone
 * @apiParam {number} [role] role
 * @apiParam {number} [flag] flag
 * @apiParam {number} [status] status
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 user not found
 */
class UserUpdate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            query: ['userId'],
            option: ['name', 'loginMethods', 'phone', 'role', 'flag', 'status'],
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        if (isAdmin(req.loaded.auth)) return true;
        return req.loaded.auth.id === req.query.userId && ProtectedFieldValidator(
            ['loginMethods', 'phone', 'role', 'flag', 'status'],
            req
        );
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const userId: string = req.query.userId as string;
        const updateRes = await UpdateUser(userId, {
            ...req.body,
            updateBy: req.loaded.auth.id
        });
        if (!updateRes.ok) return res.sendStatus(updateRes.status);
        return res.sendStatus(204);
    }
}

export default UserUpdate;
