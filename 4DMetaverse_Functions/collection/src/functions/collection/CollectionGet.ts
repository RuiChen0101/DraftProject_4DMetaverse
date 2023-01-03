import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { GetCollection } from '../../database/CollectionDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';
import { isAdmin } from '../../share/utility/RoleValidator';

/**
 * @api {DELETE} /collection/get?collectionId={id} Get Collection
 * @apiGroup Collection
 * 
 * @apiDescription Get collection
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * 
 * @apiParam {string} collectionId id of collection
 * 
 * @apiSuccess {json} collection
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 * @apiError 404 collection not found
 */
class CollectionGet implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['collectionId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const collectionId = req.query.collectionId as string;
        const getRes = await GetCollection(collectionId);
        if (!getRes.ok) return res.sendStatus(getRes.status);
        return res.status(200).json(await getRes.json());
    }
}

export default CollectionGet;
