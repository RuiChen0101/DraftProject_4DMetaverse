import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import ShopGroupCreate from '../../../src/functions/shop-group/ShopGroupCreate';

const shopGroupCreate = new ShopGroupCreate();

describe('ShopGroupCreate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            title: 'ShopGroupTitle',
        });

        const res = await shopGroupCreate.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await shopGroupCreate.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await shopGroupCreate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await shopGroupCreate.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response shop group id if create success', async () => {
        MockFetch.setJsonResult(200, {
            id: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3'
        });

        const req: FakeRequest = new FakeRequest({}, {
            title: 'ShopGroupTitle',
            tags: [],
            coverImageUrl: 'http://image.jpg',
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopGroupCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal('778c084e-e03e-4c7e-a4d6-878ce6fc0ba3');

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/shopGroup/create');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            title: 'ShopGroupTitle',
            tags: [],
            coverImageUrl: 'http://image.jpg',
            createBy: "1234-5678-90ab-cdef",
        });
    });

    it('should response 4xx if create fail', async () => {
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            title: 'ShopGroupTitle',
            tags: [],
            coverImageUrl: 'http://image.jpg',
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopGroupCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});