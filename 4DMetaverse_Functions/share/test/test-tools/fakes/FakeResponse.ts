import { Writable } from 'stream';

class FakeResponse extends Writable {
    public statusCode: number | undefined;
    public header: { [id: string]: any } = {};
    public type?: string;
    public resBody: any;

    status(code: number): FakeResponse {
        this.statusCode = code;
        return this;
    }

    setHeader(name: string, value: string): FakeResponse {
        this.header[name] = value;
        return this;
    }

    send(data: any): FakeResponse {
        this.resBody = data;
        return this;
    }

    sendStatus(statusCode: number): FakeResponse {
        this.statusCode = statusCode;
        return this;
    }

    json(data: any): FakeResponse {
        this.resBody = data;
        return this;
    }

    contentType(type: string): FakeResponse {
        this.type = type;
        return this;
    }

    _write(chunk: any, encoding: string, next: (error?: Error) => void) { }
}

export default FakeResponse;