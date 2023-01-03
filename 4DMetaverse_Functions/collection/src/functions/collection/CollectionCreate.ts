import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import ICollection from '../../share/entities/ICollection';
import { isAdmin } from '../../share/utility/RoleValidator';
import RequestValidator from '../../share/utility/RequestValidator';
import { CreateCollection } from '../../database/CollectionDatabase';

/**
 * @api {POST} /collection/create Create Collection
 * @apiGroup Collection
 * 
 * @apiDescription Create new collection
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {number} collectionPoolId id of collection pool
 * @apiParam {string} title collection title
 * @apiParam {number} type collection type
 * @apiParam {string} previewImageUrl collection preview
 * @apiParam {string} unlockedImageUrl unlocked collection cover
 * @apiParam {string} mediaUrl media url
 * @apiParam {json} [data] collection other data
 * @apiParam {number} [available] available collection
 * 
 * @apiSuccess {string} collectionId id of collection pool
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 */
class CollectionCreate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            require: ['collectionPoolId', 'title', 'type', 'previewImageUrl', 'unlockedImageUrl', 'mediaUrl'],
            option: ['data', 'available']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const createRes = await CreateCollection({
            ...req.body,
            createBy: req.loaded.auth.id
        });
        if (!createRes.ok) return res.sendStatus(createRes.status);
        const collection: ICollection = await createRes.json() as ICollection;
        return res.status(200).send(collection.id);
    }
}

export default CollectionCreate;