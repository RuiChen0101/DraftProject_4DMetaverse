import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import CollectionCreate from '../../../src/functions/collection/CollectionCreate';

const collectionCreate = new CollectionCreate();

describe('CollectionCreate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            collectionPoolId: 1,
            title: 'CollectionTitle',
            type: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg'
        });

        const res = await collectionCreate.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await collectionCreate.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await collectionCreate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await collectionCreate.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response collection id if create success', async () => {
        MockFetch.setJsonResult(200, {
            id: 'da49faa3-2f21-4815-b4db-f2399d2f19d6'
        });

        const req: FakeRequest = new FakeRequest({}, {
            collectionPoolId: 1,
            title: 'CollectionTitle',
            type: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg'
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await collectionCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.equal('da49faa3-2f21-4815-b4db-f2399d2f19d6');

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/collection/create');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            collectionPoolId: 1,
            title: 'CollectionTitle',
            type: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg',
            createBy: '1234-5678-90ab-cdef'
        });
    });

    it('should response 4xx if create fail', async () => {
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            collectionPoolId: 1,
            title: 'CollectionTitle',
            type: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg'
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await collectionCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});