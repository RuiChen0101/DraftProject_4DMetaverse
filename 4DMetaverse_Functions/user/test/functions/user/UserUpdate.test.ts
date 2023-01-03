import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import UserUpdate from '../../../src/functions/user/UserUpdate';
import EUserRole from '../../../src/share/enum/EUserRole';

const userUpdate = new UserUpdate();

describe('UserUpdate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            userId: '1234-5678-90ab-cdef'
        }

        const res = await userUpdate.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await userUpdate.preRequirement(req as any);

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

        const permission = await userUpdate.permission(req as any);

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

        const permission = await userUpdate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should fail if request with own auth but include protected field when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            loginMethods: 1,
        });
        req.query = {
            userId: '1234-5678-90ab-cdef'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
            role: EUserRole.Customer
        }

        const permission = await userUpdate.permission(req as any);

        expect(permission).to.be.false;
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

        const permission = await userUpdate.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response 204 if update success', async () => {
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            name: 'UserName'
        });
        req.query = {
            userId: '1234-5678-90ab-cdef',
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }

        let res: FakeResponse = new FakeResponse();

        res = await userUpdate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(204);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9998/user/1234-5678-90ab-cdef/update');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            name: 'UserName',
            updateBy: '1234-5678-90ab-cdef'
        });
    });

    it('should response 4xx if user update fail', async () => {
        MockFetch.setJsonResult(404, {});

        const req: FakeRequest = new FakeRequest({}, {
            name: 'UserName'
        });
        req.query = {
            userId: '1234-5678-90ab-cdef',
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }

        let res: FakeResponse = new FakeResponse();

        res = await userUpdate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9998/user/1234-5678-90ab-cdef/update');
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});