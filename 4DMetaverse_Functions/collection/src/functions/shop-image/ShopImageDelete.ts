import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { DeleteShopImage } from '../../database/ShopImageDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {DELETE} /shopimage/delete?imageId={id} Delete Shop Image
 * @apiGroup ShopImage
 * 
 * @apiDescription Delete shop image
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
class ShopImageDelete implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['imageId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const imageId = parseInt(req.query.imageId as string);
        const deleteRes = await DeleteShopImage(imageId);
        if (!deleteRes.ok) {
            return res.sendStatus(deleteRes.status)
        }
        return res.sendStatus(204);
    }
}

export default ShopImageDelete;
