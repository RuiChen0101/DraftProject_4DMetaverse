enum EAuthLevel {
    None,
    Optional,
    Require
}

export { EAuthLevel };
export interface ApiSetting {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    header?: { [key: string]: any };
    body?: string | FormData;
    auth?: EAuthLevel;
    json?: boolean;
}