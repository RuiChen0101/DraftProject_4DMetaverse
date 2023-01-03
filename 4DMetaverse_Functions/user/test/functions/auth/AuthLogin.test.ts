import 'mocha';
import { expect } from 'chai';
import { reset, when, anything, verify, deepEqual } from 'ts-mockito';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserFlag from '../../../src/share/enum/EUserFlag';
import injector from '../../../src/share/utility/Injector';
import AuthLogin from '../../../src/functions/auth/AuthLogin';
import EUserStatus from '../../../src/share/enum/EUserStatus';
import TokenManager from '../../../src/share/utility/TokenManager';

const mockTokenManager = injector.get<TokenManager>('MockTokenManager');
const authLogin = new AuthLogin();

describe('AuthLogin', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({
            "Authorization": "Basic dGVzdEBlbWFpbC5jb206cGFzc3dvcmQ="
        }, {});

        const res = await authLogin.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await authLogin.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should always return true when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const permission = await authLogin.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should response accessToken and refreshToken if email and password are passing the check', async () => {
        MockFetch.setJsonResult(200, {
            id: "1234-5678-90ab-cdef",
            name: "name",
            email: "test@email.com",
            password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=",
            loginMethods: 1,
            flag: 0,
            role: 1,
            status: 1,
            createBy: "1234-5678-90ab-cdef",
        });
        MockFetch.setJsonResult(200, {});
        when(mockTokenManager.createToken(anything())).thenResolve([
            'nonce',
            'accessToken',
            'refreshToken'
        ])

        const req: FakeRequest = new FakeRequest({
            "Authorization": "Basic dGVzdEBlbWFpbC5jb206cGFzc3dvcmQ=",
        }, {});
        let res: FakeResponse = new FakeResponse();

        res = await authLogin.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({
            accessToken: 'accessToken',
            refreshToken: 'refreshToken'
        });

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9998/user/get/email/test%40email.com');

        expect(MockFetch.requests[1].reqUrl).to.be.equal('http://127.0.0.1:9998/loginDevice/create');
        expect(MockFetch.requests[1].json()).to.be.deep.equal({
            id: "nonce",
            userId: "1234-5678-90ab-cdef"
        });
    });

    it('should response 501 if want login if web3', async () => {
        const req: FakeRequest = new FakeRequest({
            "Authorization": "Web3 web3auth",
        }, {});
        let res: FakeResponse = new FakeResponse();

        res = await authLogin.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(501);
    });

    it('should response 2fa temp token if user enable 2fa verify', async () => {
        MockFetch.setJsonResult(200, {
            id: "1234-5678-90ab-cdef",
            name: "name",
            email: "test@email.com",
            password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=",
            phone: '0912345678',
            loginMethods: 1,
            flag: EUserFlag.Enable2FA,
            role: 1,
            status: 1,
            createBy: "1234-5678-90ab-cdef",
        });
        MockFetch.setJsonResult(200, {});
        when(mockTokenManager.createTempToken(anything(), anything())).thenReturn('tempToken');

        const req: FakeRequest = new FakeRequest({
            "Authorization": "Basic dGVzdEBlbWFpbC5jb206cGFzc3dvcmQ=",
        }, {});
        let res: FakeResponse = new FakeResponse();

        res = await authLogin.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({
            phone: '0912345678',
            tempToken: 'tempToken'
        });

        verify(mockTokenManager.createTempToken(deepEqual({
            id: "1234-5678-90ab-cdef",
            name: "name",
            email: "test@email.com",
            password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=",
            phone: '0912345678',
            loginMethods: 1,
            flag: EUserFlag.Enable2FA,
            role: 1,
            status: 1,
            createBy: "1234-5678-90ab-cdef",
        }), deepEqual(['GET:/auth/2fa_verify', `GET:/verifysms/send?phone=0912345678`]))).once();
    });

    it('should response 404 if user not found when login with email', async () => {
        MockFetch.setJsonResult(404, {});

        const req: FakeRequest = new FakeRequest({
            "Authorization": "Basic dGVzdEBlbWFpbC5jb206cGFzc3dvcmQ=",
        }, {});
        let res: FakeResponse = new FakeResponse();

        res = await authLogin.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);
        expect(res.resBody).to.be.equal('user not found');
    });

    it('should response 403 if password not match when login with email', async () => {
        MockFetch.setJsonResult(200, {
            id: "1234-5678-90ab-cdef",
            name: "name",
            email: "test@email.com",
            password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg",
            loginMethods: 1,
            flag: 0,
            role: 1,
            status: 1,
            createBy: "1234-5678-90ab-cdef",
        });

        const req: FakeRequest = new FakeRequest({
            "Authorization": "Basic dGVzdEBlbWFpbC5jb206cGFzc3dvcmQ=",
        }, {});
        let res: FakeResponse = new FakeResponse();

        res = await authLogin.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(403);
        expect(res.resBody).to.be.equal('password check fail');
    });

    it('should response 403 if user is not active', async () => {
        MockFetch.setJsonResult(200, {
            id: "1234-5678-90ab-cdef",
            name: "name",
            email: "test@email.com",
            password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=",
            loginMethods: 1,
            flag: 0,
            role: 1,
            status: EUserStatus.Blocked,
            createBy: "1234-5678-90ab-cdef",
        });

        const req: FakeRequest = new FakeRequest({
            "Authorization": "Basic dGVzdEBlbWFpbC5jb206cGFzc3dvcmQ=",
        }, {});
        let res: FakeResponse = new FakeResponse();

        res = await authLogin.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(403);
        expect(res.resBody).to.be.equal('user disabled');
    });

    afterEach(() => {
        MockFetch.clearResult();
        reset(mockTokenManager);
    });
});