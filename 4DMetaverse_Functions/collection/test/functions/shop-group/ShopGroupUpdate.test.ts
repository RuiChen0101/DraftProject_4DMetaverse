import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import ShopGroupUpdate from '../../../src/functions/shop-group/ShopGroupUpdate';

const shopGroupUpdate = new ShopGroupUpdate();

describe('ShopGroupUpdate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            groupId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3'
        }

        const res = await shopGroupUpdate.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await shopGroupUpdate.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await shopGroupUpdate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await shopGroupUpdate.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response 204 if update success', async () => {
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            title: 'SeriesTitle'
        });
        req.query = {
            groupId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopGroupUpdate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(204);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/shopGroup/778c084e-e03e-4c7e-a4d6-878ce6fc0ba3/update');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            title: 'SeriesTitle',
            updateBy: "1234-5678-90ab-cdef",
        });
    });

    it('should response 4xx if update fail', async () => {
        MockFetch.setJsonResult(404, {});

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            groupId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopGroupUpdate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});