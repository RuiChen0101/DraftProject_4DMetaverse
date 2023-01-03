import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();

import DirectoryList from '../functions/directory/DirectoryList';
import DirectoryDelete from '../functions/directory/DirectoryDelete';
import DirectoryEnsurePath from '../functions/directory/DirectoryEnsurePath';
import DirectoryListByPath from '../functions/directory/DirectoryListByPath';
import DirectoryUpdateLocking from '../functions/directory/DirectoryUpdateLocking';

const directoryRouter = new FunctionRouter();

directoryRouter
    .before(resolveTokenMiddleware);

directoryRouter
    .path('/ensure-path')
    .post(new DirectoryEnsurePath());

directoryRouter
    .path('/update/locking')
    .post(new DirectoryUpdateLocking());

directoryRouter
    .path('/delete')
    .delete(new DirectoryDelete());

directoryRouter
    .path('/list')
    .get(new DirectoryList());

directoryRouter
    .path('/list/by-path')
    .get(new DirectoryListByPath());

export default new FunctionProxy().useRouter(directoryRouter);