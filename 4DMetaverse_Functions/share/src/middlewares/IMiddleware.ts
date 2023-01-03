import express from 'express';

// middleware interface
export default interface IMiddleWare {
    middleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}