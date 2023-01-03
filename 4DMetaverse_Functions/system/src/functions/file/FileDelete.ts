import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { DeleteFile } from '../../database/FileDatabase';
import { isAdmin } from '../../share/utility/RoleValidator';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {DELETE} /file/delete?fileId={id} Delete File
 * @apiGroup File
 * 
 * @apiDescription Delete file
 * 
 * @apiPermission Admin only
 * 
 * @apiParam {number} fileId id of file
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 * @apiError 404 file not found
 */
class FileDelete implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['fileId'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const fileId = req.query.fileId as string;
        const deleteRes = await DeleteFile(fileId);
        if (!deleteRes.ok) {
            return res.sendStatus(deleteRes.status);
        }
        return res.sendStatus(204);
    }
}

export default FileDelete;