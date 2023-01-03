import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import CollectionGet from '../../../src/functions/collection/CollectionGet';

const collectionGet = new CollectionGet();

describe('CollectionGet', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            collectionId: 'da49faa3-2f21-4815-b4db-f2399d2f19d6'
        }

        const res = await collectionGet.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await collectionGet.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await collectionGet.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await collectionGet.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response shop object if get success', async () => {
        MockFetch.setJsonResult(200, {
            id: 'da49faa3-2f21-4815-b4db-f2399d2f19d6',
            collectionPoolId: 1,
            title: 'CollectionTitle',
            type: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg'
        });

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            collectionId: 'da49faa3-2f21-4815-b4db-f2399d2f19d6'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await collectionGet.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({
            id: 'da49faa3-2f21-4815-b4db-f2399d2f19d6',
            collectionPoolId: 1,
            title: 'CollectionTitle',
            type: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg'
        });

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/collection/da49faa3-2f21-4815-b4db-f2399d2f19d6/get');
    });

    it('should response 4xx if get fail', async () => {
        MockFetch.setJsonResult(404, {});

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            collectionId: 'da49faa3-2f21-4815-b4db-f2399d2f19d6'
        }
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef'
        }
        let res: FakeResponse = new FakeResponse();

        res = await collectionGet.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});