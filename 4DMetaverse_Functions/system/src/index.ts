import * as path from "path";
import { onRequest } from "firebase-functions/v2/https";

import Config from "./share/config/Config";
import ApiLazyLoader, { setLibPath } from "./share/utility/ApiLazyLoader";

setLibPath(path.join(path.resolve(), "/lib/src/"))

export const system = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/SystemApi'));

export const query = onRequest({
    region: Config.function.location,
    timeoutSeconds: 60,
    memory: '512MiB'
}, ApiLazyLoader('./api-entries/QueryApi'));

export const directory = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/DirectoryApi'));

export const file = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/FileApi'));