import * as express from 'express';

import IShop from '../../share/entities/IShop';
import IFunction from '../../share/functions/IFunction';
import { CreateShop } from '../../database/ShopDatabase';
import { isAdmin } from '../../share/utility/RoleValidator';
import RequestValidator from '../../share/utility/RequestValidator';

/**
 * @api {POST} /shop/create Create Shop
 * @apiGroup Shop
 * 
 * @apiDescription Create new shop
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} groupId id of shop
 * @apiParam {string} title title of shop
 * @apiParam {string} [description] shop description
 * 
 * @apiSuccess {string} shopId id of shop
 * @apiError 400 request validate fail
 */
class ShopCreate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            require: ['groupId', 'title'],
            option: ['description']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const createRes = await CreateShop({
            ...req.body,
            createBy: req.loaded.auth.id
        });
        if (!createRes.ok) return res.sendStatus(createRes.status);
        const shop: IShop = await createRes.json() as IShop;
        return res.status(200).send(shop.id);
    }
}

export default ShopCreate;
