import { expect } from 'chai';
import { describe } from 'mocha';
import IAuth from '../../src/entities/IAuth';
import IUser from '../../src/entities/IUser';

import EAuthType from '../../src/enum/EAuthType';
import injector from '../../src/utility/Injector';
import RedisClient from '../../src/utility/RedisClient';
import TokenManager from '../../src/utility/TokenManager';
import { clearTime, setTime } from '../test-tools/fakes/FakeTimer';

const tokenManager = new TokenManager();
const tokenCache = injector.get<RedisClient>('TokenCache');

describe('TokenManager', () => {
    it('should create token and register nonce to redis', async () => {
        const user: IUser = {
            id: '1234-5678-90ab-cdef',
            name: 'name',
            role: 1,
            flag: 0,
            status: 0
        }

        const [nonce, accessToken, refreshToken] = await tokenManager.createToken(user);

        expect(nonce).to.be.equal('1234567890abcdefghijklmn');
        expect(await tokenCache.ttl(nonce)).to.be.equal(1209600);

        expect(accessToken).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjIsImFsbG93IjpbIioiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.ZGxVYOGyHUzW4TippiKIIt3_jP2OJrxUcElhHQ8WTBY');
        expect(refreshToken).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjMsImFsbG93IjpbIkdFVDovYXV0aC9yZWZyZXNoIl0sInJvbGUiOjEsImZsYWciOjAsInN0YXR1cyI6MCwibm9uY2UiOiIxMjM0NTY3ODkwYWJjZGVmZ2hpamtsbW4iLCJleHAiOjEyMDk2MDB9.Z16Y8yqj4HZtvwrIegIPF8dkjReatssZG4vrIyRg5fI');
    });


    it('should create temp token', () => {
        const user: IUser = {
            id: '1234-5678-90ab-cdef',
            name: 'name',
            role: 1,
            flag: 0,
            status: 0
        }

        const tempToken = tokenManager.createTempToken(user, ['GET:/user/get?userId=1234-5678-90ab-cdef'], 1800);

        expect(tempToken).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjEsImFsbG93IjpbIkdFVDovdXNlci9nZXQ_dXNlcklkPTEyMzQtNTY3OC05MGFiLWNkZWYiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.N7x9Em9Iu9_eHETPMzIw0GtBZXsS7fAFrdT9Z4ePFP4');
    });

    it('should create bot token', () => {
        const botToken = tokenManager.createBotToken('bot');

        expect(botToken).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJvdCIsIm5hbWUiOiJib3QiLCJ0eXBlIjoxLCJhbGxvdyI6WyIqIl0sInJvbGUiOjEwMCwiZmxhZyI6MCwic3RhdHVzIjoxLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6NjB9.GQuCwb2IFPvQyWaJMR73nG8eE6kJCLkbC_v_XeXpx7Q');
    });

    it('should refresh token if token is valid and nonce exist in redis', async () => {
        tokenCache.set('1234567890abcdefghijklmn', '1234-5678-90ab-cdef');
        const user: IUser = {
            id: '1234-5678-90ab-cdef',
            name: 'name',
            role: 90,
            flag: 0,
            status: 0
        }
        const auth: IAuth = {
            id: "1234-5678-90ab-cdef",
            name: "name",
            type: EAuthType.Refresh,
            allow: [
                "GET:/auth/refresh"
            ],
            role: 1,
            flag: 0,
            status: 0,
            nonce: "1234567890abcdefghijklmn",
            exp: 1209600
        }

        const [accessToken, refreshToken] = await tokenManager.refreshingToken(auth, user);

        expect(await tokenCache.ttl("1234567890abcdefghijklmn")).to.be.equal(1209600);
        expect(accessToken).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjIsImFsbG93IjpbIioiXSwicm9sZSI6OTAsImZsYWciOjAsInN0YXR1cyI6MCwibm9uY2UiOiIxMjM0NTY3ODkwYWJjZGVmZ2hpamtsbW4iLCJleHAiOjE4MDB9.O2XEQWhQM358v6PXpHR9ygXZ0IKOh5bs4apKsEWO6F8');
        expect(refreshToken).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjMsImFsbG93IjpbIkdFVDovYXV0aC9yZWZyZXNoIl0sInJvbGUiOjkwLCJmbGFnIjowLCJzdGF0dXMiOjAsIm5vbmNlIjoiMTIzNDU2Nzg5MGFiY2RlZmdoaWprbG1uIiwiZXhwIjoxMjA5NjAwfQ.G56E9oo35UZAWBuXmIZBU2ZSknW5ooKaKN1YZMHez8w');
    });

    it('should reject refresh token if auth type is not Refresh', async () => {
        const user: IUser = {
            id: '1234-5678-90ab-cdef',
            name: 'name',
            role: 90,
            flag: 0,
            status: 0
        }
        const auth: IAuth = {
            id: "1234-5678-90ab-cdef",
            name: "name",
            type: EAuthType.Access,
            allow: [
                "*"
            ],
            role: 1,
            flag: 0,
            status: 0,
            nonce: "1234567890abcdefghijklmn",
            exp: 1800
        }

        try {
            await tokenManager.refreshingToken(auth, user);
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('fail to refresh: not refresh token');
        }
    });

    it('should reject refresh token if nonce not in redis', async () => {
        const user: IUser = {
            id: '1234-5678-90ab-cdef',
            name: 'name',
            role: 90,
            flag: 0,
            status: 0
        }
        const auth: IAuth = {
            id: "1234-5678-90ab-cdef",
            name: "name",
            type: EAuthType.Refresh,
            allow: [
                "GET:/auth/refresh"
            ],
            role: 1,
            flag: 0,
            status: 0,
            nonce: "1234567890abcdefghijklmn",
            exp: 1209600
        }

        try {
            await tokenManager.refreshingToken(auth, user);
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('fail to refresh: invalid nonce');
        }
    });

    it('should delete token', async () => {
        tokenCache.set('1234567890abcdefghijklmn', '1234-5678-90ab-cdef');
        await tokenManager.deleteToken({
            id: "1234-5678-90ab-cdef",
            name: "name",
            type: EAuthType.Access,
            allow: [
                "*"
            ],
            role: 1,
            flag: 0,
            status: 0,
            nonce: "1234567890abcdefghijklmn",
            exp: 1800
        });

        expect(await tokenCache.exist('1234567890abcdefghijklmn')).to.be.false;
    });

    it('should resolve non-expired access token', async () => {
        const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjIsImFsbG93IjpbIioiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.ZGxVYOGyHUzW4TippiKIIt3_jP2OJrxUcElhHQ8WTBY';
        const auth = await tokenManager.resolveToken(accessToken, 'GET', '/user/get?userId=1234-5678-90ab-cdef');

        expect(auth).to.be.deep.equal({
            id: "1234-5678-90ab-cdef",
            name: "name",
            type: EAuthType.Access,
            allow: [
                "*"
            ],
            role: 1,
            flag: 0,
            status: 0,
            nonce: "1234567890abcdefghijklmn",
            exp: 1800
        });
    });

    it('should reject resolve expired access token', async () => {
        setTime(1801);
        const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjIsImFsbG93IjpbIioiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.ZGxVYOGyHUzW4TippiKIIt3_jP2OJrxUcElhHQ8WTBY';

        try {
            await tokenManager.resolveToken(accessToken, 'GET', '/user/get?userId=1234-5678-90ab-cdef');
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('token resolve fail: token expired');
        }
    });

    it('should resolve non-expired temp token if it request to allowed url', async () => {
        const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjEsImFsbG93IjpbIkdFVDovdXNlci9nZXQ_dXNlcklkPTEyMzQtNTY3OC05MGFiLWNkZWYiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.N7x9Em9Iu9_eHETPMzIw0GtBZXsS7fAFrdT9Z4ePFP4';

        const auth = await tokenManager.resolveToken(tempToken, 'GET', '/user/get?userId=1234-5678-90ab-cdef&accessToken=123456');

        expect(auth).to.be.deep.equal({
            id: "1234-5678-90ab-cdef",
            name: "name",
            type: EAuthType.Temp,
            allow: [
                "GET:/user/get?userId=1234-5678-90ab-cdef"
            ],
            role: 1,
            flag: 0,
            status: 0,
            nonce: "1234567890abcdefghijklmn",
            exp: 1800
        });
    });

    it('should resolve non-expired temp token if token allow all url', async () => {
        const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjEsImFsbG93IjpbIioiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.DQVhCK-10PTOfvFQCdTc86pd1JZNIGlRzxBWVe6G934';

        const auth = await tokenManager.resolveToken(tempToken, 'GET', '/user/get?userId=1234-5678-90ab-cdef&accessToken=123456');

        expect(auth).to.be.deep.equal({
            id: "1234-5678-90ab-cdef",
            name: "name",
            type: EAuthType.Temp,
            allow: [
                "*"
            ],
            role: 1,
            flag: 0,
            status: 0,
            nonce: "1234567890abcdefghijklmn",
            exp: 1800
        });
    });

    it('should reject resolve temp token if it request to not allowed url', async () => {
        const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjEsImFsbG93IjpbIkdFVDovdXNlci9nZXQ_dXNlcklkPTEyMzQtNTY3OC05MGFiLWNkZWYiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.N7x9Em9Iu9_eHETPMzIw0GtBZXsS7fAFrdT9Z4ePFP4';

        try {
            await tokenManager.resolveToken(tempToken, 'GET', '/user/update?userId=1234-5678-90ab-cdef&accessToken=123456');
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('token resolve fail: request url not allow');
        }
    });

    it('should reject resolve temp token if it request to allowed url but missing query', async () => {
        const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjEsImFsbG93IjpbIkdFVDovdXNlci9nZXQ_dXNlcklkPTEyMzQtNTY3OC05MGFiLWNkZWYiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.N7x9Em9Iu9_eHETPMzIw0GtBZXsS7fAFrdT9Z4ePFP4';

        try {
            await tokenManager.resolveToken(tempToken, 'GET', '/user/get');
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('token resolve fail: request url not allow');
        }
    });

    it('should reject resolve expired temp token', async () => {
        setTime(1801);
        const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjEsImFsbG93IjpbIkdFVDovdXNlci9nZXQ_dXNlcklkPTEyMzQtNTY3OC05MGFiLWNkZWYiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.N7x9Em9Iu9_eHETPMzIw0GtBZXsS7fAFrdT9Z4ePFP4';
        try {
            await tokenManager.resolveToken(tempToken, 'GET', '/user/get?userId=1234-5678-90ab-cdef&accessToken=123456');
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('token resolve fail: token expired');
        }
    });

    it('should resolve non-expired refresh token if request to refresh endpoint', async () => {
        tokenCache.set('1234567890abcdefghijklmn', '1234-5678-90ab-cdef');

        const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjMsImFsbG93IjpbIkdFVDovYXV0aC9yZWZyZXNoIl0sInJvbGUiOjEsImZsYWciOjAsInN0YXR1cyI6MCwibm9uY2UiOiIxMjM0NTY3ODkwYWJjZGVmZ2hpamtsbW4iLCJleHAiOjEyMDk2MDB9.Z16Y8yqj4HZtvwrIegIPF8dkjReatssZG4vrIyRg5fI';

        const auth = await tokenManager.resolveToken(refreshToken, 'GET', '/auth/refresh');

        expect(auth).to.be.deep.equal({
            id: "1234-5678-90ab-cdef",
            name: "name",
            type: EAuthType.Refresh,
            allow: [
                "GET:/auth/refresh"
            ],
            role: 1,
            flag: 0,
            status: 0,
            nonce: "1234567890abcdefghijklmn",
            exp: 1209600
        });
    });

    it('should reject resolve refresh token if request to other endpoint', async () => {
        tokenCache.set('1234567890abcdefghijklmn', '1234-5678-90ab-cdef');

        const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjMsImFsbG93IjpbIkdFVDovYXV0aC9yZWZyZXNoIl0sInJvbGUiOjEsImZsYWciOjAsInN0YXR1cyI6MCwibm9uY2UiOiIxMjM0NTY3ODkwYWJjZGVmZ2hpamtsbW4iLCJleHAiOjEyMDk2MDB9.Z16Y8yqj4HZtvwrIegIPF8dkjReatssZG4vrIyRg5fI';

        try {
            await tokenManager.resolveToken(refreshToken, 'GET', '/user/get');
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('token resolve fail: request url not allow');
        }
    });

    it('should resolve refresh token if nonce not in redis', async () => {
        const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjMsImFsbG93IjpbIkdFVDovYXV0aC9yZWZyZXNoIl0sInJvbGUiOjEsImZsYWciOjAsInN0YXR1cyI6MCwibm9uY2UiOiIxMjM0NTY3ODkwYWJjZGVmZ2hpamtsbW4iLCJleHAiOjEyMDk2MDB9.Z16Y8yqj4HZtvwrIegIPF8dkjReatssZG4vrIyRg5fI';

        try {
            await tokenManager.resolveToken(refreshToken, 'GET', '/user/get');
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('token resolve fail: invalid nonce');
        }
    });

    it('should reject resolve expired refresh token', async () => {
        setTime(1209601);
        tokenCache.set('1234567890abcdefghijklmn', '1234-5678-90ab-cdef');

        const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjMsImFsbG93IjpbIkdFVDovYXV0aC9yZWZyZXNoIl0sInJvbGUiOjEsImZsYWciOjAsInN0YXR1cyI6MCwibm9uY2UiOiIxMjM0NTY3ODkwYWJjZGVmZ2hpamtsbW4iLCJleHAiOjEyMDk2MDB9.Z16Y8yqj4HZtvwrIegIPF8dkjReatssZG4vrIyRg5fI';

        try {
            await tokenManager.resolveToken(refreshToken, 'GET', '/auth/refresh');
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('token resolve fail: token expired');
        }
    });

    afterEach(() => {
        tokenCache.flushdb();
        clearTime();
    });
});