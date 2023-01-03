export default class FetchTimeoutException extends Error {
    public readonly message: string;

    constructor(message: string = 'timeout') {
        super(message);
        this.message = message;
    }
}