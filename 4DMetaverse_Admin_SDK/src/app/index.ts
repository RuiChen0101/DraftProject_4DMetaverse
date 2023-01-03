import { App } from './app';
import { AppConfig } from './app-config';
import AdminSDKException from '../exception/admin-sdk-exception';

let app: App | undefined = undefined;

export const initializeApp = async (config: AppConfig): Promise<App> => {
    app = new App(config)
    return app
}

export const getApp = (): App => {
    if (app === undefined) throw new AdminSDKException('No initialized app.');
    return app
}

export { ApiSetting, EAuthLevel } from './api-settings';
export { App, AppConfig };