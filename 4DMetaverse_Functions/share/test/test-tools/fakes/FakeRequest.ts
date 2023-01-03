class FakeRequest {
    public body: {} = {};
    public query: {} = {};
    public loaded: { [key: string]: any } = {};
    public params: {} = {};
    public path: string = '';
    public method: string = 'GET';
    private header: { [key: string]: any } = {};

    constructor(header: { [key: string]: any }, body: {}) {
        this.header = header;
        this.body = body;
    }

    get(name: string): any {
        return this.header[name];
    }
}
export default FakeRequest;
