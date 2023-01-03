import 'mocha';
import { expect } from 'chai';

import FakeRequest from '../../share/test-tools/fakes/FakeRequest';
import FakeResponse from '../../share/test-tools/fakes/FakeResponse';

import Config from '../../../src/share/config/Config';
import SystemStatus from '../../../src/functions/system/SystemStatus';

const systemStatus = new SystemStatus();

describe('SystemStatus', () => {
    it('should always pass when checking pre-requirement', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await systemStatus.preRequirement(req as any);

        expect(res).to.be.true;
    });

    it('should always pass when check permission', async () => {
        const req: FakeRequest = new FakeRequest({}, {});

        const res = await systemStatus.permission(req as any);

        expect(res).to.be.true;
    });

    it('should response system status', async () => {
        const req: FakeRequest = new FakeRequest({}, {});
        let res: FakeResponse = new FakeResponse();

        res = await systemStatus.function(req as any, res as any) as any;

        expect(res.statusCode).to.be.equal(200);
        expect(res.resBody).to.be.deep.equal({
            env: 'test',
            function: {
                status: 'OK',
                version: Config.function.version
            },
            supportVersion: Config.app.support_version
        });
    });
});