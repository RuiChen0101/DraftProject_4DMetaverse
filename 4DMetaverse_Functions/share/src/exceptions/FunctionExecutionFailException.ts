export default class FunctionExecutionFailException extends Error {
    public readonly message: string;
    public readonly code: number;

    constructor(code: number = 500, message: string = 'execute error') {
        super(`${message}: ${code}`);
        this.code = code;
        this.message = `${message}: ${code}`;
    }
}