import * as express from 'express';

import ISalePlan from '../../share/entities/ISalePlan';
import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import RequestValidator from '../../share/utility/RequestValidator';
import { CreateSalePlan, SwitchDefaultSalePlan } from '../../database/SalePlanDatabase';

/**
 * @api {POST} /saleplan/create Create Sale Plan
 * @apiGroup SalePlan
 * 
 * @apiDescription Create new sale plan
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} shopId id of shop
 * @apiParam {string} name sale plan name
 * @apiParam {number} price sale price
 * @apiParam {boolean} [isDefault] is default sale plan
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 */
class SalePlanCreate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            require: ['shopId', 'name', 'price'],
            option: ['isDefault']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const isDefault: boolean = req.body.isDefault ?? false;
        const createRes = await CreateSalePlan({
            ...req.body,
            isDefault: false,
            createBy: req.loaded.auth.id
        });
        if (!createRes.ok) return res.sendStatus(createRes.status);

        const salePlan: ISalePlan = await createRes.json() as ISalePlan;
        if (isDefault) await SwitchDefaultSalePlan(salePlan.id!);
        return res.status(200).send(salePlan.id);
    }
}

export default SalePlanCreate;
