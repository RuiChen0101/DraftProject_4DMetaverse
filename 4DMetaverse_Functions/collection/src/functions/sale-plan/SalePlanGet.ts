import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { GetSalePlan } from '../../database/SalePlanDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {PUT} /saleplan/get?planId={id} Get Sale Plan
 * @apiGroup SalePlan
 * 
 * @apiDescription Get sale plan
 * 
 * @apiPermission None
 * 
 * @apiHeader {string} [Authorization]
 * 
 * @apiParam {number} planId id of plan
 * 
 * @apiSuccess {json} salePlan
 * @apiError 400 request validate fail
 * @apiError 404 sale plan not found
 */
class SalePlanGet implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['planId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return true;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const planId = req.query.planId as string;
        const getRes = await GetSalePlan(planId);
        if (!getRes.ok) return res.sendStatus(getRes.status);
        return res.status(200).json(await getRes.json());
    }
}

export default SalePlanGet;
