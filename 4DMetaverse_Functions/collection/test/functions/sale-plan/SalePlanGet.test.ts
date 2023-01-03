import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import SalePlanGet from '../../../src/functions/sale-plan/SalePlanGet';

const salePlanGet = new SalePlanGet();

describe('SalePlanGet', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            planId: 'fda2c091-3e6a-4a25-9060-c8e0ad741655'
        }

        const res = await salePlanGet.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await salePlanGet.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should always return true when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const permission = await salePlanGet.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should response shop object if get success', async () => {
        MockFetch.setJsonResult(200, {
            id: 'fda2c091-3e6a-4a25-9060-c8e0ad741655',
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            name: 'SalePlanName',
            price: 100,
            isDefault: false,
            createBy: '1234-5678-90ab-cdef'
        });

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            planId: 'fda2c091-3e6a-4a25-9060-c8e0ad741655'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await salePlanGet.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({
            id: 'fda2c091-3e6a-4a25-9060-c8e0ad741655',
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            name: 'SalePlanName',
            price: 100,
            isDefault: false,
            createBy: '1234-5678-90ab-cdef'
        });

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/salePlan/fda2c091-3e6a-4a25-9060-c8e0ad741655/get');
    });

    it('should response 4xx if get fail', async () => {
        MockFetch.setJsonResult(404, {});

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            planId: 'fda2c091-3e6a-4a25-9060-c8e0ad741655'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await salePlanGet.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});