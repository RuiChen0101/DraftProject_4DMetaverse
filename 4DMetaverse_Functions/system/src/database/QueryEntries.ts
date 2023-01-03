import { Base64 } from 'js-base64';

import injector from '../share/utility/Injector';
import FetchProxy, { Response } from '../share/utility/FetchProxy';

export const QueryAndWrap = (unifyQL: string): Promise<Response> => {
    return injector.get<FetchProxy>('FetchProxy').fetch(`${process.env.QUERY_SERVICE}/query`, {
        method: 'POST',
        body: Base64.encode(unifyQL),
    });
}