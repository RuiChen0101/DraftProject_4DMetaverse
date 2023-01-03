import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import EUserRole from '../../../src/share/enum/EUserRole';
import ShopQuickCreate from '../../../src/functions/shop/ShopQuickCreate';

const shopQuickCreate = new ShopQuickCreate();

describe('ShopQuickCreate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            seriesId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            collectionPoolId: 1,
            shopTitle: 'ShopTitle',
            shopCoverImage: 'http://coverImage.jpg',
            collectionTitle: 'CollectionTitle',
            collectionType: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg',
            salePlanName: 'SalePlanName',
            salePrice: 1000
        });

        const res = await shopQuickCreate.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await shopQuickCreate.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Admin
        }

        const permission = await shopQuickCreate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with other auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            role: EUserRole.Customer
        }

        const permission = await shopQuickCreate.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should response shop id if create success', async () => {
        MockFetch.setJsonResult(200, {});
        MockFetch.setJsonResult(200, {});
        MockFetch.setJsonResult(200, {});
        MockFetch.setJsonResult(200, {});
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            seriesId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            collectionPoolId: 1,
            shopTitle: 'ShopTitle',
            shopCoverImage: 'http://coverImage.jpg',
            collectionTitle: 'CollectionTitle',
            collectionType: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg',
            salePlanName: 'SalePlanName',
            salePrice: 1000
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopQuickCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal('00000000-0000-0000-0000-000000000000');

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9999/shop/create');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            id: '00000000-0000-0000-0000-000000000000',
            seriesId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            title: 'ShopTitle',
            createBy: '1234-5678-90ab-cdef'
        });

        expect(MockFetch.requests[1].reqUrl).to.be.equal('http://127.0.0.1:9999/shopImage/create');
        expect(MockFetch.requests[1].json()).to.be.deep.equal({
            shopId: '00000000-0000-0000-0000-000000000000',
            isCover: true,
            imageUrl: 'http://coverImage.jpg',
            createBy: '1234-5678-90ab-cdef'
        });

        expect(MockFetch.requests[2].reqUrl).to.be.equal('http://127.0.0.1:9999/collection/create');
        expect(MockFetch.requests[2].json()).to.be.deep.equal({
            id: '00000000-0000-0000-0000-000000000000',
            collectionPoolId: 1,
            title: 'CollectionTitle',
            type: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg',
            createBy: '1234-5678-90ab-cdef'
        });

        expect(MockFetch.requests[3].reqUrl).to.be.equal('http://127.0.0.1:9999/salePlan/create');
        expect(MockFetch.requests[3].json()).to.be.deep.equal({
            id: '00000000-0000-0000-0000-000000000000',
            shopId: '00000000-0000-0000-0000-000000000000',
            name: 'SalePlanName',
            price: 1000,
            isDefault: true,
            createBy: '1234-5678-90ab-cdef'
        });

        expect(MockFetch.requests[4].reqUrl).to.be.equal('http://127.0.0.1:9999/salePlan/00000000-0000-0000-0000-000000000000/setCollections');
        expect(MockFetch.requests[4].json()).to.be.deep.equal({
            collectionIds: ['00000000-0000-0000-0000-000000000000']
        });
    });

    it('should response 4xx if create shop fail', async () => {
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            seriesId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            collectionPoolId: 1,
            shopTitle: 'ShopTitle',
            shopCoverImage: 'http://coverImage.jpg',
            collectionTitle: 'CollectionTitle',
            collectionType: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg',
            salePlanName: 'SalePlanName',
            salePrice: 1000
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopQuickCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    it('should response 4xx if create image fail', async () => {
        MockFetch.setJsonResult(200, {});
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            seriesId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            collectionPoolId: 1,
            shopTitle: 'ShopTitle',
            shopCoverImage: 'http://coverImage.jpg',
            collectionTitle: 'CollectionTitle',
            collectionType: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg',
            salePlanName: 'SalePlanName',
            salePrice: 1000
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopQuickCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    it('should response 4xx if create collection fail', async () => {
        MockFetch.setJsonResult(200, {});
        MockFetch.setJsonResult(200, {});
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            seriesId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            collectionPoolId: 1,
            shopTitle: 'ShopTitle',
            shopCoverImage: 'http://coverImage.jpg',
            collectionTitle: 'CollectionTitle',
            collectionType: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg',
            salePlanName: 'SalePlanName',
            salePrice: 1000
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopQuickCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    it('should response 4xx if create sale plan fail', async () => {
        MockFetch.setJsonResult(200, {});
        MockFetch.setJsonResult(200, {});
        MockFetch.setJsonResult(200, {});
        MockFetch.setJsonResult(400, {});

        const req: FakeRequest = new FakeRequest({}, {
            seriesId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            collectionPoolId: 1,
            shopTitle: 'ShopTitle',
            shopCoverImage: 'http://coverImage.jpg',
            collectionTitle: 'CollectionTitle',
            collectionType: 1,
            previewImageUrl: 'http://previewImageUrl.jpg',
            unlockedImageUrl: 'http://unlockedImageUrl.jpg',
            mediaUrl: 'http://mediaUrl.jpg',
            salePlanName: 'SalePlanName',
            salePrice: 1000
        });
        req.loaded.auth = {
            id: '1234-5678-90ab-cdef',
        }
        let res: FakeResponse = new FakeResponse();

        res = await shopQuickCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});