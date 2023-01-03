import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import ShopUpdate from '../../../src/functions/shop/ShopUpdate';

const shopUpdate = new ShopUpdate();

describe('ShopUpdate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896'
        }

        const res = await shopUpdate.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await shopUpdate.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await shopUpdate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await shopUpdate.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response 204 if update success', async () => {
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            title: 'ShopTitle',
            description: 'ShopDescription'
        });
        req.query = {
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopUpdate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(204);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/shop/6ce4969d-92be-4765-ba22-20cf11da1896/update');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            title: 'ShopTitle',
            description: 'ShopDescription',
            updateBy: "1234-5678-90ab-cdef"
        });
    });

    it('should response 4xx if update fail', async () => {
        MockFetch.setJsonResult(404, {});

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            seriesId: '6ce4969d-92be-4765-ba22-20cf11da1896'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopUpdate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});