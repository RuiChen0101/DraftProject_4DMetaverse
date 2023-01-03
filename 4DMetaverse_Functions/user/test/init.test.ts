process.env['ENV'] = 'test';
process.env['JWT_SECRET'] = '123456';
process.env['USER_DB'] = 'http://127.0.0.1:9998';
process.env['REDIS_DSN'] = 'redis://127.0.0.1:6379';

import { mock, instance } from 'ts-mockito';
import VerifySmsService from '../src/service/VerifySmsService';

import injector from '../src/share/utility/Injector';
import TokenManager from '../src/share/utility/TokenManager';
import FakeIdGenerator from './share/test-tools/fakes/FakeIdGenerator';

import FakeTimer from './share/test-tools/fakes/FakeTimer';
import MockFetch from './share/test-tools/mocks/MockFetch';
import MockRedis from './share/test-tools/mocks/MockRedis';


const mockTokenManager: TokenManager = mock(TokenManager);
injector.set('MockTokenManager', mockTokenManager);
injector.set('TokenManager', instance(mockTokenManager));

const mockVerifySmsService: VerifySmsService = mock(VerifySmsService);
injector.set('MockVerifySmsService', mockVerifySmsService);
injector.set('VerifySmsService', instance(mockVerifySmsService));

injector.set('Timer', new FakeTimer());
injector.set('TokenCache', new MockRedis());
injector.set('FetchProxy', new MockFetch());
injector.set('IdGenerator', new FakeIdGenerator());