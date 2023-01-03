import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { DeleteShopGroup } from '../../database/ShopGroupDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {DELETE} /shopgroup/delete?groupId={id} Delete ShopGroup
 * @apiGroup ShopGroup
 * 
 * @apiDescription Delete a group
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * 
 * @apiParam {string} groupId id of group
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 group not found
 */
class ShopGroupDelete implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['groupId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const groupId = req.query.groupId as string;
        const deleteRes = await DeleteShopGroup(groupId);
        if (!deleteRes.ok) return res.sendStatus(deleteRes.status);
        return res.sendStatus(204);
    }
}

export default ShopGroupDelete;
