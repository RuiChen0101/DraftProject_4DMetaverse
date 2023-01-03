import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import AnonymousAuthMiddleware from '../share/middlewares/AnonymousAuthMiddleware';

const anonymousAuthMiddleware: AnonymousAuthMiddleware = new AnonymousAuthMiddleware();

import SystemStatus from '../functions/system/SystemStatus';

const systemRouter = new FunctionRouter();

systemRouter
    .path('/status')
    .before(anonymousAuthMiddleware)
    .get(new SystemStatus());

export default new FunctionProxy().useRouter(systemRouter);