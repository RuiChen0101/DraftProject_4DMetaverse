import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { ListFileByPathPrefix } from '../../database/FileDatabase';
import { ListDirByPathPrefix } from '../../database/DirectoryDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {GET} /directory/list/by-path?path={path} List Dir Under Path
 * @apiGroup Directory
 * 
 * @apiDescription List all dir and file under dir by path
 * 
 * @apiPermission Admin only
 * 
 * @apiParam {string} path listing path
 * 
 * @apiSuccess {json[]} dirs all dir under parent
 * @apiSuccess {json[]} files all files under parent
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 */
class DirectoryListByPath implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['path'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const path = decodeURI(req.query.path as string);
        const [dirRes, fileRes] = await Promise.all([
            ListDirByPathPrefix(path),
            ListFileByPathPrefix(path)
        ]);
        return res.status(200).json({
            dirs: dirRes.ok ? await dirRes.json() : [],
            files: fileRes.ok ? await fileRes.json() : []
        });
    }
}

export default DirectoryListByPath;