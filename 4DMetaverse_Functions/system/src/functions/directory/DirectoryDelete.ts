import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { DeleteDirectory, GetDirectory } from '../../database/DirectoryDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';
import IDirectory from '../../share/entities/IDirectory';

/**
 * @api {DELETE} /directory/delete?dirId={id} Delete Directory
 * @apiGroup Directory
 * 
 * @apiDescription Delete directory
 * 
 * @apiPermission Admin only
 * 
 * @apiParam {number} dirId id of directory
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 * @apiError 404 directory not found
 */
class DirectoryDelete implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['dirId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        const dirId = parseInt(req.query.dirId as string);
        const dir: IDirectory = await (await GetDirectory(dirId)).json();
        return isAdmin(req.loaded.auth) && !dir.isLocked;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const dirId = parseInt(req.query.dirId as string);
        const deleteRes = await DeleteDirectory(dirId);
        if (!deleteRes.ok) {
            return res.sendStatus(deleteRes.status);
        }
        return res.sendStatus(204);
    }
}

export default DirectoryDelete;