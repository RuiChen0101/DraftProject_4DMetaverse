import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';
import { DeleteCollectionPool } from '../../database/CollectionPoolDatabase';

/**
 * @api {DELETE} /collection-pool/delete?poolId={id} Delete Collection Pool
 * @apiGroup CollectionPool
 * 
 * @apiDescription Delete a pool
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * 
 * @apiParam {string} poolId id of pool
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 collection pool not found
 */
class CollectionPoolUpdate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['poolId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const poolId = parseInt(req.query.poolId as string);
        const deleteRes = await DeleteCollectionPool(poolId);
        if (!deleteRes.ok) return res.sendStatus(deleteRes.status);
        return res.sendStatus(204);
    }
}

export default CollectionPoolUpdate;
