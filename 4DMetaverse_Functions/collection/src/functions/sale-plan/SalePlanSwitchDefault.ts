import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { SwitchDefaultSalePlan } from '../../database/SalePlanDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {DELETE} /saleplan/switch-default?planId={id} Switch Shop Default Sale Plan
 * @apiGroup SalePlan
 * 
 * @apiDescription Switching default sale plan
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * 
 * @apiParam {string} planId id of sale plan
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 sale plan not found
 */
class SalePlanSwitchDefault implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['planId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const planId = req.query.planId as string;
        const updateRes = await SwitchDefaultSalePlan(planId);
        if (!updateRes.ok) return res.sendStatus(updateRes.status);
        return res.sendStatus(204);
    }
}

export default SalePlanSwitchDefault;
