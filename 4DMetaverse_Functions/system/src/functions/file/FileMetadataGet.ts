import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { isAdmin } from '../../share/utility/RoleValidator';
import { GetFileMetadata } from '../../database/FileDatabase';
import { UrlQueryValidator } from '../../share/utility/RequestValidator';

/**
 * @api {GET} /file/metadata?fileId={id}|path={path} Get File Metadata
 * @apiGroup Directory
 * 
 * @apiDescription Get file metadata either by id or path
 * 
 * @apiPermission Admin only
 * 
 * @apiParam {string} [fileId] file id
 * @apiParam {string} [path] file path
 * 
 * @apiSuccess {json} file
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 */
class FileMetadataGet implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return UrlQueryValidator(['fileId'], req) || UrlQueryValidator(['path'], req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return isAdmin(req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const value = (req.query.fileId ?? req.query.path) as string;
        const getRes = await GetFileMetadata(value);
        if (!getRes.ok) return res.sendStatus(getRes.status);
        return res.status(200).json(await getRes.json());
    }
}

export default FileMetadataGet;