import express from 'express';

import IExitware from '../exitwares/IExitware';
import IFunction, { Executor } from './IFunction';
import IMiddleware from '../middlewares/IMiddleware';

// single api entry wrapper
class RouterEntry {
    private router: express.Router;
    private path: string = '';
    private funcs: express.RequestHandler[] = [];
    private exitware: IExitware[] = [];

    constructor(path: string, router: express.Router, routerLevelExitware: IExitware[]) {
        this.path = path;
        this.router = router;
        this.exitware = [...routerLevelExitware];
    }

    // add entry level middleware
    public before(middleWare: IMiddleware): RouterEntry {
        this.funcs.push(middleWare.middleware);
        return this;
    }

    // add entry level exitware
    public after(exitware: IExitware): RouterEntry {
        this.exitware.push(exitware);
        return this;
    }

    // set get method for this entry
    public get(func: IFunction): void {
        this.funcs.push(Executor(func, this.exitware));
        this.router.get(this.path, this.funcs);
    }

    // set post method for this entry
    public post(func: IFunction): void {
        this.funcs.push(Executor(func, this.exitware));
        this.router.post(this.path, this.funcs);
    }

    // set put method for this entry
    public put(func: IFunction): void {
        this.funcs.push(Executor(func, this.exitware));
        this.router.put(this.path, this.funcs);
    }

    // set delete method for this entry
    public delete(func: IFunction): void {
        this.funcs.push(Executor(func, this.exitware));
        this.router.delete(this.path, this.funcs);
    }
}

// express router wrapper
class FunctionRouter {
    private router: express.Router = express.Router();
    private exitware: IExitware[] = [];

    // add router level middleware
    public before(middleware: IMiddleware): FunctionRouter {
        this.router.use(middleware.middleware);
        return this;
    }

    // add router level exitware
    public after(exitware: IExitware): FunctionRouter {
        this.exitware.push(exitware);
        return this;
    }

    // set path for new entry
    public path(path: string): RouterEntry {
        return new RouterEntry(path, this.router, this.exitware);
    }

    // return express router
    public getRouter(): express.Router {
        return this.router;
    }
}

export default FunctionRouter;