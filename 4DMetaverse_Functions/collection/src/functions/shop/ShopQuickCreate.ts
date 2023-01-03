import * as express from 'express';

import IShop from '../../share/entities/IShop';
import injector from '../../share/utility/Injector';
import ISalePlan from '../../share/entities/ISalePlan';
import IFunction from '../../share/functions/IFunction';
import { CreateShop } from '../../database/ShopDatabase';
import IShopImage from '../../share/entities/IShopImage';
import IdGenerator from '../../share/utility/IdGenerator';
import ICollection from '../../share/entities/ICollection';
import { isAdmin } from '../../share/utility/RoleValidator';
import { CreateShopImage } from '../../database/ShopImageDatabase';
import RequestValidator from '../../share/utility/RequestValidator';
import { CreateCollection } from '../../database/CollectionDatabase';
import { CreateSalePlan, SetCollectionSalePlan } from '../../database/SalePlanDatabase';

/**
 * @api {POST} /shop/quick-create Quick Create Shop 
 * @apiGroup Shop
 * 
 * @apiDescription Creating shop with shop image, collection and sale plan
 * 
 * @apiPermission Admin only
 * 
 * @apiHeader {string} Authorization
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} seriesId id of shop series
 * @apiParam {string} collectionPoolId id of collection pool
 * @apiParam {string} shopTitle shop title
 * @apiParam {string} shopCoverImage shop cover
 * @apiParam {string} collectionTitle collection title
 * @apiParam {number} collectionType collection type
 * @apiParam {string} previewImageUrl collection preview image
 * @apiParam {string} unlockedImageUrl unlocked collection cover image
 * @apiParam {string} mediaUrl collection media
 * @apiParam {string} salePlanName sale plan name
 * @apiParam {number} salePrice sale price
 * @apiParam {string} [shopDescription] shop description
 * @apiParam {number} [collectionAvailable] available collection quantity
 * 
 * @apiSuccess {string} shopId id of shop
 * @apiError 400 request validate fail
 */
class ShopQuickCreate implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            require: ['seriesId', 'collectionPoolId', 'shopTitle', 'shopCoverImage', 'collectionTitle', 'collectionType', 'previewImageUrl', 'unlockedImageUrl', 'mediaUrl', 'salePlanName', 'salePrice'],
            option: ['shopDescription', 'collectionAvailable']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const shopId: string = injector.get<IdGenerator>('IdGenerator').uuidv4();
        const salePlanId: string = injector.get<IdGenerator>('IdGenerator').uuidv4();
        const collectionId: string = injector.get<IdGenerator>('IdGenerator').uuidv4();
        const shop: IShop = {
            id: shopId,
            seriesId: req.body.seriesId,
            title: req.body.shopTitle,
            description: req.body.shopDescription,
            createBy: req.loaded.auth.id
        }
        const shopImage: IShopImage = {
            shopId: shopId,
            imageUrl: req.body.shopCoverImage,
            isCover: true,
            createBy: req.loaded.auth.id
        }
        const collection: ICollection = {
            id: collectionId,
            collectionPoolId: req.body.collectionPoolId,
            title: req.body.collectionTitle,
            type: req.body.collectionType,
            previewImageUrl: req.body.previewImageUrl,
            unlockedImageUrl: req.body.unlockedImageUrl,
            mediaUrl: req.body.mediaUrl,
            available: req.body.collectionAvailable,
            createBy: req.loaded.auth.id
        }
        const salePlan: ISalePlan = {
            id: salePlanId,
            shopId: shopId,
            name: req.body.salePlanName,
            price: req.body.salePrice,
            isDefault: true,
            createBy: req.loaded.auth.id
        }

        const createShopRes = await CreateShop(shop);
        if (!createShopRes.ok) return res.status(createShopRes.status).send('shop create fail');

        const [createImageRes, createColRes, createPlanRes] = await Promise.all([
            CreateShopImage(shopImage),
            CreateCollection(collection),
            CreateSalePlan(salePlan)
        ]);
        if (!createImageRes.ok) return res.status(createImageRes.status).send('shop image create fail');
        if (!createColRes.ok) return res.status(createColRes.status).send('collection create fail');
        if (!createPlanRes.ok) return res.status(createPlanRes.status).send('sale plan create fail');

        await SetCollectionSalePlan(salePlanId, [collectionId]);
        return res.status(200).send(shopId);
    }
}

export default ShopQuickCreate;
