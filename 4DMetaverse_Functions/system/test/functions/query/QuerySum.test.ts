import 'mocha';
import { expect } from 'chai';
import EUserRole from '../../../src/share/enum/EUserRole';
import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';

import QuerySum from '../../../src/functions/query/QuerySum';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

const querySum = new QuerySum();

describe('QuerySum', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            query: 'sale_plan.price'
        });

        const res = await querySum.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await querySum.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if query payload pass query permission check when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            query: 'sale_plan.price'
        });
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await querySum.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should fail if query payload fail query permission check when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            query: 'sale_plan.price'
        });
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await querySum.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should query sum and return to client', async () => {
        MockFetch.setJsonResult(200, [{ sum: 1000 }]);

        const req: FakeRequest = new FakeRequest({}, {
            query: 'sale_plan.price'
        });
        let res: FakeResponse = new FakeResponse();

        res = await querySum.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({ sum: 1000 });

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9990/query');
        expect(MockFetch.requests[0].text()).to.be.equal('U1VNIHNhbGVfcGxhbi5wcmljZQ==');
    });

    it('should return 4xx if query sum fail', async () => {
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            query: 'sale_plan.price'
        });
        let res: FakeResponse = new FakeResponse();

        res = await querySum.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});