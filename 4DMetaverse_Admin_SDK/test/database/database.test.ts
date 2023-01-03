import 'mocha';
import { expect } from 'chai';
import { FakeResponse } from '../test-tools/fake-response';
import { mockApp, mockAppCtrl } from '../test-tools/mock-app';
import { anything, deepEqual, reset, verify, when } from 'ts-mockito';

import { EAuthLevel } from '../../src/app';
import { Database } from '../../src/database';

const database = new Database(mockApp);

describe('database', () => {
    it('should preform data query', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '[]') as any);

        const res = await database
            .query('unlocked_collection')
            .with('user')
            .link('user.id', 'unlocked_collection.user_id')
            .where('user.phone', '=', '0912345678')
            .orderBy('unlocked_collection.create_at', 'desc')
            .limit(0, 10)
            .get();

        expect(res).to.be.deep.equal([]);

        verify(mockAppCtrl.callApi(deepEqual({
            url: `{baseUrl}/query`,
            method: 'POST',
            body: '{"query":"unlocked_collection","with":["user"],"link":[{"left":"user.id","right":"unlocked_collection.user_id"}],"where":[{"left":"user.phone","op":"=","right":"0912345678"}],"orderBy":[{"column":"unlocked_collection.create_at","direction":"desc"}],"limit":[0,10]}',
            json: true,
            auth: EAuthLevel.Optional,
        }))).once();
    });

    it('should throw exception of data query fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(400, '') as any);

        try {
            await database
                .query('user')
                .get();
        } catch (e: any) {
            expect(e.message).to.be.equal('Query fail: response 400');
        }
    });

    it('should preform count query', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '{"count":0}') as any);

        const res = await database
            .query('unlocked_collection')
            .with('user')
            .link('user.id', 'unlocked_collection.user_id')
            .where('user.phone', '=', '0912345678')
            .orderBy('unlocked_collection.create_at', 'desc')
            .limit(0, 10)
            .count();

        expect(res).to.be.equal(0);

        verify(mockAppCtrl.callApi(deepEqual({
            url: `{baseUrl}/query/count`,
            method: 'POST',
            body: '{"query":"unlocked_collection","with":["user"],"link":[{"left":"user.id","right":"unlocked_collection.user_id"}],"where":[{"left":"user.phone","op":"=","right":"0912345678"}],"orderBy":[{"column":"unlocked_collection.create_at","direction":"desc"}],"limit":[0,10]}',
            json: true,
            auth: EAuthLevel.Optional,
        }))).once();
    });

    it('should throw exception of count query fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(400, '') as any);

        try {
            await database
                .query('user')
                .count();
        } catch (e: any) {
            expect(e.message).to.be.equal('Query count fail: response 400');
        }
    });

    it('should preform sum query', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '{"sum":0}') as any);

        const res = await database
            .query('unlocked_collection')
            .with('user')
            .link('user.id', 'unlocked_collection.user_id')
            .where('user.phone', '=', '0912345678')
            .orderBy('unlocked_collection.create_at', 'desc')
            .limit(0, 10)
            .sum();

        expect(res).to.be.equal(0);

        verify(mockAppCtrl.callApi(deepEqual({
            url: `{baseUrl}/query/sum`,
            method: 'POST',
            body: '{"query":"unlocked_collection","with":["user"],"link":[{"left":"user.id","right":"unlocked_collection.user_id"}],"where":[{"left":"user.phone","op":"=","right":"0912345678"}],"orderBy":[{"column":"unlocked_collection.create_at","direction":"desc"}],"limit":[0,10]}',
            json: true,
            auth: EAuthLevel.Optional,
        }))).once();
    });

    it('should throw exception of sum query fail', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(400, '') as any);

        try {
            await database
                .query('user')
                .sum();
        } catch (e: any) {
            expect(e.message).to.be.equal('Query sum fail: response 400');
        }
    });

    afterEach(() => {
        reset(mockAppCtrl)
    });
});