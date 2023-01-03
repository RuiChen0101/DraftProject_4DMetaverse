process.env['ENV'] = 'test';
process.env['JWT_SECRET'] = '123456';
process.env['MAIN_DB'] = 'http://127.0.0.1:9999';
process.env['REDIS_DSN'] = 'redis://127.0.0.1:6379';

import injector from '../src/share/utility/Injector';
import FakeIdGenerator from './share/test-tools/fakes/FakeIdGenerator';

import FakeTimer from './share/test-tools/fakes/FakeTimer';
import MockFetch from './share/test-tools/mocks/MockFetch';
import MockRedis from './share/test-tools/mocks/MockRedis';

injector.set('Timer', new FakeTimer());
injector.set('TokenCache', new MockRedis());
injector.set('FetchProxy', new MockFetch());
injector.set('IdGenerator', new FakeIdGenerator());