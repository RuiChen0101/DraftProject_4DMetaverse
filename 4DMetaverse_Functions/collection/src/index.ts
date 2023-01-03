import * as path from "path";
import { onRequest } from "firebase-functions/v2/https";

import Config from "./share/config/Config";
import ApiLazyLoader, { setLibPath } from "./share/utility/ApiLazyLoader";

setLibPath(path.join(path.resolve(), "/lib/src/"));

export const shopgroup = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/ShopGroupApi'));

export const shop = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/ShopApi'));

export const shopimage = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/ShopImageApi'));

export const collectionpool = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/CollectionPoolApi'));

export const collection = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/CollectionApi'));

export const saleplan = onRequest({
    region: Config.function.location,
    timeoutSeconds: 15,
    memory: '256MiB'
}, ApiLazyLoader('./api-entries/SalePlanApi'));