import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import ShopImageCreate from '../../../src/functions/shop-image/ShopImageCreate';

const shopImageCreate = new ShopImageCreate();

describe('ShopImageCreate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            imageUrl: 'http://image.jpg'
        });

        const res = await shopImageCreate.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await shopImageCreate.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await shopImageCreate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await shopImageCreate.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should create and switch cover if isCover is true', async () => {
        MockFetch.setJsonResult(200, {
            id: 1
        });
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            imageUrl: 'http://image.jpg',
            isCover: true
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopImageCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(204);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/shopImage/create');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            imageUrl: 'http://image.jpg',
            isCover: false,
            createBy: "1234-5678-90ab-cdef"
        });

        expect(MockFetch.requests[1].reqUrl).to.be.equal('http://127.0.0.1:9999/shopImage/1/switchCover');
    });

    it('should create and skip switch cover if isCover is false or not present', async () => {
        MockFetch.setJsonResult(200, {
            id: 1
        });

        const req: FakeRequest = new FakeRequest({}, {
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            imageUrl: 'http://image.jpg'
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopImageCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(204);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/shopImage/create');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            imageUrl: 'http://image.jpg',
            isCover: false,
            createBy: "1234-5678-90ab-cdef"
        });
    });

    it('should response 4xx if create fail', async () => {
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            imageUrl: 'http://image.jpg'
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopImageCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});