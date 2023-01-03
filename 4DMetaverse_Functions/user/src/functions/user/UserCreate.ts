import * as express from 'express';
import { createHash } from 'crypto';

import EUserRole from '../../share/enum/EUserRole';
import injector from '../../share/utility/Injector';
import EUserStatus from '../../share/enum/EUserStatus';
import IFunction from '../../share/functions/IFunction';
import { CreateUser } from '../../database/UserDatabase';
import IdGenerator from '../../share/utility/IdGenerator';
import { isAdmin } from '../../share/utility/RoleValidator';
import EUserLoginMethod from '../../share/enum/EUserLoginMethod';
import RequestValidator, { ProtectedFieldValidator } from '../../share/utility/RequestValidator';

/**
 * @api {POST} /user/create?method={email|web3} Create User
 * @apiGroup User
 * 
 * @apiDescription Create new user ether by email or web3 wallet, !!web3 create
 * function not implement!!
 * 
 * @apiPermission none
 * 
 * @apiHeader {string} [Authorization] address and nonce signed by wallet, only
 * required when create with web3
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} email user email
 * @apiParam {string} name user name
 * @apiParam {string} [password] password, only required when create with email
 * 
 * @apiSuccess {string} userId id of user
 * @apiError 400 request validate fail
 * @apiError 409 email duplicate
 * @apiError 501 web3 create
 */
class UserCreate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            query: ['method'],
            require: ['email', 'name'],
            option: ['password', 'role']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        if (isAdmin(req.loaded.auth)) return true;
        return ProtectedFieldValidator(['role'], req);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const method = req.query.method as string;
        switch (method) {
            case 'email':
                return await this.createWithEmail(req, res);
            case 'web3':
                return res.sendStatus(501);
            default:
                return res.sendStatus(400);
        }
    }

    private async createWithEmail(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        if (req.body.password === undefined) return res.sendStatus(400);
        const id = injector.get<IdGenerator>('IdGenerator').nanoidReadable16();
        const createRes = await CreateUser({
            id: id,
            name: req.body.name,
            email: req.body.email,
            password: createHash('SHA256').update(req.body.password).digest('base64'),
            loginMethods: EUserLoginMethod.Email,
            role: req.body.role ?? EUserRole.Customer,
            flag: 0,
            status: EUserStatus.Active,
            createBy: req.loaded.auth?.id ?? id
        });
        if (!createRes.ok) {
            return res.sendStatus(createRes.status);
        }
        return res.status(200).send(id);
    }
}

export default UserCreate;
