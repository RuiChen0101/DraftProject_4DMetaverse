import { Auth } from '../auth';
import { AppConfig } from './app-config';
import { ApiSetting, EAuthLevel } from './api-settings';
import { ApiRequest, resolveApi } from '../utils/api-handler';
import AdminSDKException from '../exception/admin-sdk-exception';

export class App {
    private readonly _config: AppConfig;
    private _services: { [key: string]: unknown } = {};
    private _tokenListeners: Array<() => void> = [];

    constructor(config: AppConfig) {
        this._config = config
    }

    public getOrInitialize<T>(name: string, init: (app: App) => T): T {
        if (name in this._services) return this._services[name] as T;
        const service = init(this);
        this._services[name] = service;
        return service;
    }

    public async callApi(setting: ApiSetting): Promise<Response> {
        let url = setting.url.replace('{baseUrl}', this._config.baseUrl);
        url = url.replace('{storageBaseUrl}', this._config.storageBaseUrl);
        const req: ApiRequest = {
            url: url,
            method: setting.method,
            header: { ...setting.header },
            body: setting.body
        }
        if (setting.json !== undefined && setting.json === true) {
            req.header!['Content-Type'] = 'application/json';
        }
        await this._loadAuth(req, setting.auth ?? EAuthLevel.None);
        return resolveApi(req);
    }

    public addAuthTokenListener(listener: () => void): void {
        this._tokenListeners.push(listener);
    }

    public authLost(): void {
        this._tokenListeners.forEach((listener) => {
            listener();
        });
    }

    private async _loadAuth(req: ApiRequest, level: EAuthLevel): Promise<void> {
        const auth = this._services['auth'] as Auth | undefined;
        const now = Math.floor(new Date().getTime() / 1000);
        switch (level) {
            case EAuthLevel.None:
                return;
            case EAuthLevel.Optional:
                if (auth === undefined || auth.accessTokenData === undefined) return;
                try {
                    if (now > (auth.accessTokenData.exp - 15)) {
                        await auth.refreshingToken();
                    }
                    req.header!['Authorization'] = 'Bearer ' + auth.accessToken;
                } finally {
                    return;
                }
            case EAuthLevel.Require:
                if (auth === undefined || auth.accessTokenData === undefined) throw new AdminSDKException('No authorization');
                if (now > (auth.accessTokenData.exp - 15)) {
                    await auth.refreshingToken();
                }
                req.header!['Authorization'] = 'Bearer ' + auth.accessToken;
                return;
        }
    }
}