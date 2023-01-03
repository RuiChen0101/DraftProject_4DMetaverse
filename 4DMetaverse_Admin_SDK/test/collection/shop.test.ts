import 'mocha';
import { expect } from 'chai';
import { FakeResponse } from '../test-tools/fake-response';
import { mockApp, mockAppCtrl } from '../test-tools/mock-app';
import { anything, deepEqual, reset, verify, when } from 'ts-mockito';

import { Shop } from '../../src/collection';
import { EAuthLevel } from '../../src/app';

const shop = new Shop(mockApp);

describe('shop', () => {
    it('should create shop', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '6ce4969d-92be-4765-ba22-20cf11da1896') as any);

        const id = await shop.create({
            seriesId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
            title: 'ShopTitle',
            description: 'ShopDescription'
        });

        expect(id).to.be.equal('6ce4969d-92be-4765-ba22-20cf11da1896');
        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/shop/create',
            method: 'POST',
            body: JSON.stringify({
                seriesId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
                title: 'ShopTitle',
                description: 'ShopDescription'
            }),
            json: true,
            auth: EAuthLevel.Require
        }))).once();
    });

    it('should throw exception if create shop fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(400, '') as any);

        try {
            await shop.create({
                seriesId: '778c084e-e03e-4c7e-a4d6-878ce6fc0ba3',
                title: 'ShopTitle',
                description: 'ShopDescription'
            });
        } catch (e: any) {
            expect(e.message).to.be.equal('Create shop fail: response 400');
        }
    });

    it('should quick create shop', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '6ce4969d-92be-4765-ba22-20cf11da1896') as any);

        const id = await shop.quickCreate({
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

        expect(id).to.be.equal('6ce4969d-92be-4765-ba22-20cf11da1896');
        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/shop/quick-create',
            method: 'POST',
            body: JSON.stringify({
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
            }),
            json: true,
            auth: EAuthLevel.Require
        }))).once();
    });

    it('should throw exception if quick create fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(400, '') as any);

        try {
            await shop.quickCreate({
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
        } catch (e: any) {
            expect(e.message).to.be.equal('Quick create shop fail: response 400');
        }
    });

    it('should create shop image', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '') as any);

        await shop.imageCreate({
            shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
            imageUrl: 'http://image.jpg',
            isCover: true
        });

        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/shopimage/create',
            method: 'POST',
            body: JSON.stringify({
                shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
                imageUrl: 'http://image.jpg',
                isCover: true
            }),
            json: true,
            auth: EAuthLevel.Require
        }))).once();
    });

    it('should throw exception if create shop image fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(400, '') as any);

        try {
            await shop.imageCreate({
                shopId: '6ce4969d-92be-4765-ba22-20cf11da1896',
                imageUrl: 'http://image.jpg',
                isCover: true
            });
        } catch (e: any) {
            expect(e.message).to.be.equal('Create shop image fail: response 400');
        }
    });

    it('should update shop', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '') as any);

        await shop.update('6ce4969d-92be-4765-ba22-20cf11da1896', {
            title: 'ShopTitle',
            description: 'ShopDescription',
            status: 1
        });

        verify(mockAppCtrl.callApi(deepEqual({
            url: `{baseUrl}/shop/update?shopId=6ce4969d-92be-4765-ba22-20cf11da1896`,
            method: 'PUT',
            body: JSON.stringify({
                title: 'ShopTitle',
                description: 'ShopDescription',
                status: 1
            }),
            json: true,
            auth: EAuthLevel.Require
        }))).once();
    });

    it('should throw exception if update shop fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(404, '') as any);

        try {
            await shop.update('6ce4969d-92be-4765-ba22-20cf11da1896', {
                title: 'ShopTitle',
                description: 'ShopDescription',
                status: 1
            });
        } catch (e: any) {
            expect(e.message).to.be.equal('Update shop fail: response 404');
        }
    });

    it('should switch cover image', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '') as any);

        await shop.switchCoverImage(0);

        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/shopimage/switch-cover?imageId=0',
            method: 'PUT',
            auth: EAuthLevel.Require
        }))).once();
    });

    it('should throw exception if switch cover fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(404, '') as any);

        try {
            await shop.switchCoverImage(0);
        } catch (e: any) {
            expect(e.message).to.be.equal('Switch shop cover fail: response 404');
        }
    });

    it('should get shop', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '{"id":"6ce4969d-92be-4765-ba22-20cf11da1896"}') as any);

        const s = await shop.get('6ce4969d-92be-4765-ba22-20cf11da1896');

        expect(s).to.be.deep.equal({
            id: '6ce4969d-92be-4765-ba22-20cf11da1896'
        });
        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/shop/get?shopId=6ce4969d-92be-4765-ba22-20cf11da1896',
            method: 'GET',
            auth: EAuthLevel.Optional
        }))).once();
    });

    it('should throw exception if get shop fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(404, '') as any);

        try {
            await shop.get('6ce4969d-92be-4765-ba22-20cf11da1896');
        } catch (e: any) {
            expect(e.message).to.be.equal('Get shop fail: response 404');
        }
    });

    it('should delete shop', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '') as any);

        await shop.delete('6ce4969d-92be-4765-ba22-20cf11da1896');

        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/shop/delete?shopId=6ce4969d-92be-4765-ba22-20cf11da1896',
            method: 'DELETE',
            auth: EAuthLevel.Require
        }))).once();
    });

    it('should throw exception if delete shop fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(404, '') as any);

        try {
            await shop.delete('6ce4969d-92be-4765-ba22-20cf11da1896');
        } catch (e: any) {
            expect(e.message).to.be.equal('Delete shop fail: response 404');
        }
    });

    it('should delete shop image', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '') as any);

        await shop.deleteImage(0);

        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/shopimage/delete?imageId=0',
            method: 'DELETE',
            auth: EAuthLevel.Require
        }))).once();
    });

    it('should throw exception if delete shop image fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(404, '') as any);

        try {
            await shop.deleteImage(0);
        } catch (e: any) {
            expect(e.message).to.be.equal('Delete shop image fail: response 404');
        }
    });

    afterEach(() => {
        reset(mockAppCtrl);
    });
});