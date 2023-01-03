import 'mocha';
import { expect } from 'chai';
import EUserRole from '../../../src/share/enum/EUserRole';
import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';

import Query from '../../../src/functions/query/Query';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

const query = new Query();

describe('Query', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            query: 'user'
        });

        const res = await query.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await query.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if query payload pass query permission check when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            query: 'user'
        });
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await query.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should fail if query payload fail query permission check when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            query: 'user'
        });
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await query.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should query data and return to client', async () => {
        MockFetch.setJsonResult(200, [{ id: '1234-5678-90ab-cdef' }]);

        const req: FakeRequest = new FakeRequest({}, {
            query: 'user'
        });
        let res: FakeResponse = new FakeResponse();

        res = await query.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({
            queryCount: 1,
            totalCount: 1,
            data: [{ id: '1234-5678-90ab-cdef' }]
        });

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9990/query');
        expect(MockFetch.requests[0].text()).to.be.equal('UVVFUlkgdXNlcg==');
    });

    it('should return 4xx if query data fail', async () => {
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            query: 'user'
        });
        let res: FakeResponse = new FakeResponse();

        res = await query.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    it('should query data and count total row if query with limitation and return to client', async () => {
        MockFetch.setJsonResult(200, [{ id: '1234-5678-90ab-cdef' }]);
        MockFetch.setJsonResult(200, [{ count: 10 }]);

        const req: FakeRequest = new FakeRequest({}, {
            query: 'user',
            limit: [0, 1]
        });
        let res: FakeResponse = new FakeResponse();

        res = await query.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({
            queryCount: 1,
            totalCount: 10,
            data: [{ id: '1234-5678-90ab-cdef' }]
        });

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9990/query');
        expect(MockFetch.requests[0].text()).to.be.equal('UVVFUlkgdXNlciBMSU1JVCAwLCAx');

        expect(MockFetch.requests[1].reqUrl).to.be.equal('http://127.0.0.1:9990/query');
        expect(MockFetch.requests[1].text()).to.be.equal('Q09VTlQgdXNlcg==');
    });

    it('should return 4xx if query data with limitation fail', async () => {
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            query: 'user',
            limit: [0, 1]
        });
        let res: FakeResponse = new FakeResponse();

        res = await query.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});