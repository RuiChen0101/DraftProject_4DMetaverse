import http from 'http';
import https from 'https';
import { logger } from 'firebase-functions';
import { AbortController } from 'abort-controller';
import fetch, { RequestInit, Response } from 'node-fetch';
import FetchTimeoutException from '../exceptions/FetchTimeoutException';

const httpAgent = new http.Agent({
    keepAlive: true
});
const httpsAgent = new https.Agent({
    keepAlive: true
});

// proxy to preform fetch http request for easier log
class FetchProxy {
    public async fetch(url: string, option: RequestInit | undefined = undefined, timeout: number = 5000): Promise<Response> {
        const controller = new AbortController();
        const reqOption: RequestInit = { ...option };
        reqOption.signal = controller.signal;
        const timeoutTimer = setTimeout(() => {
            controller.abort();
        }, timeout);
        try {
            const res: Response = await fetch(url, {
                ...option,
                agent: function (_parsedURL) {
                    if (_parsedURL.protocol === 'http:') {
                        return httpAgent;
                    } else {
                        return httpsAgent;
                    }
                }
            });
            if (res.ok) {
                logger.log(`${option?.method ?? 'GET'} ${url} ${res.status}`, { headers: option?.headers, req: option?.body });
            } else {
                const body = await res.clone().text();
                logger.error(`${option?.method ?? 'GET'} ${url} ${res.status}`, { headers: option?.headers, req: option?.body, res: body });
            }
            return res;
        } catch (err: any) {
            logger.error(`${option?.method ?? 'GET'} ${url} TIMEOUT`, { headers: option?.headers, req: option?.body });
            throw new FetchTimeoutException();
        } finally {
            clearTimeout(timeoutTimer);
        }
    }
}

export default FetchProxy;
export { Response };