import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';
import AnonymousAuthMiddleware from '../share/middlewares/AnonymousAuthMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();
const anonymousAuthMiddleware: AnonymousAuthMiddleware = new AnonymousAuthMiddleware();

import CollectionGet from '../functions/collection/CollectionGet';
import CollectionCreate from '../functions/collection/CollectionCreate';
import CollectionDelete from '../functions/collection/CollectionDelete';
import CollectionUpdate from '../functions/collection/CollectionUpdate';

const collectionRouter = new FunctionRouter();

collectionRouter
    .before(resolveTokenMiddleware)

collectionRouter
    .path('/create')
    .post(new CollectionCreate());

collectionRouter
    .path('/update')
    .put(new CollectionUpdate());

collectionRouter
    .path('/delete')
    .delete(new CollectionDelete());

collectionRouter
    .path('/get')
    .before(anonymousAuthMiddleware)
    .get(new CollectionGet());

export default new FunctionProxy().useRouter(collectionRouter);