import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';
import AnonymousAuthMiddleware from '../share/middlewares/AnonymousAuthMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();
const anonymousAuthMiddleware: AnonymousAuthMiddleware = new AnonymousAuthMiddleware();

import UserGet from '../functions/user/UserGet';
import UserCreate from '../functions/user/UserCreate';
import UserUpdate from '../functions/user/UserUpdate';
import UserEnable2FA from '../functions/user/UserEnable2FA';
import UserCheckEmail from '../functions/user/UserCheckEmail';

const userRouter = new FunctionRouter();

userRouter
    .before(resolveTokenMiddleware)

userRouter
    .path('/create')
    .before(anonymousAuthMiddleware)
    .post(new UserCreate());

userRouter
    .path('/get')
    .get(new UserGet());

userRouter
    .path('/check/email')
    .before(anonymousAuthMiddleware)
    .get(new UserCheckEmail());

userRouter
    .path('/2fa_enable')
    .put(new UserEnable2FA());

userRouter
    .path('/update')
    .put(new UserUpdate());

export default new FunctionProxy().useRouter(userRouter);