import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import CollectionDelete from '../../../src/functions/collection/CollectionDelete';

const collectionDelete = new CollectionDelete();

describe('CollectionDelete', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            collectionId: 'da49faa3-2f21-4815-b4db-f2399d2f19d6'
        }

        const res = await collectionDelete.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await collectionDelete.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await collectionDelete.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await collectionDelete.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response 204 if delete success', async () => {
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            collectionId: 'da49faa3-2f21-4815-b4db-f2399d2f19d6'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await collectionDelete.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(204);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/collection/da49faa3-2f21-4815-b4db-f2399d2f19d6/delete');
    });

    it('should response 4xx if delete fail', async () => {
        MockFetch.setJsonResult(404, {});

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            collectionId: 'da49faa3-2f21-4815-b4db-f2399d2f19d6'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await collectionDelete.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});