import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { UpdateShopGroup } from '../../database/ShopGroupDatabase';
import RequestValidator from '../../share/utility/RequestValidator';

/**
 * @api {PUT} /series/update?groupId={id} Update ShopGroup
 * @apiGroup ShopGroup
 * 
 * @apiDescription Update series
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} groupId id of series
 * @apiParam {string} [title] series title
 * @apiParam {string[]} [tags] series tag
 * @apiParam {string} [coverImageUrl] series cover image
 * @apiParam {number} [status] series status
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 series not found
 */
class ShopGroupUpdate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            query: ['groupId'],
            option: ['title', 'tags', 'coverImageUrl', 'status']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const groupId = req.query.groupId as string;
        const updateRes = await UpdateShopGroup(groupId, {
            ...req.body,
            updateBy: req.loaded.auth.id
        });
        if (!updateRes.ok) {
            return res.sendStatus(updateRes.status)
        }
        return res.sendStatus(204);
    }
}

export default ShopGroupUpdate;
