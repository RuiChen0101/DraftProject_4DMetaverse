import { App } from '../../src/app';
import { mock, instance } from 'ts-mockito';

const mockAppCtrl: App = mock(App);
const mockApp: App = instance(mockAppCtrl);

export { mockAppCtrl, mockApp };
