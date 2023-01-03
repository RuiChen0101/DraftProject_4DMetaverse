import * as express from 'express';
import Config from '../../share/config/Config';

import IFunction from '../../share/functions/IFunction';

/**
 * @api {GET} /system/status Status
 * @apiGroup System
 * 
 * @apiDescription get function and underlay services status
 * 
 * @apiPermission none
 */
class SystemStatus implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return true;
    }

    async permission(req: express.Request): Promise<boolean> {
        return true;
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        return res.status(200).json({
            env: process.env.ENV,
            function: {
                status: 'OK',
                version: Config.function.version
            },
            supportVersion: Config.app.support_version
        });
    }
}

export default SystemStatus;