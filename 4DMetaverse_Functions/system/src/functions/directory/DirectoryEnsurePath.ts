import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import RequestValidator from '../../share/utility/RequestValidator';
import { EnsureDirectoryPath } from '../../database/DirectoryDatabase';

/**
 * @api {POST} /directory/ensure-path Ensure Dir Path
 * @apiGroup Directory
 * 
 * @apiDescription Ensure dir path and create if missing
 * 
 * @apiPermission Admin only
 * 
 * @apiParam {string} path path to ensure
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 */
class DirectoryEnsurePath implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            require: ['path']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const createRes = await EnsureDirectoryPath(req.body.path);
        if (!createRes.ok) {
            return res.sendStatus(createRes.status);
        }
        return res.sendStatus(204);
    }
}

export default DirectoryEnsurePath;