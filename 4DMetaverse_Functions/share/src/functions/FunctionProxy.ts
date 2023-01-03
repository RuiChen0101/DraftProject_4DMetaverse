import cors from 'cors';
import express from 'express';

import IExitware from '../exitwares/IExitware';
import IFunction, { Executor } from './IFunction';
import IMiddleware from '../middlewares/IMiddleware';

import ExitLoggerMiddleware from '../middlewares/ExitLoggerMiddleware';
import EntryLoggerMiddleware from '../middlewares/EntryLoggerMiddleware';

import FunctionRouter from './FunctionRouter';

// signal api entry
class AppEntry {
    private app: express.Application;
    private path: string = '';
    private funcs: express.RequestHandler[] = [];
    private exitware: IExitware[] = [];

    constructor(path: string, app: express.Application) {
        this.path = path;
        this.app = app;
    }

    // add entry level middleware
    public before(middleWare: IMiddleware): AppEntry {
        this.funcs.push(middleWare.middleware);
        return this;
    }

    // add entry level middleware
    public after(exitware: IExitware): AppEntry {
        this.exitware.push(exitware);
        return this;
    }

    // set get method for this entry
    public get(func: IFunction): express.Application {
        this.funcs.push(Executor(func, this.exitware));
        this.app.get(this.path, this.funcs);
        return this.app;
    }

    // set post method for this entry
    public post(func: IFunction): express.Application {
        this.funcs.push(Executor(func, this.exitware));
        this.app.post(this.path, this.funcs);
        return this.app;
    }

    // set put method for this entry
    public put(func: IFunction): express.Application {
        this.funcs.push(Executor(func, this.exitware));
        this.app.put(this.path, this.funcs);
        return this.app;
    }
}

// api entry proxy
class FunctionProxy {
    private app: express.Application = express();

    constructor() {
        this.app.use(cors({ origin: true }));
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            req.loaded = {};
            return next();
        });
        this.app.use(new EntryLoggerMiddleware().middleware);
        this.app.use(new ExitLoggerMiddleware().middleware);
    }

    // use express router as entry
    public useRouter(router: FunctionRouter): express.Application {
        this.app.use('/', router.getRouter());
        return this.app;
    }

    // set path for the api
    // Mutually exclusive with useRouter
    public path(path: string): AppEntry {
        return new AppEntry(path, this.app);
    }
}

export default FunctionProxy;