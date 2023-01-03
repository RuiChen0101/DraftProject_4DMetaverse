import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import SalePlanCreate from '../../../src/functions/sale-plan/SalePlanCreate';

const salePlanCreate = new SalePlanCreate();

describe('SalePlanCreate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            name: 'SalePlanName',
            price: 100,
        });

        const res = await salePlanCreate.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await salePlanCreate.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await salePlanCreate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await salePlanCreate.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should create and switch default if isDefault is true', async () => {
        MockFetch.setJsonResult(200, {
            id: 'fda2c091-3e6a-4a25-9060-c8e0ad741655'
        });
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            name: 'SalePlanName',
            price: 100,
            isDefault: true,
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await salePlanCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.equal('fda2c091-3e6a-4a25-9060-c8e0ad741655');

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/salePlan/create');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            name: 'SalePlanName',
            price: 100,
            isDefault: false,
            createBy: '1234-5678-90ab-cdef'
        });

        expect(MockFetch.requests[1].reqUrl).to.be.equal('http://127.0.0.1:9999/salePlan/fda2c091-3e6a-4a25-9060-c8e0ad741655/switchDefault');
    });

    it('should create and skip switch default if isDefault is false or not present', async () => {
        MockFetch.setJsonResult(200, {
            id: 'fda2c091-3e6a-4a25-9060-c8e0ad741655'
        });

        const req: FakeRequest = new FakeRequest({}, {
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            name: 'SalePlanName',
            price: 100,
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await salePlanCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.equal('fda2c091-3e6a-4a25-9060-c8e0ad741655');

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/salePlan/create');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            name: 'SalePlanName',
            price: 100,
            isDefault: false,
            createBy: '1234-5678-90ab-cdef'
        });
    });

    it('should response 4xx if create fail', async () => {
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            name: 'SalePlanName',
            price: 100,
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await salePlanCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});