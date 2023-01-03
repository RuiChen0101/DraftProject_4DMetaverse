import 'mocha';
import { expect } from 'chai';
import { reset, verify, deepEqual } from 'ts-mockito';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import injector from '../../../src/share/utility/Injector';
import AuthLogout from '../../../src/functions/auth/AuthLogout';
import TokenManager from '../../../src/share/utility/TokenManager';

const mockTokenManager = injector.get<TokenManager>('MockTokenManager');
const authLogout = new AuthLogout();

describe('AuthLogout', () => {
    it('should always pass if when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await authLogout.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should always return true when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const permission = await authLogout.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should delete token and login device and response 204', async () => {
        MockFetch.setJsonResult(200, {});
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            nonce: 'nonce'
        }
        let res: FakeResponse = new FakeResponse();

        res = await authLogout.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(204);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9998/loginDevice/nonce/delete');
        verify(mockTokenManager.deleteToken(deepEqual({ nonce: 'nonce' } as any))).once();
    });

    afterEach(() => {
        reset(mockTokenManager);
        MockFetch.clearResult()
    })
});