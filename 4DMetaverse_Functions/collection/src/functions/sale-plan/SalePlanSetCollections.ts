import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import RequestValidator from '../../share/utility/RequestValidator';
import { SetCollectionSalePlan } from '../../database/SalePlanDatabase';

/**
 * @api {PUT} /saleplan/set-collections?planId={id} Set Sale Plan Relate Collections
 * @apiGroup SalePlan
 * 
 * @apiDescription Setting collections in sale plan
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {number} planId id of plan
 * @apiParam {string[]} collectionIds id of collections
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 sale plan not found
 */
class SalePlanSetCollections implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            query: ['planId'],
            require: ['collectionIds']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const planId = req.query.planId as string;
        const updateRes = await SetCollectionSalePlan(planId, req.body.collectionIds);
        if (!updateRes.ok) return res.sendStatus(updateRes.status);
        return res.sendStatus(204);
    }
}

export default SalePlanSetCollections;
