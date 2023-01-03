import { App, EAuthLevel } from '../app';
import AdminSDKException from '../exception/admin-sdk-exception';

type WhereOp =
    | '<'
    | '<='
    | '='
    | '!='
    | '>='
    | '>'
    | 'LIKE'
    | 'IN'
    | 'NOT IN'
    | 'IS NULL'
    | 'IS NOT NULL';

type OrderDirection =
    | 'asc'
    | 'desc'
    | 'ASC'
    | 'DESC';

export interface IQueryResult {
    queryCount: number;
    totalCount: number;
    data: any[];
}

export class Query {
    private _app: App;
    readonly queryJson: { [key: string]: any } = {};

    constructor(app: App, query: string) {
        this._app = app;
        this.queryJson['query'] = query;
    }

    public with(...tables: string[]): Query {
        this.queryJson.with = tables;
        return this;
    }

    public link(left: string, right: string): Query {
        if (this.queryJson.link === undefined)
            this.queryJson.link = [];

        this.queryJson.link.push({
            left: left,
            right: right
        });
        return this;
    }

    public where(left: string, op: WhereOp, right?: string | string[] | number | number[]): Query {
        if (this.queryJson.where === undefined)
            this.queryJson.where = [];

        let where: { [key: string]: any } = {
            left: left,
            op: op,
        }
        if (op !== "IS NOT NULL" && op !== "IS NULL") {
            where.right = right;
        }
        this.queryJson.where.push(where);
        return this;
    }

    public orderBy(column: string, direction: OrderDirection): Query {
        if (this.queryJson.orderBy === undefined)
            this.queryJson.orderBy = [];

        this.queryJson.orderBy.push({
            column: column,
            direction: direction
        });
        return this;
    }

    public limit(lower: number, upper: number): Query {
        this.queryJson.limit = [lower, upper];
        return this;
    }

    public async get(): Promise<IQueryResult> {
        const res = await this._app.callApi({
            url: `{baseUrl}/query`,
            method: 'POST',
            body: JSON.stringify(this.queryJson),
            json: true,
            auth: EAuthLevel.Optional,
        });
        if (!res.ok) {
            throw new AdminSDKException(`Query fail: response ${res.status}`);
        }
        return await res.json();
    }

    public async count(): Promise<number> {
        const res = await this._app.callApi({
            url: `{baseUrl}/query/count`,
            method: 'POST',
            body: JSON.stringify(this.queryJson),
            json: true,
            auth: EAuthLevel.Optional,
        });
        if (!res.ok) {
            throw new AdminSDKException(`Query count fail: response ${res.status}`);
        }
        const data = await res.json();
        return data['count'];
    }

    public async sum(): Promise<number> {
        const res = await this._app.callApi({
            url: `{baseUrl}/query/sum`,
            method: 'POST',
            body: JSON.stringify(this.queryJson),
            json: true,
            auth: EAuthLevel.Optional,
        });
        if (!res.ok) {
            throw new AdminSDKException(`Query sum fail: response ${res.status}`);
        }
        const data = await res.json();
        return data['sum'];
    }
}
