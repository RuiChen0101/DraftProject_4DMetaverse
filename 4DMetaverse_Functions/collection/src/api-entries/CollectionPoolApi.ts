import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();

import CollectionPoolCreate from '../functions/collection-pool/CollectionPoolCreate';
import CollectionPoolDelete from '../functions/collection-pool/CollectionPoolDelete';
import CollectionPoolUpdate from '../functions/collection-pool/CollectionPoolUpdate';

const poolRouter = new FunctionRouter();

poolRouter
    .before(resolveTokenMiddleware)

poolRouter
    .path('/create')
    .post(new CollectionPoolCreate());

poolRouter
    .path('/update')
    .put(new CollectionPoolUpdate());

poolRouter
    .path('/delete')
    .delete(new CollectionPoolDelete());

export default new FunctionProxy().useRouter(poolRouter);