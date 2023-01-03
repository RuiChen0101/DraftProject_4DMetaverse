export interface ApiRequest {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    header?: { [key: string]: any };
    body?: string | FormData;
}

export const resolveApi = async (request: ApiRequest): Promise<Response> => {
    return fetch(request.url, {
        method: request.method,
        headers: request.header,
        body: request.body,
    });
}