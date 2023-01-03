import 'mocha';
import { expect } from 'chai';

import QueryJsonStringify from '../../src/utility/QueryJsonStringify';

const queryJsonStringify = new QueryJsonStringify();

describe('QueryJsonStringify', () => {
    it('should parse QueryJson to UnifyQL query string', () => {
        const queryStr = queryJsonStringify.stringifyQuery({
            query: 'user',
            with: ['login_device'],
            link: [{
                left: 'user.id',
                right: 'login_device.user_id'
            }],
            where: [{
                left: 'login_device.os_version',
                op: '=',
                right: 'IOS 15.5'
            }],
            orderBy: [{
                column: 'user.create_at',
                direction: 'desc'
            }],
            limit: [0, 10]
        });

        expect(queryStr).to.be.equal('QUERY user WITH login_device LINK user.id=login_device.user_id WHERE login_device.os_version = "IOS 15.5" ORDER BY user.create_at desc LIMIT 0, 10');
    });

    it('should parse with IN op', () => {
        const queryStr = queryJsonStringify.stringifyQuery({
            query: 'user',
            where: [{
                left: 'user.role',
                op: 'IN',
                right: [1, 90]
            }],
        });

        expect(queryStr).to.be.equal('QUERY user WHERE user.role IN (1,90)');
    });

    it('should parse QueryJson to UnifyQL count query string', () => {
        const queryStr = queryJsonStringify.stringifyCount({
            query: 'user',
            with: ['login_device'],
            link: [{
                left: 'user.id',
                right: 'login_device.user_id'
            }],
            where: [{
                left: 'login_device.os_version',
                op: '=',
                right: 'IOS 15.5'
            }]
        });

        expect(queryStr).to.be.equal('COUNT user WITH login_device LINK user.id=login_device.user_id WHERE login_device.os_version = "IOS 15.5"');
    });

    it('should parse QueryJson to UnifyQL sum query string', () => {
        const queryStr = queryJsonStringify.stringifySum({
            query: 'payment.amount',
            with: ['user'],
            link: [{
                left: 'user.id',
                right: 'payment.user_id'
            }],
            where: [{
                left: 'user.email',
                op: '=',
                right: 'test@email.com'
            }]
        });

        expect(queryStr).to.be.equal('SUM payment.amount WITH user LINK user.id=payment.user_id WHERE user.email = "test@email.com"');
    });
});