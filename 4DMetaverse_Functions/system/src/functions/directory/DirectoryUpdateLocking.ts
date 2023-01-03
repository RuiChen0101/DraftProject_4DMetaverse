import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import RequestValidator from '../../share/utility/RequestValidator';
import { UpdateDirectory } from '../../database/DirectoryDatabase';

/**
 * @api {PUT} /directory/update/locking?dirId={id} Update Dir Locking
 * @apiGroup Directory
 * 
 * @apiDescription Updating directory locking state
 * 
 * @apiPermission Admin only
 * 
 * @apiParam {number} dirId id of directory
 * @apiParam {boolean} isLocked locking state
 * 
 * @apiSuccess (No Content 204) Success no content
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 * @apiError 404 directory not found
 */
class DirectoryUpdateLocking implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            query: ['dirId'],
            require: ['isLocked']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const dirId = parseInt(req.query.dirId as string);
        const updateRes = await UpdateDirectory(dirId, req.body);
        if (!updateRes.ok) {
            return res.sendStatus(updateRes.status);
        }
        return res.sendStatus(204);
    }
}

export default DirectoryUpdateLocking;