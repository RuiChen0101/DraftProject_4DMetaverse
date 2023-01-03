import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import SalePlanUpdate from '../../../src/functions/sale-plan/SalePlanUpdate';

const salePlan = new SalePlanUpdate();

describe('SalePlanUpdate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            planId: 'fda2c091-3e6a-4a25-9060-c8e0ad741655'
        }

        const res = await salePlan.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await salePlan.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await salePlan.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await salePlan.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response 204 if update success', async () => {
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            name: 'SalePlanName',
            price: 1000,
            status: 1,
        });
        req.query = {
            planId: 'fda2c091-3e6a-4a25-9060-c8e0ad741655'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await salePlan.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(204);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/salePlan/fda2c091-3e6a-4a25-9060-c8e0ad741655/update');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            name: 'SalePlanName',
            price: 1000,
            status: 1,
            updateBy: "1234-5678-90ab-cdef",
        });
    });

    it('should response 4xx if update fail', async () => {
        MockFetch.setJsonResult(404, {});

        const req: FakeRequest = new FakeRequest({}, {
            name: 'SalePlanName',
            price: 1000,
            status: 1,
        });
        req.query = {
            planId: 'fda2c091-3e6a-4a25-9060-c8e0ad741655'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await salePlan.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});