import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import RequestValidator from '../../share/utility/RequestValidator';
import { UpdateCollection } from '../../database/CollectionDatabase';

/**
 * @api {POST} /collection/update?collectionId={id} Update Collection
 * @apiGroup Collection
 * 
 * @apiDescription Update collection
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} collectionId id of collection
 * @apiParam {string} [title] collection title
 * @apiParam {number} [type] collection type
 * @apiParam {string} [previewImageUrl] collection preview
 * @apiParam {string} [unlockedImageUrl] unlocked collection cover
 * @apiParam {string} [mediaUrl] media url
 * @apiParam {number} [status] collection status
 * @apiParam {json} [data] collection other data
 * @apiParam {number} [available] available collection
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 * @apiError 404 collection not found
 */
class CollectionUpdate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            query: ['collectionId'],
            option: ['title', 'type', 'previewImageUrl', 'unlockedImageUrl', 'mediaUrl', 'data', 'status', 'available']
        }, req)
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const collectionId = req.query.collectionId as string;
        const updateRes = await UpdateCollection(collectionId, {
            ...req.body,
            updateBy: req.loaded.auth.id
        });
        if (!updateRes.ok) return res.sendStatus(updateRes.status);
        return res.sendStatus(204);
    }
}

export default CollectionUpdate;