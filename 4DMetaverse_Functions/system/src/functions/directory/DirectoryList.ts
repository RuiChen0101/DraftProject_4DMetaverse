import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { ListFileByDirId } from '../../database/FileDatabase';
import { ListDirByParentId } from '../../database/DirectoryDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {GET} /directory/list?dirId={id} List Dir Under Id
 * @apiGroup Directory
 * 
 * @apiDescription List all dir and file under dir
 * 
 * @apiPermission Admin only
 * 
 * @apiParam {string} dirId directory id
 * 
 * @apiSuccess {json[]} dirs all dir under parent
 * @apiSuccess {json[]} files all files under parent
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 */
class DirectoryList implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['dirId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const dirId = parseInt(req.query.dirId as string);
        const [dirRes, fileRes] = await Promise.all([
            ListDirByParentId(dirId),
            ListFileByDirId(dirId)
        ]);
        return res.status(200).json({
            dirs: dirRes.ok ? await dirRes.json() : [],
            files: fileRes.ok ? await fileRes.json() : []
        });
    }
}

export default DirectoryList;