import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import UserGet from '../../../src/functions/user/UserGet';
import EUserRole from '../../../src/share/enum/EUserRole';

const userGet = new UserGet();

describe('UserGet', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            userId: '1234-5678-90ab-cdef'
        }

        const res = await userGet.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await userGet.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with own auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            userId: '1234-5678-90ab-cdef'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
            role: EUserRole.Customer
        }

        const permission = await userGet.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            userId: '1234-5678-90ab-cdef'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdeg',
            role: EUserRole.Admin
        }

        const permission = await userGet.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should fail if request with incorrect auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            userId: '1234-5678-90ab-cdef'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdeg',
            role: EUserRole.Customer
        }

        const permission = await userGet.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response user data', async () => {
        MockFetch.setJsonResult(200, {
            id: '1234-5678-90ab-cdef'
        });

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            userId: '1234-5678-90ab-cdef',
        }

        let res: FakeResponse = new FakeResponse();

        res = await userGet.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({
            id: '1234-5678-90ab-cdef'
        })

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9998/user/1234-5678-90ab-cdef/get');
    });

    it('should response 4xx if user get fail', async () => {
        MockFetch.setJsonResult(404, {});

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            userId: '1234-5678-90ab-cdef',
        }

        let res: FakeResponse = new FakeResponse();

        res = await userGet.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9998/user/1234-5678-90ab-cdef/get');
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});