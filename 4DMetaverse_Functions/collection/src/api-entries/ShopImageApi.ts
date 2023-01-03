import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();

import ShopImageCreate from '../functions/shop-image/ShopImageCreate';
import ShopImageDelete from '../functions/shop-image/ShopImageDelete';
import ShopImageSwitchCover from '../functions/shop-image/ShopImageSwitchCover';

const shopImageRouter = new FunctionRouter();

shopImageRouter
    .before(resolveTokenMiddleware)

shopImageRouter
    .path('/create')
    .post(new ShopImageCreate());

shopImageRouter
    .path('/switch-cover')
    .put(new ShopImageSwitchCover());

shopImageRouter
    .path('/delete')
    .delete(new ShopImageDelete());

export default new FunctionProxy().useRouter(shopImageRouter);