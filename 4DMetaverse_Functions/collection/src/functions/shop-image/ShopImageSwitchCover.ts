import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { SwitchCoverShopImage } from '../../database/ShopImageDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {PUT} /shopimage/switch-cover?imageId={id} Switch Shop Cover Image
 * @apiGroup ShopImage
 * 
 * @apiDescription Switching cover image
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * 
 * @apiParam {number} imageId id of shop image
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 shop image not found
 */
class ShopImageSwitchCover implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['imageId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const imageId = parseInt(req.query.imageId as string);
        const updateRes = await SwitchCoverShopImage(imageId);
        if (!updateRes.ok) return res.sendStatus(updateRes.status);
        return res.sendStatus(204);
    }
}

export default ShopImageSwitchCover;
