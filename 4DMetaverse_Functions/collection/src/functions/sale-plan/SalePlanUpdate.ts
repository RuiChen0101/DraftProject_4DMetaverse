import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { UpdateSalePlan } from '../../database/SalePlanDatabase';
import RequestValidator from '../../share/utility/RequestValidator';

/**
 * @api {PUT} /saleplan/update?planId={id} Update Sale Plan
 * @apiGroup SalePlan
 * 
 * @apiDescription Update sale plan
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {number} planId id of plan
 * @apiParam {string} [name] plan name
 * @apiParam {number} [price] sale price
 * @apiParam {number} [status] sale plan status
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 sale plan not found
 */
class SalePlanUpdate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            query: ['planId'],
            option: ['name', 'price', 'status']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const planId = req.query.planId as string;
        const updateRes = await UpdateSalePlan(planId, {
            ...req.body,
            updateBy: req.loaded.auth.id
        });
        if (!updateRes.ok) return res.sendStatus(updateRes.status);
        return res.sendStatus(204);
    }
}

export default SalePlanUpdate;
