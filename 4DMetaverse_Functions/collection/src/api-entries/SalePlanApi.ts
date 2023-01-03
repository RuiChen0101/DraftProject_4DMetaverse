import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';
import AnonymousAuthMiddleware from '../share/middlewares/AnonymousAuthMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();
const anonymousAuthMiddleware: AnonymousAuthMiddleware = new AnonymousAuthMiddleware();

import SalePlanGet from '../functions/sale-plan/SalePlanGet';
import SalePlanCreate from '../functions/sale-plan/SalePlanCreate';
import SalePlanDelete from '../functions/sale-plan/SalePlanDelete';
import SalePlanUpdate from '../functions/sale-plan/SalePlanUpdate';
import SalePlanSetCollections from '../functions/sale-plan/SalePlanSetCollections';
import SalePlanSwitchDefault from '../functions/sale-plan/SalePlanSwitchDefault';

const salePlanRouter = new FunctionRouter();

salePlanRouter
    .before(resolveTokenMiddleware)

salePlanRouter
    .path('/create')
    .post(new SalePlanCreate());

salePlanRouter
    .path('/update')
    .put(new SalePlanUpdate());

salePlanRouter
    .path('/switch-default')
    .put(new SalePlanSwitchDefault());

salePlanRouter
    .path('/set-collections')
    .put(new SalePlanSetCollections());

salePlanRouter
    .path('/delete')
    .delete(new SalePlanDelete());

salePlanRouter
    .path('/get')
    .before(anonymousAuthMiddleware)
    .get(new SalePlanGet());

export default new FunctionProxy().useRouter(salePlanRouter);