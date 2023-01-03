import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import RequestValidator from '../../share/utility/RequestValidator';
import { UpdateCollectionPool } from '../../database/CollectionPoolDatabase';

/**
 * @api {PUT} /collection-pool/update?poolId={id} Update CollectionPool
 * @apiGroup CollectionPool
 * 
 * @apiDescription Update collectionPool
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {number} poolId id of pool
 * @apiParam {string} [name] pool name
 * @apiParam {string} [coverImageUrl] pool cover image
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 collection pool not found
 */
class CollectionPoolUpdate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            query: ['poolId'],
            option: ['name', 'coverImageUrl']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const poolId = parseInt(req.query.poolId as string)
        const updateRes = await UpdateCollectionPool(poolId, {
            ...req.body,
            updateBy: req.loaded.auth.id
        });
        if (!updateRes.ok) return res.sendStatus(updateRes.status);
        return res.sendStatus(204);
    }
}

export default CollectionPoolUpdate;
