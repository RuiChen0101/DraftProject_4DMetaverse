import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import IShopImage from '../../share/entities/IShopImage';
import { isAdmin } from '../../share/utility/RoleValidator';
import { CreateShopImage, SwitchCoverShopImage } from '../../database/ShopImageDatabase';
import RequestValidator from '../../share/utility/RequestValidator';

/**
 * @api {POST} /shopimage/create Create Shop Image
 * @apiGroup ShopImage
 * 
 * @apiDescription Create new shop image
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} shopId id of shop
 * @apiParam {string} imageUrl shop image url
 * @apiParam {boolean} [isCover] set to cover image
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 */
class ShopImageCreate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            require: ['shopId', 'imageUrl'],
            option: ['isCover']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const isCover: boolean = req.body.isCover ?? false;
        const createRes = await CreateShopImage({
            ...req.body,
            isCover: false,
            createBy: req.loaded.auth.id
        });
        if (!createRes.ok) return res.sendStatus(createRes.status);

        const shopImage: IShopImage = await createRes.json() as IShopImage;
        if (isCover) await SwitchCoverShopImage(shopImage.id!);
        return res.sendStatus(204);
    }
}

export default ShopImageCreate;
