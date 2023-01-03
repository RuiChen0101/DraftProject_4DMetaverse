import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import ICollectionPool from '../../share/entities/ICollectionPool';
import RequestValidator from '../../share/utility/RequestValidator';
import { CreateCollectionPool } from '../../database/CollectionPoolDatabase';

/**
 * @api {POST} /collection-pool/create Create CollectionPool
 * @apiGroup CollectionPool
 * 
 * @apiDescription Create new collectionPool
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} name pool name
 * @apiParam {string} [coverImageUrl] pool cover image
 * 
 * @apiSuccess {number} poolId id of collection pool
 * @apiError 400 request validate fail
 */
class CollectionPoolCreate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            require: ['name'],
            option: ['coverImageUrl']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const createRes = await CreateCollectionPool({
            ...req.body,
            createBy: req.loaded.auth.id
        });
        if (!createRes.ok) return res.sendStatus(createRes.status);
        const pool: ICollectionPool = await createRes.json() as ICollectionPool;
        return res.status(200).send(pool.id);
    }
}

export default CollectionPoolCreate;
