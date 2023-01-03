import 'mocha';
import { expect } from 'chai';

import RequestValidator, { FieldValidator, ProtectedFieldValidator, HeaderValidator, UrlQueryValidator } from '../../src/utility/RequestValidator';

import FakeRequest from '../test-tools/fakes/FakeRequest';

describe('RequestValidator', () => {
    it('should return true when require field match', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3
        }
        const req: FakeRequest = new FakeRequest({}, body);

        expect(RequestValidator({
            require: ['field1', 'field2', 'field3']
        }, req as any)).to.be.true;
    });

    it('should return false when require field mismatch', () => {
        const body = {
            field1: 1,
            field2: 2
        }
        const req: FakeRequest = new FakeRequest({}, body);

        expect(RequestValidator({
            require: ['field1', 'field2', 'field3']
        }, req as any)).to.be.false;
    });

    it('should return false when require field mismatch', () => {
        const body = {
            field1: 1,
            field2: 2
        }
        const req: FakeRequest = new FakeRequest({}, body);

        expect(RequestValidator({
            require: ['field1', 'field2', 'field3']
        }, req as any)).to.be.false;
    });

    it('should return false when require body have extra field', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3,
            field4: 4
        }
        const req: FakeRequest = new FakeRequest({}, body);

        expect(RequestValidator({
            require: ['field1', 'field2', 'field3']
        }, req as any)).to.be.false;
    });

    it('should return true when pure option field match', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3
        }
        const req: FakeRequest = new FakeRequest({}, body);

        expect(RequestValidator({
            option: ['field1', 'field2', 'field3']
        }, req as any)).to.be.true;
    });

    it('should return true when pure option field missing', () => {
        const body = {
            field1: 1,
            field2: 2
        }
        const req: FakeRequest = new FakeRequest({}, body);

        expect(RequestValidator({
            option: ['field1', 'field2', 'field3']
        }, req as any)).to.be.true;
    });

    it('should return false when pure option body have extra field', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3,
            field4: 4
        }
        const req: FakeRequest = new FakeRequest({}, body);

        expect(RequestValidator({
            option: ['field1', 'field2', 'field3']
        }, req as any)).to.be.false;
    });

    it('should return true when require and option field match', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3,
            field4: 4
        }
        const req: FakeRequest = new FakeRequest({}, body);

        expect(RequestValidator({
            require: ['field1', 'field2', 'field3'],
            option: ['field4']
        }, req as any)).to.be.true;
    });

    it('should return true when option field missing', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3
        }
        const req: FakeRequest = new FakeRequest({}, body);

        expect(RequestValidator({
            require: ['field1', 'field2', 'field3'],
            option: ['field4']
        }, req as any)).to.be.true;
    });

    it('should return false when require and option body have extra field', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3,
            field4: 4,
            field5: 5
        }
        const req: FakeRequest = new FakeRequest({}, body);

        expect(RequestValidator({
            require: ['field1', 'field2', 'field3'],
            option: ['field4']
        }, req as any)).to.be.false;
    });

    it('should return true when query match', () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            query1: 1
        }

        expect(RequestValidator({
            query: ['query1']
        }, req as any)).to.be.true;
    });

    it('should return false when query missing', () => {
        const req: FakeRequest = new FakeRequest({}, {});

        expect(RequestValidator({
            query: ['query1']
        }, req as any)).to.be.false;
    });

    it('should return true when header match', () => {
        const header = {
            head1: 1
        }

        const req: FakeRequest = new FakeRequest(header, {});

        expect(RequestValidator({
            header: ['head1']
        }, req as any)).to.be.true;
    });

    it('should return true when header missing', () => {
        const req: FakeRequest = new FakeRequest({}, {});
        expect(RequestValidator({
            header: ['head1']
        }, req as any)).to.be.false;
    });

    it('should return true when field match', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3
        }
        const req: FakeRequest = new FakeRequest({}, body);

        const requireField = ['field1', 'field2', 'field3'];

        expect(FieldValidator(requireField, req as any)).to.be.true;
    });

    it('should return false when body have extra field', () => {
        const body = {
            field2: 2,
            field3: 3
        }
        const req: FakeRequest = new FakeRequest({}, body);

        const requireField = ['field1', 'field2', 'field3'];

        expect(FieldValidator(requireField, req as any)).to.be.false;
    });

    it('should return true when body have extra field', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3,
            field4: 4
        }
        const req: FakeRequest = new FakeRequest({}, body);

        const requireField = ['field1', 'field2', 'field3'];

        expect(FieldValidator(requireField, req as any)).to.be.true;
    });

    it('should return true when not contain any protect field', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3,
            field5: {
                sub1: 'sub1'
            }
        }
        const req: FakeRequest = new FakeRequest({}, body);

        const protectField = ['field4', 'field5.sub2'];

        expect(ProtectedFieldValidator(protectField, req as any)).to.be.true;
    });

    it('should return false when contain any protect field', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3,
            field4: 4
        }
        const req: FakeRequest = new FakeRequest({}, body);

        const protectField = ['field4'];

        expect(ProtectedFieldValidator(protectField, req as any)).to.be.false;
    });

    it('should return false when contain any nest protect field', () => {
        const body = {
            field1: 1,
            field2: 2,
            field3: 3,
            field4: 4,
            field5: {
                sub1: 'sub1',
                sub2: 'sub2'
            }
        }
        const req: FakeRequest = new FakeRequest({}, body);

        const protectField = ['field5.sub2'];

        expect(ProtectedFieldValidator(protectField, req as any)).to.be.false;
    });

    it('should return true when header match', () => {
        const header = {
            head1: 1,
            head2: 2
        }
        const req: FakeRequest = new FakeRequest(header, {});

        const requireHeader = ['head1', 'head2'];

        expect(HeaderValidator(requireHeader, req as any)).to.be.true;
    });

    it('should return false when missing header', () => {
        const header = {
            head2: 2
        }

        const req: FakeRequest = new FakeRequest(header, {});

        const requireHeader = ['head1', 'head2'];

        expect(HeaderValidator(requireHeader, req as any)).to.be.false;
    });

    it('should return true when header have extra field', () => {
        const header = {
            head1: 1,
            head2: 2,
            head3: 3
        }
        const req: FakeRequest = new FakeRequest(header, {});

        const requireHeader = ['head1', 'head2'];

        expect(HeaderValidator(requireHeader, req as any)).to.be.true;
    });

    it('should return true when field match', () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            query1: 1,
            query2: 2
        }

        const requireQuery = ['query1', 'query2'];

        expect(UrlQueryValidator(requireQuery, req as any)).to.be.true;
    });

    it('should return false when missing field', () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            query1: 1
        }

        const requireQuery = ['query1', 'query2'];

        expect(UrlQueryValidator(requireQuery, req as any)).to.be.false;
    });

    it('should return true when body have extra field', () => {
        const req: FakeRequest = new FakeRequest({}, {});
        req.query = {
            query1: 1,
            query2: 2,
            query3: 3
        }

        const requireQuery = ['query1', 'query2'];

        expect(UrlQueryValidator(requireQuery, req as any)).to.be.true;
    });
});
