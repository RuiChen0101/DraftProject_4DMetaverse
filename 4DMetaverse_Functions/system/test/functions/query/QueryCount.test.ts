import 'mocha';
import { expect } from 'chai';
import EUserRole from '../../../src/share/enum/EUserRole';
import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';

import QueryCount from '../../../src/functions/query/QueryCount';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

const queryCount = new QueryCount();

describe('QueryCount', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            query: 'user'
        });

        const res = await queryCount.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await queryCount.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if query payload pass query permission check when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            query: 'user'
        });
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await queryCount.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should fail if query payload fail query permission check when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            query: 'user'
        });
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await queryCount.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should query count and return to client', async () => {
        MockFetch.setJsonResult(200, [{ count: 10 }]);

        const req: FakeRequest = new FakeRequest({}, {
            query: 'user'
        });
        let res: FakeResponse = new FakeResponse();

        res = await queryCount.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({ count: 10 });

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9990/query');
        expect(MockFetch.requests[0].text()).to.be.equal('Q09VTlQgdXNlcg==');
    });

    it('should return 4xx if query count fail', async () => {
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            query: 'user'
        });
        let res: FakeResponse = new FakeResponse();

        res = await queryCount.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});