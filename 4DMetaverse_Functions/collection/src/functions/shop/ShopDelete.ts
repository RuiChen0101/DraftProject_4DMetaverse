import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { DeleteShop } from '../../database/ShopDatabase';
import { isAdmin } from '../../share/utility/RoleValidator';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {DELETE} /shop/delete?shopId={id} Delete Shop
 * @apiGroup Shop
 * 
 * @apiDescription Delete shop
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * 
 * @apiParam {string} shopId id of shop
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 shop not found
 */
class ShopDelete implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['shopId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const shopId = req.query.shopId as string;
        const deleteRes = await DeleteShop(shopId);
        if (!deleteRes.ok) return res.sendStatus(deleteRes.status);
        return res.sendStatus(204);
    }
}

export default ShopDelete;
