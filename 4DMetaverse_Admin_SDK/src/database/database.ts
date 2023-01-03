import { App } from '../app';
import { Query } from './query';
import { RawQuery } from './raw-query';

class Database {
    private _app: App;

    constructor(app: App) {
        this._app = app;
    }

    public query(query: string): Query {
        return new Query(this._app, query);
    }

    public rawQuery(sql: string): RawQuery {
        return new RawQuery(this._app, sql);
    }
}

export default Database;