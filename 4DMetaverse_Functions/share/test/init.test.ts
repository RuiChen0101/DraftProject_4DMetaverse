process.env['ENV'] = 'test';
process.env['JWT_SECRET'] = '123456';
process.env['USER_DB'] = 'http://127.0.0.1:9998';
process.env['REDIS_DSN'] = 'redis://127.0.0.1:6379';

import { mock, instance } from 'ts-mockito';

import injector from '../src/utility/Injector';
import FakeTimer from './test-tools/fakes/FakeTimer';
import FakeIdGenerator from './test-tools/fakes/FakeIdGenerator';

import MockFetch from './test-tools/mocks/MockFetch';
import MockRedis from './test-tools/mocks/MockRedis';
import TokenManager from '../src/utility/TokenManager';

const mockTokenManager: TokenManager = mock(TokenManager);
injector.set('MockTokenManager', mockTokenManager);
injector.set('TokenManager', instance(mockTokenManager));

injector.set('Timer', new FakeTimer());
injector.set('TokenCache', new MockRedis());
injector.set('FetchProxy', new MockFetch());
injector.set('IdGenerator', new FakeIdGenerator());
