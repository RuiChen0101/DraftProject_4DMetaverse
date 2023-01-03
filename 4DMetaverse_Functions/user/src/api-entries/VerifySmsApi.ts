import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();

import VerifySmsSend from '../functions/verify-sms/VerifySmsSend';

const verifySmsRouter = new FunctionRouter();

verifySmsRouter
    .path('/send')
    .before(resolveTokenMiddleware)
    .post(new VerifySmsSend());

export default new FunctionProxy().useRouter(verifySmsRouter);