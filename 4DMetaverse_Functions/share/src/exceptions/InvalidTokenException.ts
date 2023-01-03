export default class InvalidTokenException extends Error {
    public readonly message: string;

    constructor(message: string = 'Invalid token') {
        super(message);
        this.message = message;
    }
}