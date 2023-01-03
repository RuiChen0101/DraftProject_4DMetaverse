export { };

declare global {
    namespace Express {
        interface Request {
            cache?: any;
            loaded: { [key: string]: any };
        }
    }
}