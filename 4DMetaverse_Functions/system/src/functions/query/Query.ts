import * as express from 'express';

import IFunction from '../../share/functions/IFunction';
import { QueryAndWrap } from '../../database/QueryEntries';
import QueryJsonStringify from '../../utility/QueryJsonStringify';
import RequestValidator from '../../share/utility/RequestValidator';
import { checkQueryPermission } from '../../permission/QueryPermission';

/**
 * @api {POST} /query Query
 * @apiGroup Query
 * 
 * @apiDescription perform query and wrap with entity
 * 
 * @apiPermission base on query table
 * 
 * @apiHeader {string} [Authorization]
 * @apiHeader {string} Content-Type application/json
 * 
 * @apiParam {string} query equivalent COUNT a
 * @apiParam {string[]} [with] equivalent WITH b
 * @apiParam {json[]} [link] equivalent WHERE a.a1 = b.b1
 * @apiParam {json[]} [where] equivalent WHERE b.b2="b", b.b3 IS NULL, b.b4 IN (1,2,3)...
 * @apiParam {json[]} [orderBy] equivalent ORDER BY a.a1 ASE/DESC
 * @apiParam {number[]} [limit] equivalent LIMIT limit[0], limit[1]
 * 
 * @apiSuccess {number} totalCount total db record the this condition ignore limit
 * @apiSuccess {number} queryRows total record queried this time
 * @apiSuccess {json[]} data query result
 * @apiError 400 request validate fail
 * @apiError 403 insufficient permission
 * @apiError 404 no record found
 */
class Query implements IFunction {
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
        const query = stringify.stringifyQuery(req.body);
        if (req.body.limit === undefined) {
            const queryRes = await QueryAndWrap(query);
            if (!queryRes.ok) return res.sendStatus(queryRes.status);
            const result: any[] = await queryRes.json() as any[];
            return res.status(200).json({
                queryCount: result.length,
                totalCount: result.length,
                data: result,
            });
        } else {
            const count = stringify.stringifyCount(req.body);
            const queryRes = await Promise.all([
                QueryAndWrap(query),
                QueryAndWrap(count),
            ]);
            if (!queryRes[0].ok) return res.sendStatus(queryRes[0].status);
            const queryResult: any[] = await queryRes[0].json() as any[];
            const countResult: any[] = await queryRes[1].json() as any[];
            return res.status(200).json({
                queryCount: queryResult.length,
                totalCount: countResult[0].count,
                data: queryResult,
            });
        }
    }
}

export default Query;