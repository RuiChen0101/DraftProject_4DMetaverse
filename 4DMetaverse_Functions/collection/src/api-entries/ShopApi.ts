import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';
import AnonymousAuthMiddleware from '../share/middlewares/AnonymousAuthMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();
const anonymousAuthMiddleware: AnonymousAuthMiddleware = new AnonymousAuthMiddleware();

import ShopGet from '../functions/shop/ShopGet';
import ShopCreate from '../functions/shop/ShopCreate';
import ShopDelete from '../functions/shop/ShopDelete';
import ShopUpdate from '../functions/shop/ShopUpdate';
import ShopQuickCreate from '../functions/shop/ShopQuickCreate';

const shopRouter = new FunctionRouter();

shopRouter
    .before(resolveTokenMiddleware)

shopRouter
    .path('/create')
    .post(new ShopCreate());

shopRouter
    .path('/quick-create')
    .post(new ShopQuickCreate());

shopRouter
    .path('/update')
    .put(new ShopUpdate());

shopRouter
    .path('/delete')
    .delete(new ShopDelete());

shopRouter
    .path('/get')
    .before(anonymousAuthMiddleware)
    .get(new ShopGet());

export default new FunctionProxy().useRouter(shopRouter);