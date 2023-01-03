import * as express from 'express';

import ISalePlan from '../../share/entities/ISalePlan';
import IFunction from '../../share/functions/IFunction';
import { GetSalePlan } from '../../database/SalePlanDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';
import { CreatePurchaseRecord } from '../../database/PurchaseRecordDatabase';
import { CreateUnlockedCollection } from '../../database/UnlockedCollectionDatabase';

/**
 * @api {PUT} /saleplan/purchase?planId={id} Purchase Sale Plan
 * @apiGroup SalePlan
 *
 * @apiDescription Purchase collection, not permanent API, will replace with
 * real payment entry in the future
 *
 * @apiPermission Login user
 *
 * @apiHeader {string} Authorization
 *
 * @apiParam {number} planId id of plan
 *
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 404 sale plan not found
 */
class SalePlanPurchase implements IFunction {
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
        const salePlan = await getRes.json() as ISalePlan;
        await CreatePurchaseRecord({
            userId: req.loaded.auth.id,
            salePlanId: planId
        });
        const unlockingPromises: Promise<any>[] = [];
        for (const preview of (salePlan.previewCollection ?? [])) {
            unlockingPromises.push(CreateUnlockedCollection({
                collectionId: preview.id!,
                userId: req.loaded.auth.id,
                createBy: req.loaded.auth.id
            }));
        }
        await Promise.all(unlockingPromises)
        return res.sendStatus(204);
    }
}

export default SalePlanPurchase;
