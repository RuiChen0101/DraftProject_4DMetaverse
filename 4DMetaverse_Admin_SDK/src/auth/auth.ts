import { Base64 } from 'js-base64';

import { App, EAuthLevel } from '../app';
import AdminSDKException from '../exception/admin-sdk-exception';

interface TokenData {
    id: string;
    name: string;
    type: number;
    allow: string[];
    role: number;
    flag: number;
    status: number;
    nonce: string;
    iat: number;
    exp: number;
}

interface TwoStepVerifyData {
    phone: string;
    tempToken: string;
}

export class Auth {
    private _app: App
    private _refreshToken: string | undefined = undefined;
    private _accessToken: string | undefined = undefined;
    private _accessTokenData: TokenData | undefined = undefined;

    public get accessToken(): string | undefined {
        return this._accessToken;
    }

    public get accessTokenData(): TokenData | undefined {
        return this._accessTokenData;
    }

    private set refreshToken(token: string | undefined) {
        if (token === undefined) {
            localStorage.removeItem('refresh_token');
        } else {
            localStorage.setItem('refresh_token', token);
        }
        this._refreshToken = token;
    }

    private set accessToken(token: string | undefined) {
        if (token === undefined) {
            this._accessTokenData = undefined;
        } else {
            this._accessTokenData = JSON.parse(Base64.decode(token.split('.')[1]!));
        }
        this._accessToken = token;
    }

    constructor(app: App) {
        this._app = app;
    }

    public async initializeAuth(): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken === null) return;
        this._refreshToken = refreshToken;
        try {
            await this.refreshingToken();
        } catch (_) { }
    }

    public async loginWithEmail(email: string, password: string): Promise<TwoStepVerifyData | undefined> {
        const res = await this._app.callApi({
            url: '{baseUrl}/auth/login',
            method: 'GET',
            header: { Authorization: 'Basic ' + Base64.encode(`${email}:${password}`) }
        });
        if (!res.ok) {
            throw new AdminSDKException(`Login with email fail: response ${res.status}`);
        }
        const data = await res.json();
        if ('phone' in data && 'tempToken' in data) {
            return data;
        }
        this.refreshToken = data['refreshToken'];
        this.accessToken = data['accessToken'];
        return undefined;
    }

    public async sendVerifySms(phone: string, tempToken: string): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/verifysms/send?phone=${phone}`,
            method: 'POST',
            header: { Authorization: 'Bearer ' + tempToken }
        });
        if (!res.ok) {
            throw new AdminSDKException(`Verify sms send fail: response ${res.status}`);
        }
    }

    public async verify2FA(verifyCode: string, tempToken: string): Promise<void> {
        const res = await this._app.callApi({
            url: `{baseUrl}/auth/2fa_verify?verifyCode=${verifyCode}`,
            method: 'GET',
            header: { Authorization: 'Bearer ' + tempToken }
        });
        if (!res.ok) {
            throw new AdminSDKException(`2FA verify fail: response ${res.status}`);
        }
        const data = await res.json();
        this.refreshToken = data['refreshToken'];
        this.accessToken = data['accessToken'];
    }

    public async logout(): Promise<void> {
        this._app.callApi({
            url: '{baseUrl}/auth/logout',
            method: 'GET',
            auth: EAuthLevel.Require
        });
        this.refreshToken = undefined;
        this.accessToken = undefined;
        this._app.authLost();
    }

    public async refreshingToken(): Promise<void> {
        if (this._refreshToken === undefined) throw new AdminSDKException('Missing refresh token');
        const res = await this._app.callApi({
            url: '{baseUrl}/auth/refresh',
            method: 'GET',
            header: { Authorization: 'Bearer ' + this._refreshToken }
        });
        if (!res.ok) {
            this.refreshToken = undefined;
            this.accessToken = undefined;
            this._app.authLost();
            throw new AdminSDKException('Token refreshing fail');
        }
        const data = await res.json();
        this.refreshToken = data['refreshToken']
        this.accessToken = data['accessToken']
    }
}