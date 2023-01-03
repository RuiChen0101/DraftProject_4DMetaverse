import FunctionProxy from '../share/functions/FunctionProxy';
import FunctionRouter from '../share/functions/FunctionRouter';

import ResolveTokenMiddleware from '../share/middlewares/ResolveTokenMiddleware';

const resolveTokenMiddleware: ResolveTokenMiddleware = new ResolveTokenMiddleware();

import FileDelete from '../functions/file/FileDelete';
import FileMetadataGet from '../functions/file/FileMetadataGet';

const fileRouter = new FunctionRouter();

fileRouter
    .before(resolveTokenMiddleware);

fileRouter
    .path('/delete')
    .delete(new FileDelete());

fileRouter
    .path('/metadata')
    .get(new FileMetadataGet());

export default new FunctionProxy().useRouter(fileRouter);