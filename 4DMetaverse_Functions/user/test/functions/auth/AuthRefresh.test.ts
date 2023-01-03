import 'mocha';
import { expect } from 'chai';
import { anything, reset, when } from 'ts-mockito';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EAuthType from '../../../src/share/enum/EAuthType';
import injector from '../../../src/share/utility/Injector';
import AuthRefresh from '../../../src/functions/auth/AuthRefresh';
import TokenManager from '../../../src/share/utility/TokenManager';
import EUserStatus from '../../../src/share/enum/EUserStatus';
import ForbiddenException from '../../../src/share/exceptions/ForbiddenException';

const mockTokenManager = injector.get<TokenManager>('MockTokenManager');
const authRefresh = new AuthRefresh();

describe('AuthRefresh', () => {
    it('should always pass if when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await authRefresh.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should return true if token type is refresh when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            type: EAuthType.Refresh
        }

        const permission = await authRefresh.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should return false if token type is not refresh when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            type: EAuthType.Access
        }

        const permission = await authRefresh.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response new access and refresh token after successful refresh', async () => {
        MockFetch.setJsonResult(200, {
            status: EUserStatus.Active,
        });
        MockFetch.setJsonResult(200, {});
        when(mockTokenManager.refreshingToken(anything(), anything())).thenResolve([
            'accessToken',
            'refreshToken'
        ]);
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
            nonce: 'nonce'
        }
        let res: FakeResponse = new FakeResponse();

        res = await authRefresh.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({
            accessToken: 'accessToken',
            refreshToken: 'refreshToken'
        });

        expect(MockFetch.requests[1].reqUrl).to.be.equal('http://127.0.0.1:9998/loginDevice/nonce/update/refresh');
    });

    it('should response 403 if use has been disabled', async () => {
        MockFetch.setJsonResult(200, {
            status: EUserStatus.Blocked,
        });
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
            nonce: 'nonce'
        }
        let res: FakeResponse = new FakeResponse();

        res = await authRefresh.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(403);
        expect(res.resBody).to.be.equal('user disabled');
    });

    it('should response 403 if token refresh fail', async () => {
        MockFetch.setJsonResult(200, {
            status: EUserStatus.Active,
        });
        when(mockTokenManager.refreshingToken(anything(), anything())).thenReject(new ForbiddenException());
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
            nonce: 'nonce'
        }
        let res: FakeResponse = new FakeResponse();

        res = await authRefresh.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(403);
        expect(res.resBody).to.be.equal('Forbidden operation');
    });

    afterEach(() => {
        reset(mockTokenManager);
        MockFetch.clearResult();
    });
});