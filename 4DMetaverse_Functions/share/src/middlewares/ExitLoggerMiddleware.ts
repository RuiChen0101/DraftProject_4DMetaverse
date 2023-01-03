import express from 'express';
import { logger } from 'firebase-functions';

import IMiddleware from './IMiddleware';

// function exit logger
// log error when status code >= 400
class ExitLoggerMiddleware implements IMiddleware {
    async middleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        const originalSend = res.send;
        let resBody: string = '';
        res.send = function (body: any): express.Response<any> {
            resBody = JSON.stringify(body);
            return originalSend.call(this, body);
        }
        res.on('finish', () => {
            if (resBody.length > 1000) {
                resBody = resBody.substr(0, 1000) + '...';
            }
            if (res.statusCode < 400) {
                logger.log(`${req.method} /${process.env.FUNCTION_TARGET!}${req.originalUrl} ${res.statusCode}`, { resBody: resBody });
            } else {
                logger.error(`${req.method} /${process.env.FUNCTION_TARGET!}${req.originalUrl} ${res.statusCode}`, { resBody: resBody })
            }
        });
        return next();
    }
}

export default ExitLoggerMiddleware;