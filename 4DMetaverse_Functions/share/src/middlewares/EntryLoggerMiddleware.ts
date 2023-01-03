import express from 'express';
import { logger } from 'firebase-functions';

import IMiddleware from './IMiddleware';

// function entry logger
// skip multipart body log to prevent very long log
class EntryLoggerMiddleware implements IMiddleware {
    async middleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        if (req.get('Content-Type')?.includes('multipart/form-data;')) {
            logger.log(`${req.method} /${process.env.FUNCTION_TARGET!}${req.originalUrl}`, {
                header: req.headers,
                body: 'multipart'
            });
        } else {
            logger.log(`${req.method} /${process.env.FUNCTION_TARGET!}${req.originalUrl}`, {
                header: req.headers,
                body: req.body
            });
        }
        return next();
    }
}

export default EntryLoggerMiddleware;