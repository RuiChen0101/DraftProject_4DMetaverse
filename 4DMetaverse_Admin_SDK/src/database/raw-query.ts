import { App, EAuthLevel } from '../app';
import AdminSDKException from '../exception/admin-sdk-exception';

export class RawQuery {
    private _app: App;
    readonly sql: string;

    constructor(app: App, sql: string) {
        this._app = app;
        this.sql = sql;
    }

    public async get(): Promise<any[]> {
        const res = await this._app.callApi({
            url: `{baseUrl}/query/raw`,
            method: 'POST',
            body: `{"sql":"${this.sql}"}`,
            json: true,
            auth: EAuthLevel.Require,
        });
        if (!res.ok) {
            throw new AdminSDKException(`Query raw fail: response ${res.status}`);
        }
        return await res.json();
    }
}