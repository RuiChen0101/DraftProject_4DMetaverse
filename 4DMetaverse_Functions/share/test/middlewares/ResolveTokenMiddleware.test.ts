import 'mocha';
import { expect } from 'chai';
import { anyString, reset, when } from 'ts-mockito';

import FakeRequest from '../test-tools/fakes/FakeRequest';
import FakeResponse from '../test-tools/fakes/FakeResponse';
import FakeNext, { callNext } from '../test-tools/fakes/FakeNext';

import EAuthType from '../../src/enum/EAuthType';
import injector from '../../src/utility/Injector';
import TokenManager from '../../src/utility/TokenManager';
import ForbiddenException from '../../src/exceptions/ForbiddenException';
import InvalidTokenException from '../../src/exceptions/InvalidTokenException';
import ResolveTokenMiddleware from '../../src/middlewares/ResolveTokenMiddleware';

const mockTokenManager = injector.get<TokenManager>('MockTokenManager');
const resolveTokenMiddleware = new ResolveTokenMiddleware();

describe('ResolveTokenMiddleware', () => {
    it('should skip load auth if token not present', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        let res: FakeResponse = new FakeResponse();

        res = await resolveTokenMiddleware.middleware(req as any, res as any, FakeNext as any) as any;

        expect(req.loaded.auth).to.be.not.exist;
        expect(callNext).to.be.true;
    });

    it('should skip load auth if auth already load', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.loaded.auth = {
            id: "1234-5678-90ab-cdef"
        };
        let res: FakeResponse = new FakeResponse();

        res = await resolveTokenMiddleware.middleware(req as any, res as any, FakeNext as any) as any;

        expect(req.loaded.auth.id).to.be.equal('1234-5678-90ab-cdef');
        expect(callNext).to.be.true;
    });

    it('should skip load auth if token not present', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        let res: FakeResponse = new FakeResponse();

        res = await resolveTokenMiddleware.middleware(req as any, res as any, FakeNext as any) as any;

        expect(req.loaded.auth).to.be.not.exist;
        expect(callNext).to.be.true;
    });

    it('should load auth from header and call next', async () => {
        when(mockTokenManager.resolveToken(anyString(), anyString(), anyString())).thenResolve({
            id: "1234-5678-90ab-cdef",
            name: "name",
            type: EAuthType.Access,
            allow: [
                "*"
            ],
            role: 1,
            flag: 0,
            status: 0,
            nonce: "1234567890abcdefghijklmn",
            exp: 1800
        });
        const req: FakeRequest = new FakeRequest({
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjIsImFsbG93IjpbIioiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.ZGxVYOGyHUzW4TippiKIIt3_jP2OJrxUcElhHQ8WTBY"
        }, {});
        let res: FakeResponse = new FakeResponse();

        res = await resolveTokenMiddleware.middleware(req as any, res as any, FakeNext as any) as any;

        expect(req.loaded.auth.id).to.be.equal('1234-5678-90ab-cdef');
        expect(callNext).to.be.true;
    });

    it('should load auth from query and call next', async () => {
        when(mockTokenManager.resolveToken(anyString(), anyString(), anyString())).thenResolve({
            id: "1234-5678-90ab-cdef",
            name: "name",
            type: EAuthType.Access,
            allow: [
                "*"
            ],
            role: 1,
            flag: 0,
            status: 0,
            nonce: "1234567890abcdefghijklmn",
            exp: 1800
        });
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjIsImFsbG93IjpbIioiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.ZGxVYOGyHUzW4TippiKIIt3_jP2OJrxUcElhHQ8WTBY",
        }
        let res: FakeResponse = new FakeResponse();

        res = await resolveTokenMiddleware.middleware(req as any, res as any, FakeNext as any) as any;

        expect(req.loaded.auth.id).to.be.equal('1234-5678-90ab-cdef');
        expect(callNext).to.be.true;
    });

    it('should skip loading auth if token resolve fail', async () => {
        when(mockTokenManager.resolveToken(anyString(), anyString(), anyString())).thenThrow(new InvalidTokenException());
        const req: FakeRequest = new FakeRequest({
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjIsImFsbG93IjpbIioiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.ZGxVYOGyHUzW4TippiKIIt3_jP2OJrxUcElhHQ8WTBY"
        }, {});
        let res: FakeResponse = new FakeResponse();

        res = await resolveTokenMiddleware.middleware(req as any, res as any, FakeNext as any) as any;

        expect(req.loaded.auth).to.be.not.exist;
        expect(callNext).to.be.true;
    });

    it('should response forbidden if token use on not allowed api', async () => {
        when(mockTokenManager.resolveToken(anyString(), anyString(), anyString())).thenThrow(new ForbiddenException());
        const req: FakeRequest = new FakeRequest({
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQtNTY3OC05MGFiLWNkZWYiLCJuYW1lIjoibmFtZSIsInR5cGUiOjIsImFsbG93IjpbIioiXSwicm9sZSI6MSwiZmxhZyI6MCwic3RhdHVzIjowLCJub25jZSI6IjEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbiIsImV4cCI6MTgwMH0.ZGxVYOGyHUzW4TippiKIIt3_jP2OJrxUcElhHQ8WTBY"
        }, {});
        let res: FakeResponse = new FakeResponse();

        res = await resolveTokenMiddleware.middleware(req as any, res as any, FakeNext as any) as any;

        expect(req.loaded.auth).to.be.not.exist;
        expect(res.statusCode).to.be.equal(403);
    });

    afterEach(() => {
        reset(mockTokenManager);
    });
});