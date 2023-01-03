import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { QueryAndWrap } from '../../database/QueryEntries';
import QueryJsonStringify from '../../utility/QueryJsonStringify';
import RequestValidator from '../../share/utility/RequestValidator';
import { checkQueryPermission } from '../../permission/QueryPermission';

/**
 * @api {POST} /query/sum Sum Query
 * @apiGroup Query
 * 
 * @apiDescription perform sum query
 * 
 * @apiPermission base on query table
 * 
 * @apiHeader {string} [Authorization]
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} query equivalent COUNT a.a
 * @apiParam {string[]} [with] equivalent WITH b
 * @apiParam {json[]} [link] equivalent WHERE a.a1 = b.b1
 * @apiParam {json[]} [where] equivalent WHERE b.b2="b", b.b3 IS NULL, b.b4 IN (1,2,3)...
 * @apiParam {json[]} [orderBy] compatibility concern, will be ignored
 * @apiParam {number[]} [limit] compatibility concern, will be ignored
 * 
 * @apiSuccess {number} sum summing result 
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 * @apiError 404 no record found
 */
class QuerySum implements IFunction {
    async preRequirement(req: express.Request): Promise<boolean> {
        return RequestValidator({
            require: ['query'],
            option: ['with', 'link', 'where', 'orderBy', 'limit']
        }, req);
    }

    async permission(req: express.Request): Promise<boolean> {
        return await checkQueryPermission(req.body, req.loaded.auth);
    }

    async function(req: express.Request, res: express.Response): Promise<express.Response<any>> {
        const stringify = new QueryJsonStringify();
        const sum = stringify.stringifySum(req.body);
        const queryRes = await QueryAndWrap(sum);
        if (!queryRes.ok) return res.sendStatus(queryRes.status);
        return res.status(200).json((await queryRes.json() as any)[0]);
    }
}

export default QuerySum;