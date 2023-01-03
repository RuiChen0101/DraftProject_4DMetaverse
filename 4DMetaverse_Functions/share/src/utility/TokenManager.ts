import { sign, verify, JwtPayload } from 'jsonwebtoken';

import Timer from './time/Timer';
import injector from './Injector';
import IUser from '../entities/IUser';
import IAuth from '../entities/IAuth';
import IdGenerator from './IdGenerator';
import RedisClient from './RedisClient';
import EAuthType from '../enum/EAuthType';
import EUserRole from '../enum/EUserRole';
import EUserStatus from '../enum/EUserStatus';
import ForbiddenException from '../exceptions/ForbiddenException';
import InvalidTokenException from '../exceptions/InvalidTokenException';

class TokenManager {
    public async createToken(user: IUser): Promise<[string, string, string]> {
        const nonce = injector.get<IdGenerator>('IdGenerator').nanoid24();
        await injector.get<RedisClient>('TokenCache').set(nonce, user.id!);
        void injector.get<RedisClient>('TokenCache').expire(nonce, 1209600)
        const iat = injector.get<Timer>('Timer').now();
        const accessAuth: IAuth = {
            id: user.id!,
            name: user.name!,
            type: EAuthType.Access,
            allow: ['*'],
            role: user.role!,
            flag: user.flag!,
            status: user.status!,
            nonce: nonce,
            exp: iat + 1800
        }
        const refreshToken: IAuth = {
            id: user.id!,
            name: user.name!,
            type: EAuthType.Refresh,
            allow: ['GET:/auth/refresh'],
            role: user.role!,
            flag: user.flag!,
            status: user.status!,
            nonce: nonce,
            exp: iat + 1209600
        }
        return [
            nonce,
            sign(accessAuth, process.env.JWT_SECRET!, { noTimestamp: true }),
            sign(refreshToken, process.env.JWT_SECRET!, { noTimestamp: true })
        ];
    }

    public createTempToken(user: IUser, allow: string[], timeout: number = 300): string {
        const nonce = injector.get<IdGenerator>('IdGenerator').nanoid24();
        const iat = injector.get<Timer>('Timer').now();
        const tempToken: IAuth = {
            id: user.id!,
            name: user.name!,
            type: EAuthType.Temp,
            allow: allow,
            role: user.role!,
            flag: user.flag!,
            status: user.status!,
            nonce: nonce,
            exp: iat + timeout
        }
        return sign(tempToken, process.env.JWT_SECRET!, { noTimestamp: true });
    }

    public createBotToken(botName: string): string {
        const nonce = injector.get<IdGenerator>('IdGenerator').nanoid24();
        const iat = injector.get<Timer>('Timer').now();
        const tempToken: IAuth = {
            id: botName,
            name: botName,
            type: EAuthType.Temp,
            allow: ['*'],
            role: EUserRole.Bot,
            flag: 0,
            status: EUserStatus.Active,
            nonce: nonce,
            exp: iat + 60
        }
        return sign(tempToken, process.env.JWT_SECRET!, { noTimestamp: true });
    }

    public async refreshingToken(auth: IAuth, user: IUser): Promise<[string, string]> {
        if (auth.type !== EAuthType.Refresh) throw new ForbiddenException('fail to refresh: not refresh token');
        const userId = await injector.get<RedisClient>('TokenCache').get(auth.nonce);
        if (userId === undefined || userId !== user.id)
            throw new ForbiddenException('fail to refresh: invalid nonce');
        await injector.get<RedisClient>('TokenCache').expire(auth.nonce, 1209600);
        const iat = injector.get<Timer>('Timer').now();
        const accessAuth: IAuth = {
            id: user.id!,
            name: user.name!,
            type: EAuthType.Access,
            allow: ['*'],
            role: user.role!,
            flag: user.flag!,
            status: user.status!,
            nonce: auth.nonce,
            exp: iat + 1800
        }
        const refreshToken: IAuth = {
            id: user.id!,
            name: user.name!,
            type: EAuthType.Refresh,
            allow: ['GET:/auth/refresh'],
            role: user.role!,
            flag: user.flag!,
            status: user.status!,
            nonce: auth.nonce,
            exp: iat + 1209600
        }
        return [
            sign(accessAuth, process.env.JWT_SECRET!, { noTimestamp: true }),
            sign(refreshToken, process.env.JWT_SECRET!, { noTimestamp: true })
        ];
    }

    public async deleteToken(auth: IAuth): Promise<void> {
        await injector.get<RedisClient>('TokenCache').del(auth.nonce);
    }

    public async resolveToken(jwtToken: string, method: string, url: string): Promise<IAuth> {
        const payload: JwtPayload = verify(jwtToken, process.env.JWT_SECRET!, { ignoreExpiration: true }) as JwtPayload;
        const authInfo: IAuth = {
            id: payload.id,
            name: payload.name,
            type: payload.type,
            allow: payload.allow,
            role: payload.role,
            flag: payload.flag,
            status: payload.status,
            nonce: payload.nonce,
            exp: payload.exp!
        };
        switch (authInfo.type) {
            case EAuthType.Access:
                this.checkAccessToken(authInfo, method, url);
                break;
            case EAuthType.Temp:
                this.checkTempToken(authInfo, method, url);
                break;
            case EAuthType.Refresh:
                await this.checkRefreshToken(authInfo, method, url);
                break;
        }
        return authInfo;
    }

    private checkAccessToken(auth: IAuth, method: string, url: string): void {
        const now = injector.get<Timer>('Timer').now();
        if (auth.exp < now) throw new InvalidTokenException('token resolve fail: token expired');
    }

    private checkTempToken(auth: IAuth, method: string, url: string): void {
        const now = injector.get<Timer>('Timer').now();
        if (auth.exp < now) throw new InvalidTokenException('token resolve fail: token expired');

        const path = url.split('?')[0];
        const querySchema = new URLSearchParams(url.split('?')[1])
        const req = `${method}:${path}`;
        if (auth.allow.includes('*')) return;
        const find = auth.allow.find((a: string) => a.startsWith(req));
        if (find === undefined) throw new ForbiddenException('token resolve fail: request url not allow');
        const allowQuerySchema = new URLSearchParams(find.split('?')[1]);
        for (const [key, value] of allowQuerySchema.entries()) {
            const v = querySchema.get(key);
            if (v === null || v !== value) throw new ForbiddenException('token resolve fail: request url not allow');
        }
    }

    private async checkRefreshToken(auth: IAuth, method: string, url: string): Promise<void> {
        const now = injector.get<Timer>('Timer').now();
        if (auth.exp < now) throw new InvalidTokenException('token resolve fail: token expired');

        if (!(await injector.get<RedisClient>('TokenCache').exist(auth.nonce)))
            throw new InvalidTokenException('token resolve fail: invalid nonce');

        if (url !== '/auth/refresh' || method !== 'GET')
            throw new ForbiddenException('token resolve fail: request url not allow');
    }
}

export default TokenManager;