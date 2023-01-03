import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();

import ShopGroupCreate from '../functions/shop-group/ShopGroupCreate';
import ShopGroupUpdate from '../functions/shop-group/ShopGroupUpdate';
import ShopGroupDelete from '../functions/shop-group/ShopGroupDelete';

const shopGroupRouter = new FunctionRouter();

shopGroupRouter
    .before(resolveTokenMiddleware)

shopGroupRouter
    .path('/create')
    .post(new ShopGroupCreate());

shopGroupRouter
    .path('/update')
    .put(new ShopGroupUpdate());

shopGroupRouter
    .path('/delete')
    .delete(new ShopGroupDelete());

export default new FunctionProxy().useRouter(shopGroupRouter);