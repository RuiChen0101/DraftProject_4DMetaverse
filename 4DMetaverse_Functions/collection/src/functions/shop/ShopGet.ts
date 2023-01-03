import * as express from 'express';

import { GetShop } from '../../database/ShopDatabase';
import IFunction from '../../share/functions/IFunction';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {DELETE} /shop/get?shopId={id} Get Shop
 * @apiGroup Shop
 * 
 * @apiDescription Get shop
 * 
 * @apiPermission None
 * 
 * @apiHeader {string} [Authorization]
 * 
 * @apiParam {string} shopId id of shop
 * 
 * @apiSuccess {json} shop
 * @apiError 400 request validate fail
 * @apiError 404 shop not found
 */
class ShopGet implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['shopId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return true;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const shopId = req.query.shopId as string;
        const getRes = await GetShop(shopId);
        if (!getRes.ok) return res.sendStatus(getRes.status);
        return res.status(200).json(await getRes.json());
    }
}

export default ShopGet;
