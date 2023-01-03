import express from 'express';
import { logger } from 'firebase-functions';

import FetchTimeoutException from '../exceptions/FetchTimeoutException';
import FunctionExecutionFailException from '../exceptions/FunctionExecutionFailException';

import IExitware from '../exitwares/IExitware';

// Entry function interface
export default interface IFunction {
    preRequirement(req: express.Request): Promise<boolean>;
    permission(req: express.Request): Promise<boolean>;
    function(req: express.Request, res: express.Response): Promise<express.Response<any>>;
}

// IFunction executor preform pre-requirement check and execute function body
export const Executor = (func: IFunction, exitware: IExitware[]): express.RequestHandler => {
    return async (req: express.Request, res: express.Response): Promise<express.Response<any>> => {
        if (req.loaded.auth === undefined) {
            logger.error(`Missing authorization: /${process.env.FUNCTION_TARGET}${req.path}`);
            return res.sendStatus(401);
        }
        try {
            if (!(await func.preRequirement(req))) {
                logger.error(`Function pre-requirement check fail: /${process.env.FUNCTION_TARGET}${req.path}`);
                return res.sendStatus(400);
            }
            try {
                if (!(await func.permission(req))) {
                    logger.error(`Insufficient function permission: /${process.env.FUNCTION_TARGET}${req.path}`);
                    return res.sendStatus(403);
                }
            } catch (err) {
                logger.error('Fail to execute permission rule', (err as any).message);
                return res.sendStatus(403);
            }
            const result = await func.function(req, res);
            for (const exit of exitware) {
                await exit.exitware(req, result);
            }
            return result;
        } catch (e: any) {
            if (e instanceof FetchTimeoutException) {
                logger.error('Fail to execute function, ', e.message);
                return res.sendStatus(408);
            } else if (e instanceof FunctionExecutionFailException) {
                logger.error('Fail to execute function, ', e.message);
                return res.status(e.code).send(e.message);
            } else {
                logger.error('Fail to execute function, ', (e as any).message);
                return res.sendStatus(500);
            }
        }
    }
}