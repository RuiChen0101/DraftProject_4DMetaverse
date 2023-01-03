import 'mocha';
import { expect } from 'chai';
import { anything, reset, when } from 'ts-mockito';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import injector from '../../../src/share/utility/Injector';
import TokenManager from '../../../src/share/utility/TokenManager';
import VerifySmsService from '../../../src/service/VerifySmsService';
import AuthVerify2FA from '../../../src/functions/auth/AuthVerify2FA';

const mockTokenManager = injector.get<TokenManager>('MockTokenManager');
const mockVerifySmsService = injector.get<VerifySmsService>('MockVerifySmsService');

const authVerify2FA = new AuthVerify2FA();

describe('AuthVerify2FA', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            'verifyCode': '123456'
        }

        const res = await authVerify2FA.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await authVerify2FA.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should always return true when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const permission = await authVerify2FA.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should response new access and refresh token after successful verify', async () => {
        MockFetch.setJsonResult(200, {
            id: '1234-5678-90ab-cdef',
            phone: '0912345678'
        });
        MockFetch.setJsonResult(200, {});
        when(mockVerifySmsService.verify('0912345678', '123456')).thenResolve(true);
        when(mockTokenManager.createToken(anything())).thenResolve([
            'nonce',
            'accessToken',
            'refreshToken'
        ])
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            'verifyCode': '123456'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await authVerify2FA.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({
            accessToken: 'accessToken',
            refreshToken: 'refreshToken'
        });

        expect(MockFetch.requests[1].reqUrl).to.be.equal('http://127.0.0.1:9998/loginDevice/create');
        expect(MockFetch.requests[1].json()).to.be.deep.equal({
            id: "nonce",
            userId: "1234-5678-90ab-cdef"
        });
    });

    it('should response 403 if sms verify fails', async () => {
        MockFetch.setJsonResult(200, {
            id: '1234-5678-90ab-cdef',
            phone: '0912345678'
        });
        MockFetch.setJsonResult(200, {});
        when(mockVerifySmsService.verify('0912345678', '123456')).thenResolve(false);
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            'verifyCode': '123456'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await authVerify2FA.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(403);
    });

    afterEach(() => {
        reset(mockTokenManager);
        reset(mockVerifySmsService);
        MockFetch.clearResult();
    });
});