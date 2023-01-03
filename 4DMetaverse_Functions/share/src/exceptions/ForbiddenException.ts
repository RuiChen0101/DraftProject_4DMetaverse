export default class ForbiddenException extends Error {
    public readonly message: string;

    constructor(message: string = 'Forbidden operation') {
        super(message);
        this.message = message;
    }
}