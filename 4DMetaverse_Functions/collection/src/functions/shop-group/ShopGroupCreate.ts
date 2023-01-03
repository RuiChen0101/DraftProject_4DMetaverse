import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import IShopGroup from '../../share/entities/IShopGroup';
import { isAdmin } from '../../share/utility/RoleValidator';
import { CreateShopGroup } from '../../database/ShopGroupDatabase';
import RequestValidator from '../../share/utility/RequestValidator';

/**
 * @api {POST} /shopgroup/create Create ShopGroup
 * @apiGroup ShopGroup
 * 
 * @apiDescription Create new series
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} title series title
 * @apiParam {string[]} [tags] series tag
 * @apiParam {string} [coverImageUrl] series cover image
 * 
 * @apiSuccess {string} seriesId id of series
 * @apiError 400 request validate fail
 */
class ShopGroupCreate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            require: ['title'],
            option: ['tags', 'coverImageUrl']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const createRes = await CreateShopGroup({
            ...req.body,
            createBy: req.loaded.auth.id
        });
        if (!createRes.ok) {
            return res.sendStatus(createRes.status)
        }
        const series: IShopGroup = await createRes.json() as IShopGroup;
        return res.status(200).send(series.id);
    }
}

export default ShopGroupCreate;
