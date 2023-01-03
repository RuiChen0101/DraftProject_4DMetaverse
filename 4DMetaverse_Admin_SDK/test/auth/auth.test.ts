import 'mocha';
import { expect } from 'chai';
import { FakeResponse } from '../test-tools/fake-response';
import { mockAppCtrl, mockApp } from '../test-tools/mock-app';
import { anything, deepEqual, reset, verify, when } from 'ts-mockito';

import { Auth } from '../../src/auth';
import { EAuthLevel } from '../../src/app';

describe('auth', () => {
    it('should initialize and refresh exist token', async () => {
        const auth = new Auth(mockApp);
        localStorage.setItem('refresh_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MywiZXhwIjoxNjYxNDA0MTcwfQ.JsPIkz993rOXB86mhCbN2iF2ZrYHt8ETTQgdZ76ZAu8');
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MywiZXhwIjoxNjYxNDA0MTcwfQ.JsPIkz993rOXB86mhCbN2iF2ZrYHt8ETTQgdZ76ZAu8","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MiwiZXhwIjoxNjYxNDA0MTcwfQ.j18xoDBz5r5IRdjcaaaFebmmdv205XrN5shwEc8nUIM"}') as any);

        await auth.initializeAuth();

        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/auth/refresh',
            method: 'GET',
            header: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MywiZXhwIjoxNjYxNDA0MTcwfQ.JsPIkz993rOXB86mhCbN2iF2ZrYHt8ETTQgdZ76ZAu8' }
        }))).once();

        expect(auth.accessToken).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MiwiZXhwIjoxNjYxNDA0MTcwfQ.j18xoDBz5r5IRdjcaaaFebmmdv205XrN5shwEc8nUIM');
        expect(auth.accessTokenData).to.be.deep.equal({
            exp: 1661404170,
            id: "5xvx-fgh9-ihjo-5g4c",
            name: "test-user",
            type: 2
        });
        expect(localStorage.getItem('refresh_token')).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MywiZXhwIjoxNjYxNDA0MTcwfQ.JsPIkz993rOXB86mhCbN2iF2ZrYHt8ETTQgdZ76ZAu8');
    });

    it('should skip refresh when initialize without refresh token', async () => {
        const auth = new Auth(mockApp);

        await auth.initializeAuth();

        verify(mockAppCtrl.callApi(anything())).never();

        expect(auth.accessToken).to.not.exist;
    });

    it('should set access and refresh token when login with email', async () => {
        const auth = new Auth(mockApp);
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MywiZXhwIjoxNjYxNDA0MTcwfQ.JsPIkz993rOXB86mhCbN2iF2ZrYHt8ETTQgdZ76ZAu8","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MiwiZXhwIjoxNjYxNDA0MTcwfQ.j18xoDBz5r5IRdjcaaaFebmmdv205XrN5shwEc8nUIM"}') as any);

        const res = await auth.loginWithEmail('test@email.com', 'testpw');

        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/auth/login',
            method: 'GET',
            header: { Authorization: 'Basic dGVzdEBlbWFpbC5jb206dGVzdHB3' }
        }))).once();

        expect(res).to.not.exist;

        expect(auth.accessToken).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MiwiZXhwIjoxNjYxNDA0MTcwfQ.j18xoDBz5r5IRdjcaaaFebmmdv205XrN5shwEc8nUIM');
        expect(localStorage.getItem('refresh_token')).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MywiZXhwIjoxNjYxNDA0MTcwfQ.JsPIkz993rOXB86mhCbN2iF2ZrYHt8ETTQgdZ76ZAu8');
    });

    it('should get 2fa data if login account enable 2fa verify', async () => {
        const auth = new Auth(mockApp);
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '{"phone":"0912345678","tempToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MSwiZXhwIjoxNjYxNDA0MTcwfQ.n99kUcU512iQR2DrxV-WSPhH-IjG_6g7LOx7nQwYhQY"}') as any);

        const res = await auth.loginWithEmail('test@email.com', 'testpw');

        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/auth/login',
            method: 'GET',
            header: { Authorization: 'Basic dGVzdEBlbWFpbC5jb206dGVzdHB3' }
        }))).once();

        expect(res).to.be.deep.equal({
            phone: '0912345678',
            tempToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MSwiZXhwIjoxNjYxNDA0MTcwfQ.n99kUcU512iQR2DrxV-WSPhH-IjG_6g7LOx7nQwYhQY'
        });

        expect(auth.accessToken).to.not.exist;
        expect(localStorage.getItem('refresh_token')).to.not.exist;
    });

    it('should throw exception if login fail', async () => {
        const auth = new Auth(mockApp);
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(403, '') as any);

        try {
            await auth.loginWithEmail('test@email.com', 'testpw');
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('Login with email fail: response 403');
        }
    });

    it('should call send sms api', async () => {
        const auth = new Auth(mockApp);
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '') as any);

        await auth.sendVerifySms('0912345678', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MSwiZXhwIjoxNjYxNDA0MTcwfQ.n99kUcU512iQR2DrxV-WSPhH-IjG_6g7LOx7nQwYhQY');

        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/verifysms/send?phone=0912345678',
            method: 'POST',
            header: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MSwiZXhwIjoxNjYxNDA0MTcwfQ.n99kUcU512iQR2DrxV-WSPhH-IjG_6g7LOx7nQwYhQY' }
        }))).once();
    });

    it('should throw exception if send sms api fail', async () => {
        const auth = new Auth(mockApp);
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(400, '') as any);

        try {
            await auth.sendVerifySms('0912345678', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MSwiZXhwIjoxNjYxNDA0MTcwfQ.n99kUcU512iQR2DrxV-WSPhH-IjG_6g7LOx7nQwYhQY');
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('Verify sms send fail: response 400');
        }
    });

    it('should set access and refresh token if 2fa verify pass', async () => {
        const auth = new Auth(mockApp);
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(200, '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MywiZXhwIjoxNjYxNDA0MTcwfQ.JsPIkz993rOXB86mhCbN2iF2ZrYHt8ETTQgdZ76ZAu8","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MiwiZXhwIjoxNjYxNDA0MTcwfQ.j18xoDBz5r5IRdjcaaaFebmmdv205XrN5shwEc8nUIM"}') as any);

        await auth.verify2FA('123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MSwiZXhwIjoxNjYxNDA0MTcwfQ.n99kUcU512iQR2DrxV-WSPhH-IjG_6g7LOx7nQwYhQY');

        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/auth/2fa_verify?verifyCode=123456',
            method: 'GET',
            header: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MSwiZXhwIjoxNjYxNDA0MTcwfQ.n99kUcU512iQR2DrxV-WSPhH-IjG_6g7LOx7nQwYhQY' }
        }))).once();

        expect(auth.accessToken).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MiwiZXhwIjoxNjYxNDA0MTcwfQ.j18xoDBz5r5IRdjcaaaFebmmdv205XrN5shwEc8nUIM');
        expect(localStorage.getItem('refresh_token')).to.be.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MywiZXhwIjoxNjYxNDA0MTcwfQ.JsPIkz993rOXB86mhCbN2iF2ZrYHt8ETTQgdZ76ZAu8');
    });

    it('should throw exception if 2fa verify fail', async () => {
        const auth = new Auth(mockApp);
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(403, '') as any);

        try {
            await auth.verify2FA('123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MSwiZXhwIjoxNjYxNDA0MTcwfQ.n99kUcU512iQR2DrxV-WSPhH-IjG_6g7LOx7nQwYhQY');
            expect.fail();
        } catch (e: any) {
            expect(e.message).to.be.equal('2FA verify fail: response 403');
        }
    });

    it('should remove all token when logout', async () => {
        const auth = new Auth(mockApp);
        localStorage.setItem('refresh_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjV4dngtZmdoOS1paGpvLTVnNGMiLCJuYW1lIjoidGVzdC11c2VyIiwidHlwZSI6MywiZXhwIjoxNjYxNDA0MTcwfQ.JsPIkz993rOXB86mhCbN2iF2ZrYHt8ETTQgdZ76ZAu8');
        when(mockAppCtrl.callApi(anything())).thenResolve(new FakeResponse(204, '') as any);

        await auth.logout();

        verify(mockAppCtrl.callApi(deepEqual({
            url: '{baseUrl}/auth/logout',
            method: 'GET',
            auth: EAuthLevel.Require
        }))).once();

        verify(mockAppCtrl.authLost()).once();

        expect(auth.accessToken).to.not.exist;
        expect(localStorage.getItem('refresh_token')).to.not.exist;
    });

    afterEach(() => {
        reset(mockAppCtrl);
        localStorage.clear();
    });
})