import 'mocha';
import { expect } from 'chai';
import { FakeResponse } from '../test-tools/fake-response';
import { mockApp, mockAppCtrl } from '../test-tools/mock-app';
import { when, anything, verify, deepEqual, reset } from 'ts-mockito';

import { EAuthLevel } from '../../src/app';
import { Storage } from '../../src/storage';

const storage = new Storage(mockApp);

describe('storage', () => {
    it('should list by path prefix', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '{"dirs":[],"files":[]}') as any);

        const result = await storage.listDirByPath('root/dir1');

        expect(result).to.be.deep.equal({
            dirs: [],
            files: []
        });
        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/directory/list/by-path?path=root%2Fdir1',
            method: 'GET',
            auth: EAuthLevel.Require
        }))).once();
    });

    it('should list by path prefix with empty path', async () => {
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '{"dirs":[],"files":[]}') as any);

        const result = await storage.listDirByPath('');

        expect(result).to.be.deep.equal({
            dirs: [],
            files: []
        });
        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/directory/list/by-path?path=',
            method: 'GET',
            auth: EAuthLevel.Require
        }))).once();
    });

    afterEach(() => {
        reset(mockAppCtrl);
    });
});