import * as path from "path";
import { onRequest } from "firebase-functions/v2/https";

import Config from "./share/config/Config";
import { setupLocalInjector } from "./utility/SetupLocalInjector";
import ApiLazyLoader, { setLibPath } from "./share/utility/ApiLazyLoader";

setLibPath(path.join(path.resolve(), "/lib/src/"))
setupLocalInjector();

export const user = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/UserApi'));

export const auth = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/AuthApi'));

export const verifysms = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/VerifySmsApi'));