import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import * as MockFetch from '../../share/test-tools/mocks/MockFetch';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import UserCheckEmail from '../../../src/functions/user/UserCheckEmail';

const userCheckEmail = new UserCheckEmail();

describe('UserCheckEmail', () => {
    it('should pass if request with sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            email: 'test%40email.com'
        }

        const res = await userCheckEmail.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should fail if request without sufficient field when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await userCheckEmail.preRequirement(req as any);

        expect(res).to.be.false;
    });

    it('should always return true when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const permission = await userCheckEmail.permission(req as any);

        expect(permission).to.be.true;
    });

    it('should response 204 if email exist', async () => {
        MockFetch.setJsonResult(200, {});

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            email: 'test%40email.com'
        }

        let res: FakeResponse = new FakeResponse();

        res = await userCheckEmail.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(204);

        expect(MockFetch.requests[0].reqUrl).to.be.equal('http://127.0.0.1:9998/user/get/email/test%40email.com');
    });

    it('should response 4xx if email not exist', async () => {
        MockFetch.setJsonResult(404, {});

        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            email: 'test%40email.com'
        }

        let res: FakeResponse = new FakeResponse();

        res = await userCheckEmail.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(404);
    });

    afterEach(() => {
        MockFetch.clearResult();
    });
});