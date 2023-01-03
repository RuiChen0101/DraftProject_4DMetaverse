import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';
import AnonymousAuthMiddleware from '../share/middlewares/AnonymousAuthMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();
const anonymousAuthMiddleware: AnonymousAuthMiddleware = new AnonymousAuthMiddleware();

import AuthLogin from '../functions/auth/AuthLogin';
import AuthLogout from '../functions/auth/AuthLogout';
import AuthRefresh from '../functions/auth/AuthRefresh';
import AuthVerify2FA from '../functions/auth/AuthVerify2FA';

const authRouter = new FunctionRouter();

authRouter
    .before(resolveTokenMiddleware)

authRouter
    .path('/login')
    .before(anonymousAuthMiddleware)
    .get(new AuthLogin());

authRouter
    .path('/2fa_verify')
    .get(new AuthVerify2FA());

authRouter
    .path('/logout')
    .get(new AuthLogout());

authRouter
    .path('/refresh')
    .get(new AuthRefresh());

export default new FunctionProxy().useRouter(authRouter);