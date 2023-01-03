import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../test-tools/fakes/FakeRequest';
import FakeResponse from '../test-tools/fakes/FakeResponse';
import FakeNext, { callNext } from '../test-tools/fakes/FakeNext';

import EAuthType from '../../src/enum/EAuthType';
import EUserRole from '../../src/enum/EUserRole';
import AnonymousAuthMiddleware from '../../src/middlewares/AnonymousAuthMiddleware';

const anonymousAuthMiddleware = new AnonymousAuthMiddleware();

describe('AnonymousAuthMiddleware', () => {
    it('should load anonymous auth and call next', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        let res: FakeResponse = new FakeResponse();

        res = await anonymousAuthMiddleware.middleware(req as any, res as any, FakeNext as any) as any;

        expect(req.loaded.auth).to.be.deep.equal({
            id: 'anonymous',
            name: 'anonymous',
            type: EAuthType.Access,
            allow: ['*'],
            role: EUserRole.Anonymous,
            flag: 0,
            status: 1,
            nonce: 'anonymous',
            exp: 0
        });
        expect(callNext).to.be.true;
    });

    it('should skip load anonymous auth if auth is loaded', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {};
        let res: FakeResponse = new FakeResponse();

        res = await anonymousAuthMiddleware.middleware(req as any, res as any, FakeNext as any) as any;

        expect(req.loaded.auth).to.be.deep.equal({});
        expect(callNext).to.be.true;
    });
});