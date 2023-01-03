import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { DeleteCollection } from '../../database/CollectionDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {DELETE} /collection/delete?collectionId={id} Delete Collection
 * @apiGroup Collection
 * 
 * @apiDescription Delete a collection
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * 
 * @apiParam {string} collectionId id of collection
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 * @apiError 404 collection not found
 */
class CollectionDelete implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['collectionId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const collectionId = req.query.collectionId as string;
        const deleteRes = await DeleteCollection(collectionId);
        if (!deleteRes.ok) return res.sendStatus(deleteRes.status);
        return res.sendStatus(204);
    }
}

export default CollectionDelete;
