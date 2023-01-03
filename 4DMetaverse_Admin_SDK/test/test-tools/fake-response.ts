export class FakeResponse {
    public status: number;
    public ok: boolean;
    private resBody: string;
    constructor(resCode: number, resBody: string) {
        this.resBody = resBody;
        this.status = resCode;
        this.ok = resCode >= 200 && resCode < 300;
    }

    async json(): Promise<any> {
        return JSON.parse(this.resBody);
    }

    async text(): Promise<any> {
        return this.resBody;
    }
}