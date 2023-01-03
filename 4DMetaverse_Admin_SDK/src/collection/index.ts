import { getApp } from '../app';

import { Shop } from './shop';
import { SalePlan } from './sale-plan';
import { ShopGroup } from './shop-group';
import { Collection } from './collection';

export const getShopGroup = (): ShopGroup => {
    const app = getApp();
    return app.getOrInitialize('series', (app) => new ShopGroup(app));
}

export const getShop = (): Shop => {
    const app = getApp();
    return app.getOrInitialize('shop', (app) => new Shop(app));
}

export const getSalePlan = (): SalePlan => {
    const app = getApp();
    return app.getOrInitialize('sale-plan', (app) => new SalePlan(app));
}

export const getCollection = (): Collection => {
    const app = getApp();
    return app.getOrInitialize('collection', (app) => new Collection(app));
}

export {
    ICollection, IPreviewCollection, ISalePlan, IShopGroup, IShop
} from './entities';

export { ShopGroupCreateDto, ShopGroupUpdateDto } from './shop-group';
export { SalePlanCreateDto, SalePlanUpdateDto } from './sale-plan';
export {
    ShopCreateDto, ShopQuickCreateDto, ShopImageCreateDto, ShopUpdateDto
} from './shop';
export {
    CollectionCreateDto,
    CollectionPoolCreateDto,
    CollectionUpdateDto,
    CollectionPoolUpdateDto
} from './collection';

export { ShopGroup, Shop, SalePlan, Collection };