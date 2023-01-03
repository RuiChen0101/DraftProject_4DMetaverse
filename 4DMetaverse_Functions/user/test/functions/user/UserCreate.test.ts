import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import UserCreate from '../../../src/functions/user/UserCreate';

const userCreate = new UserCreate();

describe('UserCreate', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            email: 'test@email.com',
            name: 'name',
            password: 'password',
            role: 90
        });
        req.query = {
            method: 'email'
        }

        const res = await userCreate.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await userCreate.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should pass if request without auth and role when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const permission = await userCreate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should pass if request with admin auth when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            role: 1
        });
        req.loaded.auth = {
            role: 90
        }

        const permission = await userCreate.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should fail if request without admin auth but has role when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {
            role: 1
        });

        const permission = await userCreate.permission(req as any);

        expect(permission).to.be.false;
    });

    it('should create user with email and response user id', async () => {
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            email: 'test@email.com',
            name: 'name',
            password: 'password',
        });
        req.query = {
            method: 'email'
        }
        let res: FakeResponse = new FakeResponse();

        res = await userCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal('1234-5678-90ab-cdef');

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9998/user/create');
        expect(MockFetch.requests[0].json()).to.be.deep.equal({
            id: "1234-5678-90ab-cdef",
            name: "name",
            email: "test@email.com",
            password: "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=",
            loginMethods: 1,
            flag: 0,
            role: 1,
            status: 1,
            createBy: "1234-5678-90ab-cdef",
        });
    });

    it('should response 400 if create with email but password not present', async () => {
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            email: 'test@email.com',
            name: 'name',
        });
        req.query = {
            method: 'email'
        }
        let res: FakeResponse = new FakeResponse();

        res = await userCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    it('should response 409 if create fail', async () => {
        MockFetch.setJsonResult(409, {});

        const req: FakeRequest = new FakeRequest({}, {
            email: 'test@email.com',
            name: 'name',
            password: 'password',
        });
        req.query = {
            method: 'email'
        }
        let res: FakeResponse = new FakeResponse();

        res = await userCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(409);
    });

    it('should response 501 if create with web3', async () => {
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            email: 'test@email.com',
            name: 'name',
        });
        req.query = {
            method: 'web3'
        }
        let res: FakeResponse = new FakeResponse();

        res = await userCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(501);
    });

    it('should response 400 if create with undefined method', async () => {
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {
            email: 'test@email.com',
            name: 'name',
        });
        req.query = {
            method: 'undefined'
        }
        let res: FakeResponse = new FakeResponse();

        res = await userCreate.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(400);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});