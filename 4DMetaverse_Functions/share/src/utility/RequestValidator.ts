import { Request } from 'express';
import { logger } from 'firebase-functions';

// request validator option interface
interface IRequestValidatorOption {
    require?: string[],
    option?: string[],
    query?: string[],
    header?: string[]
}

// request body validate
export const FieldValidator = (reqField: string[], req: Request): boolean => {
    const miss: string[] = [];
    for (const field of reqField) {
        if (!(field in req.body)) {
            miss.push(field);
        }
    }
    if (miss.length !== 0) {
        logger.warn(`Field validate error: field "${miss}" not found`);
        return false;
    }
    return true;
}

// protected request body field validate
export const ProtectedFieldValidator = (protectField: string[], req: Request): boolean => {
    const protect: string[] = [];
    for (const field of protectField) {
        let body = { ...req.body };
        let exist = true;
        const paths = field.split('.');
        for (const path of paths) {
            if (path in body) {
                body = body[path];
                continue;
            }
            exist = false;
            break;
        }
        if (exist) {
            protect.push(field);
        }
    }
    if (protect.length !== 0) {
        logger.warn(`Protect validate error: cannot have field "${protect}"`);
        return false;
    }
    return true;
}

// request header validate
export const HeaderValidator = (reqHeader: string[], req: Request): boolean => {
    const miss: string[] = [];
    for (const header of reqHeader) {
        if (req.get(header) === undefined) {
            miss.push(header);
        }
    }
    if (miss.length !== 0) {
        logger.warn(`Header validate error: header "${miss}" not found`);
        return false;
    }
    return true;
}

// request query url validate
export const UrlQueryValidator = (reqQuery: string[], req: Request): boolean => {
    const miss: string[] = [];
    for (const query of reqQuery) {
        if (req.query[query] === undefined) {
            miss.push(query);
        }
    }
    if (miss.length !== 0) {
        logger.warn(`Url query validate error: query "${miss}" not found`);
        return false;
    }
    return true;
}

// request validate, all body field should be present in require or option field in IRequestValidatorOption
export default (options: IRequestValidatorOption, req: Request): boolean => {
    if (options.require !== undefined && !FieldValidator(options.require, req)) {
        return false;
    }

    let field: string[] = [];
    if (options.require !== undefined) {
        field = options.require;
    }
    if (options.option !== undefined) {
        field = [...field, ...options.option];
    }
    for (const key of Object.keys(req.body)) {
        if (!(field.includes(key))) {
            logger.warn(`Field validate error: cannot have field "${key}"`);
            return false;
        }
    }

    if (options.query !== undefined && !UrlQueryValidator(options.query, req)) {
        return false;
    }

    if (options.header !== undefined && !HeaderValidator(options.header, req)) {
        return false;
    }
    return true;
}