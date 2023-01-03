import 'mocha';
import { expect } from 'chai';
import { reset, when } from 'ts-mockito';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserFlag from '../../../src/share/enum/EUserFlag';
import injector from '../../../src/share/utility/Injector';
import VerifySmsService from '../../../src/service/VerifySmsService';
import UserEnable2FA from '../../../src/functions/user/UserEnable2FA';

const mockVerifySmsService = injector.get<VerifySmsService>('MockVerifySmsService');

const userEnable2FA = new UserEnable2FA();

describe('UserEnable2FA', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            phone: '0912345678',
            verifyCode: '123456'
        });

        const res = await userEnable2FA.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await userEnable2FA.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should always return true when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const permission = await userEnable2FA.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should set phone and enable 2fa if sms verify pass', async () => {
        MockFetch.setJsonResult(200, {});
        when(mockVerifySmsService.verify('0912345678', '123456')).thenResolve(true);

        const req: FakeRequest = new FakeRequest({}, {
            phone: '0912345678',
            verifyCode: '123456'
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }

        let res: FakeResponse = new FakeResponse();

        res = await userEnable2FA.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(204);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9998/user/1234-5678-90ab-cdef/update');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            phone: '0912345678',
            flag: EUserFlag.Enable2FA,
            updateBy: '1234-5678-90ab-cdef'
        });
    });

    it('should response 403 if sms verify fail', async () => {
        when(mockVerifySmsService.verify('0912345678', '123456')).thenResolve(false);

        const req: FakeRequest = new FakeRequest({}, {
            phone: '0912345678',
            verifyCode: '123456'
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await userEnable2FA.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(403);
    });

    it('should response 4xx if user update fail', async () => {
        MockFetch.setJsonResult(404, {});
        when(mockVerifySmsService.verify('0912345678', '123456')).thenResolve(true);

        const req: FakeRequest = new FakeRequest({}, {
            phone: '0912345678',
            verifyCode: '123456'
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await userEnable2FA.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9998/user/1234-5678-90ab-cdef/update');
    });

    afterEach(() => {
        reset(mockVerifySmsService);
        MockFetch.clearResult();
    });
});