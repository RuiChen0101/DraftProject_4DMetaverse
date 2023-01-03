import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { UpdateShop } from '../../database/ShopDatabase';
import { isAdmin } from '../../share/utility/RoleValidator';
import RequestValidator from '../../share/utility/RequestValidator';

/**
 * @api {PUT} /shop/update?shopId={id} Update Shop
 * @apiGroup Shop
 * 
 * @apiDescription Update shop
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} shopId id of shop
 * @apiParam {string} [title] shop title
 * @apiParam {string} [description] shop description
 * @apiParam {number} [status] shop status
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 shop not found
 */
class ShopUpdate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            query: ['shopId'],
            option: ['title', 'description', 'status']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const shopId = req.query.shopId as string;
        const updateRes = await UpdateShop(shopId, {
            ...req.body,
            updateBy: req.loaded.auth.id
        });
        if (!updateRes.ok) return res.sendStatus(updateRes.status);
        return res.sendStatus(204);
    }
}

export default ShopUpdate;
