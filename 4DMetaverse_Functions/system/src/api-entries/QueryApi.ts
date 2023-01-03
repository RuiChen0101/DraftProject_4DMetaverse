import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';
import AnonymousAuthMiddleware from '../share/middlewares/AnonymousAuthMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();
const anonymousAuthMiddleware: AnonymousAuthMiddleware = new AnonymousAuthMiddleware();

import Query from '../functions/query/Query';
import QuerySum from '../functions/query/QuerySum';
import QueryCount from '../functions/query/QueryCount';

const queryRouter = new FunctionRouter();

queryRouter
    .before(resolveTokenMiddleware);

queryRouter
    .path('/')
    .before(anonymousAuthMiddleware)
    .post(new Query());

queryRouter
    .path('/count')
    .before(anonymousAuthMiddleware)
    .post(new QueryCount());

queryRouter
    .path('/sum')
    .before(anonymousAuthMiddleware)
    .post(new QuerySum());

export default new FunctionProxy().useRouter(queryRouter);