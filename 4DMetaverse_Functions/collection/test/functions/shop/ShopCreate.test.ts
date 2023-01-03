import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import ShopCreate from '../../../src/functions/shop/ShopCreate';

const shopCreate = new ShopCreate();

describe('ShopCreate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            groupId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            title: 'ShopTitle'
        });

        const res = await shopCreate.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await shopCreate.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await shopCreate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await shopCreate.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response shop id if create success', async () => {
        MockFetch.setJsonResult(200, {
            id: '6ce4969d-92be-4765-ba22-20cf11da1896'
        });

        const req: FakeRequest = new FakeRequest({}, {
            groupId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            title: 'ShopTitle',
            description: 'ShopDescription'
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal('6ce4969d-92be-4765-ba22-20cf11da1896');

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/shop/create');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            groupId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            title: 'ShopTitle',
            description: 'ShopDescription',
            createBy: "1234-5678-90ab-cdef"
        });
    });

    it('should response 4xx if create fail', async () => {
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            groupId: 'SeriesTitle',
            title: 'ShopTitle',
            description: 'ShopDescription'
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});